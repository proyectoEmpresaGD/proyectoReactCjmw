import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { cdnUrl } from "../../Constants/cdn";

const SWIPE_OPEN_TOLERANCE_PX = 10;

export default function DragImagenesColeccion({
    images = [],
    className = "",
    itemClassName = "",
    ariaLabel = "Carrusel de imágenes de la colección",
    rightOverflowVw = 22,
    containerMaxWidthRem = 72,
    containerPaddingRem = 1.5,
}) {
    const scrollerRef = useRef(null);

    const [lightboxIndex, setLightboxIndex] = useState(null);
    const isLightboxOpen = lightboxIndex != null;
    const [slideDir, setSlideDir] = useState("next"); // "next" | "prev"
    const [animKey, setAnimKey] = useState(0);

    const safeImages = useMemo(() => (images || []).filter(Boolean), [images]);

    const dragStateRef = useRef({
        isDown: false,
        startX: 0,
        startY: 0,
        startScrollLeft: 0,
        rafId: 0,
        pendingScrollLeft: null,
        moved: false,
        downIdx: null,
    });



    const closeLightbox = useCallback(() => setLightboxIndex(null), []);
    const openLightbox = useCallback((idx) => {
        setSlideDir("next");
        setAnimKey((k) => k + 1);
        setLightboxIndex(idx);
    }, []);


    const showPrev = useCallback(() => {
        setSlideDir("prev");
        setAnimKey((k) => k + 1);
        setLightboxIndex((i) => {
            if (i == null) return i;
            return (i - 1 + safeImages.length) % safeImages.length;
        });
    }, [safeImages.length]);

    const showNext = useCallback(() => {
        setSlideDir("next");
        setAnimKey((k) => k + 1);
        setLightboxIndex((i) => {
            if (i == null) return i;
            return (i + 1) % safeImages.length;
        });
    }, [safeImages.length]);


    // Reset scroll cuando cambia el set de imágenes
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollLeft = 0;
    }, [safeImages.length]);

    // Bloquear scroll body cuando el lightbox está abierto
    useEffect(() => {
        if (!isLightboxOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [isLightboxOpen]);

    // Teclado
    useEffect(() => {
        if (!isLightboxOpen) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowLeft") showPrev();
            if (e.key === "ArrowRight") showNext();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isLightboxOpen, closeLightbox, showPrev, showNext]);

    // Drag + open (delegación)
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        const scheduleScroll = (nextScrollLeft) => {
            dragStateRef.current.pendingScrollLeft = nextScrollLeft;
            if (dragStateRef.current.rafId) return;

            dragStateRef.current.rafId = window.requestAnimationFrame(() => {
                dragStateRef.current.rafId = 0;
                const pending = dragStateRef.current.pendingScrollLeft;
                if (pending == null) return;
                el.scrollLeft = pending;
                dragStateRef.current.pendingScrollLeft = null;
            });
        };

        const findIdxFromTarget = (target) => {
            if (!(target instanceof Element)) return null;
            const node = target.closest?.("[data-coleccion-idx]");
            if (!node) return null;
            const raw = node.getAttribute("data-coleccion-idx");
            const idx = Number(raw);
            return Number.isFinite(idx) ? idx : null;
        };

        const onPointerDown = (e) => {
            // botón principal
            if (typeof e.button === "number" && e.button !== 0) return;

            dragStateRef.current.isDown = true;
            dragStateRef.current.moved = false;

            dragStateRef.current.startX = e.clientX;
            dragStateRef.current.startY = e.clientY;
            dragStateRef.current.startScrollLeft = el.scrollLeft;

            // ✅ guardamos qué imagen se pulsó
            dragStateRef.current.downIdx = findIdxFromTarget(e.target);

            el.setPointerCapture?.(e.pointerId);
        };

        const stopDrag = () => {
            dragStateRef.current.isDown = false;
        };

        const onPointerMove = (e) => {
            if (!dragStateRef.current.isDown) return;

            const dx = e.clientX - dragStateRef.current.startX;
            const dy = e.clientY - dragStateRef.current.startY;

            if (Math.abs(dx) > SWIPE_OPEN_TOLERANCE_PX || Math.abs(dy) > SWIPE_OPEN_TOLERANCE_PX) {
                dragStateRef.current.moved = true;
            }

            // ✅ Solo prevenimos default cuando realmente estamos arrastrando (mantiene clicks)
            if (dragStateRef.current.moved) e.preventDefault();

            const walk = dx * 1.2;
            scheduleScroll(dragStateRef.current.startScrollLeft - walk);
        };

        const onPointerUp = (e) => {
            // ✅ abrir si NO hubo drag real y se pulsó una imagen válida
            const idx = dragStateRef.current.downIdx;

            const dx = Math.abs(e.clientX - dragStateRef.current.startX);
            const dy = Math.abs(e.clientY - dragStateRef.current.startY);
            const isTap = dx <= SWIPE_OPEN_TOLERANCE_PX && dy <= SWIPE_OPEN_TOLERANCE_PX;

            if (isTap && !dragStateRef.current.moved && idx != null) {
                openLightbox(idx);
            }

            dragStateRef.current.downIdx = null;
            stopDrag();
        };

        el.addEventListener("pointerdown", onPointerDown, { passive: false });
        el.addEventListener("pointermove", onPointerMove, { passive: false });
        el.addEventListener("pointerup", onPointerUp);
        el.addEventListener("pointercancel", onPointerUp);
        el.addEventListener("pointerleave", stopDrag);

        return () => {
            if (dragStateRef.current.rafId) window.cancelAnimationFrame(dragStateRef.current.rafId);
            el.removeEventListener("pointerdown", onPointerDown);
            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerup", onPointerUp);
            el.removeEventListener("pointercancel", onPointerUp);
            el.removeEventListener("pointerleave", stopDrag);
        };
    }, [openLightbox]);

    if (safeImages.length === 0) return null;

    const trackPaddingLeft = `clamp(${containerPaddingRem}rem, calc((100vw - ${containerMaxWidthRem}rem) / 2 + ${containerPaddingRem}rem), 9999px)`;
    const trackPaddingRight = `${rightOverflowVw}vw`;

    return (
        <>
            <section className={`overflow-hidden ${className}`}>
                <div
                    ref={scrollerRef}
                    role="region"
                    aria-label={ariaLabel}
                    className="cursor-grab active:cursor-grabbing select-none overflow-x-auto overscroll-x-contain"
                    style={{
                        WebkitOverflowScrolling: "touch",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        touchAction: "pan-y pinch-zoom",
                    }}
                >
                    <style>{`
          [data-hide-scrollbar]::-webkit-scrollbar { display: none; height: 0; width: 0; }
        `}</style>

                    <div
                        data-hide-scrollbar
                        className="flex gap-6 py-2"
                        style={{ paddingLeft: trackPaddingLeft, paddingRight: trackPaddingRight }}
                    >
                        {safeImages.map((src, idx) => (
                            <div
                                key={`${src}-${idx}`}
                                data-coleccion-idx={idx}
                                className={`
                relative shrink-0 rounded-3xl overflow-hidden
                border border-gray-200 bg-white
                ${itemClassName}
              `}
                                style={{
                                    width: "min(78vw, 420px)",
                                    transform: "translateZ(0)",
                                    willChange: "transform",
                                }}
                            >
                                <img
                                    src={cdnUrl(src)}
                                    alt={`Imagen ${idx + 1}`}
                                    className="h-[420px] w-full object-cover"
                                    draggable={false}
                                    loading={idx === 0 ? "eager" : "lazy"}
                                    decoding="async"
                                />
                                <div className="absolute inset-0 pointer-events-none" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LIGHTBOX */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Vista en pantalla completa"
                    onClick={closeLightbox}
                >
                    <style>{`
          @keyframes slideInNext {
            from { transform: translateX(8%); opacity: 0; }
            to   { transform: translateX(0);  opacity: 1; }
          }
          @keyframes slideInPrev {
            from { transform: translateX(-8%); opacity: 0; }
            to   { transform: translateX(0);   opacity: 1; }
          }
          .lb-img-next { animation: slideInNext 260ms ease-out; }
          .lb-img-prev { animation: slideInPrev 260ms ease-out; }
        `}</style>

                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="relative w-full h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
                            <img
                                key={animKey}
                                src={cdnUrl(safeImages[lightboxIndex])}
                                alt={`Imagen ${lightboxIndex + 1}`}
                                className={`w-full h-full object-contain ${slideDir === "next" ? "lb-img-next" : "lb-img-prev"
                                    }`}
                                draggable={false}
                            />

                            <button
                                type="button"
                                onClick={closeLightbox}
                                className="absolute top-3 right-3 rounded-full bg-white/10 hover:bg-white/15 text-white px-4 py-2 border border-white/20"
                            >
                                Cerrar
                            </button>

                            {safeImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={showPrev}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/15 text-white w-12 h-12 border border-white/20"
                                        aria-label="Anterior"
                                    >
                                        ←
                                    </button>
                                    <button
                                        type="button"
                                        onClick={showNext}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/15 text-white w-12 h-12 border border-white/20"
                                        aria-label="Siguiente"
                                    >
                                        →
                                    </button>
                                </>
                            )}

                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-xs tracking-[0.25em] uppercase">
                                {lightboxIndex + 1} / {safeImages.length}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}