import { InstagramModel } from '../models/Postgres/instagramModels.js';

export class InstagramController {
    async getLatestPosts(req, res) {
        try {
            const { limit } = req.query;
            const userId = process.env.INSTAGRAM_USER_ID;
            const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

            if (!userId || !accessToken) {
                return res.status(500).json({ error: 'Faltan credenciales de Instagram en el entorno.' });
            }

            const posts = await InstagramModel.getLatestPosts({
                userId,
                accessToken,
                limit: Number(limit) || 3
            });

            return res.status(200).json(posts);
        } catch (error) {
            console.error('❌ Error en InstagramController.getLatestPosts:', error);
            return res.status(500).json({ error: 'Error al obtener los posts de Instagram.' });
        }
    }
}
