// src/components/Filtro.jsx
import { useState } from 'react';
import { FaSlidersH } from 'react-icons/fa';
import FilterPanel from './FilterPanel';

export default function Filtro({ setFilteredProducts, page, clearFiltersCallback }) {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const [filters, setFilters] = useState({
        brand: [],
        color: [],
        collection: [],
        fabricType: [],
        fabricPattern: [],
        martindale: []
    });
    const itemsPerPage = 16;

    const applyFilters = (selectedFilters) => {
        setFilters(selectedFilters);
        fetchFilteredProducts(selectedFilters, page);
    };

    const fetchFilteredProducts = async (filters, pageNumber = 1) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/products/filter?page=${pageNumber}&limit=${itemsPerPage}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filters)
                }
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (!Array.isArray(data.products)) throw new Error('Expected an array of products');

            const productsWithImages = await Promise.all(
                data.products.map(async (product) => {
                    const [good, low] = await Promise.all([
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Buena`)
                            .then(r => r.ok ? r.json() : null),
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Baja`)
                            .then(r => r.ok ? r.json() : null)
                    ]);
                    return {
                        ...product,
                        imageBuena: good ? `https://${good.ficadjunto}` : 'default_buena_image_url',
                        imageBaja: low ? `https://${low.ficadjunto}` : 'default_baja_image_url'
                    };
                })
            );

            setFilteredProducts(productsWithImages, filters);
        } catch (error) {
            console.error('Error fetching filtered products:', error);
        }
    };

    return (
        <>
            {/* BOTÓN MODERNO */}
            <button
                onClick={() => setIsPanelOpen(true)}
                className="
          fixed top-1/4 left-4 transform -translate-y-1/2 z-20
          flex items-center gap-2
          bg-white px-4 py-2 rounded-full shadow-lg
          hover:bg-gray-100 focus:ring-2 focus:ring-[#D2B48C] focus:outline-none
        "
            >
                <FaSlidersH className="w-6 h-6 text-gray-700" />
                <span className="hidden md:block text-gray-700 font-medium">Filtros</span>
            </button>

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
