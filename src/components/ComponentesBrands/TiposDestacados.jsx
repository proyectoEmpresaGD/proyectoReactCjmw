import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BloquesInformativos({ titulo, texto, bloques = [] }) {
    const navigate = useNavigate();

    const tituloRef = useRef(null);
    const textoRef = useRef(null);
    const bloquesRef = useRef([]);
    const [tituloVisible, setTituloVisible] = useState(false);
    const [textoVisible, setTextoVisible] = useState(false);
    const [bloquesVisibles, setBloquesVisibles] = useState([]);

    const handleClick = (filtros) => {
        const queryString = new URLSearchParams(filtros).toString();
        navigate(`/products?${queryString}`);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.target === tituloRef.current && entry.isIntersecting) {
                        setTituloVisible(true);
                    } else if (entry.target === textoRef.current && entry.isIntersecting) {
                        setTextoVisible(true);
                    } else {
                        const index = entry.target.dataset.index;
                        if (entry.isIntersecting && index !== undefined) {
                            setBloquesVisibles((prev) => [...new Set([...prev, Number(index)])]);
                        }
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -150px 0px" }
        );

        if (tituloRef.current) observer.observe(tituloRef.current);
        if (textoRef.current) observer.observe(textoRef.current);
        bloquesRef.current.forEach((el) => el && observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // Tailwind permite solo estas clases predeterminadas
    const delayClasses = ["delay-0", "delay-100", "delay-200", "delay-300"];

    return (
        <section className="flex flex-col items-center text-center px-4 py-10">
            {/* Título */}
            <h2
                ref={tituloRef}
                className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 transition-all duration-700
                    ${tituloVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                `}
            >
                {titulo}
            </h2>

            {/* Texto */}
            <p
                ref={textoRef}
                className={`text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mb-8 transition-all duration-700 delay-200
                    ${textoVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                `}
            >
                {texto}
            </p>

            {/* Bloques con delays progresivos */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
                {bloques.map((bloque, idx) => {
                    const delayClass = delayClasses[idx % delayClasses.length];

                    return (
                        <div
                            key={idx}
                            data-index={idx}
                            ref={(el) => (bloquesRef.current[idx] = el)}
                            onClick={() => handleClick(bloque.filtros || {})}
                            className={`group relative h-64 sm:h-72 overflow-hidden rounded-md shadow-md hover:cursor-pointer
                                transition-all duration-700 ease-out
                                ${bloquesVisibles.includes(idx)
                                    ? `opacity-100 translate-y-0 ${delayClass}`
                                    : "opacity-0 translate-y-6"}
                            `}
                        >
                            <div
                                className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${bloque.imagen})` }}
                            />
                            <div className="absolute bottom-0 w-full bg-opacity-50 text-white text-center py-3 z-10">
                                <h3 className="text-sm sm:text-base font-medium">{bloque.nombre}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default BloquesInformativos;
