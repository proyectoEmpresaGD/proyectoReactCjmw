// controllers/productos.js
import { ProductModel } from '../models/Postgres/productos.js';

/**
 * Utilidades pequeñas y consistentes
 */
const toInt = (v, def) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : def;
};

const okCache = (res, seconds = 3600) => {
  // Cache en edge/CDN con revalidación perezosa
  res.set('Cache-Control', `s-maxage=${seconds}, stale-while-revalidate`);
};

const noStore = (res) => {
  res.set('Cache-Control', 'no-store');
};

export class ProductController {
  // ===========================================================================
  // 0) Catálogo básico / listado y CRUD
  // ===========================================================================

  /**
   * GET /api/products
   * Lista paginada del catálogo base (sin filtros complejos).
   * Acepta: CodFamil, CodSubFamil, limit, page
   */
  async getAll(req, res) {
    try {
      const { CodFamil, CodSubFamil, limit, page } = req.query;
      const requiredLimit = toInt(limit, 16);
      const pageParsed = toInt(page, 1);
      const offset = (pageParsed - 1) * requiredLimit;

      const products = await ProductModel.getAll({ CodFamil, CodSubFamil, requiredLimit, offset });

      okCache(res, 3600);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /api/products/:id
   * Devuelve un producto por id (codprodu)
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.getById({ id });
      if (product) {
        okCache(res, 3600);
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * POST /api/products
   * Crea un producto (uso interno / administración)
   */
  async create(req, res) {
    try {
      const newProduct = await ProductModel.create({ input: req.body });
      noStore(res);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * PATCH /api/products/:id
   * Actualiza un producto
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = await ProductModel.update({ id, input: req.body });
      if (updatedProduct) {
        noStore(res);
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * DELETE /api/products/:id
   * Elimina un producto
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await ProductModel.delete({ id });
      if (result) {
        noStore(res);
        res.json({ message: 'Product deleted' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ===========================================================================
  // 1) Búsquedas
  // ===========================================================================

  /**
   * GET /api/products/search
   * Búsqueda “clásica” por nombre/colección/tonalidad (server-side).
   * Nota: devolvemos 200 con lista vacía para simplificar el frontend.
   */
  async search(req, res) {
    try {
      const { query, limit, page } = req.query;
      if (!query || !query.trim()) {
        return res
          .status(200)
          .json({ products: [], pagination: { currentPage: 1, limit: 0, totalResults: 0 } });
      }

      const limitParsed = toInt(limit, 12);
      const pageParsed = toInt(page, 1);
      const offset = (pageParsed - 1) * limitParsed;

      const { products, total } = await ProductModel.search({
        query,
        limit: limitParsed,
        offset
      });

      okCache(res, 3600);
      return res.status(200).json({
        products,
        pagination: {
          currentPage: pageParsed,
          limit: limitParsed,
          totalResults: total
        }
      });
    } catch (error) {
      console.error('Error searching products:', error);
      return res.status(500).json({ error: 'Error searching products', details: error.message });
    }
  }

  /**
   * GET /api/products/searchQuick
   * Sugerencias rápidas para la barra de búsqueda (productos + colecciones).
   * Parámetros: query, prodLimit (8), colLimit (6)
   */
  async searchQuick(req, res) {
    try {
      const { query, prodLimit, colLimit } = req.query;
      if (!query || !query.trim()) {
        return res.status(200).json({ products: [], collections: [] });
      }
      const data = await ProductModel.searchQuick({
        query: query.trim(),
        prodLimit: toInt(prodLimit, 8),
        colLimit: toInt(colLimit, 6)
      });
      okCache(res, 120); // cache corto para UX percibida más rápida
      return res.json(data);
    } catch (error) {
      console.error('Error in searchQuick:', error);
      return res.status(500).json({ error: 'Error searching quick', details: error.message });
    }
  }

  /**
   * GET /api/products/searchProducts
   * Búsqueda paginada para CardProduct (solo productos).
   * Si no encuentra por nombre/tonalidad, hace fallback por colección exacta (insensible a mayúsculas).
   */
  async searchProducts(req, res) {
    try {
      const { query, limit, page } = req.query;
      if (!query || !query.trim()) {
        return res
          .status(200)
          .json({ products: [], pagination: { currentPage: 1, limit: 0, totalResults: 0 } });
      }
      const limitParsed = toInt(limit, 16);
      const pageParsed = toInt(page, 1);
      const offset = (pageParsed - 1) * limitParsed;

      const { products, total } = await ProductModel.searchProducts({
        query: query.trim(),
        limit: limitParsed,
        offset
      });

      okCache(res, 3600);
      return res.status(200).json({
        products,
        pagination: {
          currentPage: pageParsed,
          limit: limitParsed,
          totalResults: total
        }
      });
    } catch (error) {
      console.error('Error in searchProducts:', error);
      return res.status(500).json({ error: 'Error searching products', details: error.message });
    }
  }

  // ===========================================================================
  // 2) Filtros, tipos y colecciones
  // ===========================================================================

  /**
   * GET /api/products/filters
   * Devuelve todos los valores únicos para filtros (marcas, colecciones, tipo, etc.)
   */
  async getFilters(req, res) {
    try {
      const filters = await ProductModel.getFilters();
      okCache(res, 3600);
      res.json(filters);
    } catch (error) {
      console.error('Error fetching filters:', error);
      res.status(500).send({ error: 'Error fetching filters', details: error.message });
    }
  }

  /**
   * GET /api/products/filtersByBrand?brand=ARE
   * Devuelve subconjunto de filtros para una marca (colecciones, tipo, estilo, martindale)
   */
  async getFiltersByBrand(req, res) {
    try {
      const { brand } = req.query;
      if (!brand) {
        return res.status(400).json({ message: 'Brand is required' });
      }

      const filters = await ProductModel.getFiltersByBrand(brand);
      if (!filters) {
        return res.status(404).json({ message: 'No filters found for this brand' });
      }

      okCache(res, 3600);
      res.json(filters);
    } catch (error) {
      console.error('Error fetching filters by brand:', error);
      res.status(500).json({ message: 'Error fetching filters by brand', error });
    }
  }

  /**
   * GET /api/products/getCollectionsByBrand?brand=ARE
   * Nota: el modelo no tiene getCollectionsByBrand; lo resolvemos con getFiltersByBrand y devolvemos solo colecciones.
   */
  async getCollectionsByBrand(req, res) {
    try {
      const { brand } = req.query;

      if (!brand || typeof brand !== 'string' || brand.trim() === '') {
        return res.status(400).json({ message: 'A valid brand parameter is required. Please provide a brand.' });
      }

      const byBrand = await ProductModel.getFiltersByBrand(brand.trim());
      const collections = byBrand?.collections ?? [];

      okCache(res, 3600);
      return res.json(collections);
    } catch (error) {
      console.error(`Error fetching collections for brand '${req.query.brand}':`, error);
      return res.status(500).json({
        error: 'Error fetching collections by brand',
        details: error.message || 'Unknown error',
      });
    }
  }

  /**
   * POST /api/products/filter?limit=16&page=1
   * Filtrado avanzado (brand, collection, color, tipo, estilo, uso, martindale, mantenimiento…)
   * El modelo ya aplica exclusiones y devolvemos paginación.
   */
  async filterProducts(req, res) {
    const filters = req.body;
    const limit = toInt(req.query.limit, 16);
    const page = toInt(req.query.page, 1);
    const offset = (page - 1) * limit;

    try {
      const { products, total } = await ProductModel.filter(filters, limit, offset);

      // Post-filtro de consistencia (idéntico al que ya usabas):
      const validProducts = products.filter(product =>
        !/^(LIBRO|PORTADA|SET|KIT|COMPOSICION ESPECIAL|COLECCIÓN|ALFOMBRA|ANUNCIADA|MULETON|ATLAS|QUALITY SAMPLE|PERCHA|ALQUILER|CALCUTA C35|TAPILLA|LÁMINA|ACCESORIOS MUESTRARIOS|CONTRAPORTADA|ALFOMBRAS|AGARRADERAS|ARRENDAMIENTOS INTRACOMUNITARIOS|\d+)/i.test(product.desprodu)
        && !/CUTTING|PERCHA|FUERA DE COLECCIÓN/i.test(product.desprodu)
        && ['ARE', 'FLA', 'CJM', 'HAR', 'BAS'].includes(product.codmarca)
      );

      okCache(res, 3600);
      res.json({
        products: validProducts,
        pagination: {
          currentPage: page,
          limit,
          totalResults: total,
          totalValidResults: validProducts.length
        }
      });
    } catch (error) {
      console.error('Error filtering products:', error);
      res.status(500).json({ error: 'Error filtering products', details: error.message });
    }
  }

  /**
   * GET /api/products/filterByType?type=papel|telas&limit=16&page=1
   */
  async filterByType(req, res) {
    const { type } = req.query;
    const limit = toInt(req.query.limit, 16);
    const page = toInt(req.query.page, 1);
    const offset = (page - 1) * limit;

    if (!type || !['papel', 'telas'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type parameter' });
    }

    try {
      const { products, total } = await ProductModel.getByType({ type, limit, offset });
      okCache(res, 3600);
      res.json({
        products,
        pagination: {
          currentPage: page,
          limit,
          totalResults: total,
        },
      });
    } catch (error) {
      console.error('Error filtering products by type:', error);
      res.status(500).json({ error: 'Error filtering products by type', details: error.message });
    }
  }

  /**
   * GET /api/products/codfamil/:codfamil
   * Listado por código de familia (simple)
   */
  async getByCodFamil(req, res) {
    try {
      const { codfamil } = req.params;
      const products = await ProductModel.getByCodFamil(codfamil);
      okCache(res, 3600);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ===========================================================================
  // 3) Búsquedas internas por texto para autocompletados
  // ===========================================================================

  /**
   * GET /api/products/searchCollections?searchTerm=FOO
   * Devuelve colecciones (texto) que matchean el término.
   * Se devuelve 200 con [] (mejor para UX de autocompletado).
   */
  async searchCollections(req, res) {
    try {
      const { searchTerm } = req.query;
      if (!searchTerm || searchTerm.trim() === '') {
        return res.status(200).json([]);
      }
      const collections = await ProductModel.searchCollections(searchTerm.trim());
      return res.status(200).json(collections);
    } catch (error) {
      console.error('Error searching collections:', error);
      res.status(500).json({ error: 'Error searching collections', details: error.message });
    }
  }

  /**
   * GET /api/products/searchFabricTypes?searchTerm=...
   */
  async searchFabricTypes(req, res) {
    try {
      const { searchTerm } = req.query;
      if (!searchTerm || searchTerm.trim() === '') {
        return res.status(200).json([]);
      }

      const fabricTypes = await ProductModel.searchFabricTypes(searchTerm.trim());
      return res.json(fabricTypes);
    } catch (error) {
      console.error('Error searching fabric types:', error);
      res.status(500).json({ error: 'Error searching fabric types', details: error.message });
    }
  }

  /**
   * GET /api/products/searchFabricPatterns?searchTerm=...
   */
  async searchFabricPatterns(req, res) {
    try {
      const { searchTerm } = req.query;
      if (!searchTerm || searchTerm.trim() === '') {
        return res.status(200).json([]);
      }

      const fabricPatterns = await ProductModel.searchFabricPatterns(searchTerm.trim());
      return res.json(fabricPatterns);
    } catch (error) {
      console.error('Error searching fabric patterns:', error);
      res.status(500).json({ error: 'Error searching fabric patterns', details: error.message });
    }
  }

  // ===========================================================================
  // 4) Consultas por relación / similitud / colección exacta
  // ===========================================================================

  /**
   * GET /api/products/byCollection?collection=ATMOSPHERE
   * Devuelve productos de una colección exacta (case-sensitive en DB,
   * pero el modelo ya hace igualdad por valor exacto).
   */
  async getByExactCollection(req, res) {
    try {
      const { collection } = req.query;

      if (!collection || collection.trim() === '') {
        return res.status(400).json({ message: 'Collection parameter is required' });
      }

      const productos = await ProductModel.getByCollectionExact(collection.trim());
      if (productos.length === 0) {
        return res.status(404).json({ message: 'No products found for the specified collection' });
      }

      okCache(res, 3600);
      res.json(productos);
    } catch (error) {
      console.error('Error fetching products by exact collection:', error);
      res.status(500).json({ error: 'Error fetching products by exact collection', details: error.message });
    }
  }

  /**
   * GET /api/products/similarByStyle?estilo=...&excludeNombre=...&excludeColeccion=...
   * Devuelve productos “parecidos” por estilo con imagen disponible.
   */
  async getSimilarByStyle(req, res) {
    try {
      const { estilo, excludeNombre, excludeColeccion } = req.query;

      if (!estilo || !excludeNombre || !excludeColeccion) {
        return res.status(400).json({ message: 'Missing required parameters' });
      }

      const productos = await ProductModel.getSimilarByStyle({
        estilo,
        excludeNombre,
        excludeColeccion,
      });

      if (!productos || productos.length === 0) {
        return res.status(404).json({ message: 'No similar products found' });
      }

      okCache(res, 3600);
      res.json(productos);
    } catch (error) {
      console.error('Error fetching similar products by style:', error);
      res.status(500).json({ error: 'Error fetching similar products', details: error.message });
    }
  }

  // productController.js
  async getProductByCollection(req, res) {
    try {
      const coleccion = typeof req.query.coleccion === 'string'
        ? req.query.coleccion.trim()
        : '';

      if (!coleccion) {
        return res.status(400).json({ message: 'Missing coleccion' });
      }

      const productos = await ProductModel.getProductByCollection({ coleccion });

      // Devuelve 200 aunque esté vacío para no romper el UI
      return res.json({ products: productos || [] });
    } catch (e) {
      console.error('Error fetching collection products:', e);
      return res.status(500).json({ error: 'Error fetching collection products', details: e.message });
    }
  }


  /**
   * GET /api/products/byCollectionExcluding?coleccion=...&excludeCodprodu=...
   * Devuelve productos de la colección (excluyendo el código dado) con imagen “Buena”.
   */
  async getByCollectionExcluding(req, res) {
    try {
      const { coleccion, excludeCodprodu } = req.query;

      if (!coleccion || !excludeCodprodu) {
        return res.status(400).json({ message: 'Missing required parameters' });
      }

      const productos = await ProductModel.getByCollectionExcluding({
        coleccion,
        excludeCodprodu,
      });

      if (!productos || productos.length === 0) {
        return res.status(404).json({ message: 'No products found in the collection' });
      }

      okCache(res, 3600);
      res.json(productos);
    } catch (error) {
      console.error('Error fetching collection products:', error);
      res.status(500).json({ error: 'Error fetching collection products', details: error.message });
    }
  }
}
