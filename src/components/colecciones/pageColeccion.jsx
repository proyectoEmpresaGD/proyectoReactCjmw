// src/components/colecciones/pageColeccion.jsx

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { CartProvider } from "../../components/CartContext";
import { Header } from "../../components/header";
import Footer from "../../components/footer";

import { useTranslation } from "react-i18next";
import { coleccionConfigByName } from "../../Constants/coleccionesHelpers";
import { coleccionesPorMarca } from "../../Constants/constants";
import { buildCollectionEditorial } from "../../utils/collectionEditorial";

import Modal from "../ComponentesProductos/modal";
import DragImagenesColeccion from "./DragImagenesColeccion";

function safeDecode(value) {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

const normalizeColeccionName = (name) =>
    String(name || "")
        .trim()
        .toUpperCase();

const normalizeString = (value) =>
    String(value ?? "").trim();

const resolveBrandFromCollection = (collectionName) => {
    const normalized =
        normalizeColeccionName(collectionName);

    for (const [brandCode, collections] of Object.entries(
        coleccionesPorMarca
    )) {
        const found = collections.some(
            (collection) =>
                normalizeColeccionName(collection) ===
                normalized
        );

        if (found) {
            return brandCode;
        }
    }

    return null;
};

const safeT = (t, key) => {
    const res = t(key, {
        defaultValue: "",
    });

    return typeof res === "string" &&
        res.trim()
        ? res
        : null;
};

const uniqueBy = (list, getKey) => {
    const seen = new Set();
    const result = [];

    for (const item of list) {
        const key = getKey(item);

        if (!key || seen.has(key)) {
            continue;
        }

        seen.add(key);
        result.push(item);
    }

    return result;
};

const buildAbsoluteImageUrl = (raw) => {
    const src =
        typeof raw === "string"
            ? raw.trim()
            : "";

    if (!src) {
        return "/img/default.webp";
    }

    if (
        src.startsWith("http://") ||
        src.startsWith("https://")
    ) {
        return src;
    }

    const base =
        import.meta.env.VITE_API_BASE_URL?.trim();

    const origin =
        base || window.location.origin;

    const prefix =
        src.startsWith("/")
            ? ""
            : "/";

    return `${origin}${prefix}${src}`;
};

async function fetchProductsByCollection({
    coleccion,
    signal,
}) {
    const base =
        import.meta.env.VITE_API_BASE_URL?.trim();

    const url = new URL(
        "/api/products/byProductCollection",
        base || window.location.origin
    );

    const normalizeProductName = (value) =>
        String(value || "")
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .toUpperCase();

    async function fetchProductLowImage(codprodu, signal) {
        if (!codprodu) {
            return null;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL
                }/api/images/${encodeURIComponent(
                    codprodu
                )}/PRODUCTO_BAJA`,
                {
                    signal,
                }
            );

            if (!response.ok) {
                return null;
            }

            const data = await response.json();

            if (!data?.ficadjunto) {
                return null;
            }

            return buildAbsoluteImageUrl(
                data.ficadjunto
            );
        } catch (error) {
            if (error?.name === "AbortError") {
                throw error;
            }

            return null;
        }
    }

    const loadColorImage = async (product) => {
        if (!product?.codprodu) {
            return {
                ...product,
                imageBaja: "/img/default.webp",
            };
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL
                }/api/images/${encodeURIComponent(
                    product.codprodu
                )}/PRODUCTO_BAJA`
            );

            if (!response.ok) {
                return {
                    ...product,
                    imageBaja: "/img/default.webp",
                };
            }

            const data =
                await response.json();

            if (!data?.ficadjunto) {
                return {
                    ...product,
                    imageBaja: "/img/default.webp",
                };
            }

            return {
                ...product,
                imageBaja:
                    buildAbsoluteImageUrl(
                        data.ficadjunto
                    ),
            };
        } catch {
            return {
                ...product,
                imageBaja: "/img/default.webp",
            };
        }
    };

    async function findAlternativeCollectionImage({
        product,
        signal,
    }) {
        const productName =
            normalizeString(
                product?.nombre
            );

        if (!productName) {
            return null;
        }

        try {
            const url = new URL(
                `${import.meta.env.VITE_API_BASE_URL
                }/api/products/search-products`
            );

            url.searchParams.set(
                "query",
                productName
            );

            url.searchParams.set(
                "limit",
                "50"
            );

            url.searchParams.set(
                "page",
                "1"
            );

            let response = await fetch(
                url.toString(),
                {
                    signal,
                }
            );

            // Compatibilidad con endpoint antiguo
            if (!response.ok) {
                const legacyUrl =
                    new URL(
                        `${import.meta.env.VITE_API_BASE_URL
                        }/api/products/search`
                    );

                legacyUrl.searchParams.set(
                    "query",
                    productName
                );

                legacyUrl.searchParams.set(
                    "limit",
                    "50"
                );

                legacyUrl.searchParams.set(
                    "page",
                    "1"
                );

                response = await fetch(
                    legacyUrl.toString(),
                    {
                        signal,
                    }
                );
            }

            if (!response.ok) {
                return null;
            }

            const data =
                await response.json();

            const candidates =
                Array.isArray(
                    data?.products
                )
                    ? data.products
                    : Array.isArray(data)
                        ? data
                        : [];

            const normalizedName =
                normalizeProductName(
                    productName
                );

            const sameProductCandidates =
                candidates.filter(
                    (candidate) =>
                        candidate?.codprodu &&
                        candidate.codprodu !==
                        product.codprodu &&
                        normalizeProductName(
                            candidate.nombre
                        ) ===
                        normalizedName
                );

            for (const candidate of sameProductCandidates) {
                const image =
                    await fetchProductLowImage(
                        candidate.codprodu,
                        signal
                    );

                if (image) {
                    return {
                        image,
                        sourceProduct:
                            candidate,
                    };
                }
            }

            return null;
        } catch (error) {
            if (
                error?.name ===
                "AbortError"
            ) {
                throw error;
            }

            console.error(
                `Error buscando imagen alternativa para ${productName}:`,
                error
            );

            return null;
        }
    }

    url.searchParams.set(
        "coleccion",
        normalizeString(coleccion)
    );


    const response = await fetch(
        url.toString(),
        {
            method: "GET",
            signal,
        }
    );

    if (!response.ok) {
        throw new Error(
            `HTTP ${response.status}`
        );
    }

    const data =
        await response.json();

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.products)) {
        return data.products;
    }

    return [];
}

