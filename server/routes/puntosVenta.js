// routes/puntosVenta.js
import { Router } from "express";
import { PuntosVentaController } from "../controllers/puntosVentaController.js";

/**
 * Router de puntos de venta
 */
export const createPuntosVentaRouter = () => {
    const puntosVentaRouter = Router();
    const puntosVentaController = new PuntosVentaController();

    // ==============================
    // 1. CONSULTAS
    // ==============================

    // Listar todos los puntos de venta
    puntosVentaRouter.get(
        "/",
        puntosVentaController.getAll.bind(puntosVentaController)
    );

    return puntosVentaRouter;
};