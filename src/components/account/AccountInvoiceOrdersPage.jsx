import {
    useEffect,
    useState,
} from 'react';

import {
    Navigate,
    useNavigate,
    useParams,
} from 'react-router-dom';

import {
    ArrowLeft,
    ChevronRight,
    FileText,
    Package,
    Truck,
} from 'lucide-react';

import { Header } from '../../components/header';

import {
    getInvoiceOrders,
} from '../../services/clientAreaClient';

import {
    useAuth,
} from '../../context/AuthContext';

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

    return new Intl.DateTimeFormat(
        'es-ES',
        {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }
    ).format(date);
}

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

function getInvoiceLabel(
    invoice
) {
    if (!invoice) {
        return '';
    }

    return (
        invoice.sfactura ||
        `${invoice.codserfacventa || ''}${invoice.nfacventa || ''}`
    );
}

function getOrderLabel(
    order
) {
    return `${order.codserpedventa || ''}${order.npedventa || ''}`;
}

function getOrderKey(
    order
) {
    return [
        order.ejercicio,
        order.canal,
        order.codserpedventa,
        order.npedventa,
    ].join('-');
}

function getDeliveryNoteKey(
    deliveryNote
) {
    return [
        deliveryNote.codseralbventa,
        deliveryNote.nalbventa,
    ].join('-');
}

