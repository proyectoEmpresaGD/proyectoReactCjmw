import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export class ProductModel {
  static async getAll({ CodFamil, CodSubFamil, requiredLimit = 16, offset = 0 }) {
    let accumulatedProducts = [];
    let excludedNames = [];

    try {
      while (accumulatedProducts.length < requiredLimit) {
        let limit = requiredLimit;
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

        if (params.length > 0) {
          query += ' AND "nombre" IS NOT NULL AND "nombre" != \'\'';
        } else {
          query += ' WHERE "nombre" IS NOT NULL AND "nombre" != \'\'';
        }

        if (excludedNames.length > 0) {
          const excludedNamesPlaceholders = excludedNames.map((_, i) => `$${params.length + i + 1}`).join(', ');
          query += ` AND "nombre" NOT IN (${excludedNamesPlaceholders})`;
          params = [...params, ...excludedNames];
        }

        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const { rows } = await pool.query(query, params);
        const validRows = rows.filter(row => row.nombre && row.nombre.trim() !== '');
        const uniqueRows = validRows.filter(row => !excludedNames.includes(row.nombre));

        accumulatedProducts = [...accumulatedProducts, ...uniqueRows];
        excludedNames = [...excludedNames, ...uniqueRows.map(row => row.nombre)];

        if (uniqueRows.length < limit) {
          break;
        }

        offset += uniqueRows.length;
      }

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

  static async search({ query, limit = 10, offset = 0 }) {
    const searchQuery = `
      SELECT DISTINCT ON ("nombre") *
      FROM productos
      WHERE "nombre" ILIKE $1
        AND "nombre" IS NOT NULL 
        AND "nombre" != '' 
        AND NOT ("nombre" ~* '^(LIBRO|PORTADA|SET|KIT|COMPOSICION ESPECIAL|COLECCIÓN|ALFOMBRA|ANUNCIADA|MULETON|ATLAS|QUALITY SAMPLE|PERCHA|ALQUILER|CALCUTA C35|TAPILLA|LÁMINA|ACCESORIOS MUESTRARIOS|CONTRAPORTADA|ALFOMBRAS|AGARRADERAS|ARRENDAMIENTOS INTRACOMUNITARIOS|\d+)')
        AND NOT ("desprodu" ~* '(PERCHAS Y LIBROS|CUTTING|LIBROS|PERCHA|FUERA DE COLECCIÓN|PERCHAS|FUERA DE COLECCION)')
        AND "codmarca" IN ('ARE', 'FLA', 'CJM', 'HAR', 'BAS')
      ORDER BY "nombre", "codprodu"
      LIMIT $2 OFFSET $3;
    `;
    const offsetValue = offset || 0;
    const searchString = `%${query}%`;

    try {
      const { rows } = await pool.query(searchQuery, [searchString, limit, offsetValue]);
      return { products: rows, total: rows.length };
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
      const { rows: brands } = await pool.query('SELECT DISTINCT codmarca FROM productos');
      const { rows: collections } = await pool.query('SELECT DISTINCT coleccion, codmarca FROM productos');
      const { rows: fabricTypes } = await pool.query('SELECT DISTINCT tipo FROM productos');
      const { rows: fabricPatterns } = await pool.query('SELECT DISTINCT estilo FROM productos');
      const { rows: martindaleValues } = await pool.query('SELECT DISTINCT martindale FROM productos');
      const { rows: colors } = await pool.query('SELECT DISTINCT colorprincipal FROM productos');
      const { rows: tonalidades } = await pool.query('SELECT DISTINCT tonalidad FROM productos');

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

  // Filtro para productos basados en el tipo (ej. "PAPEL PARED")
  static async getByType({ type, limit = 16, offset = 0 }) {
    try {
      let query = 'SELECT DISTINCT ON ("nombre") * FROM productos WHERE 1=1';
      const params = [];
      let index = 1;

      if (type === 'papeles') {
        query += ` AND "tipo" = 'PAPEL PARED'`;
      } else if (type === 'telas') {
        query += ` AND "tipo" != 'PAPEL PARED'`;
      }

      query += ` LIMIT $${index++} OFFSET $${index}`;
      params.push(limit, offset);

      const { rows } = await pool.query(query, params);
      return { products: rows, total: rows.length };
    } catch (error) {
      console.error('Error filtering products by type:', error);
      throw new Error('Error filtering products by type');
    }
  }
  // Método para aplicar filtros a los productos
  static async filter(filters, limit = 16, offset = 0) {
    let query = 'SELECT DISTINCT ON ("nombre") * FROM productos WHERE "nombre" IS NOT NULL AND "nombre" != \'\'';
    let params = [];
    let index = 1;

    // Aplicar filtro por marca si está presente
    if (filters.brand && filters.brand.length > 0) {
      query += ` AND "codmarca" = ANY($${index++})`;
      params.push(filters.brand);
    }

    // Aplicar filtro por colección si está presente
    if (filters.collection && filters.collection.length > 0) {
      query += ` AND "coleccion" ILIKE $${index++}`;
      params.push(`%${filters.collection}%`);
    }

    // Aplicar filtro por color si está presente
    if (filters.color && filters.color.length > 0) {
      query += ` AND "colorprincipal" = ANY($${index++})`;
      params.push(filters.color);
    }

    // Aplicar filtro por tipo de tela si está presente
    if (filters.fabricType && filters.fabricType.length > 0) {
      query += ` AND "tipo" = ANY($${index++})`;
      params.push(filters.fabricType);
    }

    // Aplicar filtro por estilo (liso, flores, etc.) o patrones específicos
    if (filters.fabricPattern && filters.fabricPattern.length > 0) {
      if (filters.fabricPattern.includes('TERCIOPELO')) {
        query += ` AND "tipo" ILIKE '%TERCIOPELO%'`; // Filtro específico para terciopelo
      } else if (filters.fabricPattern.includes('WALLPAPER')) {
        query += ` AND "estilo" ILIKE '%WALLPAPER%'`; // Filtro específico para wallpaper
      } else if (filters.fabricPattern.includes('WALLCOVERING')) {
        query += ` AND "estilo" ILIKE '%WALLCOVERING%'`; // Filtro específico para wallcovering
      } else {
        query += ` AND "estilo" = ANY($${index++})`;
        params.push(filters.fabricPattern);
      }
    }

    // Aplicar filtro por uso si está presente (Outdoor, FR)
    if (filters.uso && filters.uso.length > 0) {
      let usoConditions = [];
      if (filters.uso.includes('FR')) {
        usoConditions.push(`"uso" ILIKE '%FR%'`);
      }
      if (filters.uso.includes('OUTDOOR')) {
        usoConditions.push(`"uso" ILIKE '%OUTDOOR%'`);
      }
      if (usoConditions.length > 0) {
        query += ` AND (${usoConditions.join(' OR ')})`;
      }
    }

    // Aplicar filtro por martindale si está presente
    if (filters.martindale && filters.martindale.length > 0) {
      query += ` AND "martindale" = ANY($${index++})`;
      params.push(filters.martindale);
    }

    query += ` LIMIT $${index++} OFFSET $${index}`;
    params.push(limit, offset);

    try {
      const { rows } = await pool.query(query, params);
      return { products: rows, total: rows.length };
    } catch (error) {
      console.error('Error filtering products:', error);
      throw new Error('Error filtering products');
    }
  }

  static async getCollectionsByBrand(brand) {
    try {
      const query = `
        SELECT DISTINCT UPPER(coleccion) AS coleccion
        FROM productos
        WHERE codmarca = $1
        AND nombre IS NOT NULL
      `;

      const { rows } = await pool.query(query, [brand]);

      // Asegúrate de devolver solo los nombres de las colecciones
      return rows.map(row => row.coleccion);
    } catch (error) {
      console.error('Error fetching collections by brand:', error);
      throw new Error('Error fetching collections by brand');
    }
  }
}
