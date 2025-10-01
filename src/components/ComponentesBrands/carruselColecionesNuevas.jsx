import React, {
    useEffect, useMemo, useRef, useState, forwardRef, useCallback
} from "react";

/** ---------- Mini Reveal (slide-up + fade) ---------- */
const Reveal = forwardRef(function Reveal(
    { children, className = "", delayMs = 0, durationMs = 700, distancePx = 24, once = true, as: As = "div", ...rest },
    externalRef
) {
    const localRef = useRef(null);
    const [visible, setVisible] = useState(false);

    const setRefs = useCallback((node) => {
        localRef.current = node;
        if (typeof externalRef === "function") externalRef(node);
        else if (externalRef && typeof externalRef === "object") externalRef.current = node;
    }, [externalRef]);

    useEffect(() => {
        const el = localRef.current;
        if (!el) return;

        const prefersReduced =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReduced) { setVisible(true); return; }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        if (once) io.unobserve(entry.target);
                    } else if (!once) setVisible(false);
                });
            },
            { root: null, rootMargin: "0px 0px -15% 0px", threshold: 0.1 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [once]);

    const style = {
        transitionProperty: "opacity, transform",
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: "ease-out",
        transitionDelay: `${delayMs}ms`,
        transform: visible ? "translateY(0px)" : `translateY(${distancePx}px)`,
        opacity: visible ? 1 : 0,
        willChange: "transform, opacity",
    };

    return (
        <As ref={setRefs} style={style} className={className} {...rest}>
            {children}
        </As>
    );
});

/**
 * Header centrado si cabe; scroll + gradientes + flechas (click y mantener) si desborda.
 */
