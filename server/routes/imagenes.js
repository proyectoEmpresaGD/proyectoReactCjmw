import { Router } from 'express';
import { ImagenController } from '../controllers/imagenes.js';

export const createImagenRouter = () => {
    const imagenRouter = Router();
    const imagenController = new ImagenController();

    // Rutas para la gestión de imágenes
    imagenRouter.get('/', imagenController.getAll.bind(imagenController));
    imagenRouter.post('/', imagenController.create.bind(imagenController));

    // Rutas para operaciones específicas de una imagen
    // Obtener todas las imágenes de un producto (filtrables por tipos)
    imagenRouter.get(
        '/product/:codprodu',
        imagenController.getByCodprodu.bind(imagenController)
    );
    // NUEVA: Obtener todas las imágenes por nombre de producto (filtrable por types)
    // Ej: /api/images/product-name/COSY?types=AMBIENTE_BAJA_1,AMBIENTE_BUENA_1
    imagenRouter.get(
        '/product-name/:nombre',
        imagenController.getByNombre.bind(imagenController)
    );

    // Rutas para operaciones específicas de una imagen
    imagenRouter.get('/:codprodu/:codclaarchivo', imagenController.getByCodproduAndCodclaarchivo.bind(imagenController));

    imagenRouter.patch('/:codprodu/:codclaarchivo', imagenController.update.bind(imagenController));
    imagenRouter.delete('/:codprodu/:codclaarchivo', imagenController.delete.bind(imagenController));

    return imagenRouter;
}
