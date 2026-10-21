import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../header";
import Footer from "../footer";
import { CartProvider } from "../CartContext";

import { coleccionesPorMarca } from "../../Constants/constants";
import { cdnUrl } from "../../Constants/cdn";

const BRANDS = [
    {
        code: "ARE",
        name: "Arena",
        home: "/arenaHome",
    },
    {
        code: "HAR",
        name: "Harbour",
        home: "/harbourHome",
    },
    {
        code: "CJM",
        name: "CJM",
        home: "/cjmHome",
    },
    {
        code: "FLA",
        name: "Flamenco",
        home: "/flamencoHome",
    },
    {
        code: "BAS",
        name: "Bassari",
        home: "/bassariHome",
    },
];

const normalizeKey = (value) =>
    String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, "AND")
        .replace(/[^A-Za-z0-9]/g, "")
        .toUpperCase();

const CollectionCard = ({
    brand,
    collection,
    image,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group block w-full text-left"
        >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-stone-100">
                {image ? (
                    <img
                        src={image}
                        alt={`Colección ${collection}`}
                        loading="lazy"
                        decoding="async"
                        className="
                            h-full
                            w-full
                            object-cover
                            transition
                            duration-700
                            ease-out
                            group-hover:scale-105
                        "
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-stone-400">
                        Imagen no disponible
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/70">
                        {brand}
                    </p>

                    <h3 className="mt-2 text-lg font-medium leading-tight text-white">
                        {collection}
                    </h3>

                    <div
                        className="
                            mt-4
                            flex
                            items-center
                            gap-2
                            text-xs
                            uppercase
                            tracking-[0.18em]
                            text-white
                            opacity-0
                            transition
                            duration-300
                            group-hover:opacity-100
                        "
                    >
                        Ver colección

                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                    </div>
                </div>
            </div>
        </button>
    );
};

const BrandColumn = ({
    brand,
    collections,
    images,
    onCollectionClick,
    onBrandClick,
}) => {
    return (
        <section className="min-w-0">
            <button
                type="button"
                onClick={onBrandClick}
                className="group mb-7 w-full text-left"
            >
                <p className="text-[10px] uppercase tracking-[0.35em] text-stone-400">
                    Colecciones
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                    <h2 className="text-2xl font-light tracking-tight text-stone-950">
                        {brand.name}
                    </h2>

                    <span className="text-lg text-stone-400 transition group-hover:translate-x-1 group-hover:text-stone-950">
                        →
                    </span>
                </div>

                <div className="mt-4 h-px w-full overflow-hidden bg-stone-200">
                    <div
                        className="
                            h-px
                            w-full
                            origin-left
                            scale-x-[0.16]
                            bg-stone-950
                            transition-transform
                            duration-500
                            ease-out
                            group-hover:scale-x-100
                        "
                    />
                </div>
            </button>

            <div className="space-y-6">
                {collections.map((collection) => (
                    <CollectionCard
                        key={`${brand.code}-${collection}`}
                        brand={brand.name}
                        collection={collection}
                        image={images?.[collection] || null}
                        onClick={() =>
                            onCollectionClick(
                                brand.code,
                                collection
                            )
                        }
                    />
                ))}
            </div>
        </section>
    );
};

export default function ColeccionesPage() {
    const navigate = useNavigate();

    const [imagesByBrand, setImagesByBrand] = useState({});
    const [loading, setLoading] = useState(true);

    const brands = useMemo(
        () =>
            BRANDS.map((brand) => ({
                ...brand,
                collections:
                    coleccionesPorMarca[brand.code] || [],
            })),
        []
    );

    useEffect(() => {
        const controller =
            new AbortController();

        const loadCollections =
            async () => {
                setLoading(true);

                try {
                    const results =
                        await Promise.all(
                            brands.map(
                                async (
                                    brand
                                ) => {
                                    const response =
                                        await fetch(
                                            `${import.meta
                                                .env
                                                .VITE_API_BASE_URL
                                            }/api/collections/previews/${encodeURIComponent(
                                                brand.code
                                            )}`,
                                            {
                                                signal:
                                                    controller.signal,
                                            }
                                        );

                                    if (
                                        !response.ok
                                    ) {
                                        throw new Error(
                                            `Error ${response.status} cargando ${brand.code}`
                                        );
                                    }

                                    const data =
                                        await response.json();

                                    const backendCollections =
                                        data?.collections ||
                                        {};

                                    const imagesByNormalizedName =
                                        {};

                                    Object.entries(
                                        backendCollections
                                    ).forEach(
                                        ([
                                            collectionName,
                                            imageUrl,
                                        ]) => {
                                            imagesByNormalizedName[
                                                normalizeKey(
                                                    collectionName
                                                )
                                            ] =
                                                typeof imageUrl ===
                                                    "string" &&
                                                    imageUrl.trim()
                                                    ? imageUrl.trim()
                                                    : null;
                                        }
                                    );

                                    const collectionImages =
                                        {};

                                    brand.collections.forEach(
                                        (
                                            collection
                                        ) => {
                                            const imageUrl =
                                                imagesByNormalizedName[
                                                normalizeKey(
                                                    collection
                                                )
                                                ] ||
                                                null;

                                            collectionImages[
                                                collection
                                            ] =
                                                imageUrl
                                                    ? cdnUrl(
                                                        imageUrl
                                                    )
                                                    : null;
                                        }
                                    );

                                    return {
                                        code:
                                            brand.code,

                                        images:
                                            collectionImages,
                                    };
                                }
                            )
                        );

                    if (
                        controller
                            .signal
                            .aborted
                    ) {
                        return;
                    }

                    const nextImages =
                        {};

                    results.forEach(
                        ({
                            code,
                            images,
                        }) => {
                            nextImages[
                                code
                            ] =
                                images;
                        }
                    );

                    setImagesByBrand(
                        nextImages
                    );
                } catch (error) {
                    if (
                        error?.name !==
                        "AbortError"
                    ) {
                        console.error(
                            "Error cargando la página de colecciones:",
                            error
                        );
                    }
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            };

        loadCollections();

        return () => {
            controller.abort();
        };
    }, [brands]);

    const handleCollectionClick = (
        brandCode,
        collection
    ) => {
        navigate(
            `/coleccion/${encodeURIComponent(
                collection
            )}?brand=${encodeURIComponent(
                brandCode
            )}`
        );
    };

    return (
        <CartProvider>
            <Header />

            <main className="min-h-screen bg-[#faf9f7]">
                <section className="px-5 pb-16 pt-32 md:px-8 lg:px-10 lg:pt-36">
                    <div className="mx-auto max-w-[1800px]">
                        <header className="mb-14 max-w-3xl lg:mb-20">
                            <p className="text-xs uppercase tracking-[0.4em] text-stone-400">
                                CJMW
                            </p>

                            <h1 className="mt-5 text-4xl font-light tracking-[-0.04em] text-stone-950 md:text-6xl lg:text-7xl">
                                Colecciones
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-7 text-stone-500 md:text-lg">
                                Descubre nuestras
                                colecciones a través
                                de cinco universos
                                diferentes. Texturas,
                                color, estampados y
                                materiales pensados
                                para transformar cada
                                espacio.
                            </p>
                        </header>

                        {loading && (
                            <div className="mb-10 flex items-center gap-3 text-sm text-stone-400">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-stone-400" />

                                Cargando colecciones...
                            </div>
                        )}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-12
                                sm:grid-cols-2
                                lg:grid-cols-3
                                xl:grid-cols-5
                                xl:gap-5
                                2xl:gap-7
                            "
                        >
                            {brands.map(
                                (brand) => (
                                    <BrandColumn
                                        key={
                                            brand.code
                                        }
                                        brand={
                                            brand
                                        }
                                        collections={
                                            brand.collections
                                        }
                                        images={
                                            imagesByBrand[
                                            brand
                                                .code
                                            ] ||
                                            {}
                                        }
                                        onCollectionClick={
                                            handleCollectionClick
                                        }
                                        onBrandClick={() => navigate(brand.home)}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </CartProvider>
    );
}