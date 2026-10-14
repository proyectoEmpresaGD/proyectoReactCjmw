/**
 * Ejecutar UNA VEZ después de instalar, y repetir cuando se importen tiendas:
 *   cd server
 *   node scripts/enriquecerPuntosVenta.js
 *
 * Si hay muchos registros, puede interrumpirse y ejecutarse de nuevo:
 * salta los puntos ya procesados siempre que las coordenadas no cambien.
 */
import dotenv from "dotenv";
import pg from "pg";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { reverseGeocodeStore } from "../services/storeReverseGeocode.js";

// Debe leer .env del servidor independientemente del directorio actual.
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const apiKey = process.env.OPENROUTESERVICE_API_KEY;
if (!apiKey) {
    console.error("Falta OPENROUTESERVICE_API_KEY en server/.env");
    process.exitCode = 1;
} else if (!process.env.DATABASE_URL) {
    console.error("Falta DATABASE_URL en server/.env");
    process.exitCode = 1;
} else {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
    });
    try {
        const migration = await readFile(
            new URL("../sql/001_puntos_venta_geografia.sql", import.meta.url), "utf8"
        );
        await pool.query(migration);

        // Acepta denominaciones de columnas diversas sin necesitar saber
        // previamente los nombres de país/provincia de la tabla original.
        const rows = (await pool.query(`
            SELECT
                p.codpunto::TEXT AS id,
                p.nombrepunto AS nombre,
                p.coordenadasy::DOUBLE PRECISION AS lat,
                p.coordenadasx::DOUBLE PRECISION AS lng,
                COALESCE(
                    NULLIF(BTRIM(to_jsonb(p)->>'pais'), ''),
                    NULLIF(BTRIM(to_jsonb(p)->>'paispunto'), ''),
                    NULLIF(BTRIM(to_jsonb(p)->>'country'), ''),
                    NULLIF(BTRIM(to_jsonb(p)->>'nombrepais'), '')
                ) AS pais_original,
                COALESCE(
                    NULLIF(BTRIM(to_jsonb(p)->>'provincia'), ''),
                    NULLIF(BTRIM(to_jsonb(p)->>'provinciapunto'), ''),
                    NULLIF(BTRIM(to_jsonb(p)->>'province'), ''),
                    NULLIF(BTRIM(to_jsonb(p)->>'region'), ''),
                    NULLIF(BTRIM(to_jsonb(p)->>'nombreprovincia'), '')
                ) AS provincia_original,
                g.pais AS pais_cache,
                g.provincia AS provincia_cache,
                g.lat AS lat_cache,
                g.lng AS lng_cache
            FROM puntos_venta p
            LEFT JOIN public.puntos_venta_geografia g ON g.codpunto = p.codpunto::TEXT
            WHERE p.coordenadasx BETWEEN -180 AND 180
              AND p.coordenadasy BETWEEN -90 AND 90
              AND p.coordenadasx IS NOT NULL AND p.coordenadasy IS NOT NULL
            ORDER BY p.codpunto
        `)).rows;

        const pending = rows.filter((row) => {
            const completeFromDatabase = row.pais_original && row.provincia_original;
            const cached = row.pais_cache &&
                Number(row.lat_cache) === row.lat && Number(row.lng_cache) === row.lng;
            return !completeFromDatabase && !cached;
        });
        console.log(`Tiendas: ${rows.length}; pendientes de país/provincia: ${pending.length}`);

        // Ritmo deliberadamente conservador para evitar sobrecargar el proveedor.
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const minInterval = Math.max(1200, Number(process.env.PUNTOS_VENTA_GEO_INTERVAL_MS) || 1200);
        let processed = 0;
        let unresolved = 0;
        for (const store of pending) {
            if (processed > 0) await sleep(minInterval);
            let geo;
            try {
                geo = await reverseGeocodeStore({ lat: store.lat, lng: store.lng, apiKey });
            } catch (error) {
                console.error(`Error de geocodificación en punto ${store.id}: ${error.message}`);
                // Sin reintentos automáticos ante cuota agotada o caída del proveedor.
                // Conservar lo procesado, reanudar más adelante.
                if ([429, 401, 403].includes(error.status)) {
                    console.error("Ejecución detenida. Revisa la cuota/clave y vuelve a lanzarla.");
                    process.exitCode = 1;
                    break;
                }
                unresolved += 1;
                continue;
            }
            if (!geo?.pais && !store.pais_original) {
                console.warn(`No se obtuvo país para punto ${store.id}`);
                unresolved += 1;
                continue;
            }
            await pool.query(`
                INSERT INTO public.puntos_venta_geografia
                    (codpunto, lat, lng, pais, provincia, actualizado_en)
                VALUES ($1, $2, $3, $4, $5, NOW())
                ON CONFLICT (codpunto) DO UPDATE SET
                    lat = EXCLUDED.lat,
                    lng = EXCLUDED.lng,
                    pais = EXCLUDED.pais,
                    provincia = EXCLUDED.provincia,
                    actualizado_en = NOW()
            `, [
                store.id, store.lat, store.lng,
                store.pais_original || geo?.pais,
                store.provincia_original || geo?.provincia || null,
            ]);
            processed += 1;
            console.log(`[${processed}/${pending.length}] ${store.nombre}: ${store.pais_original || geo?.pais} / ${store.provincia_original || geo?.provincia || '—'}`);
        }
        console.log(`Finalizado. Actualizados: ${processed}. Sin resolver: ${unresolved}.`);
        console.log("Reinicia el backend o espera a que caduque la cache HTTP antes de comprobar la web.");
    } catch (error) {
        console.error("Error preparando los datos geográficos:", error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}
