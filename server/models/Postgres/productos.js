import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.PGHOST); // Debería mostrar el valor configurado en .env para PGHOST

const { Pool } = pg;

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT || 1234,
  ssl: false // Configura SSL a false

});

export class ProductModel {
  // Obtener todos los productos, opcionalmente filtrados por familia y subfamilia
  static async getAll({ CodFamil, CodSubFamil }) {
    console.log('getAll');
    let query = 'SELECT * FROM productos';
    let params = [];

    if (CodFamil) {
      query += ' WHERE "CodFamil" = $1';
      params.push(CodFamil);
    }

    if (CodSubFamil) {
      if (params.length > 0) {
        query += ' AND "CodSubFamil" = $2';
      } else {
        query += ' WHERE "CodSubFamil" = $1';
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

  // Obtener un producto específico por su código
  static async getById({ id }) {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM productos WHERE "CodProdu" = $1;',
        [id]
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.log(error)
    }

  }

  // Crear un nuevo producto
  static async create({ input }) {
    const {
      CodProdu,
      DesProdu,
      CodFamil,
      Comentario
      // Agrega más campos según sea necesario
    } = input;

    const { rows } = await pool.query(
      `INSERT INTO productos ("CodProdu", "DesProdu", "CodFamil", "Comentario")
       VALUES ($1, $2, $3, $4)
       RETURNING *;`,
      [CodProdu, DesProdu, CodFamil, Comentario]
    );

    return rows[0];
  }

  // Actualizar un producto existente
  static async update({ id, input }) {
    const fields = Object.keys(input).map((key, index) => `"${key}" = $${index + 2}`).join(", ");
    const values = Object.values(input);

    const { rows } = await pool.query(
      `UPDATE productos SET ${fields} WHERE "CodProdu" = $1 RETURNING *;`,
      [id, ...values]
    );

    return rows[0];
  }

  // Eliminar un producto
  static async delete({ id }) {
    const { rows } = await pool.query(
      'DELETE FROM productos WHERE "CodProdu" = $1 RETURNING *;',
      [id]
    );

    return rows[0];
  }
}

