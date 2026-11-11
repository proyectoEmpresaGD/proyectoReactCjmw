import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    useNavigate,
} from 'react-router-dom';

import {
    motion,
} from 'framer-motion';

import {
    CheckCircle2,
    ChevronDown,
    FileText,
    Filter,
    Search,
    ShoppingBag,
} from 'lucide-react';

import {
    getInvoices,
    getInvoicePdfUrl,
} from '../../services/clientAreaClient';


const ITEMS_PER_PAGE = 20;

const SEARCH_DEBOUNCE_MS =
    350;


const SECTION_CONFIG = {
    orders: {
        title:
            'Mis facturas',

        description:
            'Consulta tus facturas y accede a toda la información asociada a cada una.',

        emptyTitle:
            'No hay facturas disponibles con los filtros actuales.',

        emptyDescription:
            'Prueba a cambiar el periodo o el texto de búsqueda.',

        cardTitle:
            'Factura disponible',

        itemLabel:
            'facturas',
    },

    returns: {
        title:
            'Historial devoluciones',

        description:
            'Aquí aparecen las devoluciones detectadas por facturas cuyo código de serie tiene dos letras.',

        emptyTitle:
            'No hay devoluciones disponibles con los filtros actuales.',

        emptyDescription:
            'Cuando existan devoluciones, aparecerán aquí.',

        cardTitle:
            'Devolución disponible',

        itemLabel:
            'devoluciones',
    },
};


function formatCurrency(
    value
) {
    return new Intl.NumberFormat(
        'es-ES',
        {
            style:
                'currency',

            currency:
                'EUR',
        }
    ).format(
        Number(
            value ||
            0
        )
    );
}


function formatDate(
    value
) {
    if (!value) {
        return '-';
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(
            value
        );
    }


    return date.toLocaleDateString(
        'es-ES',
        {
            day:
                'numeric',

            month:
                'long',

            year:
                'numeric',
        }
    );
}


function getInvoiceKey(
    invoice
) {
    return [
        invoice.ejercicio,
        invoice.codserfacventa,
        invoice.nfacventa,
    ].join(
        '-'
    );
}


function getInvoiceLabel(
    invoice
) {
    if (
        invoice.sfactura
    ) {
        return invoice.sfactura;
    }


    const series =
        invoice.codserfacventa ||
        '';

    const number =
        invoice.nfacventa ||
        '';


    return (
        `${series}${number}` ||
        'Factura'
    );
}


function getInvoiceOrdersPath(
    invoice
) {
    return (
        `/account/invoices/` +
        `${encodeURIComponent(
            invoice.ejercicio
        )}/` +
        `${encodeURIComponent(
            invoice.codserfacventa
        )}/` +
        `${encodeURIComponent(
            invoice.nfacventa
        )}/orders`
    );
}


function SearchInput({
    value,
    onChange,
}) {
    return (
        <label
            className="
                flex
                h-12
                w-full
                items-center
                gap-3
                rounded-xl
                border
                border-stone-200
                bg-white
                px-4
                text-sm
                text-stone-500
                shadow-sm
                transition

                focus-within:border-stone-400
                focus-within:ring-2
                focus-within:ring-stone-100

                md:max-w-[305px]
            "
        >
            <input
                type="search"
                value={
                    value
                }
                onChange={(
                    event
                ) =>
                    onChange(
                        event
                            .target
                            .value
                    )
                }
                placeholder="Buscar"
                className="
                    min-w-0
                    flex-1
                    bg-transparent
                    text-stone-800
                    outline-none

                    placeholder:text-stone-400
                "
            />

            <Search
                className="
                    h-5
                    w-5
                    shrink-0
                    text-stone-700
                "
            />
        </label>
    );
}


