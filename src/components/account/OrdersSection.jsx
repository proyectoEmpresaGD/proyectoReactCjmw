import {
    useEffect,
    useMemo,
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
    ChevronRight,
    Clock3,
    Filter,
    PackageCheck,
    Search,
} from 'lucide-react';

import {
    getOrders,
} from '../../services/clientAreaClient';

const ORDER_FILTERS = {
    all:
        'all',

    served:
        'served',

    pending:
        'pending',
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
            value || 0
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
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return String(
            value
        );
    }

    return new Intl.DateTimeFormat(
        'es-ES',
        {
            day:
                '2-digit',

            month:
                '2-digit',

            year:
                'numeric',
        }
    ).format(
        date
    );
}

function getOrderLabel(
    order
) {
    return (
        `${order.codserpedventa || ''}${order.npedventa || ''}` ||
        'Pedido'
    );
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

function orderMatchesSearch(
    order,
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

    const values = [
        order.ejercicio,
        order.canal,
        order.codserpedventa,
        order.npedventa,
        order.razclien,
        order.fecha,
        order.importe,
    ];

    return values
        .filter(Boolean)
        .some(
            (value) =>
                String(
                    value
                )
                    .toLowerCase()
                    .includes(
                        normalizedSearch
                    )
        );
}

function SearchInput({
    value,
    onChange,
}) {
    return (
        <label className="flex h-12 w-full items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-500 shadow-sm transition focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100 md:max-w-[305px]">
            <input
                type="search"
                value={
                    value
                }
                onChange={(
                    event
                ) =>
                    onChange(
                        event.target.value
                    )
                }
                placeholder="Buscar pedido"
                className="min-w-0 flex-1 bg-transparent text-stone-800 outline-none placeholder:text-stone-400"
            />

            <Search className="h-5 w-5 shrink-0 text-stone-700" />
        </label>
    );
}

function SelectFilter({
    value,
    onChange,
    children,
}) {
    return (
        <label className="relative flex h-12 w-full items-center rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-700 shadow-sm transition focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-100 md:max-w-[305px]">
            <Filter className="mr-3 h-4 w-4 shrink-0 text-stone-500" />

            <select
                value={
                    value
                }
                onChange={(
                    event
                ) =>
                    onChange(
                        event.target.value
                    )
                }
                aria-label="Filtrar por periodo"
                className="w-full cursor-pointer appearance-none bg-transparent pr-8 font-medium outline-none"
            >
                {children}
            </select>

            <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-stone-700" />
        </label>
    );
}

function StatusFilter({
    value,
    onChange,
}) {
    const filters = [
        {
            value:
                ORDER_FILTERS.all,

            label:
                'Todos',
        },

        {
            value:
                ORDER_FILTERS.served,

            label:
                'Pedidos servidos',
        },

        {
            value:
                ORDER_FILTERS.pending,

            label:
                'Pendientes de servir',
        },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map(
                (filter) => {
                    const active =
                        value ===
                        filter.value;

                    return (
                        <button
                            key={
                                filter.value
                            }
                            type="button"
                            onClick={() =>
                                onChange(
                                    filter.value
                                )
                            }
                            className={
                                active
                                    ? 'rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm'
                                    : 'rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-600 shadow-sm transition hover:bg-stone-50 hover:text-stone-900'
                            }
                        >
                            {
                                filter.label
                            }
                        </button>
                    );
                }
            )}
        </div>
    );
}

