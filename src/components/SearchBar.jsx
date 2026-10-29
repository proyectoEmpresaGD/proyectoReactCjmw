import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import debounce from "lodash.debounce";

import {
    ArrowRight,
    Search,
    X,
} from "lucide-react";

import {
    useTranslation,
} from "react-i18next";

import {
    coleccionesPorMarca,
    defaultImageUrl,
    searchNewCollections,
    searchRecommendedCollections,
} from "../Constants/constants";

import {
    cdnUrl,
} from "../Constants/cdn";


const HISTORY_STORAGE_KEY =
    "searchHistoryV2";


const RECOMMENDED_PRODUCTS_CACHE_KEY =
    "searchRecommendedProductsV1";


const RECOMMENDED_PRODUCTS_CACHE_TTL =
    60 * 60 * 1000;


const RECOMMENDED_PRODUCTS_LIMIT =
    6;


const RECOMMENDED_PRODUCTS_FETCH_LIMIT =
    40;


const COLLECTION_BRANDS = {
    ARE: "Arena",
    HAR: "Harbour",
    CJM: "CJM",
    FLA: "Flamenco",
    BAS: "Bassari",
};


const collectionPreviewCache =
    new Map();

const fetchLowQualityImage = async (
    product,
    signal
) => {
    if (!product?.codprodu) {
        return {
            ...product,
            image:
                defaultImageUrl,
        };
    }

    try {
        const response =
            await fetch(
                `${import.meta.env
                    .VITE_API_BASE_URL
                }/api/images/${encodeURIComponent(
                    product.codprodu
                )}/PRODUCTO_BAJA`,
                {
                    signal,
                }
            );

        if (!response.ok) {
            return {
                ...product,
                image:
                    defaultImageUrl,
            };
        }

        const data =
            await response.json();

        if (!data?.ficadjunto) {
            return {
                ...product,
                image:
                    defaultImageUrl,
            };
        }

        return {
            codprodu:
                product.codprodu,

            nombre:
                product.nombre,

            coleccion:
                product.coleccion,

            tonalidad:
                product.tonalidad,

            codmarca:
                product.codmarca,

            image:
                cdnUrl(
                    data.ficadjunto
                ),
        };
    } catch (error) {
        if (
            error?.name ===
            "AbortError"
        ) {
            throw error;
        }

        return {
            ...product,
            image:
                defaultImageUrl,
        };
    }
};


const resultsVariants = {
    hidden: {
        opacity: 0,
        y: 12,
    },

    visible: {
        opacity: 1,
        y: 0,

        transition: {
            duration: 0.25,
        },
    },

    exit: {
        opacity: 0,
        y: 8,

        transition: {
            duration: 0.18,
        },
    },
};


const normalizeQuery = (
    value
) =>
    String(value || "")
        .trim()
        .replace(
            /\s+/g,
            " "
        );


const normalizeCollectionKey = (
    value
) =>
    String(value || "")
        .trim()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /&/g,
            "AND"
        )
        .replace(
            /[^A-Za-z0-9]/g,
            ""
        )
        .toUpperCase();


const resolveCollectionBrand = (
    collectionName
) => {
    const normalized =
        normalizeCollectionKey(
            collectionName
        );

    for (
        const [
            brandCode,
            collections,
        ] of Object.entries(
            coleccionesPorMarca
        )
    ) {
        const exists =
            collections.some(
                (
                    collection
                ) =>
                    normalizeCollectionKey(
                        collection
                    ) ===
                    normalized
            );

        if (exists) {
            return brandCode;
        }
    }

    return null;
};


const shuffleItems = (
    items
) => {
    const copy = [
        ...items,
    ];

    for (
        let index =
            copy.length - 1;
        index > 0;
        index -= 1
    ) {
        const randomIndex =
            Math.floor(
                Math.random() *
                (index + 1)
            );

        [
            copy[index],
            copy[randomIndex],
        ] = [
                copy[randomIndex],
                copy[index],
            ];
    }

    return copy;
};


const pickRandomCollections = (
    collections,
    count = 4
) => {
    if (
        !Array.isArray(
            collections
        ) ||
        collections.length === 0
    ) {
        return [];
    }

    return shuffleItems(
        collections
    ).slice(
        0,
        Math.min(
            count,
            collections.length
        )
    );
};


const getCollectionItemKey = (
    item
) =>
    `${item?.brand || ""}-${normalizeCollectionKey(
        item?.collection
    )}`;


const getRandomRecommendedCollections =
    () => {
        const newCollectionKeys =
            new Set(
                (
                    Array.isArray(
                        searchNewCollections
                    )
                        ? searchNewCollections
                        : []
                ).map(
                    getCollectionItemKey
                )
            );


        const available =
            (
                Array.isArray(
                    searchRecommendedCollections
                )
                    ? searchRecommendedCollections
                    : []
            ).filter(
                (
                    item
                ) =>
                    item?.collection &&
                    !newCollectionKeys.has(
                        getCollectionItemKey(
                            item
                        )
                    )
            );


        return pickRandomCollections(
            available,
            4
        );
    };


const getRecommendedProductsSignature =
    (
        collections
    ) =>
        collections
            .map(
                (
                    collection
                ) =>
                    normalizeCollectionKey(
                        collection
                    )
            )
            .sort()
            .join("|");


const highlight = (
    text,
    query
) => {
    if (!text) {
        return null;
    }

    const term =
        String(query || "")
            .trim();

    if (!term) {
        return text;
    }

    const index =
        String(text)
            .toUpperCase()
            .indexOf(
                term.toUpperCase()
            );

    if (index === -1) {
        return text;
    }

    return (
        <>
            {text.slice(
                0,
                index
            )}

            <mark
                className="
                    rounded-sm
                    bg-stone-200
                    text-inherit
                "
            >
                {text.slice(
                    index,
                    index +
                    term.length
                )}
            </mark>

            {text.slice(
                index +
                term.length
            )}
        </>
    );
};


