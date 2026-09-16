/**
 * PuntosVentaModel
 * ----------------
 * Capa de acceso a datos para la tabla `puntos_venta`.
 */

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,

    ssl:
        process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
});

export class PuntosVentaModel {
    /**
     * Devuelve todos los puntos de venta
     * con coordenadas geográficas válidas.
     */
    static async getAll() {
        const { rows } = await pool.query(`
            SELECT
                codpunto AS id,
                coordenadasy AS lat,
                coordenadasx AS lng,
                nombrepunto AS title,
                NULL::TEXT AS description,
                direccionpunto AS direccion,
                telefonopunto AS telefono,
                correopunto AS correo,
                marcaspunto AS marcas,
                productospunto AS productos,
                cp::TEXT AS cp,
                fecultmod
            FROM puntos_venta
            WHERE
                coordenadasx IS NOT NULL
                AND coordenadasy IS NOT NULL
                AND coordenadasx BETWEEN -180 AND 180
                AND coordenadasy BETWEEN -90 AND 90
            ORDER BY nombrepunto ASC;
        `);

        return rows.map((row) => ({
            ...row,

            lat: Number(row.lat),
            lng: Number(row.lng),
        }));
    }
}