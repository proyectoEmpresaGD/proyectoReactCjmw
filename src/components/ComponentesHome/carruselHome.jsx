// src/components/ComponentesHome/carruselHome.jsx
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { cdnUrl } from "../../Constants/cdn";
import { brandLogos } from "../../Constants/constants";

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

const brandCodeByName = {
    BASSARI: "BAS",
    FLAMENCO: "FLA",
    HARBOUR: "HAR",
    ARENA: "ARE",
    CJM: "CJM",
};

const buildProductUrl = ({ brand }) => {
    const params = new URLSearchParams();
    const brandCode = brandCodeByName[normalizeBrand(brand)];
    if (brandCode) params.set("brand", brandCode);
    return `/products?${params.toString()}`;
};

const CarruselHome = ({
    imagesMobile = [],
    imagesDesktop = [],
    texts = [],
    names = [],
    routes = [],
    newCollectionsByBrand = {},
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation('common');
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

    // ✅ Solo las marcas que quieres ahora
    const ORDER = useMemo(() => ["BASSARI", "FLAMENCO", "HARBOUR", "ARENA", "CJM"], []);

    const slides = useMemo(() => {
        const nameToIndex = new Map();
        (names || []).forEach((n, idx) => {
            if (!n) return;
            nameToIndex.set(String(n).trim().toUpperCase(), idx);
        });

        const label = isMobile
            ? t("home.spotlight.labelShort", "Nuevas")
            : t("home.spotlight.label", "Nuevas colecciones");

        const out = [];
        for (const key of ORDER) {
            const idx = nameToIndex.get(key);
            if (typeof idx !== "number") continue;

            const route = routes?.[idx];
            if (!route) continue;

            const collections = newCollectionsByBrand?.[key] || [];

            out.push({
                idx,
                name: names[idx],
                image: rawSelectedImages[idx],
                text: texts?.[idx],
                route,
                spotlight: collections.length ? { label, items: collections } : null,
            });
        }

        return out;
    }, [ORDER, names, rawSelectedImages, texts, routes, newCollectionsByBrand, isMobile, t]);

    const totalSlides = slides.length;

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

    const safeNavigate = useCallback(
        (route) => {
            const abs = toAbsRoute(route);
            if (!abs) return;
            if (movedRef.current) return;
            navigate(abs);
        },
        [navigate]
    );

    const goToColeccion = useCallback(
        (collectionName) => {
            navigate(`/coleccion/${encodeURIComponent(collectionName)}`);
        },
        [navigate]
    );

    const goToBrandProducts = useCallback(
        (brandName) => {
            navigate(buildProductUrl({ brand: brandName }));
        },
        [navigate]
    );

    const currentBrandName = useMemo(() => slides?.[currentSlide]?.name || "", [currentSlide, slides]);

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

    if (totalSlides === 0) return null;

    return (
        <div className="relative h-screen overflow-hidden w-full touch-pan-y" ref={containerRef}>
            <div
                className="flex flex-col transition-transform duration-700 ease-in-out"
                style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
            >
                {slides.map((s, pos) => {
                    const imgSrc = s.image ? resolveUrl(s.image) : "";
                    const textImg = s.text ? resolveUrl(s.text) : "";

                    const brandKey = String(s.name || "").trim().toUpperCase();
                    const esCJM = brandKey === "CJM";

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

                            {/* Overlay logo (igual que ahora) */}
                            {textImg && (
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-[28%] md:bottom-0 -translate-y-1/2 text-center w-[86%] sm:w-[80%] lg:w-[35%] p-4">
                                    <img
                                        src={textImg}
                                        alt={s.name || ""}
                                        onClick={() => safeNavigate(s.route)}
                                        draggable={false}
                                        className={`cursor-pointer mx-auto h-auto ${isMobile ? (esCJM ? "w-[160px]" : "w-[200px]") : esCJM ? "w-[150px]" : "w-[400px]"
                                            }`}
                                    />
                                </div>
                            )}

                            {/* ✅ Nuevas colecciones + botón Explora dentro de cada marca */}
                            <div className="absolute inset-x-0 bottom-10 sm:bottom-12 px-4 sm:px-6 md:px-10">
                                <div
                                    className="max-w-3xl text-white"
                                    onClick={(e) => e.stopPropagation()}
                                    role="presentation"
                                >
                                    {s.spotlight?.items?.length ? (
                                        <>
                                            <div className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/80">
                                                {s.spotlight.label}
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {s.spotlight.items.map((col) => (
                                                    <button
                                                        key={`${brandKey}-${col}`}
                                                        type="button"
                                                        onClick={() => goToColeccion(col)}
                                                        className="inline-flex items-center rounded-full bg-white/15 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-white border border-white/20 transition hover:bg-white/20 active:scale-[0.99]"
                                                    >
                                                        <span className="max-w-[70vw] sm:max-w-none truncate">{col}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    ) : null}

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={() => goToBrandProducts(s.name)}
                                            className="px-5 py-3 rounded-full border border-white/70 text-white hover:bg-white/10 transition"
                                        >
                                            {t("home.buttonExplore.text")}
                                        </button>
                                    </div>

                                    {/* Logos marcas (si quieres mantenerlos visibles como en home) */}
                                    {/* <div className="mt-6 hidden sm:flex items-center gap-6">
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
                                    </div> */}
                                </div>
                            </div>
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

            {/* Dots desktop (sin Home) */}
            {totalSlides > 1 && (
                <div className="absolute bottom-5 left-0 right-6 hidden md:flex justify-center space-x-8">
                    {slides.map((s, idx) => (
                        <span
                            key={`${s.idx}-dot`}
                            onClick={() => setCurrentSlide(idx)}
                            className={`cursor-pointer transition-colors ${idx === currentSlide ? "text-black font-bold" : "text-white/50"
                                }`}
                        >
                            {s.name || ""}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarruselHome;
