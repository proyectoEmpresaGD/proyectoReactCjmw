import { Router } from 'express';
import { FtpController } from '../controllers/ftpController.js';

export const createFtpRouter = () => {
    const ftpRouter = Router();
    const controller = new FtpController();

    ftpRouter.get('/image', controller.getImageFromFtp.bind(controller));

    return ftpRouter;
};
