// src/pages/Contract.jsx
import { Header } from "../../components/header";
import { CartProvider } from "../../components/CartContext";
import { useTranslation } from "react-i18next";
import FocusCardsLite from "../../components/componentesContract.jsx/FocusCards";
import SpotlightCard from "../../components/componentesContract.jsx/SpotlightCard";
import EdgeSection from "../../components/componentesContract.jsx/EdgeSection";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ------------------------------ CONFIG UI ------------------------------ */
const CONTAINER = "px-4 md:px-6";
const MAXW = "max-w-7xl";
const CARD = "rounded-3xl border border-black/10 bg-white/70 backdrop-blur shadow-lg ring-1 ring-black/5";
const SOFT_BORDER = "rounded-3xl border border-black/10 bg-white/80 backdrop-blur";

/* ------------------------------ ASSETS ------------------------------ */
const HERO_IMG = "https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT01.jpg";
const IMG_TEAM = "https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT04.jpg";
const IMG_DEPT = "https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT02.jpg";
const IMG_TECH = "https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT09.jpg";

/* ------------------------------ MINI UTILS ------------------------------ */
function Section({ id, children, className = "" }) {
    return (
        <section id={id} className={`py-14 lg:py-20 ${className}`}>
            <div className={`${CONTAINER} mx-auto ${MAXW}`}>{children}</div>
        </section>
    );
}
function Glass({ children, className = "" }) {
    return <div className={`${CARD} ${className}`}>{children}</div>;
}
function RowCard({ title, desc, icon, className = "" }) {
    return (
        <div className={`${SOFT_BORDER} p-6`}>
            <div className="flex items-start gap-4">
                <div className="shrink-0 h-10 w-10 rounded-xl border border-black/10 bg-white/90 flex items-center justify-center">
                    {icon ?? <span className="text-lg">★</span>}
                </div>
                <div>
                    <h4 className="text-base font-semibold text-gray-900">{title}</h4>
                    <p className="mt-1 text-sm text-gray-700">{desc}</p>
                </div>
            </div>
        </div>
    );
}
/** Reveal animation (como About.jsx) */
function Reveal({ children, from = "up", delay = 0, className = "" }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    useEffect(() => {
        if (prefersReduced) {
            setVisible(true);
            return;
        }
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => setVisible(true), delay);
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [delay, prefersReduced]);

    const initial = {
        up: "opacity-0 translate-y-6",
        down: "opacity-0 -translate-y-6",
        left: "opacity-0 -translate-x-6",
        right: "opacity-0 translate-x-6",
        zoom: "opacity-0 scale-95",
    }[from] || "opacity-0 translate-y-6";

    const shown = "opacity-100 translate-y-0 translate-x-0 scale-100";
    const transition = "transition-all duration-700 ease-out";

    return (
        <div ref={ref} className={`${transition} ${visible ? shown : initial} ${className}`}>
            {children}
        </div>
    );
}

