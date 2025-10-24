// src/pages/About.jsx
import { Header } from "../../components/header";
import Footer from '../../components/footer';
import { CartProvider } from '../../components/CartContext';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from "react";
// arriba del archivo
import { Link } from "react-router-dom";

// --- Config (sin magic numbers) ---
const CONTAINER = "px-4 md:px-6";
const MAXW = "max-w-7xl";
const CARD = "rounded-2xl border border-white/20 bg-white/60 backdrop-blur shadow-lg ring-1 ring-black/5";
const FRAME = "overflow-hidden rounded-2xl border border-black/10 shadow-lg";
const HOVER_IMG = "transition-transform duration-500 hover:-translate-y-1";

// Imágenes coherentes con tu marca (puedes cambiarlas cuando quieras)
const IMG_OVERVIEW = "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/BASSARI/TRIBAL/Buena%20calidad/BASSARI%20TRIBAL%20DAKAR%20BOUE%20SABLE%20ET%20GRIS%20NUAGE.jpg";
const IMG_MADE = "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/KANNATURA/ARN_RAFIAS_AMBIENTE_KLIM.jpg";
const IMG_HQ = "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01942%20CARIBBEAN%20PARTY%20JUNGLE%20INDIGO_%20SILLA%20PISCINA_CABECERO%20CARIBBEAN%20INDIGO.jpg";

// HERO (puedes cambiarlo por el de confecciones.jsx)
const HERO_IMG = "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/HARBOUR/HARB_AMB_BOHEMIAN_05CARROUSEL.jpg";

// CTA background (cámbiala por la que quieras)
const CTA_BG = "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/ARENA/ARN_AMB_BIANCALANI_01CARROUSEL.jpg";

