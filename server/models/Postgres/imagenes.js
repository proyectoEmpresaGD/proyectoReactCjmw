import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
});

function asIsUrl(value) {
    if (value == null) {
        return null;
    }

    const raw = String(value).trim();

    return raw.length
        ? raw
        : null;
}

function normalizeCodclaarchivo(value) {
    if (value == null) {
        return '';
    }

    return String(value).trim();
}

function normalizeCodclaarchivoTypes(types) {
    if (!Array.isArray(types)) {
        return null;
    }

    const normalized = [
        ...new Set(
            types
                .map(normalizeCodclaarchivo)
                .filter(Boolean)
        ),
    ];

    return normalized.length
        ? normalized
        : null;
}

async function fetchImageRecord({
    codprodu,
    codclaarchivo,
}) {
    const normalizedCodclaarchivo =
        normalizeCodclaarchivo(
            codclaarchivo
        );

    const { rows } =
        await pool.query(
            `
                SELECT *
                FROM imagenesproductoswebp
                WHERE codprodu = $1
                AND TRIM(codclaarchivo) = $2
                LIMIT 1;
            `,
            [
                codprodu,
                normalizedCodclaarchivo,
            ]
        );

    return rows[0] ?? null;
}

function withUrl(record) {
    if (!record) {
        return null;
    }

    return {
        ...record,

        /*
         * También devolvemos codclaarchivo
         * normalizado al frontend.
         */
        codclaarchivo:
            normalizeCodclaarchivo(
                record.codclaarchivo
            ),

        // URL exactamente como viene de BD,
        // quitando únicamente espacios externos.
        url:
            asIsUrl(
                record.ficadjunto
            ),
    };
}

export class ImagenModel {
    // Obtener todas las imágenes
    static async getAll({
        empresa,
        ejercicio,
        limit = 10,
        offset = 0,
        res,
    }) {
        const cacheKey =
            `images:${empresa || 'all'}:${ejercicio || 'all'}:${limit}:${offset}`;

        if (res?.cache) {
            const cachedResponse =
                await res.cache.get(
                    cacheKey
                );

            if (cachedResponse) {
                res.set(
                    'Cache-Control',
                    'public, max-age=3600'
                );

                return cachedResponse;
            }
        }

        let query =
            'SELECT * FROM imagenesproductoswebp';

        const params = [];

        if (empresa) {
            query +=
                ' WHERE "empresa" = $1';

            params.push(
                empresa
            );
        }

        if (ejercicio) {
            query +=
                params.length
                    ? ' AND "ejercicio" = $2'
                    : ' WHERE "ejercicio" = $1';

            params.push(
                ejercicio
            );
        }

        query +=
            ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

        params.push(
            limit,
            offset
        );

        try {
            const { rows } =
                await pool.query(
                    query,
                    params
                );

            /*
             * Normalizamos también los registros
             * que salen de getAll.
             */
            const result =
                rows.map(
                    withUrl
                );

            if (res?.cache) {
                await res.cache.set(
                    cacheKey,
                    result
                );

                res.set(
                    'Cache-Control',
                    'public, max-age=3600'
                );
            }

            return result;
        } catch (error) {
            console.error(
                'Error fetching images:',
                error
            );

            throw new Error(
                'Error fetching images'
            );
        }
    }

    static async getById({
        codprodu,
        codclaarchivo,
        res,
    }) {
        const normalizedCodclaarchivo =
            normalizeCodclaarchivo(
                codclaarchivo
            );

        const cacheKey =
            `image:${codprodu}:${normalizedCodclaarchivo}`;

        if (res?.cache) {
            const cached =
                await res.cache.get(
                    cacheKey
                );

            if (cached) {
                res.set(
                    'Cache-Control',
                    'public, max-age=3600'
                );

                return cached;
            }
        }

        const record =
            await fetchImageRecord({
                codprodu,
                codclaarchivo:
                    normalizedCodclaarchivo,
            });

        if (!record) {
            return null;
        }

        const result =
            withUrl(
                record
            );

        if (res?.cache) {
            await res.cache.set(
                cacheKey,
                result
            );

            res.set(
                'Cache-Control',
                'public, max-age=3600'
            );
        }

        return result;
    }

