// src/components/colecciones/pageColeccion.jsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { CartProvider } from "../../components/CartContext";
import { Header } from "../../components/header";
import Footer from "../../components/footer";

import { useTranslation } from "react-i18next";
import { imagenesColecciones, coleccionConfigByName } from "../../Constants/constants";

import CarruselProductosColeccionEspecifica from "../../components/ComponentesBrands/CarruselProductosColeccionEspecifica";
import Modal from "../ComponentesProductos/modal";
import DragImagenesColeccion from "./DragImagenesColeccion";

function safeDecode(value) {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

const normalizeColeccionName = (name) =>
    String(name || "").trim().toUpperCase();

const safeT = (t, key) => {
    const res = t(key, { defaultValue: "" });
    return typeof res === "string" && res.trim() ? res : null;
};

/**
 * Querystring esperado:
 * - introTop
 * - introBottom
 * - introBrouchure
 * - brochureImage
 * - brochurePdf
 * - heroImage
 * - images (JSON array stringificado)
 */
function readFromSearch(search) {
    const sp = new URLSearchParams(search);
    const get = (k) => sp.get(k) || null;

    const imagesRaw = get("images");
    let images = [];
    if (imagesRaw) {
        try {
            const parsed = JSON.parse(imagesRaw);
            images = Array.isArray(parsed) ? parsed.filter(Boolean) : [];
        } catch {
            images = [];
        }
    }

    return {
        introTop: get("introTop"),
        introBottom: get("introBottom"),
        introBrouchure: get("introBrouchure"),
        brochureImage: get("brochureImage"),
        brochurePdf: get("brochurePdf"),
        heroImage: get("heroImage"),
        images,
    };
}

/**
 * ✅ Fallback desde constants + common.json
 * - imágenes y brochure desde coleccionConfigByName
 * - textos desde common.json: Colecciones.<textKey>.*
 */
function buildColeccionFallbackFromCommon({ collectionName, t }) {
    const key = normalizeColeccionName(collectionName);
    const cfg = coleccionConfigByName?.[key];
    if (!cfg) return null;

    const imgs = cfg.imagesKey
        ? imagenesColecciones?.[cfg.imagesKey] || []
        : [];

    const heroImage = Number.isFinite(cfg.heroIndex)
        ? imgs?.[cfg.heroIndex] || null
        : imgs?.[0] || null;

    const brochureImage = Number.isFinite(cfg.brochureImageIndex)
        ? imgs?.[cfg.brochureImageIndex] || null
        : null;

    const textKey = cfg.textKey;

    const introTop = textKey
        ? safeT(t, `Colecciones.${textKey}.introTop`)
        : null;

    const introBottom = textKey
        ? safeT(t, `Colecciones.${textKey}.introBottom`)
        : null;

    const introBrouchure = textKey
        ? safeT(t, `Colecciones.${textKey}.introBrouchure`)
        : null;

    return {
        introTop,
        introBottom,
        introBrouchure,
        heroImage,
        images: imgs,
        brochureImage,
        brochurePdf: cfg.brochurePdf || null,
    };
}

export default function ColeccionPage() {
    const { coleccion: coleccionParam } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // 👇 IMPORTANTE: usar common para que lea Colecciones.* de common.json
    const { t } = useTranslation("common");

    const coleccion = useMemo(() => safeDecode(coleccionParam || ""), [coleccionParam]);

    // Querystring (persistente al refrescar)
    const queryContent = useMemo(() => readFromSearch(location.search), [location.search]);

    // State (opcional; no persistente al refrescar)
    const stateContent = useMemo(() => {
        const s = location.state;
        if (!s || typeof s !== "object") return {};
        return {
            introTop: typeof s.introTop === "string" ? s.introTop : null,
            introBottom: typeof s.introBottom === "string" ? s.introBottom : null,
            introBrouchure: typeof s.introBrouchure === "string" ? s.introBrouchure : null,
            brochureImage: typeof s.brochureImage === "string" ? s.brochureImage : null,
            brochurePdf: typeof s.brochurePdf === "string" ? s.brochurePdf : null,
            heroImage: typeof s.heroImage === "string" ? s.heroImage : null,
            images: Array.isArray(s.images) ? s.images.filter(Boolean) : null,
        };
    }, [location.state]);

    // ✅ Fallback desde common.json + constants
    const fallbackParams = useMemo(() => {
        if (!coleccion) return null;
        return buildColeccionFallbackFromCommon({ collectionName: coleccion, t });
    }, [coleccion, t]);

    // ✅ Prioridad: state > query > fallback > null
    const content = useMemo(
        () => ({
            introTop: stateContent.introTop ?? queryContent.introTop ?? fallbackParams?.introTop ?? null,
            introBottom: stateContent.introBottom ?? queryContent.introBottom ?? fallbackParams?.introBottom ?? null,
            introBrouchure:
                stateContent.introBrouchure ?? queryContent.introBrouchure ?? fallbackParams?.introBrouchure ?? null,
            brochureImage:
                stateContent.brochureImage ?? queryContent.brochureImage ?? fallbackParams?.brochureImage ?? null,
            brochurePdf: stateContent.brochurePdf ?? queryContent.brochurePdf ?? fallbackParams?.brochurePdf ?? null,
            heroImage: stateContent.heroImage ?? queryContent.heroImage ?? fallbackParams?.heroImage ?? null,
            images: stateContent.images ?? queryContent.images ?? fallbackParams?.images ?? [],
        }),
        [stateContent, queryContent, fallbackParams]
    );

    const heroImage = useMemo(() => {
        if (content.heroImage) return content.heroImage;
        if (content.images.length > 0) return content.images[0];
        return null;
    }, [content.heroImage, content.images]);

    const carouselImages = useMemo(() => {
        const list = content.images || [];
        if (!list.length) return [];
        if (heroImage && list[0] === heroImage) return list.slice(1);
        return list;
    }, [content.images, heroImage]);

    // Modal producto
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

    if (!coleccion) {
        return (
            <CartProvider>
                <Header />
                <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-6">
                    <div className="max-w-xl text-center">
                        <h1 className="text-3xl font-semibold">Colección no encontrada</h1>
                        <p className="mt-4 text-gray-600">No se ha podido resolver el nombre de la colección.</p>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 px-6 py-3 rounded-full border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
                        >
                            Volver al inicio
                        </button>
                    </div>
                </main>
                <Footer />
            </CartProvider>
        );
    }

    return (
        <CartProvider>
            <Header />

            <main className="bg-white text-gray-900">
                {/* 1) NOMBRE + TEXTO */}
                <section className="pt-24 pb-10">
                    <div className="max-w-5xl mx-auto px-6">
                        <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Colección</p>
                        <h1 className="mt-4 text-4xl md:text-6xl font-semibold leading-tight">{coleccion}</h1>

                        <p className="mt-6 max-w-full text-lg text-gray-700 leading-relaxed">
                            {content.introTop ||
                                "Descubre la historia y el carácter de esta colección a través de sus ambientes, texturas y detalles."}
                        </p>
                    </div>
                </section>

                {/* 2) IMAGEN GRANDE AMBIENTE + TEXTO */}
                <section className="pb-14">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="relative overflow-hidden rounded-[2.25rem] border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] bg-white">
                            <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
                            {heroImage ? (
                                <img src={heroImage} alt={`Ambiente ${coleccion}`} className="h-[520px] w-full object-cover" />
                            ) : (
                                <div className="h-[520px] w-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    Sin imagen de ambiente
                                </div>
                            )}
                        </div>

                        <p className="mt-8 max-w-full text-gray-700 text-lg leading-relaxed">
                            {content.introBottom ||
                                "Una selección pensada para crear espacios con presencia, equilibrio y un punto de sofisticación."}
                        </p>
                    </div>
                </section>

                {/* 3) CARRUSEL IMÁGENES */}
                {carouselImages.length > 0 && (
                    <section className="pb-16">
                        <div className="max-w-6xl mx-auto px-6">
                            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Imágenes</p>
                            <h2 className="mt-3 text-2xl md:text-3xl font-semibold">Ambientes y detalles</h2>
                        </div>

                        <div className="mt-10 w-full overflow-hidden">
                            <div className="relative w-full">
                                <div className="px-0">
                                    <DragImagenesColeccion images={carouselImages} className="" />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 4) CARRUSEL PRODUCTOS */}
                <section className="py-16">
                    <div className="max-w-6xl mx-auto px-6">
                        <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Productos</p>
                        <h2 className="mt-3 text-2xl md:text-3xl font-semibold">Explora la colección</h2>

                        <div className="mt-10">
                            <CarruselProductosColeccionEspecifica coleccion={coleccion} onProductClick={handleProductClick} />
                        </div>

                        {productoSeleccionado && (
                            <Modal isOpen={modalAbierta} close={handleCloseModal} product={productoSeleccionado} />
                        )}
                    </div>
                </section>

                {/* 5) BROCHURE (solo si hay PDF) */}
                {content.brochurePdf && (
                    <section className="py-16 bg-white">
                        <div className="max-w-6xl mx-auto px-6">
                            <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Brochure</p>
                            <h2 className="mt-3 text-2xl md:text-3xl font-semibold">Descargar brochure</h2>

                            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] items-start">
                                <a
                                    href={content.brochurePdf}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group block"
                                >
                                    <div className="relative overflow-hidden rounded-3xl border border-gray-200 shadow-[0_18px_50px_rgba(0,0,0,0.10)] bg-white">
                                        {content.brochureImage ? (
                                            <img
                                                src={content.brochureImage}
                                                alt={`Brochure ${coleccion}`}
                                                className="w-full h-[520px] object-cover transition duration-700 group-hover:scale-[1.03]"
                                            />
                                        ) : (
                                            <div className="w-full h-[520px] bg-gray-100 flex items-center justify-center text-gray-500">
                                                Ver brochure
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
                                    </div>
                                </a>

                                <div className="lg:pt-4">
                                    <p className="text-gray-700 max-w-sm leading-relaxed">{content.introBrouchure}</p>

                                    <a
                                        href={content.brochurePdf}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-gray-300 text-gray-900 hover:bg-gray-100 transition"
                                    >
                                        Abrir Brochure
                                        <span className="inline-flex w-10 h-10 rounded-full border border-gray-300 items-center justify-center">
                                            →
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </CartProvider>
    );
}
