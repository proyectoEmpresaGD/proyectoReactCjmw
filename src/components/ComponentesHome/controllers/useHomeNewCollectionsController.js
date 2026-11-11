import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";


const PRODUCTS_LIMIT =
    4;


const normalizeString = (
    value
) =>
    String(
        value ?? ""
    ).trim();


const uniqueProducts = (
    products
) => {
    const seen =
        new Set();


    return products.filter(
        product => {
            if (
                !product?.nombre?.trim()
            ) {
                return false;
            }


            const key =
                String(
                    product.codprodu ??
                    product.id ??
                    `${product.nombre}-${product.tonalidad ?? ""}`
                );


            if (
                seen.has(
                    key
                )
            ) {
                return false;
            }


            seen.add(
                key
            );


            return true;
        }
    );
};


const buildAbsoluteImageUrl = (
    raw
) => {
    const source =
        normalizeString(
            raw
        );


    if (
        !source
    ) {
        return "/img/default.webp";
    }


    if (
        source.startsWith(
            "http://"
        ) ||
        source.startsWith(
            "https://"
        )
    ) {
        return source;
    }


    const baseUrl =
        import.meta.env
            .VITE_API_BASE_URL
            ?.trim();


    const origin =
        baseUrl ||
        window.location.origin;


    return `${origin}${source.startsWith("/") ? "" : "/"}${source}`;
};


const normalizeProduct = (
    product
) => ({
    ...product,

    image:
        buildAbsoluteImageUrl(
            product.imageBaja ||
            product.imagebaja ||
            product.imageAlta ||
            product.imagealta
        ),
});


const fetchCollectionProducts =
    async ({
        collectionName,
        signal,
    }) => {
        const baseUrl =
            import.meta.env
                .VITE_API_BASE_URL
                ?.trim();


        const url =
            new URL(
                "/api/products/byProductCollection",
                baseUrl ||
                window.location.origin
            );


        url.searchParams.set(
            "coleccion",
            collectionName
        );


        const response =
            await fetch(
                url.toString(),
                {
                    method:
                        "GET",

                    signal,
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
                data
            )
                ? data
                : Array.isArray(
                    data?.products
                )
                    ? data.products
                    : [];


        return uniqueProducts(
            products
        )
            .slice(
                0,
                PRODUCTS_LIMIT
            )
            .map(
                normalizeProduct
            );
    };


export default function useHomeNewCollectionsController(
    collections = []
) {
    const [
        activeIndex,
        setActiveIndex,
    ] = useState(
        0
    );


    const [
        products,
        setProducts,
    ] = useState(
        []
    );


    const [
        loadingProducts,
        setLoadingProducts,
    ] = useState(
        false
    );


    const productsCacheRef =
        useRef(
            new Map()
        );


    const activeCollection =
        collections[
        activeIndex
        ] ||
        null;


    const previousCollection =
        useCallback(
            () => {
                if (
                    collections.length <=
                    1
                ) {
                    return;
                }


                setActiveIndex(
                    currentIndex =>
                        currentIndex ===
                            0
                            ? collections.length -
                            1
                            : currentIndex -
                            1
                );
            },
            [
                collections.length,
            ]
        );


    const nextCollection =
        useCallback(
            () => {
                if (
                    collections.length <=
                    1
                ) {
                    return;
                }


                setActiveIndex(
                    currentIndex =>
                        currentIndex ===
                            collections.length -
                            1
                            ? 0
                            : currentIndex +
                            1
                );
            },
            [
                collections.length,
            ]
        );


    useEffect(
        () => {
            const collectionName =
                activeCollection?.name;


            if (
                !collectionName
            ) {
                setProducts(
                    []
                );

                return undefined;
            }


            const cacheKey =
                normalizeString(
                    collectionName
                ).toUpperCase();


            const cachedProducts =
                productsCacheRef.current.get(
                    cacheKey
                );


            if (
                cachedProducts
            ) {
                setProducts(
                    cachedProducts
                );

                setLoadingProducts(
                    false
                );

                return undefined;
            }


            const controller =
                new AbortController();


            const loadProducts =
                async () => {
                    setLoadingProducts(
                        true
                    );

                    setProducts(
                        []
                    );


                    try {
                        const nextProducts =
                            await fetchCollectionProducts({
                                collectionName,

                                signal:
                                    controller.signal,
                            });


                        if (
                            controller.signal.aborted
                        ) {
                            return;
                        }


                        productsCacheRef.current.set(
                            cacheKey,
                            nextProducts
                        );


                        setProducts(
                            nextProducts
                        );
                    } catch (
                    error
                    ) {
                        if (
                            error?.name !==
                            "AbortError"
                        ) {
                            console.error(
                                `Error cargando productos de ${collectionName}:`,
                                error
                            );


                            setProducts(
                                []
                            );
                        }
                    } finally {
                        if (
                            !controller.signal.aborted
                        ) {
                            setLoadingProducts(
                                false
                            );
                        }
                    }
                };


            loadProducts();


            return () => {
                controller.abort();
            };
        },
        [
            activeCollection?.name,
        ]
    );


    return {
        activeCollection,

        activeIndex,

        products,

        loadingProducts,

        previousCollection,

        nextCollection,
    };
}