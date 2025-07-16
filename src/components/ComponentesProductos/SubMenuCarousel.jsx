import React from 'react';
import { useTranslation } from 'react-i18next';

const SubMenuCarousel = ({ onFilterClick, type, activeCategory }) => {
    const { t } = useTranslation('subMenuCarousel');

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

    // Al pulsar una categoría:
    // - Si ya está activa, se desmarca (envía null)
    // - Si no, se envía el filtro seleccionado.
    const handleFilterClick = index => {
        const category = originalCategories[index];
        onFilterClick(activeCategory === category ? null : category);
    };

    return (
        <div className="flex flex-wrap justify-center items-start gap-2 py-6 max-w-screen-md mx-auto">
            {originalCategories.map((cat, idx) => {
                const key = cat.toLowerCase();
                const isActive = activeCategory === cat;
                return (
                    <button
                        key={cat}
                        onClick={() => handleFilterClick(idx)}
                        className={`px-5 py-2 text-md font-semibold transition-all duration-300 whitespace-nowrap rounded-md 
              ${isActive
                                ? 'bg-[#26659E] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                        aria-label={t(`categories.${key}`)}
                    >
                        {t(`categories.${key}`)}
                    </button>
                );
            })}
        </div>
    );
};

export default SubMenuCarousel;
