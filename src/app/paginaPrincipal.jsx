// src/app/paginaPrincipal.jsx
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/header";
import Footer from "../components/footer";
import { CartProvider } from "../components/CartContext.jsx";
import { cdnUrl } from "../Constants/cdn";
import { homeBrands } from "../Constants/constants.jsx";

const Modal = lazy(() => import("../components/ComponentesProductos/modal.jsx"));
const CarruselProductosColeccionEspecifica = lazy(
    () => import("../components/ComponentesHome/carruselProductosDestacados.jsx")
);

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

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

function useInView({ threshold = 0.2, root = null } = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold, root }
        );

        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold, root]);

    return { ref, inView };
}

function useParallaxInContainer(scrollElRef, strengthPx = 28, disabled = false) {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        if (disabled) return;
        const scrollEl = scrollElRef.current;
        if (!scrollEl) return;

        let raf = 0;

        const update = () => {
            raf = 0;
            const maxScroll = Math.max(1, scrollEl.scrollHeight - scrollEl.clientHeight);
            const progress = clamp(scrollEl.scrollTop / maxScroll, 0, 1);
            const y = (progress - 0.5) * 2 * strengthPx;
            setOffset(y);
        };

        const onScroll = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(update);
        };

        update();
        scrollEl.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            if (raf) window.cancelAnimationFrame(raf);
            scrollEl.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [scrollElRef, strengthPx, disabled]);

    return offset;
}

function useBottomReached(scrollRef, { thresholdPx = 24 } = {}) {
    const [reached, setReached] = useState(false);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let raf = 0;

        const update = () => {
            raf = 0;
            const { scrollTop, scrollHeight, clientHeight } = el;
            const remaining = scrollHeight - (scrollTop + clientHeight);
            setReached(remaining <= thresholdPx);
        };

        const onScroll = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(update);
        };

        update();
        el.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            if (raf) window.cancelAnimationFrame(raf);
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [scrollRef, thresholdPx]);

    return reached;
}

function Reveal({ children, className = "", root = null }) {
    const reducedMotion = useReducedMotion();
    const { ref, inView } = useInView({ threshold: 0.18, root });

    const base = "will-change-transform transition duration-700 motion-reduce:transition-none";
    const state = reducedMotion
        ? "opacity-100 translate-y-0"
        : inView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6";

    return (
        <div ref={ref} className={`${base} ${state} ${className}`}>
            {children}
        </div>
    );
}

/* =========================
   Helpers productos by code
========================= */

function normalizeString(value) {
    return String(value ?? "").trim();
}

function pickFirstString(obj, keys) {
    for (const k of keys) {
        const v = obj?.[k];
        if (typeof v === "string" && v.trim()) return v.trim();
    }
    return "";
}

function isAbsoluteHttpUrl(s) {
    return typeof s === "string" && /^https?:\/\//i.test(s.trim());
}

function resolveImage(raw) {
    const clean = typeof raw === "string" ? raw.trim() : "";
    if (!clean) return "/img/default.webp";
    if (isAbsoluteHttpUrl(clean)) return clean;
    return cdnUrl(clean);
}

function resolveProductImageBaja(p) {
    const raw = pickFirstString(p, ["imageBaja", "imagebaja", "PRODUCTO_BAJA", "producto_baja", "image"]);
    return resolveImage(raw || "/img/default.webp");
}

async function fetchProductByCode({ code, signal }) {
    const base = import.meta.env.VITE_API_BASE_URL?.trim();
    const url = new URL(`/api/products/${encodeURIComponent(code)}`, base || window.location.origin);

    const resp = await fetch(url.toString(), { method: "GET", signal });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const data = await resp.json();
    return data?.product ?? data?.data ?? data;
}

async function fetchImageByType({ codprodu, type, signal }) {
    const base = import.meta.env.VITE_API_BASE_URL?.trim();
    const url = new URL(`/api/images/${encodeURIComponent(codprodu)}/${encodeURIComponent(type)}`, base || window.location.origin);

    const resp = await fetch(url.toString(), { method: "GET", signal });
    if (!resp.ok) return null;

    const data = await resp.json().catch(() => null);
    const raw = data?.ficadjunto ? String(data.ficadjunto).trim() : "";
    return raw ? cdnUrl(raw) : null;
}