const SearchBar = ({
    closeSearchBar,
}) => {
    const { t } =
        useTranslation(
            "search"
        );

    const navigate =
        useNavigate();


    const [
        query,
        setQuery,
    ] = useState("");


    const [
        productSuggestions,
        setProductSuggestions,
    ] = useState([]);


    const [
        collectionSuggestions,
        setCollectionSuggestions,
    ] = useState([]);


    const [
        recommendedCollections,
        setRecommendedCollections,
    ] = useState(
        getRandomRecommendedCollections
    );


    const [
        recommendedProducts,
        setRecommendedProducts,
    ] = useState([]);


    const [
        isLoadingRecommendedProducts,
        setIsLoadingRecommendedProducts,
    ] = useState(false);


    const [
        collectionImages,
        setCollectionImages,
    ] = useState({});


    const [
        activeIndex,
        setActiveIndex,
    ] = useState(-1);


    const [
        isLoading,
        setIsLoading,
    ] = useState(false);


    const [
        history,
        setHistory,
    ] = useState([]);


    const inputRef =
        useRef(null);

    const suggestionRefs =
        useRef([]);

    const controllerRef =
        useRef(null);


    const newCollections =
        useMemo(
            () =>
                (
                    Array.isArray(
                        searchNewCollections
                    )
                        ? searchNewCollections
                        : []
                ).filter(
                    (
                        item
                    ) =>
                        item?.brand &&
                        item?.collection
                ),
            []
        );


    const newCollectionNames =
        useMemo(
            () =>
                newCollections.map(
                    (
                        item
                    ) =>
                        item.collection
                ),
            [
                newCollections,
            ]
        );


    const showDiscovery =
        query.trim().length ===
        0;


    const showResults =
        query.trim().length >=
        3;


    /*
     * BLOQUEAMOS EL SCROLL DE LA WEB
     */
    useEffect(() => {
        const previousOverflow =
            document.body.style
                .overflow;

        document.body.style.overflow =
            "hidden";

        return () => {
            document.body.style.overflow =
                previousOverflow;
        };
    }, []);


    /*
     * HISTORIAL
     */
    useEffect(() => {
        const rawV2 =
            localStorage.getItem(
                HISTORY_STORAGE_KEY
            );

        if (rawV2) {
            try {
                const parsed =
                    JSON.parse(
                        rawV2
                    );

                if (
                    Array.isArray(
                        parsed
                    )
                ) {
                    setHistory(
                        parsed
                    );

                    return;
                }
            } catch {
                // Sin acción.
            }
        }


        const rawV1 =
            localStorage.getItem(
                "searchHistory"
            );

        if (!rawV1) {
            return;
        }


        try {
            const parsedV1 =
                JSON.parse(
                    rawV1
                );

            if (
                !Array.isArray(
                    parsedV1
                )
            ) {
                return;
            }


            const migrated =
                parsedV1.map(
                    (
                        label
                    ) => ({
                        type:
                            "text",

                        label:
                            String(
                                label
                            ),

                        query:
                            String(
                                label
                            ),
                    })
                );


            const limited =
                migrated.slice(
                    0,
                    5
                );


            setHistory(
                limited
            );


            localStorage.setItem(
                HISTORY_STORAGE_KEY,
                JSON.stringify(
                    limited
                )
            );
        } catch {
            // Sin acción.
        }
    }, []);


    const persistHistory = (
        list
    ) => {
        setHistory(
            list
        );

        localStorage.setItem(
            HISTORY_STORAGE_KEY,
            JSON.stringify(
                list
            )
        );
    };


    const addToHistory = (
        item
    ) => {
        const deduped = [
            item,

            ...history.filter(
                (
                    historyItem
                ) =>
                    historyItem.label !==
                    item.label
            ),
        ].slice(
            0,
            5
        );


        persistHistory(
            deduped
        );
    };


    /*
     * TELAS NUEVAS
     * CACHE DE 24 HORAS.
     */
    useEffect(() => {
        if (
            newCollectionNames.length ===
            0
        ) {
            setRecommendedProducts(
                []
            );

            return undefined;
        }


        const controller =
            new AbortController();


        const loadRecommendedProducts =
            async () => {
                const now =
                    Date.now();


                const signature =
                    getRecommendedProductsSignature(
                        newCollectionNames
                    );


                /*
                 * PRIMERO MIRAMOS CACHE.
                 */
                try {
                    const rawCache =
                        localStorage.getItem(
                            RECOMMENDED_PRODUCTS_CACHE_KEY
                        );


                    if (rawCache) {
                        const cached =
                            JSON.parse(
                                rawCache
                            );


                        const validCache =
                            Array.isArray(
                                cached?.products
                            ) &&
                            cached.products
                                .length >
                            0 &&
                            Number(
                                cached?.expiresAt
                            ) >
                            now &&
                            cached?.signature ===
                            signature;


                        if (validCache) {
                            /*
                             * MOSTRAMOS LA CACHE INMEDIATAMENTE.
                             */
                            setRecommendedProducts(
                                cached.products
                            );


                            /*
                             * BUSCAMOS ÚNICAMENTE PRODUCTOS
                             * SIN IMAGEN O CON IMAGEN PREDETERMINADA.
                             */
                            const productsWithoutImage =
                                cached.products.filter(
                                    product =>
                                        !product?.image ||
                                        product.image ===
                                        defaultImageUrl
                                );


                            /*
                             * SI TODOS TIENEN IMAGEN REAL,
                             * NO HACEMOS NINGUNA PETICIÓN.
                             */
                            if (
                                productsWithoutImage.length ===
                                0
                            ) {
                                return;
                            }


                            /*
                             * REINTENTAMOS SOLO LAS IMÁGENES
                             * QUE FALTAN.
                             */
                            try {
                                const refreshedProducts =
                                    await Promise.all(
                                        productsWithoutImage.map(
                                            product =>
                                                fetchLowQualityImage(
                                                    product,
                                                    controller.signal
                                                )
                                        )
                                    );


                                if (
                                    controller.signal.aborted
                                ) {
                                    return;
                                }


                                /*
                                 * CREAMOS UN MAP POR CODPRODU
                                 * PARA REEMPLAZAR LOS PRODUCTOS
                                 * CUYA IMAGEN HEMOS REINTENTADO.
                                 */
                                const refreshedByCode =
                                    new Map(
                                        refreshedProducts.map(
                                            product => [
                                                product.codprodu,
                                                product,
                                            ]
                                        )
                                    );


                                const mergedProducts =
                                    cached.products.map(
                                        product =>
                                            refreshedByCode.has(
                                                product.codprodu
                                            )
                                                ? refreshedByCode.get(
                                                    product.codprodu
                                                )
                                                : product
                                    );


                                /*
                                 * ACTUALIZAMOS LA UI.
                                 */
                                setRecommendedProducts(
                                    mergedProducts
                                );


                                /*
                                 * ACTUALIZAMOS LA CACHE,
                                 * PERO MANTENEMOS SU CADUCIDAD
                                 * ORIGINAL.
                                 *
                                 * NO REINICIAMOS LA HORA.
                                 */
                                localStorage.setItem(
                                    RECOMMENDED_PRODUCTS_CACHE_KEY,
                                    JSON.stringify({
                                        ...cached,

                                        products:
                                            mergedProducts,
                                    })
                                );
                            } catch (
                            error
                            ) {
                                if (
                                    error?.name !==
                                    "AbortError"
                                ) {
                                    console.error(
                                        "Error reintentando imágenes de recomendaciones:",
                                        error
                                    );
                                }
                            }


                            return;
                        }


                        localStorage.removeItem(
                            RECOMMENDED_PRODUCTS_CACHE_KEY
                        );
                    }
                } catch {
                    localStorage.removeItem(
                        RECOMMENDED_PRODUCTS_CACHE_KEY
                    );
                }


                /*
                 * NO HAY CACHE VÁLIDA:
                 * CARGAMOS PRODUCTOS NUEVOS.
                 */
                setIsLoadingRecommendedProducts(
                    true
                );


                try {
                    const response =
                        await fetch(
                            `${import.meta
                                .env
                                .VITE_API_BASE_URL
                            }/api/products/filter?page=1&limit=${RECOMMENDED_PRODUCTS_FETCH_LIMIT}`,
                            {
                                method:
                                    "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",
                                },

                                signal:
                                    controller
                                        .signal,

                                body:
                                    JSON.stringify({
                                        collection:
                                            newCollectionNames,
                                    }),
                            }
                        );


                    if (
                        !response.ok
                    ) {
                        throw new Error(
                            `HTTP ${response.status}`
                        );
                    }


                    const data =
                        await response.json();


                    const products =
                        Array.isArray(
                            data?.products
                        )
                            ? data.products
                            : Array.isArray(
                                data
                            )
                                ? data
                                : [];


                    /*
                     * UNA REFERENCIA POR NOMBRE.
                     */
                    const uniqueProducts =
                        Array.from(
                            new Map(
                                products
                                    .filter(
                                        Boolean
                                    )
                                    .filter(
                                        (
                                            product
                                        ) =>
                                            product?.nombre
                                    )
                                    .map(
                                        (
                                            product
                                        ) => [
                                                String(
                                                    product.nombre
                                                )
                                                    .trim()
                                                    .toUpperCase(),

                                                product,
                                            ]
                                    )
                            ).values()
                        );


                    /*
                     * SELECCIÓN ALEATORIA.
                     */
                    const selectedBaseProducts =
                        shuffleItems(
                            uniqueProducts
                        ).slice(
                            0,
                            RECOMMENDED_PRODUCTS_LIMIT
                        );


                    /*
                     * PARA EL BUSCADOR SOLO QUEREMOS
                     * IMÁGENES PRODUCTO_BAJA.
                     */
                    const selected =
                        await Promise.all(
                            selectedBaseProducts.map(
                                product =>
                                    fetchLowQualityImage(
                                        product,
                                        controller.signal
                                    )
                            )
                        );


                    if (
                        controller.signal.aborted
                    ) {
                        return;
                    }


                    setRecommendedProducts(
                        selected
                    );


                    /*
                     * GUARDAMOS EN LOCALSTORAGE
                     * ÚNICAMENTE LOS PRODUCTOS YA
                     * PREPARADOS CON PRODUCTO_BAJA.
                     */
                    if (
                        selected.length > 0
                    ) {
                        localStorage.setItem(
                            RECOMMENDED_PRODUCTS_CACHE_KEY,
                            JSON.stringify({
                                products:
                                    selected,

                                createdAt:
                                    now,

                                expiresAt:
                                    now +
                                    RECOMMENDED_PRODUCTS_CACHE_TTL,

                                signature,
                            })
                        );
                    }
                } catch (
                error
                ) {
                    if (
                        error?.name !==
                        "AbortError"
                    ) {
                        console.error(
                            "Error cargando telas recomendadas:",
                            error
                        );
                    }
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setIsLoadingRecommendedProducts(
                            false
                        );
                    }
                }
            };


        loadRecommendedProducts();


        return () => {
            controller.abort();
        };
    }, [
        newCollectionNames,
    ]);


    /*
     * BÚSQUEDA RÁPIDA
     */
    const fetchAll =
        useCallback(
            async (
                searchValue
            ) => {
                const normalizedValue =
                    normalizeQuery(
                        searchValue
                    );


                if (
                    normalizedValue.length <
                    3
                ) {
                    controllerRef.current
                        ?.abort();


                    setProductSuggestions(
                        []
                    );

                    setCollectionSuggestions(
                        []
                    );

                    setIsLoading(
                        false
                    );

                    setActiveIndex(
                        -1
                    );

                    return;
                }


                controllerRef.current
                    ?.abort();


                const controller =
                    new AbortController();


                controllerRef.current =
                    controller;


                setIsLoading(
                    true
                );


                try {
                    const urlQuick =
                        `${import.meta
                            .env
                            .VITE_API_BASE_URL
                        }/api/products/search-quick` +
                        `?query=${encodeURIComponent(
                            normalizedValue
                        )}` +
                        `&prodLimit=20` +
                        `&colLimit=10`;


                    let response =
                        await fetch(
                            urlQuick,
                            {
                                signal:
                                    controller
                                        .signal,
                            }
                        );


                    /*
                     * FALLBACK.
                     */
                    if (
                        !response.ok
                    ) {
                        const legacyUrl =
                            `${import.meta
                                .env
                                .VITE_API_BASE_URL
                            }/api/products/search` +
                            `?query=${encodeURIComponent(
                                normalizedValue
                            )}` +
                            `&limit=20` +
                            `&page=1`;


                        response =
                            await fetch(
                                legacyUrl,
                                {
                                    signal:
                                        controller
                                            .signal,
                                }
                            );
                    }


                    let products =
                        [];

                    let collections =
                        [];


                    if (
                        response.ok
                    ) {
                        const data =
                            await response.json();


                        products =
                            Array.isArray(
                                data?.products
                            )
                                ? data.products
                                : [];


                        collections =
                            Array.isArray(
                                data?.collections
                            )
                                ? data.collections
                                : [];
                    }


                    const safeProducts =
                        products
                            .filter(
                                Boolean
                            )
                            .filter(
                                (
                                    product
                                ) =>
                                    product?.nombre ||
                                    product?.codprodu
                            )
                            .slice(
                                0,
                                20
                            );


                    const safeCollections =
                        collections
                            .filter(
                                Boolean
                            )
                            .map(
                                String
                            )
                            .slice(
                                0,
                                10
                            );


                    setProductSuggestions(
                        safeProducts
                    );


                    setCollectionSuggestions(
                        safeCollections
                    );


                    if (
                        safeCollections.length ===
                        0
                    ) {
                        setRecommendedCollections(
                            getRandomRecommendedCollections()
                        );
                    }


                    setActiveIndex(
                        -1
                    );
                } catch (
                error
                ) {
                    if (
                        error?.name !==
                        "AbortError"
                    ) {
                        console.error(
                            "Error en búsqueda rápida:",
                            error
                        );


                        setProductSuggestions(
                            []
                        );


                        setCollectionSuggestions(
                            []
                        );


                        setRecommendedCollections(
                            getRandomRecommendedCollections()
                        );
                    }
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setIsLoading(
                            false
                        );
                    }
                }
            },
            []
        );


    const debouncedFetch =
        useMemo(
            () =>
                debounce(
                    fetchAll,
                    250
                ),
            [
                fetchAll,
            ]
        );


    useEffect(() => {
        return () => {
            debouncedFetch.cancel();

            controllerRef.current
                ?.abort();
        };
    }, [
        debouncedFetch,
    ]);


    const handleChange = (
        event
    ) => {
        const value =
            event.target.value
                .toUpperCase();


        setQuery(
            value
        );


        debouncedFetch(
            value
        );
    };


    const clearSearch = () => {
        controllerRef.current
            ?.abort();


        debouncedFetch.cancel();


        setQuery(
            ""
        );


        setProductSuggestions(
            []
        );


        setCollectionSuggestions(
            []
        );


        setActiveIndex(
            -1
        );


        setIsLoading(
            false
        );


        inputRef.current
            ?.focus();
    };


    /*
     * COLECCIONES DE RESULTADOS
     */
    const visibleCollections =
        useMemo(() => {
            if (
                collectionSuggestions
                    .length >
                0
            ) {
                return collectionSuggestions
                    .map(
                        (
                            collection
                        ) => ({
                            collection,

                            brand:
                                resolveCollectionBrand(
                                    collection
                                ),
                        })
                    )
                    .filter(
                        (
                            item
                        ) =>
                            item.brand
                    );
            }


            return recommendedCollections;
        }, [
            collectionSuggestions,
            recommendedCollections,
        ]);


    const showingRecommendedCollections =
        collectionSuggestions.length ===
        0;


    /*
     * TODAS LAS COLECCIONES CUYAS
     * IMÁGENES NECESITAMOS.
     */
    const collectionsForImages =
        useMemo(() => {
            const combined = [
                ...newCollections,
                ...recommendedCollections,
                ...visibleCollections,
            ];


            return Array.from(
                new Map(
                    combined
                        .filter(
                            (
                                item
                            ) =>
                                item?.brand &&
                                item?.collection
                        )
                        .map(
                            (
                                item
                            ) => [
                                    getCollectionItemKey(
                                        item
                                    ),

                                    item,
                                ]
                        )
                ).values()
            );
        }, [
            newCollections,
            recommendedCollections,
            visibleCollections,
        ]);


    /*
     * IMÁGENES DE COLECCIONES
     */
    useEffect(() => {
        if (
            collectionsForImages.length ===
            0
        ) {
            setCollectionImages(
                {}
            );

            return undefined;
        }


        const controller =
            new AbortController();


        const loadCollectionImages =
            async () => {
                const brandCodes = [
                    ...new Set(
                        collectionsForImages
                            .map(
                                (
                                    item
                                ) =>
                                    item.brand
                            )
                            .filter(
                                Boolean
                            )
                    ),
                ];


                const previewsByBrand =
                    {};


                await Promise.all(
                    brandCodes.map(
                        async (
                            brandCode
                        ) => {
                            if (
                                collectionPreviewCache.has(
                                    brandCode
                                )
                            ) {
                                previewsByBrand[
                                    brandCode
                                ] =
                                    collectionPreviewCache.get(
                                        brandCode
                                    );

                                return;
                            }


                            try {
                                const response =
                                    await fetch(
                                        `${import.meta
                                            .env
                                            .VITE_API_BASE_URL
                                        }/api/collections/previews/${encodeURIComponent(
                                            brandCode
                                        )}`,
                                        {
                                            signal:
                                                controller
                                                    .signal,
                                        }
                                    );


                                if (
                                    !response.ok
                                ) {
                                    throw new Error(
                                        `HTTP ${response.status}`
                                    );
                                }


                                const data =
                                    await response.json();


                                const normalizedImages =
                                    {};


                                Object.entries(
                                    data?.collections ||
                                    {}
                                ).forEach(
                                    ([
                                        collectionName,
                                        imageUrl,
                                    ]) => {
                                        normalizedImages[
                                            normalizeCollectionKey(
                                                collectionName
                                            )
                                        ] =
                                            typeof imageUrl ===
                                                "string" &&
                                                imageUrl.trim()
                                                ? cdnUrl(
                                                    imageUrl.trim()
                                                )
                                                : null;
                                    }
                                );


                                collectionPreviewCache.set(
                                    brandCode,
                                    normalizedImages
                                );


                                previewsByBrand[
                                    brandCode
                                ] =
                                    normalizedImages;
                            } catch (
                            error
                            ) {
                                if (
                                    error?.name !==
                                    "AbortError"
                                ) {
                                    console.warn(
                                        `No se pudieron cargar las previews de ${brandCode}:`,
                                        error
                                    );
                                }
                            }
                        }
                    )
                );


                if (
                    controller.signal
                        .aborted
                ) {
                    return;
                }


                const nextImages =
                    {};


                collectionsForImages.forEach(
                    (
                        item
                    ) => {
                        const images =
                            previewsByBrand[
                            item.brand
                            ] ||
                            collectionPreviewCache.get(
                                item.brand
                            ) ||
                            {};


                        nextImages[
                            `${item.brand}-${item.collection}`
                        ] =
                            images[
                            normalizeCollectionKey(
                                item.collection
                            )
                            ] ||
                            null;
                    }
                );


                setCollectionImages(
                    nextImages
                );
            };


        loadCollectionImages();


        return () => {
            controller.abort();
        };
    }, [
        collectionsForImages,
    ]);


    /*
     * AUTOFOCUS
     */
    useEffect(() => {
        const timer =
            window.setTimeout(
                () => {
                    inputRef.current
                        ?.focus();
                },
                250
            );


        return () => {
            window.clearTimeout(
                timer
            );
        };
    }, []);


    /*
     * PRODUCTO
     */
    const selectProduct = (
        item
    ) => {
        const nombre =
            item?.nombre ||
            item?.codprodu ||
            "";


        const label =
            `${nombre} (` +
            `${item?.coleccion || t(
                "noCollection"
            )}, ` +
            `${item?.tonalidad || t(
                "noTone"
            )})`;


        addToHistory({
            type:
                "product",

            label,

            codprodu:
                item?.codprodu,
        });


        if (
            item?.codprodu
        ) {
            navigate(
                `/products?productId=${encodeURIComponent(
                    item.codprodu
                )}&page=1`
            );
        } else {
            navigate(
                `/products?search=${encodeURIComponent(
                    nombre
                )}&page=1`
            );
        }


        closeSearchBar?.();
    };


    /*
     * COLECCIÓN
     */
    const selectCollection = (
        collection
    ) => {
        const label =
            `${t(
                "collectionPrefix"
            )} ${collection}`;


        addToHistory({
            type:
                "collection",

            label,

            collection,
        });


        navigate(
            `/products?collection=${encodeURIComponent(
                collection
            )}&page=1`
        );


        closeSearchBar?.();
    };


    /*
     * VER TODOS
     */
    const submitSearch = (
        value
    ) => {
        const normalized =
            normalizeQuery(
                value
            );


        if (!normalized) {
            return;
        }


        const prefix =
            `${t(
                "collectionPrefix"
            )} `;


        if (
            normalized
                .toUpperCase()
                .startsWith(
                    prefix.toUpperCase()
                )
        ) {
            const collection =
                normalized
                    .slice(
                        prefix.length
                    )
                    .trim();


            addToHistory({
                type:
                    "collection",

                label:
                    normalized,

                collection,
            });


            navigate(
                `/products?collection=${encodeURIComponent(
                    collection
                )}&page=1`
            );
        } else {
            addToHistory({
                type:
                    "text",

                label:
                    normalized,

                query:
                    normalized,
            });


            navigate(
                `/products?search=${encodeURIComponent(
                    normalized
                )}&page=1`
            );
        }


        closeSearchBar?.();
    };


    /*
     * HISTORIAL
     */
    const handleHistoryClick = (
        item
    ) => {
        if (
            item.type ===
            "product" &&
            item.codprodu
        ) {
            navigate(
                `/products?productId=${encodeURIComponent(
                    item.codprodu
                )}&page=1`
            );
        } else if (
            item.type ===
            "collection" &&
            item.collection
        ) {
            navigate(
                `/products?collection=${encodeURIComponent(
                    item.collection
                )}&page=1`
            );
        } else {
            const value =
                item.query ||
                item.label ||
                "";


            navigate(
                `/products?search=${encodeURIComponent(
                    value
                )}&page=1`
            );
        }


        closeSearchBar?.();
    };


    const total =
        productSuggestions.length +
        collectionSuggestions.length;


    /*
     * TECLADO
     */
    const handleKeyDown = (
        event
    ) => {
        if (
            event.key ===
            "Escape"
        ) {
            event.preventDefault();

            closeSearchBar?.();

            return;
        }


        if (
            event.key ===
            "ArrowDown"
        ) {
            event.preventDefault();

            setActiveIndex(
                (
                    previous
                ) =>
                    Math.min(
                        previous +
                        1,
                        total - 1
                    )
            );

            return;
        }


        if (
            event.key ===
            "ArrowUp"
        ) {
            event.preventDefault();

            setActiveIndex(
                (
                    previous
                ) =>
                    Math.max(
                        previous -
                        1,
                        0
                    )
            );

            return;
        }


        if (
            event.key !==
            "Enter"
        ) {
            return;
        }


        event.preventDefault();


        if (
            activeIndex >= 0
        ) {
            if (
                activeIndex <
                productSuggestions.length
            ) {
                selectProduct(
                    productSuggestions[
                    activeIndex
                    ]
                );

                return;
            }


            const collectionIndex =
                activeIndex -
                productSuggestions.length;


            const collection =
                collectionSuggestions[
                collectionIndex
                ];


            if (collection) {
                selectCollection(
                    collection
                );
            }

            return;
        }


        submitSearch(
            query
        );
    };


    useEffect(() => {
        if (
            activeIndex < 0
        ) {
            return;
        }


        suggestionRefs.current[
            activeIndex
        ]?.scrollIntoView({
            behavior:
                "smooth",

            block:
                "nearest",
        });
    }, [
        activeIndex,
    ]);


    const activeId =
        activeIndex >= 0
            ? activeIndex <
                productSuggestions.length
                ? `opt-prod-${productSuggestions[
                    activeIndex
                ]?.codprodu ||
                activeIndex
                }`
                : `opt-col-${collectionSuggestions[
                activeIndex -
                productSuggestions.length
                ]
                }`
            : undefined;


    return (
        <motion.div
            initial={{
                y: "-100%",
                opacity: 0,
            }}
            animate={{
                y: 0,
                opacity: 1,
            }}
            exit={{
                y: "-100%",
                opacity: 0,
            }}
            transition={{
                duration: 0.45,

                ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                ],
            }}
            className="
                fixed
                bottom-0
                left-0
                right-0
                top-[72px]
                z-[90]
                flex
                flex-col
                overflow-hidden
                bg-[#faf9f7]

                sm:top-[80px]

                lg:top-[88px]
            "
        >
            {/* CABECERA */}
            <div
                className="
                    shrink-0
                    border-b
                    border-stone-200
                    bg-white
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        w-full
                        max-w-[1500px]
                        items-center
                        justify-between
                        gap-5
                        px-5
                        py-4

                        sm:px-8
                        sm:py-5

                        lg:px-10
                    "
                >
                    <div>
                        <p
                            className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.22em]
                                text-stone-400
                            "
                        >
                            {t(
                                "searchLabel",
                                "Búsqueda"
                            )}
                        </p>

                        <p
                            className="
                                mt-1
                                hidden
                                text-sm
                                text-stone-500

                                sm:block
                            "
                        >
                            {t(
                                "searchTitle",
                                "Encuentra lo que buscas"
                            )}
                        </p>
                    </div>


                    <button
                        type="button"
                        onClick={
                            closeSearchBar
                        }
                        aria-label={t(
                            "close",
                            "Cerrar buscador"
                        )}
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-stone-500
                            transition

                            hover:bg-stone-100
                            hover:text-stone-950

                            active:scale-95
                        "
                    >
                        <X
                            className="
                                h-5
                                w-5
                            "
                        />
                    </button>
                </div>
            </div>


            {/* CONTENIDO */}
            <div
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    overscroll-contain
                "
            >
                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[1500px]
                        px-5
                        pb-16
                        pt-6

                        sm:px-8
                        sm:pt-8

                        lg:px-10
                        lg:pb-20
                        lg:pt-10
                    "
                >
                    {/* INPUT */}
                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-4xl
                        "
                    >
                        <div
                            className="
                                group
                                flex
                                items-center
                                gap-3
                                border-b
                                border-stone-400
                                px-1
                                py-3
                                transition

                                focus-within:border-stone-950

                                sm:gap-4
                                sm:py-4
                            "
                        >
                            <Search
                                className="
                                    h-5
                                    w-5
                                    shrink-0
                                    text-stone-400

                                    sm:h-6
                                    sm:w-6
                                "
                            />


                            <input
                                ref={
                                    inputRef
                                }
                                type="text"
                                value={
                                    query
                                }
                                onChange={
                                    handleChange
                                }
                                onKeyDown={
                                    handleKeyDown
                                }
                                placeholder={t(
                                    "placeholder"
                                )}
                                role="combobox"
                                aria-expanded={
                                    showResults &&
                                    total >
                                    0
                                }
                                aria-controls="search-suggestions"
                                aria-activedescendant={
                                    activeId
                                }
                                aria-autocomplete="list"
                                className="
                                    min-w-0
                                    flex-1
                                    bg-transparent
                                    text-base
                                    text-stone-950
                                    outline-none

                                    placeholder:text-stone-400

                                    sm:text-xl

                                    lg:text-2xl
                                "
                            />


                            {query && (
                                <button
                                    type="button"
                                    onClick={
                                        clearSearch
                                    }
                                    aria-label={t(
                                        "clear",
                                        "Limpiar"
                                    )}
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-stone-400
                                        hover:bg-stone-100
                                        hover:text-stone-950
                                    "
                                >
                                    <X
                                        className="
                                            h-4
                                            w-4
                                        "
                                    />
                                </button>
                            )}
                        </div>


                        {query &&
                            query.length <
                            3 && (
                                <p
                                    className="
                                        mt-3
                                        text-xs
                                        text-stone-400
                                    "
                                >
                                    {t(
                                        "minChars"
                                    )}
                                </p>
                            )}
                    </div>


                    {/* DESCUBRIMIENTO */}
                    {showDiscovery && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 12,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.3,
                            }}
                            className="
                                mt-10

                                lg:mt-12
                            "
                        >
                            {/* TELAS NUEVAS */}
                            <section>
                                <div
                                    className="
                                        mb-5
                                    "
                                >
                                    <p
                                        className="
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.24em]
                                            text-stone-400
                                        "
                                    >
                                        {t(
                                            "newProductsLabel",
                                            "Novedades"
                                        )}
                                    </p>

                                    <h2
                                        className="
                                            mt-2
                                            text-xl
                                            font-medium
                                            tracking-[-0.02em]
                                            text-stone-950

                                            sm:text-2xl
                                        "
                                    >
                                        {t(
                                            "newProducts",
                                            "Telas nuevas"
                                        )}
                                    </h2>
                                </div>

                                {isLoadingRecommendedProducts ? (
                                    <div
                                        className="
                                            grid
                                            grid-cols-2
                                            gap-3

                                            sm:grid-cols-3

                                            lg:grid-cols-6
                                        "
                                    >
                                        {Array.from({
                                            length:
                                                RECOMMENDED_PRODUCTS_LIMIT,
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
                                                        aspect-[4/3]
                                                        animate-pulse
                                                        bg-stone-100
                                                    "
                                                />
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className="
                                            grid
                                            grid-cols-2
                                            gap-x-3
                                            gap-y-7

                                            sm:grid-cols-3
                                            sm:gap-x-5

                                            lg:grid-cols-6
                                        "
                                    >
                                        {recommendedProducts.map(
                                            (
                                                item,
                                                index
                                            ) => {
                                                const nombre =
                                                    item?.nombre ||
                                                    "";


                                                return (
                                                    <button
                                                        key={
                                                            item?.codprodu ||
                                                            `${nombre}-${index}`
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            selectProduct(
                                                                item
                                                            )
                                                        }
                                                        className="
                                                            group
                                                            min-w-0
                                                            text-left
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                aspect-[4/3]
                                                                overflow-hidden
                                                                bg-stone-100
                                                            "
                                                        >
                                                            <img
                                                                src={
                                                                    item?.image ||
                                                                    defaultImageUrl
                                                                }
                                                                alt={
                                                                    nombre
                                                                }
                                                                loading="lazy"
                                                                onError={(
                                                                    event
                                                                ) => {
                                                                    event.currentTarget.src =
                                                                        defaultImageUrl;
                                                                }}
                                                                className="
                                                                    h-full
                                                                    w-full
                                                                    object-cover
                                                                    transition-transform
                                                                    duration-700
                                                                    group-hover:scale-[1.035]
                                                                "
                                                            />
                                                        </div>

                                                        <p
                                                            className="
                                                                mt-3
                                                                truncate
                                                                text-sm
                                                                font-medium
                                                                text-stone-950
                                                            "
                                                        >
                                                            {
                                                                nombre
                                                            }
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                truncate
                                                                text-xs
                                                                text-stone-400
                                                            "
                                                        >
                                                            {
                                                                item?.coleccion
                                                            }
                                                        </p>
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </section>


                            {/* NUEVAS COLECCIONES */}
                            {newCollections.length >
                                0 && (
                                    <section
                                        className="
                                        mt-12
                                        border-t
                                        border-stone-200
                                        pt-8
                                        lg:mt-16
                                        lg:pt-10
                                    "
                                    >
                                        <div className="mb-5">
                                            <p
                                                className="
                                                text-[10px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.24em]
                                                text-stone-400
                                            "
                                            >
                                                {t(
                                                    "newCollectionsLabel",
                                                    "Novedades"
                                                )}
                                            </p>

                                            <h2
                                                className="
                                                mt-2
                                                text-xl
                                                font-medium
                                                tracking-[-0.02em]
                                                text-stone-950

                                                sm:text-2xl
                                            "
                                            >
                                                {t(
                                                    "newCollections",
                                                    "Nuevas colecciones"
                                                )}
                                            </h2>
                                        </div>


                                        <div
                                            className="
                                            grid
                                            grid-cols-2
                                            gap-3

                                            sm:grid-cols-3
                                            sm:gap-4

                                            lg:grid-cols-3
                                            lg:gap-5
                                        "
                                        >
                                            {newCollections.map(
                                                (
                                                    item
                                                ) => {
                                                    const image =
                                                        collectionImages[
                                                        `${item.brand}-${item.collection}`
                                                        ] ||
                                                        null;


                                                    return (
                                                        <button
                                                            key={`${item.brand}-${item.collection}`}
                                                            type="button"
                                                            onClick={() =>
                                                                selectCollection(
                                                                    item.collection
                                                                )
                                                            }
                                                            className="
                                                            group
                                                            min-w-0
                                                            text-left
                                                        "
                                                        >
                                                            <div
                                                                className="
                                                                relative
                                                                aspect-[16/10]
                                                                overflow-hidden
                                                                bg-stone-100
                                                            "
                                                            >
                                                                {image ? (
                                                                    <img
                                                                        src={
                                                                            image
                                                                        }
                                                                        alt={
                                                                            item.collection
                                                                        }
                                                                        loading="lazy"
                                                                        className="
                                                                        h-full
                                                                        w-full
                                                                        object-cover
                                                                        transition-transform
                                                                        duration-700
                                                                        group-hover:scale-105
                                                                    "
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="
                                                                        h-full
                                                                        w-full
                                                                        animate-pulse
                                                                        bg-stone-100
                                                                    "
                                                                    />
                                                                )}


                                                                <div
                                                                    className="
                                                                    absolute
                                                                    inset-0
                                                                    bg-gradient-to-t
                                                                    from-black/70
                                                                    via-black/5
                                                                    to-transparent
                                                                "
                                                                />


                                                                <div
                                                                    className="
                                                                    absolute
                                                                    left-3
                                                                    top-3
                                                                    rounded-full
                                                                    bg-white
                                                                    px-3
                                                                    py-1.5
                                                                    text-[9px]
                                                                    font-semibold
                                                                    uppercase
                                                                    tracking-[0.18em]
                                                                    text-stone-950
                                                                "
                                                                >
                                                                    {t(
                                                                        "new",
                                                                        "Nuevo"
                                                                    )}
                                                                </div>


                                                                <div
                                                                    className="
                                                                    absolute
                                                                    inset-x-0
                                                                    bottom-0
                                                                    p-4
                                                                "
                                                                >
                                                                    <p
                                                                        className="
                                                                        text-[9px]
                                                                        uppercase
                                                                        tracking-[0.18em]
                                                                        text-white/70
                                                                    "
                                                                    >
                                                                        {COLLECTION_BRANDS[
                                                                            item.brand
                                                                        ] ||
                                                                            item.brand}
                                                                    </p>

                                                                    <p
                                                                        className="
                                                                        mt-1
                                                                        text-base
                                                                        font-medium
                                                                        text-white
                                                                    "
                                                                    >
                                                                        {
                                                                            item.collection
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </section>
                                )}


                            {/* COLECCIONES RECOMENDADAS */}
                            {recommendedCollections.length >
                                0 && (
                                    <section
                                        className="
                                        mt-12
                                        border-t
                                        border-stone-200
                                        pt-8

                                        lg:mt-16
                                        lg:pt-10
                                    "
                                    >
                                        <div className="mb-5">
                                            <p
                                                className="
                                                text-[10px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.24em]
                                                text-stone-400
                                            "
                                            >
                                                {t(
                                                    "collectionsSection",
                                                    "Colecciones"
                                                )}
                                            </p>

                                            <h2
                                                className="
                                                mt-2
                                                text-xl
                                                font-medium
                                                tracking-[-0.02em]
                                                text-stone-950

                                                sm:text-2xl
                                            "
                                            >
                                                {t(
                                                    "recommendedCollections",
                                                    "Colecciones recomendadas"
                                                )}
                                            </h2>
                                        </div>


                                        <div
                                            className="
                                            grid
                                            grid-cols-2
                                            gap-3

                                            sm:grid-cols-3

                                            lg:grid-cols-4
                                            lg:gap-5
                                        "
                                        >
                                            {recommendedCollections.map(
                                                (
                                                    item
                                                ) => {
                                                    const image =
                                                        collectionImages[
                                                        `${item.brand}-${item.collection}`
                                                        ] ||
                                                        null;


                                                    return (
                                                        <button
                                                            key={`${item.brand}-${item.collection}`}
                                                            type="button"
                                                            onClick={() =>
                                                                selectCollection(
                                                                    item.collection
                                                                )
                                                            }
                                                            className="
                                                            group
                                                            min-w-0
                                                            text-left
                                                        "
                                                        >
                                                            <div
                                                                className="
                                                                relative
                                                                aspect-[16/10]
                                                                overflow-hidden
                                                                bg-stone-100
                                                            "
                                                            >
                                                                {image ? (
                                                                    <img
                                                                        src={
                                                                            image
                                                                        }
                                                                        alt={
                                                                            item.collection
                                                                        }
                                                                        loading="lazy"
                                                                        className="
                                                                        h-full
                                                                        w-full
                                                                        object-cover
                                                                        transition-transform
                                                                        duration-700
                                                                        group-hover:scale-105
                                                                    "
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        className="
                                                                        h-full
                                                                        w-full
                                                                        animate-pulse
                                                                        bg-stone-100
                                                                    "
                                                                    />
                                                                )}


                                                                <div
                                                                    className="
                                                                    absolute
                                                                    inset-0
                                                                    bg-gradient-to-t
                                                                    from-black/65
                                                                    via-black/5
                                                                    to-transparent
                                                                "
                                                                />


                                                                <div
                                                                    className="
                                                                    absolute
                                                                    inset-x-0
                                                                    bottom-0
                                                                    p-4
                                                                "
                                                                >
                                                                    <p
                                                                        className="
                                                                        text-[9px]
                                                                        uppercase
                                                                        tracking-[0.18em]
                                                                        text-white/70
                                                                    "
                                                                    >
                                                                        {COLLECTION_BRANDS[
                                                                            item.brand
                                                                        ] ||
                                                                            item.brand}
                                                                    </p>

                                                                    <p
                                                                        className="
                                                                        mt-1
                                                                        text-base
                                                                        font-medium
                                                                        text-white
                                                                    "
                                                                    >
                                                                        {
                                                                            item.collection
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </section>
                                )}


                            {/* HISTORIAL */}
                            {history.length >
                                0 && (
                                    <section
                                        className="
                                        mt-12
                                        border-t
                                        border-stone-200
                                        pt-8
                                    "
                                    >
                                        <p
                                            className="
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.22em]
                                            text-stone-400
                                        "
                                        >
                                            {t(
                                                "recent"
                                            )}
                                        </p>

                                        <div
                                            className="
                                            mt-4
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                        >
                                            {history.map(
                                                (
                                                    item,
                                                    index
                                                ) => (
                                                    <button
                                                        key={`${item.label}-${index}`}
                                                        type="button"
                                                        onClick={() =>
                                                            handleHistoryClick(
                                                                item
                                                            )
                                                        }
                                                        className="
                                                        rounded-full
                                                        border
                                                        border-stone-200
                                                        bg-white
                                                        px-4
                                                        py-2
                                                        text-sm
                                                        text-stone-600
                                                        transition

                                                        hover:border-stone-400
                                                        hover:text-stone-950
                                                    "
                                                    >
                                                        {
                                                            item.label
                                                        }
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </section>
                                )}
                        </motion.div>
                    )}


                    {/* RESULTADOS DE BÚSQUEDA */}
                    <AnimatePresence>
                        {showResults && (
                            <motion.div
                                id="search-suggestions"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={
                                    resultsVariants
                                }
                                className="
                                    mt-10

                                    lg:mt-12
                                "
                            >
                                {isLoading ? (
                                    <div
                                        className="
                                            flex
                                            min-h-[300px]
                                            items-center
                                            justify-center
                                            text-sm
                                            text-stone-400
                                        "
                                    >
                                        {t(
                                            "loading"
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* PRODUCTOS */}
                                        <section>
                                            <div
                                                className="
                                                    mb-5
                                                    flex
                                                    items-end
                                                    justify-between
                                                    gap-4
                                                "
                                            >
                                                <div>
                                                    <p
                                                        className="
                                                            text-[10px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-[0.24em]
                                                            text-stone-400
                                                        "
                                                    >
                                                        {t(
                                                            "productsSection",
                                                            "Productos"
                                                        )}
                                                    </p>

                                                    <h2
                                                        className="
                                                            mt-2
                                                            text-xl
                                                            font-medium
                                                            text-stone-950

                                                            sm:text-2xl
                                                        "
                                                    >
                                                        {t(
                                                            "resultsFor",
                                                            "Resultados para"
                                                        )}{" "}
                                                        “{query}”
                                                    </h2>
                                                </div>

                                                <span
                                                    className="
                                                        text-xs
                                                        text-stone-400
                                                    "
                                                >
                                                    {
                                                        productSuggestions.length
                                                    }
                                                </span>
                                            </div>


                                            {productSuggestions.length >
                                                0 ? (
                                                <div
                                                    className="
                                                        grid
                                                        grid-cols-2
                                                        gap-x-3
                                                        gap-y-7

                                                        sm:grid-cols-3
                                                        sm:gap-x-5

                                                        lg:grid-cols-4

                                                        xl:grid-cols-5
                                                    "
                                                >
                                                    {productSuggestions.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => {
                                                            const key =
                                                                item?.codprodu ||
                                                                `${item?.nombre}-${index}`;


                                                            const nombre =
                                                                item?.nombre ||
                                                                t(
                                                                    "noName",
                                                                    "SIN NOMBRE"
                                                                );


                                                            return (
                                                                <button
                                                                    id={`opt-prod-${key}`}
                                                                    key={
                                                                        key
                                                                    }
                                                                    ref={(
                                                                        element
                                                                    ) => {
                                                                        suggestionRefs.current[
                                                                            index
                                                                        ] =
                                                                            element;
                                                                    }}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        selectProduct(
                                                                            item
                                                                        )
                                                                    }
                                                                    onMouseEnter={() =>
                                                                        setActiveIndex(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="
                                                                        group
                                                                        min-w-0
                                                                        text-left
                                                                    "
                                                                >
                                                                    <div
                                                                        className="
                                                                            aspect-[4/3]
                                                                            overflow-hidden
                                                                            bg-stone-100
                                                                        "
                                                                    >
                                                                        <img
                                                                            src={
                                                                                item?.image ||
                                                                                defaultImageUrl
                                                                            }
                                                                            alt={
                                                                                nombre
                                                                            }
                                                                            loading="lazy"
                                                                            onError={(
                                                                                event
                                                                            ) => {
                                                                                event.currentTarget.src =
                                                                                    defaultImageUrl;
                                                                            }}
                                                                            className="
                                                                                h-full
                                                                                w-full
                                                                                object-cover
                                                                                transition-transform
                                                                                duration-700
                                                                                group-hover:scale-[1.035]
                                                                            "
                                                                        />
                                                                    </div>

                                                                    <p
                                                                        className="
                                                                            mt-3
                                                                            text-sm
                                                                            font-medium
                                                                            text-stone-950
                                                                        "
                                                                    >
                                                                        {highlight(
                                                                            nombre,
                                                                            query
                                                                        )}
                                                                    </p>

                                                                    <p
                                                                        className="
                                                                            mt-1
                                                                            truncate
                                                                            text-xs
                                                                            text-stone-500
                                                                        "
                                                                    >
                                                                        {
                                                                            item?.coleccion
                                                                        }
                                                                    </p>

                                                                    <p
                                                                        className="
                                                                            mt-0.5
                                                                            truncate
                                                                            text-[11px]
                                                                            text-stone-400
                                                                        "
                                                                    >
                                                                        {
                                                                            item?.tonalidad
                                                                        }
                                                                    </p>
                                                                </button>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            ) : (
                                                <div
                                                    className="
                                                        border-y
                                                        border-stone-200
                                                        py-10
                                                        text-center
                                                        text-sm
                                                        text-stone-400
                                                    "
                                                >
                                                    {t(
                                                        "noResults"
                                                    )}
                                                </div>
                                            )}


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    submitSearch(
                                                        query
                                                    )
                                                }
                                                className="
                                                    mt-8
                                                    flex
                                                    w-full
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    border
                                                    border-stone-300
                                                    px-5
                                                    py-3.5
                                                    text-sm
                                                    font-medium
                                                    text-stone-700
                                                    transition

                                                    hover:border-stone-950
                                                    hover:bg-white
                                                    hover:text-stone-950
                                                "
                                            >
                                                {t(
                                                    "seeAll"
                                                )}

                                                <ArrowRight
                                                    className="
                                                        h-4
                                                        w-4
                                                    "
                                                />
                                            </button>
                                        </section>


                                        {/* COLECCIONES RELACIONADAS / RECOMENDADAS */}
                                        {visibleCollections.length >
                                            0 && (
                                                <section
                                                    className="
                                                    mt-12
                                                    border-t
                                                    border-stone-200
                                                    pt-8

                                                    lg:mt-16
                                                "
                                                >
                                                    <p
                                                        className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.24em]
                                                        text-stone-400
                                                    "
                                                    >
                                                        {t(
                                                            "collectionsSection",
                                                            "Colecciones"
                                                        )}
                                                    </p>

                                                    <h2
                                                        className="
                                                        mb-5
                                                        mt-2
                                                        text-xl
                                                        font-medium
                                                        text-stone-950

                                                        sm:text-2xl
                                                    "
                                                    >
                                                        {showingRecommendedCollections
                                                            ? t(
                                                                "recommendedCollections",
                                                                "Colecciones recomendadas"
                                                            )
                                                            : t(
                                                                "relatedCollections",
                                                                "Colecciones relacionadas"
                                                            )}
                                                    </h2>


                                                    <div
                                                        className="
                                                        grid
                                                        grid-cols-2
                                                        gap-3

                                                        sm:grid-cols-3

                                                        lg:grid-cols-4
                                                        lg:gap-5
                                                    "
                                                    >
                                                        {visibleCollections.map(
                                                            (
                                                                item,
                                                                index
                                                            ) => {
                                                                const image =
                                                                    collectionImages[
                                                                    `${item.brand}-${item.collection}`
                                                                    ] ||
                                                                    null;


                                                                const collectionIndex =
                                                                    productSuggestions.length +
                                                                    index;


                                                                return (
                                                                    <button
                                                                        id={
                                                                            !showingRecommendedCollections
                                                                                ? `opt-col-${item.collection}`
                                                                                : undefined
                                                                        }
                                                                        key={`${item.brand}-${item.collection}`}
                                                                        ref={(
                                                                            element
                                                                        ) => {
                                                                            if (
                                                                                !showingRecommendedCollections
                                                                            ) {
                                                                                suggestionRefs.current[
                                                                                    collectionIndex
                                                                                ] =
                                                                                    element;
                                                                            }
                                                                        }}
                                                                        type="button"
                                                                        onClick={() =>
                                                                            selectCollection(
                                                                                item.collection
                                                                            )
                                                                        }
                                                                        onMouseEnter={() => {
                                                                            if (
                                                                                !showingRecommendedCollections
                                                                            ) {
                                                                                setActiveIndex(
                                                                                    collectionIndex
                                                                                );
                                                                            }
                                                                        }}
                                                                        className="
                                                                        group
                                                                        min-w-0
                                                                        text-left
                                                                    "
                                                                    >
                                                                        <div
                                                                            className="
                                                                            relative
                                                                            aspect-[16/10]
                                                                            overflow-hidden
                                                                            bg-stone-100
                                                                        "
                                                                        >
                                                                            {image ? (
                                                                                <img
                                                                                    src={
                                                                                        image
                                                                                    }
                                                                                    alt={
                                                                                        item.collection
                                                                                    }
                                                                                    loading="lazy"
                                                                                    className="
                                                                                    h-full
                                                                                    w-full
                                                                                    object-cover
                                                                                    transition-transform
                                                                                    duration-700
                                                                                    group-hover:scale-105
                                                                                "
                                                                                />
                                                                            ) : (
                                                                                <div
                                                                                    className="
                                                                                    h-full
                                                                                    w-full
                                                                                    animate-pulse
                                                                                    bg-stone-100
                                                                                "
                                                                                />
                                                                            )}

                                                                            <div
                                                                                className="
                                                                                absolute
                                                                                inset-0
                                                                                bg-gradient-to-t
                                                                                from-black/65
                                                                                via-black/5
                                                                                to-transparent
                                                                            "
                                                                            />

                                                                            <div
                                                                                className="
                                                                                absolute
                                                                                inset-x-0
                                                                                bottom-0
                                                                                p-4
                                                                            "
                                                                            >
                                                                                <p
                                                                                    className="
                                                                                    text-[9px]
                                                                                    uppercase
                                                                                    tracking-[0.18em]
                                                                                    text-white/70
                                                                                "
                                                                                >
                                                                                    {COLLECTION_BRANDS[
                                                                                        item.brand
                                                                                    ] ||
                                                                                        item.brand}
                                                                                </p>

                                                                                <p
                                                                                    className="
                                                                                    mt-1
                                                                                    text-base
                                                                                    font-medium
                                                                                    text-white
                                                                                "
                                                                                >
                                                                                    {
                                                                                        item.collection
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </section>
                                            )}
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};


export default SearchBar;