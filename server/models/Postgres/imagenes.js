import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

function asIsUrl(value) {
    if (value == null) return null;
    const raw = String(value).trim();
    return raw.length ? raw : null;
}

async function fetchImageRecord({ codprodu, codclaarchivo }) {
    const { rows } = await pool.query(
        'SELECT * FROM imagenesproductoswebp WHERE codprodu=$1 AND codclaarchivo=$2;',
        [codprodu, codclaarchivo]
    );
    return rows[0] ?? null;
}

function withUrl(record) {
    if (!record) return null;
    // url EXACTAMENTE como viene de BD
    return { ...record, url: asIsUrl(record.ficadjunto) };
}

export class ImagenModel {
    // Obtener todas las imágenes
    static async getAll({ empresa, ejercicio, limit = 10, offset = 0, res }) {
        const cacheKey = `images:${empresa || 'all'}:${ejercicio || 'all'}:${limit}:${offset}`;

        if (res?.cache) {
            const cachedResponse = await res.cache.get(cacheKey);
            if (cachedResponse) {
                res.set('Cache-Control', 'public, max-age=3600');
                return cachedResponse;
            }
        }

        let query = 'SELECT * FROM imagenesproductoswebp';
        const params = [];

        if (empresa) {
            query += ' WHERE "empresa" = $1';
            params.push(empresa);
        }

        if (ejercicio) {
            query += params.length ? ' AND "ejercicio" = $2' : ' WHERE "ejercicio" = $1';
            params.push(ejercicio);
        }

        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        try {
            const { rows } = await pool.query(query, params);

            if (res?.cache) {
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

        if (res?.cache) {
            const cached = await res.cache.get(cacheKey);
            if (cached) {
                res.set('Cache-Control', 'public, max-age=3600');
                return cached;
            }
        }

        const record = await fetchImageRecord({ codprodu, codclaarchivo });
        if (!record) return null;

        const result = withUrl(record);

        if (res?.cache) {
            await res.cache.set(cacheKey, result);
            res.set('Cache-Control', 'public, max-age=3600');
        }

        return result;
    }

    // Obtener imágenes por codprodu (opcionalmente filtradas por tipos/codclaarchivo)
    static async getByCodprodu({ codprodu, types, res }) {
        const normalizedTypes = Array.isArray(types) ? types.filter(Boolean) : null;
        const typesKey = normalizedTypes?.length ? normalizedTypes.join(',') : 'all';
        const cacheKey = `imagesByProduct:${codprodu}:${typesKey}`;

        if (res?.cache) {
            const cached = await res.cache.get(cacheKey);
            if (cached) {
                res.set('Cache-Control', 'public, max-age=3600');
                return cached;
            }
        }

        const params = [codprodu];
        let query = 'SELECT * FROM imagenesproductoswebp WHERE codprodu=$1';

        if (normalizedTypes?.length) {
            query += ' AND codclaarchivo = ANY($2)';
            params.push(normalizedTypes);
        }

        query += ' ORDER BY codclaarchivo, linea NULLS LAST, descripcion NULLS LAST;';

        try {
            const { rows } = await pool.query(query, params);
            const result = rows.map(withUrl);

            if (res?.cache) {
                await res.cache.set(cacheKey, result);
                res.set('Cache-Control', 'public, max-age=3600');
            }

            return result;
        } catch (error) {
            console.error('Error fetching images by product:', error);
            throw new Error('Error fetching images by product');
        }
    }

    static async getByNombre({ nombre, types, res }) {
        const normalizedName = String(nombre ?? '').trim();
        const normalizedTypes = Array.isArray(types) ? types.filter(Boolean) : null;
        const typesKey = normalizedTypes?.length ? normalizedTypes.join(',') : 'all';
        const cacheKey = `imagesByName:${normalizedName}:${typesKey}`;

        if (!normalizedName.length) return [];

        if (res?.cache) {
            const cached = await res.cache.get(cacheKey);
            if (cached) {
                res.set('Cache-Control', 'public, max-age=3600');
                return cached;
            }
        }

        const params = [normalizedName];
        let query = 'SELECT * FROM imagenesproductoswebp WHERE nombre=$1';

        if (normalizedTypes?.length) {
            query += ' AND codclaarchivo = ANY($2)';
            params.push(normalizedTypes);
        }

        query += ' ORDER BY codclaarchivo, linea NULLS LAST, descripcion NULLS LAST;';

        try {
            const { rows } = await pool.query(query, params);
            const result = rows.map(withUrl);

            if (res?.cache) {
                await res.cache.set(cacheKey, result);
                res.set('Cache-Control', 'public, max-age=3600');
            }

            return result;
        } catch (error) {
            console.error('Error fetching images by nombre:', error);
            // Si el campo en tu tabla no se llama "nombre", este error te lo confirmará.
            throw new Error('Error fetching images by nombre');
        }
    }

    // Obtener una imagen por código de producto y clasificación de archivo
    static async getByCodproduAndCodclaarchivo({ codprodu, codclaarchivo, res }) {
        // Reutiliza misma query y misma cacheKey
        return this.getById({ codprodu, codclaarchivo, res });
    }

    // Crear una nueva imagen
    static async create({ input, res }) {
        const {
            empresa,
            ejercicio,
            codprodu,
            linea,
            descripcion,
            codclaarchivo,
            ficadjunto,
            tipdocasociado,
            fecalta,
            ultfeccompra,
            ultfecventa,
            ultfecactprc,
        } = input;

        try {
            const { rows } = await pool.query(
                `INSERT INTO imagenesproductoswebp ("empresa", "ejercicio", "codprodu", "linea", "descripcion", "codclaarchivo", "ficadjunto", "tipdocasociado", "fecalta", "ultfeccompra", "ultfecventa", "ultfecactprc", "nombre")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         RETURNING *;`,
                [
                    empresa,
                    ejercicio,
                    codprodu,
                    linea,
                    descripcion,
                    codclaarchivo,
                    ficadjunto,
                    tipdocasociado,
                    fecalta,
                    ultfeccompra,
                    ultfecventa,
                    ultfecactprc,
                    nombre,
                ]
            );

            if (res?.cache) {
                await res.cache.flushAll();
            }

            return rows[0];
        } catch (error) {
            console.error('Error creating image:', error);
            throw new Error('Error creating image');
        }
    }

    // Actualizar una imagen
    static async update({ codprodu, codclaarchivo, input, res }) {
        const fields = Object.keys(input)
            .map((key, index) => `"${key}" = $${index + 3}`)
            .join(', ');
        const values = Object.values(input);

        try {
            const { rows } = await pool.query(
                `UPDATE imagenesproductoswebp
         SET ${fields}
         WHERE "codprodu" = $1 AND "codclaarchivo" = $2
         RETURNING *;`,
                [codprodu, codclaarchivo, ...values]
            );

            if (res?.cache) {
                await res.cache.del(`image:${codprodu}:${codclaarchivo}`);
                await res.cache.flushAll();
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
                'DELETE FROM imagenesproductoswebp WHERE "codprodu" = $1 AND "codclaarchivo" = $2 RETURNING *;',
                [codprodu, codclaarchivo]
            );

            if (res?.cache) {
                await res.cache.del(`image:${codprodu}:${codclaarchivo}`);
                await res.cache.flushAll();
            }

            return rows[0];
        } catch (error) {
            console.error('Error deleting image:', error);
            throw new Error('Error deleting image');
        }
    }
}
