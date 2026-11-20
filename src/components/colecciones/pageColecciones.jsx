import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    ArrowRight,
    ArrowUp,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "../header";
import Footer from "../footer";
import { CartProvider } from "../CartContext";

import {
    coleccionesPorMarca,
} from "../../Constants/constants";

import {
    cdnUrl,
} from "../../Constants/cdn";


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
        logo:
            "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM-sintexto.png",
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

const COLLECTIONS_CACHE_KEY = "cjmw-collection-previews-v2";
const COLLECTIONS_CACHE_TTL = 10 * 60 * 1000;
const normalizeKey = (value) => String(value || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "AND").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Solo direcciones y fechas en localStorage, nunca fotos en Base64.
const getCachedCollectionImages = () => {
    try {
        const parsed = JSON.parse(localStorage.getItem(COLLECTIONS_CACHE_KEY));
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch { return {}; }
};
const setCachedCollectionImages = (brandCode, images) => {
    if (!Object.values(images).some((url) => typeof url === "string" && url)) return;
    try {
        const current = getCachedCollectionImages();
        current[brandCode] = { timestamp: Date.now(), images };
        localStorage.setItem(COLLECTIONS_CACHE_KEY, JSON.stringify(current));
    } catch { /* La web funciona aunque el almacenamiento esté bloqueado. */ }
};

// Cache Storage conserva los bytes de las fotos entre visitas (HTTPS).
const PHOTO_CACHE = "cjmw-collection-photos-v1";
const PHOTO_TTL = 7 * 24 * 60 * 60 * 1000;
const PHOTO_LIMIT = 120;
const photoRequests = new Map();
const getPhotoBlob = (src) => {
    if (photoRequests.has(src)) return photoRequests.get(src);
    const request = (async () => {
        if (!window.isSecureContext || !("caches" in window)) return null;
        let cache;
        try {
            cache = await caches.open(PHOTO_CACHE);
            const saved = await cache.match(src);
            if (saved && Date.now() - Number(saved.headers.get("x-cjmw-saved")) < PHOTO_TTL) {
                return await saved.blob();
            }
        } catch { return null; }
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000);
        try {
            const response = await fetch(src, {
                mode: "cors", cache: "default", signal: controller.signal,
            });
            if (!response.ok) return null;
            const blob = await response.blob();
            if (!blob.size || !blob.type.startsWith("image/")) return null;
            // No persistir archivos que no se puedan decodificar como imagen.
            const probe = new Image();
            const probeUrl = URL.createObjectURL(blob);
            try {
                await new Promise((resolve, reject) => {
                    probe.onload = resolve;
                    probe.onerror = reject;
                    probe.src = probeUrl;
                });
            } finally { URL.revokeObjectURL(probeUrl); }
            try {
                await cache.put(src, new Response(blob, {
                    headers: {
                        "Content-Type": blob.type, "x-cjmw-saved": String(Date.now()),
                    }
                }));
                const keys = await cache.keys();
                for (const key of keys.slice(0, Math.max(0, keys.length - PHOTO_LIMIT))) {
                    await cache.delete(key);
                }
            } catch { /* Cuota o modo privado: mostrar igualmente la imagen. */ }
            return blob;
        } catch { return null; }
        finally { clearTimeout(timeout); }
    })().finally(() => photoRequests.delete(src));
    photoRequests.set(src, request);
    return request;
};

