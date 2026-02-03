export default ColeccionesMarcaPage;


import { useEffect, useMemo, useRef, useState } from "react";

/* -----------------------------------------
  Hooks & helpers
----------------------------------------- */
const usePrefersReducedMotion = () => {
    const [reduce, setReduce] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        const apply = () => setReduce(Boolean(mq?.matches));
        apply();
        mq?.addEventListener?.("change", apply);
        return () => mq?.removeEventListener?.("change", apply);
    }, []);
    return reduce;
};

const Reveal = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true);
                    io.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
        >
            {children}
        </div>
    );
};

const LockBodyScroll = (locked) => {
    useEffect(() => {
        if (!locked) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [locked]);
};

/* -----------------------------------------
  Lightbox (simple, premium)
----------------------------------------- */
const ImageLightbox = ({ isOpen, images, index, onClose, onPrev, onNext, title }) => {
    const overlayRef = useRef(null);
    const [zoom, setZoom] = useState(false);

    LockBodyScroll(isOpen);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
            if (e.key === "ArrowLeft") onPrev?.();
            if (e.key === "ArrowRight") onNext?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose, onPrev, onNext]);

    useEffect(() => {
        if (!isOpen) setZoom(false);
    }, [isOpen]);

    if (!isOpen) return null;

    const src = images?.[index] || null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-[2px] flex items-center justify-center p-4"
            onMouseDown={(e) => {
                // cerrar solo si clicas el overlay, no el contenido
                if (e.target === overlayRef.current) onClose?.();
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Vista ampliada de imagen"
        >
            <div className="relative w-full max-w-6xl">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-3">
                    <div className="text-white/90 text-sm">
                        {title ? <span className="font-semibold">{title}</span> : null}
                        <span className="ml-3 text-white/60">
                            {index + 1}/{images?.length || 1}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="h-10 w-10 rounded-full border border-white/20 text-white hover:bg-white/10 transition flex items-center justify-center"
                        aria-label="Cerrar"
                        title="Cerrar (Esc)"
                    >
                        ✕
                    </button>
                </div>

                {/* Image */}
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black">
                    <div className="relative max-h-[78vh] min-h-[40vh] flex items-center justify-center">
                        {src ? (
                            <img
                                src={src}
                                alt={title || "Imagen ampliada"}
                                className={`max-h-[78vh] w-auto max-w-full select-none ${zoom ? "scale-[2]" : "scale-100"
                                    } transition-transform duration-300 ease-out cursor-zoom-in`}
                                style={{
                                    transformOrigin: "center center",
                                }}
                                onDoubleClick={() => setZoom((z) => !z)}
                                draggable={false}
                            />
                        ) : (
                            <div className="text-white/70 p-10">Imagen no disponible</div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="absolute inset-y-0 left-0 flex items-center px-2">
                        <button
                            onClick={onPrev}
                            className="h-10 w-10 rounded-full border border-white/20 text-white hover:bg-white/10 transition flex items-center justify-center disabled:opacity-40"
                            disabled={!images?.length || images.length <= 1}
                            aria-label="Anterior"
                            title="Anterior (←)"
                        >
                            ←
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2">
                        <button
                            onClick={onNext}
                            className="h-10 w-10 rounded-full border border-white/20 text-white hover:bg-white/10 transition flex items-center justify-center disabled:opacity-40"
                            disabled={!images?.length || images.length <= 1}
                            aria-label="Siguiente"
                            title="Siguiente (→)"
                        >
                            →
                        </button>
                    </div>

                    {/* Hint */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs">
                        Doble click / doble tap para {zoom ? "salir de zoom" : "zoom"}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* -----------------------------------------
  BassariEditorialStory
----------------------------------------- */
export default function BassariEditorialStory({
    title,
    subtitle,
    images = [],
    headerOffset = 110,
    chapters,
}) {
    const reduceMotion = usePrefersReducedMotion();
    const containerRef = useRef(null);
    const chapterRefs = useRef([]);
    const [active, setActive] = useState(0);
    const [open, setOpen] = useState(null);

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const content = useMemo(
        () =>
            chapters?.length
                ? chapters
                : [
                    {
                        kicker: "CAPÍTULO I",
                        title: "Origen — tradición y memoria",
                        text:
                            "La colección nace de un imaginario donde la materia y el símbolo se convierten en diseño. Una narrativa serena, contemporánea y profundamente artesanal.",
                        more:
                            "El lujo no se impone: se revela en la textura, el ritmo y la contención. Pensado para espacios donde el material habla por sí mismo.",
                        imgIndex: 0,
                    },
                    {
                        kicker: "CAPÍTULO II",
                        title: "El Nilo — líneas en movimiento",
                        text:
                            "Patrones que avanzan con equilibrio y continuidad. Geometría calmada para vestir el espacio con presencia y elegancia.",
                        more:
                            "El contraste es medido, la repetición se vuelve arquitectura. El textil se entiende como superficie viva y sofisticada.",
                        imgIndex: 1,
                    },
                    {
                        kicker: "CAPÍTULO III",
                        title: "Wolof — identidad contemporánea",
                        text:
                            "Códigos culturales reinterpretados con sutileza. Una identidad gráfica con carácter, auténtica y refinada.",
                        more:
                            "Las referencias no se ilustran: se sugieren. La personalidad aparece en el detalle, nunca en lo evidente.",
                        imgIndex: 2,
                    },
                    {
                        kicker: "CAPÍTULO IV",
                        title: "Esencia — materia y luz",
                        text:
                            "Una paleta cálida y profunda. Texturas diseñadas para ser vistas y, sobre todo, sentidas.",
                        more:
                            "Acabados que elevan el conjunto sin estridencias. Un lujo discreto que se aprecia al acercarse.",
                        imgIndex: 3,
                    },
                ],
        [chapters]
    );

    // Autopause/resume del carrusel externo mientras el bloque esté visible
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([e]) => {
                window.dispatchEvent(
                    new CustomEvent(e.isIntersecting ? "carousel-pause" : "carousel-resume")
                );
            },
            { threshold: 0.25 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Detectar capítulo activo por scroll
    useEffect(() => {
        let raf = 0;

        const compute = () => {
            const anchor = (window.innerHeight || 1) * 0.38;
            let best = 0;
            let bestDist = Infinity;

            for (let i = 0; i < content.length; i++) {
                const node = chapterRefs.current[i];
                if (!node) continue;
                const r = node.getBoundingClientRect();
                const d = Math.abs(r.top - anchor);
                if (d < bestDist) {
                    bestDist = d;
                    best = i;
                }
            }
            setActive(best);
        };

        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(compute);
        };

        compute();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [content.length]);

    const mediaFallback = (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#faf7f2,transparent_55%),radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.06),transparent_60%)]" />
    );

    // Abrir lightbox con un índice real de images[]
    const openLightboxForChapter = (chapterIdx) => {
        const imgIdx = content?.[chapterIdx]?.imgIndex ?? chapterIdx;
        const src = images?.[imgIdx];
        if (!src) return; // si no hay imagen, no abrimos
        setLightboxIndex(imgIdx);
        setLightboxOpen(true);
    };

    const goPrev = () => {
        const n = images?.length || 0;
        if (n <= 1) return;
        setLightboxIndex((i) => (i - 1 + n) % n);
    };

    const goNext = () => {
        const n = images?.length || 0;
        if (n <= 1) return;
        setLightboxIndex((i) => (i + 1) % n);
    };

    return (
        <section ref={containerRef} className="bg-white text-gray-900">
            {/* Encabezado editorial */}
            <div className="max-w-7xl mx-auto px-6 pt-14">
                <Reveal>
                    <p className="text-xs uppercase tracking-[0.55em] text-gray-500">
                        Bassari · Nueva colección
                    </p>
                </Reveal>

                <Reveal delay={120}>
                    <h2 className="mt-4 text-4xl md:text-5xl font-semibold text-gray-950">
                        {title}
                    </h2>
                </Reveal>

                <Reveal delay={220}>
                    <p className="mt-5 max-w-2xl text-lg text-gray-700 leading-relaxed">
                        {subtitle}
                    </p>
                </Reveal>
            </div>

            {/* Layout */}
            <div className="max-w-7xl mx-auto px-6 py-14 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-10 lg:gap-12 items-stretch">
                    {/* MEDIA desktop sticky */}
                    <div className="hidden lg:block">
                        <div className="lg:sticky" style={{ top: headerOffset + 16 }}>
                            <div className="rounded-[2rem] overflow-hidden border border-gray-200 shadow-[0_30px_90px_rgba(0,0,0,0.10)] bg-white">
                                <div className="relative h-[60vh] min-h-[520px] max-h-[760px]">
                                    {/* Crossfade de imágenes */}
                                    {content.map((c, i) => {
                                        const src = images?.[c.imgIndex] || null;
                                        return (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => openLightboxForChapter(i)}
                                                className={`absolute inset-0 w-full h-full ${i === active ? "opacity-100" : "opacity-0 pointer-events-none"
                                                    } transition-opacity duration-700`}
                                                style={{
                                                    transitionTimingFunction: reduceMotion
                                                        ? "linear"
                                                        : "cubic-bezier(0.22,1,0.36,1)",
                                                }}
                                                aria-label="Ampliar imagen"
                                                title="Ampliar"
                                            >
                                                {src ? (
                                                    <img
                                                        src={src}
                                                        alt={c.title}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="relative w-full h-full">{mediaFallback}</div>
                                                )}

                                                {/* overlays SOLO en vista normal (no en lightbox) */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/15 to-transparent" />
                                                <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />

                                                {/* Hint */}
                                                <div className="absolute left-6 bottom-6">
                                                    <div className="px-4 py-2 rounded-full bg-white/85 backdrop-blur-sm border border-gray-200 text-xs text-gray-800 shadow-sm">
                                                        Click para ampliar
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}

                                    {/* Caption */}
                                    <div className="absolute left-6 right-6 bottom-6 pointer-events-none">
                                        <div className="rounded-2xl bg-white/85 backdrop-blur-sm border border-gray-200 px-5 py-4 shadow-sm">
                                            <p className="text-[11px] uppercase tracking-[0.45em] text-gray-500">
                                                {content?.[active]?.kicker}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {content?.[active]?.title}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CHAPTERS */}
                    <div className="rounded-[2rem] border border-gray-200 shadow-[0_24px_80px_rgba(0,0,0,0.08)] overflow-hidden bg-white">
                        {content.map((c, i) => {
                            const isActive = i === active;
                            const isOpen = open === i;
                            const src = images?.[c.imgIndex] || images?.[i] || null;

                            return (
                                <section
                                    key={`${c.kicker}-${i}`}
                                    ref={(el) => (chapterRefs.current[i] = el)}
                                    className={`border-t border-gray-200 px-7 sm:px-8 py-8 sm:py-10 ${i === 0 ? "border-t-0" : ""
                                        } ${isActive ? "bg-[#faf7f2]/60" : "bg-white"}`}
                                >
                                    {/* Media móvil inline (clicable para ampliar) */}
                                    <div className="lg:hidden">
                                        <button
                                            type="button"
                                            onClick={() => openLightboxForChapter(i)}
                                            className="w-full text-left"
                                            aria-label="Ampliar imagen"
                                            title="Ampliar"
                                            disabled={!src}
                                        >
                                            <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                                                <div className="relative h-[42vh] min-h-[320px] max-h-[520px]">
                                                    {src ? (
                                                        <img
                                                            src={src}
                                                            alt={c.title}
                                                            className="absolute inset-0 h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        mediaFallback
                                                    )}
                                                    {/* overlays SOLO en vista normal */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/10 to-transparent" />
                                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />

                                                    {src && (
                                                        <div className="absolute left-4 bottom-4">
                                                            <div className="px-4 py-2 rounded-full bg-white/85 backdrop-blur-sm border border-gray-200 text-xs text-gray-800 shadow-sm">
                                                                Toca para ampliar
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                    <p className="mt-6 lg:mt-0 text-[11px] uppercase tracking-[0.55em] text-gray-500">
                                        {c.kicker}
                                    </p>

                                    <h3 className="mt-4 text-2xl sm:text-3xl font-semibold text-gray-950 leading-tight">
                                        {c.title}
                                    </h3>

                                    <p className="mt-4 text-gray-700 leading-relaxed text-[15px] sm:text-base">
                                        {c.text}
                                    </p>

                                    <button
                                        onClick={() => setOpen(isOpen ? null : i)}
                                        className="mt-6 inline-flex items-center gap-3 font-semibold text-gray-900 group"
                                        aria-expanded={isOpen}
                                    >
                                        <span>{isOpen ? "Ocultar" : "Leer más"}</span>
                                        <span className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center transition group-hover:bg-gray-50">
                                            {isOpen ? "–" : "+"}
                                        </span>
                                    </button>

                                    <div
                                        className={`grid transition-all duration-500 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
                                            }`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="text-gray-700 leading-relaxed">{c.more}</p>

                                            {/* Chips sobrios (si los quieres fuera, dímelo) */}
                                            <div className="mt-5 flex flex-wrap gap-2">
                                                {["Textura", "Ritmo", "Materia", "Detalle"].map((chip) => (
                                                    <span
                                                        key={chip}
                                                        className="px-3 py-1 rounded-full border border-gray-200 bg-white text-[11px] uppercase tracking-[0.25em] text-gray-600"
                                                    >
                                                        {chip}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Lightbox: sin blur en imagen, nítida */}
            <ImageLightbox
                isOpen={lightboxOpen}
                images={images}
                index={lightboxIndex}
                onClose={() => setLightboxOpen(false)}
                onPrev={goPrev}
                onNext={goNext}
                title="Detalle"
            />

            {/* Prefer-reduced-motion fallback */}
            <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { scroll-behavior: auto !important; }
        }
      `}</style>
        </section>
    );
}


