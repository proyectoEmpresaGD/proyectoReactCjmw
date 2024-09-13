import { useState, useEffect } from 'react';

function FiltroModal({ isOpen, close, applyFilters, currentFilters }) {
    // Filtros seleccionados por el usuario
    const [selectedBrands, setSelectedBrands] = useState(currentFilters?.brand || []);
    const [selectedColors, setSelectedColors] = useState(currentFilters?.color || []);
    const [selectedCollections, setSelectedCollections] = useState(currentFilters?.collection || []);
    const [selectedFabricTypes, setSelectedFabricTypes] = useState(currentFilters?.fabricType || []);
    const [selectedFabricPatterns, setSelectedFabricPatterns] = useState(currentFilters?.fabricPattern || []);
    const [selectedTonalidades, setSelectedTonalidades] = useState(currentFilters?.tonalidad || []);
    const [selectedMartindale, setSelectedMartindale] = useState(currentFilters?.martindale || []);

    // Datos de filtros para mostrar en el modal
    const [brands, setBrands] = useState([]);
    const [collections, setCollections] = useState([]);
    const [fabricTypes, setFabricTypes] = useState([]);
    const [fabricPatterns, setFabricPatterns] = useState([]);
    const [martindaleValues, setMartindaleValues] = useState([]);
    const [colors, setColors] = useState([]);
    const [tonalidades, setTonalidades] = useState([]);

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
                setColors(filterValidData(data.colors));
                setTonalidades(filterValidData(data.tonalidades));
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
            tonalidad: selectedTonalidades,
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
                        items={collections}
                        selectedItems={selectedCollections}
                        handleCheckboxChange={handleCheckboxChange}
                        setSelected={setSelectedCollections}
                        searchPlaceholder="Buscar Colección"
                    />

                    {/* Tonalidades */}
                    <ColorGrid
                        title="Tonalidad"
                        items={tonalidades}
                        selectedItems={selectedTonalidades}
                        handleCheckboxChange={handleCheckboxChange}
                        setSelected={setSelectedTonalidades}
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
                        items={fabricTypes}
                        selectedItems={selectedFabricTypes}
                        handleCheckboxChange={handleCheckboxChange}
                        setSelected={setSelectedFabricTypes}
                    />

                    {/* Dibujo de la Tela */}
                    <FilterSection
                        title="Dibujo de la Tela"
                        items={fabricPatterns}
                        selectedItems={selectedFabricPatterns}
                        handleCheckboxChange={handleCheckboxChange}
                        setSelected={setSelectedFabricPatterns}
                    />

                    {/* Martindale */}
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

// Componente reutilizable para las secciones de filtro
function FilterSection({ title, items, selectedItems, handleCheckboxChange, setSelected, searchPlaceholder }) {
    return (
        <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
            <h3 className="font-semibold mx-auto">{title}</h3>
            {searchPlaceholder && (
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
                    placeholder={searchPlaceholder}
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

// Componente reutilizable para mostrar colores o tonalidades
function ColorGrid({ title, items, selectedItems, handleCheckboxChange, setSelected }) {
    return (
        <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
            <h3 className="font-semibold mx-auto">{title}</h3>
            <div className="grid xl:grid-cols-4 grid-cols-3 gap-2 mx-auto">
                {items.map((item) => (
                    <div
                        key={item}
                        className={`w-10 h-10 hover:scale-105 duration-200 cursor-pointer flex items-center justify-center ${selectedItems.includes(item) ? 'ring-2 ring-white' : ''}`}
                        style={{ backgroundColor: item }}
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

export default FiltroModal;