const fetchJsonWithRetry = async (
    url,
    {
        signal,
        retries = 2,
        timeout = 10000,
    } = {}
) => {
    let lastError = null;

    for (
        let attempt = 0;
        attempt <= retries;
        attempt += 1
    ) {
        if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
        const controller = new AbortController();

        const timeoutId =
            window.setTimeout(
                () => {
                    controller.abort();
                },
                timeout
            );

        const handleParentAbort =
            () => {
                controller.abort();
            };

        signal?.addEventListener(
            "abort",
            handleParentAbort,
            {
                once: true,
            }
        );

        try {
            const response =
                await fetch(
                    url,
                    {
                        signal:
                            controller.signal,

                        cache:
                            "default",

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }

            return await response.json();
        } catch (error) {
            if (
                signal?.aborted
            ) {
                throw error;
            }

            lastError =
                error;

            if (
                attempt === retries
            ) {
                break;
            }

            await wait(
                400 *
                (attempt + 1)
            );
        } finally {
            window.clearTimeout(
                timeoutId
            );

            signal?.removeEventListener(
                "abort",
                handleParentAbort
            );
        }
    }

    throw lastError;
};


const ReliableImage = ({ src, alt, priority = false, isLoading = false, t }) => {
    const containerRef = useRef(null);
    const imgRef = useRef(null);
    const [visible, setVisible] = useState(priority);
    const [resolved, setResolved] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [failed, setFailed] = useState(false);
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        if (priority || !("IntersectionObserver" in window)) {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
        }, { rootMargin: "250px" });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [priority]);

    useEffect(() => {
        let active = true;
        let objectUrl;
        setResolved(null);
        setImageLoaded(false);
        setFailed(false);
        setRetry(0);
        if (src && visible) {
            getPhotoBlob(src).then((blob) => {
                if (!active) return;
                if (blob) objectUrl = URL.createObjectURL(blob);
                setResolved({ source: src, url: objectUrl || src });
            }).catch(() => {
                if (active) setResolved({ source: src, url: src });
            });
        }
        return () => {
            active = false;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [src, visible]);

    const imageSrc = resolved?.source === src ? resolved.url : null;
    // Una imagen servida desde caché puede estar completa antes del efecto.
    useEffect(() => {
        const image = imgRef.current;
        if (image?.complete && image.naturalWidth > 0) setImageLoaded(true);
    }, [imageSrc, retry]);

    return (
        <div ref={containerRef} className="relative h-full w-full">
            {(!imageLoaded || failed) && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-stone-100 px-4 text-center text-sm text-stone-400">
                    {failed || (!src && !isLoading)
                        ? t("image.unavailable") : t("image.loading")}
                </div>
            )}
            {imageSrc && !failed && (
                <img ref={imgRef} key={`${imageSrc}-${retry}`} src={imageSrc}
                    alt={alt} loading={priority ? "eager" : "lazy"} decoding="async"
                    onLoad={() => { setImageLoaded(true); setFailed(false); }}
                    onError={() => {
                        setImageLoaded(false);
                        if (imageSrc.startsWith("blob:")) {
                            // Descartar una copia ilegible y volver a la URL original.
                            caches.open(PHOTO_CACHE).then((cache) => cache.delete(src)).catch(() => { });
                            setResolved({ source: src, url: src });
                        } else if (retry < 1) setRetry((value) => value + 1);
                        else setFailed(true);
                    }}
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                />
            )}
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
    t,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group
                block
                w-full
                text-left
            "
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
                    alt={t(
                        "card.imageAlt",
                        {
                            collection,
                        }
                    )}
                    priority={
                        priority
                    }
                    isLoading={
                        isLoading
                    }
                    t={t}
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
                        {t(
                            "card.view"
                        )}

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
    t,
}) => {
    return (
        <section
            className="
                min-w-0
            "
        >
            <button
                type="button"
                onClick={
                    onBrandClick
                }
                className="
                    group
                    mb-7
                    w-full
                    text-left
                "
            >
                <p
                    className="
                        text-[10px]
                        uppercase
                        tracking-[0.35em]
                        text-stone-400
                    "
                >
                    {t(
                        "sectionLabel"
                    )}
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

            <div
                className="
                    space-y-6
                "
            >
                {collections.map(
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
                                ] ||
                                null
                            }
                            priority={false}
                            isLoading={
                                loading
                            }
                            t={t}
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
    t,
}) => {
    return (
        <div
            className="
                lg:hidden
            "
        >
            <div
                className="
                    mb-6
                "
            >
                <p
                    className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.3em]
                        text-stone-400
                    "
                >
                    {t(
                        "mobile.brandsLabel"
                    )}
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
                    {t(
                        "mobile.chooseBrand"
                    )}
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
                    {t(
                        "mobile.chooseBrandDescription"
                    )}
                </p>
            </div>

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3
                "
            >
                {brands.map(
                    (
                        brand,
                        index
                    ) => {
                        const isActive =
                            brand.code ===
                            selectedBrand;

                        const isLast =
                            index ===
                            brands.length -
                            1;

                        return (
                            <div
                                key={
                                    brand.code
                                }
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

                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            bg-black/10
                                        "
                                    />

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
                                                w-full
                                                items-center
                                                justify-center
                                                rounded-xl
                                                px-4
                                                py-3
                                            "
                                        >
                                            <img
                                                src={
                                                    brand.logo
                                                }
                                                alt={
                                                    brand.name
                                                }
                                                className={`
                                                    h-auto
                                                    object-contain

                                                    ${brand.code ===
                                                        "CJM"
                                                        ? "w-auto max-w-[65%] max-h-9"
                                                        : "w-full max-h-36"
                                                    }
                                                `}
                                            />
                                        </div>
                                    </div>

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
    t,
}) => {
    if (!brand) {
        return null;
    }

    return (
        <section
            className="
                mt-10
                lg:hidden
            "
        >
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
                        {t(
                            "sectionLabel"
                        )}
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
                        {t(
                            "mobile.collectionCount",
                            {
                                count:
                                    brand
                                        .collections
                                        .length,
                            }
                        )}
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
                    {t(
                        "mobile.changeBrand"
                    )}
                </button>
            </div>

            <div
                className="
                    grid
                    grid-cols-2
                    gap-3

                    sm:gap-4
                "
            >
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
                                ] ||
                                null
                            }
                            priority={
                                index === 0
                            }
                            isLoading={
                                loading
                            }
                            t={t}
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
    const navigate =
        useNavigate();

    const { t } =
        useTranslation(
            "pageColecciones"
        );


    const brandSelectorRef =
        useRef(null);


    const [
        imagesByBrand,
        setImagesByBrand,
    ] = useState({});


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        selectedBrand,
        setSelectedBrand,
    ] = useState("ARE");


    const [
        showScrollTop,
        setShowScrollTop,
    ] = useState(false);


    const brands =
        useMemo(
            () =>
                BRANDS.map(
                    (
                        brand
                    ) => ({
                        ...brand,

                        collections:
                            coleccionesPorMarca[
                            brand.code
                            ] ||
                            [],
                    })
                ),
            []
        );


    const activeBrand =
        useMemo(
            () =>
                brands.find(
                    (
                        brand
                    ) =>
                        brand.code ===
                        selectedBrand
                ) ||
                brands[0],
            [
                brands,
                selectedBrand,
            ]
        );


    useEffect(() => {
        const controller = new AbortController();
        const cached = getCachedCollectionImages();
        const initial = {};
        for (const brand of brands) {
            const entry = cached[brand.code];
            if (entry?.images && typeof entry.images === "object") initial[brand.code] = entry.images;
        }
        setImagesByBrand(initial);
        setLoading(true);

        const loadBrand = async (brand) => {
            const entry = cached[brand.code];
            const complete = brand.collections.every((name) =>
                typeof entry?.images?.[name] === "string" && entry.images[name]);
            if (complete && Date.now() - entry.timestamp < COLLECTIONS_CACHE_TTL) return;
            try {
                const base = import.meta.env.VITE_API_BASE_URL?.trim();
                const url = new URL(`/api/collections/previews/${encodeURIComponent(brand.code)}`,
                    base || window.location.origin);
                const data = await fetchJsonWithRetry(url.toString(), {
                    signal: controller.signal, retries: 1, timeout: 10000,
                });
                if (!data?.collections || typeof data.collections !== "object" || Array.isArray(data.collections)) {
                    throw new Error("Respuesta de colecciones no válida");
                }
                const normalized = {};
                for (const [name, url] of Object.entries(data.collections)) {
                    if (typeof url === "string" && url.trim()) normalized[normalizeKey(name)] = url.trim();
                }
                const images = { ...entry?.images };
                for (const name of brand.collections) {
                    const url = normalized[normalizeKey(name)];
                    if (url) images[name] = cdnUrl(url);
                }
                if (controller.signal.aborted) return;
                setImagesByBrand((current) => ({ ...current, [brand.code]: images }));
                setCachedCollectionImages(brand.code, images);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.warn(`No se pudieron actualizar las imágenes de ${brand.code}:`, error);
                }
                // Conservar las direcciones anteriores y reintentar en la siguiente visita.
            }
        };
        Promise.allSettled(brands.map(loadBrand)).then(() => {
            if (!controller.signal.aborted) setLoading(false);
        });
        return () => controller.abort();
    }, [brands]);

    useEffect(() => {
        const handleScroll =
            () => {
                setShowScrollTop(
                    window.scrollY >
                    400
                );
            };


        handleScroll();


        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true,
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


    const handleChangeBrand =
        () => {
            brandSelectorRef
                .current
                ?.scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "start",
                });
        };


    const scrollToTop =
        () => {
            window.scrollTo({
                top: 0,
                behavior:
                    "smooth",
            });
        };


    return (
        <CartProvider>
            <Header />

            <main
                className="
                    min-h-screen
                    bg-[#faf9f7]
                "
            >
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
                    <div
                        className="
                            mx-auto
                            max-w-[1800px]
                        "
                    >
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
                                    tracking-[0.4em]
                                    text-stone-400
                                "
                            >
                                {t(
                                    "eyebrow"
                                )}
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
                                {t(
                                    "title"
                                )}
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
                                {t(
                                    "description"
                                )}
                            </p>
                        </header>


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

                                {t(
                                    "loading"
                                )}
                            </div>
                        )}


                        <div
                            ref={
                                brandSelectorRef
                            }
                            className="
                                scroll-mt-24

                                lg:hidden
                            "
                        >
                            <MobileBrandSelector
                                brands={
                                    brands
                                }
                                selectedBrand={
                                    selectedBrand
                                }
                                onSelectBrand={
                                    handleBrandSelect
                                }
                                t={t}
                            />
                        </div>


                        <MobileCollections
                            brand={
                                activeBrand
                            }
                            images={
                                imagesByBrand[
                                activeBrand
                                    ?.code
                                ] ||
                                {}
                            }
                            loading={
                                loading
                            }
                            onCollectionClick={
                                handleCollectionClick
                            }
                            onChangeBrand={
                                handleChangeBrand
                            }
                            t={t}
                        />


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
                                (
                                    brand
                                ) => (
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
                                            brand.code
                                            ] ||
                                            {}
                                        }
                                        loading={
                                            loading
                                        }
                                        onCollectionClick={
                                            handleCollectionClick
                                        }
                                        onBrandClick={() =>
                                            navigate(
                                                brand.home
                                            )
                                        }
                                        t={t}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </section>
            </main>


            <button
                type="button"
                onClick={
                    scrollToTop
                }
                aria-label={t(
                    "scrollTop"
                )}
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
                        : "pointer-events-none translate-y-4 opacity-0"
                    }
                `}
            >
                <ArrowUp
                    className="
                        h-5
                        w-5
                    "
                />
            </button>

            <Footer />
        </CartProvider>
    );
}