import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
    ArrowUpRight,
    CheckCircle2,
    ChevronDown,
    FileText,
    Filter,
    ImageOff,
    ReceiptText,
    Search,
    ShoppingBag,
} from 'lucide-react';

import {
    getInvoiceDetail,
    getInvoices,
    getInvoicePdfUrl,
} from '../../services/clientAreaClient';

const MAX_PREVIEW_IMAGES = 4;

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
    },
};

function formatCurrency(value) {
    return new Intl.NumberFormat(
        'es-ES',
        {
            style: 'currency',
            currency: 'EUR',
        }
    ).format(
        Number(value || 0)
    );
}

function formatDate(value) {
    if (!value) {
        return '-';
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(value);
    }

    return date.toLocaleDateString(
        'es-ES',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }
    );
}

function getInvoiceKey(invoice) {
    return [
        invoice.ejercicio,
        invoice.codserfacventa,
        invoice.nfacventa,
    ].join('-');
}

function getInvoiceLabel(invoice) {
    if (
        invoice.sfactura
    ) {
        return invoice.sfactura;
    }

    const series =
        invoice.codserfacventa || '';

    const number =
        invoice.nfacventa || '';

    return (
        `${series}${number}` ||
        'Factura'
    );
}

function getInvoiceDetailParams(
    invoice
) {
    return {
        ejercicio:
            invoice.ejercicio,

        codserfacventa:
            invoice.codserfacventa,

        nfacventa:
            invoice.nfacventa,
    };
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

function isReturnInvoice(
    invoice
) {
    return /^[A-Za-z]{2}$/.test(
        String(
            invoice.codserfacventa ||
            ''
        ).trim()
    );
}

function getInvoicePreviewImages(
    invoiceDetail
) {
    const albaranes =
        invoiceDetail?.albaranes ??
        [];

    const images = [];

    const usedImages =
        new Set();

    albaranes.forEach(
        (albaran) => {
            const lineas =
                albaran.lineas ??
                [];

            lineas.forEach(
                (linea) => {
                    if (
                        !linea.imagenProducto ||
                        usedImages.has(
                            linea.imagenProducto
                        )
                    ) {
                        return;
                    }

                    usedImages.add(
                        linea.imagenProducto
                    );

                    images.push({
                        src:
                            linea.imagenProducto,

                        alt:
                            linea.imagenDescripcion ||
                            linea.imagenNombre ||
                            linea.desprodu ||
                            linea.codprodu ||
                            'Producto',
                    });
                }
            );
        }
    );

    return images.slice(
        0,
        MAX_PREVIEW_IMAGES
    );
}

function invoiceMatchesSearch(
    invoice,
    searchTerm
) {
    if (
        !searchTerm.trim()
    ) {
        return true;
    }

    const normalizedSearch =
        searchTerm
            .trim()
            .toLowerCase();

    const searchableFields = [
        invoice.ejercicio,
        invoice.codserfacventa,
        invoice.nfacventa,
        invoice.sfactura,
        invoice.referencia,
        invoice.fecha,
        invoice.imptotal,
    ];

    return searchableFields
        .filter(Boolean)
        .some(
            (field) =>
                String(field)
                    .toLowerCase()
                    .includes(
                        normalizedSearch
                    )
        );
}

async function loadInvoiceWithPreview(
    invoice
) {
    try {
        const data =
            await getInvoiceDetail(
                getInvoiceDetailParams(
                    invoice
                )
            );

        const previewImages =
            getInvoicePreviewImages(
                data.invoice
            );

        return {
            ...invoice,
            previewImages,
        };
    } catch {
        return {
            ...invoice,
            previewImages: [],
        };
    }
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
                min-w-0
                flex-1
                items-center
                gap-3
                border-b
                border-stone-300
                px-1
                text-sm
                text-stone-500
                transition

                focus-within:border-stone-950

                md:min-w-[260px]
            "
        >
            <Search
                className="
                    h-4
                    w-4
                    shrink-0
                    text-stone-400
                "
            />

            <input
                type="search"
                value={value}
                onChange={event =>
                    onChange(
                        event.target.value
                    )
                }
                placeholder="Buscar por factura, referencia o año"
                className="
                    min-w-0
                    flex-1
                    bg-transparent
                    text-sm
                    text-stone-900
                    outline-none

                    placeholder:text-stone-400
                "
            />
        </label>
    );
}


