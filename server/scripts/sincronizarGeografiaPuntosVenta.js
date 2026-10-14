/** Para programadores de tareas / serverless: ejecuta UNA pasada y termina. */
import dotenv from "dotenv";
import pg from "pg";
import { fileURLToPath } from "node:url";
import { syncStoreGeographyOnce } from "../services/storeGeographyAutoSync.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });
if (!process.env.DATABASE_URL) {
    console.error("Falta DATABASE_URL");
    process.exitCode = 1;
} else {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });
    try {
        const result = await syncStoreGeographyOnce({ pool });
        console.log("Resultado de geografía:", result);
        if (result.failed > 0) process.exitCode = 1;
    } catch (error) {
        console.error("Fallo en sincronización de puntos de venta:", error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}
