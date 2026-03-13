import { Router } from 'express';
import { createClientAreaController } from '../controllers/clientAreaController.js';
import { requireCustomerAuth } from '../middlewares/authMiddleware.js';

export function createClientAreaRouter({ pool }) {
    const router = Router();
    const controller = createClientAreaController({ pool });

    router.get('/invoices', requireCustomerAuth, controller.getInvoices);

    return router;
}