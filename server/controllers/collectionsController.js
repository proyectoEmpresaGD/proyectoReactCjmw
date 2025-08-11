// controllers/collectionsController.js
import {
    getRandomImageUrlFromJson,
    getCollectionsForBrand,
    getAllImagesForCollection
} from '../models/Postgres/collectionsService.js';

const setCache = (res) => {
    // 30m browser / 6h edge / 24h SWR
    res.set('Cache-Control', 'public, max-age=1800, s-maxage=21600, stale-while-revalidate=86400');
};

export class CollectionsController {
    async getImage(req, res) {
        const { marca, coleccion, key } = req.query;
        if (!marca || (!coleccion && !key)) {
            return res.status(400).json({ error: 'Falta "marca" y (al menos) "coleccion" o "key".' });
        }

        try {
            const imageUrl = await getRandomImageUrlFromJson({ marca, coleccion, key });
            setCache(res);
            return res.status(200).json({
                imageUrl: imageUrl || null,
                message: imageUrl ? '✅ Imagen encontrada' : '⚠️ No se encontraron imágenes'
            });
        } catch (err) {
            console.error('❌ Error en getImage:', err);
            res.status(500).json({ error: 'Error interno' });
        }
    }

    async getBrandCollections(req, res) {
        const { marca } = req.params;
        if (!marca) return res.status(400).json({ error: 'Falta parámetro "marca".' });

        try {
            const payload = await getCollectionsForBrand(marca);
            setCache(res);
            return res.status(200).json({ marca, collections: payload });
        } catch (err) {
            console.error('❌ Error en getBrandCollections:', err);
            res.status(500).json({ error: 'Error interno' });
        }
    }

    async getCollectionImages(req, res) {
        const { marca, coleccion, key } = req.query;
        if (!marca || (!coleccion && !key)) {
            return res.status(400).json({ error: 'Falta "marca" y (al menos) "coleccion" o "key".' });
        }
        try {
            const list = await getAllImagesForCollection({ marca, coleccion, key });
            setCache(res);
            return res.status(200).json({ marca, coleccion: coleccion || key, images: list });
        } catch (err) {
            console.error('❌ Error en getCollectionImages:', err);
            res.status(500).json({ error: 'Error interno' });
        }
    }
}
