import { useState } from 'react';
import { FaFilter } from 'react-icons/fa'; // Icono de filtro
import FiltroModal from "./modalfiltro";

function Filtro({ setFilteredProducts, page, clearFiltersCallback }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false); // Estado para mostrar el tooltip
    const [filters, setFilters] = useState({ brands: [], colors: [], collections: [], fabricTypes: [], fabricPatterns: [] });
    const itemsPerPage = 16;

    const applyFilters = (selectedFilters) => {
        setFilters(selectedFilters);
        fetchFilteredProducts(selectedFilters, page);
    };

    const fetchFilteredProducts = async (filters, pageNumber = 1) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/filter?page=${pageNumber}&limit=${itemsPerPage}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filters)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data.products)) {
                throw new Error('Invalid data format: Expected an array of products');
            }

            const productsWithImages = await Promise.all(
                data.products.map(async (product) => {
                    const [imageBuena, imageBaja] = await Promise.all([
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Buena`).then(res => res.ok ? res.json() : null),
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Baja`).then(res => res.ok ? res.json() : null)
                    ]);

                    return {
                        ...product,
                        imageBuena: imageBuena ? `https://${imageBuena.ficadjunto}` : 'default_buena_image_url',
                        imageBaja: imageBaja ? `https://${imageBaja.ficadjunto}` : 'default_baja_image_url'
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
            {/* Botón flotante en la parte inferior izquierda */}
            <div className="fixed bottom-5 left-5 z-20">
                <button
                    onClick={() => setIsModalOpen(true)}
                    onMouseEnter={() => setShowTooltip(true)}  // Mostrar tooltip en hover
                    onMouseLeave={() => setShowTooltip(false)}  // Ocultar tooltip cuando no hay hover
                    className="rounded-full p-3 bg-gray-500 text-white shadow-md flex items-center justify-center hover:bg-gray-600"
                >
                    <FaFilter className="text-2xl" /> {/* Icono de filtro */}
                </button>

                {/* Tooltip solo en pantallas grandes (PC) */}
                {showTooltip && (
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded">
                        Filtrar por
                    </div>
                )}

                {/* Etiqueta solo en pantallas pequeñas (Móvil) */}
                <div className="block lg:hidden text-center text-xs mt-1 text-black">
                    Filtrar por
                </div>
            </div>

            {/* Modal de filtros */}
            <FiltroModal
                isOpen={isModalOpen}
                close={() => setIsModalOpen(false)}
                applyFilters={applyFilters}
                clearFiltersCallback={clearFiltersCallback} // Pasamos la función de limpiar filtros
            />
        </>
    );
}

export default Filtro;