function SelectFilter({
    value,
    onChange,
    children,
    ariaLabel,
    icon: Icon = Filter,
}) {
    return (
        <label
            className="
                relative
                flex
                h-12
                min-w-[190px]
                items-center
                gap-2
                border-b
                border-stone-300
                px-1
                text-sm
                text-stone-700
                transition

                focus-within:border-stone-950
            "
        >
            <Icon
                className="
                    h-4
                    w-4
                    shrink-0
                    text-stone-400
                "
            />

            <select
                value={value}
                onChange={event =>
                    onChange(
                        event.target.value
                    )
                }
                aria-label={ariaLabel}
                className="
                    w-full
                    cursor-pointer
                    appearance-none
                    bg-transparent
                    pr-7
                    text-sm
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
                    right-1
                    h-4
                    w-4
                    text-stone-400
                "
            />
        </label>
    );
}


function InvoiceProductPreview({
    images = [],
}) {
    if (!images.length) {
        return (
            <div
                className="
                    flex
                    aspect-square
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[20px]
                    bg-[#f1eee8]

                    sm:w-[132px]
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        items-center
                        gap-2
                        text-stone-400
                    "
                >
                    <ImageOff
                        className="
                            h-6
                            w-6
                        "
                    />

                    <span
                        className="
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                        "
                    >
                        Sin imagen
                    </span>
                </div>
            </div>
        );
    }


    if (
        images.length ===
        1
    ) {
        return (
            <div
                className="
                    aspect-square
                    w-full
                    overflow-hidden
                    rounded-[20px]
                    bg-stone-100

                    sm:w-[132px]
                "
            >
                <img
                    src={images[0].src}
                    alt={images[0].alt}
                    loading="lazy"
                    className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700

                        group-hover:scale-[1.03]
                    "
                />
            </div>
        );
    }


    return (
        <div
            className="
                grid
                aspect-square
                w-full
                grid-cols-2
                gap-1
                overflow-hidden
                rounded-[20px]
                bg-stone-100
                p-1

                sm:w-[132px]
            "
        >
            {images.map(
                image => (
                    <div
                        key={image.src}
                        className="
                            overflow-hidden
                            rounded-[8px]
                            bg-white
                        "
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            className="
                                h-full
                                w-full
                                object-cover
                                transition-transform
                                duration-700

                                group-hover:scale-[1.04]
                            "
                        />
                    </div>
                )
            )}
        </div>
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
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                delay:
                    index *
                    0.025,
                duration:
                    0.25,
            }}
            className="
                group
                overflow-hidden
                rounded-[26px]
                border
                border-stone-300/80
                bg-white
                transition

                hover:border-stone-400
                hover:shadow-[0_18px_50px_rgba(28,25,23,0.07)]
            "
        >
            <div
                className="
                    grid
                    gap-5
                    p-5

                    sm:grid-cols-[132px_minmax(0,1fr)]
                    sm:p-6

                    xl:grid-cols-[132px_minmax(0,1fr)_190px]
                    xl:items-center
                "
            >
                <InvoiceProductPreview
                    images={
                        invoice.previewImages
                    }
                />


                <div
                    className="
                        min-w-0
                    "
                >
                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                    >
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-[#f1eee8]
                                px-3
                                py-1
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.14em]
                                text-stone-600
                            "
                        >
                            <CheckCircle2
                                className="
                                    h-3.5
                                    w-3.5
                                "
                            />

                            {cardTitle}
                        </span>

                        <span
                            className="
                                text-xs
                                text-stone-400
                            "
                        >
                            {invoice.ejercicio ||
                                "-"}
                        </span>
                    </div>

                    <h3
                        className="
                            mt-4
                            break-words
                            text-xl
                            font-light
                            tracking-[-0.03em]
                            text-stone-950

                            sm:text-2xl
                        "
                    >
                        {getInvoiceLabel(
                            invoice
                        )}
                    </h3>

                    <div
                        className="
                            mt-4
                            grid
                            gap-x-8
                            gap-y-3
                            text-sm

                            md:grid-cols-2
                        "
                    >
                        <MetaItem
                            label="Fecha"
                            value={formatDate(
                                invoice.fecha
                            )}
                        />

                        <MetaItem
                            label="Referencia"
                            value={
                                invoice.referencia ||
                                "-"
                            }
                        />
                    </div>
                </div>


                <div
                    className="
                        border-t
                        border-stone-200
                        pt-4

                        sm:col-start-2

                        xl:col-start-auto
                        xl:border-l
                        xl:border-t-0
                        xl:pl-7
                        xl:pt-0
                    "
                >
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            text-stone-400
                        "
                    >
                        Importe total
                    </p>

                    <p
                        className="
                            mt-2
                            text-2xl
                            font-light
                            tracking-[-0.03em]
                            text-stone-950
                        "
                    >
                        {formatCurrency(
                            invoice.imptotal
                        )}
                    </p>
                </div>
            </div>


            <div
                className="
                    flex
                    flex-col
                    gap-2
                    border-t
                    border-stone-200
                    bg-[#fbfaf8]
                    px-5
                    py-4

                    sm:flex-row
                    sm:items-center
                    sm:justify-end
                    sm:px-6
                "
            >
                <button
                    type="button"
                    onClick={
                        onViewOrders
                    }
                    className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        px-4
                        text-sm
                        font-medium
                        text-stone-600
                        transition

                        hover:text-stone-950
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

                <button
                    type="button"
                    onClick={
                        onViewInvoice
                    }
                    className="
                        group/button
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-stone-950
                        px-5
                        text-sm
                        font-medium
                        text-white
                        transition

                        hover:bg-stone-800
                    "
                >
                    <FileText
                        className="
                            h-4
                            w-4
                        "
                    />

                    Ver factura

                    <ArrowUpRight
                        className="
                            h-3.5
                            w-3.5
                            transition-transform

                            group-hover/button:-translate-y-0.5
                            group-hover/button:translate-x-0.5
                        "
                    />
                </button>
            </div>
        </motion.article>
    );
}


