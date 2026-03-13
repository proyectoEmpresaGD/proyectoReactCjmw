export class ClientAreaModel {
    constructor(pool) {
        this.pool = pool;
    }

    async getInvoicesByCustomerCode({ codclien, ejercicio }) {
        const params = [codclien];
        let where = 'WHERE codclien = $1';

        if (ejercicio) {
            params.push(Number(ejercicio));
            where += ` AND ejercicio = $${params.length}`;
        }

        const query = `
      SELECT
        ejercicio,
        fecha,
        sfactura,
        codserfacventa,
        nfacventa,
        referencia,
        codforpago,
        impbase,
        impiva,
        imptotal,
        comentario,
        estadoverifactu
      FROM facventa
      ${where}
      ORDER BY fecha DESC, ejercicio DESC, nfacventa DESC
    `;

        const { rows } = await this.pool.query(query, params);
        return rows;
    }
}