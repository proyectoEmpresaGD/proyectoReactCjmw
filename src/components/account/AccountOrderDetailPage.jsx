import {
    useEffect,
    useMemo,
    useState,
} from 'react';

import {
    ArrowLeft,
    Package,
} from 'lucide-react';

import {
    useNavigate,
    useParams,
} from 'react-router-dom';

import AccountLayout from './AccountLayout';

import {
    getOrderDetail,
} from '../../services/clientAreaClient';

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

function formatNumber(value) {
    return new Intl.NumberFormat(
        'es-ES',
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    ).format(
        Number(value || 0)
    );
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

function getOrderLabel(order) {
    if (!order) {
        return '';
    }

    return `${order.codserpedventa || ''}${order.npedventa || ''}`;
}

function OrderDetailContent() {
    const navigate =
        useNavigate();

    const {
        ejercicio,
        canal,
        codserpedventa,
        npedventa,
    } = useParams();

    const [
        order,
        setOrder,
    ] = useState(null);

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

        async function loadOrder() {
            try {
                setLoading(true);
                setError('');

                const data =
                    await getOrderDetail({
                        ejercicio,
                        canal,
                        codserpedventa,
                        npedventa,
                    });

                if (cancelled) {
                    return;
                }

                setOrder(
                    data.order ??
                    null
                );
            } catch (err) {
                if (cancelled) {
                    return;
                }

                setOrder(null);

                setError(
                    err.message ||
                    'No se pudo cargar el pedido.'
                );
            } finally {
                if (!cancelled) {
                    setLoading(
                        false
                    );
                }
            }
        }

        loadOrder();

        return () => {
            cancelled =
                true;
        };
    }, [
        ejercicio,
        canal,
        codserpedventa,
        npedventa,
    ]);

    const totals =
        useMemo(() => {
            const lines =
                order?.lineas ?? [];

            return {
                units:
                    lines.reduce(
                        (
                            total,
                            line
                        ) =>
                            total +
                            Number(
                                line.cantidad ||
                                0
                            ),
                        0
                    ),

                gross:
                    lines.reduce(
                        (
                            total,
                            line
                        ) =>
                            total +
                            Number(
                                line.impbruto ||
                                0
                            ),
                        0
                    ),

                total:
                    lines.reduce(
                        (
                            total,
                            line
                        ) =>
                            total +
                            Number(
                                line.importe ||
                                0
                            ),
                        0
                    ),
            };
        }, [
            order,
        ]);

    return (
        <div className="grid gap-6">
            <div>
                <button
                    type="button"
                    onClick={() =>
                        navigate(-1)
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50"
                >
                    <ArrowLeft className="h-4 w-4" />

                    Volver
                </button>
            </div>

            {loading && (
                <div className="grid gap-4">
                    <div className="h-32 animate-pulse rounded-2xl bg-stone-100" />

                    <div className="h-64 animate-pulse rounded-2xl bg-stone-100" />
                </div>
            )}

            {!loading &&
                error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                        {error}
                    </div>
                )}

            {!loading &&
                !error &&
                order && (
                    <>
                        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="rounded-xl bg-stone-900 p-3 text-white">
                                    <Package className="h-6 w-6" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-stone-500">
                                        Pedido
                                    </p>

                                    <h1 className="mt-1 text-3xl font-bold text-stone-900">
                                        {getOrderLabel(
                                            order
                                        )}
                                    </h1>

                                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
                                        <span>
                                            Fecha:{' '}

                                            <strong className="text-stone-900">
                                                {formatDate(
                                                    order.fecha
                                                )}
                                            </strong>
                                        </span>

                                        <span>
                                            Entrega prevista:{' '}

                                            <strong className="text-stone-900">
                                                {formatDate(
                                                    order.fecentre
                                                )}
                                            </strong>
                                        </span>

                                        <span>
                                            Cliente:{' '}

                                            <strong className="text-stone-900">
                                                {order.razclien ||
                                                    order.codclien}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                            <div className="border-b border-stone-200 px-6 py-5">
                                <h2 className="text-xl font-bold text-stone-900">
                                    Artículos del pedido
                                </h2>

                                <p className="mt-1 text-sm text-stone-500">
                                    {order.lineas?.length ||
                                        0}{' '}
                                    líneas de pedido
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-stone-200">
                                    <thead className="bg-stone-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                                                Código
                                            </th>

                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                                                Descripción
                                            </th>

                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
                                                Cantidad
                                            </th>

                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
                                                Precio
                                            </th>

                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
                                                Dto.
                                            </th>

                                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
                                                Importe
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-stone-100">
                                        {(order.lineas ??
                                            []).map(
                                                (
                                                    line
                                                ) => (
                                                    <tr
                                                        key={
                                                            line.linea
                                                        }
                                                        className="hover:bg-stone-50"
                                                    >
                                                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-stone-900">
                                                            {line.codprodu ||
                                                                '-'}
                                                        </td>

                                                        <td className="min-w-[320px] px-4 py-4 text-sm text-stone-700">
                                                            {line.desprodu ||
                                                                '-'}
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-stone-700">
                                                            {formatNumber(
                                                                line.cantidad
                                                            )}
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-stone-700">
                                                            {formatCurrency(
                                                                line.precio
                                                            )}
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-stone-700">
                                                            {Number(
                                                                line.dt1 ||
                                                                0
                                                            )
                                                                ? `${formatNumber(
                                                                    line.dt1
                                                                )}%`
                                                                : '-'}
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-semibold text-stone-900">
                                                            {formatCurrency(
                                                                line.importe
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section className="grid gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                                <p className="text-sm text-stone-500">
                                    Cantidad total
                                </p>

                                <p className="mt-2 text-2xl font-bold text-stone-900">
                                    {formatNumber(
                                        totals.units
                                    )}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                                <p className="text-sm text-stone-500">
                                    Importe bruto
                                </p>

                                <p className="mt-2 text-2xl font-bold text-stone-900">
                                    {formatCurrency(
                                        totals.gross
                                    )}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-stone-900 bg-stone-900 p-5 text-white shadow-sm">
                                <p className="text-sm text-stone-300">
                                    Total pedido
                                </p>

                                <p className="mt-2 text-2xl font-bold">
                                    {formatCurrency(
                                        totals.total
                                    )}
                                </p>
                            </div>
                        </section>
                    </>
                )}
        </div>
    );
}

export default function AccountOrderDetailPage() {
    return (
        <AccountLayout
            title="Detalle del pedido"
            subtitle="Consulta todos los artículos incluidos en el pedido."
        >
            {() => (
                <OrderDetailContent />
            )}
        </AccountLayout>
    );
}