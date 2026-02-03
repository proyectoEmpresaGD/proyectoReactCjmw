import React, { useEffect, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Keyboard, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function normalizeString(value) {
    return String(value ?? "").trim();
}

function uniqueBy(list, getKey) {
    const seen = new Set();
    const out = [];
    for (const item of list) {
        const key = getKey(item);
        if (!key) continue;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(item);
    }
    return out;
}

function buildAbsoluteImageUrl(raw) {
    const src = typeof raw === "string" ? raw.trim() : "";
    if (!src) return "/img/default.webp";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;

    const base = import.meta.env.VITE_API_BASE_URL?.trim();
    const origin = base || window.location.origin;
    const prefix = src.startsWith("/") ? "" : "/";
    return `${origin}${prefix}${src}`;
}

async function fetchByCollection({ coleccion, signal }) {
    const base = import.meta.env.VITE_API_BASE_URL?.trim();
    const url = new URL("/api/products/byProductCollection", base || window.location.origin);
    url.searchParams.set("coleccion", normalizeString(coleccion));

    const resp = await fetch(url.toString(), { method: "GET", signal });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

    const data = await resp.json();
    const list = Array.isArray(data) ? data : Array.isArray(data?.products) ? data.products : [];
    return list;
}

/**
 * Props:
 * - coleccion: string (legacy)
 * - colecciones: string[] (nuevo) -> mezcla varias
 * - onProductClick: fn
 * - limit: number opcional (recorta para home)
 */
function CarruselProductosColeccionEspecifica({
    coleccion,
    colecciones,
    onProductClick,
    limit,
}) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);

    const coleccionesNormalizadas = useMemo(() => {
        const fromArray = Array.isArray(colecciones) ? colecciones : [];
        const fromSingle = coleccion ? [coleccion] : [];
        const all = [...fromArray, ...fromSingle]
            .map(normalizeString)
            .filter(Boolean);

        // únicas, manteniendo orden
        return [...new Set(all)];
    }, [coleccion, colecciones]);

    useEffect(() => {
        if (!coleccionesNormalizadas.length) {
            setProductos([]);
            return;
        }

        const controller = new AbortController();
        let mounted = true;

        (async () => {
            setLoading(true);
            try {
                // Hacemos fetch de todas las colecciones en paralelo
                const results = await Promise.all(
                    coleccionesNormalizadas.map((c) => fetchByCollection({ coleccion: c, signal: controller.signal }))
                );

                const merged = results.flat();

                // Filtramos “bien”
                const filtrados = merged.filter((p) => p?.nombre?.trim());

                // Evitar duplicados: codprodu si existe, si no id, si no nombre+coleccion
                const unique = uniqueBy(filtrados, (p) => {
                    const key =
                        p?.codprodu ??
                        p?.id ??
                        `${normalizeString(p?.nombre)}::${normalizeString(p?.coleccion || p?.collection)}`;
                    return String(key);
                });

                const sliced = typeof limit === "number" ? unique.slice(0, Math.max(0, limit)) : unique;

                if (mounted) setProductos(sliced);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Error al obtener productos:", err);
                    if (mounted) setProductos([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
            controller.abort();
        };
    }, [coleccionesNormalizadas, limit]);

    const usarCarrusel = productos.length > 4;

    const swiperSettings = useMemo(
        () => ({
            modules: [Navigation, Pagination, A11y, Keyboard, Autoplay],
            navigation: true,
            pagination: { clickable: true },
            keyboard: { enabled: true },
            a11y: { enabled: true },
            spaceBetween: 16,
            autoHeight: true,
            loop: true,
            autoplay: {
                delay: 3000,
                pauseOnMouseEnter: true,
                disableOnInteraction: false,
            },
            grabCursor: true,
            watchOverflow: true,
            slidesPerView: Math.min(4, Math.max(1, productos.length)),
            breakpoints: {
                320: { slidesPerView: Math.min(1.2, productos.length), spaceBetween: 12 },
                640: { slidesPerView: Math.min(2, productos.length), spaceBetween: 12 },
                1024: { slidesPerView: Math.min(3, productos.length), spaceBetween: 16 },
                1280: { slidesPerView: Math.min(4, productos.length), spaceBetween: 16 },
            },
        }),
        [productos.length]
    );

    const Tarjeta = ({ p }) => {
        const imgSrc = buildAbsoluteImageUrl(p.imageBaja || p.imagebaja || p.imageAlta || p.imagealta);

        return (
            <div className="flex flex-col p-2 rounded-lg shadow hover:shadow-xl transition">
                <div
                    className="relative w-full h-48 overflow-hidden cursor-pointer rounded"
                    onClick={() => onProductClick && onProductClick(p)}
                >
                    <img
                        src={imgSrc}
                        alt={p.nombre}
                        className="object-cover w-full h-full"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = "/img/default.webp";
                        }}
                    />
                </div>
                <div className="flex-1 mt-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">{p.nombre}</h3>
                    <p className="mt-1 text-sm text-gray-500">{p.tonalidad}</p>
                </div>
            </div>
        );
    };

    if (loading && !productos.length) {
        return <div className="mt-6 px-[2%] text-white/70">Cargando…</div>;
    }

    if (!productos.length) return null;

    if (!usarCarrusel) {
        return (
            <div className="lg:px-[0%] px-[2%] grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {productos.map((p, i) => (
                    <div key={`${p.codprodu || p.id || "prod"}-${i}`}>
                        <Tarjeta p={p} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="mt-6 lg:px-[0%] px-[2%]">
            <Swiper
                {...swiperSettings}
                style={{
                    "--swiper-navigation-color": "#000",
                    "--swiper-pagination-color": "#000",
                }}
            >
                {productos.map((p, i) => (
                    <SwiperSlide key={`${p.codprodu || p.id || "prod"}-${i}`}>
                        <Tarjeta p={p} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default CarruselProductosColeccionEspecifica;
