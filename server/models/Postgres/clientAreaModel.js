export class ClientAreaModel {
    constructor(pool) {
        this.pool = pool;
    }

    async getLibraryByCustomerCode({
        codclien,
        tipo,
        limit = 20,
        offset = 0,
    }) {
        const safeLimit =
            Math.min(
                Math.max(
                    Number.parseInt(
                        limit,
                        10
                    ) || 20,
                    1
                ),
                50
            );

        const safeOffset =
            Math.max(
                Number.parseInt(
                    offset,
                    10
                ) || 0,
                0
            );


        const normalizedTipo =
            tipo === 'LIBRO' ||
                tipo === 'PERCHA'
                ? tipo
                : null;


        /*
         * Pedimos uno adicional para
         * detectar si existe otra página.
         */
        const queryLimit =
            safeLimit + 1;


        const query = `
        WITH library_base AS (
            SELECT
                l.codprodu,

                COALESCE(
                    NULLIF(
                        TRIM(
                            l.desprodu
                        ),
                        ''
                    ),
                    p.desprodu,
                    l.codprodu
                ) AS desprodu,

                p.codmarca,

                p.codtipo,

                COALESCE(
                    l.cantidad,
                    0
                ) AS cantidad,

                COALESCE(
                    a.fecha,
                    l.fecha
                ) AS fecha,

                CASE
                    WHEN
                        TRIM(
                            p.codtipo::text
                        ) = '105'
                    THEN 'PERCHA'

                    WHEN
                        TRIM(
                            p.codtipo::text
                        ) IN (
                            '106',
                            '109'
                        )
                    THEN 'LIBRO'

                    ELSE NULL
                END AS tipo

            FROM albventa a

            INNER JOIN albventa_linea l
                ON l.ejercicio =
                    a.ejercicio

                AND l.canal =
                    a.canal

                AND l.codseralbventa =
                    a.codseralbventa

                AND l.nalbventa =
                    a.nalbventa

                AND l.codclien =
                    a.codclien

            INNER JOIN productos p
                ON p.codprodu =
                    l.codprodu

            WHERE
                a.codclien = $1

                AND l.codprodu
                    IS NOT NULL

                AND TRIM(
                    l.codprodu
                ) <> ''

                AND TRIM(
                    p.codtipo::text
                ) IN (
                    '105',
                    '106',
                    '109'
                )

                AND COALESCE(
                    UPPER(
                        TRIM(
                            p.obsoleto
                        )
                    ),
                    'N'
                ) <> 'S'
        ),


        library_grouped AS (
            SELECT
                codprodu,

                MAX(
                    desprodu
                ) AS desprodu,

                MAX(
                    codmarca
                ) AS codmarca,

                MAX(
                    codtipo
                ) AS codtipo,

                tipo,

                SUM(
                    cantidad
                ) AS cantidad_total,

                MAX(
                    fecha
                ) AS ultima_fecha,

                COUNT(*)::int
                    AS movimientos

            FROM library_base

            WHERE
                tipo IS NOT NULL

            GROUP BY
                codprodu,
                tipo

            HAVING
                SUM(
                    cantidad
                ) > 0
        ),


        library_stats AS (
            SELECT
                COUNT(*)::int
                    AS total_catalogos,

                COUNT(*) FILTER (
                    WHERE
                        tipo = 'LIBRO'
                )::int
                    AS total_libros,

                COUNT(*) FILTER (
                    WHERE
                        tipo = 'PERCHA'
                )::int
                    AS total_perchas

            FROM library_grouped
        ),


        library_filtered AS (
            SELECT
                lg.*

            FROM library_grouped lg

            WHERE
                (
                    $2::text IS NULL

                    OR lg.tipo =
                        $2::text
                )
        ),


        library_filtered_with_total AS (
            SELECT
                lf.*,

                COUNT(*) OVER ()::int
                    AS filtered_total

            FROM library_filtered lf
        )


        SELECT
            l.codprodu,

            l.desprodu,

            l.codmarca,

            l.codtipo,

            l.tipo,

            l.cantidad_total,

            l.ultima_fecha,

            l.movimientos,

            l.filtered_total,

            stats.total_catalogos,

            stats.total_libros,

            stats.total_perchas,

            img.ficadjunto
                AS imagen

        FROM library_filtered_with_total l

        CROSS JOIN library_stats stats


        LEFT JOIN LATERAL (
            SELECT
                i.ficadjunto

            FROM imagenesproductoswebp i

            WHERE
                i.codprodu =
                    l.codprodu

            ORDER BY
                CASE
                    WHEN
                        i.codclaarchivo =
                            'PRODUCTO_BAJA'
                    THEN 0

                    WHEN
                        i.codclaarchivo
                            ILIKE '%BAJA%'
                    THEN 1

                    WHEN
                        i.codclaarchivo
                            ILIKE '%WEB%'
                    THEN 2

                    ELSE 3
                END

            LIMIT 1

        ) img ON TRUE


        ORDER BY
            CASE
                WHEN
                    l.tipo = 'LIBRO'
                THEN 0

                WHEN
                    l.tipo = 'PERCHA'
                THEN 1

                ELSE 2
            END,

            l.desprodu,

            l.codprodu


        LIMIT $3
        OFFSET $4
    `;


        const {
            rows,
        } =
            await this.pool.query(
                query,
                [
                    codclien,
                    normalizedTipo,
                    queryLimit,
                    safeOffset,
                ]
            );


        const hasMore =
            rows.length >
            safeLimit;


        const pageRows =
            hasMore
                ? rows.slice(
                    0,
                    safeLimit
                )
                : rows;


        const firstRow =
            pageRows[0] ||
            rows[0];


        const total =
            Number(
                firstRow?.total_catalogos ||
                0
            );

        const totalBooks =
            Number(
                firstRow?.total_libros ||
                0
            );

        const totalHangers =
            Number(
                firstRow?.total_perchas ||
                0
            );

        const filteredTotal =
            Number(
                firstRow?.filtered_total ||
                0
            );


        const library =
            pageRows.map(
                item => {
                    const {
                        total_catalogos,
                        total_libros,
                        total_perchas,
                        filtered_total,
                        ...product
                    } = item;


                    return {
                        ...product,

                        cantidad_total:
                            Number(
                                product.cantidad_total ||
                                0
                            ),

                        movimientos:
                            Number(
                                product.movimientos ||
                                0
                            ),
                    };
                }
            );


        return {
            library,

            total,

            totalBooks,

            totalHangers,

            filteredTotal,

            hasMore,

            nextOffset:
                safeOffset +
                library.length,
        };
    }

    async getInvoicesByCustomerCode({
        codclien,
        ejercicio,
        mode = 'orders',
        search = '',
        limit = 20,
        offset = 0,
    }) {
        const safeLimit =
            Math.min(
                Math.max(
                    Number.parseInt(
                        limit,
                        10
                    ) || 20,
                    1
                ),
                50
            );

        const safeOffset =
            Math.max(
                Number.parseInt(
                    offset,
                    10
                ) || 0,
                0
            );

        const resolvedMode =
            mode === 'returns'
                ? 'returns'
                : 'orders';

        const normalizedSearch =
            String(
                search || ''
            ).trim();


        const returnCondition = `
        BTRIM(
            COALESCE(
                codserfacventa::text,
                ''
            )
        ) ~ '^[A-Za-z]{2}$'
    `;


        const modeCondition =
            resolvedMode ===
                'returns'
                ? returnCondition
                : `
                NOT (
                    ${returnCondition}
                )
            `;


        const params = [
            codclien,
        ];


        const filters = [
            `codclien = $1`,
            modeCondition,
        ];


        if (ejercicio) {
            params.push(
                Number(
                    ejercicio
                )
            );

            filters.push(
                `ejercicio = $${params.length}`
            );
        }


        if (normalizedSearch) {
            params.push(
                `%${normalizedSearch}%`
            );

            const searchIndex =
                params.length;


            filters.push(`
            (
                COALESCE(
                    ejercicio::text,
                    ''
                ) ILIKE $${searchIndex}

                OR COALESCE(
                    codserfacventa::text,
                    ''
                ) ILIKE $${searchIndex}

                OR COALESCE(
                    nfacventa::text,
                    ''
                ) ILIKE $${searchIndex}

                OR COALESCE(
                    sfactura::text,
                    ''
                ) ILIKE $${searchIndex}

                OR COALESCE(
                    referencia::text,
                    ''
                ) ILIKE $${searchIndex}

                OR COALESCE(
                    fecha::text,
                    ''
                ) ILIKE $${searchIndex}

                OR COALESCE(
                    imptotal::text,
                    ''
                ) ILIKE $${searchIndex}
            )
        `);
        }


        const limitIndex =
            params.length + 1;

        const offsetIndex =
            params.length + 2;


        params.push(
            safeLimit,
            safeOffset
        );


        const query = `
        SELECT
            ejercicio,
            fecha,
            sfactura,
            codserfacventa,
            nfacventa,
            referencia,
            codforpago,
            impbase,
            impiva,
            imptotal,
            comentario,
            estadoverifactu,

            COUNT(*) OVER ()
                AS total_count

        FROM facventa

        WHERE
            ${filters.join(
            '\nAND '
        )}

        ORDER BY
            fecha DESC,
            ejercicio DESC,
            nfacventa DESC

        LIMIT $${limitIndex}
        OFFSET $${offsetIndex}
    `;


        const {
            rows,
        } =
            await this.pool.query(
                query,
                params
            );


        const total =
            Number(
                rows[0]?.total_count ||
                0
            );


        const invoices =
            rows.map(
                row => {
                    const {
                        total_count,
                        ...invoice
                    } = row;


                    return invoice;
                }
            );


        const hasMore =
            safeOffset +
            invoices.length <
            total;


        /*
         * Los años son una consulta muy pequeña.
         *
         * Solo la hacemos en la primera página
         * para no descargar todas las facturas
         * simplemente para construir el select.
         */
        let availableYears;


        if (
            safeOffset ===
            0
        ) {
            const yearsQuery = `
            SELECT DISTINCT
                ejercicio

            FROM facventa

            WHERE
                codclien = $1

                AND ${modeCondition}

                AND ejercicio
                    IS NOT NULL

            ORDER BY
                ejercicio DESC
        `;


            const {
                rows: yearRows,
            } =
                await this.pool.query(
                    yearsQuery,
                    [
                        codclien,
                    ]
                );


            availableYears =
                yearRows
                    .map(
                        item =>
                            item.ejercicio
                    )
                    .filter(
                        Boolean
                    );
        }


        return {
            invoices,

            total,

            hasMore,

            nextOffset:
                safeOffset +
                invoices.length,

            availableYears,
        };
    }

    async getUninvoicedDeliveryNotesByCustomerCode({
        codclien,
        ejercicio,
    }) {
        const params = [codclien];

        let ejercicioFilter = '';

        if (ejercicio) {
            params.push(Number(ejercicio));

            ejercicioFilter = `
                AND a.ejercicio = $${params.length}
            `;
        }

        const query = `
            SELECT
                a.ejercicio,
                a.canal,
                a.codseralbventa,
                a.nalbventa,
                a.codclien,
                a.fecha,
                a.fecentre,
                a.salbaran,
                a.referencia,
                a.obs,
                a.impbruto,
                a.impbase,
                a.impiva,
                a.imptotal,
                a.imptotalbaran,
                a.codserfacventa,
                a.nfacventa,

                l.linea,
                l.codprodu,
                l.desprodu,
                l.referencia AS linea_referencia,
                l.cajas,
                l.cantidad,
                l.precio,
                l.importe,
                l.codiva,
                l.unidadventa,
                l.comentario AS linea_comentario
            FROM albventa a

            LEFT JOIN albventa_linea l
                ON l.canal = a.canal
                AND l.codseralbventa = a.codseralbventa
                AND l.nalbventa = a.nalbventa
                AND l.codclien = a.codclien
                AND l.ejercicio = a.ejercicio

            WHERE a.codclien = $1

                AND (
                    NULLIF(
                        BTRIM(a.nfacventa),
                        ''
                    ) IS NULL

                    OR

                    NULLIF(
                        BTRIM(a.codserfacventa),
                        ''
                    ) IS NULL
                )

                ${ejercicioFilter}

            ORDER BY
                a.fecha DESC,
                a.nalbventa DESC,
                l.linea ASC
        `;

        const { rows } =
            await this.pool.query(
                query,
                params
            );

        const deliveryNotesMap =
            new Map();

        rows.forEach((row) => {
            const deliveryNoteKey = [
                row.ejercicio,
                row.canal,
                row.codseralbventa,
                row.nalbventa,
            ].join('-');

            if (
                !deliveryNotesMap.has(
                    deliveryNoteKey
                )
            ) {
                deliveryNotesMap.set(
                    deliveryNoteKey,
                    {
                        ejercicio:
                            row.ejercicio,

                        canal:
                            row.canal,

                        codseralbventa:
                            row.codseralbventa,

                        nalbventa:
                            row.nalbventa,

                        codclien:
                            row.codclien,

                        fecha:
                            row.fecha,

                        fecentre:
                            row.fecentre,

                        salbaran:
                            row.salbaran,

                        referencia:
                            row.referencia,

                        obs:
                            row.obs,

                        impbruto:
                            row.impbruto,

                        impbase:
                            row.impbase,

                        impiva:
                            row.impiva,

                        imptotal:
                            row.imptotal,

                        imptotalbaran:
                            row.imptotalbaran,

                        codserfacventa:
                            row.codserfacventa,

                        nfacventa:
                            row.nfacventa,

                        lineas: [],
                    }
                );
            }

            if (row.linea !== null) {
                deliveryNotesMap
                    .get(deliveryNoteKey)
                    .lineas.push({
                        linea:
                            row.linea,

                        codprodu:
                            row.codprodu,

                        desprodu:
                            row.desprodu,

                        referencia:
                            row.linea_referencia,

                        cajas:
                            row.cajas,

                        cantidad:
                            row.cantidad,

                        precio:
                            row.precio,

                        importe:
                            row.importe,

                        codiva:
                            row.codiva,

                        unidadventa:
                            row.unidadventa,

                        comentario:
                            row.linea_comentario,
                    });
            }
        });

        return Array.from(
            deliveryNotesMap.values()
        );
    }

    async getInvoiceOrdersByCustomerCode({
        codclien,
        ejercicio,
        codserfacventa,
        nfacventa,
    }) {
        const query = `
        SELECT DISTINCT
            p.empresa,
            p.ejercicio,
            p.canal,
            p.codserpedventa,
            p.npedventa,
            p.codclien,

            a.codseralbventa,
            a.nalbventa,
            a.fecha AS fecha_albaran

        FROM albventa a

        INNER JOIN albventa_linea l
            ON l.canal = a.canal
            AND l.codseralbventa = a.codseralbventa
            AND l.nalbventa = a.nalbventa
            AND l.codclien = a.codclien
            AND l.ejercicio = a.ejercicio

        INNER JOIN pedventa p
            ON p.codserpedventa = l.codserpedventa
            AND p.npedventa = l.npedventa
            AND p.codclien = l.codclien
            AND p.canal = l.canal
            AND BTRIM(p.ejercicio) = l.ejercicio::text

        WHERE
            a.codclien = $1
            AND a.ejercicio = $2
            AND a.codserfacventa = $3
            AND a.nfacventa = $4

            AND NULLIF(
                BTRIM(l.codserpedventa),
                ''
            ) IS NOT NULL

            AND NULLIF(
                BTRIM(l.npedventa),
                ''
            ) IS NOT NULL

        ORDER BY
            p.ejercicio,
            p.codserpedventa,
            p.npedventa,
            a.codseralbventa,
            a.nalbventa
    `;

        const { rows } =
            await this.pool.query(
                query,
                [
                    codclien,
                    Number(ejercicio),
                    codserfacventa,
                    nfacventa,
                ]
            );

        /*
         * PEDVENTA parece contener líneas.
         * Agrupamos para devolver cada pedido una sola vez.
         *
         * Además guardamos todos los albaranes de la factura
         * que relacionan ese pedido con ella.
         */
        const ordersMap = new Map();

        rows.forEach((row) => {
            const orderKey = [
                row.ejercicio,
                row.canal,
                row.codserpedventa,
                row.npedventa,
            ].join('-');

            if (!ordersMap.has(orderKey)) {
                ordersMap.set(orderKey, {
                    empresa:
                        row.empresa,

                    ejercicio:
                        row.ejercicio,

                    canal:
                        row.canal,

                    codserpedventa:
                        row.codserpedventa,

                    npedventa:
                        row.npedventa,

                    codclien:
                        row.codclien,

                    albaranes: [],
                });
            }

            const order =
                ordersMap.get(orderKey);

            const deliveryNoteKey = [
                row.codseralbventa,
                row.nalbventa,
            ].join('-');

            const alreadyExists =
                order.albaranes.some(
                    (albaran) =>
                        [
                            albaran.codseralbventa,
                            albaran.nalbventa,
                        ].join('-') ===
                        deliveryNoteKey
                );

            if (!alreadyExists) {
                order.albaranes.push({
                    codseralbventa:
                        row.codseralbventa,

                    nalbventa:
                        row.nalbventa,

                    fecha:
                        row.fecha_albaran,
                });
            }
        });

        return Array.from(
            ordersMap.values()
        );
    }

    async getOrderDetailByCustomerCode({
        codclien,
        ejercicio,
        canal,
        codserpedventa,
        npedventa,
    }) {
        const query = `
        SELECT
            empresa,
            ejercicio,
            canal,
            codserpedventa,
            npedventa,
            linea,
            codclien,
            razclien,
            fecha,
            fecentre,
            codalmac,
            codprodu,
            desprodu,
            cantidad,
            precio,
            importe,
            dt1,
            impdt1,
            dt2,
            impdt2,
            dt3,
            impdt3,
            impbruto,
            codiva,
            fecultmod
        FROM pedventa

        WHERE codclien = $1
            AND BTRIM(ejercicio) = BTRIM($2)
            AND canal = $3
            AND codserpedventa = $4
            AND npedventa = $5

        ORDER BY linea ASC
    `;

        const { rows } =
            await this.pool.query(
                query,
                [
                    codclien,
                    String(ejercicio),
                    canal,
                    codserpedventa,
                    npedventa,
                ]
            );

        if (!rows.length) {
            return null;
        }

        const firstRow =
            rows[0];

        return {
            empresa:
                firstRow.empresa,

            ejercicio:
                firstRow.ejercicio,

            canal:
                firstRow.canal,

            codserpedventa:
                firstRow.codserpedventa,

            npedventa:
                firstRow.npedventa,

            codclien:
                firstRow.codclien,

            razclien:
                firstRow.razclien,

            fecha:
                firstRow.fecha,

            fecentre:
                firstRow.fecentre,

            codalmac:
                firstRow.codalmac,

            fecultmod:
                firstRow.fecultmod,

            lineas:
                rows.map((row) => ({
                    linea:
                        row.linea,

                    codprodu:
                        row.codprodu,

                    desprodu:
                        row.desprodu,

                    cantidad:
                        row.cantidad,

                    precio:
                        row.precio,

                    importe:
                        row.importe,

                    dt1:
                        row.dt1,

                    impdt1:
                        row.impdt1,

                    dt2:
                        row.dt2,

                    impdt2:
                        row.impdt2,

                    dt3:
                        row.dt3,

                    impdt3:
                        row.impdt3,

                    impbruto:
                        row.impbruto,

                    codiva:
                        row.codiva,
                })),
        };
    }

    async getOrdersByCustomerCode({
        codclien,
        ejercicio,
    }) {
        const params = [
            codclien,
        ];

        let ejercicioFilter = '';

        if (ejercicio) {
            params.push(
                String(ejercicio)
            );

            ejercicioFilter = `
            AND BTRIM(p.ejercicio) = BTRIM($${params.length})
        `;
        }

        const query = `
        SELECT
            p.empresa,
            BTRIM(p.ejercicio) AS ejercicio,
            p.canal,
            p.codserpedventa,
            p.npedventa,
            p.codclien,

            MAX(p.razclien) AS razclien,
            MIN(p.fecha) AS fecha,
            MAX(p.fecentre) AS fecentre,

            SUM(
                COALESCE(
                    p.cantidad,
                    0
                )
            ) AS cantidad,

            SUM(
                COALESCE(
                    p.importe,
                    0
                )
            ) AS importe,

            COUNT(*) AS lineas,

            EXISTS (
                SELECT 1
                FROM albventa_linea al
                WHERE al.codclien = p.codclien
                    AND al.canal = p.canal

                    AND BTRIM(
                        al.codserpedventa
                    ) = BTRIM(
                        p.codserpedventa
                    )

                    AND BTRIM(
                        al.npedventa
                    ) = BTRIM(
                        p.npedventa
                    )

                    AND al.ejercicio::text =
                        BTRIM(
                            p.ejercicio
                        )
            ) AS servido

        FROM pedventa p

        WHERE p.codclien = $1
            ${ejercicioFilter}

        GROUP BY
            p.empresa,
            p.ejercicio,
            p.canal,
            p.codserpedventa,
            p.npedventa,
            p.codclien

        ORDER BY
            MIN(p.fecha) DESC,
            p.npedventa DESC
    `;

        const {
            rows,
        } = await this.pool.query(
            query,
            params
        );

        return rows.map(
            (row) => ({
                ...row,

                cantidad:
                    Number(
                        row.cantidad ||
                        0
                    ),

                importe:
                    Number(
                        row.importe ||
                        0
                    ),

                lineas:
                    Number(
                        row.lineas ||
                        0
                    ),

                servido:
                    Boolean(
                        row.servido
                    ),

                estado:
                    row.servido
                        ? 'served'
                        : 'pending',
            })
        );
    }

    async getInvoiceDetailByCustomerCode({
        codclien,
        ejercicio,
        codserfacventa,
        nfacventa,
    }) {
        const invoiceParams = [
            codclien,
            Number(ejercicio),
            codserfacventa,
            nfacventa,
        ];

        const invoiceQuery = `
            SELECT
                ejercicio,
                canal,
                fecha,
                sfactura,
                codserfacventa,
                nfacventa,
                codclien,
                referencia,
                codforpago,
                impbruto,
                impdes,
                impdpp,
                impbase,
                impiva,
                impre,
                impirpf,
                imptotal,
                comentario,
                estadoverifactu
            FROM facventa

            WHERE codclien = $1
                AND ejercicio = $2
                AND codserfacventa = $3
                AND nfacventa = $4

            LIMIT 1
        `;

        const invoiceResult =
            await this.pool.query(
                invoiceQuery,
                invoiceParams
            );

        const invoice =
            invoiceResult.rows[0];

        if (!invoice) {
            return null;
        }

        /*
         * Fuente de verdad de la forma de pago:
         * CLIENTES.CODFORPAGO
         */
        const customerQuery = `
            SELECT
                codclien,
                razclien,
                nomcomer,
                nif,
                email,
                tlfno,
                movil,
                codforpago,
                desforpago,
                direccion,
                localidad,
                cp
            FROM clientes

            WHERE codclien = $1

            ORDER BY ejercicio DESC

            LIMIT 1
        `;

        const customerResult =
            await this.pool.query(
                customerQuery,
                [codclien]
            );

        const customer =
            customerResult.rows[0] ??
            null;

        const deliveryNotesQuery = `
            SELECT
                a.ejercicio,
                a.canal,
                a.codseralbventa,
                a.nalbventa,
                a.fecha,
                a.fecentre,
                a.salbaran,
                a.referencia,
                a.obs,
                a.impbase,
                a.impiva,
                a.imptotal,
                a.imptotalbaran,

                l.linea,
                l.codprodu,
                l.desprodu,
                l.referencia
                    AS linea_referencia,
                l.cajas,
                l.cantidad,
                l.precio,
                l.importe,
                l.dt1,
                l.dt2,
                l.dt3,
                l.impdt1,
                l.impdt2,
                l.impdt3,
                l.impbruto,
                l.codiva,
                l.unidadventa,
                l.comentario
                    AS linea_comentario,

                img.ficadjunto
                    AS imagen_producto,

                img.nombre
                    AS imagen_nombre,

                img.descripcion
                    AS imagen_descripcion

            FROM albventa a

            LEFT JOIN albventa_linea l
                ON l.canal = a.canal
                AND l.codseralbventa =
                    a.codseralbventa
                AND l.nalbventa =
                    a.nalbventa
                AND l.codclien =
                    a.codclien
                AND l.ejercicio =
                    a.ejercicio

            LEFT JOIN LATERAL (
                SELECT
                    i.ficadjunto,
                    i.nombre,
                    i.descripcion

                FROM imagenesproductoswebp i

                WHERE
                    i.codprodu =
                    l.codprodu

                ORDER BY
                    CASE
                        WHEN
                            i.codclaarchivo
                            ILIKE '%BAJA%'
                        THEN 0

                        WHEN
                            i.codclaarchivo
                            ILIKE '%WEB%'
                        THEN 1

                        ELSE 2
                    END,

                    i.linea ASC
                        NULLS LAST

                LIMIT 1
            ) img ON TRUE

            WHERE a.codclien = $1
                AND a.ejercicio = $2
                AND a.codserfacventa = $3
                AND a.nfacventa = $4

            ORDER BY
                a.fecha ASC,
                a.nalbventa ASC,
                l.linea ASC
        `;

        const deliveryNotesResult =
            await this.pool.query(
                deliveryNotesQuery,
                invoiceParams
            );

        const deliveryNotesMap =
            new Map();

        deliveryNotesResult.rows.forEach(
            (row) => {
                const deliveryNoteKey = [
                    row.ejercicio,
                    row.canal,
                    row.codseralbventa,
                    row.nalbventa,
                ].join('-');

                if (
                    !deliveryNotesMap.has(
                        deliveryNoteKey
                    )
                ) {
                    deliveryNotesMap.set(
                        deliveryNoteKey,
                        {
                            ejercicio:
                                row.ejercicio,

                            canal:
                                row.canal,

                            codseralbventa:
                                row.codseralbventa,

                            nalbventa:
                                row.nalbventa,

                            fecha:
                                row.fecha,

                            fecentre:
                                row.fecentre,

                            salbaran:
                                row.salbaran,

                            referencia:
                                row.referencia,

                            obs:
                                row.obs,

                            impbase:
                                row.impbase,

                            impiva:
                                row.impiva,

                            imptotal:
                                row.imptotal,

                            imptotalbaran:
                                row.imptotalbaran,

                            lineas: [],
                        }
                    );
                }

                if (
                    row.linea !== null
                ) {
                    deliveryNotesMap
                        .get(
                            deliveryNoteKey
                        )
                        .lineas.push({
                            linea:
                                row.linea,

                            codprodu:
                                row.codprodu,

                            desprodu:
                                row.desprodu,

                            referencia:
                                row.linea_referencia,

                            cajas:
                                row.cajas,

                            cantidad:
                                row.cantidad,

                            precio:
                                row.precio,

                            importe:
                                row.importe,

                            dt1:
                                row.dt1,

                            dt2:
                                row.dt2,

                            dt3:
                                row.dt3,

                            impdt1:
                                row.impdt1,

                            impdt2:
                                row.impdt2,

                            impdt3:
                                row.impdt3,

                            impbruto:
                                row.impbruto,

                            codiva:
                                row.codiva,

                            unidadventa:
                                row.unidadventa,

                            comentario:
                                row.linea_comentario,

                            imagenProducto:
                                row.imagen_producto,

                            imagenNombre:
                                row.imagen_nombre,

                            imagenDescripcion:
                                row.imagen_descripcion,
                        });
                }
            }
        );

        return {
            ...invoice,

            cliente:
                customer,

            albaranes:
                Array.from(
                    deliveryNotesMap.values()
                ),
        };
    }
}