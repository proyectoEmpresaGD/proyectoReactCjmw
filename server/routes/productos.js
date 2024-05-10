import { Router } from 'express';
import { ProductController } from '../controllers/productos.js';

export const createProductRouter = () => {
    const productsRouter = Router();
    const productController = new ProductController();



    productsRouter.get('/', productController.getAll.bind(productController));
    productsRouter.post('/', productController.create.bind(productController));
    productsRouter.get('/:id', productController.getById.bind(productController));
    productsRouter.delete('/:id', productController.delete.bind(productController));
    productsRouter.patch('/:id', productController.update.bind(productController));
    productsRouter.get('/products/search', productController.search.bind(productController));

    return productsRouter;
}
