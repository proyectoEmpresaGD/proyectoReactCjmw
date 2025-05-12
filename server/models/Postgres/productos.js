import pg from 'pg';
import dotenv from 'dotenv';
import { ImagenModel } from './imagenes.js';
dotenv.config();


const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export class ProductModel {

  static excludedNames = ["DAMASCO", "STORK", "BAMBOO", "TARIFA", "PONIENTE", "MARRAKESH"];

  static getExcludedNamesClause(startIndex = 1) {
    const placeholders = this.excludedNames.map((_, i) => `$${i + startIndex}`);
    return {
      clause: `"nombre" NOT IN (${placeholders.join(', ')})`,
      values: [...this.excludedNames],
    };
  }


  static async getAll({ CodFamil, CodSubFamil, requiredLimit = 16, offset = 0 }) {
    let accumulatedProducts = [];

    try {
      while (accumulatedProducts.length < requiredLimit) {
        let query = 'SELECT DISTINCT ON ("nombre") * FROM productos WHERE "nombre" IS NOT NULL AND "nombre" != \'\'';
        const params = [];
        let index = 1;

        if (CodFamil) {
          query += ` AND "codfamil" = $${index++}`;
          params.push(CodFamil);
        }

        if (CodSubFamil) {
          query += ` AND "codsubfamil" = $${index++}`;
          params.push(CodSubFamil);
        }

        const exclusion = this.getExcludedNamesClause(index);
        query += ` AND ${exclusion.clause}`;
        params.push(...exclusion.values);
        index += exclusion.values.length;

        query += ` LIMIT $${index++} OFFSET $${index++}`;
        params.push(requiredLimit, offset);

        const { rows } = await pool.query(query, params);
        if (rows.length === 0) break;

        accumulatedProducts.push(...rows);
        offset += rows.length;
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

  static async search({ query, limit = 10, offset = 0, res }) {
    if (!query || query.trim() === '') {
      return { products: [], total: 0 };
    }

    const searchString = `%${query}%`;
    let sql = `
      SELECT *, similarity(unaccent(UPPER("nombre")), unaccent(UPPER($1))) AS sim
      FROM productos
      WHERE (
        unaccent(UPPER("nombre")) LIKE unaccent(UPPER($1)) OR
        unaccent(UPPER("coleccion")) LIKE unaccent(UPPER($1))
      )
      AND "nombre" IS NOT NULL AND "nombre" != ''
    `;

    const exclusion = this.getExcludedNamesClause(2);
    sql += ` AND ${exclusion.clause}`;
    sql += ' ORDER BY sim DESC, "nombre", "codprodu" LIMIT $' + (2 + exclusion.values.length) + ' OFFSET $' + (3 + exclusion.values.length);

    const params = [searchString, ...exclusion.values, limit, offset];

    const { rows } = await pool.query(sql, params);

    const filteredRows = rows.filter(r => r.sim >= 0.3 || rows[0]);
    const defaultImageUrl = 'https://bassari.eu/ImagenesTelasCjmw/Iconos/ProductoNoEncontrado.webp';

    const productsWithImages = await Promise.all(
      filteredRows.map(async (product) => {
        let imageObj = await ImagenModel.getByCodproduAndCodclaarchivo({
          codprodu: product.codprodu,
          codclaarchivo: 'Baja',
          res,
        });

        return {
          ...product,
          image: imageObj?.ficadjunto ? `https://${imageObj.ficadjunto}` : defaultImageUrl,
        };
      })
    );

    return { products: productsWithImages, total: productsWithImages.length };
  }

  static async getByCodFamil(codfamil) {
    const exclusion = this.getExcludedNamesClause(2);
    const query = `
      SELECT * FROM productos
      WHERE "codfamil" = $1 AND "nombre" IS NOT NULL AND "nombre" != ''
      AND ${exclusion.clause}
    `;
    const { rows } = await pool.query(query, [codfamil, ...exclusion.values]);
    return rows;
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
  static async getByType({ type, limit = 16, offset = 0 }) {
    let query = 'SELECT DISTINCT ON ("nombre") * FROM productos WHERE "nombre" IS NOT NULL AND "nombre" != \'\'';
    const params = [];
    let index = 1;

    if (type === 'papeles') {
      query += ` AND "tipo" = 'WALLPAPER'`;
    } else if (type === 'telas') {
      query += ` AND "tipo" != 'WALLPAPER'`;
    }

    const exclusion = this.getExcludedNamesClause(index);
    query += ` AND ${exclusion.clause}`;
    params.push(...exclusion.values);
    index += exclusion.values.length;

    query += ` LIMIT $${index++} OFFSET $${index++}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return { products: rows, total: rows.length };
  }

  static async filter(filters, limit = 16, offset = 0) {
    let query = 'SELECT DISTINCT ON ("nombre") * FROM productos WHERE "nombre" IS NOT NULL AND "nombre" != \'\'';
    const params = [];
    let index = 1;

    if (filters.brand?.length) {
      query += ` AND "codmarca" = ANY($${index++})`;
      params.push(filters.brand);
    }
    if (filters.collection?.length) {
      query += ` AND "coleccion" ILIKE $${index++}`;
      params.push(`%${filters.collection}%`);
    }
    if (filters.color?.length) {
      query += ` AND "colorprincipal" = ANY($${index++})`;
      params.push(filters.color);
    }
    if (filters.fabricType?.length) {
      query += ` AND "tipo" = ANY($${index++})`;
      params.push(filters.fabricType);
    }
    if (filters.fabricPattern?.length) {
      query += ` AND "estilo" = ANY($${index++})`;
      params.push(filters.fabricPattern);
    }
    if (filters.uso?.length) {
      const usoConditions = [];
      if (filters.uso.includes("FR")) usoConditions.push(`"uso" ILIKE '%FR%'`);
      if (filters.uso.includes("OUTDOOR")) usoConditions.push(`"uso" ILIKE '%OUTDOOR%'`);
      if (usoConditions.length) query += ` AND (${usoConditions.join(' OR ')})`;
    }
    if (filters.martindale?.length) {
      query += ` AND "martindale" = ANY($${index++})`;
      params.push(filters.martindale);
    }

    const exclusion = this.getExcludedNamesClause(index);
    query += ` AND ${exclusion.clause}`;
    params.push(...exclusion.values);
    index += exclusion.values.length;

    query += ` LIMIT $${index++} OFFSET $${index++}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return { products: rows, total: rows.length };
  }

  // Obtener colecciones por marca
  static async getCollectionsByBrand(brand) {
    const exclusion = this.getExcludedNamesClause(2);
    const query = `
      SELECT DISTINCT UPPER(coleccion) AS coleccion
      FROM productos
      WHERE codmarca = $1 AND nombre IS NOT NULL AND ${exclusion.clause}
      AND coleccion NOT IN ('MARRAKESH', 'DUKE', 'POLAR', 'COSY')
    `;
    const { rows } = await pool.query(query, [brand, ...exclusion.values]);
    return rows.map(row => row.coleccion);
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

  static async getByCollectionExact(coleccion) {
    const exclusion = this.getExcludedNamesClause(2);
    const query = `
    SELECT DISTINCT ON ("nombre") *
    FROM productos
    WHERE coleccion = $1 AND nombre IS NOT NULL AND ${exclusion.clause}
    ORDER BY "nombre", "codprodu"
  `;
    const { rows } = await pool.query(query, [coleccion, ...exclusion.values]);
    return rows;
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