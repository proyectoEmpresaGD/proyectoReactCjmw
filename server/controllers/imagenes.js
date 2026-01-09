import { ImagenModel } from '../models/Postgres/imagenes.js';
import { validateImagen, validatePartialImagen } from '../schemas/imagenes.js';

export class ImagenController {
    // Obtener todas las imágenes
    async getAll(req, res) {
        try {
            const { empresa, ejercicio, limit, page } = req.query;
            const limitParsed = parseInt(limit, 10) || 10;
            const pageParsed = parseInt(page, 10) || 1;
            const offset = (pageParsed - 1) * limitParsed;
            const images = await ImagenModel.getAll({ empresa, ejercicio, limit: limitParsed, offset, res });

            // Verificación para agregar encabezado de cache-control
            if (res && res.cache) {
                res.set('Cache-Control', 'public, max-age=3600');
            }
            res.json(images);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Obtener una imagen por ID
    // Obtener imágenes por producto (opcionalmente filtradas por tipos)
    async getByCodprodu(req, res) {
        try {
            const { codprodu } = req.params;

            const typesParam = req.query.types;
            const types =
                typeof typesParam === 'string' && typesParam.trim().length
                    ? typesParam
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean)
                    : null;

            const images = await ImagenModel.getByCodprodu({ codprodu, types, res });

            // Devuelve siempre array (si no hay, [])
            if (res?.cache) {
                res.set('Cache-Control', 'public, max-age=3600');
            }
            return res.json(images);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }


    // Obtener una imagen por código de producto y clasificación de archivo
    async getByCodproduAndCodclaarchivo(req, res) {
        try {
            const { codprodu, codclaarchivo } = req.params;
            const image = await ImagenModel.getByCodproduAndCodclaarchivo({ codprodu, codclaarchivo, res });
            if (image) {
                if (res && res.cache) {
                    res.set('Cache-Control', 'public, max-age=3600');
                }
                res.json(image);
            } else {
                res.status(404).json({ message: 'Image not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Crear una nueva imagen
    async create(req, res) {
        try {
            const validationResult = validateImagen(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ error: validationResult.error.errors });
            }
            const newImage = await ImagenModel.create({ input: req.body, res });
            res.status(201).json(newImage);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Actualizar una imagen existente
    async update(req, res) {
        try {
            const { codprodu, codclaarchivo } = req.params;
            const validationResult = validatePartialImagen(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ error: validationResult.error.errors });
            }
            const updatedImage = await ImagenModel.update({ codprodu, codclaarchivo, input: req.body, res });
            if (updatedImage) {
                res.json(updatedImage);
            } else {
                res.status(404).json({ message: 'Image not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Eliminar una imagen
    async delete(req, res) {
        try {
            const { codprodu, codclaarchivo } = req.params;
            const result = await ImagenModel.delete({ codprodu, codclaarchivo, res });
            if (result) {
                res.json({ message: 'Image deleted' });
            } else {
                res.status(404).json({ message: 'Image not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
