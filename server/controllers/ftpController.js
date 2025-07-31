// controllers/ftpController.js
import { getRandomImageUrl } from '../models/Postgres/ftpService.js';

export class FtpController {
    async getImageFromFtp(req, res) {
        const { marca, coleccion } = req.query;

        if (!marca || !coleccion) {
            return res.status(400).json({ error: 'Parámetros "marca" y "coleccion" son requeridos.' });
        }

        try {
            const imageUrl = await getRandomImageUrl({ marca, coleccion });

            if (!imageUrl) {
                return res.status(404).json({ error: 'No se encontró imagen para esta marca y colección.' });
            }

            res.set('Cache-Control', 's-maxage=3600, stale-while-revalidate');
            return res.json({ imageUrl });
        } catch (err) {
            console.error("❌ Error en getImageFromFtp:", err);
            res.status(500).json({ error: "Error accediendo al FTP" });
        }
    }
}
