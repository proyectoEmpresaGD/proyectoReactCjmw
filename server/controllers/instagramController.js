import { InstagramModel } from "../models/Postgres/instagramModels.js";

const DEFAULT_LIMIT = 3;
const MAX_LIMIT = 12;

const normalizeBrand = (value) => String(value || "").trim().toLowerCase();

const clampLimit = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return DEFAULT_LIMIT;
    return Math.min(Math.floor(n), MAX_LIMIT);
};

const getCredentialsByBrand = (brandRaw) => {
    const brand = normalizeBrand(brandRaw);

    // Mantiene compatibilidad con lo que ya tenías, si no mandas brand.
    if (!brand) {
        return {
            userId: process.env.INSTAGRAM_USER_ID,
            accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
            brand: "default",
        };
    }

    if (brand === "bassari") {
        return {
            userId: process.env.INSTAGRAM_BASSARI_USER_ID,
            accessToken: process.env.INSTAGRAM_BASSARI_ACCESS_TOKEN,
            brand,
        };
    }

    if (brand === "flamenco") {
        return {
            userId: process.env.INSTAGRAM_FLAMENCO_USER_ID,
            accessToken: process.env.INSTAGRAM_FLAMENCO_ACCESS_TOKEN,
            brand,
        };
    }

    return { userId: null, accessToken: null, brand };
};

export class InstagramController {
    async getLatestPosts(req, res) {
        try {
            const brand = req.params?.brand ?? req.query?.brand;
            const limit = clampLimit(req.query?.limit);

            const { userId, accessToken, brand: resolvedBrand } =
                getCredentialsByBrand(brand);

            if (!userId || !accessToken) {
                return res.status(500).json({
                    error:
                        "Faltan credenciales de Instagram en el entorno para la marca solicitada.",
                    brand: resolvedBrand,
                });
            }

            const posts = await InstagramModel.getLatestPosts({
                userId,
                accessToken,
                limit,
            });

            return res.status(200).json(posts);
        } catch (error) {
            console.error("❌ Error en InstagramController.getLatestPosts:", error);
            return res
                .status(500)
                .json({ error: "Error al obtener los posts de Instagram." });
        }
    }
}
