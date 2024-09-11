import { useState, useRef, useEffect } from 'react';
import Footer from '../footer'; // Suponiendo que tienes este componente importado
import FooterHome from '../ComponentesUsages/footerHome';

const CarruselHome = ({ images, texts, names }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = (event) => {
            if (isScrolling) return; // Evita múltiples eventos de scroll

            const { deltaY } = event;
            const direction = deltaY > 0 ? 1 : -1; // Determina la dirección del scroll

            setIsScrolling(true);

            setCurrentSlide((prevSlide) => {
                if (direction === 1 && prevSlide < images.length) {
                    return prevSlide + 1;
                } else if (direction === -1 && prevSlide > 0) {
                    return prevSlide - 1;
                }
                return prevSlide;
            });

            setTimeout(() => {
                setIsScrolling(false);
            }, 500);
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleScroll);
            }
        };
    }, [images.length, isScrolling]);

    return (
        <div className="relative h-screen overflow-hidden w-full" ref={containerRef}>
            {/* Contenedor del carrusel */}
            <div
                className="flex flex-col transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
            >
                {images.map((image, index) => (
                    <div key={index} className="h-screen w-full relative">
                        <img src={image} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                        <div className="relative xl:bottom-[60%] lg:bottom-[60%] bottom-[50%] mx-auto text-center xl:w-[25%] lg:w-[25%] w-[70%] p-4">
                            <img src={texts[index]} alt="" />
                        </div>
                    </div>
                ))}

                {/* Último slide que muestra el Footer */}
                <div className="h-screen w-full relative">
                    <FooterHome /> {/* Aquí renderizas tu componente Footer */}
                </div>
            </div>

            {/* Nombre del slide actual en formato móvil (totalmente vertical y estático) */}
            <div className="absolute right-2 top-2/4 transform -translate-y-1/2 flex flex-col items-center space-y-2 md:hidden">
                {/* Nombre dinámico del slide actual completamente vertical con espacio extra para no pisar los indicadores */}
                <span className="text-white font-bold mb-8 transform rotate-90  ">
                    {names[currentSlide]}
                </span>

                {/* Indicadores en forma de círculos (en móviles) */}
                <div className="flex flex-col items-center space-y-2">
                    {[...images, 'footer'].map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Nombres en la parte inferior, alineados horizontalmente (solo en pantallas grandes) */}
            {names && names.length > 0 && (
                <div className="absolute bottom-5 left-0 right-0 flex justify-between px-[20%] space-x-8 items-center hidden md:flex">
                    {names.map((name, index) => (
                        <span
                            key={index}
                            className={`cursor-pointer transition-colors duration-300 xl:text-2xl lg:text-2xl text-base ${index === currentSlide ? 'text-black font-bold' : 'text-white/50'}`}
                            onClick={() => setCurrentSlide(index)}
                        >
                            {name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarruselHome;
