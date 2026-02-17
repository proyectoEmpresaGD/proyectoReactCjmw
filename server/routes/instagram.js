import { Router } from "express";
import { InstagramController } from "../controllers/instagramController.js";

export const createInstagramRouter = () => {
    const router = Router();
    const controller = new InstagramController();

    // Nuevo: por ruta /api/instagram/bassari/latest
    router.get("/:brand/latest", controller.getLatestPosts.bind(controller));

    // Compat: /api/instagram/latest?brand=bassari
    router.get("/latest", controller.getLatestPosts.bind(controller));

    return router;
};