// --- MARCAS (sin i18n): pon aquí tus rutas ---
const BRANDS = [
    { logo: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM-sintexto.png", to: "/cjmHome" },
    { logo: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoHarbour.png", to: "/harbourHome" },
    { logo: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoArena.png", to: "/arenaHome" },
    { logo: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoFlamenco.png", to: "/flamencoHome" },
    { logo: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png", to: "/bassariHome" }
];

// --- UI pequeñas y reutilizables ---
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

function ImageCard({ src, alt, className = "" }) {
    return (
        <div className={`${FRAME} ${HOVER_IMG} ${className}`}>
            <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
        </div>
    );
}

function Eyebrow({ children }) {
    if (!children) return null;
    return (
        <p className="text-[11px] tracking-[0.18em] uppercase font-semibold text-gray-700">
            {children}
        </p>
    );
}

function Title({ children }) {
    if (!children) return null;
    return (
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            {children}
        </h2>
    );
}

function P({ children }) {
    if (!children) return null;
    return <p className="text-gray-700 leading-relaxed">{children}</p>;
}

function Divider() {
    return <hr className="border-gray-200/80 my-10" />;
}

function Stat({ value, label }) {
    return (
        <div className="text-center">
            <div className="text-3xl font-semibold text-gray-800">{value}</div>
            <div className="mt-1 text-sm text-gray-600">{label}</div>
        </div>
    );
}

/** Animación on-scroll con IntersectionObserver (sin librerías) */
function Reveal({ children, from = "up", delay = 0, className = "" }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    // Respeto a usuarios con reduce motion
    const prefersReduced = typeof window !== "undefined" &&
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
        zoom: "opacity-0 scale-95"
    }[from] || "opacity-0 translate-y-6";

    const shown = "opacity-100 translate-y-0 translate-x-0 scale-100";
    const transition = "transition-all duration-700 ease-out";

    return (
        <div ref={ref} className={`${transition} ${visible ? shown : initial} ${className}`}>
            {children}
        </div>
    );
}

/** Sección de marcas “chula” (ahora con i18n por props) */
function BrandsShowcase({ brands = [], title, subtitle, paragraph }) {
    if (!Array.isArray(brands) || brands.length === 0) return null;

    return (
        <Section id="brands" className="pt-0 bg-gradient-to-b from-white via-gray-300 to-white">
            <Reveal from="up">
                <div className="text-center">
                    <p className="text-[11px] tracking-[0.18em] uppercase font-semibold text-gray-700">
                        {title}
                    </p>
                    <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-gray-800">
                        {subtitle}
                    </h3>
                    <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
                        {paragraph}
                    </p>
                </div>
            </Reveal>

            <Reveal from="zoom">
                <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-black/20 to-transparent" />
            </Reveal>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {brands.slice(0, 5).map((b, i) => {
                    const isExternal = Boolean(b.href);        // si tiene href => externo
                    const Wrapper = isExternal ? "a" : Link;   // usa Link para rutas internas
                    const wrapperProps = isExternal
                        ? { href: b.href, target: "_blank", rel: "noopener noreferrer" }
                        : { to: b.to || "/" };

                    return (
                        <Reveal key={i} from="up" delay={i * 80}>
                            <Wrapper
                                {...wrapperProps}
                                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 rounded-2xl"
                                aria-label={b.name || "Marca"}
                                title={b.name}
                            >
                                <div className="transition-transform duration-300 group-hover:-translate-y-1">
                                    <div className="flex items-center justify-center h-24 p-4">
                                        <img
                                            src={b.logo}
                                            loading="lazy"
                                            className="max-h-16 w-auto object-contain"
                                            alt={b.name || ""}
                                        />
                                    </div>
                                    <div className="px-4 pb-4 text-center">
                                        <p className="text-sm font-medium text-gray-800">{b.name}</p>
                                    </div>
                                </div>
                            </Wrapper>
                        </Reveal>
                    );
                })}
            </div>
        </Section>
    );
}

/** CTA moderno con imagen de fondo + overlay + animación (i18n por props) */
function ContactCTA({ eyebrow, title, description, buttonLabel }) {
    return (
        <section className="relative py-16 md:py-24">
            <div
                className="absolute inset-0 -z-10"
                aria-hidden="true"
                style={{
                    backgroundImage: `url('${CTA_BG}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    // efecto sutil tipo parallax en desktop
                    backgroundAttachment: "fixed"
                }}
            />
            <div className="absolute inset-0 -z-10 bg-black/55" aria-hidden="true" />
            <div className={`${CONTAINER} mx-auto ${MAXW}`}>
                <Glass className="p-8 md:p-12 bg-white/10 border-white/20 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <Reveal from="left" className="md:col-span-2">
                            <div>
                                <p className="text-[11px] tracking-[0.18em] uppercase font-semibold text-white/80">
                                    {eyebrow}
                                </p>
                                <h3 className="mt-2 text-2xl md:text-3xl font-semibold">
                                    {title}
                                </h3>
                                <p className="mt-3 text-white/90 max-w-2xl">
                                    {description}
                                </p>
                            </div>
                        </Reveal>

                        <Reveal from="right">
                            <div className="flex md:justify-end">
                                {/* BOTÓN CON ANIMACIÓN DE FLECHA */}
                                <Link
                                    to="/contact"
                                    className="group inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-white hover:text-black"
                                >
                                    <span>{buttonLabel}</span>
                                    <span className="relative inline-flex">
                                        {/* flecha principal: se desplaza a la derecha */}
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                        {/* trail sutil: aparece y se desplaza un poco más */}
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            className="pointer-events-none absolute left-0 h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-70 group-hover:translate-x-2"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </Link>
                            </div>
                        </Reveal>
                    </div>
                </Glass>
            </div>
        </section>
    );
}

export default function About() {
    const { t } = useTranslation("about");

    // Textos desde i18n
    const o = t("overview", { returnObjects: true });
    const m = t("madeInSpain", { returnObjects: true });
    const hq = t("headquarters", { returnObjects: true });
    const nm = t("nuestrasMarcas", { returnObjects: true });
    const stats = t("stats", { returnObjects: true });
    const badges = t("badges", { returnObjects: true });
    const tl = t("timeline", { returnObjects: true });
    const cta = t("contactCTA", { returnObjects: true });

    // Stats derivadas (países>30, años desde 2000)
    const currentYear = new Date().getFullYear();
    const years = Math.max(0, currentYear - 2000); // 25 en 2025

    // Alt genérico
    const aboutHeroAlt = o?.imageAlt || t("generic.aboutHeroAlt", { defaultValue: "About hero" });

    return (
        <>
            <CartProvider>
                <Header />

                <main className="min-h-screen bg-ivory">
                    {/* HERO - estilo confecciones.jsx */}
                    <section className="relative h-[38vh] md:h-[50vh] w-full overflow-hidden">
                        <img
                            src={HERO_IMG}
                            alt={aboutHeroAlt}
                            className="absolute inset-0 h-full w-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                        <div className={`relative z-10 h-full ${CONTAINER} mx-auto ${MAXW} flex flex-col items-start justify-end pb-8 md:pb-12`}>
                            <Reveal from="up">
                                {o?.title && (
                                    <h1 className="text-white text-3xl md:text-5xl font-semibold tracking-tight drop-shadow">
                                        {o.title}
                                    </h1>
                                )}
                                {o?.subtitle && (
                                    <p className="mt-3 text-white/90 max-w-2xl">{o.subtitle}</p>
                                )}
                            </Reveal>
                        </div>
                    </section>

                    {/* OVERVIEW con card “glass” + imagen */}
                    <Section id="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <Reveal from="up" className="order-2 lg:order-1">
                                <Glass className="p-8">
                                    <Eyebrow>{o?.subtitle}</Eyebrow>
                                    <Title>{o?.title}</Title>
                                    <div className="mt-6 space-y-5">
                                        <P>{o?.paragraph1}</P>
                                        <P>{o?.paragraph2}</P>
                                        <P>{o?.paragraph3}</P>
                                    </div>

                                    {/* Stats (i18n) */}
                                    <div className="mt-8 grid grid-cols-3 gap-6">
                                        <Stat value={`${years}+`} label={stats?.years} />
                                        <Stat value="30+" label={stats?.countries} />
                                        <Stat value="5" label={stats?.brands} />
                                    </div>
                                </Glass>
                            </Reveal>

                            <Reveal from="right" className="order-1 lg:order-2">
                                <ImageCard src={IMG_OVERVIEW} alt={o?.imageAlt} />
                            </Reveal>
                        </div>
                    </Section>

                    {/* Sección de marcas destacada (i18n) */}
                    <BrandsShowcase
                        brands={BRANDS}
                        title={nm?.title}
                        subtitle={nm?.subtitle}
                        paragraph={nm?.paragraph1}
                    />

                    {/* MADE IN SPAIN split invertido */}
                    <Section id="made-in-spain">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <Reveal from="left" className="lg:order-2">
                                <Glass className="p-10">
                                    <Title>{m?.title}</Title>
                                    <div className="mt-3">
                                        <P>{m?.subtitle}</P>
                                    </div>
                                    <div className="mt-6 space-y-5">
                                        <P>{m?.paragraph1}</P>
                                        <P>{m?.paragraph2}</P>
                                        <P>{m?.paragraph3}</P>
                                    </div>

                                    {/* Badges sutiles (i18n) */}
                                    <div className="mt-8 flex flex-wrap gap-2">
                                        <span className="text-xs rounded-full border px-3 py-1 bg-white/70">{badges?.design}</span>
                                        <span className="text-xs rounded-full border px-3 py-1 bg-white/70">{badges?.innovation}</span>
                                        <span className="text-xs rounded-full border px-3 py-1 bg-white/70">{badges?.quality}</span>
                                    </div>
                                </Glass>
                            </Reveal>

                            <Reveal from="right" className="lg:order-1">
                                <ImageCard src={IMG_MADE} alt={m?.imageAlt} />
                            </Reveal>
                        </div>
                    </Section>

                    {/* CINTA decorativa */}
                    <div className="my-6">
                        <div className={`${CONTAINER} mx-auto ${MAXW}`}>
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black/20 to-transparent" />
                        </div>
                    </div>

                    {/* HEADQUARTERS + mini-timeline */}
                    <Section id="headquarters">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                            <Reveal from="right">
                                <Glass className="p-10">
                                    <Title>{hq?.title}</Title>
                                    <div className="mt-6 space-y-5">
                                        <P>{hq?.paragraph1}</P>
                                        <P>{hq?.paragraph2}</P>
                                        <P>{hq?.paragraph3}</P>
                                    </div>


                                </Glass>
                            </Reveal>

                            <Reveal from="left">
                                <ImageCard src={IMG_HQ} alt={hq?.imageAlt} />
                            </Reveal>
                        </div>
                    </Section>

                    {/* CTA moderno con fondo y animación (i18n) */}
                    <ContactCTA
                        eyebrow={cta?.eyebrow}
                        title={cta?.title}
                        description={cta?.description}
                        buttonLabel={cta?.button}
                    />
                </main>
                <Footer />
            </CartProvider>
        </>
    );
}
