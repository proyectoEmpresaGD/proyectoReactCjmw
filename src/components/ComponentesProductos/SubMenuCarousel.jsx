import { useEffect } from 'react';

const SubMenuCarousel = ({ onFilterClick, type, activeCategory }) => {
    // Definición de las categorías originales del submenú (valores de filtro)
    const originalCategories = [
        "FLORAL",
        "LISO",
        "RAYAS",
        "VISILLO",
        "GEOMETRICO",
        "TERCIOPELO",
        "FR",
        "OUTDOOR",
        ...(type !== 'tela' ? ["WALLPAPER"] : []),
    ];

    // Definición de nombres personalizados para mostrar en el submenú
    const customNames = [
        "FLORES",
        "LISOS",
        "RAYAS",
        "VISILLOS",
        "GEOMÉTRICOS",
        "TERCIOPELO",
        "FR",
        "OUTDOOR",
        ...(type !== 'tela' ? ["WALLPAPER"] : []),
    ];

    // Función para manejar el clic en una categoría personalizada
    const handleFilterClick = (index) => {
        const originalCategory = originalCategories[index]; // Obtener el nombre original
        onFilterClick(originalCategory); // Filtrar usando el nombre original
    };

    return (
        <div className="flex flex-wrap justify-center items-start gap-2 py-6 max-w-screen-md mx-auto">
            {customNames.map((customName, index) => (
                <button
                    key={index}
                    onClick={() => handleFilterClick(index)}
                    className={`px-5 py-2  text-md font-semibold transition-all duration-300 whitespace-nowrap rounded-md 
                        ${activeCategory === originalCategories[index] ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                    aria-label={`Filtrar por ${customName}`}
                >
                    {customName} {/* Mostrar el nombre personalizado */}
                </button>
            ))}
        </div>
    );
};

export default SubMenuCarousel;
