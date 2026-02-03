import React, { useEffect, useMemo, useState } from "react";
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

function pickFirstNValid(list, n) {
    const out = [];
    for (const p of list) {
        if (!p?.nombre?.trim()) continue;
        out.push(p);
        if (out.length >= n) break;
    }
    return out;
}

function interleaveGroups(groups, totalLimit) {
    // Reparte 1 a 1 entre grupos para que salgan mezcladas las colecciones
    const result = [];
    let guard = 0;

    while (result.length < totalLimit) {
        let moved = false;

        for (const g of groups) {
            if (!g.length) continue;
            result.push(g.shift());
            moved = true;
            if (result.length >= totalLimit) break;
        }

        if (!moved) break;
        guard += 1;
        if (guard > 10000) break;
    }

    return result;
}



/**
 * Props:
 * - coleccion: string (legacy)
 * - colecciones: string[] (nuevo)
 * - onProductClick: fn(product)
 * - limit: number -> total a mostrar (HOME)
 * - perCollectionLimit: number -> cuantos coges por colección (para no traerlos todos)
 */
function CarruselProductosColeccionEspecifica({
    coleccion,
    colecciones,
    onProductClick,
    limit = 12,
    perCollectionLimit = 4,
}) {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(false);

    const coleccionesNormalizadas = useMemo(() => {
        const fromArray = Array.isArray(colecciones) ? colecciones : [];
        const fromSingle = coleccion ? [coleccion] : [];
        const all = [...fromArray, ...fromSingle].map(normalizeString).filter(Boolean);
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
                // 1) Fetch paralelo de colecciones
                const results = await Promise.all(
                    coleccionesNormalizadas.map(async (c) => {
                        const list = await fetchByCollection({ coleccion: c, signal: controller.signal });

                        // 2) Por colección solo cogemos X (para no traerte todo)
                        const picked = pickFirstNValid(list, Math.max(1, perCollectionLimit));

                        // 3) Normalizamos imágenes aquí (por si vienen como /uploads/..)
                        const normalized = picked.map((p) => {
                            const imgRaw = p.imageBaja || p.imagebaja || p.imageAlta || p.imagealta || p.image;
                            const imgSrc = buildAbsoluteImageUrl(imgRaw);
                            return { ...p, imageBaja: imgSrc, _homeCollection: c };
                        });

                        return normalized;
                    })
                );

                // 4) Evitar duplicados por codprodu/id/nombre+coleccion
                const merged = results.flat();
                const unique = uniqueBy(merged, (p) => {
                    const key =
                        p?.codprodu ??
                        p?.id ??
                        `${normalizeString(p?.nombre)}::${normalizeString(p?.coleccion || p?.collection || p?._homeCollection)}`;
                    return String(key);
                });

                // 5) Para que queden mezcladas (no “bloques” por colección)
                const byCollection = coleccionesNormalizadas.map((c) =>
                    unique.filter((p) => normalizeString(p?._homeCollection) === normalizeString(c))
                );

                const mixed = interleaveGroups(byCollection.map((g) => [...g]), Math.max(1, limit));

                if (mounted) setProductos(mixed);
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
    }, [coleccionesNormalizadas, limit, perCollectionLimit]);

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
            loop: productos.length > 6,
            autoplay:
                productos.length > 6
                    ? {
                        delay: 2800,
                        pauseOnMouseEnter: true,
                        disableOnInteraction: false,
                    }
                    : false,
            grabCursor: true,
            watchOverflow: true,
            slidesPerView: Math.min(4, Math.max(1, productos.length)),
            breakpoints: {
                320: { slidesPerView: Math.min(1.05, productos.length), spaceBetween: 12 },
                640: { slidesPerView: Math.min(1.8, productos.length), spaceBetween: 14 },
                1024: { slidesPerView: Math.min(2.4, productos.length), spaceBetween: 16 },
                1280: { slidesPerView: Math.min(3, productos.length), spaceBetween: 16 },
            },
        }),
        [productos.length]
    );

    const Tarjeta = ({ p }) => {
        const imgSrc = p.imageBaja || "/img/default.webp";
        const collectionLabel = normalizeString(
            p?.coleccion || p?.collection || p?._homeCollection || "COLECCIÓN"
        );

        return (
            <button
                type="button"
                onClick={() => onProductClick && onProductClick(p)}
                className="group w-full text-left"
            >
                <div className="flex gap-5 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/8">
                    {/* Imagen CUADRADA */}
                    <div className="relative aspect-square w-36 shrink-0 overflow-hidden rounded-xl sm:w-40">
                        <img
                            src={imgSrc}
                            alt={p.nombre}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = "/img/default.webp";
                            }}
                        />
                        {/* brillo/acento sutil */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
                    </div>

                    {/* Texto */}
                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <p className="text-[10px] tracking-[0.32em] text-white/60">
                            {collectionLabel}
                        </p>

                        <p className="mt-2 line-clamp-2 text-base font-semibold tracking-tight text-white">
                            {p.nombre}
                        </p>

                        {p.tonalidad ? (
                            <p className="mt-2 text-sm text-white/70">{p.tonalidad}</p>
                        ) : null}
                    </div>
                </div>
            </button>
        );
    };

    if (loading && !productos.length) {
        return <div className="mt-6 px-[2%] text-white/70">Cargando…</div>;
    }

    if (!productos.length) return null;

    // <=4: grid editorial (oscuro)
    if (!usarCarrusel) {
        return (
            <div className="lg:px-[0%] px-[2%] grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {productos.map((p, i) => (
                    <div key={`${p.codprodu || p.id || "prod"}-${i}`}>
                        <Tarjeta p={p} />
                    </div>
                ))}
            </div>
        );
    }

    // >4: carrusel Swiper (colores blancos)
    return (
        <div className="relative mt-6 lg:px-[0%] px-[2%]">
            {/* Flechas externas */}
            <div className="pointer-events-none absolute inset-y-0 -left-12 -right-12 flex items-center justify-between">
                <div className="swiper-button-prev !static pointer-events-auto" />
                <div className="swiper-button-next !static pointer-events-auto" />
            </div>

            {/* Swiper */}
            <Swiper
                {...swiperSettings}
                navigation={{
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next",
                }}
                pagination={{
                    el: ".swiper-pagination",
                    clickable: true,
                }}
                style={{
                    "--swiper-navigation-color": "rgba(255,255,255,0.85)",
                    "--swiper-pagination-color": "rgba(255,255,255,0.75)",
                }}
            >
                {productos.map((p, i) => (
                    <SwiperSlide key={`${p.codprodu || p.id || "prod"}-${i}`}>
                        <Tarjeta p={p} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Paginación FUERA */}
            <div className="swiper-pagination mt-6 flex justify-center" />
        </div>
    );

}

export default CarruselProductosColeccionEspecifica;