function OrderStatus({
    order,
}) {
    if (
        order.estado ===
        ORDER_FILTERS.served
    ) {
        return (
            <div>
                <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />

                    <span className="font-semibold">
                        Pedido servido
                    </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-stone-500">
                    El pedido tiene albarán asociado.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-2 text-amber-700">
                <Clock3 className="h-5 w-5" />

                <span className="font-semibold">
                    Pendiente de servir
                </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-stone-500">
                Todavía no tiene albarán asociado.
            </p>
        </div>
    );
}

function OrderCard({
    order,
    index,
    onView,
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
                delay:
                    index *
                    0.03,

                duration:
                    0.25,
            }}
            className="rounded-xl border border-stone-200 bg-white shadow-sm transition hover:border-stone-300 hover:shadow-md"
        >
            <div className="p-5 lg:px-6 lg:py-5">
                <div className="flex items-center gap-2">
                    {order.servido ? (
                        <PackageCheck className="h-5 w-5 shrink-0 text-stone-900" />
                    ) : (
                        <Clock3 className="h-5 w-5 shrink-0 text-stone-900" />
                    )}

                    <h3 className="text-lg font-bold tracking-tight text-stone-900">
                        {order.servido
                            ? 'Pedido servido'
                            : 'Pedido pendiente de servir'}
                    </h3>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.8fr_1fr_230px] lg:items-start">
                    <div className="grid gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                                Nº de pedido
                            </p>

                            <p className="mt-1 text-base font-semibold leading-6 text-stone-900">
                                {getOrderLabel(
                                    order
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                                Fecha pedido
                            </p>

                            <p className="mt-1 text-sm font-medium leading-6 text-stone-700">
                                {formatDate(
                                    order.fecha
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
                                    order.importe
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                                Año
                            </p>

                            <p className="mt-1 text-sm font-medium leading-6 text-stone-700">
                                {order.ejercicio ||
                                    '-'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                            Estado
                        </p>

                        <div className="mt-2">
                            <OrderStatus
                                order={
                                    order
                                }
                            />
                        </div>
                    </div>

                    <div className="lg:min-w-[230px]">
                        <button
                            type="button"
                            onClick={
                                onView
                            }
                            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-stone-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
                        >
                            Ver pedido

                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

export default function OrdersSection() {
    const navigate =
        useNavigate();

    const [
        orders,
        setOrders,
    ] = useState([]);

    const [
        ejercicio,
        setEjercicio,
    ] = useState('');

    const [
        statusFilter,
        setStatusFilter,
    ] = useState(
        ORDER_FILTERS.all
    );

    const [
        searchTerm,
        setSearchTerm,
    ] = useState('');

    const [
        loading,
        setLoading,
    ] = useState(
        true
    );

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

        async function loadYears() {
            try {
                const data =
                    await getOrders();

                if (
                    cancelled
                ) {
                    return;
                }

                const years =
                    new Set(
                        (
                            data.orders ??
                            []
                        )
                            .map(
                                (
                                    order
                                ) =>
                                    order.ejercicio
                            )
                            .filter(
                                Boolean
                            )
                    );

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

        loadYears();

        return () => {
            cancelled =
                true;
        };
    }, []);

    useEffect(() => {
        let cancelled =
            false;

        async function loadOrders() {
            try {
                setLoading(
                    true
                );

                setError('');

                const data =
                    await getOrders(
                        ejercicio ||
                        undefined
                    );

                if (
                    !cancelled
                ) {
                    setOrders(
                        data.orders ??
                        []
                    );
                }
            } catch (err) {
                if (
                    !cancelled
                ) {
                    setOrders(
                        []
                    );

                    setError(
                        err.message ||
                        'No se pudieron cargar los pedidos.'
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

        loadOrders();

        return () => {
            cancelled =
                true;
        };
    }, [
        ejercicio,
    ]);

    const filteredOrders =
        useMemo(() => {
            return orders.filter(
                (
                    order
                ) => {
                    const matchesSearch =
                        orderMatchesSearch(
                            order,
                            searchTerm
                        );

                    const matchesStatus =
                        statusFilter ===
                        ORDER_FILTERS.all ||
                        order.estado ===
                        statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            orders,
            searchTerm,
            statusFilter,
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

    return (
        <section className="grid gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">
                    Mis pedidos
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                    Consulta tus pedidos servidos y los que todavía están pendientes de servir.
                </p>
            </div>

            <StatusFilter
                value={
                    statusFilter
                }
                onChange={
                    setStatusFilter
                }
            />

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
                >
                    <option value="">
                        Periodo: Todo el historial
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
            </div>

            {loading && (
                <div className="grid gap-4 pt-4">
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
                                className="h-40 animate-pulse rounded-xl border border-stone-200 bg-stone-100"
                            />
                        )
                    )}
                </div>
            )}

            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {
                        error
                    }
                </div>
            )}

            {!loading &&
                !error &&
                !filteredOrders.length && (
                    <div className="rounded-lg border border-dashed border-stone-300 bg-white px-5 py-12 text-center shadow-sm">
                        <PackageCheck className="mx-auto h-8 w-8 text-stone-400" />

                        <p className="mt-4 text-sm font-semibold text-stone-800">
                            No hay pedidos con los filtros actuales.
                        </p>

                        <p className="mt-2 text-sm text-stone-500">
                            Prueba a cambiar el periodo, el estado o la búsqueda.
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                filteredOrders.length >
                0 && (
                    <div className="grid gap-4">
                        {filteredOrders.map(
                            (
                                order,
                                index
                            ) => (
                                <OrderCard
                                    key={getOrderKey(
                                        order
                                    )}
                                    order={
                                        order
                                    }
                                    index={
                                        index
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
    );
}