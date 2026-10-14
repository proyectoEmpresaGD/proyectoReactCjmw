/**
 * Localizador CJMW: tiendas con pais/provincia reales.
 * Respeta las columnas que ya existan en puntos_venta y usa la tabla auxiliar
 * puntos_venta_geografia para los registros enriquecidos por coordenadas.
 */
import pg from "pg";
import dotenv from "dotenv";
import { getKnownStoreGeography } from "../../data/knownStoreGeography.js";
import { canonicalGeography } from "../../services/canonicalGeography.js";

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
});

// Campos alternativos: no exigen modificar puntos_venta ni dependen de que
// todas las instalaciones utilicen exactamente el mismo esquema.
// Excluimos codpais/codprovincia porque suelen ser códigos internos y no
// nombres: esos registros se resolverán por coordenadas en la tabla auxiliar.
const COUNTRY_FIELDS = [
    "pais", "paispunto", "pais_punto", "nompais", "nombrepais",
    "country", "country_name",
];
const PROVINCE_FIELDS = [
    "provincia", "provinciapunto", "provincia_punto",
    "nomprovincia", "nombreprovincia", "province", "county",
    "region",
];

export function coalesceJsonFields(jsonExpression, fields) {
    return `COALESCE(${fields.map((name) =>
        `NULLIF(BTRIM(${jsonExpression}->>'${name}'), '')`
    ).join(", ")})`;
}

export class PuntosVentaModel {
    static async getAll() {
        // La web sigue disponible incluso si aún no se ha ejecutado el
        // enriquecimiento geográfico: antes de eso, se leen los campos nativos.
        const { rows: relations } = await pool.query(
            "SELECT to_regclass('public.puntos_venta_geografia') IS NOT NULL AS disponible"
        );
        const hasGeographyCache = relations[0]?.disponible === true;
        const nativeCountry = coalesceJsonFields("to_jsonb(p)", COUNTRY_FIELDS);
        const nativeProvince = coalesceJsonFields("to_jsonb(p)", PROVINCE_FIELDS);
        const country = hasGeographyCache
            ? `COALESCE(${nativeCountry}, g.pais)`
            : nativeCountry;
        const province = hasGeographyCache
            ? `COALESCE(${nativeProvince}, g.provincia)`
            : nativeProvince;
        const join = hasGeographyCache
            ? `LEFT JOIN public.puntos_venta_geografia AS g
                ON g.codpunto = p.codpunto::TEXT
                AND g.lat = p.coordenadasy::DOUBLE PRECISION
                AND g.lng = p.coordenadasx::DOUBLE PRECISION`
            : "";

        const { rows } = await pool.query(`
            SELECT
                p.codpunto AS id,
                p.coordenadasy AS lat,
                p.coordenadasx AS lng,
                p.nombrepunto AS title,
                NULL::TEXT AS description,
                p.direccionpunto AS direccion,
                p.telefonopunto AS telefono,
                p.correopunto AS correo,
                p.marcaspunto AS marcas,
                p.productospunto AS productos,
                p.cp::TEXT AS cp,
                ${country} AS pais,
                ${province} AS provincia,
                p.fecultmod
            FROM puntos_venta AS p
            ${join}
            WHERE p.coordenadasx IS NOT NULL
                AND p.coordenadasy IS NOT NULL
                AND p.coordenadasx BETWEEN -180 AND 180
                AND p.coordenadasy BETWEEN -90 AND 90
            ORDER BY p.nombrepunto ASC
        `);

        return rows.map((row) => {
            const lat = Number(row.lat);
            const lng = Number(row.lng);
            // Para las tiendas conocidas, los datos del listado proporcionado
            // prevalecen frente a respuestas antiguas de geocodificación.
            // Si se modifica la ubicación, la referencia deja de aplicarse.
            const known = getKnownStoreGeography(row.id, lat, lng);
            const geography = canonicalGeography({
                pais: known?.pais || row.pais,
                provincia: known?.provincia || row.provincia,
            });
            return { ...row, lat, lng, ...geography };
        });
    }
}
