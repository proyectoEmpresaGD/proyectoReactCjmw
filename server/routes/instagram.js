import { Router } from 'express';
import { InstagramController } from '../controllers/instagramController.js';

export const createInstagramRouter = () => {
    const router = Router();
    const controller = new InstagramController();

    router.get('/latest', controller.getLatestPosts.bind(controller));

    return router;
};
