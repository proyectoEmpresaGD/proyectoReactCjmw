import { useState } from 'react';
import { FaSlidersH } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import FilterPanel from './FilterPanel';

export default function FiltroButton({ setFilteredProducts, page, clearFiltersCallback }) {
    const { t } = useTranslation('buttonFiltro');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [filters, setFilters] = useState({
        brand: [], color: [], collection: [],
        fabricType: [], fabricPattern: [], martindale: []
    });

    const applyFilters = selectedFilters => {
        setFilters(selectedFilters);
        fetchFilteredProducts(selectedFilters, page);
    };

    const fetchFilteredProducts = async (filters, pageNumber = 1) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/products/filter?page=${pageNumber}&limit=${16}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filters)
                }
            );
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();
            const productsWithImages = await Promise.all(
                data.products.map(async product => {
                    const [good, low] = await Promise.all([
                        fetch(
                            `${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Buena`
                        ).then(r => r.ok ? r.json() : null),
                        fetch(
                            `${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Baja`
                        ).then(r => r.ok ? r.json() : null)
                    ]);
                    return {
                        ...product,
                        imageBuena: good ? `https://${good.ficadjunto}` : 'default_buena_url',
                        imageBaja: low ? `https://${low.ficadjunto}` : 'default_baja_url'
                    };
                })
            );
            setFilteredProducts(productsWithImages, filters);
        } catch (err) {
            console.error('Error fetching filtered products:', err);
        }
    };

    return (
        <>
            {/* BOTÓN FLOTANTE */}
            <div className="fixed top-1/4 left-6 z-20 group">
                <button
                    onClick={() => setIsPanelOpen(true)}
                    className="
            flex items-center justify-center
            w-10 h-10
            bg-white rounded-full shadow-lg
            hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#26659E]
            transition
          "
                    aria-label={t('openButton')}
                >
                    <FaSlidersH className="w-5 h-5 text-gray-700" />
                    {Object.values(filters).some(arr => arr.length > 0) && (
                        <span className="
              absolute top-1 right-1
              w-2 h-2
              bg-[#26659E] rounded-full
            " />
                    )}
                </button>

                {/* TOOLTIP */}
                <span className="
          absolute left-full ml-3 top-1/2 -translate-y-1/2
          whitespace-nowrap
          bg-[#26659E] text-white text-xs font-medium
          px-2 py-1 rounded
          opacity-0 group-hover:opacity-100
          transition-opacity
        ">
                    Encuentra lo que deseas
                </span>
            </div>

            {/* PANEL LATERAL */}
            <FilterPanel
                isOpen={isPanelOpen}
                close={() => setIsPanelOpen(false)}
                applyFilters={applyFilters}
                currentFilters={filters}
                clearFiltersCallback={clearFiltersCallback}
            />
        </>
    );
}
