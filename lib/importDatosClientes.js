// importDatosClientes.js
import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Pool } = pg;

// Asegúrate de que las instrucciones SQL están dentro de funciones y son ejecutadas usando el cliente pg
const pool = new Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT || 5432,
    ssl: { rejectUnauthorized: false }
});


const importDataClientes = async () => {
    const client = await pool.connect();

    try {
        // Asegúrate de que el archivo 'archivo2.json' se encuentre en el mismo directorio que este script
        const dataText = await fs.readFile(path.join(__dirname, '../lib/api/archivo2.json'), 'utf-8');
        const data = JSON.parse(dataText);

        for (const item of data) {
            const query = `
                INSERT INTO clientes (
                    Marcar, CodClien, RazClien, NIF, CP, Direccion, Localidad, CodPais, Tlfno,
                    CodGesti, CodTarifa, CodForPago, ImpPedValorados, ImpAlbValorados, Email,
                    CodRepre, Comision, NRB, Asegurado, IDCP, CodRiesgo, ImpRiesgo, Portes,
                    tipPortes, DadoBaja, CodCtaContab, CodIva, ForEnvio, ComManual, Bloqueado,
                    FecAlta, PermitirAlbSinPedido, ReqConfirParTrabajo, CodTipPersona, ImpPreNetos,
                    TrabajaConRE, CodProvi, ExcluirBloqDocCobrosVencidosPendientes
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                    $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
                    $31, $32, $33, $34, $35, $36, $37, $38
                )`;
            const params = [
                item.Marcar, item.CodClien, item.RazClien, item.NIF, item.CP, item.Direccion, item.Localidad, item.CodPais, item.Tlfno,
                item.CodGesti, item.CodTarifa, item.CodForPago, item.ImpPedValorados, item.ImpAlbValorados, item.Email,
                item.CodRepre, item.Comision, item.NRB, item.Asegurado, item.IDCP, item.CodRiesgo, item.ImpRiesgo, item.Portes,
                item.tipPortes, item.DadoBaja, item.CodCtaContab, item.CodIva, item.ForEnvio, item.ComManual, item.Bloqueado,
                item.FecAlta, item.PermitirAlbSinPedido, item.ReqConfirParTrabajo, item.CodTipPersona, item.ImpPreNetos,
                item.TrabajaConRE, item.CodProvi, item.ExcluirBloqDocCobrosVencidosPendientes
            ];
            await client.query(query, params);
        }

        console.log('Todos los datos de clientes han sido importados exitosamente.');
    } catch (error) {
        console.error('Error durante la importación de datos de clientes:', error);
    } finally {
        client.release();
    }
};

importDataClientes();