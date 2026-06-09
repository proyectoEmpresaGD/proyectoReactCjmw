import { Router } from 'express';
import { createClientAreaController } from '../controllers/clientAreaController.js';
import { requireCustomerAuth } from '../middlewares/authMiddleware.js';

export function createClientAreaRouter({ pool }) {
    const router = Router();
    const controller = createClientAreaController({ pool });

    router.get('/invoices', requireCustomerAuth, controller.getInvoices);

    router.get(
        '/delivery-notes/uninvoiced',
        requireCustomerAuth,
        controller.getUninvoicedDeliveryNotes
    );

    router.get(
        '/invoices/:ejercicio/:codserfacventa/:nfacventa',
        requireCustomerAuth,
        controller.getInvoiceDetail
    );

    return router;
}