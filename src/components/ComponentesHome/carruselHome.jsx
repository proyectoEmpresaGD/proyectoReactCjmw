import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CarruselHome = ({ images, texts, names, routes }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isTap, setIsTap] = useState(true);
    const containerRef = useRef(null);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const touchStartX = useRef(0); // Añadido para controlar el movimiento horizontal
    const touchEndX = useRef(0);   // Añadido para controlar el movimiento horizontal
    const navigate = useNavigate();

    // Función para manejar el desplazamiento por scroll en desktop
    useEffect(() => {
        const handleScroll = (event) => {
            if (isScrolling) return;

            const { deltaY } = event;
            const direction = deltaY > 0 ? 1 : -1;

            setIsScrolling(true);

            setCurrentSlide((prevSlide) => {
                if (direction === 1 && prevSlide < images.length - 1) {
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

    // Función para manejar el desplazamiento táctil en móviles
    useEffect(() => {
        const handleTouchStart = (e) => {
            touchStartY.current = e.touches[0].clientY;
            touchStartX.current = e.touches[0].clientX; // Capturamos también la posición X
            setIsTap(true);
        };

        const handleTouchMove = (e) => {
            touchEndY.current = e.touches[0].clientY;
            touchEndX.current = e.touches[0].clientX; // Capturamos también la posición X
            const distanceY = touchStartY.current - touchEndY.current;
            const distanceX = touchStartX.current - touchEndX.current; // Distancia en X

            // Si detectamos un swipe considerable, no es un tap
            if (Math.abs(distanceY) > 10 || Math.abs(distanceX) > 10) {
                setIsTap(false);
            }
        };

        const handleTouchEnd = () => {
            const distanceY = touchStartY.current - touchEndY.current;
            const threshold = 50;

            if (distanceY > threshold) {
                setCurrentSlide((prevSlide) => (prevSlide < images.length - 1 ? prevSlide + 1 : prevSlide));
            } else if (distanceY < -threshold) {
                setCurrentSlide((prevSlide) => (prevSlide > 0 ? prevSlide - 1 : prevSlide));
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('touchstart', handleTouchStart);
            container.addEventListener('touchmove', handleTouchMove);
            container.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (container) {
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchmove', handleTouchMove);
                container.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [images.length]);

    // Función para manejar el clic en las imágenes de `texts`
    const handleClick = (index) => {
        if (routes && routes[index] && isTap) {
            navigate(routes[index]);
        }
    };

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
                        <div className="relative  bottom-[65%] mx-auto text-center xl:w-[25%] lg:w-[25%] w-[70%] p-4">
                            <img
                                src={texts[index]}
                                alt=""
                                onClick={() => handleClick(index)} // Manejador de clic para navegar
                                className="cursor-pointer" // Añadir cursor de puntero para indicar que es clickeable
                                style={names[index] === "CJM" ? { width: '250px', height: 'auto', margin: "auto" } : { width: '550px', height: 'auto' }}
                            />
                        </div>
                    </div>
                ))}

                {/* Último slide que muestra el Footer
                <div className="h-screen w-full relative">
                    <FooterHome /> 
                </div> */}
            </div>

            {/* Nombre del slide actual en formato móvil */}
            <div className="absolute right-2 top-1/4 transform -translate-y-1/2 items-center space-y-2 md:hidden">
                {/* Indicadores en forma de círculos (en móviles) */}
                <div className="absolute right-2 flex flex-col items-center space-y-2">
                    <span
                        className="text-white font-bold mb-16 block transition-opacity duration-300 ease-in-out rotate-90"
                        style={{ width: '1em', display: 'inline-block' }}
                    >
                        {names[currentSlide]}
                    </span>

                    {[...images].map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Nombres en la parte inferior (solo en pantallas grandes) */}
            {names && names.length > 0 && (
                <div className="absolute bottom-5 left-0 right-0 justify-between px-[20%] space-x-8 items-center hidden md:flex">
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