// src/components/ui/EdgeSection.jsx
/**
 * EdgeSection
 * Sección editorial con:
 *  - Franja lateral (accent) y diagonales arriba/abajo (SVG).
 *  - Imagen full-bleed + bloque de contenido con bullets.
 *  - Variante invertida (imagen derecha/izquierda).
 *
 * Props:
 *  - title: string
 *  - subtitle?: string
 *  - paragraphs: string[]   // párrafos del cuerpo
 *  - bullets?: string[]     // puntos clave (opcional)
 *  - image: { src: string, alt?: string }
 *  - accent?: string        // clase tailwind de color (ej: 'from-black to-slate-700')
 *  - reversed?: boolean     // invierte imagen/contenido
 */
export default function EdgeSection({
    title,
    subtitle,
    paragraphs = [],
    bullets = [],
    image,
    accent = "from-black to-slate-700",
    reversed = false,
}) {
    return (
        <section className="relative overflow-hidden rounded-3xl ring-1 ring-black/10 shadow-xl bg-white">
            {/* Diagonal superior */}
            <svg
                aria-hidden="true"
                className="absolute -top-16 left-0 w-full h-28 pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <polygon points="0,100 100,0 100,100" className="fill-slate-50" />
            </svg>

            {/* Franja lateral de acento */}
            <div
                className={[
                    "absolute top-0 bottom-0 w-2 lg:w-3",
                    reversed ? "right-0" : "left-0",
                    "bg-gradient-to-b", accent,
                ].join(" ")}
                aria-hidden="true"
            />

            <div className={["grid gap-0 lg:grid-cols-12"].join(" ")}>
                {/* Imagen */}
                <div className={reversed ? "lg:col-span-6 order-1" : "lg:col-span-6 order-1 lg:order-none"}>
                    <div className="relative h-full">
                        <img
                            src={image.src}
                            alt={image.alt || title}
                            loading="lazy"
                            className="w-full h-80 sm:h-[26rem] lg:h-full object-cover"
                        />
                        {/* Marco interno sutil */}
                        <div className="absolute inset-0 ring-1 ring-black/10 pointer-events-none" />
                    </div>
                </div>

                {/* Contenido */}
                <div className={reversed ? "lg:col-span-6 order-2" : "lg:col-span-6 order-2 lg:order-none"}>
                    <div className="px-6 sm:px-10 lg:px-12 py-10 lg:py-14">
                        {subtitle ? (
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                                {subtitle}
                            </p>
                        ) : null}

                        <h2 className="mt-2 text-3xl sm:text-3xl font-extrabold tracking-tight text-black">
                            {title}
                        </h2>

                        <div className="mt-5 space-y-4 text-slate-700 text-base sm:text-md text-justify">
                            {paragraphs.map((p, idx) => (
                                <p key={idx}>{p}</p>
                            ))}
                        </div>

                        {bullets?.length ? (
                            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {bullets.map((b, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3 rounded-xl bg-slate-50/80 ring-1 ring-black/10 px-3 py-2"
                                    >
                                        <span className="mt-1 inline-flex size-2.5 rounded-full bg-black" />
                                        <span className="text-sm sm:text-md text-slate-800">{b}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Diagonal inferior */}
            <svg
                aria-hidden="true"
                className="absolute -bottom-16 left-0 w-full h-28 pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <polygon points="0,0 0,100 100,0" className="fill-slate-50" />
            </svg>
        </section>
    );
}
