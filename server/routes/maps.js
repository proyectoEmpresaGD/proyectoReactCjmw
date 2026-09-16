import { Router } from "express";
import rateLimit from "express-rate-limit";
import { MapsController } from "../controllers/mapsController.js";
import { MapsModel } from "../models/Postgres/mapsModel.js";

const geocodeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many geocoding requests",
        code: "RATE_LIMITED",
    },
});

const routeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many route requests",
        code: "RATE_LIMITED",
    },
});

export function createMapsRouter({ mapsModel } = {}) {
    const router = Router();
    const controller = new MapsController({
        mapsModel: mapsModel ?? new MapsModel(),
    });

    router.post(
        "/geocode",
        geocodeLimiter,
        controller.geocode.bind(controller)
    );

    router.post(
        "/route",
        routeLimiter,
        controller.route.bind(controller)
    );

    return router;
}
