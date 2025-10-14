import assert from 'node:assert';

export class ContactRequestModel {
    constructor(pool) {
        assert(pool, 'A PostgreSQL pool instance is required');
        this.pool = pool;
    }

    async create(contactPayload) {
        const {
            profile,
            firstName,
            lastName,
            email,
            company,
            country,
            postalCode,
            province,
            reason,
            message,
            marketingOptIn,
            consentGranted,
            consentVersion,
            attachmentPath,
            attachmentMime,
            attachmentSize,
            ipAddress,
            userAgent,
        } = contactPayload;

        const insertQuery = `
      INSERT INTO contact_requests (
        profile,
        first_name,
        last_name,
        email,
        company,
        country,
        postal_code,
        province,
        reason,
        message,
        marketing_opt_in,
        consent_granted,
        consent_version,
        attachment_path,
        attachment_mime,
        attachment_size,
        ip_address,
        user_agent
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18
      )
      RETURNING id, created_at;
    `;

        const values = [
            profile,
            firstName,
            lastName,
            email,
            company,
            country,
            postalCode,
            province,
            reason,
            message,
            marketingOptIn,
            consentGranted,
            consentVersion,
            attachmentPath,
            attachmentMime,
            attachmentSize,
            ipAddress,
            userAgent,
        ];

        const { rows } = await this.pool.query(insertQuery, values);
        return rows[0];
    }

    async list({ limit = 25, offset = 0, reason, profile }) {
        const conditions = [];
        const params = [];

        if (reason) {
            params.push(reason);
            conditions.push(`reason = $${params.length}`);
        }

        if (profile) {
            params.push(profile);
            conditions.push(`profile = $${params.length}`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const limitPosition = params.length + 1;
        const offsetPosition = params.length + 2;

        const query = `
      SELECT
        id,
        profile,
        first_name,
        last_name,
        email,
        company,
        country,
        postal_code,
        province,
        reason,
        message,
        marketing_opt_in,
        consent_version,
        attachment_path,
        attachment_mime,
        attachment_size,
        ip_address,
        user_agent,
        created_at
      FROM contact_requests
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${limitPosition}
      OFFSET $${offsetPosition};
    `;

        params.push(limit);
        params.push(offset);

        const { rows } = await this.pool.query(query, params);
        return rows;
    }

    async deleteOlderThanDays(days = 180) {
        const safeDays = Number.isFinite(days) ? Math.max(1, Math.trunc(days)) : 180;
        const interval = `${safeDays} days`;
        await this.pool.query(
            'DELETE FROM contact_requests WHERE created_at < NOW() - $1::interval',
            [interval]
        );
    }
}
