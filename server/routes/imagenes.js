import { Router } from 'express';
import { ImagenController } from '../controllers/imagenes.js';

export const createImagenRouter = () => {
    const imagenRouter = Router();
    const imagenController = new ImagenController();

    // Rutas para la gestión de imágenes
    imagenRouter.get('/', imagenController.getAll.bind(imagenController)); // Obtener todas las imágenes
    imagenRouter.post('/', imagenController.create.bind(imagenController)); // Crear una nueva imagen

    // Rutas para operaciones específicas de una imagen
    imagenRouter.get('/:codprodu/:codclaarchivo', imagenController.getById.bind(imagenController)); // Obtener imagen por ID
    imagenRouter.patch('/:codprodu/:codclaarchivo', imagenController.update.bind(imagenController)); // Actualizar imagen
    imagenRouter.delete('/:codprodu/:codclaarchivo', imagenController.delete.bind(imagenController)); // Eliminar imagen

    return imagenRouter;
};