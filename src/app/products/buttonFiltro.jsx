import { useState } from 'react';
import FiltroModal from "./modalfiltro";

function Filtro({ setFilteredProducts, page, clearFiltersCallback }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
            <div className="top-1/4 sticky xl:ml-2 z-10 xl:mt-4 mt-4 ml-5">
                <button onClick={() => setIsModalOpen(true)}
                    className="flex p-2 xl:px-2 lg:px-4 2xl:px-2 text-center justify-center max-w-[15%] lg:min-w-[8%] xl:w-[5%] xl:hover:w-[6%] hover:max-w-[20%] bg-black hover:bg-white text-white hover:text-black duration-200 border-2 border-black hover:border-gray-400 hover:rounded-xl rounded">
                    Filtrar por
                </button>
            </div>

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
