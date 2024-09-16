import { useState, useEffect } from 'react';

function FiltroModal({ isOpen, close, applyFilters, currentFilters }) {
    // Colores principales permitidos
    const allowedColors = ['GRIS', 'NEGRO', 'VERDE', 'BEIGE', 'BLANCO', 'MARRON', 'AZUL', 'AMARILLO', 'NARANJA', 'ROJO', 'MORADO', 'VIOLETA', 'ROSA'];

    // Filtros seleccionados por el usuario
    const [selectedBrands, setSelectedBrands] = useState(currentFilters?.brand || []);
    const [selectedColors, setSelectedColors] = useState(currentFilters?.color || []);
    const [selectedCollections, setSelectedCollections] = useState(currentFilters?.collection || []);
    const [selectedFabricTypes, setSelectedFabricTypes] = useState(currentFilters?.fabricType || []);
    const [selectedFabricPatterns, setSelectedFabricPatterns] = useState(currentFilters?.fabricPattern || []);
    const [selectedMartindale, setSelectedMartindale] = useState(currentFilters?.martindale || []);

    // Datos de filtros para mostrar en el modal
    const [brands, setBrands] = useState([]);
    const [collections, setCollections] = useState([]);
    const [fabricTypes, setFabricTypes] = useState([]);
    const [fabricPatterns, setFabricPatterns] = useState([]);
    const [martindaleValues, setMartindaleValues] = useState([]);
    const [colors, setColors] = useState([]);

    // Campos de búsqueda
    const [collectionSearch, setCollectionSearch] = useState('');
    const [fabricTypeSearch, setFabricTypeSearch] = useState('');
    const [fabricPatternSearch, setFabricPatternSearch] = useState('');

    // Función para cargar los datos de los filtros desde el backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/filters`);
                if (!response.ok) {
                    throw new Error('Error fetching filters');
                }
                const data = await response.json();

                setBrands(filterValidData(data.brands, ["ARE", "HAR", "FLA", "CJM"])); // Filtrar por marcas específicas
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

    // Función para procesar datos válidos (sin duplicados ni valores vacíos)
    const filterValidData = (data, validOptions = []) => {
        return [...new Set(data.filter(item => item && (!validOptions.length || validOptions.includes(item))))];
    };

    // Aplicar los filtros seleccionados
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
        close(); // Cerrar el modal después de aplicar filtros
    };

    // Función para manejar la selección de checkboxes
    const handleCheckboxChange = (setSelected, selected, value) => {
        if (selected.includes(value)) {
            setSelected(selected.filter(item => item !== value));
        } else {
            setSelected([...selected, value]);
        }
    };

    // Filtro basado en el campo de búsqueda, validando que el item sea una cadena
    const filterItems = (items, search) => {
        return items.filter(item => typeof item === 'string' && item.toLowerCase().includes(search.toLowerCase()));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg xl:max-w-[70%] max-w-[90%] h-[95%] w-full m-4 overflow-y-auto">
                <h2 className="text-center text-2xl font-bold">FILTROS</h2>
                <div className="flex justify-end">
                    <button className="relative overflow-hidden m-4" onClick={close}>
                        <img src="close.svg" className='w-6 h-6 hover:scale-125 duration-200 justify-end' />
                    </button>
                </div>
                <div className='grid xl:grid-cols-4 md:grid-cols-2 gap-3 gap-y-6'>
                    {/* Marcas */}
                    <FilterSection
                        title="Marcas"
                        items={brands}
                        selectedItems={selectedBrands}
                        handleCheckboxChange={handleCheckboxChange}
                        setSelected={setSelectedBrands}
                    />

                    {/* Colecciones */}
                    <FilterSection
                        title="Colecciones"
                        items={filterItems(collections, collectionSearch)}
                        selectedItems={selectedCollections}
                        handleCheckboxChange={handleCheckboxChange}
                        setSelected={setSelectedCollections}
                        searchPlaceholder="Buscar Colección"
                        searchValue={collectionSearch}
                        setSearchValue={setCollectionSearch}
                    />

                    {/* Colores */}
                    <ColorGrid
                        title="Colores"
                        items={colors}
                        selectedItems={selectedColors}
                        handleCheckboxChange={handleCheckboxChange}
                        setSelected={setSelectedColors}
                    />

                    {/* Tipos de Tela */}
                    <FilterSection
                        title="Tipos de Tela"
                        items={filterItems(fabricTypes, fabricTypeSearch)}
                        selectedItems={selectedFabricTypes}
                        handleCheckboxChange={handleCheckboxChange}
                        setSelected={setSelectedFabricTypes}
                        searchPlaceholder="Buscar Tipo de Tela"
                        searchValue={fabricTypeSearch}
                        setSearchValue={setFabricTypeSearch}
                    />

                    {/* Dibujo de la Tela */}
                    <FilterSection
                        title="Dibujo de la Tela"
                        items={filterItems(fabricPatterns, fabricPatternSearch)}
                        selectedItems={selectedFabricPatterns}
                        handleCheckboxChange={handleCheckboxChange}
                        setSelected={setSelectedFabricPatterns}
                        searchPlaceholder="Buscar Dibujo de la Tela"
                        searchValue={fabricPatternSearch}
                        setSearchValue={setFabricPatternSearch}
                    />

                    {/* Martindale (sin buscador) */}
                    <FilterSection
                        title="Martindale"
                        items={martindaleValues}
                        selectedItems={selectedMartindale}
                        handleCheckboxChange={handleCheckboxChange}
                        setSelected={setSelectedMartindale}
                    />
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

// Componente reutilizable para las secciones de filtro con búsqueda
function FilterSection({ title, items, selectedItems, handleCheckboxChange, setSelected, searchPlaceholder, searchValue, setSearchValue }) {
    return (
        <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
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
            <div>
                {items.map((item) => (
                    <label key={item} className="block">
                        <input
                            type="checkbox"
                            name={title.toLowerCase()}
                            checked={selectedItems.includes(item)}
                            onChange={() => handleCheckboxChange(setSelected, selectedItems, item)}
                        />
                        {item}
                    </label>
                ))}
            </div>
        </div>
    );
}

// Componente reutilizable para mostrar colores
function ColorGrid({ title, items, selectedItems, handleCheckboxChange, setSelected }) {
    return (
        <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
            <h3 className="font-semibold mx-auto">{title}</h3>
            <div className="grid xl:grid-cols-4 grid-cols-3 gap-2 mx-auto">
                {items.map((item) => (
                    <div
                        key={item}
                        className={`w-10 h-10 hover:scale-105 duration-200 cursor-pointer flex items-center justify-center ${selectedItems.includes(item) ? 'ring-2 ring-white' : ''}`}
                        style={{ backgroundColor: getColor(item), border: item.toUpperCase() === 'BLANCO' ? '1px solid #D1D1D1' : 'none' }} // Borde gris claro para color blanco
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
