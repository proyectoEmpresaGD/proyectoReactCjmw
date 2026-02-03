import { useEffect, useMemo, useRef, useState } from "react";

function useReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = () => setReduced(Boolean(mq.matches));
        onChange();
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    return reduced;
}

function Section({ id, kicker, title, subtitle, accentClass = "bg-white/30", children }) {
    return (
        <section id={id} className="scroll-mt-28">
            <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
                <div className="max-w-3xl">
                    {kicker ? <p className="text-xs tracking-[0.35em] text-white/60">{kicker}</p> : null}
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
                    {subtitle ? <p className="mt-4 text-sm leading-relaxed text-white/70">{subtitle}</p> : null}
                    <div className={`mt-7 h-[2px] w-16 rounded-full ${accentClass}`} />
                </div>

                <div className="mt-10">{children}</div>
            </div>
        </section>
    );
}

function StickyBrandNav({ items }) {
    return (
        <div className="sticky top-0 z-30 border-b border-white/10 bg-black/55 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 lg:px-8">
                {items.map((it) => (
                    <a
                        key={it.href}
                        href={it.href}
                        className="shrink-0 rounded-full bg-white/5 px-4 py-2 text-[11px] font-medium tracking-[0.24em] text-white/70 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
                    >
                        {it.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

/**
 * Shell reutilizable para páginas de marca.
 * Mantiene tu contenido pero unifica el look editorial moderno.
 */
export default function BrandPageShell({
    header,
    footer,
    logoUrl,
    hero, // { type: "image"|"video", desktopSrc, mobileSrc?, eyebrow, title, subtitle, accentGlowClass }
    navItems, // [{label, href}]
    sections, // [{id,kicker,title,subtitle,accentClass,render}]
}) {
    const reducedMotion = useReducedMotion();
    const [heroSrc, setHeroSrc] = useState(hero?.desktopSrc || "");

    useEffect(() => {
        if (!hero?.mobileSrc) return;
        if (typeof window !== "undefined" && window.innerWidth <= 768) setHeroSrc(hero.mobileSrc);
    }, [hero?.mobileSrc]);

    const heroTitle = hero?.title || "";
    const heroSubtitle = hero?.subtitle || "";

    return (
        <div className="min-h-screen bg-black">
            {header}

            {/* HERO */}
            <div className="relative isolate">
                <div className="absolute inset-0 -z-10">
                    {hero?.type === "video" ? (
                        <video
                            className="h-[78vh] w-full object-cover sm:h-[85vh]"
                            autoPlay={!reducedMotion}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            src={heroSrc}
                        />
                    ) : (
                        <img className="h-[78vh] w-full object-cover sm:h-[85vh]" src={heroSrc} alt="" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/40" />
                    <div className={`absolute inset-x-0 bottom-0 h-52 ${hero?.accentGlowClass || "bg-gradient-to-t from-white/10 to-transparent"}`} />
                </div>

                <div className="mx-auto flex h-[78vh] max-w-7xl items-end px-4 pb-14 pt-24 sm:h-[85vh] lg:px-8">
                    <div className="max-w-3xl">
                        {hero?.eyebrow ? (
                            <p className="text-xs tracking-[0.35em] text-white/60">{hero.eyebrow}</p>
                        ) : null}

                        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                            {heroTitle}
                        </h1>

                        {heroSubtitle ? (
                            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/70">{heroSubtitle}</p>
                        ) : null}

                        {logoUrl ? (
                            <div className="mt-10">
                                <img
                                    src={logoUrl}
                                    alt=""
                                    className="h-14 w-auto opacity-90 sm:h-16"
                                    loading="lazy"
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* NAV STICKY */}
            {Array.isArray(navItems) && navItems.length ? <StickyBrandNav items={navItems} /> : null}

            {/* SECCIONES */}
            <main>
                {sections.map((s) => (
                    <Section
                        key={s.id}
                        id={s.id}
                        kicker={s.kicker}
                        title={s.title}
                        subtitle={s.subtitle}
                        accentClass={s.accentClass}
                    >
                        {s.render()}
                    </Section>
                ))}

                <div className="h-10" />
            </main>

            {footer}
        </div>
    );
}
