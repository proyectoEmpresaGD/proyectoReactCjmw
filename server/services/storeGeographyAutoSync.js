/**
 * Sincronizador automático de geografía para puntos de venta.
 * - Lee directamente PostgreSQL: funciona aunque las altas se hagan por SQL.
 * - Resuelve puntos nuevos y cambios de coordenadas; limpia los eliminados.
 * - Usa los registros conocidos y las columnas nativas antes de pedir a HeiGIT.
 * - Persiste fallos/reintentos; limita solicitudes y concurrencia entre instancias.
 *
 * El proceso periódico necesita un Node.js siempre activo. En serverless usar
 * el comando geo:sync-once desde un programador externo; no usar setInterval.
 */
import pg from "pg";
import { readFile } from "node:fs/promises";
import { getKnownStoreGeography } from "../data/knownStoreGeography.js";
import { canonicalGeography } from "./canonicalGeography.js";
import { reverseGeocodeStore } from "./storeReverseGeocode.js";

const LOCK_ID = 86420941;
const DEFAULT_INTERVAL_MS = 60_000;
const DEFAULT_GEO_DELAY_MS = 1_500;
const DEFAULT_BATCH_SIZE = 12;

function boundedInt(value, fallback, min, max) {
    const number = Number(value);
    return Number.isSafeInteger(number) ? Math.min(max, Math.max(min, number)) : fallback;
}
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export function retryDelayMs(attempts, status) {
    if (status === 401 || status === 403) return 24 * 60 * 60_000;
    if (status === 429) return Math.max(60 * 60_000, Math.min(24 * 60 * 60_000, 15 * 60_000 * 2 ** Math.min(attempts - 1, 7)));
    return Math.min(24 * 60 * 60_000, 10 * 60_000 * 2 ** Math.min(Math.max(0, attempts - 1), 8));
}

// Se consulta to_jsonb(p) para no exigir columnas que no existen en puntos_venta.
function jsonText(keys) {
    return `COALESCE(${keys.map((key) =>
        `NULLIF(NULLIF(BTRIM(to_jsonb(p)->>'${key}'), ''), 'NULL')`
    ).join(", ")})`;
}
const nativeCountry = jsonText(["pais", "paispunto", "pais_punto", "nompais", "nombrepais", "country", "country_name"]);
const nativeProvince = jsonText(["provincia", "provinciapunto", "provincia_punto", "nomprovincia", "nombreprovincia", "province", "county", "region"]);

export const SQL_PENDING_GEO = `
    SELECT p.codpunto::TEXT AS id,
           p.nombrepunto AS nombre,
           p.coordenadasy::DOUBLE PRECISION AS lat,
           p.coordenadasx::DOUBLE PRECISION AS lng,
           ${nativeCountry} AS pais_nativo,
           ${nativeProvince} AS provincia_nativa,
           r.intentos AS intentos_previos,
           r.lat AS lat_previa,
           r.lng AS lng_previa
    FROM public.puntos_venta p
    LEFT JOIN public.puntos_venta_geografia g
        ON g.codpunto = p.codpunto::TEXT
        AND g.lat = p.coordenadasy::DOUBLE PRECISION
        AND g.lng = p.coordenadasx::DOUBLE PRECISION
    LEFT JOIN public.puntos_venta_geografia_reintentos r
        ON r.codpunto = p.codpunto::TEXT
    WHERE p.coordenadasx BETWEEN -180 AND 180
        AND p.coordenadasy BETWEEN -90 AND 90
        AND NOT (p.coordenadasx = 0 AND p.coordenadasy = 0)
        AND (g.codpunto IS NULL OR g.pais IS NULL OR NULLIF(BTRIM(g.provincia), '') IS NULL)
        AND (
            r.codpunto IS NULL
            OR r.lat IS DISTINCT FROM p.coordenadasy::DOUBLE PRECISION
            OR r.lng IS DISTINCT FROM p.coordenadasx::DOUBLE PRECISION
            OR r.proximo_intento <= NOW()
        )
    ORDER BY p.codpunto ASC
    LIMIT $1
`;