async function enrichProductWithImages({ product, signal }) {
    const codprodu = product?.codprodu;
    if (!codprodu) {
        return {
            ...product,
            imageBaja: "/img/default.webp",
            imageBuena: "/img/default.webp",
        };
    }

    const [low, hi] = await Promise.all([
        fetchImageByType({ codprodu, type: "PRODUCTO_BAJA", signal }),
        fetchImageByType({ codprodu, type: "PRODUCTO_BUENA", signal }),
    ]);

    return {
        ...product,
        imageBaja: low || "/img/default.webp",
        imageBuena: hi || low || "/img/default.webp",
    };
}

/* ==========================================
   Mini-modal/overlay de productos (galería)
========================================== */

function GalleryProductsOverlay({ open, title, products, loading, onClose, onPickProduct }) {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose?.();
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[998] flex items-center justify-center bg-black/60 px-4"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose?.();
            }}
        >
            <div className="flex w-full max-w-5xl max-h-[85dvh] flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-black/10 shadow-xl">
                <div className="flex items-center justify-between gap-4 border-b border-black/10 p-5">
                    <div className="min-w-0">
                        <p className="text-xs tracking-[0.3em] text-black/50">VER PRODUCTOS</p>
                        <p className="mt-2 text-lg font-semibold text-black line-clamp-1">{title || "Productos"}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-black/15 bg-black/5 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/10"
                    >
                        Cerrar
                    </button>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5">
                    {loading ? (
                        <p className="text-sm text-black/60">Cargando productos…</p>
                    ) : products?.length ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((p) => {
                                const img = resolveProductImageBaja(p);
                                const name = p.nombre || p.name || p.codprodu || "Producto";
                                const col = normalizeString(p.coleccion || p.collection || "");

                                return (
                                    <button
                                        key={p.codprodu || p.id || name}
                                        type="button"
                                        onClick={() => onPickProduct?.(p)}
                                        className="group flex items-center gap-4 rounded-2xl bg-white p-4 text-left ring-1 ring-black/10 transition hover:bg-black/[0.03]"
                                    >
                                        <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-black/5 sm:w-[150px]">
                                            <img src={img} alt={name} className="h-full w-full object-cover" loading="lazy" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-[10px] tracking-[0.25em] text-black/50">{col}</p>
                                            <p className="mt-1 text-sm font-semibold text-black line-clamp-2">{name}</p>
                                            {p.tonalidad ? <p className="mt-1 text-xs text-black/60">{p.tonalidad}</p> : null}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-black/60">No hay productos para mostrar.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * SLIDE 0 (vídeo)
 */
function IntroSlide() {
    const HERO_IMAGE =
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_HORIZONTAL_ESSENCES%20DU%20NIL%20Y%20LE%20KHAYMA.jpg";

    return (
        <section className="relative isolate h-[100dvh] w-[100vw] shrink-0 snap-center overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <img
                    src={HERO_IMAGE}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/45" />
            </div>

            <div className="mx-auto flex h-[100dvh] max-w-7xl items-end px-4 pb-16 pt-28 lg:px-8">
                <div className="max-w-3xl">
                    <Reveal>
                        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                            Cinco universos.
                            <br />
                            Uno a la vez.
                        </h1>
                    </Reveal>

                    <div className="mt-10 flex items-center gap-3">
                        <div className="h-[2px] w-10 rounded-full bg-white/50" />
                        <p className="text-xs tracking-[0.35em] text-white/70">DESLIZA →</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function AmbientGrid({ items, onOpen, root }) {
    const safeItems = Array.isArray(items) ? items : [];
    const onOpenColeccion = (url) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };
    if (safeItems.length === 0) return null;

    return (
        <div className="mx-auto mt-10 max-w-7xl px-4 pb-16 lg:px-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {safeItems.map((it) => (
                    <Reveal key={it.key} root={root}>
                        <button

                            onClick={() => onOpenColeccion(it.enlace)}
                            className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl ring-1 ring-white/10"
                        >
                            <img
                                src={it.image}
                                alt={it.title}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-90 transition group-hover:opacity-100" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-[10px] tracking-[0.25em] text-white/70">COLECCIÓN</p>
                                <p className="mt-1 text-sm font-medium text-white line-clamp-2">{it.title}</p>
                            </div>
                        </button>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

const GALLERY_STYLES_BY_PAGE = {
    arena: { overlay: "from-black/40 via-black/5", zoom: "group-hover:scale-[1.02]", ring: "ring-white/10", heroAspect: "aspect-[16/9]", mood: "calm" },
    bassari: { overlay: "from-black/85 via-black/25", zoom: "group-hover:scale-[1.07]", ring: "ring-white/25", heroAspect: "aspect-[21/9]", mood: "contrast" },
    cjm: { overlay: "from-black/70 via-black/15", zoom: "group-hover:scale-[1.05]", ring: "ring-white/15", heroAspect: "aspect-[16/9]", mood: "editorial" },
    harbour: { overlay: "from-black/60 via-black/10", zoom: "group-hover:scale-[1.04]", ring: "ring-white/12", heroAspect: "aspect-[3/2]", mood: "fresh" },
    flamenco: { overlay: "from-black/75 via-black/20", zoom: "group-hover:scale-[1.06]", ring: "ring-white/18", heroAspect: "aspect-[16/10]", mood: "expressive" },
    default: { overlay: "from-black/65 via-black/15", zoom: "group-hover:scale-[1.04]", ring: "ring-white/10", heroAspect: "aspect-[16/9]", mood: "neutral" },
};

function SpaceGallery({ gallery, galleryStyle, onOpen, root, onRequestProducts }) {
    if (!Array.isArray(gallery) || gallery.length === 0) return null;

    const reducedMotion = useReducedMotion();
    const style = GALLERY_STYLES_BY_PAGE[galleryStyle] || GALLERY_STYLES_BY_PAGE.default;

    const [hero, ...rest] = gallery;

    const heroRef = useRef(null);
    const heroParallaxY = useParallaxInContainer(heroRef, style.mood === "calm" ? 18 : 30, reducedMotion);

    return (
        <div className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
            <Reveal root={root}>
                <div className="mt-2">
                    <p className="text-xs tracking-[0.35em] text-white/70">ESPACIO · GALERÍA</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Espacios que inspiran.</h3>
                    <div className="mt-6 h-[2px] w-16 rounded-full bg-white/30" />
                </div>
            </Reveal>

            <Reveal root={root} className="mt-10">
                <article ref={heroRef} className={`group relative w-full overflow-hidden rounded-[2rem] ring-1 ${style.ring} ${style.heroAspect}`}>
                    <button type="button" onClick={() => onOpen?.(hero)} className="absolute inset-0" aria-label={hero.title}>
                        <img
                            src={hero.image}
                            alt={hero.title}
                            className={`h-full w-full object-cover transition-transform duration-700 ease-out ${style.zoom}`}
                            style={{ transform: reducedMotion ? undefined : `translate3d(0, ${heroParallaxY}px, 0)` }}
                            loading="lazy"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${style.overlay} to-transparent`} />
                    </button>

                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-8">
                        <p className="text-[10px] tracking-[0.3em] text-white/60">{hero.subtitle || "ESPACIO"}</p>
                        <p className="mt-2 text-xl font-medium text-white">{hero.title}</p>
                    </div>

                    {Array.isArray(hero.productCodes) && hero.productCodes.length ? (
                        <div className="absolute right-6 top-6 z-10">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onRequestProducts?.({ title: hero.title, codes: hero.productCodes.map(normalizeString).filter(Boolean) });
                                }}
                                className="rounded-full bg-white/15 px-5 py-2 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/25"
                            >
                                Ver productos
                            </button>
                        </div>
                    ) : null}
                </article>
            </Reveal>

            <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [column-fill:_balance]">
                {rest.map((g, idx) => {
                    const aspect =
                        idx % 5 === 0 ? "aspect-[3/4]" :
                            idx % 5 === 1 ? "aspect-[4/3]" :
                                idx % 5 === 2 ? "aspect-square" :
                                    idx % 5 === 3 ? "aspect-[16/11]" : "aspect-[2/3]";

                    const reactKey = `${g.key || "item"}-${idx}`;

                    return (
                        <Reveal key={reactKey} root={root} className="mb-6 break-inside-avoid">
                            <article className={`group relative overflow-hidden rounded-3xl ring-1 ${style.ring} ${aspect}`}>
                                <button type="button" onClick={() => onOpen?.(g)} className="absolute inset-0" aria-label={g.title}>
                                    <img src={g.image} alt={g.title} className={`h-full w-full object-cover transition-transform duration-700 ease-out ${style.zoom}`} loading="lazy" />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${style.overlay} to-transparent`} />
                                </button>

                                <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-5">
                                    <p className="text-[10px] tracking-[0.25em] text-white/60">{g.subtitle || "DETALLE"}</p>
                                    <p className="mt-1 text-sm font-medium text-white line-clamp-2">{g.title}</p>
                                </div>

                                {Array.isArray(g.productCodes) && g.productCodes.length ? (
                                    <div className="absolute right-4 top-4 z-10">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onRequestProducts?.({ title: g.title, codes: g.productCodes.map(normalizeString).filter(Boolean) });
                                            }}
                                            className="rounded-full bg-white/15 px-4 py-2 text-xs font-medium text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/25"
                                        >
                                            Ver productos
                                        </button>
                                    </div>
                                ) : null}
                            </article>
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}

function FeaturedSection({ section, onProductClick, root }) {
    const colecciones = Array.isArray(section.colecciones)
        ? section.colecciones
        : section.coleccion
            ? [section.coleccion]
            : [];

    return (
        <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
            <Reveal root={root}>
                <div className="mt-2">
                    <p className="text-xs tracking-[0.35em] text-white/70">{section.kicker || "DESTACADO"}</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{section.title}</h3>
                    <div className={`mt-6 h-[2px] w-16 rounded-full ${section.accentBarClass || "bg-white/40"}`} />
                </div>
            </Reveal>

            <div className="mt-8">
                <Suspense fallback={<div />}>
                    <CarruselProductosColeccionEspecifica
                        colecciones={colecciones}
                        limit={section.limit ?? 12}
                        perCollectionLimit={section.perCollectionLimit ?? 4}
                        onProductClick={onProductClick}
                    />
                </Suspense>
            </div>
        </div>
    );
}

function BrandSlide({ brand, isActive, onOpenItem, onOpenProduct, onRequestGalleryProducts }) {
    const navigate = useNavigate();
    const reducedMotion = useReducedMotion();
    const isActiveSafe = Boolean(isActive);
    const scrollRef = useRef(null);
    const parallaxY = useParallaxInContainer(scrollRef, brand.parallaxStrength, reducedMotion);
    const bottomReached = useBottomReached(scrollRef);

    const root = scrollRef.current || null;

    return (
        <section className="relative isolate h-[100dvh] w-[100vw] shrink-0 snap-center overflow-hidden">
            <div
                ref={scrollRef}
                className="h-[100dvh] overflow-y-auto overscroll-contain"
                onScroll={(e) => {
                    const y = e.currentTarget.scrollTop;
                    window.dispatchEvent(new CustomEvent("app:scroll", { detail: { y } }));
                }}
            >
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div
                        className="absolute inset-0 scale-[1.06]"
                        style={{ transform: `translate3d(0, ${parallaxY}px, 0)`, willChange: "transform" }}
                    >
                        <img
                            src={brand.background}
                            alt=""
                            className="h-full w-full object-cover"
                            loading={isActiveSafe ? "eager" : "lazy"}
                            decoding="async"
                            fetchPriority={isActiveSafe ? "high" : "auto"}
                        />

                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className={`absolute inset-x-0 bottom-0 h-40 ${brand.accentGlowClass}`} />
                </div>

                <div className="mx-auto max-w-7xl px-4 pt-24 lg:px-8">
                    <Reveal root={root}>
                        <p className="text-xs tracking-[0.35em] text-white/70">{brand.eyebrow}</p>

                        <div className="mt-4 flex items-end justify-between gap-6">
                            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">{brand.title}</h2>
                        </div>

                        {brand.microcopy ? <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/75">{brand.microcopy}</p> : null}

                        <div className={`mt-8 h-[2px] w-16 rounded-full ${brand.accentBarClass}`} />
                    </Reveal>
                </div>

                <AmbientGrid items={brand.ambients} onOpen={onOpenItem} root={root} />

                {Array.isArray(brand.featuredSections)
                    ? brand.featuredSections.map((section) => (
                        <FeaturedSection
                            key={section.title}
                            section={section}
                            onProductClick={(product) => onOpenProduct?.(product)}
                            root={root}
                        />
                    ))
                    : null}

                {Array.isArray(brand.gallery) && brand.gallery.length ? (
                    <SpaceGallery
                        gallery={brand.gallery}
                        galleryStyle={brand.key}
                        root={root}
                        onOpen={(g) =>
                            onOpenItem({
                                brand: brand.title,
                                title: g.title,
                                subtitle: g.subtitle || "Espacio / galería",
                                image: g.image,
                            })
                        }
                        onRequestProducts={onRequestGalleryProducts}
                    />
                ) : null}

                <div className="mx-auto max-w-7xl px-4 pb-10 lg:px-8 sm:hidden">
                    <Reveal root={root}>
                        <button
                            type="button"
                            onClick={() => navigate(brand.route)}
                            className="w-full rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
                        >
                            Entrar en {brand.title}
                        </button>
                    </Reveal>
                </div>

                <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
                    <div
                        className={[
                            "transition duration-500 motion-reduce:transition-none",
                            bottomReached ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
                        ].join(" ")}
                    >
                        <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
                            <p className="text-xs tracking-[0.3em] text-white/70">PRODUCTOS {brand.title.toUpperCase()}</p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(brand.productsHref)}
                                    className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:opacity-90"
                                >
                                    Ir a productos
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(brand.route)}
                                    className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                                >
                                    Ver marca
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="h-10" />
                </div>
            </div>
        </section>
    );
}

function Home() {
    const reducedMotion = useReducedMotion();

    const sliderRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const brands = Array.isArray(homeBrands) ? homeBrands : [];

    const slides = useMemo(() => {
        return [{ type: "intro", key: "intro" }, ...brands.map((b) => ({ type: "brand", key: b.key, brand: b }))];
    }, [brands]);

    const slidesCount = slides.length;

    const scrollToIndex = (index) => {
        const el = sliderRef.current;
        if (!el) return;
        const clamped = Math.max(0, Math.min(slidesCount - 1, index));
        el.scrollTo({
            left: clamped * el.clientWidth,
            behavior: reducedMotion ? "auto" : "smooth",
        });
    };

    useEffect(() => {
        const el = sliderRef.current;
        if (!el) return;

        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(() => {
                raf = 0;
                const idx = Math.round(el.scrollLeft / el.clientWidth);
                setActiveIndex(idx);
            });
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            if (raf) window.cancelAnimationFrame(raf);
            el.removeEventListener("scroll", onScroll);
        };
    }, []);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const openModal = (product) => {
        if (!product) return;
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const [galleryOverlayOpen, setGalleryOverlayOpen] = useState(false);
    const [galleryOverlayTitle, setGalleryOverlayTitle] = useState("");
    const [galleryOverlayLoading, setGalleryOverlayLoading] = useState(false);
    const [galleryOverlayProducts, setGalleryOverlayProducts] = useState([]);

    const openGalleryProductsOverlay = async ({ title, codes }) => {
        const cleanCodes = Array.isArray(codes) ? codes.map(normalizeString).filter(Boolean) : [];
        if (!cleanCodes.length) return;

        setGalleryOverlayTitle(title || "Productos");
        setGalleryOverlayOpen(true);
        setGalleryOverlayLoading(true);
        setGalleryOverlayProducts([]);

        const controller = new AbortController();

        try {
            const results = await Promise.allSettled(
                cleanCodes.map((code) => fetchProductByCode({ code, signal: controller.signal }))
            );

            const baseProducts = results
                .filter((r) => r.status === "fulfilled")
                .map((r) => r.value)
                .filter(Boolean);

            const productsWithImages = await Promise.all(
                baseProducts.map((p) => enrichProductWithImages({ product: p, signal: controller.signal }))
            );

            setGalleryOverlayProducts(productsWithImages);
        } catch {
            setGalleryOverlayProducts([]);
        } finally {
            setGalleryOverlayLoading(false);
        }
    };

    const closeGalleryProductsOverlay = () => {
        setGalleryOverlayOpen(false);
        setGalleryOverlayTitle("");
        setGalleryOverlayLoading(false);
        setGalleryOverlayProducts([]);
    };

    const [itemModalOpen, setItemModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const openItem = (item) => {
        setSelectedItem(item);
        setItemModalOpen(true);
    };

    const closeItem = () => {
        setItemModalOpen(false);
        setSelectedItem(null);
    };

    return (
        <CartProvider>
            <Header />

            <main>
                <div className="relative h-[100dvh]">
                    <div
                        ref={sliderRef}
                        className="flex h-[100dvh] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth"
                        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
                    >
                        {/* Mover a CSS global si quieres:
                .snap-x::-webkit-scrollbar { display: none; }
            */}

                        {slides.map((s, idx) => {
                            const isNearby = Math.abs(idx - activeIndex) <= 1;

                            if (s.type === "intro") {
                                if (!isNearby) {
                                    return <section key={s.key} className="h-[100dvh] w-[100vw] shrink-0 snap-center" />;
                                }
                                return <IntroSlide key={s.key} />;
                            }

                            if (!isNearby) {
                                return <section key={s.key} className="h-[100dvh] w-[100vw] shrink-0 snap-center" />;
                            }

                            return (
                                <BrandSlide
                                    isActive={idx === activeIndex}
                                    key={s.key}
                                    brand={s.brand}
                                    onOpenItem={openItem}
                                    onOpenProduct={openModal}
                                    onRequestGalleryProducts={openGalleryProductsOverlay}
                                />
                            );
                        })}
                    </div>

                    <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-3 sm:px-6">
                        <button
                            type="button"
                            className="pointer-events-auto rounded-full bg-white/10 px-4 py-3 text-sm font-medium text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
                            onClick={() => scrollToIndex(activeIndex - 1)}
                            aria-label="Anterior"
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            className="pointer-events-auto rounded-full bg-white/10 px-4 py-3 text-sm font-medium text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
                            onClick={() => scrollToIndex(activeIndex + 1)}
                            aria-label="Siguiente"
                        >
                            →
                        </button>
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <div className="rounded-full bg-white/10 px-4 py-2 text-[10px] tracking-[0.35em] text-white/70 ring-1 ring-white/10 backdrop-blur">
                            {String(activeIndex + 1).padStart(2, "0")} / {String(slidesCount).padStart(2, "0")}
                        </div>
                    </div>
                </div>
            </main>

            <GalleryProductsOverlay
                open={galleryOverlayOpen}
                title={galleryOverlayTitle}
                products={galleryOverlayProducts}
                loading={galleryOverlayLoading}
                onClose={closeGalleryProductsOverlay}
                onPickProduct={(p) => {
                    closeGalleryProductsOverlay();
                    openModal(p);
                }}
            />

            <Suspense fallback={null}>
                <Modal isOpen={modalOpen} close={closeModal} product={selectedProduct} />
            </Suspense>

            {itemModalOpen ? null : null}

        </CartProvider>
    );
}

export default Home;
