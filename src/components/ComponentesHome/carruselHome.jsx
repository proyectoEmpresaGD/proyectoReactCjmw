import React, { useState, useRef, useEffect } from 'react';

const CarruselHome = ({ images, texts }) => {
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

    return (
        <div className="relative h-screen overflow-hidden w-full" ref={containerRef}>
            {/* Indicadores en forma de bolitas */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                            }`}
                    ></div>
                ))}
            </div>

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
            </div>
        </div>
    );
};

export default CarruselHome;