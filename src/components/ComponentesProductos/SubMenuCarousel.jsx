import { useState, useRef, useEffect } from 'react';

const SubMenuCarousel = ({ onFilterClick, type, activeCategory }) => {
    // Definición de las categorías del submenú con ajuste dinámico según tipo
    const categories = [
        "TELAS CON FLORES",
        "LISO",
        "RAYAS",
        "VISILLO",
        "GEOMETRICO",
        "TERCIOPELO",
        "FR",
        "OUTDOOR",
        ...(type !== 'tela' ? ["WALLPAPER", "WALLCOVERING"] : []),
    ];

    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const carouselRef = useRef(null);

    // Maneja la visibilidad de las flechas de navegación
    const updateArrowVisibility = () => {
        const container = carouselRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1); // Ajuste fino para manejar el borde
    };

    // Controla la visibilidad de flechas y escucha cambios en el tamaño de la pantalla
    useEffect(() => {
        updateArrowVisibility();
        window.addEventListener('resize', updateArrowVisibility);
        return () => window.removeEventListener('resize', updateArrowVisibility);
    }, [categories.length]);

    // Función para manejar el clic en una categoría
    const handleFilterClick = (category) => {
        onFilterClick(category);
    };

    // Avanza el carrusel suavemente
    const handleNext = () => {
        const container = carouselRef.current;
        const itemWidth = container?.children[0]?.offsetWidth || 0;
        container.scrollBy({ left: itemWidth, behavior: 'smooth' });
    };

    // Retrocede el carrusel suavemente
    const handlePrev = () => {
        const container = carouselRef.current;
        const itemWidth = container?.children[0]?.offsetWidth || 0;
        container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    };

    return (
        <div className="relative flex items-center justify-between w-full px-11 max-w-screen-md mx-auto overflow-hidden py-6 p">
            {/* Flecha Izquierda */}
            {showLeftArrow && (
                <button
                    onClick={handlePrev}
                    className="absolute left-0 z-20 p-2 mb-3 ml-1 text-gray-500 bg-white rounded-full shadow hover:bg-gray-200 focus:outline-none"
                    aria-label="Anterior"
                >
                    &lt;
                </button>
            )}

            {/* Contenedor del Carrusel */}
            <div
                ref={carouselRef}
                className="flex overflow-x-scroll scrollbar-hide space-x-2 items-center"
                onScroll={updateArrowVisibility}
            >
                {categories.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => handleFilterClick(category)}
                        className={`px-5 py-2 text-md font-semibold transition-all duration-300 whitespace-nowrap rounded-md 
                            ${activeCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                        aria-label={`Filtrar por ${category}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Flecha Derecha */}
            {showRightArrow && (
                <button
                    onClick={handleNext}
                    className="absolute right-0 z-20 p-2 mb-3 mr-1 text-gray-500 bg-white rounded-full shadow hover:bg-gray-200 focus:outline-none"
                    aria-label="Siguiente"
                >
                    &gt;
                </button>
            )}
        </div>
    );
};

export default SubMenuCarousel;
