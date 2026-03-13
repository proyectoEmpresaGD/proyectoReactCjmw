export class CustomerRegistrationModel {
    constructor({ pool }) {
        this.pool = pool;
    }

    async findRequestById(id) {
        const { rows } = await this.pool.query(
            `
        SELECT
          id,
          email,
          first_name,
          last_name,
          password_hash,
          phone,
          mobile_phone,
          street_address,
          address_line_2,
          city,
          state_province,
          postcode,
          country,
          codclien,
          status,
          email_verified,
          email_verification_token,
          email_verification_sent_at,
          email_verified_at,
          reviewed_at,
          reviewed_by,
          denial_reason,
          approved_account_id,
          created_at,
          updated_at
        FROM customer_registration_requests
        WHERE id = $1
        LIMIT 1;
      `,
            [id]
        );

        return rows[0] ?? null;
    }

    async findRequestByEmail(email) {
        const normalizedEmail = this.normalizeEmail(email);

        const { rows } = await this.pool.query(
            `
        SELECT
          id,
          email,
          first_name,
          last_name,
          password_hash,
          phone,
          mobile_phone,
          street_address,
          address_line_2,
          city,
          state_province,
          postcode,
          country,
          codclien,
          status,
          email_verified,
          email_verification_token,
          email_verification_sent_at,
          email_verified_at,
          reviewed_at,
          reviewed_by,
          denial_reason,
          approved_account_id,
          created_at,
          updated_at
        FROM customer_registration_requests
        WHERE LOWER(email) = LOWER($1)
        LIMIT 1;
      `,
            [normalizedEmail]
        );

        return rows[0] ?? null;
    }

    async findAccountByEmail(email) {
        const normalizedEmail = this.normalizeEmail(email);

        const { rows } = await this.pool.query(
            `
        SELECT
          id,
          email,
          password_hash,
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

    async createRequest({
        email,
        firstName,
        lastName,
        passwordHash,
        phone = null,
        mobilePhone = null,
        streetAddress = null,
        addressLine2 = null,
        city = null,
        stateProvince = null,
        postcode = null,
        country = null,
        codclien,
    }) {
        const normalizedEmail = this.normalizeEmail(email);
        const normalizedCodclien = this.normalizeCustomerCode(codclien);

        const { rows } = await this.pool.query(
            `
        INSERT INTO customer_registration_requests (
          email,
          first_name,
          last_name,
          password_hash,
          phone,
          mobile_phone,
          street_address,
          address_line_2,
          city,
          state_province,
          postcode,
          country,
          codclien,
          status,
          email_verified,
          created_at,
          updated_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
          'pending',
          FALSE,
          NOW(),
          NOW()
        )
        RETURNING
          id,
          email,
          first_name,
          last_name,
          phone,
          mobile_phone,
          street_address,
          address_line_2,
          city,
          state_province,
          postcode,
          country,
          codclien,
          status,
          email_verified,
          reviewed_at,
          reviewed_by,
          denial_reason,
          approved_account_id,
          created_at,
          updated_at;
      `,
            [
                normalizedEmail,
                firstName?.trim(),
                lastName?.trim(),
                passwordHash,
                this.cleanNullable(phone),
                this.cleanNullable(mobilePhone),
                this.cleanNullable(streetAddress),
                this.cleanNullable(addressLine2),
                this.cleanNullable(city),
                this.cleanNullable(stateProvince),
                this.cleanNullable(postcode),
                this.cleanNullable(country),
                normalizedCodclien,
            ]
        );

        return rows[0];
    }

    async listRequests({ status = 'pending', limit = 50, offset = 0 } = {}) {
        const parsedLimit = Number(limit);
        const parsedOffset = Number(offset);

        const { rows } = await this.pool.query(
            `
        SELECT
          id,
          email,
          first_name,
          last_name,
          phone,
          mobile_phone,
          street_address,
          address_line_2,
          city,
          state_province,
          postcode,
          country,
          codclien,
          status,
          email_verified,
          email_verification_sent_at,
          email_verified_at,
          reviewed_at,
          reviewed_by,
          denial_reason,
          approved_account_id,
          created_at,
          updated_at
        FROM customer_registration_requests
        WHERE ($1::text IS NULL OR status = $1)
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3;
      `,
            [status ?? null, parsedLimit, parsedOffset]
        );

        return rows;
    }

    async createApprovedAccountFromRequest({
        requestId,
        reviewedBy,
    }) {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const requestResult = await client.query(
                `
          SELECT
            id,
            email,
            password_hash,
            codclien,
            status
          FROM customer_registration_requests
          WHERE id = $1
          FOR UPDATE;
        `,
                [requestId]
            );

            const request = requestResult.rows[0];
            if (!request) {
                throw new Error('REQUEST_NOT_FOUND');
            }

            if (request.status !== 'pending') {
                throw new Error('REQUEST_NOT_PENDING');
            }

            const existingAccountResult = await client.query(
                `
          SELECT id
          FROM customer_accounts
          WHERE LOWER(email) = LOWER($1)
          LIMIT 1;
        `,
                [request.email]
            );

            if (existingAccountResult.rows[0]) {
                throw new Error('ACCOUNT_ALREADY_EXISTS');
            }

            const accountResult = await client.query(
                `
          INSERT INTO customer_accounts (
            email,
            password_hash,
            status,
            is_active,
            email_verified,
            approved_at,
            approved_by,
            created_at,
            updated_at
          )
          VALUES (
            $1,
            $2,
            'approved',
            TRUE,
            FALSE,
            NOW(),
            $3,
            NOW(),
            NOW()
          )
          RETURNING
            id,
            email,
            status,
            is_active,
            email_verified,
            approved_at,
            approved_by,
            created_at,
            updated_at;
        `,
                [request.email, request.password_hash, this.cleanNullable(reviewedBy)]
            );

            const account = accountResult.rows[0];

            await client.query(
                `
          INSERT INTO customer_account_links (
            account_id,
            codclien,
            created_at
          )
          VALUES ($1, $2, NOW())
          ON CONFLICT (account_id, codclien) DO NOTHING;
        `,
                [account.id, request.codclien]
            );

            const updatedRequestResult = await client.query(
                `
          UPDATE customer_registration_requests
          SET
            status = 'approved',
            reviewed_at = NOW(),
            reviewed_by = $2,
            denial_reason = NULL,
            approved_account_id = $3,
            updated_at = NOW()
          WHERE id = $1
          RETURNING
            id,
            email,
            first_name,
            last_name,
            phone,
            mobile_phone,
            street_address,
            address_line_2,
            city,
            state_province,
            postcode,
            country,
            codclien,
            status,
            email_verified,
            email_verification_sent_at,
            email_verified_at,
            reviewed_at,
            reviewed_by,
            denial_reason,
            approved_account_id,
            created_at,
            updated_at;
        `,
                [requestId, this.cleanNullable(reviewedBy), account.id]
            );

            await client.query('COMMIT');

            return {
                account,
                request: updatedRequestResult.rows[0],
            };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async denyRequest({
        requestId,
        reviewedBy,
        denialReason = null,
    }) {
        const { rows } = await this.pool.query(
            `
        UPDATE customer_registration_requests
        SET
          status = 'denied',
          reviewed_at = NOW(),
          reviewed_by = $2,
          denial_reason = $3,
          updated_at = NOW()
        WHERE id = $1
          AND status = 'pending'
        RETURNING
          id,
          email,
          first_name,
          last_name,
          phone,
          mobile_phone,
          street_address,
          address_line_2,
          city,
          state_province,
          postcode,
          country,
          codclien,
          status,
          email_verified,
          email_verification_sent_at,
          email_verified_at,
          reviewed_at,
          reviewed_by,
          denial_reason,
          approved_account_id,
          created_at,
          updated_at;
      `,
            [requestId, this.cleanNullable(reviewedBy), this.cleanNullable(denialReason)]
        );

        return rows[0] ?? null;
    }

    async saveEmailVerificationToken({
        accountId,
        token,
    }) {
        const { rows } = await this.pool.query(
            `
        UPDATE customer_accounts
        SET
          email_verification_token = $2,
          email_verification_sent_at = NOW(),
          updated_at = NOW()
        WHERE id = $1
        RETURNING
          id,
          email,
          status,
          is_active,
          email_verified,
          email_verification_token,
          email_verification_sent_at,
          email_verified_at,
          approved_at,
          approved_by,
          created_at,
          updated_at;
      `,
            [accountId, token]
        );

        return rows[0] ?? null;
    }

    async verifyEmailByToken(token) {
        const { rows } = await this.pool.query(
            `
        UPDATE customer_accounts
        SET
          email_verified = TRUE,
          email_verified_at = NOW(),
          email_verification_token = NULL,
          updated_at = NOW()
        WHERE email_verification_token = $1
        RETURNING
          id,
          email,
          status,
          is_active,
          email_verified,
          email_verification_sent_at,
          email_verified_at,
          approved_at,
          approved_by,
          created_at,
          updated_at;
      `,
            [token]
        );

        return rows[0] ?? null;
    }

    normalizeEmail(email = '') {
        return String(email).trim().toLowerCase();
    }

    normalizeCustomerCode(codclien = '') {
        return String(codclien).trim().toUpperCase();
    }

    cleanNullable(value) {
        if (value === undefined || value === null) {
            return null;
        }

        const normalizedValue = String(value).trim();
        return normalizedValue.length ? normalizedValue : null;
    }
}