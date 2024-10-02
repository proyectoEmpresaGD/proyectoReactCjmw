import NodeCache from 'node-cache';
import { ProductModel } from '../models/Postgres/productos.js';

// Inicializar NodeCache con un TTL (Time To Live) de 1 hora
const cache = new NodeCache({ stdTTL: 3600 });

export class ProductController {
  async getAll(req, res) {
    const { CodFamil, CodSubFamil, limit, page } = req.query;
    const requiredLimit = parseInt(limit, 10) || 16;
    const pageParsed = parseInt(page, 10) || 1;
    const offset = (pageParsed - 1) * requiredLimit;
    const cacheKey = `products:${CodFamil || 'all'}:${CodSubFamil || 'all'}:${offset}:${requiredLimit}`;

    try {
      // Comprobar si existe en caché
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        res.set('Cache-Control', 'public, max-age=3600');
        return res.json(cachedData);
      }

      const products = await ProductModel.getAll({ CodFamil, CodSubFamil, requiredLimit, offset });
      cache.set(cacheKey, products); // Cachear por 1 hora
      res.set('Cache-Control', 'public, max-age=3600');
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products', details: error.message });
    }
  }

  async getCollectionsByBrand(req, res) {
    const { brand } = req.query;

    // Validar el parámetro brand
    if (!brand || typeof brand !== 'string' || brand.trim() === '') {
      return res.status(400).json({ message: 'A valid brand parameter is required' });
    }

    const cacheKey = `collections:brand:${brand}`;

    try {
      // Intentar obtener los datos desde la caché
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        // Establecer el encabezado de control de caché y devolver los datos
        res.set('Cache-Control', 'public, max-age=3600');
        return res.json(cachedData); // Devolver caché si existe
      }

      // Llamar al método del modelo para obtener las colecciones de la marca
      const collections = await ProductModel.getCollectionsByBrand(brand);

      if (collections.length === 0) {
        return res.status(404).json({ message: `No collections found for brand ${brand}` });
      }

      // Guardar los datos en la caché con un tiempo de vida de 1 hora
      cache.set(cacheKey, collections);
      res.set('Cache-Control', 'public, max-age=3600');
      res.json(collections); // Devolver los datos de la colección
    } catch (error) {
      // Manejar errores de servidor y devolver una respuesta adecuada
      res.status(500).json({ error: 'Error fetching collections', details: error.message });
    }
  }


  async getById(req, res) {
    const { id } = req.params;
    const cacheKey = `product:${id}`;

    try {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        res.set('Cache-Control', 'public, max-age=3600');
        return res.json(cachedData); // Devolver caché si existe
      }

      const product = await ProductModel.getById({ id });
      if (product) {
        cache.set(cacheKey, product); // Cachear por 1 hora
        res.set('Cache-Control', 'public, max-age=3600');
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const newProduct = await ProductModel.create({ input: req.body });
      cache.flushAll(); // Invalidar la caché general de productos
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = await ProductModel.update({ id, input: req.body });
      if (updatedProduct) {
        cache.del(`product:${id}`); // Invalidar la caché del producto actualizado
        cache.flushAll(); // Invalidar la caché general de productos
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await ProductModel.delete({ id });
      if (result) {
        cache.del(`product:${id}`); // Invalidar la caché del producto eliminado
        cache.flushAll(); // Invalidar la caché general de productos
        res.json({ message: 'Product deleted' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async search(req, res) {
    const { query, limit, page } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const limitParsed = parseInt(limit, 10) || 12;
    const pageParsed = parseInt(page, 10) || 1;
    const offset = (pageParsed - 1) * limitParsed;
    const cacheKey = `search:${query}:${offset}:${limitParsed}`;

    try {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        res.set('Cache-Control', 'public, max-age=3600');
        return res.json(cachedData);
      }

      const { products, total } = await ProductModel.search({
        query,
        limit: limitParsed,
        offset,
      });

      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found for the search query' });
      }

      cache.set(cacheKey, { products, total }); // Cachear por 1 hora
      res.set('Cache-Control', 'public, max-age=3600');
      res.json({
        products,
        pagination: {
          currentPage: pageParsed,
          limit: limitParsed,
          totalResults: total,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Error searching products', details: error.message });
    }
  }

  async getByCodFamil(req, res) {
    const { codfamil } = req.params;
    const cacheKey = `products:family:${codfamil}`;

    try {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        res.set('Cache-Control', 'public, max-age=3600');
        return res.json(cachedData);
      }

      const products = await ProductModel.getByCodFamil(codfamil);
      cache.set(cacheKey, products); // Cachear por 1 hora
      res.set('Cache-Control', 'public, max-age=3600');
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFilters(req, res) {
    const cacheKey = 'filters';

    try {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        res.set('Cache-Control', 'public, max-age=3600');
        return res.json(cachedData);
      }

      const filters = await ProductModel.getFilters();
      cache.set(cacheKey, filters); // Cachear por 1 hora
      res.set('Cache-Control', 'public, max-age=3600');
      res.json(filters);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching filters', details: error.message });
    }
  }

  async filterProducts(req, res) {
    const filters = req.body;
    const limit = parseInt(req.query.limit, 10) || 16;
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    const cacheKey = `filter:${JSON.stringify(filters)}:${offset}:${limit}`;

    try {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        res.set('Cache-Control', 'public, max-age=3600');
        return res.json(cachedData);
      }

      const { products, total } = await ProductModel.filter(filters, limit, offset);

      const validProducts = products.filter(
        (product) =>
          !/^(LIBRO|PORTADA|SET|KIT|COMPOSICION ESPECIAL|COLECCIÓN|ALFOMBRA|ANUNCIADA|MULETON|ATLAS|QUALITY SAMPLE|PERCHA|ALQUILER|CALCUTA C35|TAPILLA|LÁMINA|ACCESORIOS MUESTRARIOS|CONTRAPORTADA|ALFOMBRAS|AGARRADERAS|ARRENDAMIENTOS INTRACOMUNITARIOS|\d+)/i.test(
            product.desprodu
          ) &&
          !/CUTTING|PERCHA|FUERA DE COLECCIÓN/i.test(product.desprodu) &&
          ['ARE', 'FLA', 'CJM', 'HAR', 'BAS'].includes(product.codmarca)
      );

      cache.set(cacheKey, { products: validProducts, total }); // Cachear por 1 hora
      res.set('Cache-Control', 'public, max-age=3600');
      res.json({
        products: validProducts,
        pagination: {
          currentPage: page,
          limit,
          totalResults: total,
          totalValidResults: validProducts.length,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Error filtering products', details: error.message });
    }
  }

  async filterByType(req, res) {
    const { type } = req.query;
    const limit = parseInt(req.query.limit, 10) || 16;
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    const cacheKey = `type:${type}:${offset}:${limit}`;

    if (!type || !['papel', 'telas'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type parameter' });
    }

    try {
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        res.set('Cache-Control', 'public, max-age=3600');
        return res.json(cachedData);
      }

      const { products, total } = await ProductModel.getByType({ type, limit, offset });
      cache.set(cacheKey, { products, total }); // Cachear por 1 hora
      res.set('Cache-Control', 'public, max-age=3600');
      res.json({
        products,
        pagination: {
          currentPage: page,
          limit,
          totalResults: total,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Error filtering products by type', details: error.message });
    }
  }
}