function SelectFilter({
    icon: Icon,
    value,
    onChange,
    children,
    ariaLabel,
}) {
    return (
        <label
            className="
                relative
                flex
                h-12
                w-full
                items-center
                rounded-xl
                border
                border-stone-200
                bg-white
                px-4
                text-sm
                text-stone-700
                shadow-sm
                transition

                focus-within:border-stone-400
                focus-within:ring-2
                focus-within:ring-stone-100

                md:max-w-[305px]
            "
        >
            {Icon && (
                <Icon
                    className="
                        mr-3
                        h-4
                        w-4
                        shrink-0
                        text-stone-500
                    "
                />
            )}

            <select
                value={
                    value
                }
                onChange={(
                    event
                ) =>
                    onChange(
                        event
                            .target
                            .value
                    )
                }
                aria-label={
                    ariaLabel
                }
                className="
                    w-full
                    cursor-pointer
                    appearance-none
                    bg-transparent
                    pr-8
                    font-medium
                    outline-none
                "
            >
                {children}
            </select>

            <ChevronDown
                className="
                    pointer-events-none
                    absolute
                    right-4
                    h-4
                    w-4
                    text-stone-700
                "
            />
        </label>
    );
}


function InvoiceCard({
    invoice,
    index,
    onViewInvoice,
    onViewOrders,
    cardTitle,
}) {
    return (
        <motion.article
            initial={{
                opacity:
                    0,

                y:
                    12,
            }}
            animate={{
                opacity:
                    1,

                y:
                    0,
            }}
            transition={{
                delay:
                    Math.min(
                        index,
                        8
                    ) *
                    0.03,

                duration:
                    0.25,
            }}
            className="
                rounded-xl
                border
                border-stone-200
                bg-white
                shadow-sm
                transition

                hover:border-stone-300
                hover:shadow-md
            "
        >
            <div
                className="
                    p-5

                    lg:px-6
                    lg:py-5
                "
            >
                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >
                    <CheckCircle2
                        className="
                            h-5
                            w-5
                            shrink-0
                            text-stone-900
                        "
                    />

                    <h3
                        className="
                            text-lg
                            font-bold
                            tracking-tight
                            text-stone-900
                        "
                    >
                        {cardTitle}
                    </h3>
                </div>


                <div
                    className="
                        mt-5
                        grid
                        gap-6

                        lg:grid-cols-[1fr_0.8fr_1fr_230px]
                        lg:items-start
                    "
                >
                    <div
                        className="
                            grid
                            gap-4
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-stone-400
                                "
                            >
                                Nº de factura
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-base
                                    font-semibold
                                    leading-6
                                    text-stone-900
                                "
                            >
                                {getInvoiceLabel(
                                    invoice
                                )}
                            </p>
                        </div>


                        <div>
                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-stone-400
                                "
                            >
                                Fecha factura
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-medium
                                    leading-6
                                    text-stone-700
                                "
                            >
                                {formatDate(
                                    invoice.fecha
                                )}
                            </p>
                        </div>
                    </div>


                    <div
                        className="
                            grid
                            gap-4
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-stone-400
                                "
                            >
                                Importe
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-base
                                    font-bold
                                    leading-6
                                    text-stone-900
                                "
                            >
                                {formatCurrency(
                                    invoice.imptotal
                                )}
                            </p>
                        </div>


                        <div>
                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-stone-400
                                "
                            >
                                Año
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    font-medium
                                    leading-6
                                    text-stone-700
                                "
                            >
                                {invoice.ejercicio ||
                                    '-'}
                            </p>
                        </div>
                    </div>


                    <div
                        className="
                            grid
                            gap-4
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-stone-400
                                "
                            >
                                Referencia
                            </p>

                            <p
                                className="
                                    mt-1
                                    break-words
                                    text-sm
                                    font-medium
                                    leading-6
                                    text-stone-800
                                "
                            >
                                {invoice.referencia ||
                                    '-'}
                            </p>
                        </div>
                    </div>


                    <div
                        className="
                            flex
                            flex-col
                            gap-2

                            lg:min-w-[230px]
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                onViewInvoice
                            }
                            className="
                                inline-flex
                                h-10
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-md
                                bg-stone-900
                                px-5
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition

                                hover:bg-stone-700

                                focus:outline-none
                                focus:ring-2
                                focus:ring-stone-300
                            "
                        >
                            <FileText
                                className="
                                    h-4
                                    w-4
                                "
                            />

                            Ver factura
                        </button>


                        <button
                            type="button"
                            onClick={
                                onViewOrders
                            }
                            className="
                                inline-flex
                                h-10
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-md
                                border
                                border-stone-300
                                bg-white
                                px-5
                                text-sm
                                font-semibold
                                text-stone-800
                                shadow-sm
                                transition

                                hover:bg-stone-50

                                focus:outline-none
                                focus:ring-2
                                focus:ring-stone-200
                            "
                        >
                            <ShoppingBag
                                className="
                                    h-4
                                    w-4
                                "
                            />

                            Ver pedidos asociados
                        </button>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}


