import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export class ProductModel {
  static async getAll({ CodFamil, CodSubFamil }) {
    let query = 'SELECT * FROM productos';
    let params = [];

    if (CodFamil) {
      query += ' WHERE "codfamil" = $1';
      params.push(CodFamil);
    }

    if (CodSubFamil) {
      if (params.length > 0) {
        query += ' AND "codsubfamil" = $2';
      } else {
        query += ' WHERE "codsubfamil" = $1';
      }
      params.push(CodSubFamil);
    }

    try {
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Error fetching products');
    }
  }

  static async getById({ id }) {
    const { rows } = await pool.query('SELECT * FROM productos WHERE "codprodu" = $1;', [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create({ input }) {
    const { CodProdu, DesProdu, CodFamil, Comentario, UrlImagen } = input;

    const { rows } = await pool.query(
      `INSERT INTO productos ("codprodu", "desprodu", "codfamil", "comentario", "urlimagen")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;`,
      [CodProdu, DesProdu, CodFamil, Comentario, UrlImagen]
    );

    return rows[0];
  }

  static async update({ id, input }) {
    const fields = Object.keys(input).map((key, index) => `"${key}" = $${index + 2}`).join(", ");
    const values = Object.values(input);

    const { rows } = await pool.query(
      `UPDATE productos SET ${fields} WHERE "codprodu" = $1 RETURNING *;`,
      [id, ...values]
    );

    return rows[0];
  }

  static async delete({ id }) {
    const { rows } = await pool.query('DELETE FROM productos WHERE "codprodu" = $1 RETURNING *;', [id]);

    return rows[0];
  }

  static async search({ query, limit = 10, page = 1 }) {
    const searchQuery = `
      SELECT * FROM productos
      WHERE "desprodu" ILIKE $1
      ORDER BY "desprodu"
      LIMIT $2 OFFSET $3;
    `;

    const offset = (page - 1) * limit;

    try {
      const { rows } = await pool.query(searchQuery, [`${query}%`, limit, offset]);
      return rows;
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Error searching products');
    }
  }
  static async getByCodFamil(codfamil) {
    try {
      const { rows } = await pool.query('SELECT * FROM productos WHERE "codfamil" = $1;', [codfamil]);
      return rows;
    } catch (error) {
      console.error('Error fetching products by codfamil:', error);
      throw new Error('Error fetching products by codfamil');
    }
  }


}
