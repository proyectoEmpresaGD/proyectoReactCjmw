import NodeCache from 'node-cache';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Inicializa NodeCache con un TTL (tiempo de vida en segundos)
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hora

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export class ImagenModel {
    // Obtener todas las imágenes con caché en NodeCache
    static async getAll({ empresa, ejercicio, limit = 10, offset = 0 }) {
        const cacheKey = `images:${empresa || 'all'}:${ejercicio || 'all'}:${offset}:${limit}`;

        // Verifica si los datos están en caché
        const cachedImages = cache.get(cacheKey);
        if (cachedImages) {
            return cachedImages; // Retorna las imágenes desde el caché
        }

        let query = 'SELECT * FROM imagenesocproductos';
        let params = [];

        if (empresa) {
            query += ' WHERE "empresa" = $1';
            params.push(empresa);
        }

        if (ejercicio) {
            if (params.length > 0) {
                query += ' AND "ejercicio" = $2';
            } else {
                query += ' WHERE "ejercicio" = $1';
            }
            params.push(ejercicio);
        }

        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        try {
            const { rows } = await pool.query(query, params);
            if (rows.length === 0) {
                throw new Error('No images found');
            }
            cache.set(cacheKey, rows); // Almacenar las imágenes en caché
            return rows;
        } catch (error) {
            console.error('Error fetching images:', error);
            throw new Error('Error fetching images');
        }
    }

    // Obtener una imagen por codprodu y codclaarchivo con caché
    static async getById({ codprodu, codclaarchivo }) {
        const cacheKey = `image:${codprodu}:${codclaarchivo}`;

        // Verifica si los datos están en caché
        const cachedImage = cache.get(cacheKey);
        if (cachedImage) {
            return cachedImage;
        }

        try {
            const { rows } = await pool.query(
                'SELECT * FROM imagenesocproductos WHERE "codprodu" = $1 AND "codclaarchivo" = $2;',
                [codprodu, codclaarchivo]
            );
            if (rows.length > 0) {
                cache.set(cacheKey, rows[0]); // Almacenar en caché
                return rows[0];
            } else {
                throw new Error('Image not found');
            }
        } catch (error) {
            console.error('Error fetching image:', error);
            throw new Error('Error fetching image');
        }
    }

    // Crear una nueva imagen e invalidar la caché
    static async create({ input }) {
        const { empresa, ejercicio, codprodu, linea, descripcion, codclaarchivo, ficadjunto, tipdocasociado, fecalta, ultfeccompra, ultfecventa, ultfecactprc } = input;

        try {
            const { rows } = await pool.query(
                `INSERT INTO imagenesocproductos ("empresa", "ejercicio", "codprodu", "linea", "descripcion", "codclaarchivo", "ficadjunto", "tipdocasociado", "fecalta", "ultfeccompra", "ultfecventa", "ultfecactprc")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *;`,
                [empresa, ejercicio, codprodu, linea, descripcion, codclaarchivo, ficadjunto, tipdocasociado, fecalta, ultfeccompra, ultfecventa, ultfecactprc]
            );

            if (rows.length === 0) {
                throw new Error('Error creating image');
            }

            cache.flushAll(); // Invalidar la caché general de imágenes
            return rows[0];
        } catch (error) {
            console.error('Error creating image:', error);
            throw new Error('Error creating image');
        }
    }

    // Actualizar una imagen e invalidar la caché
    static async update({ codprodu, codclaarchivo, input }) {
        const fields = Object.keys(input).map((key, index) => `"${key}" = $${index + 3}`).join(", ");
        const values = Object.values(input);

        try {
            const { rows } = await pool.query(
                `UPDATE imagenesocproductos SET ${fields} WHERE "codprodu" = $1 AND "codclaarchivo" = $2 RETURNING *;`,
                [codprodu, codclaarchivo, ...values]
            );

            if (rows.length === 0) {
                throw new Error('Image not found');
            }

            cache.del(`image:${codprodu}:${codclaarchivo}`); // Invalidar la caché de la imagen actualizada
            cache.flushAll(); // Invalidar la caché general de imágenes
            return rows[0];
        } catch (error) {
            console.error('Error updating image:', error);
            throw new Error('Error updating image');
        }
    }

    // Eliminar una imagen e invalidar la caché
    static async delete({ codprodu, codclaarchivo }) {
        try {
            const { rows } = await pool.query('DELETE FROM imagenesocproductos WHERE "codprodu" = $1 AND "codclaarchivo" = $2 RETURNING *;', [codprodu, codclaarchivo]);

            if (rows.length === 0) {
                throw new Error('Image not found');
            }

            cache.del(`image:${codprodu}:${codclaarchivo}`); // Invalidar la caché de la imagen eliminada
            cache.flushAll(); // Invalidar la caché general de imágenes
            return rows[0];
        } catch (error) {
            console.error('Error deleting image:', error);
            throw new Error('Error deleting image');
        }
    }
}
