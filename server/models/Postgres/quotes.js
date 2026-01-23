// models/Postgres/quotes.js
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export class QuotesModel {
    static async ensureTable() {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        ref TEXT PRIMARY KEY,
        sha256 TEXT NOT NULL,
        size INTEGER NOT NULL,
        mime TEXT NOT NULL,
        blob_url TEXT,
        total NUMERIC,
        email TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    }

    static async upsertMetadata({ ref, sha256, size, mime, blobUrl, total = null, email = null }) {
        await this.ensureTable();
        await pool.query(
            `INSERT INTO quotes (ref, sha256, size, mime, blob_url, total, email)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (ref) DO UPDATE
         SET sha256=$2, size=$3, mime=$4, blob_url=$5, total=$6, email=$7`,
            [ref, sha256, size, mime, blobUrl, total, email]
        );
        return { ref, sha256, size, mime, blobUrl, total, email };
    }

    static async findByRef(ref) {
        await this.ensureTable();
        const { rows } = await pool.query('SELECT * FROM quotes WHERE ref=$1', [ref]);
        return rows[0] ?? null;
    }
}