    // Obtener imágenes por codprodu
    // opcionalmente filtradas por codclaarchivo.
    static async getByCodprodu({
        codprodu,
        types,
        res,
    }) {
        const normalizedTypes =
            normalizeCodclaarchivoTypes(
                types
            );

        const typesKey =
            normalizedTypes?.length
                ? normalizedTypes.join(',')
                : 'all';

        const cacheKey =
            `imagesByProduct:${codprodu}:${typesKey}`;

        if (res?.cache) {
            const cached =
                await res.cache.get(
                    cacheKey
                );

            if (cached) {
                res.set(
                    'Cache-Control',
                    'public, max-age=3600'
                );

                return cached;
            }
        }

        const params = [
            codprodu
        ];

        let query = `
            SELECT *
            FROM imagenesproductoswebp
            WHERE codprodu = $1
        `;

        if (
            normalizedTypes?.length
        ) {
            /*
             * TRIM sobre la columna:
             *
             * " ARTISTICA_BAJA "
             *
             * se compara como:
             *
             * "ARTISTICA_BAJA"
             */
            query += `
                AND TRIM(codclaarchivo) = ANY($2::text[])
            `;

            params.push(
                normalizedTypes
            );
        }

        query += `
            ORDER BY
                TRIM(codclaarchivo),
                linea NULLS LAST,
                descripcion NULLS LAST;
        `;

        try {
            const { rows } =
                await pool.query(
                    query,
                    params
                );

            const result =
                rows.map(
                    withUrl
                );

            if (res?.cache) {
                await res.cache.set(
                    cacheKey,
                    result
                );

                res.set(
                    'Cache-Control',
                    'public, max-age=3600'
                );
            }

            return result;
        } catch (error) {
            console.error(
                'Error fetching images by product:',
                error
            );

            throw new Error(
                'Error fetching images by product'
            );
        }
    }

    static async getByNombre({
        nombre,
        types,
        res,
    }) {
        const normalizedName =
            String(
                nombre ?? ''
            ).trim();

        const normalizedTypes =
            normalizeCodclaarchivoTypes(
                types
            );

        const typesKey =
            normalizedTypes?.length
                ? normalizedTypes.join(',')
                : 'all';

        const cacheKey =
            `imagesByName:${normalizedName}:${typesKey}`;

        if (!normalizedName.length) {
            return [];
        }

        if (res?.cache) {
            const cached =
                await res.cache.get(
                    cacheKey
                );

            if (cached) {
                res.set(
                    'Cache-Control',
                    'public, max-age=3600'
                );

                return cached;
            }
        }

        const params = [
            normalizedName
        ];

        let query = `
            SELECT *
            FROM imagenesproductoswebp
            WHERE nombre = $1
        `;

        if (
            normalizedTypes?.length
        ) {
            query += `
                AND TRIM(codclaarchivo) = ANY($2::text[])
            `;

            params.push(
                normalizedTypes
            );
        }

        query += `
            ORDER BY
                TRIM(codclaarchivo),
                linea NULLS LAST,
                descripcion NULLS LAST;
        `;

        try {
            const { rows } =
                await pool.query(
                    query,
                    params
                );

            const result =
                rows.map(
                    withUrl
                );

            if (res?.cache) {
                await res.cache.set(
                    cacheKey,
                    result
                );

                res.set(
                    'Cache-Control',
                    'public, max-age=3600'
                );
            }

            return result;
        } catch (error) {
            console.error(
                'Error fetching images by nombre:',
                error
            );

            throw new Error(
                'Error fetching images by nombre'
            );
        }
    }

    // Obtener una imagen por código de producto
    // y clasificación de archivo.
    static async getByCodproduAndCodclaarchivo({
        codprodu,
        codclaarchivo,
        res,
    }) {
        return this.getById({
            codprodu,
            codclaarchivo:
                normalizeCodclaarchivo(
                    codclaarchivo
                ),
            res,
        });
    }