export default function CarruselColeccionesNuevas({
    slides = [],
    durationMs = 7000,
    className = "",
    stickyHeader = false,
}) {
    const [activo, setActivo] = useState(0);
    const [paused, setPaused] = useState(false);

    // Timer
    const startMsRef = useRef(performance.now());
    const pausedAtMsRef = useRef(null);
    const pausedAccumMsRef = useRef(0);
    const timeoutRef = useRef(null);

    // Contenido (pausa)
    const contentRef = useRef(null);

    // Header scroll + UI
    const headerRef = useRef(null);
    const [canScroll, setCanScroll] = useState(false);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const updateHeaderOverflow = useCallback(() => {
        const el = headerRef.current;
        if (!el) return;
        const mayScroll = el.scrollWidth > el.clientWidth + 1;
        setCanScroll(mayScroll);
        setAtStart(el.scrollLeft <= 1);
        setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    }, []);

    useEffect(() => {
        updateHeaderOverflow();
        const onResize = () => updateHeaderOverflow();
        window.addEventListener("resize", onResize, { passive: true });
        return () => window.removeEventListener("resize", onResize);
    }, [slides.length, updateHeaderOverflow]);

    const onHeaderScroll = () => updateHeaderOverflow();

    const duracionActual = useMemo(
        () => slides[activo]?.durationMs ?? durationMs,
        [activo, slides, durationMs]
    );

    const clearTimer = () => {
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    };

    const scheduleNext = () => {
        clearTimer();
        const now = performance.now();
        const elapsed = now - startMsRef.current - pausedAccumMsRef.current;
        const remaining = Math.max(0, duracionActual - elapsed);
        timeoutRef.current = setTimeout(() => {
            setActivo((prev) => (prev + 1) % slides.length);
            startMsRef.current = performance.now();
            pausedAccumMsRef.current = 0;
            pausedAtMsRef.current = null;
            scheduleNext();
        }, remaining);
    };

    useEffect(() => {
        startMsRef.current = performance.now();
        pausedAccumMsRef.current = 0;
        pausedAtMsRef.current = null;
        setPaused(false);
        scheduleNext();
        return clearTimer;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activo, duracionActual, slides.length]);

    // Pausa / Reanuda
    const pause = () => { if (paused) return; setPaused(true); pausedAtMsRef.current = performance.now(); clearTimer(); };
    const resume = () => {
        if (!paused) return;
        const now = performance.now();
        const pausedAt = pausedAtMsRef.current ?? now;
        pausedAccumMsRef.current += now - pausedAt;
        pausedAtMsRef.current = null;
        setPaused(false);
        scheduleNext();
    };

    // Handlers de contenido (pausa sólo aquí)
    const onContentEnter = () => pause();
    const onContentLeave = () => resume();

    useEffect(() => {
        const handlePointerMove = (e) => {
            const el = contentRef.current; if (!el) return;
            const r = el.getBoundingClientRect();
            const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
            if (!inside && paused) resume();
        };
        const handleWindowLeave = () => { if (paused) resume(); };
        const handleVisibility = () => { if (document.hidden) pause(); else resume(); };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerleave", handleWindowLeave, { passive: true });
        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerleave", handleWindowLeave);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [paused]);

    const progressKey = `progress-${activo}`;
    const progressFillStyle = {
        animationName: "cjmwProgress",
        animationDuration: `${duracionActual}ms`,
        animationTimingFunction: "linear",
        animationIterationCount: 1,
        animationFillMode: "forwards",
        animationPlayState: paused ? "paused" : "running",
    };

    // ===== Header classes (centrado si cabe; izquierda + scroll si no) =====
    const headerBase = "px-6 pt-6 pb-3 whitespace-nowrap scroll-smooth scrollbar-hide";
    const headerWhenNoScroll = "flex items-end gap-6 overflow-x-hidden justify-center";
    const headerWhenScroll = "flex items-end gap-6 overflow-x-auto justify-start";

    // ===== Flechas: click (paso) + mantener (auto-scroll) =====
    const stepPx = 260;             // tamaño de paso por click
    const speedPxPerSec = 800;      // velocidad al mantener pulsado
    const rafRef = useRef(null);
    const holdDirRef = useRef(0);   // -1 izquierda, 1 derecha, 0 no

    const stopHoldScroll = useCallback(() => {
        holdDirRef.current = 0;
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }, []);

    const holdLoop = useCallback((lastTs) => {
        if (!headerRef.current) return;
        if (holdDirRef.current === 0) return;

        rafRef.current = requestAnimationFrame((ts) => {
            const dt = lastTs ? (ts - lastTs) / 1000 : 0;
            const delta = holdDirRef.current * speedPxPerSec * dt;
            headerRef.current.scrollLeft += delta;
            onHeaderScroll();
            // Parar si se alcanza extremo
            if ((holdDirRef.current < 0 && atStart) || (holdDirRef.current > 0 && atEnd)) {
                stopHoldScroll();
            } else {
                holdLoop(ts);
            }
        });
    }, [atStart, atEnd, onHeaderScroll, speedPxPerSec, stopHoldScroll]);

    const startHoldScroll = useCallback((dir) => {
        if (!canScroll) return;
        holdDirRef.current = dir;
        if (!rafRef.current) holdLoop();
    }, [canScroll, holdLoop]);

    // Eventos globales para soltar (mouse/touch fuera del botón)
    useEffect(() => {
        const cancel = () => stopHoldScroll();
        window.addEventListener("mouseup", cancel);
        window.addEventListener("mouseleave", cancel);
        window.addEventListener("touchend", cancel);
        window.addEventListener("touchcancel", cancel);
        return () => {
            window.removeEventListener("mouseup", cancel);
            window.removeEventListener("mouseleave", cancel);
            window.removeEventListener("touchend", cancel);
            window.removeEventListener("touchcancel", cancel);
        };
    }, [stopHoldScroll]);

    // Acciones de click
    const scrollLeftOnce = () => headerRef.current?.scrollBy({ left: -stepPx, behavior: "smooth" });
    const scrollRightOnce = () => headerRef.current?.scrollBy({ left: stepPx, behavior: "smooth" });

    return (
        <section
            className={`relative z-10 w-full min-h-[1200px] lg:min-h-screen bg-transparent ${className}`}
            aria-label="Carrusel de colecciones"
        >
            <style>{`@keyframes cjmwProgress { from { width: 0% } to { width: 100% } }`}</style>

            {/* ===== Header con centrado condicional + gradientes + flechas ===== */}
            <div className={`relative ${stickyHeader ? "sticky top-0 z-20" : ""}`}>
                {/* Flecha izquierda */}
                {canScroll && (
                    <button
                        type="button"
                        onClick={scrollLeftOnce}
                        onMouseDown={() => startHoldScroll(-1)}
                        onTouchStart={() => startHoldScroll(-1)}
                        onMouseUp={stopHoldScroll}
                        onTouchEnd={stopHoldScroll}
                        disabled={atStart}
                        aria-label="Desplazar pestañas a la izquierda"
                        className={[
                            "absolute left-1 top-1/2 -translate-y-1/2 select-none",
                            "rounded-full p-2 shadow-md transition-opacity",
                            atStart ? "opacity-0 pointer-events-none" : "opacity-100",
                            "bg-white/80 backdrop-blur-sm"
                        ].join(" ")}
                    >
                        <span className="block text-xl leading-none">‹</span>
                    </button>
                )}

                {/* Gradiente izquierda */}
                <div
                    className={[
                        "pointer-events-none absolute inset-y-0 left-0 w-8",
                        "bg-gradient-to-r from-white to-transparent",
                        "transition-opacity duration-200",
                        canScroll && !atStart ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                    aria-hidden="true"
                />

                {/* Gradiente derecha */}
                <div
                    className={[
                        "pointer-events-none absolute inset-y-0 right-0 w-8",
                        "bg-gradient-to-l from-white to-transparent",
                        "transition-opacity duration-200",
                        canScroll && !atEnd ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                    aria-hidden="true"
                />

                {/* Flecha derecha */}
                {canScroll && (
                    <button
                        type="button"
                        onClick={scrollRightOnce}
                        onMouseDown={() => startHoldScroll(1)}
                        onTouchStart={() => startHoldScroll(1)}
                        onMouseUp={stopHoldScroll}
                        onTouchEnd={stopHoldScroll}
                        disabled={atEnd}
                        aria-label="Desplazar pestañas a la derecha"
                        className={[
                            "absolute right-1 top-1/2 -translate-y-1/2 select-none",
                            "rounded-full p-2 shadow-md transition-opacity",
                            atEnd ? "opacity-0 pointer-events-none" : "opacity-100",
                            "bg-white/80 backdrop-blur-sm"
                        ].join(" ")}
                    >
                        <span className="block text-xl leading-none">›</span>
                    </button>
                )}

                <Reveal
                    ref={headerRef}
                    as="div"
                    once
                    delayMs={0}
                    durationMs={600}
                    distancePx={20}
                    onScroll={onHeaderScroll}
                    className={[
                        headerBase,
                        canScroll ? headerWhenScroll : headerWhenNoScroll,
                        "bg-transparent"
                    ].join(" ")}
                >
                    {slides.map((s, i) => {
                        const isActive = i === activo;
                        return (
                            <button
                                key={s.name + i}
                                onClick={() => {
                                    setActivo(i);
                                    startMsRef.current = performance.now();
                                    pausedAccumMsRef.current = 0;
                                    pausedAtMsRef.current = null;
                                    setPaused(false);
                                    scheduleNext();
                                }}
                                className={`group text-sm md:text-base font-medium tracking-wide uppercase ${isActive ? "text-black" : "text-black hover:text-grey-300"
                                    }`}
                                aria-current={isActive ? "true" : "false"}
                            >
                                <div className="text-center">{s.name}</div>
                                <div className="mt-2 h-1.5 w-40 md:w-56 rounded-full bg-white/25 overflow-hidden">
                                    {isActive ? (
                                        <div
                                            key={progressKey}
                                            className="h-full rounded-full bg-gray-200"
                                            style={progressFillStyle}
                                        />
                                    ) : (
                                        <div className="h-full rounded-full bg-white/0" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </Reveal>
            </div>

            {/* ===== CONTENIDO (pausa al hover) ===== */}
            <div className="w-full">
                <div className="max-w-7xl w-full mx-auto px-4 md:px-8 text-black">
                    <Reveal
                        ref={contentRef}
                        as="div"
                        once
                        delayMs={100}
                        durationMs={700}
                        distancePx={24}
                        className="relative w-full"
                    >
                        <div onPointerEnter={onContentEnter} onPointerLeave={onContentLeave} className="relative w-full">
                            {slides[activo]?.render?.()}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
