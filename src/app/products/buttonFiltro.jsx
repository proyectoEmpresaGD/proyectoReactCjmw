import { useState } from 'react';
import FiltroModal from "./modalfiltro";

function Filtro({ setFilteredProducts }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({ brands: [], colors: [], collections: [], fabricTypes: [], fabricPatterns: [] });

    const applyFilters = (selectedFilters) => {
        setFilters(selectedFilters);
        fetchFilteredProducts(selectedFilters);
    };

    const fetchFilteredProducts = async (filters) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/filter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filters)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            setFilteredProducts(products);
        } catch (error) {
            console.error('Error fetching filtered products:', error);
        }
    };

    return (
        <>
            <div className="top-1/4 sticky xl:ml-2 z-10 xl:mt-4 mt-4 ml-5">
                <button onClick={() => setIsModalOpen(true)} className="flex p-3 xl:px-3 lg:px-6 text-center justify-center max-w-[30%] lg:min-w-[10%] xl:w-[7%] xl:hover:w-[9%] hover:max-w-[30%] bg-black hover:bg-white text-white hover:text-black duration-200 border-2 border-black hover:border-gray-400 hover:rounded-xl rounded">Filtrar por</button>
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