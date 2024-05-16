import { useState, useEffect } from 'react';

function FiltroModal({ isOpen, close, applyFilters }) {
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedFabricTypes, setSelectedFabricTypes] = useState([]);
    const [selectedFabricPatterns, setSelectedFabricPatterns] = useState([]);
    const [availableCollections, setAvailableCollections] = useState([]);

    const marcas = ['ARENA', 'HARBOUR', 'CJM', 'FLAMENCO'];
    const marcasAbreviadas = {
        'ARENA': 'ARE',
        'HARBOUR': 'HAR',
        'CJM': 'CJM',
        'FLAMENCO': 'FLA'
    };
    const coleccionesPorMarca = {
        'ARE': { 'Colección Deportiva': '1', 'Colección Casual': '2' },
        'HAR': { 'Primavera Harbour': '3', 'Colección Primavera HARBOUR': '4', 'Colección Verano HARBOUR': '5' },
        'CJM': { 'Colección Primavera': '6', 'Colección Verano': '7' },
        'FLA': { 'Primavera Flamenco': '8', 'Colección PrimaveraFLAMENCO': '9', 'Colección Verano FLAMENCO': '10' }
    };

    const tiposDeTela = ['Algodón', 'Seda', 'Lino', 'Poliéster'];
    const dibujosDeTela = ['Liso', 'Rayas', 'Cuadros', 'Floral'];

    useEffect(() => {
        if (selectedBrands.includes("All Brands")) {
            const allCollections = Object.values(coleccionesPorMarca).flatMap(collections => Object.keys(collections));
            setAvailableCollections([...new Set(allCollections)]);
        } else if (selectedBrands.length) {
            const updatedCollections = selectedBrands.flatMap(brand => Object.keys(coleccionesPorMarca[marcasAbreviadas[brand]] || {}));
            setAvailableCollections([...new Set(updatedCollections)]);
        } else {
            setAvailableCollections([]);
        }
    }, [selectedBrands]);

    const handleBrandChange = (brand) => {
        if (brand === "All Brands") {
            setSelectedBrands(["All Brands"]);
        } else {
            const newSelectedBrands = selectedBrands.filter(b => b !== "All Brands");
            setSelectedBrands(prevBrands =>
                prevBrands.includes(brand)
                    ? newSelectedBrands.filter(b => b !== brand)
                    : [...newSelectedBrands, brand]
            );
        }
    };

    const handleCollectionChange = (collection) => {
        setSelectedCollections(prevCollections =>
            prevCollections.includes(collection)
                ? prevCollections.filter(c => c !== collection)
                : [...prevCollections, collection]
        );
    };

    const handleColorChange = (color) => {
        setSelectedColors(prevColors =>
            prevColors.includes(color)
                ? prevColors.filter(c => c !== color)
                : [...prevColors, color]
        );
    };

    const handleFabricTypeChange = (type) => {
        setSelectedFabricTypes(prevTypes =>
            prevTypes.includes(type)
                ? prevTypes.filter(t => t !== type)
                : [...prevTypes, type]
        );
    };

    const handleFabricPatternChange = (pattern) => {
        setSelectedFabricPatterns(prevPatterns =>
            prevPatterns.includes(pattern)
                ? prevPatterns.filter(p => p !== pattern)
                : [...prevPatterns, pattern]
        );
    };

    const handleApplyFilters = () => {
        const filtersToApply = {
            brands: selectedBrands.map(brand => marcasAbreviadas[brand]),
            colors: selectedColors,
            collections: selectedCollections.map(collection => {
                for (const marca in coleccionesPorMarca) {
                    if (coleccionesPorMarca[marca][collection]) {
                        return coleccionesPorMarca[marca][collection];
                    }
                }
                return collection;
            }),
            fabricTypes: selectedFabricTypes,
            fabricPatterns: selectedFabricPatterns
        };
        applyFilters(filtersToApply);
        close();
    };

    if (!isOpen) return null;

    const colors = [
        { name: 'Rojo', hex: '#ef4444' },
        { name: 'Azul', hex: '#3b82f6' },
        { name: 'Verde', hex: '#22c55e' },
        { name: 'Amarillo', hex: '#eab308' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-[60%] h-[60%] w-full m-4 overflow-y-auto ">
                <h2 className="text-center text-2xl font-bold">FILTROS</h2>
                <div className="flex justify-end">
                    <button className="relative overflow-hidden m-4" onClick={close}>
                        <img src="close.svg" className='w-6 h-6 hover:scale-125 duration-200 justify-end' />
                    </button>
                </div>
                <div className='grid xl:grid-cols-3 md:grid-cols gap-3 gap-y-6'>
                    <div className=''>
                        <h3 className="font-semibold">Marcas:</h3>
                        {['All Brands', ...marcas].map((brand) => (
                            <label key={brand} className="block">
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
                        <div className="flex mx-auto space-x-2 ">
                            {colors.map((color) => (
                                <div
                                    key={color.name}
                                    className={`w-10 h-10 hover:scale-105 duration-200 cursor-pointer flex items-center justify-center ${selectedColors.includes(color.name) ? 'ring-2 ring-white' : ''}`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => handleColorChange(color.name)}
                                >
                                    {selectedColors.includes(color.name) && (
                                        <div className="w-10 h-10 border-2 border-black"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
                        <h3 className="font-semibold mx-auto">Colecciones</h3>
                        <input type="text" id="input-group-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Buscar Colección" />
                        {availableCollections.map((collection) => (
                            <label key={collection} className="block">
                                <input
                                    type="checkbox"
                                    checked={selectedCollections.includes(collection)}
                                    onChange={() => handleCollectionChange(collection)}
                                />
                                {collection}
                            </label>
                        ))}
                    </div>
                    <div>
                        <h3 className="font-semibold">Tipo de Tela:</h3>
                        {tiposDeTela.map((type) => (
                            <label key={type} className="block">
                                <input
                                    type="checkbox"
                                    checked={selectedFabricTypes.includes(type)}
                                    onChange={() => handleFabricTypeChange(type)}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                    <div>
                        <h3 className="font-semibold">Dibujo de la Tela:</h3>
                        {dibujosDeTela.map((pattern) => (
                            <label key={pattern} className="block">
                                <input
                                    type="checkbox"
                                    checked={selectedFabricPatterns.includes(pattern)}
                                    onChange={() => handleFabricPatternChange(pattern)}
                                />
                                {pattern}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button onClick={handleApplyFilters} className="group relative h-12 overflow-hidden rounded-md bg-gray-400 px-8 py-2 text-neutral-50">
                        <span className="relative z-10">Aplicar Filtros</span>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                            <span className="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-gray-500 transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span>
                        </span>
                    </button>

                </div>

            </div>
        </div>
    );
}

export default FiltroModal;