import { useState, useEffect } from 'react';

function FiltroModal({ isOpen, close, applyFilters, currentFilters }) {
    const allowedColors = ['GRIS', 'NEGRO', 'VERDE', 'BEIGE', 'BLANCO', 'MARRON', 'AZUL', 'AMARILLO', 'NARANJA', 'ROJO', 'MORADO', 'VIOLETA', 'ROSA'];

    const [selectedBrands, setSelectedBrands] = useState(currentFilters?.brand || []);
    const [selectedColors, setSelectedColors] = useState(currentFilters?.color || []);
    const [selectedCollections, setSelectedCollections] = useState(currentFilters?.collection || []);
    const [selectedFabricTypes, setSelectedFabricTypes] = useState(currentFilters?.fabricType || []);
    const [selectedFabricPatterns, setSelectedFabricPatterns] = useState(currentFilters?.fabricPattern || []);
    const [selectedMartindale, setSelectedMartindale] = useState(currentFilters?.martindale || []);

    const [brands, setBrands] = useState([]);
    const [collections, setCollections] = useState([]);
    const [fabricTypes, setFabricTypes] = useState([]);
    const [fabricPatterns, setFabricPatterns] = useState([]);
    const [martindaleValues, setMartindaleValues] = useState([]);
    const [colors, setColors] = useState([]);

    const [activeTab, setActiveTab] = useState('marcas');

    // Estados de búsqueda
    const [collectionSearch, setCollectionSearch] = useState('');
    const [fabricTypeSearch, setFabricTypeSearch] = useState('');
    const [fabricPatternSearch, setFabricPatternSearch] = useState('');

    // Mapeo de códigos de marca a nombres visibles
    const brandNamesMap = {
        ARE: 'Arena',
        HAR: 'Harbour',
        FLA: 'Flamenco',
        CJM: 'CJM',
        BAS: 'Bassari',
    };

    const tiposInvalidos = ["JAQUARD", "TEJIDO ", "VISILLO FR", "TERCIOPLEO", "RAYA", "BUCLE", "PANA", "TEJIDO", "FALSO LISO", "PAPEL PARED", "TERCIOPELO FR", "FLORES", "ESTAMAPADO", "ESPIGA", "RAYAS"];
    const dibujosInvalidos = ["TELAS CON FLORES", "WALLCOVERING", "TERCIOPELO FR", "BLACKOUT", "RAFIA", "KILM", "RAYA", "IKAT ", "WALLPAPER", "FLORES", "ANIMAL", "LISOS", "ESTAMPADO", "GEOMETRICA", "ESPIGAS", "VISILLO", "TEJIDO", "TERCIOPELO", "PANA"];
    const coleccionesInvalidas = ["MARRAKECH","MARRAKESH"];
    useEffect(() => {
        fetchAllFilters();  // Fetch inicial
    }, []);

    const fetchAllFilters = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/filters`);
            if (!response.ok) throw new Error('Error fetching filters');
            const data = await response.json();

            setBrands(filterValidData(data.brands, Object.keys(brandNamesMap)));
            setCollections(filterValidData(data.collections, [], coleccionesInvalidas));
            setFabricTypes(filterValidData(data.fabricTypes, [], tiposInvalidos));
            setFabricPatterns(filterValidData(data.fabricPatterns, [], dibujosInvalidos));
            setMartindaleValues(data.martindaleValues.filter(value => value).sort((a, b) => b - a));
            setColors(filterValidData(data.colors).filter(color => allowedColors.includes(color.toUpperCase())));
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    };

    const filterValidData = (data, validOptions = [], invalidOptions = []) => {
        const hasTilde = str => /[áéíóúÁÉÍÓÚ]/.test(str);
        return [...new Set(data.filter(item =>
            item &&
            (!validOptions.length || validOptions.includes(item)) &&
            (!invalidOptions.length || !invalidOptions.includes(item)) &&
            !item.includes(";") &&
            item === item.toUpperCase() &&
            !hasTilde(item)
        ))];
    };

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isOpen]);

    // Actualizar filtros según la marca seleccionada
    const updateFiltersByBrand = async (brand) => {
        const brandCode = Object.keys(brandNamesMap).find(key => brandNamesMap[key] === brand) || brand;
        if (brandCode) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/filtersByBrand?brand=${brandCode}`);
                if (!response.ok) throw new Error('Error fetching brand-specific filters');
                const data = await response.json();

                // Filtrar los datos obtenidos por la marca seleccionada
                setCollections(filterValidData(data.collections, [], coleccionesInvalidas));
                setFabricTypes(filterValidData(data.fabricTypes, [], tiposInvalidos));
                setFabricPatterns(filterValidData(data.fabricPatterns, [], dibujosInvalidos));
                setMartindaleValues(data.martindaleValues.filter(value => value).sort((a, b) => b - a));
            } catch (error) {
                console.error('Error fetching filters by brand:', error);
            }
        } else {
            fetchAllFilters();
        }
    };

    const handleApplyFilters = () => {
        const filtersToApply = {
            brand: selectedBrands.map(brand => Object.keys(brandNamesMap).find(key => brandNamesMap[key] === brand) || brand),
            color: selectedColors,
            collection: selectedCollections,
            fabricType: selectedFabricTypes,
            fabricPattern: selectedFabricPatterns,
            martindale: selectedMartindale,
        };
        applyFilters(filtersToApply);
        close();
    };

    const handleCheckboxChange = (setSelected, selected, value) => {
        if (selected.includes(value)) {
            const updatedSelection = selected.filter(item => item !== value);
            setSelected(updatedSelection);

            if (setSelected === setSelectedBrands && updatedSelection.length === 0) {
                updateFiltersByBrand(null);
            }
        } else {
            setSelected([...selected, value]);
            if (setSelected === setSelectedBrands) {
                updateFiltersByBrand(value);
            }
        }
    };

    const removeSelectedItem = (setSelected, selected, value) => {
        const updatedSelection = selected.filter(item => item !== value);
        setSelected(updatedSelection);

        if (setSelected === setSelectedBrands && updatedSelection.length === 0) {
            updateFiltersByBrand(null);
        }
    };

    // Filtrar colecciones, tipos de tela, y patrones de tela según el término de búsqueda
    const filteredCollections = collections.filter(collection => collection.toLowerCase().includes(collectionSearch.toLowerCase()));
    const filteredFabricTypes = fabricTypes.filter(fabricType => fabricType.toLowerCase().includes(fabricTypeSearch.toLowerCase()));
    const filteredFabricPatterns = fabricPatterns.filter(fabricPattern => fabricPattern.toLowerCase().includes(fabricPatternSearch.toLowerCase()));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center transition-all ease-in-out duration-300">
            <div className="bg-white p-6 rounded-lg w-full max-w-[90%] lg:max-w-[70%] max-h-[95%] overflow-y-auto shadow-lg border border-gray-200">
                <div className="relative flex items-center justify-between">
                    <h2 className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-semibold mb-4 text-gray-700">
                        FILTROS
                    </h2>
                    <button className="ml-auto relative overflow-hidden m-4" onClick={close}>
                        <img src="close.svg" className="w-6 h-6 hover:scale-125 transition-transform duration-200" alt="Cerrar" />
                    </button>
                </div>

                {/* Filtros seleccionados */}
                <div className="mb-4 flex items-center flex-wrap border-b pb-2 border-gray-300">
                    <h3 className="text-lg font-semibold mr-2 text-gray-600">Filtros seleccionados:</h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedBrands.map((item, index) => (
                            <FilterTag key={index} item={item} onRemove={() => removeSelectedItem(setSelectedBrands, selectedBrands, item)} />
                        ))}
                        {selectedColors.map((item, index) => (
                            <FilterTag key={index} item={item} onRemove={() => removeSelectedItem(setSelectedColors, selectedColors, item)} />
                        ))}
                        {selectedCollections.map((item, index) => (
                            <FilterTag key={index} item={item} onRemove={() => removeSelectedItem(setSelectedCollections, selectedCollections, item)} />
                        ))}
                        {selectedFabricTypes.map((item, index) => (
                            <FilterTag key={index} item={item} onRemove={() => removeSelectedItem(setSelectedFabricTypes, selectedFabricTypes, item)} />
                        ))}
                        {selectedFabricPatterns.map((item, index) => (
                            <FilterTag key={index} item={item} onRemove={() => removeSelectedItem(setSelectedFabricPatterns, selectedFabricPatterns, item)} />
                        ))}
                        {selectedMartindale.map((item, index) => (
                            <FilterTag key={index} item={item} onRemove={() => removeSelectedItem(setSelectedMartindale, selectedMartindale, item)} />
                        ))}
                    </div>
                </div>

                {/* TabPanel */}
                <div className="mb-4 flex justify-around border-b-2 border-gray-300 overflow-x-auto text-gray-600">
                    <button className={`py-2 px-4 flex-shrink-0 ${activeTab === 'marcas' ? 'border-b-4 border-[#D2B48C]' : ''}`} onClick={() => setActiveTab('marcas')}>Marcas</button>
                    <button className={`py-2 px-4 flex-shrink-0 ${activeTab === 'colecciones' ? 'border-b-4 border-[#D2B48C]' : ''}`} onClick={() => setActiveTab('colecciones')}>Colecciones</button>
                    <button className={`py-2 px-4 flex-shrink-0 ${activeTab === 'dibujo' ? 'border-b-4 border-[#D2B48C]' : ''}`} onClick={() => setActiveTab('dibujo')}>Dibujo de Tela</button>
                    <button className={`py-2 px-4 flex-shrink-0 ${activeTab === 'tela' ? 'border-b-4 border-[#D2B48C]' : ''}`} onClick={() => setActiveTab('tela')}>Tipos de Tela</button>
                    <button className={`py-2 px-4 flex-shrink-0 ${activeTab === 'colores' ? 'border-b-4 border-[#D2B48C]' : ''}`} onClick={() => setActiveTab('colores')}>Colores</button>
                    <button className={`py-2 px-4 flex-shrink-0 ${activeTab === 'martindale' ? 'border-b-4 border-[#D2B48C]' : ''}`} onClick={() => setActiveTab('martindale')}>Martindale</button>
                </div>

                <div className="sm:hidden text-center text-sm text-gray-500">Desliza hacia los lados para ver más opciones</div>

                {/* Tab Content */}
                <div className="h-[350px] overflow-y-auto">
                    {activeTab === 'marcas' && (
                        <FilterSection
                            title="Marcas"
                            items={brands.map(brand => brandNamesMap[brand] || brand)}
                            selectedItems={selectedBrands}
                            handleCheckboxChange={handleCheckboxChange}
                            setSelected={setSelectedBrands}
                        />
                    )}
                    {activeTab === 'colecciones' && (
                        <>
                            <input
                                type="text"
                                placeholder="Buscar colecciones..."
                                value={collectionSearch}
                                onChange={(e) => setCollectionSearch(e.target.value)}
                                className="mb-4 p-2 border rounded-md w-full"
                            />
                            <FilterSection
                                title="Colecciones"
                                items={filteredCollections}
                                selectedItems={selectedCollections}
                                handleCheckboxChange={handleCheckboxChange}
                                setSelected={setSelectedCollections}
                            />
                        </>
                    )}
                    {activeTab === 'dibujo' && (
                        <>
                            <input
                                type="text"
                                placeholder="Buscar dibujos..."
                                value={fabricPatternSearch}
                                onChange={(e) => setFabricPatternSearch(e.target.value)}
                                className="mb-4 p-2 border rounded-md w-full"
                            />
                            <FilterSection
                                title="Dibujo de la Tela"
                                items={filteredFabricPatterns}
                                selectedItems={selectedFabricPatterns}
                                handleCheckboxChange={handleCheckboxChange}
                                setSelected={setSelectedFabricPatterns}
                            />
                        </>
                    )}
                    {activeTab === 'tela' && (
                        <>
                            <input
                                type="text"
                                placeholder="Buscar tipos de tela..."
                                value={fabricTypeSearch}
                                onChange={(e) => setFabricTypeSearch(e.target.value)}
                                className="mb-4 p-2 border rounded-md w-full"
                            />
                            <FilterSection
                                title="Tipos de Tela"
                                items={filteredFabricTypes}
                                selectedItems={selectedFabricTypes}
                                handleCheckboxChange={handleCheckboxChange}
                                setSelected={setSelectedFabricTypes}
                            />
                        </>
                    )}
                    {activeTab === 'colores' && (
                        <ColorGrid
                            title="Colores"
                            items={colors}
                            selectedItems={selectedColors}
                            handleCheckboxChange={handleCheckboxChange}
                            setSelected={setSelectedColors}
                        />
                    )}
                    {activeTab === 'martindale' && (
                        <FilterSection
                            title="Martindale"
                            items={martindaleValues}
                            selectedItems={selectedMartindale}
                            handleCheckboxChange={handleCheckboxChange}
                            setSelected={setSelectedMartindale}
                        />
                    )}
                </div>

                <div className="mt-4 flex justify-center">
                    <button onClick={handleApplyFilters} className="bg-[#D2B48C] w-[100%] lg:w-[30%] hover:bg-[#C19A6B] text-white font-bold py-2 px-6 rounded-md shadow-md transition-all duration-200 transform">
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
}

