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
    let excludedNames = ['DUKE','POISON', 'AGDAL','COSY','MARRAKESH','MAJORELLE','MAMOUNIA','KUTUBIA','MENARA','KASBAH','RIAD'];

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

  // Obtener producto por ID
  static async getById({ id, res }) {
    const cacheKey = `product:${id}`;
    if (res && res.cache) {
      const cachedResponse = await res.cache.get(cacheKey);
      if (cachedResponse) {
        res.set('Cache-Control', 'public, max-age=3600');
        return cachedResponse;
      }
    }

    const { rows } = await pool.query('SELECT * FROM productos WHERE "codprodu" = $1;', [id]);

    if (rows.length > 0) {
      if (res && res.cache) {
        await res.cache.set(cacheKey, rows[0]);
      }
      res?.set('Cache-Control', 'public, max-age=3600');
      return rows[0];
    }

    return null;
  }

  // Crear producto
  static async create({ input, res }) {
    const { CodProdu, DesProdu, CodFamil, Comentario, UrlImagen } = input;

    const { rows } = await pool.query(
      `INSERT INTO productos ("codprodu", "desprodu", "codfamil", "comentario", "urlimagen")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`,
      [CodProdu, DesProdu, CodFamil, Comentario, UrlImagen]
    );

    if (res && res.cache) {
      await res.cache.flushAll(); // Invalidar caché si es necesario
    }

    return rows[0];
  }

  // Actualizar producto
  static async update({ id, input, res }) {
    const fields = Object.keys(input).map((key, index) => `"${key}" = $${index + 2}`).join(", ");
    const values = Object.values(input);

    const { rows } = await pool.query(
      `UPDATE productos SET ${fields} WHERE "codprodu" = $1 RETURNING *;`,
      [id, ...values]
    );

    if (res && res.cache) {
      await res.cache.del(`product:${id}`);
      await res.cache.flushAll();
    }

    return rows[0];
  }

  // Eliminar producto
  static async delete({ id, res }) {
    const { rows } = await pool.query('DELETE FROM productos WHERE "codprodu" = $1 RETURNING *;', [id]);

    if (res && res.cache) {
      await res.cache.del(`product:${id}`);
      await res.cache.flushAll();
    }

    return rows[0];
  }
  // Búsqueda de productos
  static async search({ query, limit = 10, offset = 0, res }) {
    const cacheKey = `search:${query}:${offset}:${limit}`;
    if (res && res.cache) {
      const cachedResponse = await res.cache.get(cacheKey);
      if (cachedResponse) {
        res.set('Cache-Control', 'public, max-age=3600');
        return cachedResponse;
      }
    }

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

      if (res && res.cache) {
        await res.cache.set(cacheKey, { products: rows, total: rows.length });
        res.set('Cache-Control', 'public, max-age=3600');
      }

      return { products: rows, total: rows.length };
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Error searching products');
    }
  }

  static async getByCodFamil(codfamil, res) {
    const cacheKey = `products:family:${codfamil}`;

    // Asegurarse de que res.cache exista antes de acceder a él
    if (res?.cache) {
      const cachedResponse = await res.cache.get(cacheKey);
      if (cachedResponse) {
        res.set('Cache-Control', 'public, max-age=3600');
        return cachedResponse;
      }
    }

    try {
      const { rows } = await pool.query('SELECT * FROM productos WHERE "codfamil" = $1;', [codfamil]);

      if (res?.cache) {
        await res.cache.set(cacheKey, rows);
        res.set('Cache-Control', 'public, max-age=3600');
      }

      return rows;
    } catch (error) {
      console.error('Error fetching products by codfamil:', error);
      throw new Error('Error fetching products by codfamil');
    }
  }


  // Obtener filtros de productos
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

  // Filtro por tipo de producto
  static async getByType({ type, limit = 16, offset = 0, res }) {
    const cacheKey = `products:type:${type}:${offset}:${limit}`;
    const cachedResponse = await res?.cache.get(cacheKey);

    if (cachedResponse) {
      res.set('Cache-Control', 'public, max-age=3600');
      return cachedResponse;
    }

    try {
      let query = 'SELECT DISTINCT ON ("nombre") * FROM productos WHERE 1=1';
      const params = [];
      let index = 1;

      if (type === 'papeles') {
        query += ` AND "tipo" = 'PAPEL PINTADO'`;
      } else if (type === 'telas') {
        query += ` AND "tipo" != 'PAPEL PINTADO'`;
      }

      query += ` LIMIT $${index++} OFFSET $${index}`;
      params.push(limit, offset);

      const { rows } = await pool.query(query, params);
      await res?.cache.set(cacheKey, rows);
      res.set('Cache-Control', 'public, max-age=3600');
      return { products: rows, total: rows.length };
    } catch (error) {
      console.error('Error filtering products by type:', error);
      throw new Error('Error filtering products by type');
    }
  }

  // Aplicar filtros a productos
  static async filter(filters, limit = 16, offset = 0, res) {
    const cacheKey = `products:filter:${JSON.stringify(filters)}:${offset}:${limit}`;
    if (res && res.cache) {
      const cachedResponse = await res.cache.get(cacheKey);
      if (cachedResponse) {
        res.set('Cache-Control', 'public, max-age=3600');
        return cachedResponse;
      }
    }

    let query = 'SELECT DISTINCT ON ("nombre") * FROM productos WHERE "nombre" IS NOT NULL AND "nombre" != \'\'';
    let params = [];
    let index = 1;

    if (filters.brand && filters.brand.length > 0) {
      query += ` AND "codmarca" = ANY($${index++})`;
      params.push(filters.brand);
    }

    if (filters.collection && filters.collection.length > 0) {
      query += ` AND "coleccion" ILIKE $${index++}`;
      params.push(`%${filters.collection}%`);
    }

    if (filters.color && filters.color.length > 0) {
      query += ` AND "colorprincipal" = ANY($${index++})`;
      params.push(filters.color);
    }

    if (filters.fabricType && filters.fabricType.length > 0) {
      query += ` AND "tipo" = ANY($${index++})`;
      params.push(filters.fabricType);
    }

    if (filters.fabricPattern && filters.fabricPattern.length > 0) {
      query += ` AND "estilo" = ANY($${index++})`;
      params.push(filters.fabricPattern);
    }

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

    if (filters.martindale && filters.martindale.length > 0) {
      query += ` AND "martindale" = ANY($${index++})`;
      params.push(filters.martindale);
    }

    query += ` LIMIT $${index++} OFFSET $${index}`;
    params.push(limit, offset);

    try {
      const { rows } = await pool.query(query, params);

      if (res && res.cache) {
        await res.cache.set(cacheKey, rows);
        res.set('Cache-Control', 'public, max-age=3600');
      }

      return { products: rows, total: rows.length };
    } catch (error) {
      console.error('Error filtering products:', error);
      throw new Error('Error filtering products');
    }
  }

  // Obtener colecciones por marca
  static async getCollectionsByBrand(brand) {
    try {
      const query = `
        SELECT DISTINCT UPPER(coleccion) AS coleccion
        FROM productos
        WHERE codmarca = $1
        AND nombre IS NOT NULL
        AND coleccion NOT IN ('MARRAKESH','COSY', 'DUKE', 'POLAR')
      `;

      const { rows } = await pool.query(query, [brand]);
      const collections = rows.map(row => row.coleccion);

      return collections;
    } catch (error) {
      console.error('Error fetching collections by brand:', error);
      throw new Error('Error fetching collections by brand');
    }
  }

  static async searchCollections(searchTerm) {
    try {
      const query = `
        SELECT DISTINCT UPPER(coleccion) AS coleccion
        FROM productos
        WHERE coleccion ILIKE $1
        AND nombre IS NOT NULL
      `;
      const searchValue = `%${searchTerm}%`;
      const { rows } = await pool.query(query, [searchValue]);
      return rows.map(row => row.coleccion);
    } catch (error) {
      console.error('Error searching collections:', error);
      throw new Error('Error searching collections');
    }
  }

  // Buscar tipos de tela por término
  static async searchFabricTypes(searchTerm) {
    try {
      const query = `
        SELECT DISTINCT UPPER(tipo) AS tipo
        FROM productos
        WHERE tipo ILIKE $1
        AND nombre IS NOT NULL
      `;
      const searchValue = `%${searchTerm}%`;
      const { rows } = await pool.query(query, [searchValue]);
      return rows.map(row => row.tipo);
    } catch (error) {
      console.error('Error searching fabric types:', error);
      throw new Error('Error searching fabric types');
    }
  }

  // Buscar patrones de tela por término
  static async searchFabricPatterns(searchTerm) {
    try {
      const query = `
        SELECT DISTINCT UPPER(estilo) AS estilo
        FROM productos
        WHERE estilo ILIKE $1
        AND nombre IS NOT NULL
      `;
      const searchValue = `%${searchTerm}%`;
      const { rows } = await pool.query(query, [searchValue]);
      return rows.map(row => row.estilo);
    } catch (error) {
      console.error('Error searching fabric patterns:', error);
      throw new Error('Error searching fabric patterns');
    }
  }

  static async getFiltersByBrand(brand) {
    try {
      const { rows: collections } = await pool.query('SELECT DISTINCT coleccion FROM productos WHERE codmarca = $1', [brand]);
      const { rows: fabricTypes } = await pool.query('SELECT DISTINCT tipo FROM productos WHERE codmarca = $1', [brand]);
      const { rows: fabricPatterns } = await pool.query('SELECT DISTINCT estilo FROM productos WHERE codmarca = $1', [brand]);
      const { rows: martindaleValues } = await pool.query('SELECT DISTINCT martindale FROM productos WHERE codmarca = $1', [brand]);

      return {
        collections: collections.map(c => c.coleccion),
        fabricTypes: fabricTypes.map(f => f.tipo),
        fabricPatterns: fabricPatterns.map(p => p.estilo),
        martindaleValues: martindaleValues.map(m => m.martindale),
      };
    } catch (error) {
      console.error('Error fetching filters by brand:', error);
      throw new Error('Error fetching filters by brand');
    }
  }

}
