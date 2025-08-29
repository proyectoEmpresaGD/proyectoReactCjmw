import React, { useEffect, useMemo, useRef, useState, forwardRef, useCallback } from "react";

/** ---------- Mini Reveal (slide-up + fade) ---------- */
const Reveal = forwardRef(function Reveal(
    {
        children,
        className = "",
        delayMs = 0,
        durationMs = 700,
        distancePx = 24,
        once = true,
        as: As = "div",
    },
    externalRef
) {
    const localRef = useRef(null);
    const [visible, setVisible] = useState(false);

    // Bridge para soportar ref externo (contentRef del carrusel) y ref interno del observer
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

        if (prefersReduced) {
            setVisible(true);
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        if (once) io.unobserve(entry.target);
                    } else if (!once) {
                        setVisible(false);
                    }
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
        <As ref={setRefs} style={style} className={className}>
            {children}
        </As>
    );
});

/**
 * Carrusel con Reveal en header y contenido:
 * - El header y el slide actual aparecen con slide-up + fade al entrar en viewport.
 * - La zona de contenido sigue pausando/reanudando el timer al pasar el puntero encima.
 */
export default function CarruselColeccionesNuevas({
    slides = [],
    durationMs = 7000,
    className = "",
    stickyHeader = false,
}) {
    const [activo, setActivo] = useState(0);
    const [paused, setPaused] = useState(false);

    // Reloj monotónico + timeout para cambio de slide
    const startMsRef = useRef(performance.now());
    const pausedAtMsRef = useRef(null);
    const pausedAccumMsRef = useRef(0);
    const timeoutRef = useRef(null);

    // Ref a la ZONA DE CONTENIDO (lo que debe pausar)
    const contentRef = useRef(null);

    const duracionActual = useMemo(
        () => slides[activo]?.durationMs ?? durationMs,
        [activo, slides, durationMs]
    );

    const clearTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
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
    const pause = () => {
        if (paused) return;
        setPaused(true);
        pausedAtMsRef.current = performance.now();
        clearTimer();
    };

    const resume = () => {
        if (!paused) return;
        const now = performance.now();
        const pausedAt = pausedAtMsRef.current ?? now;
        pausedAccumMsRef.current += now - pausedAt;
        pausedAtMsRef.current = null;
        setPaused(false);
        scheduleNext();
    };

    // Handlers de la ZONA DE CONTENIDO (pausa sólo aquí)
    const onContentEnter = () => pause();
    const onContentLeave = () => resume();

    // Fallbacks robustos:
    useEffect(() => {
        const handlePointerMove = (e) => {
            const el = contentRef.current;
            if (!el) return;
            const r = el.getBoundingClientRect();
            const inside =
                e.clientX >= r.left && e.clientX <= r.right &&
                e.clientY >= r.top && e.clientY <= r.bottom;
            if (!inside && paused) resume();
        };

        const handleWindowLeave = () => {
            if (paused) resume();
        };

        const handleVisibility = () => {
            if (document.hidden) {
                pause();
            } else {
                const el = contentRef.current;
                if (!el) return resume();
                resume();
            }
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerleave", handleWindowLeave, { passive: true });
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerleave", handleWindowLeave);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [paused]);

    // Forzar reinicio de la animación de la barra al cambiar de slide:
    const progressKey = `progress-${activo}`;

    // Estilos de animación CSS de la barra
    const progressFillStyle = {
        animationName: "cjmwProgress",
        animationDuration: `${duracionActual}ms`,
        animationTimingFunction: "linear",
        animationIterationCount: 1,
        animationFillMode: "forwards",
        animationPlayState: paused ? "paused" : "running",
    };

    return (
        <section
            className={`relative z-10 w-full min-h-[1200px] lg:min-h-screen bg-transparent ${className}`}
            aria-label="Carrusel de colecciones"
        >
            {/* Keyframes inline */}
            <style>{`
        @keyframes cjmwProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>

            {/* Header con aparición desde abajo */}
            <Reveal
                as="div"
                once
                delayMs={0}
                durationMs={600}
                distancePx={20}
                className={[
                    "flex justify-center gap-6 items-end px-6 pt-6 pb-3",
                    stickyHeader ? "sticky top-0 z-20 bg-transparent" : "",
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
                            className={`group text-sm md:text-base font-medium tracking-wide uppercase ${isActive ? "text-white" : "text-white/80 hover:text-white"
                                }`}
                            aria-current={isActive ? "true" : "false"}
                        >
                            <div className="text-center">{s.name}</div>
                            <div className="mt-2 h-1.5 w-40 md:w-56 rounded-full bg-white/25 overflow-hidden">
                                {isActive ? (
                                    <div
                                        key={progressKey}
                                        className="h-full rounded-full bg-white"
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

            {/* Gradiente visual, no intercepta eventos */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20" />

            {/* CONTENIDO: aparece desde abajo + pausa al hover */}
            <div className="w-full">
                <div className="max-w-7xl w-full mx-auto px-4 md:px-8">
                    <Reveal
                        // reuse del mismo wrapper para animación y pausa
                        ref={contentRef}
                        as="div"
                        once
                        delayMs={100}
                        durationMs={700}
                        distancePx={24}
                        className="relative w-full"
                    >
                        <div
                            onPointerEnter={onContentEnter}
                            onPointerLeave={onContentLeave}
                            className="relative w-full"
                        >
                            {slides[activo]?.render?.()}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