const SQL_UPSERT_GEO = `
    INSERT INTO public.puntos_venta_geografia
        (codpunto, lat, lng, pais, provincia, actualizado_en)
    VALUES ($1, $2, $3, $4, $5, NOW())
    ON CONFLICT (codpunto) DO UPDATE SET
        lat = EXCLUDED.lat, lng = EXCLUDED.lng,
        pais = EXCLUDED.pais, provincia = EXCLUDED.provincia,
        actualizado_en = NOW()
`;
const SQL_RECORD_RETRY = `
    INSERT INTO public.puntos_venta_geografia_reintentos
        (codpunto, lat, lng, intentos, proximo_intento, ultimo_error, actualizado_en)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    ON CONFLICT (codpunto) DO UPDATE SET
        lat = EXCLUDED.lat, lng = EXCLUDED.lng,
        intentos = EXCLUDED.intentos,
        proximo_intento = EXCLUDED.proximo_intento,
        ultimo_error = EXCLUDED.ultimo_error,
        actualizado_en = NOW()
`;

let schemaPrepared = false;
export async function prepareGeoSchema(client) {
    if (schemaPrepared) return;
    for (const name of ["001_puntos_venta_geografia.sql", "003_puntos_venta_geografia_reintentos.sql"]) {
        const content = await readFile(new URL(`../sql/${name}`, import.meta.url), "utf8");
        await client.query(content);
    }
    schemaPrepared = true;
}

export async function classifyStore(store, { apiKey, reverse = reverseGeocodeStore }) {
    const known = getKnownStoreGeography(store.id, store.lat, store.lng);
    if (known) return { ...known, source: "referencia" };
    const native = canonicalGeography({ pais: store.pais_nativo, provincia: store.provincia_nativa });
    if (native.pais && native.provincia) return { ...native, source: "columnas" };

    const response = await reverse({ lat: store.lat, lng: store.lng, apiKey });
    const resolved = canonicalGeography({
        pais: native.pais || response?.pais,
        provincia: native.provincia || response?.provincia,
    });
    if (!resolved.pais || !resolved.provincia) {
        throw new Error("El servicio geográfico no devolvió país y provincia completos");
    }
    return { ...resolved, source: "geocodificacion" };
}

/** Una pasada: máximo batchSize tiendas, bloqueada entre instancias con advisory lock. */
export async function syncStoreGeographyOnce({
    pool, apiKey = process.env.OPENROUTESERVICE_API_KEY,
    reverse = reverseGeocodeStore,
    batchSize = DEFAULT_BATCH_SIZE,
    delayMs = DEFAULT_GEO_DELAY_MS,
    logger = console,
    prepare = prepareGeoSchema,
    now = () => Date.now(),
    pause = sleep,
} = {}) {
    if (!pool) throw new Error("Falta pool de PostgreSQL");
    const client = await pool.connect();
    let locked = false;
    let updated = 0;
    let failed = 0;
    let pendingCount = 0;
    try {
        const lock = await client.query("SELECT pg_try_advisory_lock($1) AS adquirido", [LOCK_ID]);
        locked = lock.rows[0]?.adquirido === true;
        if (!locked) return { skipped: "otra instancia ejecutando sincronización", updated, failed };

        await prepare(client);

        // Limpiar registros borrados, sin coordenadas válidas o trasladados.
        // No se altera la tabla de puntos de venta en ningún caso.
        await client.query(`DELETE FROM public.puntos_venta_geografia g
            WHERE NOT EXISTS (
                SELECT 1 FROM public.puntos_venta p
                WHERE p.codpunto::TEXT = g.codpunto
                  AND p.coordenadasy BETWEEN -90 AND 90
                  AND p.coordenadasx BETWEEN -180 AND 180
                  AND g.lat = p.coordenadasy::DOUBLE PRECISION
                  AND g.lng = p.coordenadasx::DOUBLE PRECISION
            )`);
        await client.query(`DELETE FROM public.puntos_venta_geografia_reintentos r
            WHERE NOT EXISTS (
                SELECT 1 FROM public.puntos_venta p
                WHERE p.codpunto::TEXT = r.codpunto
                  AND p.coordenadasy BETWEEN -90 AND 90
                  AND p.coordenadasx BETWEEN -180 AND 180
            )`);

        // Un error de autenticación/cuota bloquea globalmente el lote hasta
        // que venza el reintento; evita probar cada tienda durante una caída.
        const { rows: blocks } = await client.query(`
            SELECT MAX(proximo_intento) AS bloqueo_hasta
            FROM public.puntos_venta_geografia_reintentos
            WHERE ultimo_error LIKE '[HTTP 429]%'
               OR ultimo_error LIKE '[HTTP 401]%'
               OR ultimo_error LIKE '[HTTP 403]%'
        `);
        if (blocks[0]?.bloqueo_hasta && new Date(blocks[0].bloqueo_hasta).getTime() > now()) {
            return { skipped: `servicio geográfico temporalmente bloqueado hasta ${new Date(blocks[0].bloqueo_hasta).toISOString()}`, updated, failed };
        }

        const { rows } = await client.query(SQL_PENDING_GEO, [boundedInt(batchSize, DEFAULT_BATCH_SIZE, 1, 100)]);
        pendingCount = rows.length;
        let externalCalls = 0;
        for (const row of rows) {
            const store = { ...row, lat: Number(row.lat), lng: Number(row.lng) };
            const sameCoordinates = Number(row.lat_previa) === store.lat && Number(row.lng_previa) === store.lng;
            const previousAttempts = sameCoordinates && row.intentos_previos ? Number(row.intentos_previos) : 0;
            try {
                const known = getKnownStoreGeography(store.id, store.lat, store.lng);
                const native = canonicalGeography({ pais: store.pais_nativo, provincia: store.provincia_nativa });
                const needsExternal = !known && !(native.pais && native.provincia);
                if (needsExternal) {
                    if (externalCalls > 0) await pause(Math.max(1200, delayMs));
                    externalCalls += 1;
                }
                const geo = await classifyStore(store, { apiKey, reverse });
                await client.query(SQL_UPSERT_GEO, [store.id, store.lat, store.lng, geo.pais, geo.provincia]);
                await client.query("DELETE FROM public.puntos_venta_geografia_reintentos WHERE codpunto = $1", [store.id]);
                updated += 1;
                logger.info(`[puntos-venta/geografia] ${store.id}: ${geo.pais} / ${geo.provincia} (${geo.source})`);
            } catch (error) {
                failed += 1;
                const attempt = previousAttempts + 1;
                const delay = retryDelayMs(attempt, error.status);
                const retryAt = new Date(now() + delay);
                const message = `${error.status ? `[HTTP ${error.status}] ` : ''}${String(error.message || error)}`.slice(0, 300);
                await client.query(SQL_RECORD_RETRY, [store.id, store.lat, store.lng, attempt, retryAt, message]);
                logger.warn(`[puntos-venta/geografia] ${store.id} pendiente: ${error.message}; reintento ${retryAt.toISOString()}`);
                // Una cuota agotada afecta a todos: no gastar las demás peticiones.
                if ([401, 403, 429].includes(error.status)) break;
            }
        }
        return { updated, failed, inspected: pendingCount };
    } finally {
        if (locked) {
            try { await client.query("SELECT pg_advisory_unlock($1)", [LOCK_ID]); }
            catch (error) { logger.error("No se pudo liberar el bloqueo geográfico:", error); }
        }
        client.release();
    }
}

