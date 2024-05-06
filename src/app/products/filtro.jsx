import { useState } from 'react';
import FiltroModal from "./modalfiltro"

function Filtro() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({ brands: [], colors: [], collections: [] });

    // Aquí es donde definirías tus marcas y colecciones
    const marcas = ['All Brands', 'CJM', 'ARENA', 'HARBOUR', 'FLAMENCO'];
    const coleccionesPorMarca = {
        'CJM': ['Colección Primavera', 'Colección Verano'],
        'ARENA': ['Colección Deportiva', 'Colección Casual'],
        'HARBOUR': ['Primavera Harbour', 'Colección Primavera HARBOUR', 'Colección Verano HARBOUR', 'Colección Primavera', 'Colección Verano'],
        'FLAMENCO': ['Primavera Flamenco', 'Colección PrimaveraFLAMENCO', 'Colección Verano FLAMENCO', 'Colección Primavera', 'Colección Verano'],

    };

    const applyFilters = (selectedFilters) => {
        setFilters(selectedFilters);
        // Aquí también filtrarías tus productos según los filtros seleccionados
    };
    return (
        <>
            <div className="top-[12%] xl:top-[20%] sticky xl:ml-2 z-10 xl:mt-4 mt-4 ml-5">
                <button onClick={() => setIsModalOpen(true)} className="flex p-3 xl:px-6 lg:px-6 max-w-[30%] lg:min-w-[8%] xl:w-[7%] xl:hover:w-[9%] hover:max-w-[30%] bg-black hover:bg-white text-white hover:text-black duration-200 border-2 border-black hover:border-gray-400 hover:rounded-xl rounded">Filtros <img src="filtro.svg" className=" w-4 h-4 ml-2 mt-1" alt="" /></button>
            </div>
            <FiltroModal
                isOpen={isModalOpen}
                close={() => setIsModalOpen(false)}
                applyFilters={applyFilters}
                marcas={marcas}
                coleccionesPorMarca={coleccionesPorMarca}
            />
        </>
    )
}
export default Filtro