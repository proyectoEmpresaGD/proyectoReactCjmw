// src/components/ComponentesHome/carruselHome.jsx
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cdnUrl } from "../../Constants/cdn";
import { brandLogos, imagenesColecciones } from "../../Constants/constants";
import { buildColeccionParams } from "../../Constants/coleccionesHelpers";
import { coleccionConfigByName } from "../../Constants/constants";

const SWIPE_THRESHOLD_PX = 50;
const TAP_MOVE_TOLERANCE_PX = 12;
const SCROLL_LOCK_MS = 500;

const toAbsRoute = (route) => {
    const r = String(route || "").trim();
    if (!r) return "";
    return r.startsWith("/") ? r : `/${r}`;
};

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(String(value || "").trim());
const resolveUrl = (value) => {
    const v = String(value || "").trim();
    if (!v) return "";
    return isAbsoluteUrl(v) ? v : cdnUrl(v);
};

const normalizeBrand = (value) => String(value || "").trim().toUpperCase();

const pickRandom = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
};

const buildColeccionUrl = (coleccion, params = {}) => {
    const sp = new URLSearchParams();

    if (params.introTop) sp.set("introTop", params.introTop);
    if (params.introBottom) sp.set("introBottom", params.introBottom);
    if (params.introBrouchure) sp.set("introBrouchure", params.introBrouchure);

    if (params.brochureImage) sp.set("brochureImage", params.brochureImage);
    if (params.brochurePdf) sp.set("brochurePdf", params.brochurePdf);
    if (params.heroImage) sp.set("heroImage", params.heroImage);

    if (Array.isArray(params.images) && params.images.length > 0) {
        sp.set("images", JSON.stringify(params.images));
    }

    const qs = sp.toString();
    return `/coleccion/${encodeURIComponent(coleccion)}${qs ? `?${qs}` : ""}`;
};

const brandCodeByName = {
    BASSARI: "BAS",
    FLAMENCO: "FLA",
    HARBOUR: "HAR",
    ARENA: "ARE",
    CJM: "CJM",
};

const buildProductUrl = ({ brand, collection }) => {
    const params = new URLSearchParams();
    const brandCode = brandCodeByName[normalizeBrand(brand)];
    if (brandCode) params.set("brand", brandCode);
    if (collection) params.set("collection", collection);
    return `/products?${params.toString()}`;
};