export function startStoreGeographyAutoSync({
    env = process.env, logger = console,
    pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    }),
    sync = syncStoreGeographyOnce,
} = {}) {
    const disabled = ["0", "false", "off"].includes(String(env.PUNTOS_VENTA_GEO_AUTOSYNC || "").toLowerCase());
    const serverless = env.VERCEL === "1" || Boolean(env.AWS_LAMBDA_FUNCTION_NAME);
    if (disabled || serverless || !env.DATABASE_URL) {
        if (!disabled) logger.warn("[puntos-venta/geografia] No se inicia el ciclo automático (serverless o DATABASE_URL ausente). Usar tarea programada geo:sync-once.");
        // Pool sin conexiones activas, pero cerrarlo igualmente.
        void pool.end().catch(() => {});
        return { stop() {}, enabled: false };
    }
    const intervalMs = boundedInt(env.PUNTOS_VENTA_GEO_INTERVAL_MS, DEFAULT_INTERVAL_MS, 30_000, 3_600_000);
    const batchSize = boundedInt(env.PUNTOS_VENTA_GEO_BATCH_SIZE, DEFAULT_BATCH_SIZE, 1, 100);
    const delayMs = boundedInt(env.PUNTOS_VENTA_GEO_DELAY_MS, DEFAULT_GEO_DELAY_MS, 1200, 60_000);
    let running = false;
    let stopped = false;
    const tick = async () => {
        if (running || stopped) return;
        running = true;
        try { await sync({ pool, apiKey: env.OPENROUTESERVICE_API_KEY, batchSize, delayMs, logger }); }
        catch (error) { logger.error("[puntos-venta/geografia] Error en sincronización automática:", error); }
        finally { running = false; }
    };
    logger.info(`[puntos-venta/geografia] Sincronización automática habilitada: cada ${Math.round(intervalMs / 1000)} s`);
    void tick();
    const timer = setInterval(() => { void tick(); }, intervalMs);
    timer.unref?.();
    return { enabled: true, stop() { stopped = true; clearInterval(timer); } };
}
