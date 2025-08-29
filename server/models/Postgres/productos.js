/**
 * ProductModel
 * ------------
 * Capa de acceso a datos para la tabla `productos` y búsquedas auxiliares.
 * Incluye utilidades para exclusiones de nombres y adjunta imágenes cuando procede.
 *
 * Notas:
 * - Se usa `unaccent(upper(...))` para búsquedas case/diacritic-insensitive.
 * - Donde se adjuntan imágenes se utilizan peticiones a ImagenModel por "Baja" o "Buena".
 * - Todas las funciones lanzan Error en caso de fallo; el controller es quien decide el código HTTP.
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { ImagenModel } from './imagenes.js';

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export class ProductModel {
  // ---------------------------------------------------------------------------
  // 0) CONSTANTES Y HELPERS
  // ---------------------------------------------------------------------------

  /** Lista de nombres a excluir en casi todas las consultas públicas */
  static excludedNames = [
    'DAMASCO',
    'BAMBOO',
    'MARRAKESH',
    'CLEMENTINE'
  ];

  /**
   * Construye una cláusula SQL y su array de valores para excluir por nombre.
   * @param {number} startIndex - Índice base para los placeholders ($1, $2, ...)
   * @returns {{ clause: string, values: any[] }}
   */
  static getExcludedNamesClause(startIndex = 1) {
    const placeholders = this.excludedNames.map((_, i) => `$${i + startIndex}`);
    return {
      clause: `"nombre" NOT IN (${placeholders.join(', ')})`,
      values: [...this.excludedNames],
    };
  }

  /**
   * Helper: adjunta URLs de imagen (Buena y/o Baja) a un producto.
   * No lanza si falla la imagen: rellena con null.
   * @param {object} product
   * @param {('Buena'|'Baja'|('Buena'|'Baja')[])} tipos - qué calidades traer
   * @returns {Promise<object>}
   */
  static async attachImages(product, tipos = ['Baja']) {
    const want = Array.isArray(tipos) ? tipos : [tipos];
    try {
      const lookups = await Promise.all(
        want.map(codclaarchivo =>
          ImagenModel.getByCodproduAndCodclaarchivo({
            codprodu: product.codprodu,
            codclaarchivo
          })
        )
      );
      const result = { ...product };
      lookups.forEach((img, idx) => {
        const quality = want[idx];
        const key = quality === 'Buena' ? 'imageBuena' : 'imageBaja';
        result[key] = img?.ficadjunto ? `https://${img.ficadjunto}` : null;
      });
      return result;
    } catch (err) {
      // Falla silenciosa: mantenemos la fila aunque no haya imagen
      return { ...product, imageBuena: null, imageBaja: null };
    }
  }

  // ---------------------------------------------------------------------------
  // 1) LECTURAS BÁSICAS / LISTADOS
  // ---------------------------------------------------------------------------

  /**
   * Listado paginado simple (con DISTINCT ON nombre), con exclusiones por nombre.
   * @param {{CodFamil?:string, CodSubFamil?:string, requiredLimit?:number, offset?:number}}
   * @returns {Promise<object[]>}
   */
  static async getAll({ CodFamil, CodSubFamil, requiredLimit = 16, offset = 0 }) {
    const accumulatedProducts = [];

    try {
      while (accumulatedProducts.length < requiredLimit) {
        let query =
          'SELECT DISTINCT ON ("nombre") * ' +
          "FROM productos WHERE \"nombre\" IS NOT NULL AND \"nombre\" <> ''";
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

  /**
   * Obtiene un producto por ID exacto.
   * No incluye imágenes (el controller puede adjuntarlas si lo desea).
   * @param {{id:string, res?:any}}
   * @returns {Promise<object|null>}
   */
  static async getById({ id, res }) {
    // Si hay capa de cache en res, la respeta
    const cacheKey = `product:${id}`;
    if (res?.cache) {
      const cached = await res.cache.get(cacheKey);
      if (cached) {
        res.set?.('Cache-Control', 'public, max-age=3600');
        return cached;
      }
    }

    const { rows } = await pool.query(
      'SELECT * FROM productos WHERE "codprodu" = $1;',
      [id]
    );

    if (rows.length > 0) {
      if (res?.cache) await res.cache.set(cacheKey, rows[0]);
      res?.set?.('Cache-Control', 'public, max-age=3600');
      return rows[0];
    }
    return null;
  }

  /**
   * Obtiene productos por familia (codfamil) con exclusiones y nombre no vacío.
   * @param {string} codfamil
   * @returns {Promise<object[]>}
   */
  static async getByCodFamil(codfamil) {
    const exclusion = this.getExcludedNamesClause(2);
    const query = `
      SELECT *
      FROM productos
      WHERE "codfamil" = $1
        AND "nombre" IS NOT NULL
        AND "nombre" <> ''
        AND ${exclusion.clause}
    `;
    const { rows } = await pool.query(query, [codfamil, ...exclusion.values]);
    return rows;
  }

  /**
   * Devuelve productos por tipo de producto (papeles/telas).
   * @param {{type:'papeles'|'telas', limit?:number, offset?:number}}
   * @returns {Promise<{products: object[], total: number}>}
   */
  static async getByType({ type, limit = 16, offset = 0 }) {
    let query =
      'SELECT DISTINCT ON ("nombre") * ' +
      "FROM productos WHERE \"nombre\" IS NOT NULL AND \"nombre\" <> ''";
    const params = [];
    let index = 1;

    if (type === 'papeles') {
      query += ` AND "tipo" = 'WALLPAPER'`;
    } else if (type === 'telas') {
      query += ` AND "tipo" <> 'WALLPAPER'`;
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

  /**
   * Devuelve todos los productos de una colección exacta (case-sensitive por diseño original).
   * @param {string} coleccion
   * @returns {Promise<object[]>}
   */
  static async getByCollectionExact(coleccion) {
    const exclusion = this.getExcludedNamesClause(2);
    const query = `
      SELECT DISTINCT ON ("nombre") *
      FROM productos
      WHERE coleccion = $1
        AND nombre IS NOT NULL
        AND ${exclusion.clause}
      ORDER BY "nombre", "codprodu"
    `;
    const { rows } = await pool.query(query, [coleccion, ...exclusion.values]);
    return rows;
  }

  /**
   * Devuelve productos de la misma colección excluyendo un codprodu concreto.
   * Solo productos con imagen "Buena".
   * @param {{coleccion:string, excludeCodprodu:string}}
   * @returns {Promise<object[]>} productos con imageBuena/imageBaja cuando sea posible
   */
  static async getByCollectionExcluding({ coleccion, excludeCodprodu }) {
    const exclusion = this.getExcludedNamesClause(3);
    const query = `
      SELECT DISTINCT ON (p.nombre) p.*
      FROM productos p
      WHERE lower(p.coleccion) = lower($1)
        AND p.codprodu <> $2
        AND p.nombre IS NOT NULL
        AND p.nombre <> ''
        AND ${exclusion.clause}
        AND EXISTS (
          SELECT 1 FROM imagenesocproductos i
           WHERE i.codprodu = p.codprodu AND i.codclaarchivo = 'Buena'
        )
    `;
    const values = [coleccion, excludeCodprodu, ...exclusion.values];
    const { rows } = await pool.query(query, values);

    // Adjunta imágenes (Buena y Baja si están)
    const withImages = await Promise.all(
      rows.map((p) => this.attachImages(p, ['Buena', 'Baja']))
    );
    return withImages;
  }

  // ProductModel.js
  // ProductModel.js
  // ProductModel.js
  static async getProductByCollection({ coleccion }) {
    const sql = `
    SELECT DISTINCT ON (p.nombre) p.*
    FROM productos p
    WHERE TRIM(p.coleccion) ILIKE TRIM($1)
      AND p.nombre IS NOT NULL
      AND p.nombre <> ''
    ORDER BY p.nombre, p.codprodu;
  `;

    const { rows } = await pool.query(sql, [coleccion]);

    // Asegúrate de que attachImages complete imageBuena / imageBaja
    const withImages = await Promise.all(
      rows.map((p) => this.attachImages(p, ['Buena', 'Baja']))
    );

    return withImages;
  }

  /**
   * Productos similares por estilo, excluyendo el nombre y la colección concretos.
   * Garantiza que exista una imagen "Baja".
   * @param {{estilo:string, excludeNombre:string, excludeColeccion:string, limit?:number}}
   * @returns {Promise<object[]>}
   */
  static async getSimilarByStyle({ estilo, excludeNombre, excludeColeccion, limit = 4 }) {
    const exclusion = this.getExcludedNamesClause(5);
    const query = `
      SELECT DISTINCT ON (p.nombre) p.*
      FROM productos p
      WHERE lower(p.estilo) = lower($1)
        AND lower(p.nombre) <> lower($2)
        AND p.coleccion <> $3
        AND ${exclusion.clause}
        AND EXISTS (
          SELECT 1 FROM imagenesocproductos i
           WHERE i.codprodu = p.codprodu AND i.codclaarchivo = 'Baja'
        )
      LIMIT $4
    `;
    const values = [estilo, excludeNombre, excludeColeccion, limit, ...exclusion.values];
    const { rows } = await pool.query(query, values);

    const withImages = await Promise.all(
      rows.map((p) => this.attachImages(p, ['Buena', 'Baja']))
    );
    return withImages;
  }

  // ---------------------------------------------------------------------------
  // 2) BÚSQUEDAS (CLÁSICA / PARA HEADER / PARA CARDPRODUCT)
  // ---------------------------------------------------------------------------

  /**
   * Búsqueda "clásica" (nombre, colección, tonalidad) con similarity.
   * Devuelve productos con imagen "Baja".
   * @param {{query:string, limit?:number, offset?:number, res?:any}}
   * @returns {Promise<{products: object[], total:number}>}
   */
  static async search({ query, limit = 10, offset = 0, res }) {
    if (!query || query.trim() === '') {
      return { products: [], total: 0 };
    }
    const searchString = `%${query}%`;
    const exclusion = this.getExcludedNamesClause(2);

    const baseSql = `
      SELECT
        *,
        similarity(
          unaccent(upper(nombre || ' ' || COALESCE(tonalidad, ''))),
          unaccent(upper($1))
        ) AS sim
      FROM productos
      WHERE (
        unaccent(upper(nombre)) LIKE unaccent(upper($1))
        OR unaccent(upper(coleccion)) LIKE unaccent(upper($1))
        OR unaccent(upper(tonalidad)) LIKE unaccent(upper($1))
        OR unaccent(upper(nombre || ' ' || COALESCE(tonalidad, ''))) LIKE unaccent(upper($1))
      )
      AND nombre IS NOT NULL AND nombre <> ''
      AND ${exclusion.clause}
      ORDER BY sim DESC, nombre, codprodu
      LIMIT $${2 + exclusion.values.length}
      OFFSET $${3 + exclusion.values.length}
    `;
    const params = [searchString, ...exclusion.values, limit, offset];

    const { rows } = await pool.query(baseSql, params);
    const filteredRows = rows.filter(r => r.sim >= 0.3 || rows[0]);

    const defaultImg = 'https://bassari.eu/ImagenesTelasCjmw/Iconos/ProductoNoEncontrado.webp';
    const productsWithImages = await Promise.all(
      filteredRows.map(async (product) => {
        try {
          const img = await ImagenModel.getByCodproduAndCodclaarchivo({
            codprodu: product.codprodu,
            codclaarchivo: 'Baja',
            res
          });
          return { ...product, image: img?.ficadjunto ? `https://${img.ficadjunto}` : defaultImg };
        } catch {
          return { ...product, image: defaultImg };
        }
      })
    );

    return { products: productsWithImages, total: productsWithImages.length };
    // (El controller se encarga de devolver 200 con [] si no hay resultados)
  }

  /**
   * Búsqueda rápida (para SearchBar/header): productos + colecciones.
   * - Productos: por nombre/tonalidad, DISTINCT ON nombre.
   * - Colecciones: por LIKE en coleccion.
   * @param {{query:string, prodLimit?:number, colLimit?:number}}
   * @returns {Promise<{products: object[], collections: string[]}>}
   */
  static async searchQuick({ query, prodLimit = 8, colLimit = 6 }) {
    const term = (query || '').trim();
    if (!term) return { products: [], collections: [] };
    const norm = `%${term}%`;

    // Productos
    const exclusion = this.getExcludedNamesClause(2);
    const sqlProducts = `
      SELECT DISTINCT ON (p.nombre)
        p.codprodu, p.nombre, p.coleccion, p.tonalidad
      FROM productos p
      WHERE (
        unaccent(upper(p.nombre))   LIKE unaccent(upper($1))
        OR unaccent(upper(p.tonalidad)) LIKE unaccent(upper($1))
      )
      AND p.nombre IS NOT NULL
      AND p.nombre <> ''
      AND ${exclusion.clause}
      ORDER BY p.nombre, p.codprodu
      LIMIT $${2 + exclusion.values.length}
    `;
    const prodParams = [norm, ...exclusion.values, prodLimit];
    const { rows: prodRows } = await pool.query(sqlProducts, prodParams);

    // Mínima imagen 'Baja' para sugerencia (opcional)
    const products = await Promise.all(
      prodRows.map(async (p) => {
        try {
          const low = await ImagenModel.getByCodproduAndCodclaarchivo({
            codprodu: p.codprodu,
            codclaarchivo: 'Baja'
          });
          return { ...p, image: low?.ficadjunto ? `https://${low.ficadjunto}` : null };
        } catch {
          return { ...p, image: null };
        }
      })
    );

    // Colecciones
    const sqlCollections = `
      SELECT DISTINCT upper(coleccion) as coleccion
      FROM productos
      WHERE coleccion ILIKE $1
        AND nombre IS NOT NULL
      LIMIT ${colLimit}
    `;
    const { rows: colRows } = await pool.query(sqlCollections, [norm]);
    const collections = colRows.map(r => r.coleccion).filter(Boolean).slice(0, colLimit);

    return { products, collections };
  }

  /**
   * Búsqueda paginada para CardProduct (solo productos).
   * - Busca por nombre/tonalidad.
   * - Si 0 resultados → fallback por colección EXACTA (case-insensitive).
   * @param {{query:string, limit?:number, offset?:number}}
   * @returns {Promise<{products: object[], total:number}>}
   */
  static async searchProducts({ query, limit = 16, offset = 0 }) {
    const term = (query || '').trim();
    if (!term) return { products: [], total: 0 };
    const norm = `%${term}%`;

    const exclusion = this.getExcludedNamesClause(3);
    const baseSql = `
      SELECT p.*
      FROM productos p
      WHERE (
        unaccent(upper(p.nombre))   LIKE unaccent(upper($1))
        OR unaccent(upper(p.tonalidad)) LIKE unaccent(upper($1))
      )
      AND p.nombre IS NOT NULL
      AND p.nombre <> ''
      AND ${exclusion.clause}
      ORDER BY p.nombre, p.codprodu
      LIMIT $2
      OFFSET $${3 + exclusion.values.length}
    `;
    const params = [norm, limit, ...exclusion.values, offset];

    const { rows } = await pool.query(baseSql, params);

    if (rows.length === 0) {
      // Fallback por colección exacta (case-insensitive)
      const sqlCol = `
        SELECT p.*
        FROM productos p
        WHERE lower(p.coleccion) = lower($1)
          AND p.nombre IS NOT NULL
          AND p.nombre <> ''
          AND ${exclusion.clause}
        ORDER BY p.nombre, p.codprodu
        LIMIT $2
        OFFSET $${3 + exclusion.values.length}
      `;
      const paramsCol = [term, limit, ...exclusion.values, offset];
      const { rows: colRows } = await pool.query(sqlCol, paramsCol);
      return { products: colRows, total: colRows.length };
    }

    return { products: rows, total: rows.length };
  }

  // ---------------------------------------------------------------------------
  // 3) BÚSQUEDAS AUXILIARES (colecciones, tipos, estilos)
  // ---------------------------------------------------------------------------

  /**
   * Autocompletado de colecciones (ILIKE).
   * @param {string} searchTerm
   * @returns {Promise<string[]>}
   */
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

  /**
   * Autocompletado de tipos (ILIKE).
   * @param {string} searchTerm
   * @returns {Promise<string[]>}
   */
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

  /**
   * Autocompletado de patrones/estilos (ILIKE).
   * @param {string} searchTerm
   * @returns {Promise<string[]>}
   */
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

  // ---------------------------------------------------------------------------
  // 4) FILTROS (GENERALES Y POR MARCA)
  // ---------------------------------------------------------------------------

  /**
   * Devuelve los valores distintos para construir los filtros del catálogo.
   * Incluye `mantenimiento::text` (ej. XML a texto) para poder hacer DISTINCT.
   * @returns {Promise<{
   *   brands:string[], collections:string[], fabricTypes:string[], fabricPatterns:string[],
   *   martindaleValues:any[], colors:string[], tonalidades:string[], mantenimientos:string[]
   * }>}
   */
  static async getFilters() {
    try {
      const { rows: brands } = await pool.query('SELECT DISTINCT codmarca FROM productos');
      const { rows: collections } = await pool.query('SELECT DISTINCT coleccion FROM productos');
      const { rows: fabricTypes } = await pool.query('SELECT DISTINCT tipo FROM productos');
      const { rows: fabricPatterns } = await pool.query('SELECT DISTINCT estilo FROM productos');
      const { rows: martindale } = await pool.query('SELECT DISTINCT martindale FROM productos');
      const { rows: colors } = await pool.query('SELECT DISTINCT colorprincipal FROM productos');
      const { rows: tonalidades } = await pool.query('SELECT DISTINCT tonalidad FROM productos');

      // mantenimiento a texto para DISTINCT
      const { rows: mantenimientos } = await pool.query(`
        SELECT DISTINCT mantenimiento::text AS mantenimiento
        FROM productos
        WHERE mantenimiento IS NOT NULL
      `);

      return {
        brands: brands.map(b => b.codmarca),
        collections: collections.map(c => c.coleccion),
        fabricTypes: fabricTypes.map(f => f.tipo),
        fabricPatterns: fabricPatterns.map(f => f.estilo),
        martindaleValues: martindale.map(m => m.martindale),
        colors: colors.map(c => c.colorprincipal),
        tonalidades: tonalidades.map(t => t.tonalidad),
        mantenimientos: mantenimientos.map(m => m.mantenimiento).filter(Boolean),
      };
    } catch (error) {
      console.error('Error fetching filters:', error);
      throw new Error('Error fetching filters');
    }
  }

  /**
   * Filtro general (brand, collection, color, tipo, estilo, uso, martindale, mantenimiento).
   * @param {object} filters
   * @param {number} limit
   * @param {number} offset
   * @returns {Promise<{products:object[], total:number}>}
   */
  static async filter(filters, limit = 16, offset = 0) {
    let query =
      'SELECT DISTINCT ON ("nombre") * ' +
      "FROM productos WHERE \"nombre\" IS NOT NULL AND \"nombre\" <> ''";
    const params = [];
    let index = 1;

    // 1) Marca
    if (filters.brand?.length) {
      query += ` AND "codmarca" = ANY($${index++})`;
      params.push(filters.brand);
    }
    // 2) Colección (ILIKE ANY)
    if (filters.collection?.length) {
      query += ` AND "coleccion" ILIKE ANY($${index++})`;
      params.push(filters.collection.map(c => `%${c}%`));
    }
    // 3) Color
    if (filters.color?.length) {
      query += ` AND "colorprincipal" = ANY($${index++})`;
      params.push(filters.color);
    }
    // 4) Tipo
    if (filters.fabricType?.length) {
      query += ` AND "tipo" = ANY($${index++})`;
      params.push(filters.fabricType);
    }
    // 5) Estilo
    if (filters.fabricPattern?.length) {
      query += ` AND "estilo" = ANY($${index++})`;
      params.push(filters.fabricPattern);
    }
    // 6) Uso (FR / OUTDOOR / IMO)
    if (filters.uso?.length) {
      const usoConds = [];
      if (filters.uso.includes('FR')) usoConds.push(`"uso" ILIKE '%FR%'`);
      if (filters.uso.includes('OUTDOOR')) usoConds.push(`"uso" ILIKE '%OUTDOOR%'`);
      if (filters.uso.includes('IMO')) usoConds.push(`"uso" ILIKE '%IMO%'`);
      if (usoConds.length) query += ` AND (${usoConds.join(' OR ')})`;
    }
    // 7) Martindale
    if (filters.martindale?.length) {
      query += ` AND "martindale" = ANY($${index++})`;
      params.push(filters.martindale);
    }
    // 8) Mantenimiento (texto)
    if (filters.mantenimiento?.length) {
      query += ` AND ("mantenimiento"::text) ILIKE ANY($${index++})`;
      params.push(filters.mantenimiento.map(m => `%${m}%`));
    }

    // Exclusiones
    const exclusion = this.getExcludedNamesClause(index);
    query += ` AND ${exclusion.clause}`;
    params.push(...exclusion.values);
    index += exclusion.values.length;

    // Límite y offset
    query += ` LIMIT $${index++} OFFSET $${index++}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return { products: rows, total: rows.length };
  }

  /**
   * Devuelve filtros derivados de una marca concreta.
   * @param {string} brand
   * @returns {Promise<{collections:string[], fabricTypes:string[], fabricPatterns:string[], martindaleValues:any[]}>}
   */
  static async getFiltersByBrand(brand) {
    try {
      const { rows: collections } = await pool.query(
        'SELECT DISTINCT coleccion FROM productos WHERE codmarca = $1',
        [brand]
      );
      const { rows: fabricTypes } = await pool.query(
        'SELECT DISTINCT tipo FROM productos WHERE codmarca = $1',
        [brand]
      );
      const { rows: fabricPatterns } = await pool.query(
        'SELECT DISTINCT estilo FROM productos WHERE codmarca = $1',
        [brand]
      );
      const { rows: martindale } = await pool.query(
        'SELECT DISTINCT martindale FROM productos WHERE codmarca = $1',
        [brand]
      );

      return {
        collections: collections.map(c => c.coleccion),
        fabricTypes: fabricTypes.map(f => f.tipo),
        fabricPatterns: fabricPatterns.map(p => p.estilo),
        martindaleValues: martindale.map(m => m.martindale),
      };
    } catch (error) {
      console.error('Error fetching filters by brand:', error);
      throw new Error('Error fetching filters by brand');
    }
  }

  // ---------------------------------------------------------------------------
  // 5) MUTACIONES (CREATE / UPDATE / DELETE)
  // ---------------------------------------------------------------------------

  /**
   * Crea un producto. Invalida cachés si hay capa en res.
   * @param {{input:{CodProdu:string, DesProdu:string, CodFamil:string, Comentario?:string, UrlImagen?:string}, res?:any}}
   * @returns {Promise<object>}
   */
  static async create({ input, res }) {
    const { CodProdu, DesProdu, CodFamil, Comentario, UrlImagen } = input;
    const { rows } = await pool.query(
      `
      INSERT INTO productos ("codprodu", "desprodu", "codfamil", "comentario", "urlimagen")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [CodProdu, DesProdu, CodFamil, Comentario, UrlImagen]
    );

    if (res?.cache) {
      await res.cache.flushAll(); // invalidar caché si aplica
    }
    return rows[0];
  }

  /**
   * Actualiza un producto por codprodu. Invalida caches relacionadas.
   * @param {{id:string, input:Record<string, any>, res?:any}}
   * @returns {Promise<object>}
   */
  static async update({ id, input, res }) {
    const fields = Object.keys(input)
      .map((key, index) => `"${key}" = $${index + 2}`)
      .join(', ');
    const values = Object.values(input);

    const { rows } = await pool.query(
      `UPDATE productos SET ${fields} WHERE "codprodu" = $1 RETURNING *;`,
      [id, ...values]
    );

    if (res?.cache) {
      await res.cache.del?.(`product:${id}`);
      await res.cache.flushAll();
    }
    return rows[0];
  }

  /**
   * Elimina un producto por id. Invalida caches relacionadas.
   * @param {{id:string, res?:any}}
   * @returns {Promise<object>}
   */
  static async delete({ id, res }) {
    const { rows } = await pool.query(
      'DELETE FROM productos WHERE "codprodu" = $1 RETURNING *;',
      [id]
    );

    if (res?.cache) {
      await res.cache.del?.(`product:${id}`);
      await res.cache.flushAll();
    }
    return rows[0];
  }
}
