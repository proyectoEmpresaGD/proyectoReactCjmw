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
    ArrowUpRight,
    CheckCircle2,
    ChevronDown,
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
                placeholder="Buscar pedido"
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
            <Filter
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
                aria-label="Filtrar por periodo"
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


function StatusFilter({
    value,
    onChange,
}) {
    const filters = [
        {
            value:
                ORDER_FILTERS.all,
            label:
                "Todos",
        },
        {
            value:
                ORDER_FILTERS.served,
            label:
                "Servidos",
        },
        {
            value:
                ORDER_FILTERS.pending,
            label:
                "Pendientes",
        },
    ];


    return (
        <div
            className="
                flex
                flex-wrap
                gap-1
                rounded-full
                bg-[#f1eee8]
                p-1
            "
        >
            {filters.map(
                filter => {
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
                                    ? "rounded-full bg-stone-950 px-4 py-2 text-xs font-medium text-white"
                                    : "rounded-full px-4 py-2 text-xs font-medium text-stone-500 transition hover:text-stone-950"
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
    const served =
        order.estado ===
        ORDER_FILTERS.served;


    return (
        <span
            className={
                served
                    ? "inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                    : "inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700"
            }
        >
            {served ? (
                <CheckCircle2
                    className="
                        h-3.5
                        w-3.5
                    "
                />
            ) : (
                <Clock3
                    className="
                        h-3.5
                        w-3.5
                    "
                />
            )}

            {served
                ? "Pedido servido"
                : "Pendiente de servir"}
        </span>
    );
}


function OrderCard({
    order,
    index,
    onView,
}) {
    const served =
        order.estado ===
        ORDER_FILTERS.served;


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

                    sm:p-6

                    xl:grid-cols-[minmax(0,1fr)_180px]
                    xl:items-center
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
                            flex-wrap
                            items-center
                            gap-3
                        "
                    >
                        <OrderStatus
                            order={
                                order
                            }
                        />

                        <span
                            className="
                                text-xs
                                text-stone-400
                            "
                        >
                            Año{" "}
                            {order.ejercicio ||
                                "-"}
                        </span>
                    </div>

                    <div
                        className="
                            mt-4
                            grid
                            gap-5

                            md:grid-cols-[1.1fr_0.9fr_0.7fr]
                        "
                    >
                        <div>
                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-stone-400
                                "
                            >
                                Nº de pedido
                            </p>

                            <h3
                                className="
                                    mt-1
                                    text-xl
                                    font-light
                                    tracking-[-0.03em]
                                    text-stone-950
                                "
                            >
                                {getOrderLabel(
                                    order
                                )}
                            </h3>
                        </div>

                        <MetaItem
                            label="Fecha"
                            value={formatDate(
                                order.fecha
                            )}
                        />

                        <MetaItem
                            label="Estado"
                            value={
                                served
                                    ? "Servido"
                                    : "Pendiente"
                            }
                        />
                    </div>
                </div>


                <div
                    className="
                        border-t
                        border-stone-200
                        pt-4

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
                        Importe
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
                            order.importe
                        )}
                    </p>
                </div>
            </div>


            <div
                className="
                    flex
                    justify-end
                    border-t
                    border-stone-200
                    bg-[#fbfaf8]
                    px-5
                    py-4

                    sm:px-6
                "
            >
                <button
                    type="button"
                    onClick={
                        onView
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
                    Ver pedido

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
        <div>
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
                    text-sm
                    font-medium
                    leading-6
                    text-stone-700
                "
            >
                {value}
            </p>
        </div>
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
        <section
            className="
                grid
                gap-5
            "
        >
            <div
                className="
                    rounded-[24px]
                    border
                    border-stone-300/80
                    bg-white
                    p-4

                    sm:p-5
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        gap-4

                        xl:flex-row
                        xl:items-center
                        xl:justify-between
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-3
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
                            <PackageCheck
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
                                Pedidos
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-stone-400
                                "
                            >
                                {filteredOrders.length}{" "}
                                {filteredOrders.length ===
                                1
                                    ? "pedido visible"
                                    : "pedidos visibles"}
                            </p>
                        </div>
                    </div>

                    <StatusFilter
                        value={
                            statusFilter
                        }
                        onChange={
                            setStatusFilter
                        }
                    />
                </div>


                <div
                    className="
                        mt-4
                        flex
                        flex-col
                        gap-3
                        border-t
                        border-stone-200
                        pt-4

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
                                    h-44
                                    animate-pulse
                                    rounded-[26px]
                                    border
                                    border-stone-200
                                    bg-white/70
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
                !filteredOrders.length && (
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
                        <PackageCheck
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
                            No hay pedidos con los filtros actuales.
                        </p>

                        <p
                            className="
                                mt-2
                                text-sm
                                text-stone-500
                            "
                        >
                            Prueba a cambiar el periodo, el estado o la búsqueda.
                        </p>
                    </div>
                )}


            {!loading &&
                !error &&
                filteredOrders.length >
                    0 && (
                    <div
                        className="
                            grid
                            gap-4
                        "
                    >
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
