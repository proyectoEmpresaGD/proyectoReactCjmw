import { ClientAreaModel } from '../models/Postgres/clientAreaModel.js';
import { generateInvoicePdf } from '../services/invoicePdfService.js';
import { getInvoicePaymentInfo } from '../config/invoicePaymentConfig.js';
import { buildInvoicePaymentSchedule } from '../services/invoicePaymentScheduleService.js';

export function createClientAreaController({ pool }) {
    const model = new ClientAreaModel(pool);

    return {
        getInvoices: async (req, res, next) => {
            try {
                const { ejercicio } = req.query;

                const codclien =
                    req.customer?.codclien ||
                    req.user?.codclien;

                if (!codclien) {
                    return res.status(401).json({
                        message: 'Cliente no autenticado',
                    });
                }

                const invoices =
                    await model.getInvoicesByCustomerCode({
                        codclien,
                        ejercicio,
                    });

                return res.json({
                    invoices,
                });
            } catch (error) {
                return next(error);
            }
        },

        getInvoiceDetail: async (req, res, next) => {
            try {
                const codclien =
                    req.customer?.codclien ||
                    req.user?.codclien;

                const {
                    ejercicio,
                    codserfacventa,
                    nfacventa,
                } = req.params;

                if (!codclien) {
                    return res.status(401).json({
                        message: 'Cliente no autenticado',
                    });
                }

                const invoice =
                    await model.getInvoiceDetailByCustomerCode({
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

                return res.json({
                    invoice,
                });
            } catch (error) {
                return next(error);
            }
        },

        getInvoicePdf: async (req, res, next) => {
            try {
                const codclien =
                    req.customer?.codclien ||
                    req.user?.codclien;

                const {
                    ejercicio,
                    codserfacventa,
                    nfacventa,
                } = req.params;

                if (!codclien) {
                    return res.status(401).json({
                        message: 'Cliente no autenticado',
                    });
                }

                const invoice =
                    await model.getInvoiceDetailByCustomerCode({
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

                /*
                 * Obtenemos la forma de pago a partir
                 * del codforpago del cliente.
                 */
                const paymentMethod =
                    getInvoicePaymentInfo(
                        invoice.codforpago
                    );

                /*
                 * Construimos los vencimientos.
                 *
                 * Si NO es giro:
                 * - fecha vacía
                 * - importe completo
                 *
                 * Si es giro:
                 * - calcula fechas
                 * - reparte el importe
                 */
                const paymentSchedule =
                    buildInvoicePaymentSchedule({
                        invoiceDate:
                            invoice.fecha,

                        totalAmount:
                            invoice.imptotal,

                        paymentLabel:
                            paymentMethod.label,
                    });

                /*
                 * Creamos el modelo específico
                 * que necesita la vista PDF.
                 */
                const printableInvoice = {
                    ...invoice,
                    paymentMethod,
                    paymentSchedule,
                };

                /*
                 * generateInvoicePdf es async
                 * porque carga los logos remotos.
                 */
                const {
                    buffer,
                    filename,
                } =
                    await generateInvoicePdf(
                        printableInvoice
                    );

                res.setHeader(
                    'Content-Type',
                    'application/pdf'
                );

                res.setHeader(
                    'Content-Disposition',
                    `inline; filename="${filename}"`
                );

                res.setHeader(
                    'Content-Length',
                    String(buffer.length)
                );

                res.setHeader(
                    'Cache-Control',
                    'private, no-store'
                );

                return res.send(buffer);
            } catch (error) {
                return next(error);
            }
        },

        getInvoiceOrders: async (
            req,
            res,
            next
        ) => {
            try {
                const codclien =
                    req.customer?.codclien ||
                    req.user?.codclien;

                const {
                    ejercicio,
                    codserfacventa,
                    nfacventa,
                } = req.params;

                if (!codclien) {
                    return res.status(401).json({
                        message:
                            'Cliente no autenticado',
                    });
                }

                /*
                 * Primero verificamos que la factura
                 * realmente pertenece al cliente.
                 */
                const invoice =
                    await model.getInvoiceDetailByCustomerCode({
                        codclien,
                        ejercicio,
                        codserfacventa,
                        nfacventa,
                    });

                if (!invoice) {
                    return res.status(404).json({
                        message:
                            'Factura no encontrada',
                    });
                }

                const orders =
                    await model.getInvoiceOrdersByCustomerCode({
                        codclien,
                        ejercicio,
                        codserfacventa,
                        nfacventa,
                    });

                return res.json({
                    invoice: {
                        ejercicio:
                            invoice.ejercicio,

                        fecha:
                            invoice.fecha,

                        sfactura:
                            invoice.sfactura,

                        codserfacventa:
                            invoice.codserfacventa,

                        nfacventa:
                            invoice.nfacventa,

                        referencia:
                            invoice.referencia,

                        imptotal:
                            invoice.imptotal,
                    },

                    orders,
                });
            } catch (error) {
                return next(error);
            }
        },

        getOrderDetail: async (
            req,
            res,
            next
        ) => {
            try {
                const codclien =
                    req.customer?.codclien ||
                    req.user?.codclien;

                const {
                    ejercicio,
                    canal,
                    codserpedventa,
                    npedventa,
                } = req.params;

                if (!codclien) {
                    return res.status(401).json({
                        message:
                            'Cliente no autenticado',
                    });
                }

                const order =
                    await model.getOrderDetailByCustomerCode({
                        codclien,
                        ejercicio,
                        canal,
                        codserpedventa,
                        npedventa,
                    });

                if (!order) {
                    return res.status(404).json({
                        message:
                            'Pedido no encontrado',
                    });
                }

                return res.json({
                    order,
                });
            } catch (error) {
                return next(error);
            }
        },

        getOrders: async (
            req,
            res,
            next
        ) => {
            try {
                const {
                    ejercicio,
                } = req.query;

                const codclien =
                    req.customer?.codclien ||
                    req.user?.codclien;

                if (!codclien) {
                    return res
                        .status(401)
                        .json({
                            message:
                                'Cliente no autenticado',
                        });
                }

                const orders =
                    await model.getOrdersByCustomerCode({
                        codclien,
                        ejercicio,
                    });

                return res.json({
                    orders,
                });
            } catch (error) {
                return next(
                    error
                );
            }
        },

        getOrderDetail: async (
            req,
            res,
            next
        ) => {
            try {
                const codclien =
                    req.customer?.codclien ||
                    req.user?.codclien;

                const {
                    ejercicio,
                    canal,
                    codserpedventa,
                    npedventa,
                } = req.params;

                if (!codclien) {
                    return res
                        .status(401)
                        .json({
                            message:
                                'Cliente no autenticado',
                        });
                }

                const order =
                    await model.getOrderDetailByCustomerCode({
                        codclien,
                        ejercicio,
                        canal,
                        codserpedventa,
                        npedventa,
                    });

                if (!order) {
                    return res
                        .status(404)
                        .json({
                            message:
                                'Pedido no encontrado',
                        });
                }

                return res.json({
                    order,
                });
            } catch (error) {
                return next(
                    error
                );
            }
        },

        getUninvoicedDeliveryNotes: async (
            req,
            res,
            next
        ) => {
            try {
                const { ejercicio } = req.query;

                const codclien =
                    req.customer?.codclien ||
                    req.user?.codclien;

                if (!codclien) {
                    return res.status(401).json({
                        message: 'Cliente no autenticado',
                    });
                }

                const deliveryNotes =
                    await model.getUninvoicedDeliveryNotesByCustomerCode(
                        {
                            codclien,
                            ejercicio,
                        }
                    );

                return res.json({
                    deliveryNotes,
                });
            } catch (error) {
                return next(error);
            }
        },
    };
}