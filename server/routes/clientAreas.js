import { Router } from 'express';
import { createClientAreaController } from '../controllers/clientAreaController.js';
import { requireCustomerAuth } from '../middlewares/authMiddleware.js';

export function createClientAreaRouter({
    pool,
}) {
    const router = Router();

    const controller =
        createClientAreaController({
            pool,
        });

    router.get(
        '/invoices',
        requireCustomerAuth,
        controller.getInvoices
    );

    router.get(
        '/orders',
        requireCustomerAuth,
        controller.getOrders
    );

    router.get(
        '/orders/:ejercicio/:canal/:codserpedventa/:npedventa',
        requireCustomerAuth,
        controller.getOrderDetail
    );

    router.get(
        '/delivery-notes/uninvoiced',
        requireCustomerAuth,
        controller.getUninvoicedDeliveryNotes
    );

    router.get(
        '/delivery-notes/uninvoiced',
        requireCustomerAuth,
        controller.getUninvoicedDeliveryNotes
    );

    router.get(
        '/invoices/:ejercicio/:codserfacventa/:nfacventa/pdf',
        requireCustomerAuth,
        controller.getInvoicePdf
    );

    router.get(
        '/invoices/:ejercicio/:codserfacventa/:nfacventa',
        requireCustomerAuth,
        controller.getInvoiceDetail
    );

    router.get(
        '/invoices/:ejercicio/:codserfacventa/:nfacventa/orders',
        requireCustomerAuth,
        controller.getInvoiceOrders
    );



    return router;
}