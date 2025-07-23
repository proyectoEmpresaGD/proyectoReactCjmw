import pg from 'pg';
import dotenv from 'dotenv';
import { ImagenModel } from './imagenes.js';
dotenv.config();


const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export class ProductModel {

  static excludedNames = ["DAMASCO", "STORK", "BAMBOO", "TARIFA", "PONIENTE", "MARRAKESH", "CLEMENTINE"];

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

  static async getByCollectionExcluding({ coleccion, excludeCodprodu }) {
    const exclusion = this.getExcludedNamesClause(3);

    const query = `
      SELECT DISTINCT ON (p.nombre) p.* FROM productos p
      WHERE LOWER(p.coleccion) = LOWER($1)
        AND p.codprodu != $2
        AND p.nombre IS NOT NULL AND p.nombre != ''
        AND ${exclusion.clause}
        AND EXISTS (
          SELECT 1 FROM imagenesocproductos i
          WHERE i.codprodu = p.codprodu AND i.codclaarchivo = 'Buena'
        )
    `;

    const values = [coleccion, excludeCodprodu, ...exclusion.values];
    const { rows } = await pool.query(query, values);

    const productosConImagen = await Promise.all(
      rows.map(async (product) => {
        try {
          const [imageBuenaObj, imageBajaObj] = await Promise.all([
            ImagenModel.getByCodproduAndCodclaarchivo({
              codprodu: product.codprodu,
              codclaarchivo: 'Buena'
            }),
            ImagenModel.getByCodproduAndCodclaarchivo({
              codprodu: product.codprodu,
              codclaarchivo: 'Baja'
            })
          ]);

          return {
            ...product,
            imageBuena: imageBuenaObj?.ficadjunto ? `https://${imageBuenaObj.ficadjunto}` : null,
            imageBaja: imageBajaObj?.ficadjunto ? `https://${imageBajaObj.ficadjunto}` : null,
          };
        } catch (err) {
          console.error(`❌ Error fetching images for ${product.codprodu}:`, err);
          return {
            ...product,
            imageBuena: null,
            imageBaja: null
          };
        }
      })
    );

    return productosConImagen;
  }

  static async getSimilarByStyle({ estilo, excludeNombre, excludeColeccion, limit = 4 }) {
    const exclusion = this.getExcludedNamesClause(5); // desplazado por 1 para incluir nuevo índice

    const query = `
      SELECT DISTINCT ON (p.nombre) p.* FROM productos p
      WHERE LOWER(p.estilo) = LOWER($1)
        AND LOWER(p.nombre) != LOWER($2)
        AND p.coleccion != $3
        AND ${exclusion.clause}
        AND EXISTS (
          SELECT 1 FROM imagenesocproductos i
          WHERE i.codprodu = p.codprodu AND i.codclaarchivo = 'Baja'
        )
      LIMIT $4
    `;

    const values = [estilo, excludeNombre, excludeColeccion, limit, ...exclusion.values];

    const { rows } = await pool.query(query, values);

    // Adjuntar imagenBaja a cada producto
    const productosConImagen = await Promise.all(
      rows.map(async (product) => {
        try {
          const [imageBuenaObj, imageBajaObj] = await Promise.all([
            ImagenModel.getByCodproduAndCodclaarchivo({
              codprodu: product.codprodu,
              codclaarchivo: 'Buena'
            }),
            ImagenModel.getByCodproduAndCodclaarchivo({
              codprodu: product.codprodu,
              codclaarchivo: 'Baja'
            })
          ]);

          return {
            ...product,
            imageBuena: imageBuenaObj?.ficadjunto ? `https://${imageBuenaObj.ficadjunto}` : null,
            imageBaja: imageBajaObj?.ficadjunto ? `https://${imageBajaObj.ficadjunto}` : null,
          };
        } catch (err) {
          console.error(`❌ Error fetching image for ${product.codprodu}:`, err);
          return {
            ...product,
            imageBaja: null
          };
        }
      })
    );

    return productosConImagen;
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

    // Construimos clausula de exclusión igual que antes
    const exclusion = this.getExcludedNamesClause(2);

    // Seleccionamos también sim sobre nombre+tonalidad
    const baseSql = `
      SELECT
        *,
        similarity(
          unaccent(UPPER(nombre || ' ' || COALESCE(tonalidad, ''))),
          unaccent(UPPER($1))
        ) AS sim
      FROM productos
      WHERE (
        unaccent(UPPER(nombre)) LIKE unaccent(UPPER($1))
        OR unaccent(UPPER(coleccion)) LIKE unaccent(UPPER($1))
        OR unaccent(UPPER(tonalidad)) LIKE unaccent(UPPER($1))
        -- por si el usuario escribe "DUKE PORCELAIN" como frase completa
        OR unaccent(UPPER(nombre || ' ' || COALESCE(tonalidad, '')))
            LIKE unaccent(UPPER($1))
      )
      AND nombre IS NOT NULL AND nombre <> ''
      AND ${exclusion.clause}
      ORDER BY sim DESC, nombre, codprodu
      LIMIT $${2 + exclusion.values.length}
      OFFSET $${3 + exclusion.values.length}
    `;

    const params = [
      searchString,
      ...exclusion.values,
      limit,
      offset
    ];

    const { rows } = await pool.query(baseSql, params);

    // Filtramos por un umbral de similitud como antes
    const filteredRows = rows.filter(r => r.sim >= 0.3 || rows[0]);

    const defaultImageUrl = 'https://bassari.eu/ImagenesTelasCjmw/Iconos/ProductoNoEncontrado.webp';

    // Cargamos imágenes igual que antes
    const productsWithImages = await Promise.all(
      filteredRows.map(async product => {
        const img = await ImagenModel.getByCodproduAndCodclaarchivo({
          codprodu: product.codprodu,
          codclaarchivo: 'Baja',
          res
        });
        return {
          ...product,
          image: img?.ficadjunto
            ? `https://${img.ficadjunto}`
            : defaultImageUrl
        };
      })
    );

    return {
      products: productsWithImages,
      total: productsWithImages.length
    };
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
  // Obtener filtros de productos (incluye mantenimiento casteado a texto)
  static async getFilters() {
    try {
      const { rows: brands } = await pool.query('SELECT DISTINCT codmarca FROM productos');
      const { rows: collections } = await pool.query('SELECT DISTINCT coleccion FROM productos');
      const { rows: fabricTypes } = await pool.query('SELECT DISTINCT tipo FROM productos');
      const { rows: fabricPatterns } = await pool.query('SELECT DISTINCT estilo FROM productos');
      const { rows: martindaleValues } = await pool.query('SELECT DISTINCT martindale FROM productos');
      const { rows: colors } = await pool.query('SELECT DISTINCT colorprincipal FROM productos');
      const { rows: tonalidades } = await pool.query('SELECT DISTINCT tonalidad FROM productos');

      // Aquí casteamos mantenimiento::text para poder DISTINCT sobre XML
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
        martindaleValues: martindaleValues.map(m => m.martindale),
        colors: colors.map(c => c.colorprincipal),
        tonalidades: tonalidades.map(t => t.tonalidad),
        mantenimientos: mantenimientos.map(m => m.mantenimiento).filter(Boolean),
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

    // 1️⃣ Brand
    if (filters.brand?.length) {
      query += ` AND "codmarca" = ANY($${index++})`;
      params.push(filters.brand);
    }
    // 2️⃣ Collection
    if (filters.collection?.length) {
      query += ` AND "coleccion" ILIKE ANY($${index++})`;
      params.push(filters.collection.map(c => `%${c}%`));
    }
    // 3️⃣ Color
    if (filters.color?.length) {
      query += ` AND "colorprincipal" = ANY($${index++})`;
      params.push(filters.color);
    }
    // 4️⃣ Fabric Type
    if (filters.fabricType?.length) {
      query += ` AND "tipo" = ANY($${index++})`;
      params.push(filters.fabricType);
    }
    // 5️⃣ Fabric Pattern / Estilo
    if (filters.fabricPattern?.length) {
      query += ` AND "estilo" = ANY($${index++})`;
      params.push(filters.fabricPattern);
    }
    // 6️⃣ Uso (FR, OUTDOOR, IMO)
    if (filters.uso?.length) {
      const usoConds = [];
      if (filters.uso.includes("FR")) usoConds.push(`"uso" ILIKE '%FR%'`);
      if (filters.uso.includes("OUTDOOR")) usoConds.push(`"uso" ILIKE '%OUTDOOR%'`);
      if (filters.uso.includes("IMO")) usoConds.push(`"uso" ILIKE '%IMO%'`);
      if (usoConds.length) query += ` AND (${usoConds.join(" OR ")})`;
    }
    // 7️⃣ Martindale
    if (filters.martindale?.length) {
      query += ` AND "martindale" = ANY($${index++})`;
      params.push(filters.martindale);
    }
    // ➕ 8️⃣ Mantenimiento (nuevo)
    if (filters.mantenimiento?.length) {
      // Suponemos que la columna "mantenimiento" puede buscarse como texto
      query += ` AND ("mantenimiento"::text) ILIKE ANY($${index++})`;
      params.push(filters.mantenimiento.map(m => `%${m}%`));
    }

    // ❌ Exclusiones por nombre
    const exclusion = this.getExcludedNamesClause(index);
    query += ` AND ${exclusion.clause}`;
    params.push(...exclusion.values);
    index += exclusion.values.length;

    // 🛑 Límite y offset
    query += ` LIMIT $${index++} OFFSET $${index++}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    return { products: rows, total: rows.length };
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