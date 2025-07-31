import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function PresentacionColeccion({ nombreColeccion, titulo, imagenFondo, descripcion }) {
    const navigate = useNavigate();
    const textRef = useRef([]);
    const tituloRef = useRef(null);
    const botonRef = useRef(null);
    const imagenRef = useRef(null);

    const [visibleLines, setVisibleLines] = useState([]);
    const [tituloVisible, setTituloVisible] = useState(false);
    const [botonVisible, setBotonVisible] = useState(false);
    const [imagenVisible, setImagenVisible] = useState(false);

    const handleClick = () => {
        const target = document.getElementById("colecciones");
        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = entry.target.dataset.index;
                    if (entry.isIntersecting) {
                        if (index !== undefined) {
                            setVisibleLines((prev) => [...new Set([...prev, Number(index)])]);
                        } else if (entry.target === tituloRef.current) {
                            setTituloVisible(true);
                        } else if (entry.target === botonRef.current) {
                            setBotonVisible(true);
                        } else if (entry.target === imagenRef.current) {
                            setImagenVisible(true);
                        }
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -200px 0px",
            }
        );

        textRef.current.forEach((el) => el && observer.observe(el));
        if (tituloRef.current) observer.observe(tituloRef.current);
        if (botonRef.current) observer.observe(botonRef.current);
        if (imagenRef.current) observer.observe(imagenRef.current);

        return () => observer.disconnect();
    }, []);

    const descripcionPorLineas = descripcion.split(".").filter(Boolean);

    return (
        <section className="w-full max-w-7xl mx-auto my-12 px-4">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
                {/* Imagen animada */}
                <div
                    ref={imagenRef}
                    className={`w-full lg:w-1/2 h-[400px] md:h-[500px] transition-all duration-700 ease-out
                        ${imagenVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}
                    `}
                >
                    <img
                        src={imagenFondo}
                        alt="Imagen presentación"
                        className="w-full h-full object-cover shadow-xl"
                    />
                </div>

                {/* Texto con animación */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <h3
                        ref={tituloRef}
                        className={`text-xl md:text-[35px] font-semibold transition-all duration-700 ease-out
                            ${tituloVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}
                        `}
                    >
                        {titulo}
                    </h3>

                    <div className="space-y-2">
                        {descripcionPorLineas.map((linea, index) => (
                            <p
                                key={index}
                                data-index={index}
                                ref={(el) => (textRef.current[index] = el)}
                                className={`text-[25px] transition-all duration-1000 ease-out
                                    ${visibleLines.includes(index)
                                        ? "opacity-100 translate-x-0 text-black"
                                        : "opacity-0 -translate-x-5 text-transparent"}
                                `}
                            >
                                {linea.trim()}.
                            </p>
                        ))}
                    </div>

                    <button
                        ref={botonRef}
                        onClick={handleClick}
                        className={`border border-black text-black px-4 py-2 rounded transition-all duration-700 ease-out
                            hover:bg-black hover:text-white
                            ${botonVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}
                        `}
                    >
                        Descubre todas las colecciones
                    </button>
                </div>
            </div>
        </section>
    );
}

export default PresentacionColeccion;
