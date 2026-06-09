import { ClientAreaModel } from '../models/Postgres/clientAreaModel.js';

export function createClientAreaController({ pool }) {
    const model = new ClientAreaModel(pool);

    return {
        getInvoices: async (req, res, next) => {
            try {
                const { ejercicio } = req.query;
                const codclien = req.customer?.codclien || req.user?.codclien;

                if (!codclien) {
                    return res.status(401).json({
                        message: 'Cliente no autenticado',
                    });
                }

                const invoices = await model.getInvoicesByCustomerCode({
                    codclien,
                    ejercicio,
                });

                return res.json({ invoices });
            } catch (error) {
                return next(error);
            }
        },

        getInvoiceDetail: async (req, res, next) => {
            try {
                const codclien = req.customer?.codclien || req.user?.codclien;
                const { ejercicio, codserfacventa, nfacventa } = req.params;

                if (!codclien) {
                    return res.status(401).json({
                        message: 'Cliente no autenticado',
                    });
                }

                const invoice = await model.getInvoiceDetailByCustomerCode({
                    codclien,
                    ejercicio,
                    codserfacventa,
                    nfacventa,
                });

                if (!invoice) {
                    return res.status(404).json({
                        message: 'Factura no encontrada',
                    });
                }

                return res.json({ invoice });
            } catch (error) {
                return next(error);
            }
        },

        getUninvoicedDeliveryNotes: async (req, res, next) => {
            try {
                const { ejercicio } = req.query;
                const codclien = req.customer?.codclien || req.user?.codclien;

                if (!codclien) {
                    return res.status(401).json({
                        message: 'Cliente no autenticado',
                    });
                }

                const deliveryNotes = await model.getUninvoicedDeliveryNotesByCustomerCode({
                    codclien,
                    ejercicio,
                });

                return res.json({ deliveryNotes });
            } catch (error) {
                return next(error);
            }
        },
    };
}