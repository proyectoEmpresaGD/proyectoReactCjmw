import React, { useEffect, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Keyboard, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function CarruselProductosColeccionEspecifica({ coleccion, onProductClick }) {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        if (!coleccion) { setProductos([]); return; }

        const controller = new AbortController();
        let mounted = true;

        (async () => {
            try {
                const base = import.meta.env.VITE_API_BASE_URL?.trim();
                const url = new URL("/api/products/byProductCollection", base || window.location.origin);
                url.searchParams.set("coleccion", String(coleccion).trim());

                const resp = await fetch(url.toString(), { method: "GET", signal: controller.signal });
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const data = await resp.json();
                const list = Array.isArray(data) ? data : (data.products || []);
                const filtrados = list.filter(p => p?.nombre?.trim());
                if (mounted) setProductos(filtrados);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Error al obtener productos:", err);
                    if (mounted) setProductos([]);
                }
            }
        })();

        return () => { mounted = false; controller.abort(); };
    }, [coleccion]);

    const usarCarrusel = productos.length > 4;

    const swiperSettings = useMemo(() => ({
        modules: [Navigation, Pagination, A11y, Keyboard, Autoplay],
        navigation: true,
        pagination: { clickable: true },
        keyboard: { enabled: true },
        a11y: { enabled: true },
        spaceBetween: 16,
        autoHeight: true,
        loop: true,                         // 👈 infinito
        autoplay: {
            delay: 3000,                      // 👈 cambia la velocidad si quieres
            pauseOnMouseEnter: true,          // pausa al hover y luego continúa
            disableOnInteraction: false,      // si el usuario toca, sigue después
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
    }), [productos.length]);

    const Tarjeta = ({ p }) => (
        <div className="flex flex-col p-2 rounded-lg shadow hover:shadow-xl transition">
            <div
                className="relative w-full h-48 overflow-hidden cursor-pointer rounded"
                onClick={() => onProductClick && onProductClick(p)}
            >
                <img
                    src={p.imageBaja || p.imagebaja || "/img/default.webp"}
                    alt={p.nombre}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = "/img/default.webp"; }}
                />
            </div>
            <div className="flex-1 mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">{p.nombre}</h3>
                <p className="mt-1 text-sm text-gray-500">{p.tonalidad}</p>
            </div>
        </div>
    );

    if (!productos.length) return null;

    // ≤ 4 → grid igual que antes
    if (!usarCarrusel) {
        return (
            <div className=" lg:px-[0%] px-[2%] grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {productos.map((p, i) => (
                    <div key={`${p.codprodu || p.id || "prod"}-${i}`}>
                        <Tarjeta p={p} />
                    </div>
                ))}
            </div>
        );
    }

    // > 4 → carrusel Swiper (flechas/dots negros)
    return (
        <div className="mt-6 lg:px-[0%] px-[2%]">
            <Swiper
                {...swiperSettings}
                // 👇 Colores en negro para flechas e indicadores
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
