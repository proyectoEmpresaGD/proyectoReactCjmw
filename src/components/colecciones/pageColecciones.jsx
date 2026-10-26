import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {
    ArrowRight,
    ArrowUp
} from "lucide-react";
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
        logo: "/logoArena.png",
        background:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/09%20FOTOS%20AMBIENTE%20OPTIMIZADAS%20WEBP/ARENA%20AMBIENTE/KANNATURA%20VOL%20III/KANN_III_GURU_AMBIENTE.webp",
    },
    {
        code: "HAR",
        name: "Harbour",
        home: "/harbourHome",
        logo: "/logoHarbour.png",
        background:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/09%20FOTOS%20AMBIENTE%20OPTIMIZADAS%20WEBP/HARBOUR%20AMBIENTE/BOHEMIAN/HARB_AMB_BOHEMIAN_07%2035X35.webp",
    },
    {
        code: "CJM",
        name: "CJM",
        home: "/cjmHome",
        logo: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM-sintexto.png",
        background:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/09%20FOTOS%20AMBIENTE%20OPTIMIZADAS%20WEBP/CJM%20AMBIENTE/SET%20OF%20THREADS/ROKKI%20EVERGREEN.webp",
    },
    {
        code: "FLA",
        name: "Flamenco",
        home: "/flamencoHome",
        logo: "/logoFlamenco.png",
        background:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/09%20FOTOS%20AMBIENTE%20OPTIMIZADAS%20WEBP/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_TAPIZ%20DE_LOS_DUQUES_BLUE_ISH_2.webp",
    },
    {
        code: "BAS",
        name: "Bassari",
        home: "/bassariHome",
        logo:
            "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png",
        background:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/09%20FOTOS%20AMBIENTE%20OPTIMIZADAS%20WEBP/BASSARI%20AMBIENTE/KASSUMAY/BASSARI%20KASSUMAY%20IWOL%20ARGILE_5_11zon_5_11zon.webp",
    },
];

const normalizeKey = (value) =>
    String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, "AND")
        .replace(/[^A-Za-z0-9]/g, "")
        .toUpperCase();

const wait = (ms) =>
    new Promise((resolve) =>
        setTimeout(resolve, ms)
    );


const fetchJsonWithRetry = async (
    url,
    {
        signal,
        retries = 2,
    } = {}
) => {
    let lastError = null;

    for (
        let attempt = 0;
        attempt <= retries;
        attempt += 1
    ) {
        try {
            const response =
                await fetch(url, {
                    signal,
                });

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            return await response.json();
        } catch (error) {
            if (
                error?.name ===
                "AbortError"
            ) {
                throw error;
            }

            lastError = error;

            if (
                attempt === retries
            ) {
                break;
            }

            await wait(
                400 *
                (attempt + 1)
            );
        }
    }

    throw lastError;
};

const ReliableImage = ({
    src,
    alt,
    priority = false,
    isLoading = false,
}) => {
    const [retry, setRetry] =
        useState(0);

    const [imageLoaded, setImageLoaded] =
        useState(false);

    const [failed, setFailed] =
        useState(false);

    useEffect(() => {
        setRetry(0);
        setImageLoaded(false);
        setFailed(false);
    }, [src]);

    const imageSrc =
        useMemo(() => {
            if (!src) {
                return null;
            }

            if (retry === 0) {
                return src;
            }

            const separator =
                src.includes("?")
                    ? "&"
                    : "?";

            return `${src}${separator}retry=${retry}`;
        }, [src, retry]);

    if (!imageSrc) {
        return (
            <div
                className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    bg-stone-100
                    px-4
                    text-center
                    text-sm
                    text-stone-400
                "
            >
                {isLoading
                    ? "Cargando imagen..."
                    : "Imagen no disponible"}
            </div>
        );
    }

    if (failed) {
        return (
            <div
                className="
                    flex
                    h-full
                    w-full
                    items-center
                    justify-center
                    bg-stone-100
                    px-4
                    text-center
                    text-sm
                    text-stone-400
                "
            >
                Imagen no disponible
            </div>
        );
    }

    return (
        <div className="relative h-full w-full">
            {!imageLoaded && (
                <div
                    className="
                        absolute
                        inset-0
                        z-10
                        flex
                        items-center
                        justify-center
                        bg-stone-100
                        text-sm
                        text-stone-400
                    "
                >
                    Cargando imagen...
                </div>
            )}

            <img
                key={imageSrc}
                src={imageSrc}
                alt={alt}
                loading={
                    priority
                        ? "eager"
                        : "lazy"
                }
                fetchPriority={
                    priority
                        ? "high"
                        : "auto"
                }
                decoding="async"
                onLoad={() => {
                    setImageLoaded(true);
                }}
                onError={() => {
                    setImageLoaded(false);

                    if (retry < 2) {
                        setRetry(
                            (current) =>
                                current + 1
                        );

                        return;
                    }

                    setFailed(true);
                }}
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
        </div>
    );
};

