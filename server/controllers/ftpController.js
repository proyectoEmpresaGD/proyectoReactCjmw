import { getRandomImageUrl } from '../models/Postgres/ftpService.js';

export class FtpController {
    async getImageFromFtp(req, res) {
        const { marca, coleccion } = req.query;

        if (!marca || !coleccion) {
            return res.status(400).json({ error: 'Parámetros "marca" y "coleccion" son requeridos.' });
        }

        try {
            const imageUrl = await getRandomImageUrl({ marca, coleccion });

            res.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate');

            return res.status(200).json({
                imageUrl: imageUrl || null,
                message: imageUrl ? "✅ Imagen encontrada" : "⚠️ No se encontraron imágenes"
            });
        } catch (err) {
            console.error("❌ Error accediendo al FTP:", err);
            res.status(500).json({ error: "Error accediendo al FTP" });
        }
    }
}
