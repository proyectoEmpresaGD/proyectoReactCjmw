// src/app/products/buttonFiltro.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSlidersH } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import FilterPanel from './FilterPanel';

const EMPTY_FILTERS = {
    brand: [],
    color: [],
    collection: [],
    fabricType: [],
    fabricPattern: [],
    martindale: [],
    uso: [],
    mantenimiento: [],
    martindaleRanges: [],
};

const normalizeKey = (value) =>
    value?.normalize('NFD').replace(/\p{Diacritic}/gu, '').toUpperCase();

const parseSearchFilters = (search) => {
    const params = new URLSearchParams(search);
    const getAll = (key) => {
        const seen = new Set();
        return params
            .getAll(key)
            .map((value) => (value == null ? '' : value.trim()))
            .filter(Boolean)
            .filter((value) => {
                const comparable = normalizeKey(value);
                if (!comparable) return false;
                if (seen.has(comparable)) return false;
                seen.add(comparable);
                return true;
            });
    };

    const asNumbers = getAll('martindale')
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));

    return {
        brand: getAll('brand'),
        color: getAll('color'),
        collection: getAll('collection'),
        fabricType: getAll('fabricType'),
        fabricPattern: getAll('fabricPattern'),
        martindale: asNumbers,
        uso: getAll('uso'),
        mantenimiento: getAll('mantenimiento'),
        martindaleRanges: getAll('martindaleRange'),
    };
};

export default function FiltroButton({ clearFiltersCallback }) {
    const { t } = useTranslation('buttonFiltro');
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const productType = params.get('type') === 'papel' ? 'papel' : 'tela';

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [filters, setFilters] = useState(EMPTY_FILTERS);

    useEffect(() => {
        const urlFilters = parseSearchFilters(location.search);
        setFilters({
            ...EMPTY_FILTERS,
            ...urlFilters,
            martindaleRanges: urlFilters.martindaleRanges || [],
            martindale: urlFilters.martindale || [],
        });
    }, [location.search]);

    const openPanel = () => {
        setIsPanelOpen(true);
    };

    const applyFilters = (selectedFilters) => {
        setFilters({
            ...selectedFilters,
            martindaleRanges: selectedFilters.martindaleRanges || [],
        });

        const qs = new URLSearchParams();
        qs.set('page', '1');

        if (selectedFilters.brand?.length)
            selectedFilters.brand.forEach((v) => qs.append('brand', v));
        if (selectedFilters.color?.length)
            selectedFilters.color.forEach((v) => qs.append('color', v));
        if (selectedFilters.collection?.length)
            selectedFilters.collection.forEach((v) => qs.append('collection', v));
        if (selectedFilters.fabricType?.length)
            selectedFilters.fabricType.forEach((v) => qs.append('fabricType', v));
        if (selectedFilters.fabricPattern?.length)
            selectedFilters.fabricPattern.forEach((v) => qs.append('fabricPattern', v));
        if (selectedFilters.martindale?.length)
            selectedFilters.martindale.forEach((v) => qs.append('martindale', v));
        if (selectedFilters.martindaleRanges?.length)
            selectedFilters.martindaleRanges.forEach((v) => qs.append('martindaleRange', v));
        if (selectedFilters.uso?.length)
            selectedFilters.uso.forEach((v) => qs.append('uso', v));
        if (selectedFilters.mantenimiento?.length)
            selectedFilters.mantenimiento.forEach((v) => qs.append('mantenimiento', v));

        // Navega y fuerza recarga en CardProduct con scroll infinito
        navigate(`/products?${qs.toString()}`);

        setIsPanelOpen(false);
        try {
            window.scrollTo({ top: 0, behavior: 'auto' });
        } catch { }
    };

    const hasAnyFilter = Object.values(filters).some(
        (arr) => Array.isArray(arr) && arr.length > 0
    );

    return (
        <>
            {/* BOTÓN FLOTANTE: oculto en móvil/tablet. Visible solo en ≥ lg */}
            <div className="hidden lg:block fixed top-1/4 left-6 z-20 group">
                <button
                    onClick={openPanel}
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#26659E] transition"
                    aria-label={t('openButton', 'Abrir filtros')}
                >
                    <FaSlidersH className="w-5 h-5 text-gray-700" />
                    {hasAnyFilter && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#26659E] rounded-full" />
                    )}
                </button>

                {/* TOOLTIP (solo se ve en desktop porque el wrapper está oculto en <lg) */}
                <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#26659E] text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('tooltip', 'Encuentra lo que deseas')}
                </span>
            </div>

            {/* PANEL LATERAL (el propio FilterPanel ya no renderiza en <lg) */}
            <FilterPanel
                isOpen={isPanelOpen}
                close={() => setIsPanelOpen(false)}
                applyFilters={applyFilters}
                currentFilters={filters}
                clearFiltersCallback={clearFiltersCallback}
                productType={productType}
            />
        </>
    );
}
