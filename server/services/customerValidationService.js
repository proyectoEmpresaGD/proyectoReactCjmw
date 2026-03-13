export class CustomerValidationService {
    constructor({
        pool,
        tableName = 'clientes',
    }) {
        this.pool = pool;
        this.tableName = tableName;
    }

    async validateCustomerCode({ codclien }) {
        const normalizedCodclien = this.normalizeCustomerCode(codclien);

        if (!normalizedCodclien) {
            return {
                isValid: false,
                reason: 'EMPTY_CUSTOMER_CODE',
            };
        }

        const customer = await this.findCustomerByCode(normalizedCodclien);

        if (!customer) {
            return {
                isValid: false,
                reason: 'CUSTOMER_CODE_NOT_FOUND',
            };
        }

        return {
            isValid: true,
            reason: null,
            customer,
        };
    }

    async findCustomerByCode(codclien) {
        const query = `
      SELECT
        codclien,
        razclien,
        nif,
        direccion,
        localidad,
        cp,
        email,
        tlfno,
        movil
      FROM ${this.tableName}
      WHERE UPPER(TRIM(codclien)) = $1
      LIMIT 1
    `;

        const { rows } = await this.pool.query(query, [codclien]);

        return rows[0] ?? null;
    }

    normalizeCustomerCode(codclien = '') {
        return String(codclien).trim().toUpperCase();
    }
}