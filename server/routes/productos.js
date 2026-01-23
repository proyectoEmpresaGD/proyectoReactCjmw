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

    // 🎄 NUEVO: productos “Especial Navidad”
    productsRouter.get('/holiday', productController.getHolidayProducts.bind(productController));

    // ==============================
    // 3. BÚSQUEDAS (rutas con nombre)
    // ==============================
    productsRouter.get('/search', productController.search.bind(productController));
    productsRouter.get('/search-quick', productController.searchQuick.bind(productController));
    productsRouter.get('/search-products', productController.searchProducts.bind(productController));

    // 👇 NUEVAS (DEBEN IR ANTES DE /:id)
    productsRouter.post('/linings/search', (req, res) => productController.searchLinings(req, res));
    productsRouter.post('/upholstery/search', (req, res) => productController.searchUpholstery(req, res));
    productsRouter.post('/wallpapers/search', (req, res) => productController.searchWallpapers(req, res));

    // ❗ CORRECCIÓN: apuntar al handler correcto (sin typo) que devuelve `ancho`
    productsRouter.post('/curtains/search', (req, res) => productController.searchCurtains(req, res));

    productsRouter.get('/:id/colors', (req, res) => productController.getColors(req, res));


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
    productsRouter.get('/byProductCollection',
        productController.getProductByCollection.bind(productController)
    );
    productsRouter.post('/byProductCollection',
        productController.getProductByCollection.bind(productController)
    );



    // ==============================
    // 6. Rutas por ID (¡AL FINAL!)
    // ==============================
    productsRouter.get('/:id', productController.getById.bind(productController));
    productsRouter.patch('/:id', productController.update.bind(productController));
    productsRouter.delete('/:id', productController.delete.bind(productController));

    return productsRouter;
};