function InvoiceSummary({
    invoice,
}) {
    return (
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
                <div className="rounded-xl bg-stone-900 p-3 text-white">
                    <FileText className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-500">
                        Pedidos asociados a la factura
                    </p>

                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">
                        {getInvoiceLabel(
                            invoice
                        )}
                    </h1>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
                        <span>
                            Fecha:{' '}

                            <strong className="text-stone-900">
                                {formatDate(
                                    invoice?.fecha
                                )}
                            </strong>
                        </span>

                        <span>
                            Total:{' '}

                            <strong className="text-stone-900">
                                {formatCurrency(
                                    invoice?.imptotal
                                )}
                            </strong>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

function EmptyOrders() {
    return (
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <Package className="mx-auto h-10 w-10 text-stone-400" />

            <h2 className="mt-4 text-lg font-semibold text-stone-900">
                No hay pedidos asociados
            </h2>

            <p className="mt-2 text-sm text-stone-500">
                No se ha encontrado ningún pedido relacionado con los albaranes de esta factura.
            </p>
        </div>
    );
}

function DeliveryNoteBadge({
    deliveryNote,
}) {
    return (
        <div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700">
            <span className="font-semibold">
                {deliveryNote.codseralbventa}
                {deliveryNote.nalbventa}
            </span>

            {deliveryNote.fecha && (
                <span className="ml-2 text-stone-500">
                    {formatDate(
                        deliveryNote.fecha
                    )}
                </span>
            )}
        </div>
    );
}

function OrderCard({
    order,
    onView,
}) {
    const deliveryNotes =
        order.albaranes ?? [];

    return (
        <article className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-stone-300 hover:shadow-md">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-stone-100 p-3 text-stone-700">
                        <Package className="h-5 w-5" />
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                            Pedido
                        </p>

                        <h2 className="text-xl font-bold text-stone-900">
                            {getOrderLabel(
                                order
                            )}
                        </h2>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onView}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-stone-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
                >
                    Ver pedido

                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl bg-stone-50 px-4 py-3">
                    <p className="text-xs font-medium text-stone-400">
                        Ejercicio
                    </p>

                    <p className="mt-1 font-semibold text-stone-900">
                        {order.ejercicio ||
                            '-'}
                    </p>
                </div>

                <div className="rounded-xl bg-stone-50 px-4 py-3">
                    <p className="text-xs font-medium text-stone-400">
                        Serie
                    </p>

                    <p className="mt-1 font-semibold text-stone-900">
                        {order.codserpedventa ||
                            '-'}
                    </p>
                </div>

                <div className="rounded-xl bg-stone-50 px-4 py-3">
                    <p className="text-xs font-medium text-stone-400">
                        Nº pedido
                    </p>

                    <p className="mt-1 font-semibold text-stone-900">
                        {order.npedventa ||
                            '-'}
                    </p>
                </div>
            </div>

            {deliveryNotes.length >
                0 && (
                    <div className="mt-6 border-t border-stone-100 pt-5">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-700">
                            <Truck className="h-4 w-4" />

                            Albaranes asociados
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {deliveryNotes.map(
                                (
                                    deliveryNote
                                ) => (
                                    <DeliveryNoteBadge
                                        key={getDeliveryNoteKey(
                                            deliveryNote
                                        )}
                                        deliveryNote={
                                            deliveryNote
                                        }
                                    />
                                )
                            )}
                        </div>
                    </div>
                )}
        </article>
    );
}

export default function AccountInvoiceOrdersPage() {
    const navigate =
        useNavigate();

    const {
        ejercicio,
        codserfacventa,
        nfacventa,
    } = useParams();

    const {
        loading: authLoading,
        isAuthenticated,
    } = useAuth();

    const [
        invoice,
        setInvoice,
    ] = useState(null);

    const [
        orders,
        setOrders,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState('');

    useEffect(() => {
        let cancelled =
            false;

        async function loadOrders() {
            try {
                setLoading(true);
                setError('');

                const data =
                    await getInvoiceOrders({
                        ejercicio,
                        codserfacventa,
                        nfacventa,
                    });

                if (cancelled) {
                    return;
                }

                setInvoice(
                    data.invoice ??
                    null
                );

                setOrders(
                    data.orders ??
                    []
                );
            } catch (err) {
                if (cancelled) {
                    return;
                }

                setError(
                    err.message ||
                    'No se pudieron cargar los pedidos asociados'
                );

                setInvoice(null);

                setOrders([]);
            } finally {
                if (!cancelled) {
                    setLoading(
                        false
                    );
                }
            }
        }

        if (
            !authLoading &&
            isAuthenticated
        ) {
            loadOrders();
        }

        return () => {
            cancelled =
                true;
        };
    }, [
        authLoading,
        isAuthenticated,
        ejercicio,
        codserfacventa,
        nfacventa,
    ]);

    function handleViewOrder(
        order
    ) {
        navigate(
            `/account/orders/${encodeURIComponent(
                order.ejercicio
            )}/${encodeURIComponent(
                order.canal
            )}/${encodeURIComponent(
                order.codserpedventa
            )}/${encodeURIComponent(
                order.npedventa
            )}`
        );
    }

    function handleBack() {
        navigate(
            '/mis-facturas'
        );
    }

    if (
        !authLoading &&
        !isAuthenticated
    ) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 pt-[5%]">
            <Header />

            <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
                <button
                    type="button"
                    onClick={
                        handleBack
                    }
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
                >
                    <ArrowLeft className="h-4 w-4" />

                    Volver a mis facturas
                </button>

                {loading ||
                    authLoading ? (
                    <div className="grid gap-4">
                        <div className="h-32 animate-pulse rounded-2xl border border-stone-200 bg-stone-100" />

                        <div className="h-44 animate-pulse rounded-2xl border border-stone-200 bg-stone-100" />

                        <div className="h-44 animate-pulse rounded-2xl border border-stone-200 bg-stone-100" />
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                        {error}
                    </div>
                ) : (
                    <>
                        <InvoiceSummary
                            invoice={
                                invoice
                            }
                        />

                        <section className="mt-8">
                            {!orders.length ? (
                                <EmptyOrders />
                            ) : (
                                <div className="grid gap-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-stone-900">
                                            Pedidos
                                        </h2>

                                        <p className="mt-1 text-sm text-stone-500">
                                            {
                                                orders.length
                                            }{' '}
                                            {orders.length ===
                                                1
                                                ? 'pedido asociado'
                                                : 'pedidos asociados'}
                                        </p>
                                    </div>

                                    {orders.map(
                                        (
                                            order
                                        ) => (
                                            <OrderCard
                                                key={getOrderKey(
                                                    order
                                                )}
                                                order={
                                                    order
                                                }
                                                onView={() =>
                                                    handleViewOrder(
                                                        order
                                                    )
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}