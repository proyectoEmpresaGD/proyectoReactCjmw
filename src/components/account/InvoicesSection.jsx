import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    ChevronDown,
    Eye,
    Filter,
    ImageOff,
    ReceiptText,
    Search,
} from 'lucide-react';
import {
    getInvoiceDetail,
    getInvoices,
} from '../../services/clientAreaClient';

const MAX_PREVIEW_IMAGES = 4;

const SECTION_CONFIG = {
    orders: {
        title: 'Pedidos, devoluciones y facturas',
        description:
            'Consulta tus pedidos disponibles y accede al detalle de cada documento.',
        emptyTitle: 'No hay pedidos disponibles con los filtros actuales.',
        emptyDescription: 'Prueba a cambiar el periodo o el texto de búsqueda.',
        cardTitle: 'Pedido disponible',
    },
    returns: {
        title: 'Historial devoluciones',
        description:
            'Aquí aparecen las devoluciones detectadas por facturas cuyo código de serie tiene dos letras.',
        emptyTitle: 'No hay devoluciones disponibles con los filtros actuales.',
        emptyDescription: 'Cuando existan devoluciones, aparecerán aquí.',
        cardTitle: 'Devolución disponible',
    },
};

function formatCurrency(value) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(value || 0));
}

function formatDate(value) {
    if (!value) return '-';

    return new Date(value).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function getInvoiceKey(invoice) {
    return [
        invoice.ejercicio,
        invoice.codserfacventa,
        invoice.nfacventa,
    ].join('-');
}

function getInvoiceLabel(invoice) {
    return (
        invoice.sfactura ||
        `${invoice.codserfacventa || ''}${invoice.nfacventa || ''}` ||
        'Factura'
    );
}

function getInvoiceDetailPath(invoice) {
    return `/account/invoices/${encodeURIComponent(
        invoice.ejercicio
    )}/${encodeURIComponent(invoice.codserfacventa)}/${encodeURIComponent(
        invoice.nfacventa
    )}`;
}

function getInvoiceDetailParams(invoice) {
    return {
        ejercicio: invoice.ejercicio,
        codserfacventa: invoice.codserfacventa,
        nfacventa: invoice.nfacventa,
    };
}

function isReturnInvoice(invoice) {
    return /^[A-Za-z]{2}$/.test(String(invoice.codserfacventa || '').trim());
}

function getInvoicePreviewImages(invoiceDetail) {
    const albaranes = invoiceDetail?.albaranes ?? [];
    const images = [];
    const usedImages = new Set();

    albaranes.forEach((albaran) => {
        const lineas = albaran.lineas ?? [];

        lineas.forEach((linea) => {
            if (!linea.imagenProducto || usedImages.has(linea.imagenProducto)) {
                return;
            }

            usedImages.add(linea.imagenProducto);

            images.push({
                src: linea.imagenProducto,
                alt:
                    linea.imagenDescripcion ||
                    linea.imagenNombre ||
                    linea.desprodu ||
                    linea.codprodu ||
                    'Producto',
            });
        });
    });

    return images.slice(0, MAX_PREVIEW_IMAGES);
}

function invoiceMatchesSearch(invoice, searchTerm) {
    if (!searchTerm.trim()) return true;

    const normalizedSearch = searchTerm.trim().toLowerCase();

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
        .some((field) => String(field).toLowerCase().includes(normalizedSearch));
}

async function loadInvoiceWithPreview(invoice) {
    try {
        const data = await getInvoiceDetail(getInvoiceDetailParams(invoice));
        const previewImages = getInvoicePreviewImages(data.invoice);

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

function SearchInput({ value, onChange }) {
    return (
        <label className="flex h-12 w-full items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-500 shadow-sm transition focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100 md:max-w-[305px]">
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Buscar"
                className="min-w-0 flex-1 bg-transparent text-stone-800 outline-none placeholder:text-stone-400"
            />

            <Search className="h-5 w-5 shrink-0 text-stone-700" />
        </label>
    );
}

function SelectFilter({ icon: Icon, value, onChange, children, ariaLabel }) {
    return (
        <label className="relative flex h-12 w-full items-center rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-700 shadow-sm transition focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100 md:max-w-[305px]">
            {Icon && <Icon className="mr-3 h-4 w-4 shrink-0 text-stone-500" />}

            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-label={ariaLabel}
                className="w-full cursor-pointer appearance-none bg-transparent pr-8 font-medium outline-none"
            >
                {children}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-stone-700" />
        </label>
    );
}

function InvoiceProductPreview({ images = [] }) {
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

    if (images.length === 1) {
        return (
            <div className="h-[108px] w-[108px] overflow-hidden rounded-md border border-stone-200 bg-stone-50">
                <img
                    src={images[0].src}
                    alt={images[0].alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className="grid h-[108px] w-[108px] grid-cols-2 gap-1 rounded-md border border-stone-200 bg-stone-50 p-1">
            {images.map((image) => (
                <div
                    key={image.src}
                    className="overflow-hidden rounded bg-white"
                >
                    <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
}

function InvoiceCard({ invoice, index, onOpen, cardTitle }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.25 }}
            className="rounded-lg border border-stone-200 bg-white shadow-sm transition hover:border-stone-300 hover:shadow-md"
        >
            <div className="grid gap-5 p-5 md:grid-cols-[1.3fr_128px_auto] md:items-center lg:grid-cols-[1.4fr_150px_auto] lg:px-6">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-stone-900" />

                        <h3 className="text-xl font-bold tracking-tight text-stone-900">
                            {cardTitle}
                        </h3>
                    </div>

                    <p className="mt-1 text-base text-stone-800">
                        El {formatDate(invoice.fecha)}
                    </p>

                    <div className="mt-5 space-y-1 text-sm">
                        <p className="text-stone-500">
                            Nº de factura:{' '}
                            <span className="font-medium text-stone-800">
                                {getInvoiceLabel(invoice)}
                            </span>
                        </p>

                        <p className="text-stone-500">
                            Serie:{' '}
                            <span className="font-medium text-stone-800">
                                {invoice.codserfacventa || '-'}
                            </span>
                        </p>

                        <p className="text-stone-500">
                            Total factura:{' '}
                            <span className="font-medium text-stone-800">
                                {formatCurrency(invoice.imptotal)}
                            </span>
                        </p>

                        <p className="text-stone-500">
                            Ejercicio:{' '}
                            <span className="font-medium text-stone-800">
                                {invoice.ejercicio || '-'}
                            </span>
                        </p>

                        {invoice.referencia && (
                            <p className="text-stone-500">
                                Referencia:{' '}
                                <span className="font-medium text-stone-800">
                                    {invoice.referencia}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex md:justify-center">
                    <InvoiceProductPreview images={invoice.previewImages} />
                </div>

                <div className="flex md:justify-end">
                    <button
                        type="button"
                        onClick={onOpen}
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-stone-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300 md:w-auto md:min-w-[230px]"
                    >
                        <Eye className="h-4 w-4" />
                        Ver detalle de la factura
                    </button>
                </div>
            </div>
        </motion.article>
    );
}

export default function InvoicesSection({ mode = 'orders' }) {
    const navigate = useNavigate();

    const config = SECTION_CONFIG[mode] ?? SECTION_CONFIG.orders;

    const [invoices, setInvoices] = useState([]);
    const [ejercicio, setEjercicio] = useState('');
    const [invoiceType, setInvoiceType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        let cancelled = false;

        async function loadInitialYears() {
            try {
                const data = await getInvoices();
                const allInvoices = data.invoices ?? [];
                const years = new Set(
                    allInvoices.map((invoice) => invoice.ejercicio).filter(Boolean)
                );

                if (!cancelled) {
                    setAvailableYears(Array.from(years).sort((a, b) => b - a));
                }
            } catch {
                if (!cancelled) {
                    setAvailableYears([]);
                }
            }
        }

        loadInitialYears();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function loadInvoices() {
            try {
                setLoading(true);
                setError('');

                const data = await getInvoices(ejercicio || undefined);
                const baseInvoices = data.invoices ?? [];

                const invoicesByMode = baseInvoices.filter((invoice) => {
                    const isReturn = isReturnInvoice(invoice);

                    if (mode === 'returns') {
                        return isReturn;
                    }

                    return !isReturn;
                });

                const invoicesWithPreviews = await Promise.all(
                    invoicesByMode.map((invoice) => loadInvoiceWithPreview(invoice))
                );

                if (!cancelled) {
                    setInvoices(invoicesWithPreviews);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'No se pudieron cargar las facturas');
                    setInvoices([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadInvoices();

        return () => {
            cancelled = true;
        };
    }, [ejercicio, mode]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter((invoice) => {
            const matchesSearch = invoiceMatchesSearch(invoice, searchTerm);
            const matchesType = invoiceType === 'all' || invoiceType === 'invoices';

            return matchesSearch && matchesType;
        });
    }, [invoices, invoiceType, searchTerm]);

    function handleOpenInvoice(invoice) {
        navigate(getInvoiceDetailPath(invoice));
    }

    return (
        <section className="grid gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
                    {config.title}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                    {config.description}
                </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
                <SearchInput value={searchTerm} onChange={setSearchTerm} />

                <SelectFilter
                    value={ejercicio}
                    onChange={setEjercicio}
                    ariaLabel="Filtrar por periodo"
                    icon={Filter}
                >
                    <option value="">Periodo: Todo el historial</option>

                    {availableYears.map((year) => (
                        <option key={year} value={year}>
                            Periodo: {year}
                        </option>
                    ))}
                </SelectFilter>

                <SelectFilter
                    value={invoiceType}
                    onChange={setInvoiceType}
                    ariaLabel="Filtrar por tipo"
                >
                    <option value="all">Todos</option>
                    <option value="invoices">Facturas</option>
                </SelectFilter>
            </div>

            {loading && (
                <div className="grid gap-8 pt-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-40 animate-pulse rounded-lg border border-stone-200 bg-stone-100"
                        />
                    ))}
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            {!loading && !error && filteredInvoices.length === 0 && (
                <div className="rounded-lg border border-dashed border-stone-300 bg-white px-5 py-12 text-center shadow-sm">
                    <p className="text-sm font-semibold text-stone-800">
                        {config.emptyTitle}
                    </p>

                    <p className="mt-2 text-sm text-stone-500">
                        {config.emptyDescription}
                    </p>
                </div>
            )}

            {!loading && !error && filteredInvoices.length > 0 && (
                <div className="grid gap-8">
                    {filteredInvoices.map((invoice, index) => (
                        <InvoiceCard
                            key={getInvoiceKey(invoice)}
                            invoice={invoice}
                            index={index}
                            cardTitle={config.cardTitle}
                            onOpen={() => handleOpenInvoice(invoice)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}