import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Convirtiendo __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
    host: "PGHOST",
    database: "PGDATABASE",
    username: "PGUSER",
    password: "PGPASSWORD",
    port: 5432,
});

const importData = async () => {
    const client = await pool.connect();

    try {
        // Asegúrate de que el archivo 'archivo.json' se encuentre en la carpeta 'server'
        const dataText = await fs.readFile(path.join(__dirname, 'archivo.json'), 'utf-8');
        const data = JSON.parse(dataText);

        for (const item of data) {
            await client.query(`
                INSERT INTO nombre_de_tu_tabla (
                    Marcar, CodProdu, DesProdu, CodFamil, CodMarca, FecAlta, StockSN, PreCosto,
                    UltCodProve, UltFecCompra, UltPreCompra, UltCodClien, UltFecVenta, UltPreVenta,
                    CodCtaContabCompra, CodCtaContabVenta, NRB, PUFC, PUFV, PMC, PMV, Operador,
                    TraLotes, BloqEdicPreVentas, TipNumSerie, UltPreCompraNeto, UltPreVentaNeto,
                    PUFCNeto, PUFVNeto, ReqTarCompra, PMCImput
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31
                )`, [
                item.Marcar, item.CodProdu, item.DesProdu, item.CodFamil, item.CodMarca, item.FecAlta, item.StockSN, item.PreCosto,
                item.UltCodProve, item.UltFecCompra, item.UltPreCompra, item.UltCodClien, item.UltFecVenta, item.UltPreVenta,
                item.CodCtaContabCompra, item.CodCtaContabVenta, item.NRB, item.PUFC, item.PUFV, item.PMC, item.PMV, item.Operador,
                item.TraLotes, item.BloqEdicPreVentas, item.TipNumSerie, item.UltPreCompraNeto, item.UltPreVentaNeto,
                item.PUFCNeto, item.PUFVNeto, item.ReqTarCompra, item.PMCImput
            ]);
        }
        console.log('Todos los datos han sido importados exitosamente.');
    } catch (error) {
        console.error('Error durante la importación de datos:', error);
    } finally {
        client.release();
    }
};

importData();
