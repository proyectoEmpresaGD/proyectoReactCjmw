import { ProductModel } from '../models/Postgres/productos.js';

export class ProductController {
  async getAll(req, res) {
    try {
      const { CodFamil, CodSubFamil, limit, page } = req.query;
      const requiredLimit = parseInt(limit, 10) || 16; // Asegura que el límite por defecto sea 16
      const pageParsed = parseInt(page, 10) || 1;
      const offset = (pageParsed - 1) * requiredLimit;

      // Obtenemos los productos
      const products = await ProductModel.getAll({ CodFamil, CodSubFamil, requiredLimit, offset });

      // Cache-Control para cachear la respuesta en el edge de Vercel
      res.set('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // 1 hora de caché en edge
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCollectionsByBrand(req, res) {
    try {
      const { brand } = req.query;

      // Validación del parámetro 'brand'
      if (!brand || typeof brand !== 'string' || brand.trim() === '') {
        return res.status(400).json({ message: 'A valid brand parameter is required. Please provide a brand.' });
      }

      // Obtener las colecciones del modelo
      const collections = await ProductModel.getCollectionsByBrand(brand.trim());

      // Si no se encuentran colecciones
      if (collections.length === 0) {
        return res.status(404).json({ message: `No collections found for the brand '${brand}'` });
      }

      // Configurar la caché y devolver las colecciones
      res.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      return res.json(collections);

    } catch (error) {
      // Manejo del error
      console.error(`Error fetching collections for brand '${req.query.brand}':`, error);
      return res.status(500).json({
        error: 'Error fetching collections by brand',
        details: error.message || 'Unknown error',
      });
    }
  }


  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.getById({ id });
      if (product) {
        res.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
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

      // Invalidar caché al crear un producto
      res.set('Cache-Control', 'no-store'); // Evitar caché
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
        // Invalidar caché al actualizar un producto
        res.set('Cache-Control', 'no-store'); // Evitar caché
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
        // Invalidar caché al eliminar un producto
        res.set('Cache-Control', 'no-store'); // Evitar caché
        res.json({ message: 'Product deleted' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async search(req, res) {
    try {
      const { query, limit, page } = req.query;

      // 1️⃣ Validación de query
      if (!query || !query.trim()) {
        return res.status(400).json({ message: 'Query parameter is required' });
      }

      // 2️⃣ Parseo de paginación
      const limitParsed = parseInt(limit, 10) || 12;
      const pageParsed = parseInt(page, 10) || 1;
      const offset = (pageParsed - 1) * limitParsed;

      // 3️⃣ Llamada al modelo (incluye ahora nombre+tonalidad)
      const { products, total } = await ProductModel.search({
        query,
        limit: limitParsed,
        offset
      });

      console.log('[DEBUG] Controller search results count:', products.length);

      // 4️⃣ Si no hay resultados, devolvemos 404
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found for the search query' });
      }

      // 5️⃣ Cache y respuesta
      res.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      return res.json({
        products,
        pagination: {
          currentPage: pageParsed,
          limit: limitParsed,
          totalResults: total
        }
      });
    } catch (error) {
      console.error('Error searching products:', error);
      return res
        .status(500)
        .json({ error: 'Error searching products', details: error.message });
    }
  }


  async getByCodFamil(req, res) {
    try {
      const { codfamil } = req.params;
      const products = await ProductModel.getByCodFamil(codfamil);
      res.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getFilters(req, res) {
    try {
      const filters = await ProductModel.getFilters();
      res.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      res.json(filters);
    } catch (error) {
      console.error('Error fetching filters:', error);
      res.status(500).send({ error: 'Error fetching filters', details: error.message });
    }
  }

  // dentro de ProductController:
  async filterProducts(req, res) {
    // Los filtros llegan por POST en el body
    const filters = req.body;
    const limit = parseInt(req.query.limit, 10) || 16;
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    try {
      // Llamamos a ProductModel.filter, que hemos extendido para aceptar:
      // filters.uso (['FR','OUTDOOR','IMO']), filters.mantenimiento (['EASYCLEAN']), etc.
      const { products, total } = await ProductModel.filter(filters, limit, offset);

      // Aplicamos las mismas validaciones de "desprodu" y "codmarca" que ya tenías
      const validProducts = products.filter(product =>
        // Excluir por desprodu
        !/^(LIBRO|PORTADA|SET|KIT|COMPOSICION ESPECIAL|COLECCIÓN|ALFOMBRA|ANUNCIADA|MULETON|ATLAS|QUALITY SAMPLE|PERCHA|ALQUILER|CALCUTA C35|TAPILLA|LÁMINA|ACCESORIOS MUESTRARIOS|CONTRAPORTADA|ALFOMBRAS|AGARRADERAS|ARRENDAMIENTOS INTRACOMUNITARIOS|\d+)/i.test(product.desprodu)
        && !/CUTTING|PERCHA|FUERA DE COLECCIÓN/i.test(product.desprodu)
        // Solo determinadas marcas
        && ['ARE', 'FLA', 'CJM', 'HAR', 'BAS'].includes(product.codmarca)
      );

      // Cache-Control en edge
      res.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      // Devolvemos productos filtrados + meta
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



  async filterByType(req, res) {
    const { type } = req.query;
    const limit = parseInt(req.query.limit, 10) || 16;
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;

    if (!type || !['papel', 'telas'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type parameter' });
    }

    try {
      const { products, total } = await ProductModel.getByType({ type, limit, offset });
      res.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
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
  // Buscar colecciones
  async searchCollections(req, res) {
    try {
      const { searchTerm } = req.query;
      if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ message: 'Search term is required' });
      }

      const collections = await ProductModel.searchCollections(searchTerm.trim());
      if (collections.length === 0) {
        return res.status(404).json({ message: 'No collections found' });
      }

      res.json(collections);
    } catch (error) {
      console.error('Error searching collections:', error);
      res.status(500).json({ error: 'Error searching collections', details: error.message });
    }
  }

  // Buscar tipos de tela
  async searchFabricTypes(req, res) {
    try {
      const { searchTerm } = req.query;
      if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ message: 'Search term is required' });
      }

      const fabricTypes = await ProductModel.searchFabricTypes(searchTerm.trim());
      if (fabricTypes.length === 0) {
        return res.status(404).json({ message: 'No fabric types found' });
      }

      res.json(fabricTypes);
    } catch (error) {
      console.error('Error searching fabric types:', error);
      res.status(500).json({ error: 'Error searching fabric types', details: error.message });
    }
  }

  // Buscar patrones de tela
  async searchFabricPatterns(req, res) {
    try {
      const { searchTerm } = req.query;
      if (!searchTerm || searchTerm.trim() === '') {
        return res.status(400).json({ message: 'Search term is required' });
      }

      const fabricPatterns = await ProductModel.searchFabricPatterns(searchTerm.trim());
      if (fabricPatterns.length === 0) {
        return res.status(404).json({ message: 'No fabric patterns found' });
      }

      res.json(fabricPatterns);
    } catch (error) {
      console.error('Error searching fabric patterns:', error);
      res.status(500).json({ error: 'Error searching fabric patterns', details: error.message });
    }
  }


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

      res.json(filters);
    } catch (error) {
      console.error('Error fetching filters by brand:', error);
      res.status(500).json({ message: 'Error fetching filters by brand', error });
    }
  }

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

      res.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
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

      res.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      res.json(productos);
    } catch (error) {
      console.error('Error fetching similar products by style:', error);
      res.status(500).json({ error: 'Error fetching similar products', details: error.message });
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

      res.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      res.json(productos);
    } catch (error) {
      console.error('Error fetching collection products:', error);
      res.status(500).json({ error: 'Error fetching collection products', details: error.message });
    }
  }

}