/**
 * Querystring esperado:
 * - introTop
 * - introBottom
 * - introBrouchure
 * - brochureImage
 * - brochurePdf
 * - heroImage
 * - images (JSON array stringificado)
 */
function readFromSearch(search) {
    const sp =
        new URLSearchParams(search);

    const get = (key) =>
        sp.get(key) || null;

    const imagesRaw =
        get("images");

    let images = null;

    if (imagesRaw) {
        try {
            const parsed =
                JSON.parse(imagesRaw);

            images = Array.isArray(parsed)
                ? parsed.filter(Boolean)
                : [];
        } catch {
            images = [];
        }
    }

    return {
        introTop:
            get("introTop"),

        introBottom:
            get("introBottom"),

        introBrouchure:
            get("introBrouchure"),

        brochureImage:
            get("brochureImage"),

        brochurePdf:
            get("brochurePdf"),

        heroImage:
            get("heroImage"),

        images,
    };
}

/**
 * Fallback desde backend + common.json
 */
function buildColeccionFallbackFromCommon({
    collectionName,
    t,
    imagesFromBackend,
}) {
    const key =
        normalizeColeccionName(
            collectionName
        );

    const cfg =
        coleccionConfigByName?.[key] ||
        null;

    const imgs =
        Array.isArray(
            imagesFromBackend
        )
            ? imagesFromBackend
            : [];

    const heroImage =
        Number.isFinite(
            cfg?.heroIndex
        )
            ? imgs?.[
            cfg.heroIndex
            ] || null
            : imgs?.[0] || null;

    const brochureImage =
        Number.isFinite(
            cfg?.brochureImageIndex
        )
            ? imgs?.[
            cfg.brochureImageIndex
            ] || null
            : null;

    const textKey =
        cfg?.textKey;

    const introTop =
        textKey
            ? safeT(
                t,
                `Colecciones.${textKey}.introTop`
            )
            : null;

    const introBottom =
        textKey
            ? safeT(
                t,
                `Colecciones.${textKey}.introBottom`
            )
            : null;

    const introBrouchure =
        textKey
            ? safeT(
                t,
                `Colecciones.${textKey}.introBrouchure`
            )
            : null;

    return {
        introTop,
        introBottom,
        introBrouchure,
        heroImage,
        images: imgs,
        brochureImage,
        brochurePdf:
            cfg?.brochurePdf ||
            null,
    };
}

