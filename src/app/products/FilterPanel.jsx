// src/components/FilterPanel.jsx
import { useState, useEffect } from 'react';
import {
    FaTimes,
    FaSearch,
    FaTrashAlt,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';

const BRAND_NAMES = {
    ARE: 'Arena',
    HAR: 'Harbour',
    FLA: 'Flamenco',
    CJM: 'CJM',
    BAS: 'Bassari'
};
const TIPOS_INVALIDOS = ["JAQUARD", "TEJIDO ", "VISILLO FR", "TERCIOPELO", "RAYA", "BUCLE", "PANA", "TEJIDO", "FALSO LISO", "PAPEL PARED", "TERCIOPELO FR", "FLORES", "ESTAMAPADO", "ESPIGA", "RAYAS"];
const DIBUJOS_INVALIDOS = ["TELAS CON FLORES", "WALLCOVERING", "TERCIOPELO FR", "BLACKOUT", "RAFIA", "KILM", "RAYA", "IKAT ", "WALLPAPER", "FLORES", "ANIMAL", "LISOS", "ESTAMPADO", "GEOMETRICA", "ESPIGAS", "VISILLO", "TEJIDO", "TERCIOPELO", "PANA"];
const COLEC_INVALIDAS = ["MARRAKECH", "MARRAKESH"];
const ALLOWED_COLORS = ['GRIS', 'NEGRO', 'VERDE', 'BEIGE', 'BLANCO', 'MARRON', 'AZUL', 'AMARILLO', 'NARANJA', 'ROJO', 'MORADO', 'VIOLETA', 'ROSA'];

const COLOR_MAP = {
    GRIS: '#808080', NEGRO: '#000000', VERDE: '#008000', BEIGE: '#F5F5DC',
    BLANCO: '#FFFFFF', MARRON: '#A52A2A', AZUL: '#0000FF', AMARILLO: '#FFFF00',
    NARANJA: '#FFA500', ROJO: '#FF0000', MORADO: '#800080', VIOLETA: '#EE82EE',
    ROSA: '#FFC0CB'
};

// Rango fijos para Martindale
const MARTINDALE_RANGES = [
    { key: '0-20000', label: 'Uso cortinaje de 0 a 20 000' },
    { key: '20000-50000', label: 'Tapiceria decorativa de 20 000 a 50 000' },
    { key: '50000-100000', label: 'tapiceria residencial de 50 000 a 100 000' },
    { key: '100000+', label: 'tapieria alto transito de 100 000 >' }
];

export default function FilterPanel({ isOpen, close, applyFilters, currentFilters }) {
    // selección
    const [brandsSel, setBrandsSel] = useState(currentFilters?.brand || []);
    const [colorsSel, setColorsSel] = useState(currentFilters?.color || []);
    const [collectionsSel, setCollectionsSel] = useState(currentFilters?.collection || []);
    const [typesSel, setTypesSel] = useState(currentFilters?.fabricType || []);
    const [patternsSel, setPatternsSel] = useState(currentFilters?.fabricPattern || []);
    const [martSel, setMartSel] = useState(currentFilters?.martindale || []);

    // opciones dinámicas
    const [brands, setBrands] = useState([]);
    const [collections, setCollections] = useState([]);
    const [fabricTypes, setFabricTypes] = useState([]);
    const [fabricPatterns, setFabricPatterns] = useState([]);
    const [martindaleValues, setMartindale] = useState([]); // valores numéricos reales
    const [colors, setColors] = useState([]);

    // búsquedas internas
    const [collSearch, setCollSearch] = useState('');
    const [typeSearch, setTypeSearch] = useState('');
    const [patternSearch, setPatternSearch] = useState('');

    // acordeones
    const [openSections, setOpenSections] = useState({
        marcas: true,
        colecciones: true,
        tipos: true,
        dibujo: true,
        colores: true,
        martindale: true
    });

    // carga al abrir
    useEffect(() => {
        if (!isOpen) return;

        (async () => {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/filters`);
            if (!res.ok) return;
            const data = await res.json();

            // Orden visual de colores
            const COLOR_ORDER = [
                'BLANCO', 'BEIGE', 'AMARILLO', 'NARANJA', 'ROSA', 'ROJO',
                'VIOLETA', 'MORADO', 'VERDE', 'AZUL', 'MARRON', 'GRIS', 'NEGRO'
            ];

            // Filtrado general
            const valid = (arr, validOpt = [], invalidOpt = []) => {
                const hasT = (s) => /[áéíóúÁÉÍÓÚ]/.test(s);
                return [...new Set(
                    arr.filter(item =>
                        item &&
                        (!validOpt.length || validOpt.includes(item)) &&
                        (!invalidOpt.length || !invalidOpt.includes(item)) &&
                        item === item.toUpperCase() &&
                        !hasT(item) &&
                        !item.includes(';')
                    )
                )];
            };

            // Aplicar filtros y ordenamientos
            setBrands(
                valid(data.brands, Object.keys(BRAND_NAMES)).sort((a, b) => a.localeCompare(b))
            );
            setCollections(
                valid(data.collections, [], COLEC_INVALIDAS).sort((a, b) => a.localeCompare(b))
            );
            setFabricTypes(
                valid(data.fabricTypes, [], TIPOS_INVALIDOS).sort((a, b) => a.localeCompare(b))
            );
            setFabricPatterns(
                valid(data.fabricPatterns, [], DIBUJOS_INVALIDOS).sort((a, b) => a.localeCompare(b))
            );
            setMartindale(
                (data.martindaleValues || []).filter(v => v).sort((a, b) => b - a)
            );
            setColors(
                valid(data.colors)
                    .filter(c => ALLOWED_COLORS.includes(c.toUpperCase()))
                    .sort((a, b) => (
                        COLOR_ORDER.indexOf(a.toUpperCase()) - COLOR_ORDER.indexOf(b.toUpperCase())
                    ))
            );
        })();
    }, [isOpen]);


    // bloquear scroll
    useEffect(() => {
        document.body.classList.toggle('overflow-hidden', isOpen);
        return () => document.body.classList.remove('overflow-hidden');
    }, [isOpen]);

    const toggle = (arr, setFn, val) =>
        setFn(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

    const clearAll = () => {
        setBrandsSel([]); setColorsSel([]); setCollectionsSel([]);
        setTypesSel([]); setPatternsSel([]); setMartSel([]);
    };

    const handleApply = () => {
        // > Convertir rangos seleccionados en valores numéricos
        let chosen = [];
        martSel.forEach(key => {
            const [minStr, maxStr] = key.split('-');
            const min = parseInt(minStr, 10);
            const max = maxStr.endsWith('+') ? Infinity : parseInt(maxStr, 10);
            martindaleValues.forEach(v => {
                if (v >= min && v <= max) chosen.push(v);
            });
        });
        chosen = Array.from(new Set(chosen));  // eliminar duplicados

        applyFilters({
            brand: brandsSel,
            color: colorsSel,
            collection: collectionsSel,
            fabricType: typesSel,
            fabricPattern: patternsSel,
            martindale: chosen    // ahora números reales
        });
        close();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* backdrop */}
            <div onClick={close}
                className="fixed inset-0 bg-black bg-opacity-50 z-40" />

            <aside className="fixed top-0 left-0 h-screen w-80 bg-white shadow-lg z-50 flex flex-col">
                {/* header */}
                <div className="sticky top-0 bg-white border-b z-10">
                    <div className="flex items-center justify-between p-4">
                        <h2 className="text-2xl font-bold">Filtros</h2>
                        <button onClick={close}>
                            <FaTimes className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between px-4 pb-2">
                        <span className="text-gray-700">
                            {[
                                brandsSel, colorsSel, collectionsSel,
                                typesSel, patternsSel, martSel
                            ].flat().length} seleccionados
                        </span>
                        <button onClick={clearAll}
                            className="text-sm text-[#D2B48C] flex items-center hover:underline">
                            <FaTrashAlt className="mr-1" />Limpiar
                        </button>
                    </div>
                </div>

                {/* contenido */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* secciones genéricas */}
                    {[
                        { key: 'marcas', label: 'Marcas', search: null, items: brands, sel: brandsSel, setSel: setBrandsSel, render: b => BRAND_NAMES[b] || b },
                        { key: 'colecciones', label: 'Colecciones', search: collSearch, setSearch: setCollSearch, items: collections, sel: collectionsSel, setSel: setCollectionsSel },
                        { key: 'tipos', label: 'Tipos de Tela', search: typeSearch, setSearch: setTypeSearch, items: fabricTypes, sel: typesSel, setSel: setTypesSel },
                        { key: 'dibujo', label: 'Dibujo', search: patternSearch, setSearch: setPatternSearch, items: fabricPatterns, sel: patternsSel, setSel: setPatternsSel },
                        { key: 'colores', label: 'Colores', search: null, items: colors, sel: colorsSel, setSel: setColorsSel, isColor: true }
                    ].map(s => (
                        <div key={s.key}>
                            <button
                                onClick={() => setOpenSections(o => ({ ...o, [s.key]: !o[s.key] }))}
                                className="w-full flex justify-between items-center pb-1 border-b"
                            >
                                <h3 className="text-lg font-semibold">{s.label}</h3>
                                {openSections[s.key] ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {openSections[s.key] && (
                                <div className="mt-2 space-y-2">
                                    {s.search !== null && (
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder={`Buscar ${s.label.toLowerCase()}...`}
                                                value={s.search}
                                                onChange={e => s.setSearch(e.target.value)}
                                                className="pl-10 pr-3 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2B48C]"
                                            />
                                        </div>
                                    )}
                                    {s.isColor
                                        ? (
                                            <div className="grid grid-cols-4 gap-2">
                                                {s.items.map(col => {
                                                    const up = col.toUpperCase(), bg = COLOR_MAP[up] || '#000',
                                                        sel = s.sel.includes(col), br = up === 'BLANCO' ? 'border border-black' : '';
                                                    return (
                                                        <div
                                                            key={col}
                                                            onClick={() => toggle(s.sel, s.setSel, col)}
                                                            style={{ backgroundColor: bg }}
                                                            className={`h-10 w-10 rounded cursor-pointer flex items-center justify-center transition-transform hover:scale-105 ${sel ? 'ring-4 ring-[#D2B48C]' : ''} ${br}`}
                                                        >
                                                            {sel && <div className="h-4 w-4 bg-white rounded-full" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )
                                        : (
                                            <div className="max-h-60 overflow-y-auto space-y-1">
                                                {s.items
                                                    .filter(item => s.search ? item.toLowerCase().includes(s.search.toLowerCase()) : true)
                                                    .map(item => (
                                                        <label key={item} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={s.sel.includes(item)}
                                                                onChange={() => toggle(s.sel, s.setSel, item)}
                                                                className="form-checkbox h-5 w-5 text-[#D2B48C]"
                                                            />
                                                            <span>{s.render ? s.render(item) : item}</span>
                                                        </label>
                                                    ))}
                                            </div>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Martindale */}
                    <div>
                        <button
                            onClick={() => setOpenSections(o => ({ ...o, martindale: !o.martindale }))}
                            className="w-full flex justify-between items-center pb-1 border-b"
                        >
                            <h3 className="text-lg font-semibold">Martindale</h3>
                            {openSections.martindale ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {openSections.martindale && (
                            <div className="mt-2 grid gap-2">
                                {MARTINDALE_RANGES.map(r => {
                                    const sel = martSel.includes(r.key);
                                    return (
                                        <button
                                            key={r.key}
                                            onClick={() => toggle(martSel, setMartSel, r.key)}
                                            className={`
                          w-full text-center px-4 py-2 rounded-lg border transition
                          ${sel ? 'bg-[#D2B48C] text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
                        `}
                                        >
                                            {r.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* footer */}
                <footer className="sticky bottom-0 bg-white p-4 border-t">
                    <button
                        onClick={handleApply}
                        className="w-full py-2 bg-[#D2B48C] hover:bg-[#C19A6B] text-white rounded-lg font-semibold transition"
                    >
                        Aplicar Filtros
                    </button>
                </footer>
            </aside>
        </>
    );
}