const CarruselHome = ({
    imagesMobile = [],
    imagesDesktop = [],
    texts = [],
    names = [],
    routes = [],
    heroCollections = [],
    newCollectionsByBrand = {},
    videos = [],
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
        return window.matchMedia("(max-width: 768px)").matches;
    });

    const isScrollingRef = useRef(false);
    const containerRef = useRef(null);
    const touchStart = useRef({ x: 0, y: 0 });
    const touchLast = useRef({ x: 0, y: 0 });
    const movedRef = useRef(false);
    const tickerTouchStartRef = useRef({ x: 0, y: 0 });


    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
        const mq = window.matchMedia("(max-width: 768px)");
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener?.("change", handler);
        mq.addListener?.(handler);
        return () => {
            mq.removeEventListener?.("change", handler);
            mq.removeListener?.(handler);
        };
    }, []);

    const rawSelectedImages = useMemo(
        () => (isMobile ? imagesMobile : imagesDesktop),
        [isMobile, imagesMobile, imagesDesktop]
    );

    const ORDER = useMemo(() => ["BASSARI", "FLAMENCO", "ARENA", "HARBOUR", "CJM"], []);

    const slides = useMemo(() => {
        const nameToIndex = new Map();
        (names || []).forEach((n, idx) => {
            if (!n) return;
            nameToIndex.set(String(n).trim().toUpperCase(), idx);
        });

        const out = [];
        for (const key of ORDER) {
            const idx = nameToIndex.get(key);
            if (typeof idx !== "number") continue;

            const route = routes?.[idx];
            if (!route) continue;

            const label = isMobile
                ? t("home.spotlight.labelShort", "Nuevas")
                : t("home.spotlight.label", "Nuevas colecciones");

            const collections = newCollectionsByBrand?.[key];

            out.push({
                idx,
                name: names[idx],
                image: rawSelectedImages[idx],
                text: texts?.[idx],
                route,
                spotlight: collections?.length
                    ? {
                        label,
                        items: collections,
                        href: `/colecciones/${route.replace("Home", "")}`,
                    }
                    : null,
            });
        }

        return out;
    }, [ORDER, names, rawSelectedImages, texts, routes, newCollectionsByBrand, isMobile, t]);

    const totalSlides = useMemo(() => 1 + slides.length, [slides.length]);

    useEffect(() => {
        if (currentSlide > totalSlides - 1) setCurrentSlide(0);
    }, [totalSlides, currentSlide]);

    useEffect(() => {
        const cnt = containerRef.current;
        if (!cnt) return;

        const handleWheel = (e) => {
            e.preventDefault?.();
            if (isScrollingRef.current) return;

            const dir = e.deltaY > 0 ? 1 : -1;

            isScrollingRef.current = true;
            setCurrentSlide((prev) => {
                if (dir === 1 && prev < totalSlides - 1) return prev + 1;
                if (dir === -1 && prev > 0) return prev - 1;
                return prev;
            });

            window.setTimeout(() => {
                isScrollingRef.current = false;
            }, SCROLL_LOCK_MS);
        };

        cnt.addEventListener("wheel", handleWheel, { passive: false });
        return () => cnt.removeEventListener("wheel", handleWheel);
    }, [totalSlides]);

    useEffect(() => {
        const cnt = containerRef.current;
        if (!cnt) return;

        const onStart = (e) => {
            if (!e.touches?.[0]) return;
            const tt = e.touches[0];
            touchStart.current = { x: tt.clientX, y: tt.clientY };
            touchLast.current = { x: tt.clientX, y: tt.clientY };
            movedRef.current = false;
        };

        const onMove = (e) => {
            if (!e.touches?.[0]) return;
            const tt = e.touches[0];
            touchLast.current = { x: tt.clientX, y: tt.clientY };

            const dx = Math.abs(touchLast.current.x - touchStart.current.x);
            const dy = Math.abs(touchLast.current.y - touchStart.current.y);

            if (dx > TAP_MOVE_TOLERANCE_PX || dy > TAP_MOVE_TOLERANCE_PX) {
                movedRef.current = true;
            }
        };

        const onEnd = () => {
            const dy = touchStart.current.y - touchLast.current.y;

            if (dy > SWIPE_THRESHOLD_PX && currentSlide < totalSlides - 1) {
                setCurrentSlide((s) => s + 1);
                return;
            }
            if (dy < -SWIPE_THRESHOLD_PX && currentSlide > 0) {
                setCurrentSlide((s) => s - 1);
            }
        };

        cnt.addEventListener("touchstart", onStart, { passive: true });
        cnt.addEventListener("touchmove", onMove, { passive: true });
        cnt.addEventListener("touchend", onEnd);

        return () => {
            cnt.removeEventListener("touchstart", onStart);
            cnt.removeEventListener("touchmove", onMove);
            cnt.removeEventListener("touchend", onEnd);
        };
    }, [currentSlide, totalSlides]);

    const safeNavigate = (route) => {
        const abs = toAbsRoute(route);
        if (!abs) return;
        if (movedRef.current) return;
        navigate(abs);
    };

    const handleTickerTouchStart = (event) => {
        if (!event.touches?.[0]) return;
        const touch = event.touches[0];
        tickerTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
        event.stopPropagation();
    };

    const handleTickerTouchMove = (event) => {
        if (!event.touches?.[0]) return;
        const touch = event.touches[0];
        const dx = Math.abs(touch.clientX - tickerTouchStartRef.current.x);
        const dy = Math.abs(touch.clientY - tickerTouchStartRef.current.y);
        if (dx > dy) event.stopPropagation();
    };

    const brandItems = useMemo(
        () =>
            (routes || [])
                .map((route, index) => ({
                    route,
                    name: names?.[index],
                    logo: texts?.[index]
                        ? resolveUrl(texts[index])
                        : route
                            ? brandLogos?.[toAbsRoute(route)]
                            : null,
                }))
                .filter((item) => item.route && item.name && item.logo),
        [routes, names, texts]
    );

    const heroCollectionsAll = useMemo(() => {
        const items = [...(heroCollections || [])].filter(
            (item) => item && item.route && item.brand && item.collection
        );

        const seen = new Set();
        const out = [];
        for (const item of items) {
            const key = `${normalizeBrand(item.brand)}__${String(item.collection).trim().toUpperCase()}`;
            if (seen.has(key)) continue;
            seen.add(key);
            out.push(item);
        }
        return out;
    }, [heroCollections]);

    const heroCollectionsPair = useMemo(() => {
        const bassari = heroCollectionsAll.filter((item) => normalizeBrand(item.brand) === "BASSARI");
        const flamenco = heroCollectionsAll.filter((item) => normalizeBrand(item.brand) === "FLAMENCO");

        const pickBassari = pickRandom(bassari);
        const pickFlamenco = pickRandom(flamenco);

        const pair = [];
        if (pickBassari) pair.push(pickBassari);
        if (pickFlamenco) pair.push(pickFlamenco);

        if (pair.length < 2) {
            const rest = heroCollectionsAll.filter(
                (item) => !pair.some((picked) => picked.brand === item.brand && picked.collection === item.collection)
            );
            const extra = pickRandom(rest);
            if (extra) pair.push(extra);
        }

        return pair.slice(0, 2);
    }, [heroCollectionsAll]);

    const currentBrandName = useMemo(() => {
        if (currentSlide === 0) return "";
        return slides?.[currentSlide - 1]?.name || "";
    }, [currentSlide, slides]);

    const fallbackHeroImage = useMemo(() => {
        return rawSelectedImages?.[0] ? resolveUrl(rawSelectedImages[0]) : null;
    }, [rawSelectedImages]);

    // ✅ Nuevo: navegación a /coleccion usando config, con fallback a /products
    const goToColeccion = useCallback(
        (collectionName) => {
            navigate(`/coleccion/${encodeURIComponent(collectionName)}`);
        },
        [navigate]
    );

    return (
        <div className="relative h-screen overflow-hidden w-full touch-pan-y" ref={containerRef}>
            <div
                className="flex flex-col transition-transform duration-700 ease-in-out"
                style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
            >
                {/* ===================== HERO (slide 0) ===================== */}
                <div className="h-screen w-full relative">
                    {heroCollectionsPair.length > 0 ? (
                        <div className="absolute inset-0 grid md:grid-cols-2">
                            {heroCollectionsPair.map((item, index) => (
                                <button
                                    key={`${item.brand}-${item.collection}`}
                                    type="button"
                                    onClick={() => safeNavigate(item.route)}
                                    className="relative group"
                                >
                                    <img
                                        src={resolveUrl(item.image)}
                                        alt={t("home.hero.collectionAlt", "{{brand}} {{collection}}", {
                                            brand: item.brand,
                                            collection: item.collection,
                                        })}
                                        className="h-full w-full object-cover object-center"
                                        loading={index === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                        fetchPriority={index === 0 ? "high" : "auto"}
                                        draggable={false}
                                    />
                                    <div className="absolute inset-0 bg-black/35 transition group-hover:bg-black/25" />
                                </button>
                            ))}
                            {heroCollectionsPair.length < 2 && <div className="hidden md:block bg-neutral-900" />}
                        </div>
                    ) : (
                        <div className="absolute inset-0">
                            {fallbackHeroImage ? (
                                <img
                                    src={fallbackHeroImage}
                                    alt={t("home.hero.imageAlt", "Home hero")}
                                    className="w-full h-full object-cover object-center"
                                    loading="eager"
                                    decoding="async"
                                    fetchPriority="high"
                                    draggable={false}
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-900" />
                            )}
                            <div className="absolute inset-0 bg-black/35" />
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/15" />

                    <div className="absolute inset-0 flex items-end">
                        <div className="w-full px-4 pb-12 sm:px-6 sm:pb-14 md:px-12 md:pb-16 lg:px-20 lg:pb-20">
                            <div className="max-w-[92vw] sm:max-w-3xl text-white">
                                <h2 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-6xl font-semibold leading-[1.05]">
                                    {t("home.hero.title", "Nuevas colecciones")}
                                </h2>

                                {heroCollectionsAll.length > 0 && (
                                    <div className="mt-5 sm:mt-8">
                                        {/* MOBILE ticker */}
                                        <div className="sm:hidden -mx-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] uppercase tracking-[0.35em] text-white/70 shrink-0">
                                                    {t("home.hero.newCollections", "Nuevas")}
                                                </span>

                                                <div
                                                    className="flex-1 overflow-x-auto whitespace-nowrap touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none]"
                                                    style={{ WebkitOverflowScrolling: "touch" }}
                                                    onTouchStart={handleTickerTouchStart}
                                                    onTouchMove={handleTickerTouchMove}
                                                >
                                                    <style>{`
                            .hide-scrollbar::-webkit-scrollbar { display: none; height: 0; width: 0; }
                          `}</style>

                                                    <div className="hide-scrollbar inline-flex gap-2 pr-6">
                                                        {heroCollectionsAll.map((item) => {
                                                            const brandUp = normalizeBrand(item.brand);
                                                            const shortBrand =
                                                                brandUp === "BASSARI" ? "BAS" : brandUp === "FLAMENCO" ? "FLA" : brandUp.slice(0, 3);

                                                            return (
                                                                <button
                                                                    key={`${item.brand}-${item.collection}-ticker`}
                                                                    type="button"
                                                                    onClick={() => goToColeccion(item.collection)}
                                                                    className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white border border-white/20 transition hover:bg-white/20 active:scale-[0.99]"
                                                                >
                                                                    <span className="opacity-80">{shortBrand}</span>
                                                                    <span className="opacity-50">·</span>
                                                                    <span className="max-w-[42vw] truncate">{item.collection}</span>
                                                                </button>

                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* DESKTOP chips (se queda a products como antes) */}
                                        <div className="hidden sm:flex flex-wrap gap-2 sm:gap-4">
                                            {heroCollectionsAll.map((item) => (
                                                <button
                                                    key={`${item.brand}-${item.collection}-chip-desktop`}
                                                    type="button"
                                                    onClick={() => goToColeccion(item.collection)}
                                                    className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gray-900 shadow-md transition hover:bg-white"
                                                >
                                                    <span className="whitespace-nowrap">{item.brand}</span>
                                                    <span className="h-1 w-1 rounded-full bg-gray-900/60" />
                                                    <span className="tracking-[0.15em]">{item.collection}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/products")}
                                        className="px-5 py-3 rounded-full border border-white/70 text-white hover:bg-white/10 transition"
                                    >
                                        {t("home.hero.ctaCatalog", "Explorar catálogo")}
                                    </button>
                                </div>

                                <div className="mt-7 sm:mt-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/70">
                                        {t("home.brandLogos.label", "Marcas")}
                                    </span>
                                    <div className="flex flex-wrap gap-4 sm:gap-6">
                                        {brandItems.map((brand) => (
                                            <button
                                                key={brand.route}
                                                type="button"
                                                onClick={() => safeNavigate(brand.route)}
                                                className="group"
                                            >
                                                <img
                                                    src={brand.logo}
                                                    alt={t("home.brandLogos.alt", "{{brand}} logo", { brand: brand.name })}
                                                    className="h-7 sm:h-8 md:h-10 opacity-90 transition group-hover:opacity-100"
                                                    loading="lazy"
                                                    decoding="async"
                                                    draggable={false}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===================== SLIDES MARCAS (desde slide 1) ===================== */}
                {slides.map((s, pos) => {
                    const imgSrc = s.image ? resolveUrl(s.image) : "";
                    const textImg = s.text ? resolveUrl(s.text) : "";

                    const brandKey = String(s.name || "").trim().toUpperCase();
                    const esCJM = brandKey === "CJM";

                    const overlay = textImg ? (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-[0%] -translate-y-1/2 text-center w-[86%] sm:w-[80%] lg:w-[35%] p-4">
                            <img
                                src={textImg}
                                alt={s.name || ""}
                                onClick={() => safeNavigate(s.route)}
                                draggable={false}
                                className={`cursor-pointer mx-auto h-auto ${isMobile ? (esCJM ? "w-[160px]" : "w-[200px]") : esCJM ? "w-[150px]" : "w-[400px]"
                                    }`}
                            />
                        </div>
                    ) : null;

                    return (
                        <div key={`${s.idx}-${pos}`} className="h-screen w-full relative">
                            {imgSrc ? (
                                <img
                                    src={imgSrc}
                                    alt={`Slide ${s.name || s.idx}`}
                                    className="w-full h-full object-cover object-center cursor-pointer"
                                    onClick={() => safeNavigate(s.route)}
                                    draggable={false}
                                    loading={pos === 0 ? "eager" : "lazy"}
                                    decoding="async"
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-white/80">
                                    Imagen no disponible
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                            {overlay}
                        </div>
                    );
                })}
            </div>

            {/* Indicadores móviles */}
            {totalSlides > 1 && (
                <div className="absolute right-2 top-1/4 md:hidden transition-opacity duration-300">
                    <span className="block text-white font-bold rotate-90 mb-20" style={{ width: "1em" }}>
                        {currentBrandName}
                    </span>

                    {Array.from({ length: totalSlides }).map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full mb-2 ${idx === currentSlide ? "bg-white" : "bg-white/50"}`}
                        />
                    ))}
                </div>
            )}

            {/* Dots desktop */}
            {totalSlides > 0 && (
                <div className="absolute bottom-5 left-0 right-6 hidden md:flex justify-center space-x-8">
                    <span
                        onClick={() => setCurrentSlide(0)}
                        className={`cursor-pointer transition-colors ${currentSlide === 0 ? "text-black font-bold" : "text-white/50"
                            }`}
                    >
                        {t("home.dots.home", "Home")}
                    </span>

                    {slides.map((s, idx) => {
                        const slideIndex = idx + 1;
                        return (
                            <span
                                key={`${s.idx}-dot`}
                                onClick={() => setCurrentSlide(slideIndex)}
                                className={`cursor-pointer transition-colors ${slideIndex === currentSlide ? "text-black font-bold" : "text-white/50"
                                    }`}
                            >
                                {s.name || ""}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CarruselHome;