export default function ColeccionPage() {
    const {
        coleccion:
        coleccionParam,
    } = useParams();

    const location =
        useLocation();

    const navigate =
        useNavigate();

    const {
        t,
        i18n,
    } = useTranslation(
        "common"
    );

    const coleccion =
        useMemo(
            () =>
                safeDecode(
                    coleccionParam ||
                    ""
                ),
            [coleccionParam]
        );

    const queryContent =
        useMemo(
            () =>
                readFromSearch(
                    location.search
                ),
            [location.search]
        );

    const stateContent =
        useMemo(() => {
            const state =
                location.state;

            if (
                !state ||
                typeof state !==
                "object"
            ) {
                return {};
            }

            return {
                introTop:
                    typeof state.introTop ===
                        "string"
                        ? state.introTop
                        : null,

                introBottom:
                    typeof state.introBottom ===
                        "string"
                        ? state.introBottom
                        : null,

                introBrouchure:
                    typeof state.introBrouchure ===
                        "string"
                        ? state.introBrouchure
                        : null,

                brochureImage:
                    typeof state.brochureImage ===
                        "string"
                        ? state.brochureImage
                        : null,

                brochurePdf:
                    typeof state.brochurePdf ===
                        "string"
                        ? state.brochurePdf
                        : null,

                heroImage:
                    typeof state.heroImage ===
                        "string"
                        ? state.heroImage
                        : null,

                images:
                    Array.isArray(
                        state.images
                    )
                        ? state.images.filter(
                            Boolean
                        )
                        : null,
            };
        }, [location.state]);

    const cfg =
        useMemo(() => {
            const key =
                normalizeColeccionName(
                    coleccion
                );

            return (
                coleccionConfigByName?.[
                key
                ] || null
            );
        }, [coleccion]);

    const resolvedBrand =
        useMemo(() => {
            const brandFromQuery =
                new URLSearchParams(
                    location.search
                )
                    .get("brand")
                    ?.trim()
                    .toUpperCase();

            if (
                brandFromQuery &&
                coleccionesPorMarca[
                brandFromQuery
                ]
            ) {
                return brandFromQuery;
            }

            return (
                cfg?.marca ||
                resolveBrandFromCollection(
                    coleccion
                )
            );
        }, [
            cfg?.marca,
            coleccion,
            location.search,
        ]);

    // -----------------------------------------------------
    // IMÁGENES DE LA COLECCIÓN
    // -----------------------------------------------------

    const [
        backendImages,
        setBackendImages,
    ] = useState([]);

    const [
        loadingImages,
        setLoadingImages,
    ] = useState(false);

    useEffect(() => {
        const marca =
            resolvedBrand;

        const key =
            normalizeColeccionName(
                coleccion
            );

        if (!marca || !key) {
            setBackendImages([]);
            return;
        }

        const controller =
            new AbortController();

        setLoadingImages(
            true
        );

        const loadImages =
            async () => {
                try {
                    const url = `${import.meta.env
                        .VITE_API_BASE_URL
                        }/api/collections/brand/${encodeURIComponent(
                            marca
                        )}`;

                    const response =
                        await fetch(
                            url,
                            {
                                signal:
                                    controller.signal,
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

                    const list =
                        Array.isArray(
                            data
                                ?.collections?.[
                            key
                            ]
                        )
                            ? data.collections[
                                key
                            ].filter(
                                Boolean
                            )
                            : [];

                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setBackendImages(
                            list
                        );
                    }
                } catch (error) {
                    if (
                        error?.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "Error cargando imágenes colección:",
                        error
                    );

                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setBackendImages(
                            []
                        );
                    }
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setLoadingImages(
                            false
                        );
                    }
                }
            };

        loadImages();

        return () =>
            controller.abort();
    }, [
        resolvedBrand,
        coleccion,
    ]);

    const fallbackParams =
        useMemo(() => {
            if (!coleccion) {
                return null;
            }

            return buildColeccionFallbackFromCommon(
                {
                    collectionName:
                        coleccion,

                    t,

                    imagesFromBackend:
                        backendImages,
                }
            );
        }, [
            coleccion,
            t,
            backendImages,
        ]);

    const content =
        useMemo(
            () => ({
                introTop:
                    stateContent.introTop ??
                    queryContent.introTop ??
                    fallbackParams?.introTop ??
                    null,

                introBottom:
                    stateContent.introBottom ??
                    queryContent.introBottom ??
                    fallbackParams?.introBottom ??
                    null,

                introBrouchure:
                    stateContent.introBrouchure ??
                    queryContent.introBrouchure ??
                    fallbackParams?.introBrouchure ??
                    null,

                brochureImage:
                    stateContent.brochureImage ??
                    queryContent.brochureImage ??
                    fallbackParams?.brochureImage ??
                    null,

                brochurePdf:
                    stateContent.brochurePdf ??
                    queryContent.brochurePdf ??
                    fallbackParams?.brochurePdf ??
                    null,

                heroImage:
                    stateContent.heroImage ??
                    queryContent.heroImage ??
                    fallbackParams?.heroImage ??
                    null,

                images:
                    backendImages?.length
                        ? backendImages
                        : stateContent.images ??
                        queryContent.images ??
                        fallbackParams?.images ??
                        [],
            }),
            [
                stateContent,
                queryContent,
                fallbackParams,
                backendImages,
            ]
        );

    const heroImage =
        useMemo(() => {
            if (
                content.heroImage
            ) {
                return content.heroImage;
            }

            if (
                content.images
                    .length > 0
            ) {
                return content
                    .images[0];
            }

            return null;
        }, [
            content.heroImage,
            content.images,
        ]);

    const carouselImages =
        useMemo(() => {
            const list =
                content.images || [];

            if (!list.length) {
                return [];
            }

            if (
                heroImage &&
                list[0] ===
                heroImage
            ) {
                return list.slice(1);
            }

            return list;
        }, [
            content.images,
            heroImage,
        ]);

    // -----------------------------------------------------
    // PRODUCTOS DE LA COLECCIÓN
    // -----------------------------------------------------

    const [
        collectionProducts,
        setCollectionProducts,
    ] = useState([]);

    const [
        loadingProducts,
        setLoadingProducts,
    ] = useState(false);

    useEffect(() => {
        if (!coleccion) {
            setCollectionProducts(
                []
            );
            return;
        }

        const controller =
            new AbortController();

        setLoadingProducts(
            true
        );

        const loadProducts =
            async () => {
                try {
                    const products =
                        await fetchProductsByCollection(
                            {
                                coleccion,
                                signal:
                                    controller.signal,
                            }
                        );

                    const validProducts =
                        products.filter(
                            (product) =>
                                product
                                    ?.nombre
                                    ?.trim()
                        );

                    const uniqueProducts =
                        uniqueBy(
                            validProducts,
                            (
                                product
                            ) => {
                                const key =
                                    product?.codprodu ??
                                    product?.id ??
                                    `${normalizeString(
                                        product?.nombre
                                    )}::${normalizeString(
                                        product?.coleccion ||
                                        product?.collection
                                    )}`;

                                return String(
                                    key
                                );
                            }
                        );

                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setCollectionProducts(
                            uniqueProducts
                        );
                    }
                } catch (error) {
                    if (
                        error?.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "Error cargando productos de la colección:",
                        error
                    );

                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setCollectionProducts(
                            []
                        );
                    }
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setLoadingProducts(
                            false
                        );
                    }
                }
            };

        loadProducts();

        return () =>
            controller.abort();
    }, [coleccion]);

    // -----------------------------------------------------
    // TEXTO EDITORIAL
    // -----------------------------------------------------

    const editorial =
        useMemo(
            () =>
                buildCollectionEditorial(
                    {
                        collectionName:
                            coleccion,

                        brandCode:
                            resolvedBrand,

                        products:
                            collectionProducts,

                        language:
                            i18n.language?.split(
                                "-"
                            )[0] ||
                            "es",
                    }
                ),
            [
                coleccion,
                resolvedBrand,
                collectionProducts,
                i18n.language,
            ]
        );

    // -----------------------------------------------------
    // MODAL DE PRODUCTO
    // -----------------------------------------------------

    const [
        productoSeleccionado,
        setProductoSeleccionado,
    ] = useState(null);

    const [
        modalAbierta,
        setModalAbierta,
    ] = useState(false);

    const handleCloseModal =
        () => {
            setModalAbierta(
                false
            );

            setProductoSeleccionado(
                null
            );
        };

    const handleProductClick =
        (producto) => {
            if (!producto) {
                return;
            }

            setProductoSeleccionado(
                producto
            );

            setModalAbierta(
                true
            );
        };

    if (!coleccion) {
        return (
            <CartProvider>
                <Header />

                <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6">
                    <div className="max-w-xl text-center">
                        <h1 className="text-3xl font-semibold">
                            Colección no
                            encontrada
                        </h1>

                        <p className="mt-4 text-gray-600">
                            No se ha
                            podido resolver
                            el nombre de la
                            colección.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/"
                                )
                            }
                            className="mt-6 px-6 py-3 rounded-full border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
                        >
                            Volver al
                            inicio
                        </button>
                    </div>
                </main>

                <Footer />
            </CartProvider>
        );
    }

    return (
        <CartProvider>
            <Header />

            <main className="bg-white text-gray-900">
                {/* 0) LOADING IMÁGENES */}
                {loadingImages && (
                    <section className="pt-24 pb-0">
                        <div className="max-w-5xl mx-auto px-6">
                            <p className="text-sm text-gray-500">
                                Cargando
                                imágenes...
                            </p>
                        </div>
                    </section>
                )}

                {/* 1) NOMBRE + TEXTO */}
                <section className="pt-24 pb-10">
                    <div className="max-w-5xl mx-auto px-6">
                        <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                            Colección
                        </p>

                        <h1 className="mt-4 text-4xl md:text-6xl font-semibold leading-tight">
                            {coleccion}
                        </h1>

                        <p className="mt-6 max-w-full text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                            {content.introTop ||
                                editorial.introTop}
                        </p>
                    </div>
                </section>

                {/* 2) IMAGEN GRANDE + TEXTO */}
                <section className="pb-14">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="relative overflow-hidden rounded-[2.25rem] border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] bg-white">
                            <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />

                            {heroImage ? (
                                <img
                                    src={
                                        heroImage
                                    }
                                    alt={`Ambiente ${coleccion}`}
                                    className="h-[520px] w-full object-cover"
                                />
                            ) : (
                                <div className="h-[520px] w-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    Sin imagen
                                    de ambiente
                                </div>
                            )}
                        </div>

                        <p className="mt-8 max-w-full text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                            {content.introBottom ||
                                editorial.introBottom}
                        </p>
                    </div>
                </section>

                {/* 3) IMÁGENES DE AMBIENTE */}
                {carouselImages.length >
                    0 && (
                        <section className="pb-16">
                            <div className="max-w-6xl mx-auto px-6">
                                <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                                    Imágenes
                                </p>

                                <h2 className="mt-3 text-2xl md:text-3xl font-semibold">
                                    Ambientes
                                    y detalles
                                </h2>
                            </div>

                            <div className="mt-10 w-full overflow-hidden">
                                <div className="relative w-full">
                                    <div className="px-0">
                                        <DragImagenesColeccion
                                            images={
                                                carouselImages
                                            }
                                            className=""
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                {/* 4) TODOS LOS PRODUCTOS */}
                <section className="py-16">
                    <div className="max-w-[1800px] mx-auto px-6 lg:px-8">
                        <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                            Productos
                        </p>

                        <h2 className="mt-3 text-2xl md:text-3xl font-semibold">
                            Explora la
                            colección
                        </h2>

                        {loadingProducts &&
                            !collectionProducts.length ? (
                            <div className="py-16 text-sm text-gray-500">
                                Cargando
                                productos...
                            </div>
                        ) : collectionProducts.length >
                            0 ? (
                            <div
                                className="
                                    mt-10
                                    grid
                                    grid-cols-2
                                    gap-x-4
                                    gap-y-8
                                    sm:grid-cols-2
                                    md:grid-cols-3
                                    lg:grid-cols-4
                                    xl:grid-cols-5
                                    2xl:grid-cols-6
                                "
                            >
                                {collectionProducts.map(
                                    (
                                        product,
                                        index
                                    ) => {
                                        const imageSrc =
                                            buildAbsoluteImageUrl(
                                                product.imageBaja ||
                                                product.imagebaja ||
                                                product.imageAlta ||
                                                product.imagealta
                                            );

                                        return (
                                            <article
                                                key={`${product.codprodu ||
                                                    product.id ||
                                                    "prod"
                                                    }-${index}`}
                                                className="group flex flex-col"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleProductClick(
                                                            product
                                                        )
                                                    }
                                                    className="block w-full text-left"
                                                >
                                                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                                                        <img
                                                            src={
                                                                imageSrc
                                                            }
                                                            alt={
                                                                product.nombre ||
                                                                coleccion
                                                            }
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                                            onError={(
                                                                event
                                                            ) => {
                                                                event.currentTarget.src =
                                                                    "/img/default.webp";
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="pt-4 text-center">
                                                        <h3 className="text-base font-semibold text-gray-800 md:text-lg">
                                                            {
                                                                product.nombre
                                                            }
                                                        </h3>

                                                        {product.tonalidad && (
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {
                                                                    product.tonalidad
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </button>
                                            </article>
                                        );
                                    }
                                )}
                            </div>
                        ) : (
                            <div className="py-16 text-center text-sm text-gray-500">
                                No hay
                                productos
                                disponibles
                                en esta
                                colección.
                            </div>
                        )}

                        {productoSeleccionado && (
                            <Modal
                                isOpen={
                                    modalAbierta
                                }
                                close={
                                    handleCloseModal
                                }
                                product={
                                    productoSeleccionado
                                }
                            />
                        )}
                    </div>
                </section>

                {/* 5) BROCHURE */}
                {content.brochurePdf && (
                    <section className="py-16 bg-white">
                        <div className="max-w-6xl mx-auto px-6">
                            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                                Brochure
                            </p>

                            <h2 className="mt-3 text-2xl md:text-3xl font-semibold">
                                Descargar
                                brochure
                            </h2>

                            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] items-start">
                                <a
                                    href={
                                        content.brochurePdf
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group block"
                                >
                                    <div className="relative overflow-hidden rounded-3xl border border-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.10)] bg-white">
                                        {content.brochureImage ? (
                                            <img
                                                src={
                                                    content.brochureImage
                                                }
                                                alt={`Brochure ${coleccion}`}
                                                className="w-full h-[520px] object-cover transition duration-700 group-hover:scale-[1.03]"
                                            />
                                        ) : (
                                            <div className="w-full h-[520px] bg-gray-100 flex items-center justify-center text-gray-500">
                                                Ver
                                                brochure
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
                                    </div>
                                </a>

                                <div className="lg:pt-4">
                                    <p className="text-gray-700 max-w-sm leading-relaxed">
                                        {
                                            content.introBrouchure
                                        }
                                    </p>

                                    <a
                                        href={
                                            content.brochurePdf
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-gray-300 text-gray-900 hover:bg-gray-100 transition"
                                    >
                                        Abrir
                                        Brochure

                                        <span className="inline-flex w-10 h-10 rounded-full border border-gray-300 items-center justify-center">
                                            →
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </CartProvider>
    );
}