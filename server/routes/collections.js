// routes/collections.js
import { Router } from 'express';
import { CollectionsController } from '../controllers/collectionsController.js';

export const createCollectionsRouter = () => {
    const router = Router();
    const controller = new CollectionsController();

    // Mantener compatibilidad: esta era /api/ftp/image
    router.get('/image', controller.getImage.bind(controller));

    // Nuevos (opcionales)
    router.get('/brand/:marca', controller.getBrandCollections.bind(controller));
    router.get('/images', controller.getCollectionImages.bind(controller));

    return router;
};