// Componente reutilizable para los tags de filtros seleccionados
function FilterTag({ item, onRemove }) {
    return (
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 transition-colors hover:bg-gray-300">
            {item} <button onClick={onRemove} className="ml-2 text-gray-500 hover:text-gray-700">X</button>
        </span>
    );
}

// Componente reutilizable para las secciones de filtro
function FilterSection({ title, items, selectedItems, handleCheckboxChange, setSelected }) {
    return (
        <div className="overflow-y-auto flex flex-col border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-semibold mx-auto mb-3 text-lg text-gray-600">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                    <label key={item} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name={title.toLowerCase()}
                            checked={selectedItems.includes(item)}
                            onChange={() => handleCheckboxChange(setSelected, selectedItems, item)}
                            className="appearance-none checked:bg-[#D2B48C] border-2 border-gray-400 checked:border-none rounded-full w-5 h-5 transition duration-200 ease-in-out"
                        />
                        <span className="text-gray-700 break-words w-full max-w-[150px]">
                            {item}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}

// Componente reutilizable para mostrar colores
function ColorGrid({ title, items, selectedItems, handleCheckboxChange, setSelected }) {
    return (
        <div className="overflow-y-auto flex flex-col border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-semibold mx-auto mb-3 text-lg text-gray-600">{title}</h3>
            <div className="grid grid-cols-4 gap-4 mx-auto">
                {items.map((item) => (
                    <div
                        key={item}
                        className={`w-10 h-10 cursor-pointer flex items-center justify-center transition duration-300 transform hover:scale-105 ${selectedItems.includes(item) ? 'ring-4 ring-[#D2B48C] scale-110' : ''}`}
                        style={{ backgroundColor: getColor(item), border: item.toUpperCase() === 'BLANCO' ? '1px solid #D1D1D1' : 'none' }}
                        onClick={() => handleCheckboxChange(setSelected, selectedItems, item)}
                    >
                        {selectedItems.includes(item) && (
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Función para obtener el color hexadecimal
const getColor = (colorName) => {
    const colors = {
        GRIS: '#808080',
        NEGRO: '#000000',
        VERDE: '#008000',
        BEIGE: '#F5F5DC',
        BLANCO: '#FFFFFF',
        MARRON: '#A52A2A',
        AZUL: '#0000FF',
        AMARILLO: '#FFFF00',
        NARANJA: '#FFA500',
        ROJO: '#FF0000',
        MORADO: '#800080',
        VIOLETA: '#EE82EE',
        ROSA: '#FFC0CB',
    };
    return colors[colorName.toUpperCase()] || '#000000';
};

export default FiltroModal;
