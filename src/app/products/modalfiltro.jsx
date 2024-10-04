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

    const [collectionSearch, setCollectionSearch] = useState('');
    const [fabricTypeSearch, setFabricTypeSearch] = useState('');
    const [fabricPatternSearch, setFabricPatternSearch] = useState('');

    const [activeTab, setActiveTab] = useState('marcas');

    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/filters`);
                if (!response.ok) throw new Error('Error fetching filters');
                const data = await response.json();

                setBrands(filterValidData(data.brands, ["ARE", "HAR", "FLA", "CJM", "BAS"]));
                setCollections(filterValidData(data.collections));
                setFabricTypes(filterValidData(data.fabricTypes));
                setFabricPatterns(filterValidData(data.fabricPatterns));
                setMartindaleValues(data.martindaleValues.filter(value => value).sort((a, b) => b - a));
                setColors(filterValidData(data.colors).filter(color => allowedColors.includes(color.toUpperCase())));
            } catch (error) {
                console.error('Error fetching filters:', error);
            }
        };

        fetchData();
    }, []);

    const filterValidData = (data, validOptions = []) => {
        const hasTilde = str => /[áéíóúÁÉÍÓÚ]/.test(str); // Verifica si hay tildes
        return [...new Set(data.filter(item =>
            item &&
            (!validOptions.length || validOptions.includes(item)) &&
            !item.includes(";") && // Excluye nombres que contengan ";"
            item === item.toUpperCase() && // Excluye nombres en minúsculas
            !hasTilde(item) // Excluye nombres que contengan tildes
        ))];
    };

    const handleApplyFilters = () => {
        const filtersToApply = {
            brand: selectedBrands,
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
            setSelected(selected.filter(item => item !== value));
        } else {
            setSelected([...selected, value]);
        }
    };

    const removeSelectedItem = (setSelected, selected, value) => {
        setSelected(selected.filter(item => item !== value));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            {/* Mantener el tamaño fijo y ocupar todo el espacio */}
            <div className="bg-white p-6 rounded-lg w-full max-w-[90%] lg:max-w-[70%] max-h-[95%]  overflow-y-auto">
                <h2 className="text-center text-2xl font-bold">FILTROS</h2>
                <div className="flex justify-end">
                    <button className="relative overflow-hidden m-4" onClick={close}>
                        <img src="close.svg" className='w-6 h-6 hover:scale-125 duration-200 justify-end' alt="Cerrar" />
                    </button>
                </div>

                {/* Filtros seleccionados */}
                <div className="mb-4 flex items-center flex-wrap">
                    <h3 className="text-lg font-semibold mr-2">Filtros seleccionados:</h3>
                    <div className="flex flex-wrap">
                        {selectedBrands.map((item, index) => (
                            <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                {item} <button onClick={() => removeSelectedItem(setSelectedBrands, selectedBrands, item)} className="ml-2">X</button>
                            </span>
                        ))}
                        {selectedColors.map((item, index) => (
                            <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                {item} <button onClick={() => removeSelectedItem(setSelectedColors, selectedColors, item)} className="ml-2">X</button>
                            </span>
                        ))}
                        {selectedCollections.map((item, index) => (
                            <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                {item} <button onClick={() => removeSelectedItem(setSelectedCollections, selectedCollections, item)} className="ml-2">X</button>
                            </span>
                        ))}
                        {selectedFabricTypes.map((item, index) => (
                            <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                {item} <button onClick={() => removeSelectedItem(setSelectedFabricTypes, selectedFabricTypes, item)} className="ml-2">X</button>
                            </span>
                        ))}
                        {selectedFabricPatterns.map((item, index) => (
                            <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                {item} <button onClick={() => removeSelectedItem(setSelectedFabricPatterns, selectedFabricPatterns, item)} className="ml-2">X</button>
                            </span>
                        ))}
                        {selectedMartindale.map((item, index) => (
                            <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                {item} <button onClick={() => removeSelectedItem(setSelectedMartindale, selectedMartindale, item)} className="ml-2">X</button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* TabPanel */}
                <div className="mb-4 flex justify-around border-b-2 border-gray-300 overflow-x-auto">
                    <button className={`py-2 px-4 flex-shrink-0 ${activeTab === 'marcas' ? 'border-b-4 border-blue-500' : ''}`} onClick={() => setActiveTab('marcas')}>Marcas</button>
                    <button className={`py-2 px-4 flex-shrink-0 ${activeTab === 'colores' ? 'border-b-4 border-blue-500' : ''}`} onClick={() => setActiveTab('colores')}>Colores</button>
                    <button className={`py-2 px-4 flex-shrink-0 ${activeTab === 'colecciones' ? 'border-b-4 border-blue-500' : ''}`} onClick={() => setActiveTab('colecciones')}>Colecciones</button>
                    <button className={`py-2 px-4 flex-shrink-0 ${activeTab === 'tela' ? 'border-b-4 border-blue-500' : ''}`} onClick={() => setActiveTab('tela')}>Tipos de Tela</button>
                    <button className={`py-2 px-4 flex-shrink-0 ${activeTab === 'dibujo' ? 'border-b-4 border-blue-500' : ''}`} onClick={() => setActiveTab('dibujo')}>Dibujo de Tela</button>
                    <button className={`py-2 px-4 flex-shrink-0 ${activeTab === 'martindale' ? 'border-b-4 border-blue-500' : ''}`} onClick={() => setActiveTab('martindale')}>Martindale</button>
                </div>

                {/* Tab Content con altura fija y scroll */}
                <div className="h-[350px] overflow-y-auto"> {/* h-64 es un ejemplo, puedes ajustar la altura según tus necesidades */}
                    {activeTab === 'marcas' && (
                        <FilterSection
                            title="Marcas"
                            items={brands}
                            selectedItems={selectedBrands}
                            handleCheckboxChange={handleCheckboxChange}
                            setSelected={setSelectedBrands}
                        />
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
                    {activeTab === 'colecciones' && (
                        <FilterSection
                            title="Colecciones"
                            items={collections}
                            selectedItems={selectedCollections}
                            handleCheckboxChange={handleCheckboxChange}
                            setSelected={setSelectedCollections}
                        />
                    )}
                    {activeTab === 'tela' && (
                        <FilterSection
                            title="Tipos de Tela"
                            items={fabricTypes}
                            selectedItems={selectedFabricTypes}
                            handleCheckboxChange={handleCheckboxChange}
                            setSelected={setSelectedFabricTypes}
                        />
                    )}
                    {activeTab === 'dibujo' && (
                        <FilterSection
                            title="Dibujo de la Tela"
                            items={fabricPatterns}
                            selectedItems={selectedFabricPatterns}
                            handleCheckboxChange={handleCheckboxChange}
                            setSelected={setSelectedFabricPatterns}
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


                <div className="mt-4 flex justify-end">
                    <button onClick={handleApplyFilters} className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
}
const brandDisplayNames = {
    ARE: "ARENA",
    HAR: "HARBOUR",
    FLA: "FLAMENCO",
    CJM: "CJM",
    BAS: "BASSARI",
    // Agrega más marcas según lo que necesites
};

// Componente reutilizable para las secciones de filtro
function FilterSection({ title, items, selectedItems, handleCheckboxChange, setSelected, searchPlaceholder, searchValue, setSearchValue }) {
    return (
        <div className='overflow-y-auto flex flex-col border-2 border-gray-300 rounded-md p-3'>
            <h3 className="font-semibold mx-auto">{title}</h3>
            {searchPlaceholder && (
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            )}
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-2">
                {items.map((item) => (
                    <label key={item} className="block ">
                        <input
                            type="checkbox"
                            name={title.toLowerCase()}
                            checked={selectedItems.includes(item)}
                            onChange={() => handleCheckboxChange(setSelected, selectedItems, item)}
                        />
                        {brandDisplayNames[item] || item} {/* Mostrar nombre alternativo si existe, si no el original */}
                    </label>
                ))}
            </div>

        </div>
    );
}

// Componente reutilizable para mostrar colores
function ColorGrid({ title, items, selectedItems, handleCheckboxChange, setSelected }) {
    return (
        <div className='overflow-y-auto flex flex-col border-2 border-gray-300 rounded-md p-3'>
            <h3 className="font-semibold mx-auto">{title}</h3>
            <div className="grid grid-cols-4 gap-2 mx-auto">
                {items.map((item) => (
                    <div
                        key={item}
                        className={`w-10 h-10 hover:scale-105 duration-200 cursor-pointer flex items-center justify-center ${selectedItems.includes(item) ? 'ring-2 ring-white' : ''}`}
                        style={{ backgroundColor: getColor(item), border: item.toUpperCase() === 'BLANCO' ? '1px solid #D1D1D1' : 'none' }}
                        onClick={() => handleCheckboxChange(setSelected, selectedItems, item)}
                    >
                        {selectedItems.includes(item) && (
                            <div className="w-10 h-10 border-2 border-black"></div>
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