/* ------------------------------ PAGE ------------------------------ */
export default function Contract() {
    const { t } = useTranslation("contract");
    const tags = t("fabrics.tags", { returnObjects: true }) || [];
    const bulletsTeam = t("team.bullets", { returnObjects: true }) || [];
    const bulletsDept = t("department.bullets", { returnObjects: true }) || [];
    const subject = encodeURIComponent(t("contact.subject", { defaultValue: "CJM Contract" }));

    return (
        <>
            <CartProvider>
                <Header />
                <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                    {/* ========================= HERO (value prop + CTAs) ========================= */}
                    <section className="relative w-full overflow-hidden">
                        {/* Capa IMAGEN (z-0, nunca negativa) */}
                        <div
                            className="absolute inset-0 z-0"
                            aria-hidden="true"
                            style={{
                                backgroundImage: `url('${HERO_IMG}')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                backgroundColor: "#0f172a" // fallback oscuro por si tarda
                            }}
                        />

                        {/* Capa OVERLAY (z-10) */}
                        <div
                            className="absolute inset-0 z-10"
                            aria-hidden="true"
                            style={{
                                background:
                                    "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.40) 35%, rgba(0,0,0,0.20) 70%, rgba(0,0,0,0) 100%)"
                            }}
                        />

                        {/* Contenido (z-20) */}
                        <div className={`${CONTAINER} mx-auto ${MAXW} min-h-[65vh] md:min-h-[60vh] flex items-end pb-5 relative z-20`}>
                            <Reveal from="up" className="w-full">
                                <div className="max-w-3xl text-white">
                                    <h1 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight drop-shadow">
                                        {t("title")}
                                    </h1>
                                    <p className="mt-4 text-white/90 leading-relaxed">
                                        {t("fabrics.heading")}
                                    </p>

                                    {/* píldoras técnicas */}
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        {(t("fabrics.tags", { returnObjects: true }) || []).slice(0, 6).map((pill) => (
                                            <span
                                                key={pill}
                                                className="px-3 py-1 text-[11px] rounded-full border border-white/30 bg-white/10 backdrop-blur"
                                            >
                                                {pill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* CTAs */}
                                    <div className="mt-8 flex flex-wrap gap-3">
                                        <a
                                            href={`mailto:info@cjmw.eu?subject=${encodeURIComponent(t("contact.subject", { defaultValue: "CJM Contract" }))}`}
                                            className="inline-flex items-center justify-center rounded-xl bg-white/10 text-white font-medium px-5 py-3 border-2 border-white/30 hover:bg-white hover:text-black transition"
                                        >
                                            {t("contact.button")}
                                        </a>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    {/* ========================= WHY / BENEFICIOS ========================= */}
                    <Section id="benefits">
                        <Reveal from="up">
                            <div className="text-center max-w-3xl mx-auto">
                                <h2 className="text-2xl md:text-xl font-semibold text-gray-900">
                                    {t("introduccion.p1")}
                                </h2>
                                <p className="mt-3 text-gray-700">
                                    {t("introduccion.p2")}
                                </p>
                            </div>
                        </Reveal>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Reveal from="up">
                                <RowCard
                                    title={t("destacado.t1")}
                                    desc={t("destacado.p1")}
                                />
                            </Reveal>
                            <Reveal from="up" delay={80}>
                                <RowCard
                                    title={t("destacado.t2")}
                                    desc={t("destacado.p2")}
                                />
                            </Reveal>
                            <Reveal from="up" delay={120}>
                                <RowCard
                                    title={t("destacado.t3")}
                                    desc={t("destacado.p3")}
                                />
                            </Reveal>
                        </div>
                    </Section>

                    {/* ========================= EQUIPO / DEPARTAMENTO ========================= */}
                    <Section id="story">
                        <div className="space-y-12">
                            <Reveal from="up">
                                <EdgeSection
                                    subtitle="Equipo"
                                    title={t("team.heading")}
                                    paragraphs={[t("team.p1"), t("team.p2"), t("team.p3")]}
                                    bullets={bulletsTeam}
                                    image={{ src: IMG_TEAM, alt: t("team.alt") }}
                                    accent="from-black to-slate-700"
                                    reversed={false}
                                />
                            </Reveal>

                            <Reveal from="up" delay={120}>
                                <EdgeSection
                                    subtitle="Departamento"
                                    title={t("department.heading")}
                                    paragraphs={[t("department.p1"), t("department.p2")]}
                                    bullets={bulletsDept}
                                    image={{ src: IMG_DEPT, alt: t("department.alt") }}
                                    accent="from-slate-800 to-slate-600"
                                    reversed
                                />
                            </Reveal>
                        </div>
                    </Section>

                    {/* ========================= PROCESO ========================= */}
                    {/* <Section id="process" className="pt-0">
                        <Reveal from="up">
                            <Glass className="p-8 md:p-10">
                                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">Nuestro proceso</h3>
                                <ol className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {[
                                        { t: "Brief & medición", d: "Leemos el proyecto, tomamos medidas y definimos requisitos técnicos." },
                                        { t: "Muestras & validación", d: "Selección FR/Outdoor y test de comportamiento según normativa." },
                                        { t: "Confección & control", d: "Producción propia, QA y embalaje listo para instalación." },
                                        { t: "Instalación & entrega", d: "Equipo propio onsite, remates y entrega a tiempo." }
                                    ].map((s, i) => (
                                        <li key={i} className="relative">
                                            <div className="text-sm tracking-[0.12em] uppercase text-gray-600">Paso {i + 1}</div>
                                            <div className="text-lg font-semibold text-gray-900">{s.t}</div>
                                            <p className="mt-1 text-gray-700">{s.d}</p>
                                        </li>
                                    ))}
                                </ol>
                            </Glass>
                        </Reveal>
                    </Section> */}

                    {/* ========================= STATS ========================= */}
                    <Section id="stats" className="pt-0">
                        <Reveal from="zoom">
                            <div className="grid grid-cols-2 justify-center md:grid-cols-3 gap-4">
                                {[
                                    { v: "2001", l: "Desde" },
                                    { v: "30+", l: "Países" },
                                    { v: "FR/IMO", l: "Normativas clave" }
                                ].map((s, i) => (
                                    <div key={i} className="text-center rounded-2xl border border-black/10 bg-white/70 p-6">
                                        <div className="text-2xl md:text-3xl font-semibold text-gray-900">{s.v}</div>
                                        <div className="mt-1 text-sm text-gray-600">{s.l}</div>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </Section>

                    {/* ========================= PROYECTOS ========================= */}
                    {/* <Section id="projects" className="pt-0">
                        <Reveal from="up">
                            <div className="flex items-end justify-between">
                                <h3 className="text-2xl sm:text-3xl font-bold text-black">{t("projects.heading")}</h3>
                            </div>
                        </Reveal>
                        <Reveal from="zoom" className="mt-6">
                            <FocusCardsLite
                                cards={[
                                    { title: "Valley of life", src: "https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT03.jpg", alt: t("projects.alt") },
                                    { title: "Atlantic view", src: "https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT03.jpg", alt: t("projects.alt") },
                                    { title: "Suite ambient", src: "https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT03.jpg", alt: t("projects.alt") },
                                    { title: "Forest lounge", src: "https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT04.jpg", alt: t("projects.alt") },
                                    { title: "Meeting room", src: "https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT02.jpg", alt: t("projects.alt") },
                                    { title: "Outdoor terrace", src: "https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT01.jpg", alt: t("projects.alt") }
                                ]}
                            />
                        </Reveal>
                        <Reveal from="up" className="mt-6">
                            <p className="text-slate-700 text-justify">{t("projects.p1")}</p>
                            <p className="mt-2 text-slate-700 text-justify">{t("projects.p2")}</p>
                        </Reveal>
                    </Section> */}

                    {/* ========================= BLOQUE TÉCNICO ========================= */}
                    <Section id="fabrics">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            <Reveal from="left" className="lg:col-span-5">
                                <div className="lg:sticky lg:top-24 self-start overflow-hidden rounded-3xl ring-1 ring-black/10 shadow-md bg-white">
                                    <img src={IMG_TECH} alt={t("fabrics.alt")} className="w-full h-auto object-cover" loading="lazy" />
                                </div>
                            </Reveal>
                            <Reveal from="right" className="lg:col-span-7">
                                <Glass className="p-8 sm:p-10">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-black">{t("fabrics.heading")}</h3>
                                    <p className="mt-4 text-slate-700 text-justify">{t("fabrics.p1")}</p>
                                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-xs px-3 py-2 rounded-xl bg-slate-50 ring-1 ring-black/10 text-slate-700 text-center"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </Glass>
                            </Reveal>
                        </div>
                    </Section>

                    {/* ========================= CTA FINAL ========================= */}
                    <Section id="cta" className="pt-0">
                        <Reveal from="up">
                            <div className="relative overflow-hidden rounded-3xl bg-black text-white">
                                <div
                                    className="absolute inset-0 opacity-20 mix-blend-screen"
                                    style={{ backgroundImage: "radial-gradient(800px 300px at 10% 10%, white, transparent)" }}
                                />
                                <div className="relative p-10 sm:p-14 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                                    <div className="lg:col-span-2">
                                        <h3 className="text-3xl font-bold">{t("contact.heading")}</h3>
                                        <p className="mt-3 text-sm sm:text-base text-white/90">{t("contact.p1")}</p>
                                        <p className="mt-2 text-sm sm:text-base">
                                            {t("contact.p2")}
                                            <a href="mailto:info@cjmw.eu" className="underline font-medium ml-1">
                                                info@cjmw.eu
                                            </a>
                                        </p>
                                    </div>
                                    <div className="lg:col-span-1">
                                        <a
                                            href={`mailto:info@cjmw.eu?subject=${subject}`}
                                            className="inline-flex w-full items-center justify-center px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-transparent hover:text-white border-2 border-white transition"
                                        >
                                            {t("contact.button")}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </Section>
                </main>
            </CartProvider>
        </>
    );
}