export default function InvoicesSection({
    mode = 'orders',
}) {
    const navigate =
        useNavigate();


    const config =
        SECTION_CONFIG[mode] ??
        SECTION_CONFIG.orders;


    const [
        invoices,
        setInvoices,
    ] = useState([]);


    const [
        total,
        setTotal,
    ] = useState(0);


    const [
        ejercicio,
        setEjercicio,
    ] = useState('');


    const [
        searchTerm,
        setSearchTerm,
    ] = useState('');


    const [
        debouncedSearchTerm,
        setDebouncedSearchTerm,
    ] = useState('');


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        loadingMore,
        setLoadingMore,
    ] = useState(false);


    const [
        error,
        setError,
    ] = useState('');


    const [
        availableYears,
        setAvailableYears,
    ] = useState([]);


    const [
        offset,
        setOffset,
    ] = useState(0);


    const [
        hasMore,
        setHasMore,
    ] = useState(true);


    const loadingMoreRef =
        useRef(false);


    /*
     * Evitamos consultar el backend
     * en cada pulsación del teclado.
     */
    useEffect(() => {
        const timeout =
            window.setTimeout(
                () => {
                    setDebouncedSearchTerm(
                        searchTerm.trim()
                    );
                },
                SEARCH_DEBOUNCE_MS
            );


        return () => {
            window.clearTimeout(
                timeout
            );
        };
    }, [
        searchTerm,
    ]);


    /*
     * Primera página.
     *
     * También se reinicia cuando:
     *
     * - cambia el año
     * - cambia Facturas / Devoluciones
     * - cambia la búsqueda
     */
    useEffect(() => {
        let cancelled =
            false;


        async function loadInvoices() {
            try {
                setLoading(
                    true
                );

                setError('');

                setInvoices([]);

                setTotal(0);

                setOffset(0);

                setHasMore(
                    true
                );


                const data =
                    await getInvoices({
                        ejercicio:
                            ejercicio ||
                            undefined,

                        mode,

                        search:
                            debouncedSearchTerm,

                        limit:
                            ITEMS_PER_PAGE,

                        offset:
                            0,
                    });


                if (
                    cancelled
                ) {
                    return;
                }


                const firstPage =
                    Array.isArray(
                        data?.invoices
                    )
                        ? data.invoices
                        : [];


                setInvoices(
                    firstPage
                );


                setTotal(
                    Number(
                        data?.total
                    ) ||
                    0
                );


                setHasMore(
                    data?.hasMore ===
                    true
                );


                setOffset(
                    Number(
                        data?.nextOffset
                    ) ||
                    firstPage.length
                );


                if (
                    Array.isArray(
                        data?.availableYears
                    )
                ) {
                    setAvailableYears(
                        data.availableYears
                    );
                }


                console.log(
                    '[Facturas] carga inicial',
                    {
                        received:
                            firstPage.length,

                        total:
                            data?.total,

                        hasMore:
                            data?.hasMore,

                        nextOffset:
                            data?.nextOffset,
                    }
                );
            } catch (
            requestError
            ) {
                if (
                    cancelled
                ) {
                    return;
                }


                console.error(
                    '[Facturas] error carga inicial',
                    requestError
                );


                setError(
                    requestError?.message ||
                    'No se pudieron cargar las facturas'
                );

                setInvoices([]);

                setTotal(0);

                setHasMore(
                    false
                );
            } finally {
                if (
                    !cancelled
                ) {
                    setLoading(
                        false
                    );
                }
            }
        }


        loadInvoices();


        return () => {
            cancelled =
                true;
        };
    }, [
        ejercicio,
        mode,
        debouncedSearchTerm,
    ]);


    /*
     * Siguientes 20.
     */
    const loadMore =
        useCallback(
            async () => {
                if (
                    loadingMoreRef.current ||
                    !hasMore
                ) {
                    return;
                }


                loadingMoreRef.current =
                    true;

                setLoadingMore(
                    true
                );


                try {
                    const data =
                        await getInvoices({
                            ejercicio:
                                ejercicio ||
                                undefined,

                            mode,

                            search:
                                debouncedSearchTerm,

                            limit:
                                ITEMS_PER_PAGE,

                            offset,
                        });


                    const newInvoices =
                        Array.isArray(
                            data?.invoices
                        )
                            ? data.invoices
                            : [];


                    setInvoices(
                        previous => {
                            const invoiceMap =
                                new Map();


                            previous.forEach(
                                invoice => {
                                    invoiceMap.set(
                                        getInvoiceKey(
                                            invoice
                                        ),
                                        invoice
                                    );
                                }
                            );


                            newInvoices.forEach(
                                invoice => {
                                    invoiceMap.set(
                                        getInvoiceKey(
                                            invoice
                                        ),
                                        invoice
                                    );
                                }
                            );


                            return [
                                ...invoiceMap.values(),
                            ];
                        }
                    );


                    if (
                        data?.total != null
                    ) {
                        setTotal(
                            Number(
                                data.total
                            ) ||
                            0
                        );
                    }


                    const nextHasMore =
                        data?.hasMore ===
                        true &&
                        newInvoices.length >
                        0;


                    setHasMore(
                        nextHasMore
                    );


                    const nextOffset =
                        Number(
                            data?.nextOffset
                        );


                    setOffset(
                        Number.isFinite(
                            nextOffset
                        )
                            ? nextOffset
                            : (
                                offset +
                                newInvoices.length
                            )
                    );


                    console.log(
                        '[Facturas] página cargada',
                        {
                            received:
                                newInvoices.length,

                            total:
                                data?.total,

                            hasMore:
                                nextHasMore,

                            nextOffset:
                                data?.nextOffset,
                        }
                    );
                } catch (
                requestError
                ) {
                    console.error(
                        '[Facturas] error cargando más',
                        requestError
                    );


                    setError(
                        requestError?.message ||
                        'No se pudieron cargar más facturas'
                    );
                } finally {
                    loadingMoreRef.current =
                        false;

                    setLoadingMore(
                        false
                    );
                }
            },
            [
                offset,
                hasMore,
                ejercicio,
                mode,
                debouncedSearchTerm,
            ]
        );


    /*
     * Scroll infinito.
     *
     * Pedimos otros 20 cuando quedan
     * aproximadamente 300px para
     * llegar al final.
     */
    useEffect(() => {
        if (
            loading ||
            !hasMore
        ) {
            return undefined;
        }


        const handleScroll =
            () => {
                const documentHeight =
                    document
                        .documentElement
                        .scrollHeight;


                const currentPosition =
                    window.scrollY +
                    window.innerHeight;


                const distanceToBottom =
                    documentHeight -
                    currentPosition;


                if (
                    distanceToBottom >
                    300
                ) {
                    return;
                }


                loadMore();
            };


        window.addEventListener(
            'scroll',
            handleScroll,
            {
                passive:
                    true,
            }
        );


        return () => {
            window.removeEventListener(
                'scroll',
                handleScroll
            );
        };
    }, [
        loading,
        hasMore,
        loadMore,
    ]);


    function handleViewInvoice(
        invoice
    ) {
        const pdfUrl =
            getInvoicePdfUrl({
                ejercicio:
                    invoice.ejercicio,

                codserfacventa:
                    invoice.codserfacventa,

                nfacventa:
                    invoice.nfacventa,
            });


        window.open(
            pdfUrl,
            '_blank',
            'noopener,noreferrer'
        );
    }


    function handleViewOrders(
        invoice
    ) {
        navigate(
            getInvoiceOrdersPath(
                invoice
            )
        );
    }


    return (
        <section
            className="
                grid
                gap-6
            "
        >
            <div>
                <h1
                    className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-stone-900

                        md:text-3xl
                    "
                >
                    {config.title}
                </h1>


                <p
                    className="
                        mt-2
                        max-w-2xl
                        text-sm
                        leading-6
                        text-stone-500
                    "
                >
                    {config.description}
                </p>


                {!loading &&
                    total >
                    0 && (
                        <p
                            className="
                                mt-2
                                text-xs
                                text-stone-400
                            "
                        >
                            {invoices.length}
                            {' de '}
                            {total}
                            {' '}
                            {config.itemLabel}
                            {' cargadas'}
                        </p>
                    )}
            </div>


            <div
                className="
                    flex
                    flex-col
                    gap-3

                    md:flex-row
                    md:flex-wrap
                "
            >
                <SearchInput
                    value={
                        searchTerm
                    }
                    onChange={
                        setSearchTerm
                    }
                />


                <SelectFilter
                    value={
                        ejercicio
                    }
                    onChange={
                        setEjercicio
                    }
                    ariaLabel="Filtrar por periodo"
                    icon={
                        Filter
                    }
                >
                    <option value="">
                        Periodo: Todo el historial
                    </option>

                    {availableYears.map(
                        year => (
                            <option
                                key={
                                    year
                                }
                                value={
                                    year
                                }
                            >
                                Periodo:{' '}
                                {year}
                            </option>
                        )
                    )}
                </SelectFilter>
            </div>


            {loading && (
                <div
                    className="
                        grid
                        gap-8
                        pt-6
                    "
                >
                    {Array.from({
                        length:
                            3,
                    }).map(
                        (
                            _,
                            index
                        ) => (
                            <div
                                key={
                                    index
                                }
                                className="
                                    h-40
                                    animate-pulse
                                    rounded-lg
                                    border
                                    border-stone-200
                                    bg-stone-100
                                "
                            />
                        )
                    )}
                </div>
            )}


            {error &&
                invoices.length ===
                0 && (
                    <div
                        className="
                            rounded-lg
                            border
                            border-rose-200
                            bg-rose-50
                            px-4
                            py-3
                            text-sm
                            text-rose-700
                        "
                    >
                        {error}
                    </div>
                )}


            {!loading &&
                !error &&
                invoices.length ===
                0 && (
                    <div
                        className="
                            rounded-lg
                            border
                            border-dashed
                            border-stone-300
                            bg-white
                            px-5
                            py-12
                            text-center
                            shadow-sm
                        "
                    >
                        <p
                            className="
                                text-sm
                                font-semibold
                                text-stone-800
                            "
                        >
                            {config.emptyTitle}
                        </p>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-stone-500
                            "
                        >
                            {config.emptyDescription}
                        </p>
                    </div>
                )}


            {!loading &&
                invoices.length >
                0 && (
                    <div
                        className="
                            grid
                            gap-8
                        "
                    >
                        {invoices.map(
                            (
                                invoice,
                                index
                            ) => (
                                <InvoiceCard
                                    key={
                                        getInvoiceKey(
                                            invoice
                                        )
                                    }
                                    invoice={
                                        invoice
                                    }
                                    index={
                                        index
                                    }
                                    cardTitle={
                                        config.cardTitle
                                    }
                                    onViewInvoice={() =>
                                        handleViewInvoice(
                                            invoice
                                        )
                                    }
                                    onViewOrders={() =>
                                        handleViewOrders(
                                            invoice
                                        )
                                    }
                                />
                            )
                        )}
                    </div>
                )}


            {error &&
                invoices.length >
                0 && (
                    <div
                        className="
                            rounded-lg
                            border
                            border-rose-200
                            bg-rose-50
                            px-4
                            py-3
                            text-sm
                            text-rose-700
                        "
                    >
                        {error}
                    </div>
                )}


            {!loading &&
                invoices.length >
                0 && (
                    <div
                        className="
                            flex
                            min-h-20
                            items-center
                            justify-center
                            border-t
                            border-stone-100
                        "
                    >
                        {loadingMore && (
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    text-xs
                                    text-stone-400
                                "
                            >
                                <span
                                    className="
                                        h-4
                                        w-4
                                        animate-spin
                                        rounded-full
                                        border
                                        border-stone-300
                                        border-t-stone-950
                                    "
                                />

                                Cargando otras 20...
                            </div>
                        )}


                        {!loadingMore &&
                            hasMore && (
                                <p
                                    className="
                                        text-xs
                                        text-stone-400
                                    "
                                >
                                    Sigue bajando para ver más
                                </p>
                            )}


                        {!loadingMore &&
                            !hasMore && (
                                <p
                                    className="
                                        text-xs
                                        text-stone-400
                                    "
                                >
                                    Has llegado al final
                                </p>
                            )}
                    </div>
                )}
        </section>
    );
}