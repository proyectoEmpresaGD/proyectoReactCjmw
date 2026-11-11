import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    motion,
} from "framer-motion";

import {
    BookOpen,
    Layers3,
    Search,
    LibraryBig,
    X,
} from "lucide-react";

import {
    getLibrary,
} from "../../services/clientAreaClient";

import {
    cdnUrl,
} from "../../Constants/cdn";


const LIBRARY_FILTERS = {
    all: "ALL",
    books: "LIBRO",
    hangers: "PERCHA",
};


const ITEMS_PER_PAGE = 20;


function getFilteredTotal({
    filter,
    response,
}) {
    if (
        response?.filteredTotal != null
    ) {
        return Number(
            response.filteredTotal
        ) || 0;
    }

    if (
        filter ===
        LIBRARY_FILTERS.books
    ) {
        return Number(
            response?.totalBooks
        ) || 0;
    }

    if (
        filter ===
        LIBRARY_FILTERS.hangers
    ) {
        return Number(
            response?.totalHangers
        ) || 0;
    }

    return Number(
        response?.total
    ) || 0;
}


export default function LibrarySection() {
    const [
        library,
        setLibrary,
    ] = useState([]);

    const [
        total,
        setTotal,
    ] = useState(0);

    const [
        filteredTotal,
        setFilteredTotal,
    ] = useState(0);

    const [
        totalBooks,
        setTotalBooks,
    ] = useState(0);

    const [
        totalHangers,
        setTotalHangers,
    ] = useState(0);

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
    ] = useState("");

    const [
        activeFilter,
        setActiveFilter,
    ] = useState(
        LIBRARY_FILTERS.all
    );

    const [
        search,
        setSearch,
    ] = useState("");

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

    const activeFilterRef =
        useRef(
            LIBRARY_FILTERS.all
        );


    /*
     * -------------------------------------------------------------------------
     * CAMBIO DE FILTRO
     * -------------------------------------------------------------------------
     *
     * Al cambiar Todos / Libros / Perchas:
     *
     * - actualizamos el filtro activo
     * - invalidamos cualquier loadMore anterior
     * - el useEffect inferior vuelve a consultar
     *   automáticamente desde offset 0
     */
    const handleFilterChange =
        useCallback(
            nextFilter => {
                if (
                    nextFilter ===
                    activeFilter
                ) {
                    return;
                }


                activeFilterRef.current =
                    nextFilter;

                loadingMoreRef.current =
                    false;

                setLoadingMore(
                    false
                );

                setActiveFilter(
                    nextFilter
                );
            },
            [
                activeFilter,
            ]
        );


    /*
     * -------------------------------------------------------------------------
     * CARGA INICIAL / CAMBIO DE FILTRO
     * -------------------------------------------------------------------------
     *
     * IMPORTANTE:
     *
     * activeFilter está en las dependencias.
     *
     * Por tanto:
     *
     * Todos
     *   -> GET ?limit=20&offset=0
     *
     * Libros
     *   -> GET ?tipo=LIBRO&limit=20&offset=0
     *
     * Perchas
     *   -> GET ?tipo=PERCHA&limit=20&offset=0
     */
    useEffect(() => {
        let mounted =
            true;


        const loadInitial =
            async () => {
                try {
                    setLoading(
                        true
                    );

                    setError("");

                    setLibrary([]);

                    setOffset(0);

                    setHasMore(
                        true
                    );

                    setFilteredTotal(
                        0
                    );

                    loadingMoreRef.current =
                        false;

                    setLoadingMore(
                        false
                    );


                    const requestedFilter =
                        activeFilter;


                    const response =
                        await getLibrary({
                            tipo:
                                requestedFilter ===
                                    LIBRARY_FILTERS.all
                                    ? undefined
                                    : requestedFilter,

                            limit:
                                ITEMS_PER_PAGE,

                            offset:
                                0,
                        });


                    if (
                        !mounted
                    ) {
                        return;
                    }


                    const initialItems =
                        Array.isArray(
                            response?.library
                        )
                            ? response.library
                            : [];


                    setLibrary(
                        initialItems
                    );


                    setTotal(
                        Number(
                            response?.total
                        ) || 0
                    );


                    setTotalBooks(
                        Number(
                            response?.totalBooks
                        ) || 0
                    );


                    setTotalHangers(
                        Number(
                            response?.totalHangers
                        ) || 0
                    );


                    setFilteredTotal(
                        getFilteredTotal({
                            filter:
                                requestedFilter,

                            response,
                        })
                    );


                    setHasMore(
                        response?.hasMore ===
                        true
                    );


                    const nextOffset =
                        Number(
                            response?.nextOffset
                        );


                    setOffset(
                        Number.isFinite(
                            nextOffset
                        )
                            ? nextOffset
                            : initialItems.length
                    );


                    console.log(
                        "[Biblioteca] carga inicial",
                        {
                            filter:
                                requestedFilter,

                            received:
                                initialItems.length,

                            total:
                                response?.total,

                            filteredTotal:
                                response?.filteredTotal,

                            totalBooks:
                                response?.totalBooks,

                            totalHangers:
                                response?.totalHangers,

                            hasMore:
                                response?.hasMore,

                            nextOffset:
                                response?.nextOffset,
                        }
                    );
                } catch (
                requestError
                ) {
                    if (
                        !mounted
                    ) {
                        return;
                    }


                    console.error(
                        "[Biblioteca] error carga inicial",
                        requestError
                    );


                    setError(
                        requestError?.message ||
                        "No se pudo cargar tu biblioteca."
                    );

                    setLibrary([]);

                    setFilteredTotal(
                        0
                    );

                    setHasMore(
                        false
                    );
                } finally {
                    if (
                        mounted
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            };


        /*
         * El ref debe coincidir siempre
         * con la pestaña actualmente activa.
         */
        activeFilterRef.current =
            activeFilter;


        loadInitial();


        return () => {
            mounted =
                false;
        };
    }, [
        activeFilter,
    ]);


    /*
     * -------------------------------------------------------------------------
     * SIGUIENTES 20
     * -------------------------------------------------------------------------
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


                const requestedFilter =
                    activeFilter;


                loadingMoreRef.current =
                    true;

                setLoadingMore(
                    true
                );


                try {
                    console.log(
                        "[Biblioteca] solicitando página",
                        {
                            filter:
                                requestedFilter,

                            limit:
                                ITEMS_PER_PAGE,

                            offset,
                        }
                    );


                    const response =
                        await getLibrary({
                            tipo:
                                requestedFilter ===
                                    LIBRARY_FILTERS.all
                                    ? undefined
                                    : requestedFilter,

                            limit:
                                ITEMS_PER_PAGE,

                            offset,
                        });


                    /*
                     * Si mientras esta petición estaba
                     * pendiente el usuario ha cambiado
                     * de pestaña, ignoramos la respuesta.
                     */
                    if (
                        activeFilterRef.current !==
                        requestedFilter
                    ) {
                        return;
                    }


                    const newItems =
                        Array.isArray(
                            response?.library
                        )
                            ? response.library
                            : [];


                    setLibrary(
                        previous => {
                            const products =
                                new Map();


                            previous.forEach(
                                item => {
                                    products.set(
                                        item.codprodu,
                                        item
                                    );
                                }
                            );


                            newItems.forEach(
                                item => {
                                    products.set(
                                        item.codprodu,
                                        item
                                    );
                                }
                            );


                            return [
                                ...products.values(),
                            ];
                        }
                    );


                    if (
                        response?.total != null
                    ) {
                        setTotal(
                            Number(
                                response.total
                            ) || 0
                        );
                    }


                    if (
                        response?.totalBooks != null
                    ) {
                        setTotalBooks(
                            Number(
                                response.totalBooks
                            ) || 0
                        );
                    }


                    if (
                        response?.totalHangers != null
                    ) {
                        setTotalHangers(
                            Number(
                                response.totalHangers
                            ) || 0
                        );
                    }


                    setFilteredTotal(
                        getFilteredTotal({
                            filter:
                                requestedFilter,

                            response,
                        })
                    );


                    const nextHasMore =
                        response?.hasMore ===
                        true &&
                        newItems.length >
                        0;


                    setHasMore(
                        nextHasMore
                    );


                    const nextOffset =
                        Number(
                            response?.nextOffset
                        );


                    setOffset(
                        Number.isFinite(
                            nextOffset
                        )
                            ? nextOffset
                            : (
                                offset +
                                newItems.length
                            )
                    );


                    console.log(
                        "[Biblioteca] página cargada",
                        {
                            filter:
                                requestedFilter,

                            received:
                                newItems.length,

                            filteredTotal:
                                response?.filteredTotal,

                            hasMore:
                                nextHasMore,

                            nextOffset:
                                response?.nextOffset,
                        }
                    );
                } catch (
                requestError
                ) {
                    /*
                     * Solo mostramos el error si
                     * seguimos en la misma pestaña.
                     */
                    if (
                        activeFilterRef.current ===
                        requestedFilter
                    ) {
                        console.error(
                            "[Biblioteca] error cargando más",
                            requestError
                        );


                        setError(
                            requestError?.message ||
                            "No se pudo cargar más contenido."
                        );
                    }
                } finally {
                    /*
                     * No importa si la pestaña cambió:
                     * liberamos el bloqueo.
                     */
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
                activeFilter,
            ]
        );


    /*
     * -------------------------------------------------------------------------
     * SCROLL INFINITO
     * -------------------------------------------------------------------------
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
            "scroll",
            handleScroll,
            {
                passive:
                    true,
            }
        );


        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, [
        loading,
        hasMore,
        loadMore,
    ]);


    /*
     * -------------------------------------------------------------------------
     * BÚSQUEDA VISUAL
     * -------------------------------------------------------------------------
     *
     * El tipo ya NO se filtra aquí.
     *
     * PostgreSQL ya devuelve:
     *
     * - Todos
     * - solo LIBRO
     * - solo PERCHA
     *
     * según activeFilter.
     */
    const visibleItems =
        useMemo(
            () => {
                const normalizedSearch =
                    normalizeText(
                        search
                    );


                if (
                    !normalizedSearch
                ) {
                    return library;
                }


                return library.filter(
                    item => {
                        const searchable =
                            normalizeText(
                                [
                                    item.codprodu,
                                    item.desprodu,
                                    item.codmarca,
                                ]
                                    .filter(
                                        Boolean
                                    )
                                    .join(" ")
                            );


                        return searchable.includes(
                            normalizedSearch
                        );
                    }
                );
            },
            [
                library,
                search,
            ]
        );


    if (
        loading
    ) {
        return (
            <LibraryLoading />
        );
    }


    if (
        error &&
        library.length ===
        0
    ) {
        return (
            <div
                className="
                    border-y
                    border-red-200
                    bg-red-50
                    px-5
                    py-6
                    text-sm
                    text-red-700
                "
            >
                {error}
            </div>
        );
    }


    return (
        <div
            className="
                space-y-10
            "
        >
            {/* RESUMEN */}
            <section
                className="
                    grid
                    gap-px
                    overflow-hidden
                    border
                    border-stone-200
                    bg-stone-200

                    md:grid-cols-3
                "
            >
                <LibrarySummary
                    label="Total biblioteca"
                    value={
                        total
                    }
                    icon={
                        LibraryBig
                    }
                />

                <LibrarySummary
                    label="Libros"
                    value={
                        totalBooks
                    }
                    icon={
                        BookOpen
                    }
                />

                <LibrarySummary
                    label="Perchas"
                    value={
                        totalHangers
                    }
                    icon={
                        Layers3
                    }
                />
            </section>


            {/* CABECERA */}
            <section>
                <div
                    className="
                        flex
                        flex-col
                        gap-6
                        border-b
                        border-stone-200
                        pb-5

                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    "
                >
                    <div>
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.22em]
                                text-stone-400
                            "
                        >
                            Biblioteca profesional
                        </p>

                        <h2
                            className="
                                mt-2
                                text-2xl
                                font-light
                                tracking-[-0.035em]
                                text-stone-950

                                sm:text-3xl
                            "
                        >
                            Tus libros y perchas
                        </h2>


                        <p
                            className="
                                mt-2
                                text-xs
                                text-stone-400
                            "
                        >
                            {library.length}
                            {" de "}
                            {filteredTotal}
                            {" artículos cargados"}
                        </p>
                    </div>


                    <div
                        className="
                            relative
                            w-full

                            lg:max-w-sm
                        "
                    >
                        <Search
                            className="
                                absolute
                                left-0
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-stone-400
                            "
                        />

                        <input
                            type="search"
                            value={
                                search
                            }
                            onChange={(
                                event
                            ) =>
                                setSearch(
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="Buscar en mi biblioteca"
                            className="
                                w-full
                                border-b
                                border-stone-300
                                bg-transparent
                                py-3
                                pl-7
                                pr-8
                                text-sm
                                text-stone-950
                                outline-none
                                transition

                                placeholder:text-stone-400

                                focus:border-stone-950
                            "
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                aria-label="Limpiar búsqueda"
                                className="
                                    absolute
                                    right-0
                                    top-1/2
                                    flex
                                    h-7
                                    w-7
                                    -translate-y-1/2
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-stone-400
                                    transition

                                    hover:bg-stone-100
                                    hover:text-stone-950
                                "
                            >
                                <X
                                    className="
                                        h-3.5
                                        w-3.5
                                    "
                                />
                            </button>
                        )}
                    </div>
                </div>


                {/* FILTROS */}
                <div
                    className="
                        flex
                        gap-7
                        overflow-x-auto
                        border-b
                        border-stone-200
                    "
                >
                    <FilterButton
                        active={
                            activeFilter ===
                            LIBRARY_FILTERS.all
                        }
                        onClick={() =>
                            handleFilterChange(
                                LIBRARY_FILTERS.all
                            )
                        }
                    >
                        Todos{" "}

                        <span
                            className="
                                text-stone-400
                            "
                        >
                            {total}
                        </span>
                    </FilterButton>


                    <FilterButton
                        active={
                            activeFilter ===
                            LIBRARY_FILTERS.books
                        }
                        onClick={() =>
                            handleFilterChange(
                                LIBRARY_FILTERS.books
                            )
                        }
                    >
                        Libros{" "}

                        <span
                            className="
                                text-stone-400
                            "
                        >
                            {totalBooks}
                        </span>
                    </FilterButton>


                    <FilterButton
                        active={
                            activeFilter ===
                            LIBRARY_FILTERS.hangers
                        }
                        onClick={() =>
                            handleFilterChange(
                                LIBRARY_FILTERS.hangers
                            )
                        }
                    >
                        Perchas{" "}

                        <span
                            className="
                                text-stone-400
                            "
                        >
                            {totalHangers}
                        </span>
                    </FilterButton>
                </div>
            </section>


            {/* RESULTADOS */}
            {visibleItems.length >
                0 ? (
                <motion.div
                    layout
                    className="
                        grid
                        gap-x-6
                        gap-y-10

                        sm:grid-cols-2

                        lg:grid-cols-3

                        xl:grid-cols-4
                    "
                >
                    {visibleItems.map(
                        (
                            item,
                            index
                        ) => (
                            <LibraryCard
                                key={
                                    item.codprodu
                                }
                                item={
                                    item
                                }
                                index={
                                    index
                                }
                            />
                        )
                    )}
                </motion.div>
            ) : (
                <EmptyLibrary
                    hasItems={
                        filteredTotal >
                        0
                    }
                />
            )}


            {error &&
                library.length >
                0 && (
                    <div
                        className="
                            border-y
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                            text-center
                            text-xs
                            text-red-700
                        "
                    >
                        {error}
                    </div>
                )}


            {/* SCROLL INFINITO */}
            <div
                className="
                    flex
                    min-h-24
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

                        Cargando otros 20...
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
                    !hasMore &&
                    library.length >
                    0 && (
                        <p
                            className="
                                text-xs
                                text-stone-400
                            "
                        >
                            Has llegado al final de tu biblioteca
                        </p>
                    )}
            </div>
        </div>
    );
}


