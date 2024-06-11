import { useState, useEffect } from 'react';

function FiltroModal({ isOpen, close, applyFilters }) {
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedFabricTypes, setSelectedFabricTypes] = useState([]);
    const [selectedFabricPatterns, setSelectedFabricPatterns] = useState([]);
    const [selectedTonalidades, setSelectedTonalidades] = useState([]);
    const [selectedMartindale, setSelectedMartindale] = useState([]);
    const [selectedUso, setSelectedUso] = useState([]);

    const [brands, setBrands] = useState([]);
    const [collections, setCollections] = useState([]);
    const [fabricTypes, setFabricTypes] = useState([]);
    const [fabricPatterns, setFabricPatterns] = useState([]);
    const [martindaleValues, setMartindaleValues] = useState([]);
    const [usoValues, setUsoValues] = useState([]);
    const [colors, setColors] = useState([]);
    const [tonalidades, setTonalidades] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/filters`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched data:', data);

                const filteredBrands = data.brands.filter(brand => brand && ["ARE", "HAR", "FLA", "CJM"].includes(brand));
                const filteredCollections = data.collections.filter(collection => collection);
                const filteredFabricTypes = data.fabricTypes.filter(type => type);
                const filteredFabricPatterns = data.fabricPatterns.filter(pattern => pattern);
                const sortedMartindaleValues = data.martindaleValues.filter(value => value).sort((a, b) => b - a);
                const filteredUsoValues = data.usoValues.filter(uso => uso);
                const filteredColors = data.colors.filter(color => color);
                const filteredTonalidades = data.tonalidades.filter(tonalidad => tonalidad);

                setBrands(processData(filteredBrands));
                setCollections(processData(filteredCollections));
                setFabricTypes(processData(filteredFabricTypes));
                setFabricPatterns(processData(filteredFabricPatterns));
                setMartindaleValues(sortedMartindaleValues);
                setUsoValues(filteredUsoValues);
                setColors(processData(filteredColors));
                setTonalidades(processData(filteredTonalidades));
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []);

    const processData = (data) => {
        const processedData = [];
        const seenValues = new Set();

        data.forEach(item => {
            const value = item.split(';')[0].trim();
            if (!seenValues.has(value)) {
                seenValues.add(value);
                processedData.push(value);
            }
        });

        return processedData;
    };

    const handleApplyFilters = () => {
        const filtersToApply = {
            brand: selectedBrands,
            color: selectedColors,
            collection: selectedCollections,
            fabricType: selectedFabricTypes,
            fabricPattern: selectedFabricPatterns,
            tonalidad: selectedTonalidades,
            martindale: selectedMartindale,
            uso: selectedUso
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg xl:max-w-[70%] max-w-[90%] h-[80%] w-full m-4 overflow-y-auto ">
                <h2 className="text-center text-2xl font-bold">FILTROS</h2>
                <div className="flex justify-end">
                    <button className="relative overflow-hidden m-4" onClick={close}>
                        <img src="close.svg" className='w-6 h-6 hover:scale-125 duration-200 justify-end' />
                    </button>
                </div>
                <div className='grid xl:grid-cols-4 md:grid-cols-2 gap-3 gap-y-6'>
                    <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
                        <h3 className="font-semibold mx-auto">Marcas</h3>
                        <div className='grid grid-cols-2'>
                            {brands.map((brand) => (
                                <label key={brand} className="block">
                                    <input
                                        type="checkbox"
                                        name="brand"
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => handleCheckboxChange(setSelectedBrands, selectedBrands, brand)}
                                    />
                                    {brand}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] lg:min-h-[250px] lg:max-h-[250px] max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
                        <h3 className="font-semibold mx-auto">Colecciones</h3>
                        <input type="text" id="input-group-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Buscar Colección" />
                        {collections.map((collection) => (
                            <label key={collection} className="block">
                                <input
                                    type="checkbox"
                                    name="collection"
                                    checked={selectedCollections.includes(collection)}
                                    onChange={() => handleCheckboxChange(setSelectedCollections, selectedCollections, collection)}
                                />
                                {collection}
                            </label>
                        ))}
                    </div>

                    <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] lg:min-h-[250px] lg:max-h-[250px] max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
                        <h3 className="font-semibold mx-auto">Tonalidad</h3>
                        <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-5 grid-cols-3 gap-2 mx-auto">
                            {tonalidades.map((tonalidad) => (
                                <div
                                    key={tonalidad}
                                    className={`w-10 h-10 hover:scale-105 duration-200 cursor-pointer flex items-center justify-center ${selectedTonalidades.includes(tonalidad) ? 'ring-2 ring-white' : ''}`}
                                    style={{ backgroundColor: tonalidad }}
                                    onClick={() => handleCheckboxChange(setSelectedTonalidades, selectedTonalidades, tonalidad)}
                                >
                                    {selectedTonalidades.includes(tonalidad) && (
                                        <div className="w-10 h-10 border-2 border-black"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] lg:min-h-[250px] lg:max-h-[250px] max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
                        <h3 className="font-semibold mx-auto">Colores principal</h3>
                        <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-5 grid-cols-3 gap-2 mx-auto">
                            {colors.map((color) => (
                                <div
                                    key={color}
                                    className={`w-10 h-10 hover:scale-105 duration-200 cursor-pointer flex items-center justify-center ${selectedColors.includes(color) ? 'ring-2 ring-white' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleCheckboxChange(setSelectedColors, selectedColors, color)}
                                >
                                    {selectedColors.includes(color) && (
                                        <div className="w-10 h-10 border-2 border-black"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] lg:min-h-[250px] lg:max-h-[250px] max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
                        <h3 className="font-semibold mx-auto">Tipo de Tela</h3>
                        <div className='grid grid-cols-2'>
                            {fabricTypes.map((type) => (
                                <label key={type} className="block">
                                    <input
                                        type="checkbox"
                                        name="fabricType"
                                        checked={selectedFabricTypes.includes(type)}
                                        onChange={() => handleCheckboxChange(setSelectedFabricTypes, selectedFabricTypes, type)}
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] lg:min-h-[250px] lg:max-h-[250px] max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
                        <h3 className="font-semibold mx-auto">Dibujo de la Tela</h3>
                        <div className='grid grid-cols-2'>
                            {fabricPatterns.map((pattern) => (
                                <label key={pattern} className="block">
                                    <input
                                        type="checkbox"
                                        name="fabricPattern"
                                        checked={selectedFabricPatterns.includes(pattern)}
                                        onChange={() => handleCheckboxChange(setSelectedFabricPatterns, selectedFabricPatterns, pattern)}
                                    />
                                    {pattern}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] lg:min-h-[250px] lg:max-h-[250px] max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
                        <h3 className='font-semibold mx-auto'>Martindale</h3>
                        <div className='grid grid-cols-2'>
                            {martindaleValues.map((value) => (
                                <label key={value} className="block">
                                    <input
                                        type="checkbox"
                                        name="martindale"
                                        checked={selectedMartindale.includes(value)}
                                        onChange={() => handleCheckboxChange(setSelectedMartindale, selectedMartindale, value)}
                                    />
                                    {value}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className='overflow-y-auto xl:min-h-[250px] xl:max-h-[250px] lg:min-h-[250px] lg:max-h-[250px] max-h-[250px] flex flex-col border-2 border-gray-300 rounded-md p-3 xl:pb-[10%]'>
                        <h3 className="font-semibold mx-auto">Uso</h3>
                        {usoValues.map((value) => (
                            <label key={value} className="block">
                                <input
                                    type="checkbox"
                                    name="uso"
                                    checked={selectedUso.includes(value)}
                                    onChange={() => handleCheckboxChange(setSelectedUso, selectedUso, value)}
                                />
                                {value}
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