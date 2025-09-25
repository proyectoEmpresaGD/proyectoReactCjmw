import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSlidersH } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import FilterPanel from './FilterPanel';

const EMPTY_FILTERS = {
    brand: [], color: [], collection: [],
    fabricType: [], fabricPattern: [], martindale: []
};

export default function FiltroButton({ clearFiltersCallback }) {
    const { t } = useTranslation('buttonFiltro');
    const navigate = useNavigate();
    const location = useLocation();

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [filters, setFilters] = useState(EMPTY_FILTERS);

    const openClearedPanel = () => {
        // Limpia selecciones del panel y lo abre
        setFilters(EMPTY_FILTERS);
        setIsPanelOpen(true);
    };

    const applyFilters = (selectedFilters) => {
        setFilters(selectedFilters);

        const qs = new URLSearchParams();
        qs.set('page', '1');

        if (selectedFilters.brand?.length) selectedFilters.brand.forEach(v => qs.append('brand', v));
        if (selectedFilters.color?.length) selectedFilters.color.forEach(v => qs.append('color', v));
        if (selectedFilters.collection?.length) selectedFilters.collection.forEach(v => qs.append('collection', v));
        if (selectedFilters.fabricType?.length) selectedFilters.fabricType.forEach(v => qs.append('fabricType', v));
        if (selectedFilters.fabricPattern?.length) selectedFilters.fabricPattern.forEach(v => qs.append('fabricPattern', v));
        if (selectedFilters.martindale?.length) selectedFilters.martindale.forEach(v => qs.append('martindale', v));

        // Navega y fuerza recarga en CardProduct con scroll infinito
        navigate(`/products?${qs.toString()}`);

        setIsPanelOpen(false);
        try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch { }
    };

    return (
        <>
            {/* BOTÓN FLOTANTE */}
            <div className="fixed top-1/4 left-6 z-20 group">
                <button
                    onClick={openClearedPanel}
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#26659E] transition"
                    aria-label={t('openButton')}
                >
                    <FaSlidersH className="w-5 h-5 text-gray-700" />
                    {Object.values(filters).some(arr => arr.length > 0) && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#26659E] rounded-full" />
                    )}
                </button>

                {/* TOOLTIP */}
                <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#26659E] text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('tooltip', 'Encuentra lo que deseas')}
                </span>
            </div>

            {/* PANEL LATERAL */}
            <FilterPanel
                isOpen={isPanelOpen}
                close={() => setIsPanelOpen(false)}
                applyFilters={applyFilters}
                currentFilters={filters}          // <- al abrir va vacío para limpiar
                clearFiltersCallback={clearFiltersCallback}
            />
        </>
    );
}
