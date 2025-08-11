import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export class ImagenModel {
    // Obtener todas las imágenes
    static async getAll({ empresa, ejercicio, limit = 10, offset = 0, res }) {
        const cacheKey = `images:${empresa || 'all'}:${ejercicio || 'all'}:${limit}:${offset}`;
        let cachedResponse;

        // Verificación de la existencia de cache
        if (res && res.cache) {
            cachedResponse = await res.cache.get(cacheKey);
            if (cachedResponse) {
                res.set('Cache-Control', 'public, max-age=3600');
                return cachedResponse;
            }
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

            // Cachear solo si existe res.cache
            if (res && res.cache) {
                await res.cache.set(cacheKey, rows);
                res.set('Cache-Control', 'public, max-age=3600');
            }

            return rows;
        } catch (error) {
            console.error('Error fetching images:', error);
            throw new Error('Error fetching images');
        }
    }

    static async getById({ codprodu, codclaarchivo, res }) {
        const cacheKey = `image:${codprodu}:${codclaarchivo}`;
        let cached = res?.cache && await res.cache.get(cacheKey);
        if (cached) {
            res.set('Cache-Control', 'public, max-age=3600');
            return cached;
        }

        const { rows } = await pool.query(
            'SELECT * FROM imagenesocproductos WHERE codprodu=$1 AND codclaarchivo=$2;',
            [codprodu, codclaarchivo]
        );
        if (!rows[0]) return null;

        const record = rows[0];
        const base = process.env.IMG_BASE_URL.replace(/\/$/, '');
        const fullUrl = record.ficadjunto
            ? `${base}/${record.ficadjunto.replace(/^\/+/, '')}`
            : null;

        const result = { ...record, url: fullUrl };
        if (res?.cache) {
            await res.cache.set(cacheKey, result);
            res.set('Cache-Control', 'public, max-age=3600');
        }
        return result;
    }

    // Obtener una imagen por código de producto y clasificación de archivo
    static async getByCodproduAndCodclaarchivo({ codprodu, codclaarchivo, res }) {
        const cacheKey = `image:${codprodu}:${codclaarchivo}`;
        let cached = res?.cache && await res.cache.get(cacheKey);
        if (cached) {
            res.set('Cache-Control', 'public, max-age=3600');
            return cached;
        }

        const { rows } = await pool.query(
            'SELECT * FROM imagenesocproductos WHERE codprodu=$1 AND codclaarchivo=$2;',
            [codprodu, codclaarchivo]
        );
        if (!rows[0]) return null;

        const record = rows[0];
        const base = process.env.IMG_BASE_URL.replace(/\/$/, '');
        const fullUrl = record.ficadjunto
            ? `${base}/${record.ficadjunto.replace(/^\/+/, '')}`
            : null;

        const result = { ...record, url: fullUrl };
        if (res?.cache) {
            await res.cache.set(cacheKey, result);
            res.set('Cache-Control', 'public, max-age=3600');
        }
        return result;
    }

    // Crear una nueva imagen
    static async create({ input, res }) {
        const { empresa, ejercicio, codprodu, linea, descripcion, codclaarchivo, ficadjunto, tipdocasociado, fecalta, ultfeccompra, ultfecventa, ultfecactprc } = input;

        try {
            const { rows } = await pool.query(
                `INSERT INTO imagenesocproductos ("empresa", "ejercicio", "codprodu", "linea", "descripcion", "codclaarchivo", "ficadjunto", "tipdocasociado", "fecalta", "ultfeccompra", "ultfecventa", "ultfecactprc")
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *;`,
                [empresa, ejercicio, codprodu, linea, descripcion, codclaarchivo, ficadjunto, tipdocasociado, fecalta, ultfeccompra, ultfecventa, ultfecactprc]
            );

            if (res && res.cache) {
                await res.cache.flushAll(); // Invalidar caché después de crear la imagen
            }

            return rows[0];
        } catch (error) {
            console.error('Error creating image:', error);
            throw new Error('Error creating image');
        }
    }

    // Actualizar una imagen
    static async update({ codprodu, codclaarchivo, input, res }) {
        const fields = Object.keys(input).map((key, index) => `"${key}" = $${index + 3}`).join(", ");
        const values = Object.values(input);

        try {
            const { rows } = await pool.query(
                `UPDATE imagenesocproductos SET ${fields} WHERE "codprodu" = $1 AND "codclaarchivo" = $2 RETURNING *;`,
                [codprodu, codclaarchivo, ...values]
            );

            if (res && res.cache) {
                await res.cache.del(`image:${codprodu}:${codclaarchivo}`); // Invalidar caché después de la actualización
                await res.cache.flushAll(); // Invalidar otros caches si es necesario
            }

            return rows[0];
        } catch (error) {
            console.error('Error updating image:', error);
            throw new Error('Error updating image');
        }
    }

    // Eliminar una imagen
    static async delete({ codprodu, codclaarchivo, res }) {
        try {
            const { rows } = await pool.query(
                'DELETE FROM imagenesocproductos WHERE "codprodu" = $1 AND "codclaarchivo" = $2 RETURNING *;',
                [codprodu, codclaarchivo]
            );

            if (res && res.cache) {
                await res.cache.del(`image:${codprodu}:${codclaarchivo}`); // Invalidar caché después de la eliminación
                await res.cache.flushAll(); // Invalidar otros caches si es necesario
            }

            return rows[0];
        } catch (error) {
            console.error('Error deleting image:', error);
            throw new Error('Error deleting image');
        }
    }
}
