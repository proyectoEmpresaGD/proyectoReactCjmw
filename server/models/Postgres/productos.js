import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export class ProductModel {
  static async getAll({ CodFamil, CodSubFamil, requiredLimit = 16, offset = 0 }) {
    let accumulatedProducts = []; // Acumula los productos válidos que se van obteniendo
    let excludedNames = []; // Acumula los nombres de los productos ya mostrados en cualquier consulta

    try {
      while (accumulatedProducts.length < requiredLimit) {
        let limit = requiredLimit; // Siempre solicitamos 16 productos nuevos
        let query = 'SELECT DISTINCT ON ("nombre") * FROM productos';
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

        // Asegurarse de que el nombre no sea NULL ni vacío
        if (params.length > 0) {
          query += ' AND "nombre" IS NOT NULL AND "nombre" != \'\'';
        } else {
          query += ' WHERE "nombre" IS NOT NULL AND "nombre" != \'\'';
        }

        // Excluir los productos ya recuperados basados en el nombre
        if (excludedNames.length > 0) {
          const excludedNamesPlaceholders = excludedNames.map((_, i) => `$${params.length + i + 1}`).join(', ');
          query += ` AND "nombre" NOT IN (${excludedNamesPlaceholders})`;
          params = [...params, ...excludedNames];
        }

        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const { rows } = await pool.query(query, params);

        // Filtrar nuevamente en caso de que por alguna razón hayan pasado productos sin nombre o con nombre vacío
        const validRows = rows.filter(row => row.nombre && row.nombre.trim() !== '');

        // Filtrar productos con nombres duplicados dentro de la misma consulta
        const uniqueRows = validRows.filter(row => !excludedNames.includes(row.nombre));

        accumulatedProducts = [...accumulatedProducts, ...uniqueRows];

        // Añadir los nombres de los productos válidos y únicos a excludedNames
        excludedNames = [...excludedNames, ...uniqueRows.map(row => row.nombre)];

        // Si se obtuvieron menos productos de los que pedimos, detenemos el bucle
        if (uniqueRows.length < limit) {
          break;
        }

        // Aumentamos el offset para la próxima iteración
        offset += uniqueRows.length;
      }

      // Devolver los productos acumulados, aunque sean menos de 16 si no hay suficientes
      return accumulatedProducts.slice(0, requiredLimit);

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
      SELECT DISTINCT ON ("nombre") *
      FROM productos
      WHERE "nombre" ILIKE $1
      ORDER BY "nombre", "codprodu" 
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

  static async getFilters() {
    try {
      console.log('Fetching brands');
      const { rows: brands } = await pool.query('SELECT DISTINCT codmarca FROM productos');
      console.log('Fetched brands:', brands);

      console.log('Fetching collections');
      const { rows: collections } = await pool.query('SELECT DISTINCT coleccion, codmarca FROM productos');
      console.log('Fetched collections:', collections);

      console.log('Fetching fabric types');
      const { rows: fabricTypes } = await pool.query('SELECT DISTINCT tipo FROM productos');
      console.log('Fetched fabric types:', fabricTypes);

      console.log('Fetching fabric patterns');
      const { rows: fabricPatterns } = await pool.query('SELECT DISTINCT estilo FROM productos');
      console.log('Fetched fabric patterns:', fabricPatterns);

      console.log('Fetching martindale values');
      const { rows: martindaleValues } = await pool.query('SELECT DISTINCT martindale FROM productos');
      console.log('Fetched martindale values:', martindaleValues);

      console.log('Fetching colors');
      const { rows: colors } = await pool.query('SELECT DISTINCT colorprincipal FROM productos');
      console.log('Fetched colors:', colors);

      console.log('Fetching tonalidades');
      const { rows: tonalidades } = await pool.query('SELECT DISTINCT tonalidad FROM productos');
      console.log('Fetched tonalidades:', tonalidades);

      return {
        brands: brands.map(b => b.codmarca),
        collections: collections.map(c => c.coleccion),
        fabricTypes: fabricTypes.map(f => f.tipo),
        fabricPatterns: fabricPatterns.map(f => f.estilo),
        martindaleValues: martindaleValues.map(m => m.martindale),
        colors: colors.map(c => c.colorprincipal),
        tonalidades: tonalidades.map(t => t.tonalidad)
      };
    } catch (error) {
      console.error('Error fetching filters:', error);
      throw new Error('Error fetching filters');
    }
  }


  static async filter(filters) {
    let query = 'SELECT * FROM productos WHERE 1=1';
    let params = [];
    let index = 1;

    if (filters.brand && filters.brand.length > 0) {
      query += ` AND "codmarca" = ANY($${index++})`;
      params.push(filters.brand);
    }

    if (filters.color && filters.color.length > 0) {
      query += ` AND "colorprincipal" = ANY($${index++})`;
      params.push(filters.color);
    }

    if (filters.collection && filters.collection.length > 0) {
      query += ` AND "coleccion" = ANY($${index++})`;
      params.push(filters.collection);
    }

    if (filters.fabricType && filters.fabricType.length > 0) {
      query += ` AND "tipo" = ANY($${index++})`;
      params.push(filters.fabricType);
    }

    if (filters.fabricPattern && filters.fabricPattern.length > 0) {
      query += ` AND "estilo" = ANY($${index++})`;
      params.push(filters.fabricPattern);
    }

    if (filters.tonalidad && filters.tonalidad.length > 0) {
      query += ` AND "tonalidad" = ANY($${index++})`;
      params.push(filters.tonalidad);
    }

    if (filters.martindale && filters.martindale.length > 0) {
      query += ` AND "martindale" = ANY($${index++})`;
      params.push(filters.martindale);
    }

    try {
      const { rows } = await pool.query(query, params);
      return rows;
    } catch (error) {
      console.error('Error filtering products:', error);
      throw new Error('Error filtering products');
    }
  }

}