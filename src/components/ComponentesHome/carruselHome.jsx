// src/components/ComponentesHome/carruselHome.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cdnUrl } from "../../Constants/cdn";

const SWIPE_THRESHOLD_PX = 50; // cuánto hay que arrastrar para cambiar slide
const TAP_MOVE_TOLERANCE_PX = 12; // tolerancia para considerar "tap"
const SCROLL_LOCK_MS = 500; // anti spam wheel

/**
 * CarruselHome
 * - Slider vertical a pantalla completa
 * - Tap vs Swipe:
 *   - Tap real => navega (imagen y logo)
 *   - Swipe vertical => cambia slide, NO navega
 * - Orden: Bassari, Flamenco, Arena, Harbour, CJM
 * - NO muestra slides extra sin ruta / que no pertenezcan a esas marcas
 */
const CarruselHome = ({
    imagesMobile = [],
    imagesDesktop = [],
    texts = [],
    names = [],
    routes = [],
}) => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    // isMobile
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function")
            return false;
        return window.matchMedia("(max-width: 768px)").matches;
    });

    // Refs para gestos
    const isScrollingRef = useRef(false);
    const containerRef = useRef(null);
    const touchStart = useRef({ x: 0, y: 0 });
    const touchLast = useRef({ x: 0, y: 0 });
    const movedRef = useRef(false);

    // Detectar cambio mobile/desktop
    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function")
            return;
        const mq = window.matchMedia("(max-width: 768px)");
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener?.("change", handler);
        mq.addListener?.(handler); // fallback Safari
        return () => {
            mq.removeEventListener?.("change", handler);
            mq.removeListener?.(handler);
        };
    }, []);

    // Elegir imágenes según device
    const rawSelectedImages = useMemo(
        () => (isMobile ? imagesMobile : imagesDesktop),
        [isMobile, imagesMobile, imagesDesktop]
    );

    // Orden fijo
    const ORDER = useMemo(() => ["BASSARI", "FLAMENCO", "ARENA", "HARBOUR", "CJM"], []);

    /**
     * Slides finales:
     * - Solo las del ORDER
     * - Solo si tienen route válido (para evitar la “última imagen que no va a ningún lado”)
     */
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
            if (!route) continue; // ✅ si no hay ruta, no se muestra

            out.push({
                idx,
                name: names[idx],
                image: rawSelectedImages[idx],
                text: texts?.[idx],
                route,
            });
        }

        return out;
    }, [ORDER, names, rawSelectedImages, texts, routes]);

    // Si cambia número de slides, evitar out of bounds
    useEffect(() => {
        if (currentSlide > slides.length - 1) setCurrentSlide(0);
    }, [slides.length, currentSlide]);

    // Wheel scroll
    useEffect(() => {
        const cnt = containerRef.current;
        if (!cnt) return;

        const handleWheel = (e) => {
            e.preventDefault?.();
            if (isScrollingRef.current) return;

            const dir = e.deltaY > 0 ? 1 : -1;

            isScrollingRef.current = true;
            setCurrentSlide((prev) => {
                if (dir === 1 && prev < slides.length - 1) return prev + 1;
                if (dir === -1 && prev > 0) return prev - 1;
                return prev;
            });

            window.setTimeout(() => {
                isScrollingRef.current = false;
            }, SCROLL_LOCK_MS);
        };

        cnt.addEventListener("wheel", handleWheel, { passive: false });
        return () => cnt.removeEventListener("wheel", handleWheel);
    }, [slides.length]);

    // Touch gestures
    useEffect(() => {
        const cnt = containerRef.current;
        if (!cnt) return;

        const onStart = (e) => {
            if (!e.touches?.[0]) return;
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
            touchLast.current = { x: t.clientX, y: t.clientY };
            movedRef.current = false;
        };

        const onMove = (e) => {
            if (!e.touches?.[0]) return;
            const t = e.touches[0];
            touchLast.current = { x: t.clientX, y: t.clientY };

            const dx = Math.abs(touchLast.current.x - touchStart.current.x);
            const dy = Math.abs(touchLast.current.y - touchStart.current.y);

            if (dx > TAP_MOVE_TOLERANCE_PX || dy > TAP_MOVE_TOLERANCE_PX) {
                movedRef.current = true;
            }
        };

        const onEnd = () => {
            const dy = touchStart.current.y - touchLast.current.y;

            if (dy > SWIPE_THRESHOLD_PX && currentSlide < slides.length - 1) {
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
    }, [currentSlide, slides.length]);

    // Navegación segura (tap real)
    const safeNavigate = (route) => {
        if (!route) return;
        if (movedRef.current) return; // ✅ si fue swipe, no navegamos
        navigate(route);
    };

    return (
        <div className="relative h-screen overflow-hidden w-full" ref={containerRef}>
            <div
                className="flex flex-col transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
            >
                {slides.map((s, pos) => {
                    const imgSrc = s.image ? cdnUrl(s.image) : null;
                    const textImg = s.text ? cdnUrl(s.text) : null;

                    const brandKey = String(s.name || "").trim().toUpperCase();
                    const esCJM = brandKey === "CJM";
                    const isBassariOrFlamenco = brandKey === "BASSARI" || brandKey === "FLAMENCO";

                    // ✅ Overlay ajustado:
                    // - En móvil: logos más pequeños en general
                    // - En móvil: Bassari y Flamenco centrados verticalmente
                    // - En desktop: comportamiento original
                    const overlay = textImg ? (
                        <div
                            className={`
                absolute
                left-1/2 -translate-x-1/2
                text-center
                w-[80%] lg:w-[35%]
                p-4
                ${isMobile
                                    ? isBassariOrFlamenco
                                        ? "top-1/2 -translate-y-1/2"
                                        : "bottom-[15%]"
                                    : "bottom-[5%]"
                                }
              `}
                        >
                            <img
                                src={textImg}
                                alt={s.name || ""}
                                onClick={() => safeNavigate(s.route)}
                                draggable={false}
                                className={`
                  cursor-pointer mx-auto h-auto
                  ${isMobile
                                        ? esCJM
                                            ? "w-[180px]"
                                            : "w-[220px]"
                                        : esCJM
                                            ? "w-[250px]"
                                            : "w-[400px]"
                                    }
                `}
                            />
                        </div>
                    ) : null;

                    return (
                        <div key={`${s.idx}-${pos}`} className="h-screen w-full relative">
                            {imgSrc ? (
                                <img
                                    src={imgSrc}
                                    alt={`Slide ${s.name || s.idx}`}
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => safeNavigate(s.route)}
                                    draggable={false}
                                />
                            ) : (
                                <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                                    Imagen no disponible
                                </div>
                            )}
                            {overlay}
                        </div>
                    );
                })}
            </div>

            {/* Indicadores móviles */}
            {slides.length > 1 && (
                <div className="absolute right-2 top-1/4 md:hidden transition-opacity duration-300">
                    <span className="block text-white font-bold rotate-90 mb-20" style={{ width: "1em" }}>
                        {slides?.[currentSlide]?.name || ""}
                    </span>
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full mb-2 ${idx === currentSlide ? "bg-white" : "bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Dots desktop */}
            {slides.length > 0 && (
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
