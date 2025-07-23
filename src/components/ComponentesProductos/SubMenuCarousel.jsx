import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

const ALL_CATEGORIES = [
    // Estilos
    { key: 'FLORAL', labelKey: 'categories.floral', groupKey: 'sections.estilos' },
    { key: 'LISO', labelKey: 'categories.liso', groupKey: 'sections.estilos' },
    { key: 'FALSO LISO', labelKey: 'categories.falsoLiso', groupKey: 'sections.estilos' },
    { key: 'GEOMETRICO', labelKey: 'categories.geometrico', groupKey: 'sections.estilos' },
    { key: 'RAYAS', labelKey: 'categories.rayas', groupKey: 'sections.estilos' },
    { key: 'CUADROS', labelKey: 'categories.cuadros', groupKey: 'sections.estilos' },
    { key: 'ESPIGA', labelKey: 'categories.espiga', groupKey: 'sections.estilos' },
    { key: 'ETNICO', labelKey: 'categories.etnico', groupKey: 'sections.estilos' },
    { key: 'CON ANIMALES', labelKey: 'categories.conAnimales', groupKey: 'sections.estilos' },
    { key: 'CON TEXTURAS', labelKey: 'categories.conTexturas', groupKey: 'sections.estilos' },
    { key: 'RAFIA', labelKey: 'categories.rafia', groupKey: 'sections.estilos' },
    { key: 'TELAS TROPICALES', labelKey: 'categories.telasTropicales', groupKey: 'sections.estilos' },

    // Funcionalidades
    { key: 'EASYCLEAN', labelKey: 'categories.easyClean', groupKey: 'sections.funcionalidad' },

    // Usos
    { key: 'IMO', labelKey: 'categories.imo', groupKey: 'sections.usos' },
    { key: 'OUTDOOR', labelKey: 'categories.outdoor', groupKey: 'sections.usos' },
    { key: 'FR', labelKey: 'categories.fr', groupKey: 'sections.usos' },

    // Tipos
    { key: 'VISILLO', labelKey: 'categories.visillo', groupKey: 'sections.tipos' },
    { key: 'TERCIOPELO', labelKey: 'categories.terciopelo', groupKey: 'sections.tipos' },
    { key: 'WALLPAPER', labelKey: 'categories.wallpaper', groupKey: 'sections.tipos', onlyIfNotTela: true },
];

export default function SubMenuDropdown({ onFilterClick, type, activeCategory }) {
    const { t } = useTranslation('subMenuCarousel');
    const [open, setOpen] = useState(false);
    const timeoutRef = useRef(null);

    // Agrupar en secciones
    const sections = ALL_CATEGORIES.reduce((acc, cat) => {
        if (cat.onlyIfNotTela && type === 'tela') return acc;
        const group = t(cat.groupKey);
        acc[group] = acc[group] || [];
        acc[group].push(cat);
        return acc;
    }, {});

    const openMenu = () => { clearTimeout(timeoutRef.current); setOpen(true); };
    const closeMenu = () => { timeoutRef.current = setTimeout(() => setOpen(false), 150); };
    const selectCategory = key => {
        setOpen(false);
        onFilterClick(activeCategory === key ? null : key);
    };

    return (
        <div
            className="relative mt-6"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
        >
            {/* Disparador */}
            <div className="flex justify-center">
                <button className="inline-flex items-center text-xl font-semibold text-gray-800 hover:text-[#26659E] transition">
                    {t('triggerDefault')}
                    <FaChevronDown className="ml-2 text-gray-600" />
                </button>
            </div>

            {/* Mega-menú desktop */}
            {open && (
                <div className="hidden lg:block absolute left-1/2 top-full -translate-x-1/2 mt-2 w-[85%] max-w-4xl bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200 z-30">
                    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {Object.entries(sections).map(([sectionLabel, items]) => (
                            <div key={sectionLabel}>
                                <h4 className="mb-3 text-sm font-medium text-gray-500 uppercase">
                                    {sectionLabel}
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {items.map(({ key, labelKey }) => {
                                        const isActive = activeCategory === key;
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => selectCategory(key)}
                                                className={`
                          px-4 py-2 text-sm rounded-full transition
                          ${isActive
                                                        ? 'bg-[#26659E] text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                        `}
                                            >
                                                {t(labelKey)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom-sheet móvil */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-20 flex items-end"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="w-full bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {t('triggerDefault')}
                            </h3>
                            <button onClick={() => setOpen(false)} className="p-2 text-gray-600 hover:text-gray-800">
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            {Object.entries(sections).map(([sectionLabel, items]) => (
                                <div key={sectionLabel}>
                                    <h4 className="mb-2 text-sm font-medium text-gray-500 uppercase">
                                        {sectionLabel}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {items.map(({ key, labelKey }) => {
                                            const isActive = activeCategory === key;
                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => selectCategory(key)}
                                                    className={`
                            w-full px-4 py-3 text-base rounded-full transition
                            ${isActive
                                                            ? 'bg-[#26659E] text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                          `}
                                                >
                                                    {t(labelKey)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
