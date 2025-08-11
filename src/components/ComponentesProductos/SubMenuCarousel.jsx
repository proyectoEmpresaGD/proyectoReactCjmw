// src/components/SubMenuDropdown.jsx
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaTimes, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { cdnUrl } from '../../Constants/cdn';
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

    // Funcionalidad
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

// Obtiene un producto de ejemplo según la categoría (imagen + nombre + id)
async function fetchExampleProduct(catKey, groupKey) {
    const payload = {};
    switch (groupKey) {
        case 'sections.estilos': payload.fabricPattern = [catKey]; break;
        case 'sections.funcionalidad': payload.mantenimiento = [catKey]; break;
        case 'sections.usos': payload.uso = [catKey]; break;
        case 'sections.tipos': payload.fabricType = [catKey]; break;
        default: return null;
    }
    try {
        const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/products/filter?limit=1`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        const prod = (data.products || data)[0];
        if (!prod) return null;
        // Cargar imagen de buena calidad
        const imgRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/images/${prod.codprodu}/Buena`
        );
        if (!imgRes.ok) throw new Error();
        const imgJson = await imgRes.json();
        const url = imgJson.ficadjunto ? `https://${imgJson.ficadjunto}` : null;
        return { id: prod.codprodu, name: prod.nombre, imageUrl: url };
    } catch {
        return null;
    }
}

export default function SubMenuDropdown({ onFilterClick, type, activeCategory }) {
    const { t } = useTranslation('subMenuCarousel');
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef(null);

    const sections = ALL_CATEGORIES.reduce((acc, cat) => {
        if (cat.onlyIfNotTela && type === 'tela') return acc;
        const grp = t(cat.groupKey);
        (acc[grp] = acc[grp] || []).push(cat);
        return acc;
    }, {});

    const openMenu = () => {
        clearTimeout(timeoutRef.current);
        setOpen(true);
    };
    const closeMenu = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
            setPreviewData(null);
            setLoading(false);
        }, 150);
    };

    const handleHover = async cat => {
        setLoading(true);
        setPreviewData(null);
        const data = await fetchExampleProduct(cat.key, cat.groupKey);
        setPreviewData(data);
        setLoading(false);
    };

    const selectCategory = key => {
        setOpen(false);
        setPreviewData(null);
        onFilterClick(activeCategory === key ? null : key);
    };

    return (
        <div className="relative mt-6" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
            {/* Trigger */}
            <div className="flex justify-center">
                <button className="inline-flex items-center text-lg font-semibold text-gray-800 hover:text-blue-600 transition">
                    {t('triggerDefault')}
                    <FaChevronDown className="ml-2 text-gray-600" />
                </button>
            </div>

            {/* Desktop Mega–menu */}
            {open && (
                <div className="hidden lg:grid absolute left-1/2 top-full -translate-x-1/2 mt-2 w-11/12 max-w-6xl grid-cols-[3fr_1fr] bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 z-50 overflow-hidden">
                    {/* Filtros */}
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                        {Object.entries(sections).map(([label, items]) => (
                            <div key={label}>
                                <h4 className="mb-2 text-sm font-medium text-gray-500 uppercase">{label}</h4>
                                <div className="flex flex-wrap gap-3">
                                    {items.map(cat => {
                                        const name = t(cat.labelKey);
                                        const isActive = activeCategory === cat.key;
                                        return (
                                            <button
                                                key={cat.key}
                                                onClick={() => selectCategory(cat.key)}
                                                onMouseEnter={() => handleHover(cat)}
                                                className={`
                          px-4 py-2 text-sm rounded-full transition
                          ${isActive
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                        `}
                                            >
                                                {name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Preview Producto */}
                    <div className="bg-gray-50 p-6 flex flex-col items-center justify-center border-l border-gray-200">
                        {loading ? (
                            <FaSpinner className="animate-spin text-gray-400 text-3xl" />
                        ) : previewData ? (
                            <div
                                className="cursor-pointer w-full flex flex-col items-center"
                                onClick={() => {
                                    navigate(`/products?productId=${previewData.id}`);
                                    setOpen(false);
                                }}
                            >
                                <img
                                    src={cdnUrl(previewData.imageUrl)}
                                    alt={previewData.name}
                                    className="w-full h-48 object-cover rounded-lg shadow-md mb-3 transition-transform hover:scale-105"
                                />
                                <span className="text-sm font-medium text-gray-800 text-center">
                                    {previewData.name}
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center">{t('hoverInfo')}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Bottom-sheet Móvil */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-30 z-40 flex items-end"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="w-full bg-white rounded-t-3xl p-6 max-h-[75vh] overflow-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-base font-semibold text-gray-800">{t('triggerDefault')}</h3>
                            <button onClick={() => setOpen(false)} className="p-2 text-gray-600 hover:text-gray-800">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(sections).map(([label, items]) => (
                                <div key={label}>
                                    <h4 className="mb-1 text-xs font-medium text-gray-500 uppercase">{label}</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {items.map(cat => {
                                            const name = t(cat.labelKey);
                                            const isActive = activeCategory === cat.key;
                                            return (
                                                <button
                                                    key={cat.key}
                                                    onClick={() => selectCategory(cat.key)}
                                                    onMouseEnter={() => handleHover(cat)}
                                                    className={`
                            w-full px-3 py-2 text-sm rounded-full transition
                            ${isActive
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                          `}
                                                >
                                                    {name}
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