function LibrarySummary({
    label,
    value,
    icon: Icon,
}) {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                bg-white
                px-6
                py-6

                lg:px-8
            "
        >
            <div>
                <p
                    className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-stone-400
                    "
                >
                    {label}
                </p>

                <p
                    className="
                        mt-2
                        text-3xl
                        font-light
                        tracking-[-0.04em]
                        text-stone-950
                    "
                >
                    {value}
                </p>
            </div>


            <div
                className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-stone-100
                    text-stone-500
                "
            >
                <Icon
                    className="
                        h-5
                        w-5
                    "
                />
            </div>
        </div>
    );
}


function FilterButton({
    active,
    onClick,
    children,
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className={`
                relative
                shrink-0
                py-4
                text-sm
                font-medium
                transition

                after:absolute
                after:bottom-0
                after:left-0
                after:h-px
                after:w-full
                after:bg-stone-950
                after:transition-transform

                ${active
                    ? `
                            text-stone-950
                            after:scale-x-100
                        `
                    : `
                            text-stone-400
                            after:scale-x-0

                            hover:text-stone-950
                        `
                }
            `}
        >
            {children}
        </button>
    );
}


function LibraryCard({
    item,
    index,
}) {
    const isBook =
        item.tipo ===
        LIBRARY_FILTERS.books;


    const Icon =
        isBook
            ? BookOpen
            : Layers3;


    const imageUrl =
        resolveLibraryImage(
            item.imagen
        );


    return (
        <motion.article
            layout
            initial={{
                opacity: 0,
                y: 12,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration:
                    0.35,

                delay:
                    Math.min(
                        index,
                        8
                    ) *
                    0.035,
            }}
            className="
                group
                min-w-0
            "
        >
            <div
                className="
                    relative
                    aspect-[4/3]
                    overflow-hidden
                    bg-stone-200
                "
            >
                {imageUrl ? (
                    <img
                        src={
                            imageUrl
                        }
                        alt={
                            item.desprodu ||
                            item.codprodu
                        }
                        loading="lazy"
                        className="
                            h-full
                            w-full
                            object-cover
                            transition-transform
                            duration-700

                            group-hover:scale-[1.025]
                        "
                    />
                ) : (
                    <div
                        className="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                            bg-stone-100
                            text-stone-300
                        "
                    >
                        <Icon
                            className="
                                h-12
                                w-12
                                stroke-[1.2]
                            "
                        />
                    </div>
                )}


                <div
                    className="
                        absolute
                        left-3
                        top-3
                        bg-white/90
                        px-3
                        py-1.5
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-stone-700
                        backdrop-blur-md
                    "
                >
                    {isBook
                        ? "Libro"
                        : "Percha"}
                </div>
            </div>


            <div
                className="
                    border-b
                    border-stone-200
                    pb-5
                    pt-4
                "
            >
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-5
                    "
                >
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
                            {item.codmarca ||
                                "CJM Group"}
                        </p>

                        <h3
                            className="
                                mt-1.5
                                line-clamp-2
                                text-base
                                font-medium
                                leading-6
                                tracking-[-0.015em]
                                text-stone-950
                            "
                        >
                            {cleanProductName(
                                item.desprodu
                            )}
                        </h3>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-stone-400
                            "
                        >
                            {
                                item.codprodu
                            }
                        </p>
                    </div>


                    <div
                        className="
                            shrink-0
                            text-right
                        "
                    >
                        <p
                            className="
                                text-[10px]
                                uppercase
                                tracking-[0.14em]
                                text-stone-400
                            "
                        >
                            Cantidad
                        </p>

                        <p
                            className="
                                mt-1
                                text-lg
                                font-medium
                                text-stone-950
                            "
                        >
                            {formatQuantity(
                                item.cantidad_total
                            )}
                        </p>
                    </div>
                </div>


                <div
                    className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        gap-4
                        text-xs
                        text-stone-400
                    "
                >
                    <span>
                        Última adquisición
                    </span>

                    <span
                        className="
                            font-medium
                            text-stone-600
                        "
                    >
                        {formatDate(
                            item.ultima_fecha
                        )}
                    </span>
                </div>
            </div>
        </motion.article>
    );
}


