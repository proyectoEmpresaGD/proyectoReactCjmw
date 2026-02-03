import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CartProvider } from "../../components/CartContext";
import { Header } from "../../components/header";
import Footer from "../../components/footer";
import { coleccionesPorMarca } from "../../Constants/constants";
import { cdnUrl } from "../../Constants/cdn";

import CarruselColeccionesNuevas from "../../components/ComponentesBrands/carruselColecionesNuevas";
import PresentacionColeccion from "../../components/ComponentesBrands/ultimaColeccionTextoAnimado";
import CarruselProductosColeccionEspecifica from "../../components/ComponentesBrands/CarruselProductosColeccionEspecifica";
import Modal from "../../components/ComponentesProductos/modal";

import BassariEditorialStory from "../../components/ComponentesBrands/BassariEditorialStory";

const normalizeKey = (s) =>
    (s || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, "AND")
        .replace(/[^A-Za-z0-9]/g, "")
        .toUpperCase();

const brandConfigs = {
    BAS: {
        nameKey: "brands.bassari.name",
        taglineKey: "brands.bassari.tagline",
        introKey: "brands.bassari.intro",
        highlightKey: "brands.bassari.highlight",
        gradient: "from-[#8C5A2B] via-[#A66A3A] to-[#6F4422]",
        accent: "text-[#6F4422]",
        panel: "bg-white/75",
    },
    FLA: {
        nameKey: "brands.flamenco.name",
        taglineKey: "brands.flamenco.tagline",
        introKey: "brands.flamenco.intro",
        highlightKey: "brands.flamenco.highlight",
        gradient: "from-[#0B1F33] via-[#102A44] to-[#071423]",
        accent: "text-[#0B1F33]",
        panel: "bg-white/75",
    },
};

const Reveal = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
        >
            {children}
        </div>
    );
};

