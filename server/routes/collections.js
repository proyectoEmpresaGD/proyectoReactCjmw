// routes/collections.js
import { Router } from 'express';
import { CollectionsController } from '../controllers/collectionsController.js';

export const createCollectionsRouter = () => {
    const router = Router();
    const controller = new CollectionsController();

    router.get(
        '/image',
        controller.getImage.bind(controller)
    );

    router.get(
        '/brand/:marca',
        controller.getBrandCollections.bind(controller)
    );

    router.get(
        '/previews/:marca',
        controller.getBrandCollectionPreviews.bind(controller)
    );

    router.get(
        '/images',
        controller.getCollectionImages.bind(controller)
    );

    return router;
};