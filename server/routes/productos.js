// routes/productos.js
import { Router } from 'express';
import { ProductController } from '../controllers/productos.js';

/**
 * Router de productos
 * Orden MUY importante: las rutas específicas deben ir antes de '/:id'
 */
export const createProductRouter = () => {
    const productsRouter = Router();
    const productController = new ProductController();

    // ==============================
    // 1. CRUD BÁSICO (excepto :id)
    // ==============================
    productsRouter.get('/', productController.getAll.bind(productController));       // Listar productos
    productsRouter.post('/', productController.create.bind(productController));      // Crear producto

    // ==============================
    // 2. FILTROS
    // ==============================
    productsRouter.get('/filters', productController.getFilters.bind(productController));
    productsRouter.get('/filtersByBrand', productController.getFiltersByBrand.bind(productController));
    productsRouter.post('/filter', productController.filterProducts.bind(productController));
    productsRouter.get('/codfamil/:codfamil', productController.getByCodFamil.bind(productController));

    // ==============================
    // 3. BÚSQUEDAS (rutas con nombre)
    // ==============================
    productsRouter.get('/search', productController.search.bind(productController));                       // clásica
    productsRouter.get('/search-quick', productController.searchQuick.bind(productController));            // barra rápida
    productsRouter.get('/search-products', productController.searchProducts.bind(productController));      // CardProduct

    // ==============================
    // 4. AUTOCOMPLETADOS
    // ==============================
    productsRouter.get('/searchCollections', productController.searchCollections.bind(productController));
    productsRouter.get('/searchFabricTypes', productController.searchFabricTypes.bind(productController));
    productsRouter.get('/searchFabricPatterns', productController.searchFabricPatterns.bind(productController));

    // ==============================
    // 5. RELACIONADOS / COLECCIONES
    // ==============================
    productsRouter.get('/getCollectionsByBrand', productController.getCollectionsByBrand.bind(productController));
    productsRouter.get('/byCollection', productController.getByExactCollection.bind(productController));
    productsRouter.get('/byCollectionExcluding', productController.getByCollectionExcluding.bind(productController));
    productsRouter.get('/similarByStyle', productController.getSimilarByStyle.bind(productController));

    // ==============================
    // 6. Rutas por ID (¡AL FINAL!)
    // ==============================
    productsRouter.get('/:id', productController.getById.bind(productController));
    productsRouter.patch('/:id', productController.update.bind(productController));
    productsRouter.delete('/:id', productController.delete.bind(productController));

    return productsRouter;
};