const CollectionCard = ({
    brand,
    collection,
    image,
    onClick,
    priority = false,
    isLoading = false,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group block w-full text-left"
        >
            <div
                className="
                    relative
                    aspect-[3/4]
                    overflow-hidden
                    rounded-[1.25rem]
                    bg-stone-100
                    sm:rounded-[1.5rem]
                "
            >
                <ReliableImage
                    src={image}
                    alt={`Colección ${collection}`}
                    priority={priority}
                    isLoading={isLoading}
                />

                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/70
                        via-black/10
                        to-transparent
                    "
                />

                <div
                    className="
                        absolute
                        inset-x-0
                        bottom-0
                        p-3
                        sm:p-5
                    "
                >
                    <p
                        className="
                            text-[8px]
                            font-medium
                            uppercase
                            tracking-[0.22em]
                            text-white/70
                            sm:text-[10px]
                            sm:tracking-[0.28em]
                        "
                    >
                        {brand}
                    </p>

                    <h3
                        className="
                            mt-1.5
                            text-sm
                            font-medium
                            leading-tight
                            text-white
                            sm:mt-2
                            sm:text-lg
                        "
                    >
                        {collection}
                    </h3>

                    <div
                        className="
                            mt-3
                            flex
                            items-center
                            gap-1.5
                            text-[9px]
                            uppercase
                            tracking-[0.14em]
                            text-white/90
                            opacity-100
                            transition
                            duration-300
                            lg:mt-4
                            lg:gap-2
                            lg:text-xs
                            lg:tracking-[0.18em]
                            lg:opacity-0
                            lg:group-hover:opacity-100
                        "
                    >
                        Ver colección

                        <ArrowRight
                            className="
                                h-3
                                w-3
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
                        />
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
    loading,
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
                <p
                    className="
                        text-[10px]
                        uppercase
                        tracking-[0.35em]
                        text-stone-400
                    "
                >
                    Colecciones
                </p>

                <div
                    className="
                        mt-2
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >
                    <h2
                        className="
                            text-2xl
                            font-light
                            tracking-tight
                            text-stone-950
                        "
                    >
                        {brand.name}
                    </h2>

                    <ArrowRight
                        className="
                            h-5
                            w-5
                            text-stone-400
                            transition
                            group-hover:translate-x-1
                            group-hover:text-stone-950
                        "
                    />
                </div>

                <div
                    className="
                        mt-4
                        h-px
                        w-full
                        overflow-hidden
                        bg-stone-200
                    "
                >
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
                {collections.map(
                    (
                        collection,
                        index
                    ) => (
                        <CollectionCard
                            key={`${brand.code}-${collection}`}
                            brand={brand.name}
                            collection={
                                collection
                            }
                            image={
                                images?.[
                                collection
                                ] || null
                            }
                            priority={
                                index < 3
                            }
                            isLoading={
                                loading
                            }
                            onClick={() =>
                                onCollectionClick(
                                    brand.code,
                                    collection
                                )
                            }
                        />
                    )
                )}
            </div>
        </section>
    );
};