function EmptyLibrary({
    hasItems,
}) {
    return (
        <div
            className="
                border-y
                border-stone-200
                py-16
                text-center
            "
        >
            <LibraryBig
                className="
                    mx-auto
                    h-8
                    w-8
                    text-stone-300
                "
            />

            <h3
                className="
                    mt-4
                    text-lg
                    font-medium
                    text-stone-900
                "
            >
                {hasItems
                    ? "No hay resultados"
                    : "No hay artículos en esta sección"}
            </h3>

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
                {hasItems
                    ? "Prueba con otro término de búsqueda."
                    : "Cuando existan artículos de este tipo aparecerán aquí."}
            </p>
        </div>
    );
}


function LibraryLoading() {
    return (
        <div
            className="
                grid
                gap-6

                sm:grid-cols-2

                lg:grid-cols-4
            "
        >
            {Array.from({
                length:
                    8,
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
                            animate-pulse
                        "
                    >
                        <div
                            className="
                                aspect-[4/3]
                                bg-stone-200
                            "
                        />

                        <div
                            className="
                                mt-4
                                h-3
                                w-16
                                bg-stone-200
                            "
                        />

                        <div
                            className="
                                mt-3
                                h-5
                                w-3/4
                                bg-stone-200
                            "
                        />
                    </div>
                )
            )}
        </div>
    );
}


function resolveLibraryImage(
    value
) {
    const image =
        String(
            value || ""
        ).trim();


    if (!image) {
        return null;
    }


    if (
        image.startsWith(
            "http://"
        ) ||
        image.startsWith(
            "https://"
        )
    ) {
        return image;
    }


    return cdnUrl(
        image
    );
}


function normalizeText(
    value
) {
    return String(
        value ?? ""
    )
        .normalize(
            "NFD"
        )
        .replace(
            /\p{Diacritic}/gu,
            ""
        )
        .toLowerCase()
        .trim();
}


function cleanProductName(
    value
) {
    return String(
        value || ""
    )
        .replace(
            /\s+/g,
            " "
        )
        .trim();
}


function formatQuantity(
    value
) {
    const number =
        Number(
            value
        );


    if (
        !Number.isFinite(
            number
        )
    ) {
        return "0";
    }


    return new Intl
        .NumberFormat(
            "es-ES",
            {
                maximumFractionDigits:
                    2,
            }
        )
        .format(
            number
        );
}


function formatDate(
    value
) {
    if (!value) {
        return "—";
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
        return "—";
    }


    return new Intl
        .DateTimeFormat(
            "es-ES",
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric",
            }
        )
        .format(
            date
        );
}