import { useState } from 'react';
import FiltroModal from "./modalfiltro";

function Filtro() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({ brands: [], colors: [], collections: [], fabricTypes: [], fabricPatterns: [] });

    const applyFilters = (selectedFilters) => {
        setFilters(selectedFilters);
        fetchFilteredProducts(selectedFilters);
    };

    const fetchFilteredProducts = async (filters) => {
        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filters)
            });
            const products = await response.json();
            console.log(products);
            // Aquí actualizarías el estado de los productos con los productos filtrados
        } catch (error) {
            console.error('Error fetching filtered products:', error);
        }
    };

    return (
        <>
            <div className="top-1/4 sticky xl:ml-2 z-10 xl:mt-4 mt-4 ml-5">
                <button onClick={() => setIsModalOpen(true)} className="flex p-3 xl:px-6 lg:px-6 max-w-[30%] lg:min-w-[8%] xl:w-[7%] xl:hover:w-[9%] hover:max-w-[30%] bg-black hover:bg-white text-white hover:text-black duration-200 border-2 border-black hover:border-gray-400 hover:rounded-xl rounded">Filtros <img src="filtro.svg" className="w-4 h-4 ml-2 mt-1" alt="" /></button>
            </div>

            <FiltroModal
                isOpen={isModalOpen}
                close={() => setIsModalOpen(false)}
                applyFilters={applyFilters}
            />
        </>
    );
}
export default Filtro;