import { Router } from 'express';
import { ProductController } from '../controllers/productos.js';

export const createProductRouter = () => {
    const productsRouter = Router();
    const productController = new ProductController();

    // Rutas para la gestión de productos
    productsRouter.get('/', productController.getAll.bind(productController));
    productsRouter.post('/', productController.create.bind(productController));

    productsRouter.get('/filters', productController.getFilters.bind(productController));
    productsRouter.get('/filtersByBrand', productController.getFiltersByBrand.bind(productController)); // Nueva ruta
    productsRouter.post('/filter', productController.filterProducts.bind(productController));

    // Ruta de búsqueda debe ir antes de las rutas que capturan parámetros como 'id'
    productsRouter.get('/search', productController.search.bind(productController));
    productsRouter.get('/codfamil/:codfamil', productController.getByCodFamil.bind(productController)); // Nueva ruta
    productsRouter.get('/getCollectionsByBrand', productController.getCollectionsByBrand.bind(productController));

    // Nuevas rutas para búsqueda interna (colecciones, tipos de tela, y patrones)
    productsRouter.get('/byCollectionExcluding', productController.getByCollectionExcluding.bind(productController));
    productsRouter.get('/similarByStyle', productController.getSimilarByStyle.bind(productController));
    productsRouter.get('/searchCollections', productController.searchCollections.bind(productController));
    productsRouter.get('/searchFabricTypes', productController.searchFabricTypes.bind(productController));
    productsRouter.get('/searchFabricPatterns', productController.searchFabricPatterns.bind(productController));

    // Rutas para operaciones específicas de un producto
    productsRouter.get('/byCollection', productController.getByExactCollection.bind(productController));
    productsRouter.get('/:id', productController.getById.bind(productController));
    productsRouter.patch('/:id', productController.update.bind(productController));
    productsRouter.delete('/:id', productController.delete.bind(productController));

    return productsRouter;
};
