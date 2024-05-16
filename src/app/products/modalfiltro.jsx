import { useState, useEffect } from 'react';
// Importa aquí tus otros componentes como Header, Footer, CardProduct, etc.

// Este sería tu componente FiltroModal
function FiltroModal({ isOpen, close, applyFilters, marcas, coleccionesPorMarca }) {
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [availableCollections, setAvailableCollections] = useState([]);

    useEffect(() => {
        if (selectedBrands.includes("All Brands")) {
            // Si "All Brands" está seleccionado, muestra todas las colecciones de todas las marcas
            const allCollections = Object.values(coleccionesPorMarca).flat();
            setAvailableCollections([...new Set(allCollections)]);
        } else if (selectedBrands.length) {
            // Muestra solo las colecciones de las marcas seleccionadas
            const updatedCollections = selectedBrands.flatMap(brand => coleccionesPorMarca[brand] || []);
            setAvailableCollections([...new Set(updatedCollections)]);
        } else {
            // Si no hay marcas seleccionadas, limpia las colecciones disponibles
            setAvailableCollections([]);
        }
    }, [selectedBrands, coleccionesPorMarca]);

    const handleBrandChange = (brand) => {
        if (brand === "All Brands") {
            // Si se selecciona "All Brands", deselecciona todas las otras marcas
            setSelectedBrands(["All Brands"]);
        } else {
            // Asegura que "All Brands" se desmarque si se selecciona otra marca
            const newSelectedBrands = selectedBrands.filter(b => b !== "All Brands");
            setSelectedBrands(prevBrands =>
                prevBrands.includes(brand)
                    ? newSelectedBrands.filter(b => b !== brand)
                    : [...newSelectedBrands, brand]
            );
        }
    };

    const handleCollectionChange = (collection) => {
        // Deselecciona "All Brands" si se selecciona alguna colección específica
        setSelectedCollections(prevCollections =>
            prevCollections.includes(collection)
                ? prevCollections.filter(c => c !== collection)
                : [...prevCollections, collection]
        );
    };

    // Maneja los cambios en la selección de colores
    const handleColorChange = (color) => {
        setSelectedColors(prevColors =>
            prevColors.includes(color)
                ? prevColors.filter(c => c !== color)
                : [...prevColors, color]
        );
    };

    const handleApplyFilters = () => {
        applyFilters({
            brands: selectedBrands,
            colors: selectedColors,
            collections: selectedCollections,
        });
        close(); // Cierra la modal después de aplicar los filtros
    };

    if (!isOpen) return null;
    const colors = [
        { name: 'Rojo', src: '#ef4444' },
        { name: 'Azul', src: '#3b82f6' },
        { name: 'Verde', src: '#22c55e' },
        { name: 'Amarillo', src: '#eab308' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-[60%] h-[50%] w-full m-4">
                <h2 className="text-center text-2xl font-bold mb-4">FILTROS</h2>
                <div className='grid grid-cols-3 gap-3'>
                    <div>
                        <h3 className="font-semibold">Marcas:</h3>
                        {['All Brands', 'CJM', 'ARENA', 'HARBOUR', 'FLAMENCO'].map((brand) => (
                            <label key={brand}>
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => handleBrandChange(brand)}
                                />
                                {brand}
                            </label>
                        ))}
                    </div>

                    <div>
                        <h3 className="font-semibold">Colores:</h3>
                        <div className="flex space-x-2">
                            {colors.map((color) => (
                                <div
                                    key={color.name}
                                    className={`w-10 h-10  hover:scale-105 duration-200 cursor-pointer flex items-center justify-center ${selectedColors.includes(color.name) ? 'ring-2 ring-white' : ''}`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => handleColorChange(color.name)}
                                >
                                    {selectedColors.includes(color.name) && (
                                        <div className="w-10 h-10 border-2 border-black "></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='overflow-y-auto xl:min-h-[100px] xl:max-h-[200px] flex flex-col  border-2 border-gray-300 rounded-md p-3'>
                        <h3 className=" font-semibold mx-auto">Colecciones</h3>
                        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" src="lupa.svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" id="input-group-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Buscar Coleccion"></input>
                        {availableCollections.map((collection) => (
                            <label key={collection}>
                                <input
                                    type="checkbox" // Cambiado de radio a checkbox
                                    checked={selectedCollections.includes(collection)}
                                    onChange={() => handleCollectionChange(collection)}
                                />
                                {collection}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="absolute xl:top-[65%] xl:left-[63%] justify-end mt-4">
                    <button onClick={handleApplyFilters} className="group relative md:max-lg:left-[16%] sm:max-lg:left-[16%] lg:left-[25%] left-[30%] h-12 overflow-hidden overflow-x-hidden rounded-md bg-gray-400 px-8 py-2 text-neutral-50"><span className="relative z-10">Aplicar Filtros</span><span className="absolute inset-0 overflow-hidden rounded-md"><span className="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-gray-500 transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span></span></button>
                </div>

                <button className="absolute xl:top-[25%] xl:left-[76%] right-4 m-4" onClick={close}>
                    <img src="close.svg" className=' w-6 h-6 hover:scale-125 duration-200' />
                </button>
            </div>
        </div>
    );
}

export default FiltroModal;