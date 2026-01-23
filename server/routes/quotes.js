// routes/quotes.js
import { Router } from 'express';
import multer from 'multer';
import { QuotesController } from '../controllers/quotesController.js';

const upload = multer({ limits: { fileSize: 20 * 1024 * 1024 } }); // 20MB

export const createQuotesRouter = () => {
    const router = Router();
    const controller = new QuotesController();

    // POST /api/quotes/register-and-sign (multipart/form-data)
    router.post('/register-and-sign', upload.single('file'), controller.registerAndSign.bind(controller));
    // (opcional) alias para compatibilidad con llamadas antiguas:
    router.post('/register-sign', upload.single('file'), controller.registerAndSign.bind(controller));

    // GET /api/quotes/:ref -> metadatos
    router.get('/:ref', controller.getByRef.bind(controller));

    return router;
};
