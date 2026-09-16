import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
    CheckCircle2,
    ChevronDown,
    FileText,
    Filter,
    ImageOff,
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
        <label className="flex h-12 w-full items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-500 shadow-sm transition focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100 md:max-w-[305px]">
            <input
                type="search"
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                placeholder="Buscar"
                className="min-w-0 flex-1 bg-transparent text-stone-800 outline-none placeholder:text-stone-400"
            />

            <Search className="h-5 w-5 shrink-0 text-stone-700" />
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
        <label className="relative flex h-12 w-full items-center rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-700 shadow-sm transition focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100 md:max-w-[305px]">
            {Icon && (
                <Icon className="mr-3 h-4 w-4 shrink-0 text-stone-500" />
            )}

            <select
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                aria-label={
                    ariaLabel
                }
                className="w-full cursor-pointer appearance-none bg-transparent pr-8 font-medium outline-none"
            >
                {children}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-stone-700" />
        </label>
    );
}

function InvoiceProductPreview({
    images = [],
}) {
    if (!images.length) {
        return (
            <div className="flex h-[108px] w-[108px] items-center justify-center rounded-md border border-stone-200 bg-stone-50">
                <div className="flex flex-col items-center gap-1 text-stone-400">
                    <ImageOff className="h-7 w-7" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                        Sin imagen
                    </span>
                </div>
            </div>
        );
    }

    if (
        images.length === 1
    ) {
        return (
            <div className="h-[108px] w-[108px] overflow-hidden rounded-md border border-stone-200 bg-stone-50">
                <img
                    src={
                        images[0].src
                    }
                    alt={
                        images[0].alt
                    }
                    loading="lazy"
                    className="h-full w-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className="grid h-[108px] w-[108px] grid-cols-2 gap-1 rounded-md border border-stone-200 bg-stone-50 p-1">
            {images.map(
                (image) => (
                    <div
                        key={
                            image.src
                        }
                        className="overflow-hidden rounded bg-white"
                    >
                        <img
                            src={
                                image.src
                            }
                            alt={
                                image.alt
                            }
                            loading="lazy"
                            className="h-full w-full object-cover"
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
                y: 12,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                delay: index * 0.03,
                duration: 0.25,
            }}
            className="rounded-xl border border-stone-200 bg-white shadow-sm transition hover:border-stone-300 hover:shadow-md"
        >
            <div className="p-5 lg:px-6 lg:py-5">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-stone-900" />

                    <h3 className="text-lg font-bold tracking-tight text-stone-900">
                        {cardTitle}
                    </h3>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.8fr_1fr_230px] lg:items-start">
                    <div className="grid gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                                Nº de factura
                            </p>

                            <p className="mt-1 text-base font-semibold leading-6 text-stone-900">
                                {getInvoiceLabel(
                                    invoice
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                                Fecha factura
                            </p>

                            <p className="mt-1 text-sm font-medium leading-6 text-stone-700">
                                {formatDate(
                                    invoice.fecha
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                                Importe
                            </p>

                            <p className="mt-1 text-base font-bold leading-6 text-stone-900">
                                {formatCurrency(
                                    invoice.imptotal
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                                Año
                            </p>

                            <p className="mt-1 text-sm font-medium leading-6 text-stone-700">
                                {invoice.ejercicio ||
                                    '-'}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                                Referencia
                            </p>

                            <p className="mt-1 break-words text-sm font-medium leading-6 text-stone-800">
                                {invoice.referencia ||
                                    '-'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:min-w-[230px]">
                        <button
                            type="button"
                            onClick={
                                onViewInvoice
                            }
                            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-stone-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
                        >
                            <FileText className="h-4 w-4" />

                            Ver factura
                        </button>

                        <button
                            type="button"
                            onClick={
                                onViewOrders
                            }
                            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-200"
                        >
                            <ShoppingBag className="h-4 w-4" />

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
        <section className="grid gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
                    {
                        config.title
                    }
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                    {
                        config.description
                    }
                </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
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
                        Periodo: Todo el
                        historial
                    </option>

                    {availableYears.map(
                        (
                            year
                        ) => (
                            <option
                                key={
                                    year
                                }
                                value={
                                    year
                                }
                            >
                                Periodo:{' '}
                                {
                                    year
                                }
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
                >
                    <option value="all">
                        Todos
                    </option>

                    <option value="invoices">
                        Facturas
                    </option>
                </SelectFilter>
            </div>

            {loading && (
                <div className="grid gap-8 pt-6">
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
                                className="h-40 animate-pulse rounded-lg border border-stone-200 bg-stone-100"
                            />
                        )
                    )}
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            {!loading &&
                !error &&
                filteredInvoices.length ===
                0 && (
                    <div className="rounded-lg border border-dashed border-stone-300 bg-white px-5 py-12 text-center shadow-sm">
                        <p className="text-sm font-semibold text-stone-800">
                            {
                                config.emptyTitle
                            }
                        </p>

                        <p className="mt-2 text-sm text-stone-500">
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
                    <div className="grid gap-8">
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