import { useEffect } from 'react';

const SubMenuCarousel = ({ onFilterClick, type, activeCategory }) => {
    // Categorías originales del submenú (valores de filtro)
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

    // Nombres personalizados para mostrar en el submenú
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

    // Al pulsar una categoría:
    // - Si ya está activa, se desmarca (envía null)
    // - Si no, se envía el filtro seleccionado.
    const handleFilterClick = (index) => {
        const originalCategory = originalCategories[index];
        if (activeCategory === originalCategory) {
            onFilterClick(null);
        } else {
            onFilterClick(originalCategory);
        }
    };

    return (
        <div className="flex flex-wrap justify-center items-start gap-2 py-6 max-w-screen-md mx-auto">
            {customNames.map((customName, index) => (
                <button
                    key={index}
                    onClick={() => handleFilterClick(index)}
                    className={`px-5 py-2 text-md font-semibold transition-all duration-300 whitespace-nowrap rounded-md 
                        ${activeCategory === originalCategories[index] ? 'bg-[#26659E] text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                    aria-label={`Filtrar por ${customName}`}
                >
                    {customName}
                </button>
            ))}
        </div>
    );
};

export default SubMenuCarousel;