const MobileBrandSelector = ({
    brands,
    selectedBrand,
    onSelectBrand,
}) => {
    return (
        <div className="lg:hidden">
            <div className="mb-6">
                <p
                    className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.3em]
                        text-stone-400
                    "
                >
                    Marcas
                </p>

                <h2
                    className="
                        mt-2
                        text-2xl
                        font-light
                        tracking-[-0.03em]
                        text-stone-950
                    "
                >
                    Elige una marca
                </h2>

                <p
                    className="
                        mt-2
                        max-w-md
                        text-sm
                        leading-6
                        text-stone-500
                    "
                >
                    Selecciona una marca para
                    descubrir sus colecciones.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {brands.map(
                    (brand, index) => {
                        const isActive =
                            brand.code ===
                            selectedBrand;

                        const isLast =
                            index ===
                            brands.length - 1;

                        return (
                            <div
                                key={brand.code}
                                className={
                                    isLast
                                        ? "col-span-2 flex justify-center"
                                        : ""
                                }
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        onSelectBrand(
                                            brand.code
                                        )
                                    }
                                    aria-pressed={
                                        isActive
                                    }
                                    className={`
                                        group
                                        relative
                                        aspect-[4/3]
                                        overflow-hidden
                                        rounded-2xl
                                    
                                        text-left
                                        transition-all
                                        duration-300
                                        active:scale-[0.98]

                                        ${isLast
                                            ? "w-[calc(50%-0.375rem)]"
                                            : "w-full"
                                        }

                                        ${isActive
                                            ? "ring-2 ring-stone-950 ring-offset-2 ring-offset-[#faf9f7]"
                                            : ""
                                        }
                                    `}
                                >
                                    {/* IMAGEN DE FONDO */}
                                    <img
                                        src={
                                            brand.background
                                        }
                                        alt=""
                                        loading="eager"
                                        aria-hidden="true"
                                        className="
                                            absolute
                                            inset-0
                                            h-full
                                            w-full
                                            object-cover
                                            transition-transform
                                            duration-700
                                            ease-out
                                            group-hover:scale-105
                                        "
                                    />

                                    {/* CAPA SUAVE PARA LEGIBILIDAD */}
                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            bg-black/10
                                        "
                                    />

                                    {/* LOGO */}
                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            flex
                                            items-center
                                            justify-center
                                            p-4
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                h-[56px]
                                                w-[100%]
                                                items-center
                                                justify-center
                                                rounded-xl
                                                
                                                px-4
                                                py-3
                                            "
                                        >
                                            <img
                                                src={brand.logo}
                                                alt={brand.name}
                                                className={`
                                                h-auto
                                                object-contain
                                                ${brand.code === "CJM"
                                                        ? "w-auto max-w-[65%] max-h-9"
                                                        : "w-[100%] max-h-36"
                                                    }
                                                `}
                                            />
                                        </div>
                                    </div>

                                    {/* MARCA ACTIVA */}
                                    {isActive && (
                                        <div
                                            className="
                                                absolute
                                                right-3
                                                top-3
                                                flex
                                                h-6
                                                w-6
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-stone-950
                                            "
                                        >
                                            <span
                                                className="
                                                    h-2
                                                    w-2
                                                    rounded-full
                                                    bg-white
                                                "
                                            />
                                        </div>
                                    )}
                                </button>
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
};

const MobileCollections = ({
    brand,
    images,
    loading,
    onCollectionClick,
    onChangeBrand,
}) => {
    if (!brand) {
        return null;
    }

    return (
        <section className="mt-10 lg:hidden">
            <div
                className="
                    mb-6
                    flex
                    items-end
                    justify-between
                    gap-4
                    border-y
                    border-stone-200
                    py-5
                "
            >
                <div>
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.3em]
                            text-stone-400
                        "
                    >
                        Colecciones
                    </p>

                    <h2
                        className="
                            mt-2
                            text-3xl
                            font-light
                            tracking-[-0.04em]
                            text-stone-950
                        "
                    >
                        {brand.name}
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-stone-400
                        "
                    >
                        {
                            brand.collections
                                .length
                        }{" "}
                        {brand.collections
                            .length === 1
                            ? "colección"
                            : "colecciones"}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={
                        onChangeBrand
                    }
                    className="
                        shrink-0
                        rounded-full
                        border
                        border-stone-300
                        bg-white
                        px-4
                        py-2
                        text-xs
                        font-semibold
                        tracking-[0.04em]
                        text-stone-700
                        transition
                        hover:border-stone-950
                        hover:text-stone-950
                    "
                >
                    Cambiar
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {brand.collections.map(
                    (
                        collection,
                        index
                    ) => (
                        <CollectionCard
                            key={`${brand.code}-${collection}`}
                            brand={
                                brand.name
                            }
                            collection={
                                collection
                            }
                            image={
                                images?.[
                                collection
                                ] || null
                            }
                            priority={
                                index < 6
                            }
                            isLoading={
                                loading
                            }
                            onClick={() =>
                                onCollectionClick(
                                    brand.code,
                                    collection
                                )
                            }
                        />
                    )
                )}
            </div>
        </section>
    );
};


export default function ColeccionesPage() {
    const navigate = useNavigate();

    const brandSelectorRef =
        useRef(null);

    const [
        imagesByBrand,
        setImagesByBrand
    ] = useState({});

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        selectedBrand,
        setSelectedBrand
    ] = useState("ARE");

    const [
        showScrollTop,
        setShowScrollTop
    ] = useState(false);


    const brands = useMemo(
        () =>
            BRANDS.map(
                (brand) => ({
                    ...brand,

                    collections:
                        coleccionesPorMarca[
                        brand.code
                        ] || [],
                })
            ),
        []
    );


    const activeBrand = useMemo(
        () =>
            brands.find(
                (brand) =>
                    brand.code ===
                    selectedBrand
            ) || brands[0],
        [
            brands,
            selectedBrand
        ]
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
                                    try {
                                        const data =
                                            await fetchJsonWithRetry(
                                                `${import
                                                    .meta
                                                    .env
                                                    .VITE_API_BASE_URL
                                                }/api/collections/previews/${encodeURIComponent(
                                                    brand.code
                                                )}`,
                                                {
                                                    signal:
                                                        controller
                                                            .signal,
                                                    retries: 2,
                                                }
                                            );

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
                                    } catch (
                                    error
                                    ) {
                                        if (
                                            error?.name ===
                                            "AbortError"
                                        ) {
                                            throw error;
                                        }

                                        console.warn(
                                            `No se pudieron cargar las imágenes de ${brand.code}:`,
                                            error
                                        );

                                        return {
                                            code:
                                                brand.code,
                                            images: {},
                                        };
                                    }
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


    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(
                window.scrollY > 400
            );
        };

        handleScroll();

        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true
            }
        );

        return () => {
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, []);


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


    const handleBrandSelect = (
        brandCode
    ) => {
        setSelectedBrand(
            brandCode
        );
    };


    const handleChangeBrand = () => {
        brandSelectorRef.current
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    };


    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    return (
        <CartProvider>
            <Header />

            <main className="min-h-screen bg-[#faf9f7]">
                <section
                    className="
                        px-5
                        pb-16
                        pt-32
                        md:px-8
                        lg:px-10
                        lg:pt-36
                    "
                >
                    <div className="mx-auto max-w-[1800px]">

                        {/* CABECERA */}
                        <header
                            className="
                                mb-10
                                max-w-3xl
                                lg:mb-20
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    uppercase
                                    tracking-[0.4em]
                                    text-stone-400
                                "
                            >
                                CJMW
                            </p>

                            <h1
                                className="
                                    mt-5
                                    text-4xl
                                    font-light
                                    tracking-[-0.04em]
                                    text-stone-950
                                    md:text-6xl
                                    lg:text-7xl
                                "
                            >
                                Colecciones
                            </h1>

                            <p
                                className="
                                    mt-6
                                    max-w-2xl
                                    text-base
                                    leading-7
                                    text-stone-500
                                    md:text-lg
                                "
                            >
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


                        {/* LOADING */}
                        {loading && (
                            <div
                                className="
                                    mb-8
                                    flex
                                    items-center
                                    gap-3
                                    text-sm
                                    text-stone-400
                                    lg:mb-10
                                "
                            >
                                <span
                                    className="
                                        h-2
                                        w-2
                                        animate-pulse
                                        rounded-full
                                        bg-stone-400
                                    "
                                />

                                Cargando colecciones...
                            </div>
                        )}


                        {/* ─────────────────────────────
                            MÓVIL / TABLET
                            ───────────────────────────── */}
                        <div
                            ref={
                                brandSelectorRef
                            }
                            className="scroll-mt-24 lg:hidden"
                        >
                            <MobileBrandSelector
                                brands={brands}
                                selectedBrand={
                                    selectedBrand
                                }
                                onSelectBrand={
                                    handleBrandSelect
                                }
                            />
                        </div>


                        <MobileCollections
                            brand={activeBrand}
                            images={
                                imagesByBrand[
                                activeBrand?.code
                                ] || {}
                            }
                            loading={loading}
                            onCollectionClick={
                                handleCollectionClick
                            }
                            onChangeBrand={
                                handleChangeBrand
                            }
                        />

                        {/* ─────────────────────────────
                            ESCRITORIO
                            Mantiene el diseño actual
                            ───────────────────────────── */}
                        <div
                            className="
                                hidden
                                gap-12
                                lg:grid
                                lg:grid-cols-3
                                xl:grid-cols-5
                                xl:gap-5
                                2xl:gap-7
                            "
                        >
                            {brands.map(
                                (brand) => (
                                    <BrandColumn
                                        key={brand.code}
                                        brand={brand}
                                        collections={
                                            brand.collections
                                        }
                                        images={
                                            imagesByBrand[
                                            brand.code
                                            ] || {}
                                        }
                                        loading={loading}
                                        onCollectionClick={
                                            handleCollectionClick
                                        }
                                        onBrandClick={() =>
                                            navigate(
                                                brand.home
                                            )
                                        }
                                    />
                                )
                            )}
                        </div>
                    </div>
                </section>
            </main>


            {/* VOLVER ARRIBA - SOLO MÓVIL/TABLET */}
            <button
                type="button"
                onClick={
                    scrollToTop
                }
                aria-label="Volver arriba"
                className={`
                    fixed
                    bottom-5
                    right-5
                    z-40
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-stone-200
                    bg-white/95
                    text-stone-800
                    shadow-lg
                    backdrop-blur
                    transition-all
                    duration-300
                    lg:hidden

                    ${showScrollTop
                        ? "translate-y-0 opacity-100"
                        : "translate-y-4 opacity-0 pointer-events-none"
                    }
                `}
            >
                <ArrowUp className="h-5 w-5" />
            </button>

            <Footer />
        </CartProvider>
    );
}