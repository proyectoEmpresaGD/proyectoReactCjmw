import { Router } from 'express';
import { ProductController } from '../controllers/productos.js';

export const createProductRouter = () => {
    const productsRouter = Router();
    const productController = new ProductController();

    // Rutas para la gestión de productos con cache optimizado
    productsRouter.get('/', productController.getAll.bind(productController)); // Obtener todos los productos (con cache)
    productsRouter.post('/', productController.create.bind(productController)); // Crear un producto (invalida cache)

    // Rutas para obtener filtros y filtrar productos
    productsRouter.get('/filters', productController.getFilters.bind(productController)); // Obtener todos los filtros (con cache)
    productsRouter.post('/filter', productController.filterProducts.bind(productController)); // Filtrar productos por parámetros (con cache)

    // Ruta de búsqueda debe ir antes de las rutas que capturan parámetros como 'id'
    productsRouter.get('/search', productController.search.bind(productController)); // Buscar productos (con cache)

    // Ruta para obtener productos por familia
    productsRouter.get('/codfamil/:codfamil', productController.getByCodFamil.bind(productController)); // Obtener productos por familia (con cache)

    // Ruta para obtener colecciones por marca
    productsRouter.get('/getCollectionsByBrand', productController.getCollectionsByBrand.bind(productController)); // Obtener colecciones por marca (con cache)

    // Rutas para operaciones específicas de un producto
    productsRouter.get('/:id', productController.getById.bind(productController)); // Obtener producto por ID (con cache)
    productsRouter.patch('/:id', productController.update.bind(productController)); // Actualizar un producto (invalida cache)
    productsRouter.delete('/:id', productController.delete.bind(productController)); // Eliminar un producto (invalida cache)

    return productsRouter;
};