function MetaItem({
    label,
    value,
}) {
    return (
        <div
            className="
                min-w-0
            "
        >
            <p
                className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-stone-400
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    truncate
                    text-sm
                    font-medium
                    text-stone-700
                "
                title={
                    value
                }
            >
                {value}
            </p>
        </div>
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
        ejercicio,
        setEjercicio,
    ] = useState('');

    const [
        invoiceType,
        setInvoiceType,
    ] = useState('all');

    const [
        searchTerm,
        setSearchTerm,
    ] = useState('');

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState('');

    const [
        availableYears,
        setAvailableYears,
    ] = useState([]);

    useEffect(() => {
        let cancelled =
            false;

        async function loadInitialYears() {
            try {
                const data =
                    await getInvoices();

                const allInvoices =
                    data.invoices ??
                    [];

                const years =
                    new Set(
                        allInvoices
                            .map(
                                (
                                    invoice
                                ) =>
                                    invoice.ejercicio
                            )
                            .filter(
                                Boolean
                            )
                    );

                if (
                    !cancelled
                ) {
                    setAvailableYears(
                        Array.from(
                            years
                        ).sort(
                            (
                                a,
                                b
                            ) =>
                                Number(
                                    b
                                ) -
                                Number(
                                    a
                                )
                        )
                    );
                }
            } catch {
                if (
                    !cancelled
                ) {
                    setAvailableYears(
                        []
                    );
                }
            }
        }

        loadInitialYears();

        return () => {
            cancelled =
                true;
        };
    }, []);

    useEffect(() => {
        let cancelled =
            false;

        async function loadInvoices() {
            try {
                setLoading(
                    true
                );

                setError('');

                const data =
                    await getInvoices(
                        ejercicio ||
                        undefined
                    );

                const baseInvoices =
                    data.invoices ??
                    [];

                const invoicesByMode =
                    baseInvoices.filter(
                        (
                            invoice
                        ) => {
                            const isReturn =
                                isReturnInvoice(
                                    invoice
                                );

                            if (
                                mode ===
                                'returns'
                            ) {
                                return isReturn;
                            }

                            return !isReturn;
                        }
                    );

                const invoicesWithPreviews =
                    await Promise.all(
                        invoicesByMode.map(
                            (
                                invoice
                            ) =>
                                loadInvoiceWithPreview(
                                    invoice
                                )
                        )
                    );

                if (
                    !cancelled
                ) {
                    setInvoices(
                        invoicesWithPreviews
                    );
                }
            } catch (err) {
                if (
                    !cancelled
                ) {
                    setError(
                        err.message ||
                        'No se pudieron cargar las facturas'
                    );

                    setInvoices(
                        []
                    );
                }
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
    ]);

    const filteredInvoices =
        useMemo(() => {
            return invoices.filter(
                (
                    invoice
                ) => {
                    const matchesSearch =
                        invoiceMatchesSearch(
                            invoice,
                            searchTerm
                        );

                    const matchesType =
                        invoiceType ===
                        'all' ||
                        invoiceType ===
                        'invoices';

                    return (
                        matchesSearch &&
                        matchesType
                    );
                }
            );
        }, [
            invoices,
            invoiceType,
            searchTerm,
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
                gap-5
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-4
                    rounded-[24px]
                    border
                    border-stone-300/80
                    bg-white
                    p-4

                    sm:p-5

                    xl:flex-row
                    xl:items-center
                    xl:justify-between
                "
            >
                <div
                    className="
                        min-w-0
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <span
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-[#f1eee8]
                                text-stone-700
                            "
                        >
                            <ReceiptText
                                className="
                                    h-4
                                    w-4
                                "
                            />
                        </span>

                        <div>
                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-stone-900
                                "
                            >
                                {config.title}
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-stone-400
                                "
                            >
                                {filteredInvoices.length}{" "}
                                {filteredInvoices.length ===
                                1
                                    ? "documento"
                                    : "documentos"}{" "}
                                visibles
                            </p>
                        </div>
                    </div>
                </div>


                <div
                    className="
                        flex
                        flex-1
                        flex-col
                        gap-3

                        md:flex-row
                        md:flex-wrap

                        xl:max-w-[760px]
                        xl:justify-end
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
                            Todo el historial
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
                                    Año{" "}
                                    {year}
                                </option>
                            )
                        )}
                    </SelectFilter>

                    <SelectFilter
                        value={
                            invoiceType
                        }
                        onChange={
                            setInvoiceType
                        }
                        ariaLabel="Filtrar por tipo"
                        icon={
                            FileText
                        }
                    >
                        <option value="all">
                            Todos
                        </option>

                        <option value="invoices">
                            Facturas
                        </option>
                    </SelectFilter>
                </div>
            </div>


            {loading && (
                <div
                    className="
                        grid
                        gap-4
                    "
                >
                    {Array.from({
                        length: 3,
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
                                    h-56
                                    animate-pulse
                                    rounded-[26px]
                                    border
                                    border-stone-200
                                    bg-white/70

                                    sm:h-48
                                "
                            />
                        )
                    )}
                </div>
            )}


            {error && (
                <div
                    className="
                        border-l-2
                        border-red-400
                        bg-red-50
                        px-5
                        py-4
                        text-sm
                        leading-6
                        text-red-700
                    "
                >
                    {error}
                </div>
            )}


            {!loading &&
                !error &&
                filteredInvoices.length ===
                    0 && (
                    <div
                        className="
                            rounded-[26px]
                            border
                            border-dashed
                            border-stone-300
                            bg-white/60
                            px-6
                            py-14
                            text-center
                        "
                    >
                        <ReceiptText
                            className="
                                mx-auto
                                h-7
                                w-7
                                text-stone-300
                            "
                        />

                        <p
                            className="
                                mt-4
                                text-sm
                                font-medium
                                text-stone-800
                            "
                        >
                            {
                                config.emptyTitle
                            }
                        </p>

                        <p
                            className="
                                mx-auto
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-stone-500
                            "
                        >
                            {
                                config.emptyDescription
                            }
                        </p>
                    </div>
                )}


            {!loading &&
                !error &&
                filteredInvoices.length >
                    0 && (
                    <div
                        className="
                            grid
                            gap-4
                        "
                    >
                        {filteredInvoices.map(
                            (
                                invoice,
                                index
                            ) => (
                                <InvoiceCard
                                    key={getInvoiceKey(
                                        invoice
                                    )}
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
        </section>
    );
}
