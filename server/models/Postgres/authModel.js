const normalizeEmail = (value = '') =>
  String(value).trim().toLowerCase();

const normalizeNif = (value = '') =>
  String(value).trim().toUpperCase().replace(/\s+/g, '').replace(/-/g, '');

const clientIsActiveCondition = `
  COALESCE(NULLIF(UPPER(TRIM(dadobaja)), ''), 'N') NOT IN ('S', '1', 'Y', 'T', 'SI', 'TRUE')
`;

export class AuthModel {
  constructor({ pool }) {
    this.pool = pool;
  }

  async ensureTables() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS customer_accounts (
        id BIGSERIAL PRIMARY KEY,
        nif_login VARCHAR(20) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password_hash TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'customer',
        status VARCHAR(20) NOT NULL DEFAULT 'approved',
        is_active BOOLEAN NOT NULL DEFAULT FALSE,
        email_verified BOOLEAN NOT NULL DEFAULT FALSE,
        email_verification_token TEXT,
        email_verification_sent_at TIMESTAMPTZ,
        email_verified_at TIMESTAMPTZ,
        approved_at TIMESTAMPTZ,
        approved_by VARCHAR(255),
        denied_at TIMESTAMPTZ,
        denied_by VARCHAR(255),
        last_login_at TIMESTAMPTZ NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  async findAccountByEmail(email) {
    const normalizedEmail = normalizeEmail(email);

    const { rows } = await this.pool.query(
      `
        SELECT
          id,
          email,
          nif_login,
          password_hash,
          role,
          status,
          is_active,
          email_verified,
          email_verification_token,
          email_verification_sent_at,
          email_verified_at,
          approved_at,
          approved_by,
          denied_at,
          denied_by,
          last_login_at,
          created_at,
          updated_at
        FROM customer_accounts
        WHERE LOWER(email) = LOWER($1)
        LIMIT 1;
      `,
      [normalizedEmail]
    );

    return rows[0] ?? null;
  }

  async findAccountById(accountId) {
    const { rows } = await this.pool.query(
      `
        SELECT
          id,
          email,
          nif_login,
          role,
          status,
          is_active,
          email_verified,
          email_verified_at,
          approved_at,
          approved_by,
          denied_at,
          denied_by,
          last_login_at,
          created_at,
          updated_at
        FROM customer_accounts
        WHERE id = $1
        LIMIT 1;
      `,
      [accountId]
    );

    return rows[0] ?? null;
  }

  async touchLastLogin(accountId) {
    await this.pool.query(
      `
        UPDATE customer_accounts
        SET last_login_at = NOW(), updated_at = NOW()
        WHERE id = $1;
      `,
      [accountId]
    );
  }

  async getPrimaryCustomerLink(accountId) {
    const { rows } = await this.pool.query(
      `
        SELECT
          account_id,
          codclien,
          created_at
        FROM customer_account_links
        WHERE account_id = $1
        ORDER BY created_at ASC, codclien ASC
        LIMIT 1;
      `,
      [accountId]
    );

    return rows[0] ?? null;
  }

  async getLinkedCustomers(accountId) {
    const { rows } = await this.pool.query(
      `
        WITH latest_client_rows AS (
          SELECT DISTINCT ON (c.codclien)
            l.account_id,
            c.codclien,
            c.ejercicio,
            c.razclien,
            c.nomcomer,
            c.nif,
            c.email,
            c.tlfno,
            c.movil,
            c.codtarifa,
            c.codforpago,
            c.desforpago,
            c.tipcliente,
            c.tipocliente,
            c.direccion,
            c.localidad,
            c.cp,
            c.fecalta,
            c.fecultmod
          FROM customer_account_links l
          JOIN clientes c
            ON c.codclien = l.codclien
          WHERE l.account_id = $1
            AND ${clientIsActiveCondition.replace(/dadobaja/g, 'c.dadobaja')}
          ORDER BY c.codclien, c.ejercicio DESC
        )
        SELECT *
        FROM latest_client_rows
        ORDER BY codclien ASC;
      `,
      [accountId]
    );

    return rows;
  }

  async setPasswordResetToken(accountId, token, expires) {
    await this.pool.query(
      `
      UPDATE customer_accounts
      SET password_reset_token = $1,
          password_reset_expires_at = $2,
          password_reset_requested_at = NOW(),
          password_reset_used_at = NULL,
          updated_at = NOW()
      WHERE id = $3
    `,
      [token, expires, accountId]
    );
  }

  async findByPasswordResetToken(token) {
    const { rows } = await this.pool.query(
      `
      SELECT *
      FROM customer_accounts
      WHERE password_reset_token = $1
      LIMIT 1
    `,
      [token]
    );

    return rows[0] ?? null;
  }

  async updatePassword(accountId, passwordHash) {
    await this.pool.query(
      `
      UPDATE customer_accounts
      SET password_hash = $1,
          updated_at = NOW()
      WHERE id = $2
    `,
      [passwordHash, accountId]
    );
  }

  async clearPasswordReset(accountId) {
    await this.pool.query(
      `
      UPDATE customer_accounts
      SET password_reset_token = NULL,
          password_reset_expires_at = NULL,
          password_reset_requested_at = NULL,
          password_reset_used_at = NOW(),
          updated_at = NOW()
      WHERE id = $1
    `,
      [accountId]
    );
  }

}



export { normalizeEmail, normalizeNif };