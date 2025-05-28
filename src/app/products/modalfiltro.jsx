// src/components/FilterPanel.jsx
import { useState, useEffect } from 'react';
import { FaChevronRight, FaTimes } from 'react-icons/fa';

const BRAND_NAMES = { ARE: 'Arena', HAR: 'Harbour', FLA: 'Flamenco', CJM: 'CJM', BAS: 'Bassari' };
const TIPOS_INVALIDOS = ["JAQUARD", "TEJIDO ", "VISILLO FR", "TERCIOPELO", "RAYA", "BUCLE", "PANA", "TEJIDO", "FALSO LISO", "PAPEL PARED", "TERCIOPELO FR", "FLORES", "ESTAMAPADO", "ESPIGA", "RAYAS"];
const DIBUJOS_INVALIDOS = ["TELAS CON FLORES", "WALLCOVERING", "TERCIOPELO FR", "BLACKOUT", "RAFIA", "KILM", "RAYA", "IKAT ", "WALLPAPER", "FLORES", "ANIMAL", "LISOS", "ESTAMPADO", "GEOMETRICA", "ESPIGAS", "VISILLO", "TEJIDO", "TERCIOPELO", "PANA"];
const COLEC_INVALIDAS = ["MARRAKECH", "MARRAKESH"];
const ALLOWED_COLORS = ['GRIS', 'NEGRO', 'VERDE', 'BEIGE', 'BLANCO', 'MARRON', 'AZUL', 'AMARILLO', 'NARANJA', 'ROJO', 'MORADO', 'VIOLETA', 'ROSA'];

const COLOR_MAP = {
    BLANCO: '#FFFFFF',
    BEIGE: '#F5F5DC',
    AMARILLO: '#FFFF00',
    NARANJA: '#FFA500',
    ROSA: '#FFC0CB',
    ROJO: '#FF0000',
    VIOLETA: '#EE82EE',
    MORADO: '#800080',
    VERDE: '#008000',
    AZUL: '#0000FF',
    MARRON: '#A52A2A',
    GRIS: '#808080',
    NEGRO: '#000000'
};


