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
    };
}