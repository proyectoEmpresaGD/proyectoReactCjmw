import NodeCache from 'node-cache';
import { ImagenModel } from '../models/Postgres/imagenes.js';
import { validateImagen, validatePartialImagen } from '../schemas/imagenes.js';

// Inicializar NodeCache con un TTL (Time To Live) de 1 hora
const cache = new NodeCache({ stdTTL: 3600 });

export class ImagenController {
    async getAll(req, res) {
        const { empresa, ejercicio, limit, page } = req.query;
        const limitParsed = parseInt(limit, 10) || 10;
        const pageParsed = parseInt(page, 10) || 1;
        const offset = (pageParsed - 1) * limitParsed;
        const cacheKey = `images:${empresa || 'all'}:${ejercicio || 'all'}:${offset}:${limitParsed}`;

        try {
            // Comprobar si los datos están en caché
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                res.set('Cache-Control', 'public, max-age=3600');
                return res.json(cachedData);
            }

            // Obtener las imágenes desde la base de datos
            const images = await ImagenModel.getAll({ empresa, ejercicio, limit: limitParsed, offset });
            if (images.length === 0) {
                return res.status(404).json({ message: 'No images found' });
            }

            cache.set(cacheKey, images); // Cachear las imágenes por 1 hora
            res.set('Cache-Control', 'public, max-age=3600');
            res.json(images);
        } catch (error) {
            console.error('Error fetching images:', error);
            res.status(500).json({ error: 'Error fetching images', details: error.message });
        }
    }

    async getById(req, res) {
        const { codprodu, codclaarchivo } = req.params;
        const cacheKey = `image:${codprodu}:${codclaarchivo}`;

        try {
            // Comprobar si los datos están en caché
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                res.set('Cache-Control', 'public, max-age=3600');
                return res.json(cachedData);
            }

            // Obtener la imagen desde la base de datos
            const image = await ImagenModel.getById({ codprodu, codclaarchivo });
            if (!image) {
                return res.status(404).json({ message: 'Image not found' });
            }

            cache.set(cacheKey, image); // Cachear la imagen por 1 hora
            res.set('Cache-Control', 'public, max-age=3600');
            res.json(image);
        } catch (error) {
            console.error('Error fetching image:', error);
            res.status(500).json({ error: 'Error fetching image', details: error.message });
        }
    }

    async create(req, res) {
        try {
            // Validar la entrada antes de proceder
            const validationResult = validateImagen(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ error: validationResult.error.errors });
            }

            // Crear la nueva imagen
            const newImage = await ImagenModel.create({ input: req.body });

            cache.flushAll(); // Invalidar caché general de imágenes
            res.status(201).json(newImage);
        } catch (error) {
            console.error('Error creating image:', error);
            res.status(500).json({ error: 'Error creating image', details: error.message });
        }
    }

    async update(req, res) {
        const { codprodu, codclaarchivo } = req.params;
        try {
            // Validar parcialmente la entrada antes de proceder
            const validationResult = validatePartialImagen(req.body);
            if (!validationResult.success) {
                return res.status(400).json({ error: validationResult.error.errors });
            }

            // Actualizar la imagen
            const updatedImage = await ImagenModel.update({ codprodu, codclaarchivo, input: req.body });
            if (!updatedImage) {
                return res.status(404).json({ message: 'Image not found' });
            }

            cache.del(`image:${codprodu}:${codclaarchivo}`); // Invalidar caché de la imagen actualizada
            cache.flushAll(); // Invalidar caché general de imágenes
            res.json(updatedImage);
        } catch (error) {
            console.error('Error updating image:', error);
            res.status(500).json({ error: 'Error updating image', details: error.message });
        }
    }

    async delete(req, res) {
        const { codprodu, codclaarchivo } = req.params;
        try {
            // Eliminar la imagen
            const result = await ImagenModel.delete({ codprodu, codclaarchivo });
            if (!result) {
                return res.status(404).json({ message: 'Image not found' });
            }

            cache.del(`image:${codprodu}:${codclaarchivo}`); // Invalidar caché de la imagen eliminada
            cache.flushAll(); // Invalidar caché general de imágenes
            res.json({ message: 'Image deleted' });
        } catch (error) {
            console.error('Error deleting image:', error);
            res.status(500).json({ error: 'Error deleting image', details: error.message });
        }
    }
}
