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

  static defaultTariffCode = '01';

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

  static normalizeTariffCode(codtarifa) {
    const value = String(codtarifa ?? '').trim();
    return value || this.defaultTariffCode;
  }

  static async getTariffCodeForCustomer(codclien) {
    const customerCode = String(codclien ?? '').trim();

    if (!customerCode) {
      return this.defaultTariffCode;
    }

    const { rows } = await pool.query(
      `
        SELECT NULLIF(TRIM(c."codtarifa"), '') AS codtarifa
        FROM clientes c
        WHERE c."codclien" = $1
        LIMIT 1;
      `,
      [customerCode]
    );

    return this.normalizeTariffCode(rows[0]?.codtarifa);
  }

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

  static async getByCodes({ codes, tariffCode = this.defaultTariffCode }) {
    const resolvedTariffCode = this.normalizeTariffCode(tariffCode);

    const sql = `
      SELECT
        p.*,
        tp."pvp" AS "precioMetro"
      FROM productos p
      LEFT JOIN tarprodu tp
        ON tp."codprodu" = p."codprodu"
       AND tp."codtarifa" = $2
      WHERE p."codprodu" = ANY($1::text[])
      ORDER BY array_position($1::text[], p."codprodu");
    `;

    const { rows } = await pool.query(sql, [codes, resolvedTariffCode]);
    return rows;
  }

  // ---------------------------------------------------------------------------
  // 1) LECTURAS BÁSICAS / LISTADOS
  // ---------------------------------------------------------------------------

  /**
   * Listado paginado simple con DISTINCT ON nombre, con exclusiones por nombre.
   */
  static async getAll({ CodFamil, CodSubFamil, requiredLimit = 16, offset = 0 }) {
    const accumulatedProducts = [];

    try {
      while (accumulatedProducts.length < requiredLimit) {
        let query =
          'SELECT DISTINCT ON ("nombre") * ' +
          'FROM productos WHERE "nombre" IS NOT NULL AND "nombre" <> \'\'';

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

  static async getById({ id, res, tariffCode = this.defaultTariffCode }) {
    const resolvedTariffCode = this.normalizeTariffCode(tariffCode);
    const cacheKey = `product:${id}:tarifa:${resolvedTariffCode}`;

    if (res?.cache) {
      const cached = await res.cache.get(cacheKey);

      if (cached) {
        res.set?.('Cache-Control', 'public, max-age=3600');
        return cached;
      }
    }

    const sql = `
      SELECT
        p.*,
        tp."pvp" AS "precioMetro"
      FROM productos p
      LEFT JOIN tarprodu tp
        ON tp."codprodu" = p."codprodu"
       AND tp."codtarifa" = $2
      WHERE p."codprodu" = $1
      LIMIT 1;
    `;

    const { rows } = await pool.query(sql, [id, resolvedTariffCode]);
    if (!rows.length) return null;

    const product = rows[0];

    if (res?.cache) {
      await res.cache.set(cacheKey, product);
    }

    res?.set?.('Cache-Control', 'public, max-age=3600');

    return product;
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
   * Devuelve productos por tipo de producto: papel | telas.
   */
  static async getByType({ type, limit = 16, offset = 0 }) {
    let query =
      'SELECT DISTINCT ON ("nombre") * ' +
      'FROM productos WHERE "nombre" IS NOT NULL AND "nombre" <> \'\'';

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

    return {
      products: rows,
      total: rows.length
    };
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
          SELECT 1
          FROM imagenesproductoswebp i
          WHERE i.codprodu = p.codprodu
            AND i.codclaarchivo = 'PRODUCTO_BUENA'
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
          SELECT 1
          FROM imagenesproductoswebp i
          WHERE i.codprodu = p.codprodu
            AND i.codclaarchivo = 'PRODUCTO_BAJA'
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
   * Listado rápido de productos Especial Navidad.
   * Usa prefijos de nombre: ADELFAS, GENESIS, etc.
   */
  static async getHolidayProducts({ limit = 16, offset = 0 }) {
    if (!this.holidayNamePrefixes || this.holidayNamePrefixes.length === 0) {
      return { products: [], total: 0 };
    }

    let where = `"nombre" IS NOT NULL AND "nombre" <> ''`;
    const params = [];
    let index = 1;

    const exclusion = this.getExcludedNamesClause(index);
    where += ` AND ${exclusion.clause}`;
    params.push(...exclusion.values);
    index += exclusion.values.length;

    const patterns = this.holidayNamePrefixes.map(p => `${p.toUpperCase()}%`);
    where += ` AND UPPER(unaccent("nombre")) LIKE ANY($${index++})`;
    params.push(patterns);

    const countQuery = `
      SELECT COUNT(DISTINCT "codprodu")::int AS total
      FROM productos
      WHERE ${where}
    `;

    const { rows: countRows } = await pool.query(countQuery, params);
    const total = countRows[0]?.total || 0;

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

    const withImages = await Promise.all(
      rows.map(p => this.attachImages(p, ['PRODUCTO_BAJA']))
    );

    return {
      products: withImages,
      total
    };
  }

  // ---------------------------------------------------------------------------
  // 2) BÚSQUEDAS
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
      AND nombre IS NOT NULL
      AND nombre <> ''
      AND ${exclusion.clause}
      ORDER BY sim DESC, nombre, codprodu
      LIMIT $${2 + exclusion.values.length}
      OFFSET $${3 + exclusion.values.length}
    `;

    const params = [searchString, ...exclusion.values, limit, offset];

    const { rows } = await pool.query(baseSql, params);
    const filteredRows = rows.filter(r => r.sim >= 0.3 || rows[0]);

    const defaultImg = 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/04_ICONOS_USADOS_EN_DIFERENTES_SITIOS/ProductoNoEncontrado.webp';

    const productsWithImages = await Promise.all(
      filteredRows.map(async (product) => {
        try {
          const img = await ImagenModel.getByCodproduAndCodclaarchivo({
            codprodu: product.codprodu,
            codclaarchivo: 'PRODUCTO_BAJA',
          });

          return {
            ...product,
            image: img?.url ?? defaultImg
          };
        } catch {
          return {
            ...product,
            image: defaultImg
          };
        }
      })
    );

    return {
      products: productsWithImages,
      total: productsWithImages.length
    };
  }

  static async searchQuick({ query, prodLimit = 8, colLimit = 6 }) {
    const term = (query || '').trim();

    if (!term) {
      return {
        products: [],
        collections: []
      };
    }

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
        p.codprodu,
        p.nombre,
        p.coleccion,
        p.tonalidad
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

          return {
            ...p,
            image: low?.url ?? null
          };
        } catch {
          return {
            ...p,
            image: null
          };
        }
      })
    );

    const sqlCollections = `
      SELECT DISTINCT upper(coleccion) AS coleccion
      FROM productos
      WHERE coleccion ILIKE $1
        AND nombre IS NOT NULL
      LIMIT ${colLimit}
    `;

    const { rows: colRows } = await pool.query(sqlCollections, [`%${term}%`]);
    const collections = colRows.map(r => r.coleccion).filter(Boolean).slice(0, colLimit);

    return {
      products,
      collections
    };
  }

  static async searchProducts({ query, limit = 16, offset = 0 }) {
    const term = (query || '').trim();

    if (!term) {
      return {
        products: [],
        total: 0
      };
    }

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

      return {
        products: colRows,
        total: colRows.length
      };
    }

    return {
      products: rows,
      total: rows.length
    };
  }

  // ---------------------------------------------------------------------------
  // 3) CONFECCIÓN / TARIFAS
  // ---------------------------------------------------------------------------

  static defaultLinings = ['HUSKY', 'AGATA', 'DUNE'];

  /**
   * Busca forros dentro de productos.
   * Aplica tarifa dinámica recibida desde controlador.
   */
  static async searchLiningsByNamesAndQuery({
    names = [],
    q = '',
    limit = 80,
    tariffCode = this.defaultTariffCode
  }) {
    const term = `%${String(q || '').trim()}%`;

    const exclusion = this.getExcludedNamesClause(1);
    let where = `"nombre" IS NOT NULL AND "nombre" <> '' AND ${exclusion.clause}`;

    const params = [...exclusion.values];
    let i = exclusion.values.length + 1;

    if (q && q.trim()) {
      where += ` AND unaccent(upper("nombre")) LIKE unaccent(upper($${i++}))`;
      params.push(term);
    }

    if (Array.isArray(names) && names.length > 0) {
      where += ` AND "nombre" = ANY($${i++})`;
      params.push(names);
    }

    const resolvedTariffCode = this.normalizeTariffCode(tariffCode);
    const tariffParamIndex = i++;
    params.push(resolvedTariffCode);

    const sql = `
      SELECT DISTINCT ON (p."nombre")
        p."codprodu",
        p."nombre",
        p."coleccion",
        tp."pvp" AS "precioMetroRaw",
        p."ancho",
        p."tipo",
        p."estilo"
      FROM productos p
      LEFT JOIN tarprodu tp
        ON tp."codprodu" = p."codprodu"
       AND tp."codtarifa" = $${tariffParamIndex}
      WHERE ${where}
      ORDER BY p."nombre", p."codprodu"
      LIMIT $${i}
    `;

    params.push(limit);

    const { rows } = await pool.query(sql, params);

    const items = await Promise.all(
      rows.map(async (p) => {
        const withImg = await this.attachImages(p, ['PRODUCTO_BAJA']);
        const num = Number(String(p.precioMetroRaw ?? '').replace(',', '.'));

        return {
          id: withImg.codprodu,
          codprodu: withImg.codprodu,
          name: withImg.nombre,
          collection: withImg.coleccion,
          ancho: p.ancho ?? null,
          pricePerMeter: Number.isFinite(num) ? num : null,
          imageUrl: withImg.imageBaja || null
        };
      })
    );

    return items;
  }

  /**
   * Recupera todos los productos WALLPAPER.
   * Aplica tarifa dinámica recibida desde controlador.
   */
  static async searchWallpapersAll({
    limit = 80,
    tariffCode = this.defaultTariffCode
  } = {}) {
    const resolvedTariffCode = this.normalizeTariffCode(tariffCode);

    const sql = `
      SELECT DISTINCT ON (p."nombre")
        p."codprodu",
        p."nombre",
        p."coleccion",
        tp."pvp" AS "precioMetroRaw",
        p."ancho",
        p."tipo",
        p."estilo"
      FROM productos p
      LEFT JOIN tarprodu tp
        ON tp."codprodu" = p."codprodu"
       AND tp."codtarifa" = $2
      WHERE
        p."tipo" = 'WALLPAPER'
        AND p."nombre" IS NOT NULL
        AND p."nombre" <> ''
      ORDER BY p."nombre", p."codprodu"
      LIMIT $1
    `;

    const { rows } = await pool.query(sql, [limit, resolvedTariffCode]);

    const items = await Promise.all(
      rows.map(async (p) => {
        const withImg = await this.attachImages(p, ['PRODUCTO_BAJA']);

        return {
          id: p.codprodu,
          codprodu: p.codprodu,
          name: p.nombre,
          collection: p.coleccion,
          imageUrl: withImg.imageBaja || null,
          price: p.precioMetroRaw != null
            ? Number(String(p.precioMetroRaw).replace(',', '.'))
            : null,
          width: p.ancho ?? null,
          type: p.tipo ?? null,
          style: p.estilo ?? null
        };
      })
    );

    return items;
  }

  static async getColorVariantsByProductId(productId) {
    const { rows: baseRows } = await pool.query(
      `SELECT "codprodu", "nombre" FROM productos WHERE "codprodu" = $1 LIMIT 1`,
      [productId]
    );

    if (baseRows.length === 0) return [];

    const base = baseRows[0];

    const { rows } = await pool.query(
      `
        SELECT
          p."codprodu",
          p."nombre",
          p."tonalidad",
          p."colorprincipal"
        FROM productos p
        WHERE p."nombre" = $1
        ORDER BY p."tonalidad" NULLS LAST, p."codprodu"
      `,
      [base.nombre]
    );

    const variants = await Promise.all(
      rows.map(async (p) => {
        const withImg = await this.attachImages(p, ['PRODUCTO_BAJA']);

        return {
          id: withImg.codprodu,
          name: withImg.tonalidad || withImg.colorprincipal || 'Color',
          hex: null,
          imageUrl: withImg.imageBaja || null
        };
      })
    );

    return variants;
  }

  /**
   * Busca tejidos de tapicería.
   * Aplica tarifa dinámica recibida desde controlador.
   */
  static async searchUpholsteryByQuery({
    q = '',
    limit = 80,
    tariffCode = this.defaultTariffCode
  }) {
    const term = `%${String(q || '').trim()}%`;

    const exclusion = this.getExcludedNamesClause(1);

    let where = `
      p."nombre" IS NOT NULL
      AND p."nombre" <> ''
      AND ${exclusion.clause}
      AND (
        CAST(p."mantenimiento" AS text) ILIKE '%TAPICERIA%'
        OR p."uso" ILIKE '%TAPICERIA%'
      )
    `;

    const params = [...exclusion.values];
    let i = exclusion.values.length + 1;

    if (q && q.trim()) {
      where += ` AND unaccent(upper(p."nombre")) LIKE unaccent(upper($${i++}))`;
      params.push(term);
    }

    const resolvedTariffCode = this.normalizeTariffCode(tariffCode);
    const tariffParamIndex = i++;
    params.push(resolvedTariffCode);

    const sql = `
      SELECT DISTINCT ON (p."nombre")
        p."codprodu",
        p."nombre",
        p."coleccion",
        tp."pvp" AS "precioMetroRaw"
      FROM productos p
      LEFT JOIN tarprodu tp
        ON tp."codprodu" = p."codprodu"
       AND tp."codtarifa" = $${tariffParamIndex}
      WHERE ${where}
      ORDER BY p."nombre", p."codprodu"
      LIMIT $${i}
    `;

    params.push(limit);

    const { rows } = await pool.query(sql, params);

    const items = await Promise.all(
      rows.map(async (p) => {
        const withImg = await this.attachImages(p, ['PRODUCTO_BAJA']);
        const num = Number(String(p.precioMetroRaw ?? '').replace(',', '.'));

        return {
          id: withImg.codprodu,
          codprodu: withImg.codprodu,
          name: withImg.nombre,
          collection: withImg.coleccion,
          pricePerMeter: Number.isFinite(num) ? num : null,
          imageUrl: withImg.imageBaja || null
        };
      })
    );

    return items;
  }

  /**
   * Busca tejidos de cortina.
   * Aplica tarifa dinámica recibida desde controlador.
   */
  static async searchCurtainsByQuery({
    q = '',
    limit = 80,
    tariffCode = this.defaultTariffCode
  }) {
    const term = `%${String(q || '').trim()}%`;

    const exclusion = this.getExcludedNamesClause(1);

    let where = `
      p."nombre" IS NOT NULL
      AND p."nombre" <> ''
      AND ${exclusion.clause}
      AND (
        CAST(p."mantenimiento" AS text) ILIKE '%CORTINA%'
        OR p."uso" ILIKE '%CORTINA%'
      )
    `;

    const params = [...exclusion.values];
    let i = exclusion.values.length + 1;

    if (q && q.trim()) {
      where += ` AND unaccent(upper(p."nombre")) LIKE unaccent(upper($${i++}))`;
      params.push(term);
    }

    const resolvedTariffCode = this.normalizeTariffCode(tariffCode);
    const tariffParamIndex = i++;
    params.push(resolvedTariffCode);

    const sql = `
      SELECT DISTINCT ON (p."nombre")
        p."codprodu",
        p."nombre",
        p."coleccion",
        p."ancho",
        tp."pvp" AS "precioMetroRaw"
      FROM productos p
      LEFT JOIN tarprodu tp
        ON tp."codprodu" = p."codprodu"
       AND tp."codtarifa" = $${tariffParamIndex}
      WHERE ${where}
      ORDER BY p."nombre", p."codprodu"
      LIMIT $${i}
    `;

    params.push(limit);

    const { rows } = await pool.query(sql, params);

    const items = await Promise.all(
      rows.map(async (p) => {
        const withImg = await this.attachImages(p, ['PRODUCTO_BAJA']);
        const num = Number(String(p.precioMetroRaw ?? '').replace(',', '.'));

        return {
          id: withImg.codprodu,
          codprodu: withImg.codprodu,
          name: withImg.nombre,
          collection: withImg.coleccion,
          ancho: p.ancho ?? null,
          pricePerMeter: Number.isFinite(num) ? num : null,
          imageUrl: withImg.imageBaja || null
        };
      })
    );

    return items;
  }

  /**
   * Forros destacados.
   * Aplica tarifa dinámica recibida desde controlador.
   */
  static async getLiningsFeatured({
    names = [],
    limit = 80,
    tariffCode = this.defaultTariffCode
  }) {
    if (!Array.isArray(names) || names.length === 0) return [];

    const list = names.map(n => String(n).trim()).filter(Boolean);
    if (list.length === 0) return [];

    const resolvedTariffCode = this.normalizeTariffCode(tariffCode);

    const sql = `
      SELECT DISTINCT ON (p."nombre")
        p."codprodu" AS id,
        p."nombre" AS name,
        p."ancho",
        tp."pvp" AS "pricePerMeter",
        (
          SELECT i.ficadjunto
          FROM imagenesproductoswebp i
          WHERE i.codprodu = p.codprodu
            AND i.codclaarchivo = 'PRODUCTO_BAJA'
          LIMIT 1
        ) AS "imageUrl"
      FROM productos p
      LEFT JOIN tarprodu tp
        ON tp."codprodu" = p."codprodu"
       AND tp."codtarifa" = $2
      WHERE p."nombre" = ANY($1)
        AND p."nombre" IS NOT NULL
        AND p."nombre" <> ''
      ORDER BY
        p."nombre",
        p."codprodu"
      LIMIT $3
    `;

    const { rows } = await pool.query(sql, [list, resolvedTariffCode, limit]);

    const order = new Map(list.map((n, i) => [n.toUpperCase(), i]));

    rows.sort((a, b) => {
      const ia = order.get(String(a.name || '').toUpperCase()) ?? 1e9;
      const ib = order.get(String(b.name || '').toUpperCase()) ?? 1e9;

      return ia - ib;
    });

    return rows.map(row => {
      const num = Number(String(row.pricePerMeter ?? '').replace(',', '.'));

      return {
        ...row,
        pricePerMeter: Number.isFinite(num) ? num : null
      };
    });
  }

  /**
   * Colores/variantes para un producto.
   * Aplica tarifa dinámica para devolver precio de variante.
   */
  static async getColors(productId, tariffCode = this.defaultTariffCode) {
    const resolvedTariffCode = this.normalizeTariffCode(tariffCode);

    const base = await pool.query(
      `SELECT "nombre" FROM productos WHERE "codprodu" = $1 LIMIT 1`,
      [productId]
    );

    if (base.rows.length === 0) return [];

    const nombre = base.rows[0].nombre;

    const { rows } = await pool.query(
      `
        SELECT
          p."codprodu" AS id,
          COALESCE(
            NULLIF(TRIM(p."tonalidad"), ''),
            NULLIF(TRIM(p."colorprincipal"), ''),
            'Color'
          ) AS name,
          tp."pvp" AS "precioMetroRaw",
          (
            SELECT i.ficadjunto
            FROM imagenesproductoswebp i
            WHERE i.codprodu = p.codprodu
              AND i.codclaarchivo = 'PRODUCTO_BAJA'
            LIMIT 1
          ) AS "imageUrl"
        FROM productos p
        LEFT JOIN tarprodu tp
          ON tp."codprodu" = p."codprodu"
         AND tp."codtarifa" = $2
        WHERE p."nombre" = $1
        ORDER BY
          (p."tonalidad" IS NULL OR TRIM(p."tonalidad") = '') ASC,
          p."tonalidad" NULLS LAST,
          p."codprodu" ASC
      `,
      [nombre, resolvedTariffCode]
    );

    return rows.map((r) => {
      const num = Number(String(r.precioMetroRaw ?? '').replace(',', '.'));

      return {
        id: r.id,
        name: r.name,
        hex: null,
        imageUrl: r.imageUrl || null,
        pricePerMeter: Number.isFinite(num) ? num : null,
      };
    });
  }

  // ---------------------------------------------------------------------------
  // 4) FILTROS
  // ---------------------------------------------------------------------------

  /**
   * Filtro general con paginación consistente.
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

    let where = `"nombre" IS NOT NULL AND "nombre" <> ''`;
    const params = [];
    let index = 1;

    if (filters.brand.length) {
      where += ` AND UPPER(TRIM("codmarca")) = ANY($${index++})`;
      params.push(filters.brand);
    }

    if (filters.collection.length) {
      where += ` AND COALESCE(TRIM("coleccion"), '') ILIKE ANY($${index++})`;
      params.push(filters.collection.map(c => `%${c}%`));
    }

    if (filters.color.length) {
      where += ` AND UPPER(TRIM("colorprincipal")) = ANY($${index++})`;
      params.push(filters.color);
    }

    if (filters.fabricType.length) {
      where += ` AND UPPER(TRIM("tipo")) = ANY($${index++})`;
      params.push(filters.fabricType);
    }

    if (filters.fabricPattern.length) {
      where += ` AND UPPER(TRIM("estilo")) = ANY($${index++})`;
      params.push(filters.fabricPattern);
    }

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

    if (filters.martindale.length) {
      where += ` AND "martindale" = ANY($${index++})`;
      params.push(filters.martindale);
    }

    if (filters.mantenimiento.length) {
      where += ` AND COALESCE(TRIM("mantenimiento"::text), '') ILIKE ANY($${index++})`;
      params.push(filters.mantenimiento.map(m => `%${m}%`));
    }

    const exclusion = this.getExcludedNamesClause(index);
    where += ` AND ${exclusion.clause}`;
    params.push(...exclusion.values);
    index += exclusion.values.length;

    const countQuery = `
      SELECT COUNT(DISTINCT "codprodu")::int AS total
      FROM productos
      WHERE ${where}
    `;

    const { rows: countRows } = await pool.query(countQuery, params);
    const total = countRows[0]?.total || 0;

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

    return {
      products: rows,
      total
    };
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
        WHERE codmarca IS NOT NULL
          AND TRIM(codmarca) <> ''
      `);

      const { rows: collections } = await pool.query(`
        SELECT DISTINCT TRIM(coleccion) AS coleccion
        FROM productos
        WHERE coleccion IS NOT NULL
          AND TRIM(coleccion) <> ''
      `);

      const { rows: fabricTypes } = await pool.query(`
        SELECT DISTINCT TRIM(tipo) AS tipo
        FROM productos
        WHERE tipo IS NOT NULL
          AND TRIM(tipo) <> ''
      `);

      const { rows: fabricPatterns } = await pool.query(`
        SELECT DISTINCT TRIM(estilo) AS estilo
        FROM productos
        WHERE estilo IS NOT NULL
          AND TRIM(estilo) <> ''
      `);

      const { rows: martindale } = await pool.query(`
        SELECT DISTINCT martindale
        FROM productos
        WHERE martindale IS NOT NULL
      `);

      const { rows: colors } = await pool.query(`
        SELECT DISTINCT TRIM(colorprincipal) AS colorprincipal
        FROM productos
        WHERE colorprincipal IS NOT NULL
          AND TRIM(colorprincipal) <> ''
      `);

      const { rows: tonalidades } = await pool.query(`
        SELECT DISTINCT TRIM(tonalidad) AS tonalidad
        FROM productos
        WHERE tonalidad IS NOT NULL
          AND TRIM(tonalidad) <> ''
      `);

      const { rows: usosRaw } = await pool.query(`
        SELECT DISTINCT TRIM(uso) AS uso
        FROM productos
        WHERE uso IS NOT NULL
          AND TRIM(uso) <> ''
      `);

      const usageValues = uniqueList(
        usosRaw.flatMap(row => splitMultiValue(row.uso))
      );

      const { rows: mantenimientos } = await pool.query(`
        SELECT DISTINCT mantenimiento::text AS mantenimiento
        FROM productos
        WHERE mantenimiento IS NOT NULL
          AND mantenimiento::text <> ''
      `);

      const maintenanceValues = uniqueList(
        mantenimientos.flatMap(row => splitMultiValue(row.mantenimiento))
      );

      return {
        brands: uniqueList(brands.map(b => b.codmarca)),
        collections: uniqueList(collections.map(c => c.coleccion)),
        fabricTypes: uniqueList(fabricTypes.map(f => f.tipo)),
        fabricPatterns: uniqueList(fabricPatterns.map(f => f.estilo)),
        martindaleValues: [
          ...new Set(
            martindale
              .map(m => Number(m.martindale))
              .filter(Number.isFinite)
          )
        ],
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
  // 5) MUTACIONES
  // ---------------------------------------------------------------------------

  static async create({ input, res }) {
    const {
      CodProdu,
      DesProdu,
      CodFamil,
      Comentario,
      UrlImagen
    } = input;

    const { rows } = await pool.query(
      `
        INSERT INTO productos (
          "codprodu",
          "desprodu",
          "codfamil",
          "comentario",
          "urlimagen"
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `,
      [CodProdu, DesProdu, CodFamil, Comentario, UrlImagen]
    );

    if (res?.cache) {
      await res.cache.flushAll();
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