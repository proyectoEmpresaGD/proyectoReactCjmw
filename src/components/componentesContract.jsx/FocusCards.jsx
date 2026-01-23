// src/components/ui/FocusCardsLite.jsx
import { useMemo, useState } from "react";

/**
 * FocusCardsLite
 * - En reposo: todas nítidas.
 * - Al hover/focus de una: la activa nítida; las demás borrosas + menos brillo.
 * - El título y overlay SOLO en la activa.
 */
export default function FocusCardsLite({ cards = [], className = "", onCardClick }) {
    const [active, setActive] = useState(-1);
    const items = useMemo(() => (Array.isArray(cards) ? cards.filter(Boolean) : []), [cards]);

    if (!items.length) return null;

    const somethingActive = active !== -1;

    return (
        <div className={`w-full ${className}`}>
            <div
                className="
          grid gap-6
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        "
                role="list"
                aria-label="Projects gallery focus"
            >
                {items.map((card, i) => {
                    const isActive = i === active;

                    return (
                        <article
                            key={`${card.title}-${i}`}
                            role="listitem"
                            tabIndex={0}
                            onMouseEnter={() => setActive(i)}
                            onMouseLeave={() => setActive(-1)}
                            onFocus={() => setActive(i)}
                            onBlur={() => setActive(-1)}
                            onClick={() => onCardClick?.(card, i)}
                            className={[
                                "group relative overflow-hidden rounded-2xl ring-1 ring-black/10 bg-black/5",
                                "transition-all duration-300 ease-out cursor-pointer select-none",
                                isActive ? "scale-[1.02] shadow-xl ring-black/20 z-[1]" : "",
                                "outline-none focus-visible:ring-2 focus-visible:ring-black/40",
                            ].join(" ")}
                        >
                            <img
                                src={card.src}
                                alt={card.alt || card.title}
                                loading="lazy"
                                className={[
                                    "w-full h-72 sm:h-80 object-cover transition-all duration-500 ease-out",
                                    // En reposo: nítidas. Cuando hay activa: las no activas se difuminan.

                                ].join(" ")}
                            />

                            {/* Overlay solo visible en activa */}
                            <div
                                className={[
                                    "pointer-events-none absolute inset-0 transition-opacity duration-300",
                                    "bg-gradient-to-t from-black/60 via-black/20 to-transparent",
                                    isActive ? "opacity-100" : "opacity-0",
                                ].join(" ")}
                            />

                            {/* Título solo visible en activa */}
                            <div
                                className={[
                                    "pointer-events-none absolute bottom-0 left-0 right-0 px-4 pb-4",
                                    "transition-all duration-300 transform",
                                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
                                ].join(" ")}
                            >
                                <p className="text-white text-base sm:text-lg font-medium drop-shadow">
                                    {card.title}
                                </p>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
