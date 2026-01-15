/**
 * ProductModel
 * ------------
 * Capa de acceso a datos para la tabla `productos` y búsquedas auxiliares.
 * Incluye utilidades para exclusiones de nombres y adjunta imágenes cuando procede.
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


  static holidayNamePrefixes = [
    'ADELFAS',
    'GENESIS',
    // añade aquí más prefijos de familias a liquidar
  ];

  static getHolidayNameClause(startIndex = 1) {
    if (!this.holidayNamePrefixes || this.holidayNamePrefixes.length === 0) {
      return { clause: 'TRUE', values: [] };
    }
    const patterns = this.holidayNamePrefixes.map(p => `${p.toUpperCase()}%`);
    return {
      clause: `UPPER(unaccent("nombre")) LIKE ANY($${startIndex})`,
      values: [patterns],
    };
  }


  static getExcludedNamesClause(startIndex = 1) {
    const placeholders = this.excludedNames.map((_, i) => `$${i + startIndex}`);
    return {
      clause: `"nombre" NOT IN (${placeholders.join(', ')})`,
      values: [...this.excludedNames],
    };
  }

  static async attachImages(product, tipos = ['PRODUCTO_BAJA']) {
    const want = Array.isArray(tipos) ? tipos : [tipos];

    try {
      const lookups = await Promise.all(
        want.map((codclaarchivo) =>
          ImagenModel.getByCodproduAndCodclaarchivo({
            codprodu: product.codprodu,
            codclaarchivo,
          })
        )
      );

      const result = { ...product };

      lookups.forEach((img, idx) => {
        const quality = want[idx];
        const key = quality === 'PRODUCTO_BUENA' ? 'imageBuena' : 'imageBaja';
        result[key] = img?.url ?? null;
      });

      return result;
    } catch {
      return { ...product, imageBuena: null, imageBaja: null };
    }
  }


  // ---------------------------------------------------------------------------
  // 1) LECTURAS BÁSICAS / LISTADOS
  // ---------------------------------------------------------------------------

  /**
   * Listado paginado simple (con DISTINCT ON nombre), con exclusiones por nombre.
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

  static async getById({ id, res }) {
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
   * Devuelve productos por tipo de producto (papel|telas).
   */
  static async getByType({ type, limit = 16, offset = 0 }) {
    let query =
      'SELECT DISTINCT ON ("nombre") * ' +
      "FROM productos WHERE \"nombre\" IS NOT NULL AND \"nombre\" <> ''";
    const params = [];
    let index = 1;

    if (type === 'papel') {
      query += ` AND "tipo" = 'WALLPAPER'`;
    } else if (type === 'telas') {
      query += ` AND "tipo" <> 'WALLPAPER'`;
    }

    const exclusion = this.getExcludedNamesClause(index);
    query += ` AND ${exclusion.clause}`;
    params.push(...exclusion.values);
    index += exclusion.values.length;

    query += ` ORDER BY "nombre", "codprodu" LIMIT $${index++} OFFSET $${index++}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return { products: rows, total: rows.length };
  }

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
          SELECT 1 FROM imagenesftpproductos i
           WHERE i.codprodu = p.codprodu AND i.codclaarchivo = 'PRODUCTO_BUENA'
        )
    `;
    const values = [coleccion, excludeCodprodu, ...exclusion.values];
    const { rows } = await pool.query(query, values);

    const withImages = await Promise.all(
      rows.map((p) => this.attachImages(p, ['PRODUCTO_BUENA', 'PRODUCTO_BAJA']))
    );
    return withImages;
  }

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

    const withImages = await Promise.all(
      rows.map((p) => this.attachImages(p, ['PRODUCTO_BUENA', 'PRODUCTO_BAJA']))
    );

    return withImages;
  }

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
          SELECT 1 FROM imagenesftpproductos i
           WHERE i.codprodu = p.codprodu AND i.codclaarchivo = 'PRODUCTO_BAJA'
        )
      LIMIT $4
    `;
    const values = [estilo, excludeNombre, excludeColeccion, limit, ...exclusion.values];
    const { rows } = await pool.query(query, values);

    const withImages = await Promise.all(
      rows.map((p) => this.attachImages(p, ['PRODUCTO_BUENA', 'PRODUCTO_BAJA']))
    );
    return withImages;
  }

  /**
    * NUEVO:
    * Listado rápido de productos “Especial Navidad”
    * usando prefijos de nombre (ADELFAS, GENESIS, etc.).
    * Devuelve { products, total }.
    */
  static async getHolidayProducts({ limit = 16, offset = 0 }) {
    // Si no hay prefijos configurados, devolvemos vacío
    if (!this.holidayNamePrefixes || this.holidayNamePrefixes.length === 0) {
      return { products: [], total: 0 };
    }

    let where = `"nombre" IS NOT NULL AND "nombre" <> ''`;
    const params = [];
    let index = 1;

    // Exclusiones globales
    const exclusion = this.getExcludedNamesClause(index);
    where += ` AND ${exclusion.clause}`;
    params.push(...exclusion.values);
    index += exclusion.values.length;

    // Prefijos de Navidad
    const patterns = this.holidayNamePrefixes.map(p => `${p.toUpperCase()}%`);
    where += ` AND UPPER(unaccent("nombre")) LIKE ANY($${index++})`;
    params.push(patterns);

    // Total consistente
    const countQuery = `
      SELECT COUNT(DISTINCT "codprodu")::int AS total
      FROM productos
      WHERE ${where}
    `;
    const { rows: countRows } = await pool.query(countQuery, params);
    const total = countRows[0]?.total || 0;

    // Página actual
    const dataQuery = `
      SELECT DISTINCT ON ("nombre") *, TRUE AS "isChristmas"
      FROM productos
      WHERE ${where}
      ORDER BY "nombre", "codprodu"
      LIMIT $${index++}
      OFFSET $${index++}
    `;
    const dataParams = [...params, limit, offset];
    const { rows } = await pool.query(dataQuery, dataParams);

    // Adjuntamos imagen Baja desde backend para acelerar el front
    const withImages = await Promise.all(
      rows.map(p => this.attachImages(p, ['PRODUCTO_BAJA']))
    );

    return { products: withImages, total };
  }

  // ---------------------------------------------------------------------------
  // 2) BÚSQUEDAS (CLÁSICA / PARA HEADER / PARA CARDPRODUCT)
  // ---------------------------------------------------------------------------

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
            codclaarchivo: 'PRODUCTO_BAJA',
          });
          return { ...product, image: img?.url ?? defaultImg };

        } catch {
          return { ...product, image: defaultImg };
        }
      })
    );

    return { products: productsWithImages, total: productsWithImages.length };
  }

  static async searchQuick({ query, prodLimit = 8, colLimit = 6 }) {
    const term = (query || '').trim();
    if (!term) return { products: [], collections: [] };
    const tokens = term.split(/\s+/).filter(Boolean);
    const norms = tokens.map(token => `%${token}%`);

    const exclusion = this.getExcludedNamesClause(tokens.length + 1);
    const limitIndex = tokens.length + exclusion.values.length + 1;
    const tokenConditions = tokens
      .map((_, idx) => `(
        unaccent(upper(p.nombre)) LIKE unaccent(upper($${idx + 1}))
        OR unaccent(upper(p.tonalidad)) LIKE unaccent(upper($${idx + 1}))
      )`)
      .join(' AND ');
    const sqlProducts = `
      SELECT DISTINCT ON (p.nombre)
        p.codprodu, p.nombre, p.coleccion, p.tonalidad
      FROM productos p
       WHERE (${tokenConditions})
      AND p.nombre IS NOT NULL
      AND p.nombre <> ''
      AND ${exclusion.clause}
      ORDER BY p.nombre, p.codprodu
      LIMIT $${limitIndex}
    `;
    const prodParams = [...norms, ...exclusion.values, prodLimit];
    const { rows: prodRows } = await pool.query(sqlProducts, prodParams);

    const products = await Promise.all(
      prodRows.map(async (p) => {
        try {
          const low = await ImagenModel.getByCodproduAndCodclaarchivo({
            codprodu: p.codprodu,
            codclaarchivo: 'PRODUCTO_BAJA'
          });
          return { ...p, image: low?.url ?? null };
        } catch {
          return { ...p, image: null };
        }
      })
    );

    const sqlCollections = `
      SELECT DISTINCT upper(coleccion) as coleccion
      FROM productos
      WHERE coleccion ILIKE $1
        AND nombre IS NOT NULL
      LIMIT ${colLimit}
    `;
    const { rows: colRows } = await pool.query(sqlCollections, [`%${term}%`]);
    const collections = colRows.map(r => r.coleccion).filter(Boolean).slice(0, colLimit);

    return { products, collections };
  }

  static async searchProducts({ query, limit = 16, offset = 0 }) {
    const term = (query || '').trim();
    if (!term) return { products: [], total: 0 };
    const tokens = term.split(/\s+/).filter(Boolean);
    const norms = tokens.map(token => `%${token}%`);

    const exclusion = this.getExcludedNamesClause(tokens.length + 2);
    const limitIndex = tokens.length + 1;
    const offsetIndex = tokens.length + exclusion.values.length + 2;
    const tokenConditions = tokens
      .map((_, idx) => `(
        unaccent(upper(p.nombre)) LIKE unaccent(upper($${idx + 1}))
        OR unaccent(upper(p.tonalidad)) LIKE unaccent(upper($${idx + 1}))
      )`)
      .join(' AND ');
    const baseSql = `
      SELECT p.*
      FROM productos p
      WHERE (${tokenConditions})
      AND p.nombre IS NOT NULL
      AND p.nombre <> ''
      AND ${exclusion.clause}
      ORDER BY p.nombre, p.codprodu
      LIMIT $${limitIndex}
      OFFSET $${offsetIndex}
    `;
    const params = [...norms, limit, ...exclusion.values, offset];

    const { rows } = await pool.query(baseSql, params);

    if (rows.length === 0) {
      const fallbackExclusion = this.getExcludedNamesClause(3);
      const fallbackOffsetIndex = 3 + fallbackExclusion.values.length;
      const sqlCol = `
        SELECT p.*
        FROM productos p
        WHERE lower(p.coleccion) = lower($1)
          AND p.nombre IS NOT NULL
          AND p.nombre <> ''
          AND ${fallbackExclusion.clause}
        ORDER BY p.nombre, p.codprodu
        LIMIT $2
        OFFSET $${fallbackOffsetIndex}
      `;
      const paramsCol = [term, limit, ...fallbackExclusion.values, offset];
      const { rows: colRows } = await pool.query(sqlCol, paramsCol);
      return { products: colRows, total: colRows.length };
    }

    return { products: rows, total: rows.length };
  }

  // ---------------------------------------------------------------------------
  // 4) FILTROS (GENERALES Y POR MARCA)
  // ---------------------------------------------------------------------------

  /**
   * Filtro general — **tu lógica original** + paginación consistente.
   * Devuelve { products, total } donde total = COUNT(DISTINCT codprodu) con MISMAS condiciones.
   */
  static async filter(rawFilters = {}, limit = 16, offset = 0) {
    const toArray = value => (Array.isArray(value) ? value : []);

    const normalizeStringList = (values, { uppercase = false } = {}) => {
      const seen = new Set();
      const list = [];
      toArray(values).forEach(value => {
        if (value == null) return;
        let str = String(value).trim();
        if (!str) return;
        if (uppercase) str = str.toUpperCase();
        const key = str
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toUpperCase();
        if (seen.has(key)) return;
        seen.add(key);
        list.push(str);
      });
      return list;
    };

    const normalizeNumberList = values => {
      const seen = new Set();
      const list = [];
      toArray(values).forEach(value => {
        const num = Number(value);
        if (!Number.isFinite(num)) return;
        if (seen.has(num)) return;
        seen.add(num);
        list.push(num);
      });
      return list;
    };

    const filters = {
      brand: normalizeStringList(rawFilters.brand, { uppercase: true }),
      collection: normalizeStringList(rawFilters.collection),
      color: normalizeStringList(rawFilters.color, { uppercase: true }),
      fabricType: normalizeStringList(rawFilters.fabricType, { uppercase: true }),
      fabricPattern: normalizeStringList(rawFilters.fabricPattern, { uppercase: true }),
      uso: normalizeStringList(rawFilters.uso, { uppercase: true }),
      mantenimiento: normalizeStringList(rawFilters.mantenimiento),
      martindale: normalizeNumberList(rawFilters.martindale),
    };

    // Construimos UNA cláusula WHERE reusable
    let where = `"nombre" IS NOT NULL AND "nombre" <> ''`;
    const params = [];
    let index = 1;

    // 1) Marca
    if (filters.brand.length) {
      where += ` AND UPPER(TRIM("codmarca")) = ANY($${index++})`;
      params.push(filters.brand);
    }
    // 2) Colección (ILIKE ANY)
    if (filters.collection.length) {
      where += ` AND COALESCE(TRIM("coleccion"), '') ILIKE ANY($${index++})`;
      params.push(filters.collection.map(c => `%${c}%`));
    }
    // 3) Color
    if (filters.color.length) {
      where += ` AND UPPER(TRIM("colorprincipal")) = ANY($${index++})`;
      params.push(filters.color);
    }
    // 4) Tipo
    if (filters.fabricType.length) {
      where += ` AND UPPER(TRIM("tipo")) = ANY($${index++})`;
      params.push(filters.fabricType);
    }
    // 5) Estilo
    if (filters.fabricPattern.length) {
      where += ` AND UPPER(TRIM("estilo")) = ANY($${index++})`;
      params.push(filters.fabricPattern);
    }
    // 6) Uso dinámico (cada valor puede existir combinado en el campo)
    if (filters.uso.length) {
      const usageColumn = `UPPER(COALESCE(TRIM("uso"), ''))`;
      const usoConditions = filters.uso.map(value => {
        const placeholder = `$${index++}`;
        params.push(`%${value}%`);
        return `${usageColumn} LIKE ${placeholder}`;
      });
      if (usoConditions.length) {
        where += ` AND (${usoConditions.join(' OR ')})`;
      }
    }
    // 7) Martindale
    if (filters.martindale.length) {
      where += ` AND "martindale" = ANY($${index++})`;
      params.push(filters.martindale);
    }
    // 8) Mantenimiento (texto)
    if (filters.mantenimiento.length) {
      where += ` AND COALESCE(TRIM("mantenimiento"::text), '') ILIKE ANY($${index++})`;
      params.push(filters.mantenimiento.map(m => `%${m}%`));
    }

    // Exclusiones (tu helper)
    const exclusion = this.getExcludedNamesClause(index);
    where += ` AND ${exclusion.clause}`;
    params.push(...exclusion.values);
    index += exclusion.values.length;

    // --- TOTAL consistente (mismas condiciones) ---
    const countQuery = `
      SELECT COUNT(DISTINCT "codprodu")::int AS total
      FROM productos
      WHERE ${where}
    `;
    const { rows: countRows } = await pool.query(countQuery, params);
    const total = countRows[0]?.total || 0;

    // --- Página actual (misma lógica tuya: DISTINCT ON ("nombre")) ---
    const dataQuery = `
      SELECT DISTINCT ON ("nombre") *
      FROM productos
      WHERE ${where}
      ORDER BY "nombre", "codprodu"
      LIMIT $${index++}
      OFFSET $${index++}
    `;
    const dataParams = [...params, limit, offset];

    const { rows } = await pool.query(dataQuery, dataParams);
    return { products: rows, total };
  }

  /**
   * Devuelve los valores distintos para construir los filtros del catálogo.
   */
  static async getFilters() {
    const cleanValue = value => {
      if (value == null) return '';
      if (typeof value === 'string') return value.trim();
      return String(value).trim();
    };

    const splitMultiValue = value =>
      cleanValue(value)
        .split(/[;|/,\n\r]+/)
        .map(part => part.trim())
        .filter(Boolean);

    const uniqueList = values => {
      const seen = new Set();
      const list = [];
      values.forEach(value => {
        const cleaned = cleanValue(value);
        if (!cleaned) return;
        const key = cleaned
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toUpperCase();
        if (seen.has(key)) return;
        seen.add(key);
        list.push(cleaned);
      });
      return list;
    };

    try {
      const { rows: brands } = await pool.query(`
        SELECT DISTINCT TRIM(codmarca) AS codmarca
        FROM productos
        WHERE codmarca IS NOT NULL AND TRIM(codmarca) <> ''
      `);
      const { rows: collections } = await pool.query(`
        SELECT DISTINCT TRIM(coleccion) AS coleccion
        FROM productos
        WHERE coleccion IS NOT NULL AND TRIM(coleccion) <> ''
      `);
      const { rows: fabricTypes } = await pool.query(`
        SELECT DISTINCT TRIM(tipo) AS tipo
        FROM productos
        WHERE tipo IS NOT NULL AND TRIM(tipo) <> ''
      `);
      const { rows: fabricPatterns } = await pool.query(`
        SELECT DISTINCT TRIM(estilo) AS estilo
        FROM productos
        WHERE estilo IS NOT NULL AND TRIM(estilo) <> ''
      `);
      const { rows: martindale } = await pool.query(`
        SELECT DISTINCT martindale
        FROM productos
        WHERE martindale IS NOT NULL
      `);
      const { rows: colors } = await pool.query(`
        SELECT DISTINCT TRIM(colorprincipal) AS colorprincipal
        FROM productos
        WHERE colorprincipal IS NOT NULL AND TRIM(colorprincipal) <> ''
      `);

      const { rows: tonalidades } = await pool.query(`
        SELECT DISTINCT TRIM(tonalidad) AS tonalidad
        FROM productos
        WHERE tonalidad IS NOT NULL AND TRIM(tonalidad) <> ''
      `);

      const { rows: usosRaw } = await pool.query(`
        SELECT DISTINCT TRIM(uso) AS uso
        FROM productos
        WHERE uso IS NOT NULL AND TRIM(uso) <> ''
      `);

      const usageValues = uniqueList(
        usosRaw.flatMap(row => splitMultiValue(row.uso))
      );

      const { rows: mantenimientos } = await pool.query(`
        SELECT DISTINCT mantenimiento::text AS mantenimiento
        FROM productos
        WHERE mantenimiento IS NOT NULL AND mantenimiento::text <> ''
      `);

      const maintenanceValues = uniqueList(
        mantenimientos.flatMap(row => splitMultiValue(row.mantenimiento))
      );

      return {
        brands: uniqueList(brands.map(b => b.codmarca)),
        collections: uniqueList(collections.map(c => c.coleccion)),
        fabricTypes: uniqueList(fabricTypes.map(f => f.tipo)),
        fabricPatterns: uniqueList(fabricPatterns.map(f => f.estilo)),
        martindaleValues: [...new Set(martindale.map(m => Number(m.martindale)).filter(Number.isFinite))],
        colors: uniqueList(colors.map(c => c.colorprincipal)),
        tonalidades: uniqueList(tonalidades.map(t => t.tonalidad)),
        uso: usageValues,
        mantenimientos: maintenanceValues,
      };
    } catch (error) {
      console.error('Error fetching filters:', error);
      throw new Error('Error fetching filters');
    }
  }

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
