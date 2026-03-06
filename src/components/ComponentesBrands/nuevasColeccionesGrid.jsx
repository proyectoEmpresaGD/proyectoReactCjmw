import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_LABELS = Object.freeze({
    title: "NUEVAS COLECCIONES",
    button: "EXPLORA LA COLECCIÓN",
});

// ✅ IMPORTANTE: NO filtramos por image para no devolver null si llega tarde/vacío
const normalizeItems = (items) =>
    (items || []).filter((item) => item?.name && item?.description);

function NuevasColeccionesGrid({
    title = DEFAULT_LABELS.title,
    items = [],
    buttonLabel = DEFAULT_LABELS.button,
    className = "",
}) {
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const cardsRef = useRef([]);

    const normalizedItems = useMemo(() => normalizeItems(items), [items]);

    // ✅ Visibles por defecto (evita “no se ve nada” si el observer no dispara)
    const [visibleCards, setVisibleCards] = useState(() => "ALL");

    const goToCollection = (collectionName) => {
        navigate(`/coleccion/${encodeURIComponent(collectionName)}`);
    };

    useEffect(() => {
        if (!normalizedItems.length) return;

        // Si ya están visibles todas, no hace falta observer
        if (visibleCards === "ALL") return;

        if (typeof IntersectionObserver === "undefined") {
            setVisibleCards("ALL");
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const idx = entry.target?.dataset?.index;
                    if (!entry.isIntersecting || idx == null) return;

                    setVisibleCards((prev) => {
                        if (prev === "ALL") return "ALL";
                        const next = new Set(prev);
                        next.add(Number(idx));
                        return next;
                    });
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -120px 0px" }
        );

        cardsRef.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [normalizedItems.length, visibleCards]);

    if (normalizedItems.length === 0) return null;

    // Stagger suave
    const delayClasses = ["delay-0", "delay-100", "delay-200", "delay-300", "delay-500"];

    function ExploreButton({ label, onClick, variant = "dark" }) {
        const base =
            "group inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-medium backdrop-blur transition-colors focus:outline-none focus-visible:ring-2";

        const variants = {
            dark: "bg-black text-white hover:bg-black/85 focus-visible:ring-black/30",
            light:
                "border border-white/30 bg-white/10 text-white hover:bg-white hover:text-black focus-visible:ring-white/40",
        };

        const cls = `${base} ${variants[variant] || variants.dark}`;

        return (
            <button type="button" onClick={onClick} className={cls}>
                <span>{label}</span>

                <span className="relative inline-flex">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="pointer-events-none absolute left-0 h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-70 group-hover:translate-x-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </span>
            </button>
        );
    }

    const isCardVisible = (index) => {
        if (visibleCards === "ALL") return true;
        return visibleCards.has(index);
    };

    return (
        <section ref={sectionRef} className={`w-full px-4 py-12 ${className}`}>
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between gap-6 mb-10">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">{title}</h2>
                    <div className="hidden md:block h-[2px] flex-1 bg-black/10 rounded-full" />
                </div>

                <div className="flex flex-col gap-10">
                    {normalizedItems.map((item, index) => {
                        const isReversedDesktop = index % 2 === 1;
                        const isVisible = isCardVisible(index);
                        const delayClass = delayClasses[index % delayClasses.length];

                        return (
                            <article
                                key={`${item.name}-${index}`}
                                data-index={index}
                                ref={(el) => (cardsRef.current[index] = el)}
                                className={[
                                    "grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch",
                                    "transition-all duration-700 ease-out",
                                    delayClass,
                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                                ].join(" ")}
                            >
                                {/* Imagen */}
                                <div
                                    className={[
                                        "relative overflow-hidden rounded-xl shadow-sm ring-1 ring-black/10",
                                        "group",
                                        isReversedDesktop ? "lg:order-2" : "lg:order-1",
                                    ].join(" ")}
                                >
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-72 sm:h-80 lg:h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-72 sm:h-80 lg:h-full bg-gray-100 flex items-center justify-center text-gray-500">
                                            Sin imagen
                                        </div>
                                    )}

                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="absolute top-4 left-4 bg-white/85 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-black shadow-sm">
                                        New
                                    </div>
                                </div>

                                {/* Texto */}
                                <div
                                    className={[
                                        "flex flex-col justify-center",
                                        isReversedDesktop ? "lg:order-1" : "lg:order-2",
                                    ].join(" ")}
                                >
                                    <h3 className="text-xl md:text-2xl font-semibold text-black">{item.name}</h3>
                                    <div className="mt-2 h-[2px] w-14 bg-black/20 rounded-full" />

                                    <p className="mt-4 text-base md:text-lg text-black/80 leading-relaxed">
                                        {item.description}
                                    </p>

                                    <div className="mt-7">
                                        <ExploreButton
                                            label={buttonLabel}
                                            onClick={() => goToCollection(item.name)}
                                            variant="dark"
                                        />
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default NuevasColeccionesGrid;