function ColeccionesMarcaPage() {
    const { t } = useTranslation("pageColeccionesMarca");
    const { marca } = useParams();
    const navigate = useNavigate();
    const marcaKey = (marca || "").toUpperCase();
    const config = brandConfigs[marcaKey];

    // ✅ medir header global
    const [pageHeaderOffset, setPageHeaderOffset] = useState(110);
    useEffect(() => {
        const measure = () => {
            const headerEl =
                document.querySelector("header") ||
                document.querySelector('[role="banner"]') ||
                document.querySelector(".header");
            const h = headerEl?.getBoundingClientRect?.().height || 0;
            setPageHeaderOffset(h ? Math.round(h) : 110);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const coleccionesBase = coleccionesPorMarca[marcaKey] || [];

    const coleccionesNuevasBAS = useMemo(
        () => ["ESSENCES DU NIL", "LE VOYAGE DES WOLOF"],
        []
    );
    const coleccionesNuevasFLA = useMemo(
        () => ["INDIENNE STRIPES", "PALACIO DE LAS DUEÑAS"],
        []
    );

    const isBassari = marcaKey === "BAS";
    const isFlamenco = marcaKey === "FLA";
    const isNuevaColeccionBrand = isBassari || isFlamenco;

    const colecciones = useMemo(() => {
        if (isBassari) return coleccionesNuevasBAS;
        if (isFlamenco) return coleccionesNuevasFLA;
        return coleccionesBase;
    }, [
        isBassari,
        isFlamenco,
        coleccionesNuevasBAS,
        coleccionesNuevasFLA,
        coleccionesBase,
    ]);

    const [imagenes, setImagenes] = useState({});

    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalAbierta, setModalAbierta] = useState(false);

    const handleCloseModal = () => {
        setModalAbierta(false);
        setProductoSeleccionado(null);
    };

    const handleProductClick = (producto) => {
        if (!producto) return;
        setProductoSeleccionado(producto);
        setModalAbierta(true);
    };

    const buildProductUrl = (query = {}) => {
        const params = new URLSearchParams();
        if (marcaKey) params.set("brand", marcaKey);
        if (query.collection) params.set("collection", query.collection);
        return `/products?${params.toString()}`;
    };

    /**
     * ✅ NO TOCAMOS rutas manualmente para no romper nada.
     * Si fallan por el %20/, probamos variantes automáticamente.
     */
    const coversOverride = useMemo(
        () => ({
            BAS: {
                "ESSENCES DU NIL":
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/BASSARI/ESSENCES%20DU%20NIL/BASS_LIBRO_ESSENCES_DU_NIL_44X44%2B3MM_SANGRE_resultado.webp",
                "LE VOYAGE DES WOLOF":
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/BASSARI/LE%20VOYAGE%20DES%20WOLOF%20/BASS_LIBRO_LEVOYAGEDESWOLOFS_34X34%2B3MM_SANGRE_resultado.webp",
            },
            FLA: {
                "INDIENNE STRIPES":
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/FLAMENCO/INDIENNE%20STRIPES/FLA_INDIENNE_STRIPES_34XX26%2B3MM_SANGRE_resultado.webp",
                "PALACIO DE LAS DUEÑAS":
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/FLAMENCO/PALACIO%20DE%20LAS%20DUE%C3%91AS/FLA_PALCIO_DUENAS_LIBRO_34x34MM_3MM_SANGRE_resultado.webp",
            },
        }),
        []
    );

    const coleccionesNorm = useMemo(
        () => new Map(colecciones.map((c) => [normalizeKey(c), c])),
        [colecciones]
    );

    useEffect(() => {
        if (!marcaKey || colecciones.length === 0) {
            setImagenes({});
            return;
        }

        const ac = new AbortController();

        const fetchTodo = async () => {
            try {
                const url = `${import.meta.env.VITE_API_BASE_URL}/api/collections/brand/${encodeURIComponent(
                    marcaKey
                )}`;
                const res = await fetch(url, { signal: ac.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                const byNormKey = {};
                for (const [nombreColeccion, arrUrls] of Object.entries(
                    data.collections || {}
                )) {
                    byNormKey[normalizeKey(nombreColeccion)] = Array.isArray(arrUrls)
                        ? arrUrls
                        : [];
                }

                const out = {};
                for (const [normKey, displayName] of coleccionesNorm.entries()) {
                    const lista = byNormKey[normKey] || [];
                    out[displayName] = lista.length > 0 ? cdnUrl(lista[0]) : null;
                }

                // override por marca (tal cual)
                const overrideForBrand = coversOverride[marcaKey];
                if (overrideForBrand) {
                    for (const [col, coverUrl] of Object.entries(overrideForBrand)) {
                        if (coverUrl) out[col] = coverUrl;
                    }
                }

                if (!ac.signal.aborted) setImagenes(out);
            } catch (err) {
                console.error("Error cargando colecciones:", err);
                if (!ac.signal.aborted) {
                    const nulos = {};
                    colecciones.forEach((c) => (nulos[c] = null));

                    const overrideForBrand = coversOverride[marcaKey];
                    if (overrideForBrand) {
                        for (const [col, coverUrl] of Object.entries(overrideForBrand)) {
                            if (coverUrl) nulos[col] = coverUrl;
                        }
                    }

                    setImagenes(nulos);
                }
            }
        };

        fetchTodo();
        return () => ac.abort();
    }, [marcaKey, colecciones, coleccionesNorm, coversOverride]);

    const carouselWrapperRef = useRef(null);
    useEffect(() => {
        const root = carouselWrapperRef.current;
        if (!root) return;

        const toHide = Array.from(root.querySelectorAll("button")).filter((b) =>
            (b.textContent || "")
                .toLowerCase()
                .includes(
                    (
                        t("carousel.hideCtaMatch", "descubre todas las colecciones") || ""
                    ).toLowerCase()
                )
        );

        toHide.forEach((b) => {
            b.style.display = "none";
            b.style.visibility = "hidden";
            b.style.pointerEvents = "none";
        });
    }, [marcaKey, imagenes, t]);

    // ✅ Imágenes reales para ESSENCES
    const essencesImages = useMemo(
        () => [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/BASSARI/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_1080X1921_01.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/BASSARI/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_1080X1921_02.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/BASSARI/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_1080X1921_03.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/BASSARI/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_1080X1921_04.jpg",
        ],
        []
    );

    // ✅ Sistema “a prueba de balas” contra el %20/
    const makeUrlAlternatives = (url) => {
        if (!url) return [];
        const u = String(url);

        const variants = [u];
        variants.push(u.replace(/%20\//g, "/"));
        variants.push(u.replace(/\/(BASSARI|FLAMENCO)\//g, "%20/$1/"));
        variants.push(
            u.replace(/COLECCIONES%20NUEVAS%20\//g, "COLECCIONES%20NUEVAS/").replace(
                /WOLOF%20\//g,
                "WOLOF/"
            )
        );

        return Array.from(new Set(variants.filter(Boolean)));
    };

    const [coverAttempt, setCoverAttempt] = useState({});
    const [coverFallback, setCoverFallback] = useState({}); // null => placeholder

    const getCover = (coleccion) => {
        if (coverFallback[coleccion] !== undefined) return coverFallback[coleccion];

        const base =
            imagenes[coleccion] || coversOverride[marcaKey]?.[coleccion] || null;
        if (!base) return null;

        const variants = makeUrlAlternatives(base);
        const idx = coverAttempt[coleccion] || 0;

        return variants[idx] || variants[0] || null;
    };

    const onCoverError = (coleccion) => {
        if (coverFallback[coleccion] !== undefined) return;

        const base =
            imagenes[coleccion] || coversOverride[marcaKey]?.[coleccion] || null;
        const variants = makeUrlAlternatives(base);
        const current = coverAttempt[coleccion] || 0;
        const next = current + 1;

        if (variants && next < variants.length) {
            setCoverAttempt((p) => ({ ...p, [coleccion]: next }));
            return;
        }

        // fallback por colección
        if (marcaKey === "BAS" && coleccion === "ESSENCES DU NIL") {
            setCoverFallback((p) => ({ ...p, [coleccion]: essencesImages[0] }));
            return;
        }
        if (marcaKey === "BAS" && coleccion === "LE VOYAGE DES WOLOF") {
            setCoverFallback((p) => ({ ...p, [coleccion]: null }));
            return;
        }

        setCoverFallback((p) => ({ ...p, [coleccion]: null }));
    };

    const slidesNuevas = useMemo(() => {
        if (!isNuevaColeccionBrand) return [];

        if (isBassari) {
            return [
                {
                    name: "ESSENCES DU NIL",
                    render: () => (
                        <div
                            onMouseEnter={() =>
                                window.dispatchEvent(new CustomEvent("carousel-pause"))
                            }
                            onMouseLeave={() =>
                                window.dispatchEvent(new CustomEvent("carousel-resume"))
                            }
                            className="grid grid-cols-1 gap-6"
                        >
                            <BassariEditorialStory
                                headerOffset={pageHeaderOffset}
                                title={t("newCollections.bassari.essences.title", "ESSENCES DU NIL")}
                                subtitle={t(
                                    "newCollections.bassari.essences.subtitle",
                                    "Un viaje por el Nilo inspirado en tradiciones africanas y la tribu Iwol/Wolof."
                                )}
                                images={essencesImages}
                            />

                            <CarruselProductosColeccionEspecifica
                                coleccion="ESSENCES DU NIL"
                                onProductClick={handleProductClick}
                            />
                        </div>
                    ),
                },
                {
                    name: "LE VOYAGE DES WOLOF",
                    render: () => (
                        <div
                            onMouseEnter={() =>
                                window.dispatchEvent(new CustomEvent("carousel-pause"))
                            }
                            onMouseLeave={() =>
                                window.dispatchEvent(new CustomEvent("carousel-resume"))
                            }
                            className="grid grid-cols-1 gap-6"
                        >
                            <div className="cjmw-presentacion-scope">
                                <style>{`
                  .cjmw-presentacion-scope,
                  .cjmw-presentacion-scope * { color: #111827 !important; }
                  .cjmw-presentacion-scope .text-white,
                  .cjmw-presentacion-scope .text-black { color: #111827 !important; }
                `}</style>

                                <PresentacionColeccion
                                    titulo={t("newCollections.bassari.voyage.title", "LE VOYAGE DES WOLOF")}
                                    imagenFondo={getCover("LE VOYAGE DES WOLOF")}
                                    descripcion={t("newCollections.bassari.voyage.description")}
                                />
                            </div>

                            <CarruselProductosColeccionEspecifica
                                coleccion="LE VOYAGE DES WOLOF"
                                onProductClick={handleProductClick}
                            />
                        </div>
                    ),
                },
            ];
        }

        return [
            {
                name: "INDIENNE STRIPES",
                render: () => (
                    <div
                        onMouseEnter={() =>
                            window.dispatchEvent(new CustomEvent("carousel-pause"))
                        }
                        onMouseLeave={() =>
                            window.dispatchEvent(new CustomEvent("carousel-resume"))
                        }
                        className="grid grid-cols-1 gap-6"
                    >
                        <div className="cjmw-presentacion-scope">
                            <style>{`
                .cjmw-presentacion-scope,
                .cjmw-presentacion-scope * { color: #111827 !important; }
                .cjmw-presentacion-scope .text-white,
                .cjmw-presentacion-scope .text-black { color: #111827 !important; }
              `}</style>

                            <PresentacionColeccion
                                titulo={t("newCollections.flamenco.indienne.title")}
                                imagenFondo={
                                    imagenes["INDIENNE STRIPES"] ||
                                    coversOverride.FLA["INDIENNE STRIPES"]
                                }
                                descripcion={t("newCollections.flamenco.indienne.description")}
                            />
                        </div>

                        <CarruselProductosColeccionEspecifica
                            coleccion="INDIENNE STRIPES"
                            onProductClick={handleProductClick}
                        />
                    </div>
                ),
            },
            {
                name: "PALACIO DE LAS DUEÑAS",
                render: () => (
                    <div
                        onMouseEnter={() =>
                            window.dispatchEvent(new CustomEvent("carousel-pause"))
                        }
                        onMouseLeave={() =>
                            window.dispatchEvent(new CustomEvent("carousel-resume"))
                        }
                        className="grid grid-cols-1 gap-6"
                    >
                        <div className="cjmw-presentacion-scope">
                            <style>{`
                .cjmw-presentacion-scope,
                .cjmw-presentacion-scope * { color: #111827 !important; }
                .cjmw-presentacion-scope .text-white,
                .cjmw-presentacion-scope .text-black { color: #111827 !important; }
              `}</style>

                            <PresentacionColeccion
                                titulo={t("newCollections.flamenco.palacio.title")}
                                imagenFondo={
                                    imagenes["PALACIO DE LAS DUEÑAS"] ||
                                    coversOverride.FLA["PALACIO DE LAS DUEÑAS"] ||
                                    imagenes["INDIENNE STRIPES"] ||
                                    coversOverride.FLA["INDIENNE STRIPES"]
                                }
                                descripcion={t("newCollections.flamenco.palacio.description")}
                            />
                        </div>

                        <CarruselProductosColeccionEspecifica
                            coleccion="PALACIO DE LAS DUEÑAS"
                            onProductClick={handleProductClick}
                        />
                    </div>
                ),
            },
        ];
    }, [
        isNuevaColeccionBrand,
        isBassari,
        isFlamenco,
        imagenes,
        coversOverride,
        t,
        pageHeaderOffset,
        essencesImages,
    ]);

    const heroImage = useMemo(() => {
        if (!isNuevaColeccionBrand) return null;

        const overrideForBrand = coversOverride[marcaKey] || {};
        for (const c of colecciones) {
            if (overrideForBrand[c]) return overrideForBrand[c];
            if (imagenes[c]) return imagenes[c];
        }
        return null;
    }, [isNuevaColeccionBrand, coversOverride, marcaKey, colecciones, imagenes]);

    if (!config) {
        return (
            <CartProvider>
                <Header />
                <main className="min-h-screen flex items-center justify-center px-6 text-center bg-white text-gray-900">
                    <div className="max-w-xl">
                        <h1 className="text-3xl font-semibold text-gray-900">
                            {t("notFound.title")}
                        </h1>
                        <p className="mt-4 text-gray-600">{t("notFound.description")}</p>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 px-6 py-3 rounded-full border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
                        >
                            {t("notFound.cta")}
                        </button>
                    </div>
                </main>
                <Footer />
            </CartProvider>
        );
    }

    const brandName = t(config.nameKey);

    return (
        <CartProvider>
            <Header />

            <main
                style={{ "--page-header-offset": `${pageHeaderOffset}px` }}
                className="bg-white text-gray-900"
            >
                {/* HERO */}
                <section
                    className={`relative overflow-hidden bg-gradient-to-br ${config.gradient} pt-[calc(var(--page-header-offset,96px)+12px)]`}
                >
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),transparent_60%)]" />

                    {isNuevaColeccionBrand && heroImage && (
                        <div className="absolute inset-0 opacity-20">
                            <img
                                src={heroImage}
                                alt={t("hero.imageAlt")}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/35 to-white/10" />
                        </div>
                    )}

                    <div className="relative max-w-6xl mx-auto px-6 pb-16 pt-10 lg:pb-20 lg:pt-12">
                        <Reveal>
                            <p className={`uppercase tracking-[0.4em] text-xs ${config.accent}`}>
                                {t(
                                    isNuevaColeccionBrand
                                        ? "hero.label.newCollections"
                                        : "hero.label.collections"
                                )}{" "}
                                {brandName}
                            </p>
                        </Reveal>

                        <Reveal delay={120}>
                            <h1 className="mt-6 text-4xl md:text-6xl font-semibold leading-tight text-white drop-shadow-sm">
                                {t(config.taglineKey)}
                            </h1>
                        </Reveal>

                        <Reveal delay={240}>
                            <p className="mt-6 max-w-2xl text-lg text-white/90 drop-shadow-sm">
                                {t(config.introKey)}
                            </p>
                        </Reveal>

                        <Reveal delay={360}>
                            <div className="mt-10 flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate(buildProductUrl())}
                                    className="px-6 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-lg hover:-translate-y-1 transition"
                                >
                                    {t("hero.cta.exploreProducts")}
                                </button>
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/${marcaKey === "BAS" ? "bassariHome" : "flamencoHome"}`
                                        )
                                    }
                                    className="px-6 py-3 rounded-full border border-white/70 text-white hover:bg-white/15 transition"
                                >
                                    {t("hero.cta.backToBrand")}
                                </button>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* NUEVAS COLECCIONES */}
                {isNuevaColeccionBrand && (
                    <section className="py-14 bg-white">
                        <div className="max-w-7xl mx-auto px-6">
                            <Reveal>
                                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.4em] text-gray-500">
                                            {t("sections.featured.label")}
                                        </p>
                                        <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-gray-900">
                                            {t(
                                                isBassari
                                                    ? "sections.featured.title.bassari"
                                                    : "sections.featured.title.flamenco"
                                            )}
                                        </h2>
                                    </div>
                                    <div className="text-gray-600 max-w-xl">
                                        {t("sections.featured.subtitle")}
                                    </div>
                                </div>
                            </Reveal>

                            <div
                                ref={carouselWrapperRef}
                                className="mt-10 rounded-[2.25rem] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-visible"
                            >
                                <CarruselColeccionesNuevas
                                    slides={slidesNuevas}
                                    durationMs={15000}
                                    stickyHeader
                                />
                            </div>

                            {productoSeleccionado && (
                                <Modal
                                    isOpen={modalAbierta}
                                    close={handleCloseModal}
                                    product={productoSeleccionado}
                                />
                            )}
                        </div>
                    </section>
                )}

                {/* STORY */}
                <section className="relative py-16 bg-white">
                    <div className="max-w-6xl mx-auto px-6 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
                        <Reveal>
                            <div className="space-y-6">
                                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
                                    {t("sections.story.title")}
                                </h2>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {t(config.highlightKey)}
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {colecciones.slice(0, 4).map((coleccion) => (
                                        <span
                                            key={coleccion}
                                            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm tracking-wide uppercase text-gray-700"
                                        >
                                            {coleccion}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={180}>
                            <div
                                className={`rounded-3xl p-8 ${config.panel} backdrop-blur-lg shadow-xl border border-gray-200`}
                            >
                                <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                                    {t("sections.story.panel.kicker")}
                                </p>
                                <h3 className="mt-4 text-2xl font-semibold text-gray-900">
                                    {t("sections.story.panel.title")}
                                </h3>
                                <p className="mt-4 text-gray-700">
                                    {t("sections.story.panel.description")}
                                </p>
                                <button
                                    onClick={() => navigate(buildProductUrl())}
                                    className="mt-6 inline-flex items-center gap-3 text-gray-900 font-semibold group"
                                >
                                    {t("sections.story.panel.cta")}
                                    <span className="inline-flex w-10 h-10 rounded-full border border-gray-300 items-center justify-center group-hover:bg-gray-50 transition">
                                        →
                                    </span>
                                </button>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* GRID COLECCIONES */}
                <section className="py-16 bg-gradient-to-b from-white to-gray-50">
                    <div className="max-w-6xl mx-auto px-6">
                        <Reveal>
                            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.4em] text-gray-500">
                                        {t("sections.grid.label")}
                                    </p>
                                    <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-gray-900">
                                        {t(
                                            isNuevaColeccionBrand
                                                ? "sections.grid.title.new"
                                                : "sections.grid.title.all"
                                        )}
                                    </h2>
                                </div>

                                <button
                                    onClick={() => navigate(buildProductUrl())}
                                    className="px-6 py-3 rounded-full border border-gray-300 text-gray-900 hover:bg-gray-100 transition"
                                >
                                    {t("sections.grid.ctaAll")}
                                </button>
                            </div>
                        </Reveal>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {colecciones.map((coleccion, index) => {
                                const coverSrc = getCover(coleccion); // ✅ calcular 1 vez por render

                                return (
                                    <Reveal key={coleccion} delay={index * 80}>
                                        <button
                                            onClick={() =>
                                                navigate(buildProductUrl({ collection: coleccion }))
                                            }
                                            className="group text-left"
                                        >
                                            <div className="relative overflow-hidden rounded-3xl shadow-[0_18px_50px_rgba(0,0,0,0.10)] border border-gray-200 bg-white">
                                                <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/10 to-transparent" />

                                                {coverSrc ? (
                                                    <>
                                                        <img
                                                            key={coverSrc} // ✅ fuerza remount cuando cambia la variante
                                                            src={coverSrc}
                                                            alt={t("sections.grid.cardImageAlt", { coleccion })}
                                                            className="h-64 w-full object-cover transition duration-700 group-hover:scale-110"
                                                            onError={() => onCoverError(coleccion)}
                                                            loading="lazy"
                                                        />

                                                        {/* ✅ SOLO si hay imagen mostramos caption inferior */}
                                                        <div className="absolute inset-x-6 bottom-6">
                                                            <p className="text-xs uppercase tracking-[0.35em] text-gray-600">
                                                                {t("sections.grid.cardLabel")}
                                                            </p>
                                                            <h3 className="mt-2 text-xl font-semibold text-gray-900">
                                                                {coleccion}
                                                            </h3>
                                                        </div>
                                                    </>
                                                ) : (
                                                    // ✅ Placeholder editorial sin duplicar caption
                                                    <div className="h-64 w-full flex items-end p-6 bg-[linear-gradient(180deg,#faf7f2,transparent_60%),radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.06),transparent_60%)]">
                                                        <div>
                                                            <p className="text-xs uppercase tracking-[0.35em] text-gray-600">
                                                                Colección
                                                            </p>
                                                            <h3 className="mt-2 text-xl font-semibold text-gray-900">
                                                                {coleccion}
                                                            </h3>
                                                            <p className="mt-2 text-sm text-gray-600">
                                                                Imágenes en preparación
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 flex items-center gap-3 text-gray-700">
                                                <span>{t("sections.grid.cardCta")}</span>
                                                <span className="text-xl">→</span>
                                            </div>
                                        </button>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </CartProvider>
    );
}

export default ColeccionesMarcaPage;


