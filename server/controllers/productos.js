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

// Normaliza números "12,34" → 12.34
const numberFrom = (v) => {
  if (v == null) return null;
  const n = Number(String(v).replace(',', '.').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : null;
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

  constructor() {
    this.model = ProductModel;

    // Bind como ya haces tú
    this.searchLinings = this.searchLinings.bind(this);
    this.getColors = this.getColors.bind(this);
    this.searchUpholstery = this.searchUpholstery.bind(this);

    // IMPORTANTE: método correcto para cortinas
    this.searchCurtains = this.searchCurtains.bind(this);

    // (compat) si en algún sitio quedara el typo, lo redirigimos
    this.searchCurtais = this.searchCurtains.bind(this);
  }

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

  // ==============================
  // 3. BÚSQUEDAS (rutas con nombre)
  // ==============================
  // POST /api/products/linings/search
  async searchLinings(req, res) {
    try {
      const { names = [], q = '' } = req.method === 'GET' ? req.query : (req.body || {});
      const list = Array.isArray(names) ? names.filter(Boolean) : [];

      if (list.length > 0 && String(q).trim() === '') {
        const items = await ProductModel.getLiningsFeatured({ names: list, limit: 80 });
        return res.status(200).json({ items });
      }

      const items = await ProductModel.searchLiningsByNamesAndQuery({
        names: list,
        q: String(q || ''),
        limit: 80
      });

      return res.status(200).json({ items });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'DB error' });
    }
  }

  // POST /api/products/upholstery/search
  async searchUpholstery(req, res) {
    try {
      const { q = '' } = req.method === 'GET' ? req.query : (req.body || {});
      const items = await ProductModel.searchUpholsteryByQuery({ q: String(q || ''), limit: 80 });
      return res.status(200).json({ items });
    } catch (e) {
      console.error('searchUpholstery error:', e);
      return res.status(500).json({ error: 'DB error' });
    }
  }

  // ✅ POST /api/products/curtains/search
  //   usa el modelo correcto y asegura enviar `ancho` al front
  async searchCurtains(req, res) {
    try {
      const { q = '' } = req.method === 'GET' ? req.query : (req.body || {});
      const rows = await ProductModel.searchCurtainsByQuery({ q: String(q || ''), limit: 80 });

      const items = rows.map(p => ({
        id: p.id ?? p.codprodu,
        codprodu: p.codprodu,
        name: p.name ?? p.nombre,
        collection: p.collection ?? p.coleccion ?? null,
        pricePerMeter: p.pricePerMeter ?? numberFrom(p.precioMetro) ?? numberFrom(p.precioMetroRaw),
        imageUrl: p.imageUrl ?? null,
        ancho: p.ancho ?? null, // 👈 CLAVE
      }));

      return res.status(200).json({ items });
    } catch (e) {
      console.error('searchCurtains error:', e);
      return res.status(500).json({ error: 'DB error' });
    }
  }

  // GET /api/products/:id/colors
  async getColors(req, res) {
    try {
      const { id } = req.params; // codprodu base
      const colors = await ProductModel.getColors(id);
      return res.status(200).json({ colors });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'DB error' });
    }
  }

  async searchWallpapers(req, res) {
    try {
      const { limit } = (req.body || {});
      const safeLimit = Number.isFinite(Number(limit)) && Number(limit) > 0
        ? Math.min(Number(limit), 200)
        : 80;

      // 👇 Antes llamabas a ProductModel.searchWallpapersByQuery(...)
      const items = await ProductModel.searchWallpapersAll({ limit: safeLimit });

      res.set('Cache-Control', 's-maxage=300, stale-while-revalidate');
      return res.status(200).json({ items });
    } catch (e) {
      console.error('searchWallpapers error:', e);
      return res.status(500).json({ error: 'DB error' });
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
   * Mantiene TUS filtros originales y añade paginación consistente.
   */
  async filterProducts(req, res) {
    try {
      const page = Math.max(1, parseInt(req.query.page || '1', 10));
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '16', 10)));
      const offset = (page - 1) * limit;

      const filters = req.body || {};

      // usa TU método filter (con misma lógica) pero ahora devuelve total real
      const { products, total } = await ProductModel.filter(filters, limit, offset);

      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;

      okCache(res, 300);
      return res.json({
        products,
        pagination: {
          currentPage: page,
          limit,
          totalResults: total,
          totalPages,
          hasNextPage
        }
      });
    } catch (error) {
      console.error('Error filtering products:', error);
      return res.status(500).json({ error: 'Error filtering products', details: error.message });
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
  * GET /api/products/holiday?limit=16&page=1
  * Devuelve solo productos “Especial Navidad” según los prefijos de nombre.
  */
  async getHolidayProducts(req, res) {
    try {
      const limit = toInt(req.query.limit, 16);
      const page = toInt(req.query.page, 1);
      const offset = (page - 1) * limit;

      const { products, total } = await ProductModel.getHolidayProducts({
        limit,
        offset
      });

      const totalPages = Math.ceil((total || 0) / limit) || 1;
      const hasNextPage = page < totalPages;

      okCache(res, 300); // cache corto para que vaya ágil
      return res.json({
        products,
        pagination: {
          currentPage: page,
          limit,
          totalResults: total,
          totalPages,
          hasNextPage
        }
      });
    } catch (error) {
      console.error('Error fetching holiday products:', error);
      return res.status(500).json({
        error: 'Error fetching holiday products',
        details: error.message
      });
    }
  }

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
