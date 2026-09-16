// controllers/puntosVentaController.js
import { PuntosVentaModel } from "../models/Postgres/puntosVentaModel.js";

export class PuntosVentaController {
    constructor() {
        this.model = PuntosVentaModel;
    }

    /**
     * GET /api/puntos-venta
     * Devuelve todos los puntos de venta válidos.
     */
    async getAll(req, res) {
        try {
            const puntosVenta =
                await this.model.getAll();

            res.set(
                "Cache-Control",
                "s-maxage=300, stale-while-revalidate"
            );

            return res.status(200).json(puntosVenta);
        } catch (error) {
            console.error(
                "Error obteniendo puntos de venta:",
                error
            );

            return res.status(500).json({
                error: "Error obteniendo los puntos de venta",
                details: error.message,
            });
        }
    }
}