    // Crear una nueva imagen
    static async create({
        input,
        res,
    }) {
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
            nombre,
        } = input;

        const normalizedCodclaarchivo =
            normalizeCodclaarchivo(
                codclaarchivo
            );

        try {
            const { rows } =
                await pool.query(
                    `
                        INSERT INTO imagenesproductoswebp (
                            "empresa",
                            "ejercicio",
                            "codprodu",
                            "linea",
                            "descripcion",
                            "codclaarchivo",
                            "ficadjunto",
                            "tipdocasociado",
                            "fecalta",
                            "ultfeccompra",
                            "ultfecventa",
                            "ultfecactprc",
                            "nombre"
                        )
                        VALUES (
                            $1,
                            $2,
                            $3,
                            $4,
                            $5,
                            $6,
                            $7,
                            $8,
                            $9,
                            $10,
                            $11,
                            $12,
                            $13
                        )
                        RETURNING *;
                    `,
                    [
                        empresa,
                        ejercicio,
                        codprodu,
                        linea,
                        descripcion,
                        normalizedCodclaarchivo,
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

            return withUrl(
                rows[0]
            );
        } catch (error) {
            console.error(
                'Error creating image:',
                error
            );

            throw new Error(
                'Error creating image'
            );
        }
    }

    // Actualizar una imagen
    static async update({
        codprodu,
        codclaarchivo,
        input,
        res,
    }) {
        const normalizedCodclaarchivo =
            normalizeCodclaarchivo(
                codclaarchivo
            );

        /*
         * Si dentro del input también se está
         * modificando codclaarchivo, lo limpiamos.
         */
        const normalizedInput = {
            ...input,
        };

        if (
            Object.prototype.hasOwnProperty.call(
                normalizedInput,
                'codclaarchivo'
            )
        ) {
            normalizedInput.codclaarchivo =
                normalizeCodclaarchivo(
                    normalizedInput.codclaarchivo
                );
        }

        const fields =
            Object.keys(
                normalizedInput
            )
                .map(
                    (key, index) =>
                        `"${key}" = $${index + 3}`
                )
                .join(', ');

        const values =
            Object.values(
                normalizedInput
            );

        try {
            const { rows } =
                await pool.query(
                    `
                        UPDATE imagenesproductoswebp
                        SET ${fields}
                        WHERE "codprodu" = $1
                        AND TRIM("codclaarchivo") = $2
                        RETURNING *;
                    `,
                    [
                        codprodu,
                        normalizedCodclaarchivo,
                        ...values,
                    ]
                );

            if (res?.cache) {
                await res.cache.del(
                    `image:${codprodu}:${normalizedCodclaarchivo}`
                );

                await res.cache.flushAll();
            }

            return withUrl(
                rows[0]
            );
        } catch (error) {
            console.error(
                'Error updating image:',
                error
            );

            throw new Error(
                'Error updating image'
            );
        }
    }

    // Eliminar una imagen
    static async delete({
        codprodu,
        codclaarchivo,
        res,
    }) {
        const normalizedCodclaarchivo =
            normalizeCodclaarchivo(
                codclaarchivo
            );

        try {
            const { rows } =
                await pool.query(
                    `
                        DELETE
                        FROM imagenesproductoswebp
                        WHERE "codprodu" = $1
                        AND TRIM("codclaarchivo") = $2
                        RETURNING *;
                    `,
                    [
                        codprodu,
                        normalizedCodclaarchivo,
                    ]
                );

            if (res?.cache) {
                await res.cache.del(
                    `image:${codprodu}:${normalizedCodclaarchivo}`
                );

                await res.cache.flushAll();
            }

            return withUrl(
                rows[0]
            );
        } catch (error) {
            console.error(
                'Error deleting image:',
                error
            );

            throw new Error(
                'Error deleting image'
            );
        }
    }
}