import NodeCache from 'node-cache';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Inicializa NodeCache con un TTL (tiempo de vida en segundos)
const cache = new NodeCache({ stdTTL: 3600 });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export class ProductModel {
  // Obtener todos los productos con caché en NodeCache
  static async getAll({ CodFamil, CodSubFamil, requiredLimit = 16, offset = 0 }) {
    const cacheKey = `products:${CodFamil || 'all'}:${CodSubFamil || 'all'}:${offset}:${requiredLimit}`;
    const cachedProducts = cache.get(cacheKey);

    if (cachedProducts) {
      return cachedProducts;
    }

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

      cache.set(cacheKey, accumulatedProducts.slice(0, requiredLimit));
      return accumulatedProducts.slice(0, requiredLimit);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Error fetching products');
    }
  }

  // Obtener un producto por ID con caché en NodeCache
  static async getById({ id }) {
    const cacheKey = `product:${id}`;

    const cachedProduct = cache.get(cacheKey);
    if (cachedProduct) {
      return cachedProduct;
    }

    try {
      const { rows } = await pool.query('SELECT * FROM productos WHERE "codprodu" = $1;', [id]);
      if (rows.length > 0) {
        cache.set(cacheKey, rows[0]);
        return rows[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error('Error fetching product by ID');
    }
  }

  // Crear un nuevo producto e invalidar la caché
  static async create({ input }) {
    const { CodProdu, DesProdu, CodFamil, Comentario, UrlImagen } = input;

    try {
      const { rows } = await pool.query(
        `INSERT INTO productos ("codprodu", "desprodu", "codfamil", "comentario", "urlimagen")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`,
        [CodProdu, DesProdu, CodFamil, Comentario, UrlImagen]
      );

      cache.flushAll();
      return rows[0];
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Error creating product');
    }
  }

  // Actualizar un producto e invalidar la caché
  static async update({ id, input }) {
    const fields = Object.keys(input).map((key, index) => `"${key}" = $${index + 2}`).join(", ");
    const values = Object.values(input);

    try {
      const { rows } = await pool.query(
        `UPDATE productos SET ${fields} WHERE "codprodu" = $1 RETURNING *;`,
        [id, ...values]
      );

      cache.del(`product:${id}`);
      cache.flushAll();
      return rows[0];
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Error updating product');
    }
  }

  // Eliminar un producto e invalidar la caché
  static async delete({ id }) {
    try {
      const { rows } = await pool.query('DELETE FROM productos WHERE "codprodu" = $1 RETURNING *;', [id]);

      cache.del(`product:${id}`);
      cache.flushAll();
      return rows[0];
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Error deleting product');
    }
  }

  // Buscar productos con caché en NodeCache
  static async search({ query, limit = 10, offset = 0 }) {
    const cacheKey = `search:${query}:${offset}:${limit}`;

    const cachedSearchResults = cache.get(cacheKey);
    if (cachedSearchResults) {
      return cachedSearchResults;
    }

    const searchQuery = `
      SELECT DISTINCT ON ("nombre") *
      FROM productos
      WHERE "nombre" ILIKE $1
        AND "nombre" IS NOT NULL 
        AND "nombre" != '' 
      ORDER BY "nombre", "codprodu"
      LIMIT $2 OFFSET $3;
    `;
    const searchString = `%${query}%`;

    try {
      const { rows } = await pool.query(searchQuery, [searchString, limit, offset]);
      cache.set(cacheKey, { products: rows, total: rows.length });
      return { products: rows, total: rows.length };
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Error searching products');
    }
  }

  // Obtener productos por familia
  static async getByCodFamil(codfamil) {
    const cacheKey = `products:family:${codfamil}`;

    const cachedProducts = cache.get(cacheKey);
    if (cachedProducts) {
      return cachedProducts;
    }

    try {
      const { rows } = await pool.query('SELECT * FROM productos WHERE "codfamil" = $1;', [codfamil]);
      cache.set(cacheKey, rows);
      return rows;
    } catch (error) {
      console.error('Error fetching products by family:', error);
      throw new Error('Error fetching products by family');
    }
  }

  // Obtener filtros con caché en NodeCache
  static async getFilters() {
    const cacheKey = 'filters';

    const cachedFilters = cache.get(cacheKey);
    if (cachedFilters) {
      return cachedFilters;
    }

    try {
      const { rows: brands } = await pool.query('SELECT DISTINCT codmarca FROM productos');
      const { rows: collections } = await pool.query('SELECT DISTINCT coleccion, codmarca FROM productos');
      const { rows: fabricTypes } = await pool.query('SELECT DISTINCT tipo FROM productos');
      const { rows: fabricPatterns } = await pool.query('SELECT DISTINCT estilo FROM productos');
      const { rows: martindaleValues } = await pool.query('SELECT DISTINCT martindale FROM productos');
      const { rows: colors } = await pool.query('SELECT DISTINCT colorprincipal FROM productos');
      const { rows: tonalidades } = await pool.query('SELECT DISTINCT tonalidad FROM productos');

      const filters = {
        brands: brands.map(b => b.codmarca),
        collections: collections.map(c => c.coleccion),
        fabricTypes: fabricTypes.map(f => f.tipo),
        fabricPatterns: fabricPatterns.map(f => f.estilo),
        martindaleValues: martindaleValues.map(m => m.martindale),
        colors: colors.map(c => c.colorprincipal),
        tonalidades: tonalidades.map(t => t.tonalidad),
      };

      cache.set(cacheKey, filters);
      return filters;
    } catch (error) {
      console.error('Error fetching filters:', error);
      throw new Error('Error fetching filters');
    }
  }

  // Filtro para productos por tipo con caché
  static async getByType({ type, limit = 16, offset = 0 }) {
    const cacheKey = `products:type:${type}:${offset}:${limit}`;

    const cachedProducts = cache.get(cacheKey);
    if (cachedProducts) {
      return cachedProducts;
    }

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
      cache.set(cacheKey, rows);
      return { products: rows, total: rows.length };
    } catch (error) {
      console.error('Error filtering products by type:', error);
      throw new Error('Error filtering products by type');
    }
  }

  // Filtros de productos aplicados con caché
  static async filter(filters, limit = 16, offset = 0) {
    console.log('Filters received:', filters); // Log para revisar qué está recibiendo el servidor
    const cacheKey = `products:filter:${JSON.stringify(filters)}:${offset}:${limit}`;

    const cachedProducts = cache.get(cacheKey);
    if (cachedProducts) {
      return cachedProducts;
    }

    let query = 'SELECT DISTINCT ON ("nombre") * FROM productos WHERE "nombre" IS NOT NULL AND "nombre" != \'\'';
    let params = [];
    let index = 1;

    // Aplicar filtro por marca si está presente
    if (filters.brand && filters.brand.length > 0) {
      // Convertir el array en formato PostgreSQL (array literal) con llaves
      query += ` AND "codmarca" = ANY($${index++})`;
      params.push(`{${filters.brand.join(',')}}`);
    }

    // Aplicar filtro por colección si está presente
    if (filters.collection && filters.collection.length > 0) {
      query += ` AND "coleccion" ILIKE $${index++}`;
      params.push(`%${filters.collection}%`);
    }

    // Aplicar filtro por color si está presente
    if (filters.color && filters.color.length > 0) {
      // Convertir el array en formato PostgreSQL (array literal) con llaves
      query += ` AND "colorprincipal" = ANY($${index++})`;
      params.push(`{${filters.color.join(',')}}`);
    }

    // Aplicar filtro por tipo de tela si está presente
    if (filters.fabricType && filters.fabricType.length > 0) {
      // Convertir el array en formato PostgreSQL (array literal) con llaves
      query += ` AND "tipo" = ANY($${index++})`;
      params.push(`{${filters.fabricType.join(',')}}`);
    }

    // Aplicar filtro por estilo específico desde el submenú
    if (filters.fabricPattern && filters.fabricPattern.length > 0) {
      // Convertir el array en formato PostgreSQL (array literal) con llaves
      query += ` AND "estilo" = ANY($${index++})`;
      params.push(`{${filters.fabricPattern.join(',')}}`);
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
      // Convertir el array en formato PostgreSQL (array literal) con llaves
      query += ` AND "martindale" = ANY($${index++})`;
      params.push(`{${filters.martindale.join(',')}}`);
    }

    query += ` LIMIT $${index++} OFFSET $${index}`;
    params.push(limit, offset);

    try {
      const { rows } = await pool.query(query, params);
      cache.set(cacheKey, rows);
      return { products: rows, total: rows.length };
    } catch (error) {
      console.error('Error filtering products:', error);
      throw new Error('Error filtering products');
    }
  }

  static async getCollectionsByBrand(brand) {
    const cacheKey = `collections:brand:${brand}`;

    // Intentar obtener los datos desde la caché
    const cachedCollections = cache.get(cacheKey);
    if (cachedCollections) {
      return cachedCollections;
    }

    try {
      const query = `
            SELECT DISTINCT UPPER(coleccion) AS coleccion
            FROM productos
            WHERE codmarca = $1
            AND nombre IS NOT NULL
        `;

      const { rows } = await pool.query(query, [brand]);

      const collections = rows.map(row => row.coleccion);

      // Guardar en la caché
      cache.set(cacheKey, collections);

      return collections;
    } catch (error) {
      console.error('Error fetching collections by brand:', error);
      throw new Error('Error fetching collections by brand');
    }
  }


}
