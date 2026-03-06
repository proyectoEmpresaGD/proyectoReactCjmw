import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";

import { cdnUrl } from "../../Constants/cdn";
import { defaultImageUrl } from "../../Constants/constants";

function shuffleCopy(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickRandomUnique(items, count) {
    const shuffled = shuffleCopy(items);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

function buildByFilterUrl(apiUrl) {
    const base = String(apiUrl || "").replace(/\/$/, "");
    if (!base) throw new Error("VITE_API_BASE_URL no definido");
    return `${base}/api/products/filter?limit=120&page=1`;
}

function buildImageApiUrl(apiUrl, codprodu, quality) {
    const base = String(apiUrl || "").replace(/\/$/, "");
    if (!base) throw new Error("VITE_API_BASE_URL no definido");
    return `${base}/api/images/${codprodu}/${quality}`;
}

// Igual que en ModalProductosPorCodigos: obtiene path (ficadjunto) y lo pasa por cdnUrl
async function fetchProductImage({ apiUrl, codprodu, quality, signal }) {
    if (!codprodu) return null;

    const url = buildImageApiUrl(apiUrl, codprodu, quality);
    const res = await fetch(url, { signal });

    if (!res.ok) return null;

    const json = await res.json().catch(() => null);
    const path = json?.ficadjunto;

    return path ? cdnUrl(path) : null;
}

async function ensureGoodImage({ apiUrl, product }) {
    if (!product?.codprodu) return product;

    // Si ya tiene imageBuena, perfecto
    if (product.imageBuena) return product;

    const good = await fetchProductImage({
        apiUrl,
        codprodu: product.codprodu,
        quality: "PRODUCTO_BUENA",
    });

    return {
        ...product,
        imageBuena: good || product.imageBaja || product.imagebaja || defaultImageUrl,
    };
}

async function hydrateLowResImages({ apiUrl, products, signal }) {
    const list = Array.isArray(products) ? products : [];

    const hydrated = await Promise.all(
        list.map(async (p) => {
            if (!p?.codprodu) return p;

            // Si ya trae imagen baja, no repetimos
            if (p.imageBaja || p.imagebaja) {
                return { ...p, imageBaja: p.imageBaja || p.imagebaja };
            }

            const low = await fetchProductImage({
                apiUrl,
                codprodu: p.codprodu,
                quality: "PRODUCTO_BAJA",
                signal,
            });

            return { ...p, imageBaja: low || defaultImageUrl };
        })
    );

    return hydrated;
}

function getProductImage(product) {
    return (
        product?.imageBaja ||
        product?.imagebaja ||
        product?.imageAlta ||
        product?.imagealta ||
        defaultImageUrl
    );
}

function getProductTitle(product) {
    return product?.nombre || product?.name || product?.codprodu || "—";
}

export default function BrandRandomSelectionCarousel({
    brandCode, // "HAR"
    brandName, // "Harbour"
    onProductClick,
    className = "",
    total = 12,
}) {
    const { t } = useTranslation("brandSelectionCarousel");

    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const swiperRef = useRef(null);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const sectionRef = useRef(null);
    const [autoplayEnabled, setAutoplayEnabled] = useState(false);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();

    // ✅ Cache de imagen alta por codprodu (para no refetchear)
    const highImageCacheRef = useRef(new Map());

    const handleExploreAll = () => {
        navigate(`/products?brand=${encodeURIComponent(brandCode)}`);
    };

    useEffect(() => {
        if (!brandCode) return;

        const controller = new AbortController();

        async function load() {
            try {
                setLoading(true);

                // 1) Traer un pool de productos por marca
                const url = buildByFilterUrl(apiUrl);
                const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    signal: controller.signal,
                    body: JSON.stringify({ brand: [brandCode] }),
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const data = await res.json();
                const list =
                    data?.products ||
                    data?.items ||
                    data?.data ||
                    (Array.isArray(data) ? data : []);

                // 2) Elegir 12 aleatorios
                const selected = pickRandomUnique(list, total);

                // 3) Hidratar imágenes (como ModalProductosPorCodigos)
                const withImages = await hydrateLowResImages({
                    apiUrl,
                    products: selected,
                    signal: controller.signal,
                });

                setItems(withImages);
            } catch (e) {
                if (e?.name !== "AbortError") {
                    console.error("BrandRandomSelectionCarousel error:", e);
                }
                setItems([]);
            } finally {
                setLoading(false);
            }
        }

        load();
        return () => controller.abort();
    }, [apiUrl, brandCode, total]);

    const title = useMemo(() => {
        const name = brandName || brandCode || "";
        return t("title", { brand: name });
    }, [t, brandName, brandCode]);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAutoplayEnabled(true);

                    // Por si ya hay instancia montada, arranca al entrar
                    const swiper = swiperRef.current;
                    if (swiper?.autoplay) swiper.autoplay.start();
                } else {
                    // Si quieres que se pare cuando salga del viewport (recomendado)
                    const swiper = swiperRef.current;
                    if (swiper?.autoplay) swiper.autoplay.stop();
                }
            },
            {
                threshold: 0.35,
            }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;
        if (!prevRef.current || !nextRef.current) return;

        // Reengancha los botones reales
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;

        // Reinicializa la navegación
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
    }, [items]);

    // ✅ Click que asegura imagen ALTA antes de abrir modal
    const handleProductClick = async (p) => {
        try {
            const codprodu = p?.codprodu;
            if (!codprodu) {
                onProductClick?.(p);
                return;
            }

            // Si ya trae alta, perfecto
            if (p.imageAlta || p.imagealta) {
                onProductClick?.({ ...p, imageAlta: p.imageAlta || p.imagealta });
                return;
            }

            // Cache
            const cached = highImageCacheRef.current.get(codprodu);
            if (cached) {
                onProductClick?.({ ...p, imageAlta: cached });
                return;
            }

            // Fetch alta (endpoint de imágenes)
            const controller = new AbortController();
            const high = await fetchProductImage({
                apiUrl,
                codprodu,
                quality: "PRODUCTO_ALTA",
                signal: controller.signal,
            });

            const finalHigh = high || null;
            if (finalHigh) highImageCacheRef.current.set(codprodu, finalHigh);

            // Le pasamos alta si existe; si no, al menos va con baja
            onProductClick?.({
                ...p,
                imageAlta: finalHigh || p.imageBaja || p.imagebaja || defaultImageUrl,
            });
        } catch (e) {
            // En caso de error, abre con lo que haya
            onProductClick?.(p);
        }
    };

    return (
        <section ref={sectionRef} className={`w-full ${className}`}>
            <div className="mx-auto max-w-7xl px-4">
                <h2 className="text-lg md:text-xl font-bold tracking-wide">{title}</h2>

                <div className="mt-4">
                    {loading ? (
                        <div className="py-8 text-sm opacity-70">{t("loading")}</div>
                    ) : items.length === 0 ? (
                        <div className="py-8 text-sm opacity-70">—</div>
                    ) : (
                        <>
                            <Swiper
                                modules={[Navigation, Autoplay]}
                                spaceBetween={14}
                                slidesPerView={1.2}
                                speed={900}
                                grabCursor
                                autoplay={
                                    autoplayEnabled
                                        ? {
                                            delay: 2000,
                                            disableOnInteraction: false,
                                            pauseOnMouseEnter: true,
                                        }
                                        : false
                                }
                                navigation={{
                                    prevEl: prevRef.current,
                                    nextEl: nextRef.current,
                                }}
                                onSwiper={(swiper) => {
                                    swiperRef.current = swiper;
                                }}
                                breakpoints={{
                                    360: { slidesPerView: 1.2, spaceBetween: 14 },
                                    420: { slidesPerView: 1.35, spaceBetween: 14 },
                                    520: { slidesPerView: 1.6, spaceBetween: 14 },
                                    640: { slidesPerView: 2.1, spaceBetween: 16 },
                                    768: { slidesPerView: 2.6, spaceBetween: 16 },
                                    1024: { slidesPerView: 4, spaceBetween: 16 },
                                }}
                                className=""
                            >
                                {items.map((p, idx) => {
                                    const imgSrc = getProductImage(p);
                                    const label = getProductTitle(p);

                                    return (
                                        <SwiperSlide key={p?.codprodu || p?.id || p?._id || `${label}-${idx}`}>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    const enriched = await ensureGoodImage({ apiUrl, product: p });
                                                    onProductClick?.(enriched);
                                                }}
                                                className="group w-full text-left"
                                            >
                                                <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
                                                    <div className="aspect-[4/3] w-full bg-black/5">
                                                        <img
                                                            src={imgSrc}
                                                            alt={label}
                                                            loading="lazy"
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                            onError={(e) => {
                                                                e.currentTarget.src = defaultImageUrl;
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="p-3">
                                                        <div className="text-sm font-semibold leading-snug line-clamp-2">
                                                            {label}
                                                        </div>

                                                        {(p?.coleccion || p?.collection) && (
                                                            <div className="mt-1 text-xs opacity-70 line-clamp-1">
                                                                {p?.coleccion || p?.collection}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>

                            <div className="mt-4 flex items-center justify-center gap-3">
                                <button
                                    ref={prevRef}
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:bg-black/5 active:scale-[0.98] transition"
                                    aria-label={t("prev")}
                                >
                                    ‹
                                </button>

                                <button
                                    ref={nextRef}
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:bg-black/5 active:scale-[0.98] transition"
                                    aria-label={t("next")}
                                >
                                    ›
                                </button>
                            </div>

                            <div className="mt-6 flex flex-col items-center justify-center gap-3 text-center">
                                <p className="max-w-2xl text-sm md:text-base opacity-80">
                                    {t("ctaText", { brand: brandName || brandCode })}
                                </p>

                                <button
                                    type="button"
                                    onClick={handleExploreAll}
                                    className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-6 py-2.5 text-sm font-semibold hover:bg-black/5 active:scale-[0.98] transition"
                                >
                                    {t("ctaButton")}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}