export default function FilterPanel({ setFilteredProducts, page, clearFiltersCallback }) {
    const [isOpen, setIsOpen] = useState(false);

    // selección
    const [brandsSel, setBrandsSel] = useState(clearFiltersCallback.currentFilters.brand || []);
    const [colorsSel, setColorsSel] = useState(clearFiltersCallback.currentFilters.color || []);
    const [collectionsSel, setCollectionsSel] = useState(clearFiltersCallback.currentFilters.collection || []);
    const [typesSel, setTypesSel] = useState(clearFiltersCallback.currentFilters.fabricType || []);
    const [patternsSel, setPatternsSel] = useState(clearFiltersCallback.currentFilters.fabricPattern || []);
    const [martSel, setMartSel] = useState(clearFiltersCallback.currentFilters.martindale || []);

    // opciones
    const [brands, setBrands] = useState([]);
    const [collections, setCollections] = useState([]);
    const [fabricTypes, setFabricTypes] = useState([]);
    const [fabricPatterns, setFabricPatterns] = useState([]);
    const [martindaleValues, setMartindale] = useState([]);
    const [colors, setColors] = useState([]);

    // búsquedas internas
    const [collSearch, setCollSearch] = useState('');
    const [typeSearch, setTypeSearch] = useState('');
    const [patternSearch, setPatternSearch] = useState('');

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

    useEffect(() => {
        document.body.classList.toggle('overflow-hidden', isOpen);
        return () => document.body.classList.remove('overflow-hidden');
    }, [isOpen]);

    const toggle = (arr, setFn, val) => {
        setFn(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
    };

    const apply = () => {
        const toApply = {
            brand: brandsSel.map(b => Object.keys(BRAND_NAMES).find(k => BRAND_NAMES[k] === b) || b),
            color: colorsSel,
            collection: collectionsSel,
            fabricType: typesSel,
            fabricPattern: patternsSel,
            martindale: martSel
        };
        setFilteredProducts(toApply, page);
        setIsOpen(false);
    };

    return <>
        <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-20">
            <button
                onClick={() => setIsOpen(o => !o)}
                className="p-3 bg-black bg-opacity-60 text-white rounded-full shadow-lg hover:bg-opacity-80 transition"
            >
                <FaChevronRight className={`text-2xl transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>
        {isOpen && <>
            <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-40" />
            <aside className="fixed top-0 left-0 h-screen w-80 bg-white shadow-xl z-50 flex flex-col">
                {/* header */}
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">Filtros</h2>
                    <button onClick={() => setIsOpen(false)}><FaTimes className="w-5 h-5 text-gray-600" /></button>
                </header>
                {/* contenido */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* tags */}
                    <div className="flex flex-wrap gap-2 border-b pb-2">
                        {[...brandsSel, ...colorsSel, ...collectionsSel, ...typesSel, ...patternsSel, ...martSel]
                            .map((item, i) =>
                                <span key={i} className="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center">
                                    {item}
                                    <button onClick={() => {
                                        // quitar de la selección correcta
                                        if (brandsSel.includes(item)) setBrandsSel(bs => bs.filter(x => x !== item));
                                        if (colorsSel.includes(item)) setColorsSel(cs => cs.filter(x => x !== item));
                                        if (collectionsSel.includes(item)) setCollectionsSel(c => c.filter(x => x !== item));
                                        if (typesSel.includes(item)) setTypesSel(t => t.filter(x => x !== item));
                                        if (patternsSel.includes(item)) setPatternsSel(p => p.filter(x => x !== item));
                                        if (martSel.includes(item)) setMartSel(m => m.filter(x => x !== item));
                                    }} className="ml-2 text-gray-600 hover:text-gray-800">×</button>
                                </span>
                            )}
                    </div>
                    {/* Marcas */}
                    <section>
                        <h3 className="font-semibold mb-2">Marcas</h3>
                        {brands.map(b =>
                            <label key={b} className="flex items-center space-x-2 mb-1">
                                <input type="checkbox" className="form-checkbox h-5 w-5 text-[#D2B48C]"
                                    checked={brandsSel.includes(b)} onChange={() => toggle(brandsSel, setBrandsSel, b)} />
                                <span>{BRAND_NAMES[b] || b}</span>
                            </label>
                        )}
                    </section>
                    {/* Colecciones */}
                    <section>
                        <h3 className="font-semibold mb-2">Colecciones</h3>
                        <input type="text" placeholder="Buscar colecciones..."
                            value={collSearch} onChange={e => setCollSearch(e.target.value)}
                            className="mb-2 p-2 border rounded w-full" />
                        {collections.filter(c => c.toLowerCase().includes(collSearch.toLowerCase()))
                            .map(c =>
                                <label key={c} className="flex items-center space-x-2 mb-1">
                                    <input type="checkbox" className="form-checkbox h-5 w-5 text-[#D2B48C]"
                                        checked={collectionsSel.includes(c)} onChange={() => toggle(collectionsSel, setCollectionsSel, c)} />
                                    <span>{c}</span>
                                </label>
                            )}
                    </section>
                    {/* Tipos de Tela */}
                    <section>
                        <h3 className="font-semibold mb-2">Tipos de Tela</h3>
                        <input type="text" placeholder="Buscar tipos..."
                            value={typeSearch} onChange={e => setTypeSearch(e.target.value)}
                            className="mb-2 p-2 border rounded w-full" />
                        {fabricTypes.filter(t => t.toLowerCase().includes(typeSearch.toLowerCase()))
                            .map(t =>
                                <label key={t} className="flex items-center space-x-2 mb-1">
                                    <input type="checkbox" className="form-checkbox h-5 w-5 text-[#D2B48C]"
                                        checked={typesSel.includes(t)} onChange={() => toggle(typesSel, setTypesSel, t)} />
                                    <span>{t}</span>
                                </label>
                            )}
                    </section>
                    {/* Dibujo de Tela */}
                    <section>
                        <h3 className="font-semibold mb-2">Dibujo de Tela</h3>
                        <input type="text" placeholder="Buscar dibujos..."
                            value={patternSearch} onChange={e => setPatternSearch(e.target.value)}
                            className="mb-2 p-2 border rounded w-full" />
                        {fabricPatterns.filter(p => p.toLowerCase().includes(patternSearch.toLowerCase()))
                            .map(p =>
                                <label key={p} className="flex items-center space-x-2 mb-1">
                                    <input type="checkbox" className="form-checkbox h-5 w-5 text-[#D2B48C]"
                                        checked={patternsSel.includes(p)} onChange={() => toggle(patternsSel, setPatternsSel, p)} />
                                    <span>{p}</span>
                                </label>
                            )}
                    </section>
                    {/* Colores */}
                    <section>
                        <h3 className="font-semibold mb-2">Colores</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {colors.map(col => {
                                const up = col.toUpperCase();
                                const bg = COLOR_MAP[up] || '#000';
                                const sel = colorsSel.includes(col);
                                return <div key={col}
                                    onClick={() => toggle(colorsSel, setColorsSel, col)}
                                    style={{ background: bg }}
                                    className={`h-10 w-10 rounded cursor-pointer flex items-center justify-center transition hover:scale-105 ${sel ? 'ring-4 ring-[#D2B48C]' : ''
                                        }`}
                                >
                                    {sel && <div className="h-4 w-4 bg-white rounded-full" />}
                                </div>;
                            })}
                        </div>
                    </section>
                    {/* Martindale */}
                    <section>
                        <h3 className="font-semibold mb-2">Martindale</h3>
                        {martindaleValues.map(m =>
                            <label key={m} className="flex items-center space-x-2 mb-1">
                                <input type="checkbox" className="form-checkbox h-5 w-5 text-[#D2B48C]"
                                    checked={martSel.includes(m)} onChange={() => toggle(martSel, setMartSel, m)} />
                                <span>{m}</span>
                            </label>
                        )}
                    </section>
                </div>
                <footer className="p-4 border-t">
                    <button onClick={apply}
                        className="w-full py-2 font-bold rounded bg-[#D2B48C] hover:bg-[#C19A6B] text-white transition">
                        Aplicar Filtros
                    </button>
                </footer>
            </aside>
        </>}
    </>;
}
