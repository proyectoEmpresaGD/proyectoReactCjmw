import { useEffect, useRef, useState, useLayoutEffect } from "react";

function PresentacionColeccion({ nombreColeccion, titulo, imagenFondo, descripcion, onDiscoverCollections, }) {
    const textRef = useRef([]);
    const tituloRef = useRef(null);
    const botonRef = useRef(null);
    const imagenRef = useRef(null);

    const [visibleLines, setVisibleLines] = useState([]);
    const [tituloVisible, setTituloVisible] = useState(false);
    const [botonVisible, setBotonVisible] = useState(false);
    const [imagenVisible, setImagenVisible] = useState(false);

    const handleClick = () => {
        if (onDiscoverCollections) {
            onDiscoverCollections();
            return;
        }
        const target = document.getElementById("colecciones");
        if (target) target.scrollIntoView({ behavior: "smooth" });
    };

    const isInViewport = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0;
    };

    // Normaliza descripción: sin vacíos y con punto final
    const descripcionPorLineas = descripcion
        .split(".")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => `${l}.`);

    // 1) Revelado inmediato tras primer render (evita quedarnos “transparentes” al recargar)
    useLayoutEffect(() => {
        // Espera a que refs se asignen y layout esté listo
        const raf = requestAnimationFrame(() => {
            // Título/botón/imagen si ya están a la vista
            if (isInViewport(tituloRef.current)) setTituloVisible(true);
            if (isInViewport(botonRef.current)) setBotonVisible(true);
            if (isInViewport(imagenRef.current)) setImagenVisible(true);

            // Líneas de texto ya visibles
            const initial = [];
            textRef.current.forEach((el, idx) => {
                if (isInViewport(el)) initial.push(idx);
            });
            if (initial.length) setVisibleLines((prev) => [...new Set([...prev, ...initial])]);
        });

        // 2) Timeout de seguridad: si algo se quedó sin mostrar, forzamos revelado
        const safety = setTimeout(() => {
            setTituloVisible((v) => (v ? v : true));
            setBotonVisible((v) => (v ? v : true));
            setImagenVisible((v) => (v ? v : true));
            setVisibleLines((prev) => {
                if (prev.length >= descripcionPorLineas.length) return prev;
                return Array.from({ length: descripcionPorLineas.length }, (_, i) => i);
            });
        }, 700);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(safety);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [descripcionPorLineas.length]);

    // 3) Observer robusto (rootMargin neutral y threshold 0) + “once”
    useEffect(() => {
        if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
            // Fallback: revelar todo si no hay IO
            setTituloVisible(true);
            setBotonVisible(true);
            setImagenVisible(true);
            setVisibleLines(Array.from({ length: descripcionPorLineas.length }, (_, i) => i));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const el = entry.target;
                    const idx = el.dataset?.index;

                    if (entry.isIntersecting) {
                        if (idx !== undefined) {
                            setVisibleLines((prev) => {
                                const next = new Set(prev);
                                next.add(Number(idx));
                                return [...next];
                            });
                            observer.unobserve(el);
                        } else if (el === tituloRef.current) {
                            setTituloVisible(true);
                            observer.unobserve(el);
                        } else if (el === botonRef.current) {
                            setBotonVisible(true);
                            observer.unobserve(el);
                        } else if (el === imagenRef.current) {
                            setImagenVisible(true);
                            observer.unobserve(el);
                        }
                    }
                });
            },
            {
                threshold: 0,          // detecta en cuanto toca el viewport
                root: null,
                rootMargin: "0px",     // sin márgenes negativos que retrasen el disparo
            }
        );

        textRef.current.forEach((el) => el && observer.observe(el));
        if (tituloRef.current) observer.observe(tituloRef.current);
        if (botonRef.current) observer.observe(botonRef.current);
        if (imagenRef.current) observer.observe(imagenRef.current);

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [descripcionPorLineas.length]);

    return (
        <section className="w-full max-w-7xl mx-auto my-12 px-4">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
                {/* Imagen animada */}
                <div
                    ref={imagenRef}
                    className={`w-full lg:w-1/2 h-[400px] md:h-[500px] transition-all duration-700 ease-out
            ${imagenVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}
                >
                    <img
                        src={imagenFondo}
                        alt="Imagen presentación"
                        className="w-full h-full object-cover shadow-xl"
                    />
                </div>

                {/* Texto + botón (sin altura fija) */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    <h3
                        ref={tituloRef}
                        className={`text-xl md:text-[26px] leading-9 font-semibold transition-all text-black duration-700 ease-out
              ${tituloVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}
                    >
                        {titulo}
                    </h3>

                    <div className="flex flex-col gap-2 leading-relaxed break-words">
                        {descripcionPorLineas.map((linea, index) => (
                            <p
                                key={index}
                                data-index={index}
                                ref={(el) => (textRef.current[index] = el)}
                                className={`text-[15px] transition-all duration-1000 ease-out
                  ${visibleLines.includes(index)
                                        ? "opacity-100 translate-x-0 text-black"
                                        : "opacity-0 -translate-x-5 text-transparent"}`}
                            >
                                {linea}
                            </p>
                        ))}
                    </div>

                    <button
                        ref={botonRef}
                        onClick={handleClick}
                        className={`border border-black text-black px-4 py-2 rounded transition-all duration-700 ease-out
              hover:bg-black hover:text-white self-start
              ${botonVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}`}
                    >
                        Descubre todas las colecciones
                    </button>
                </div>
            </div>
        </section>
    );
}

export default PresentacionColeccion;
