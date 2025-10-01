// src/components/FilterPanel.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMarca } from '../../components/MarcaContext';
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
const TIPOS_INVALIDOS = [
    'JAQUARD', 'TEJIDO ', 'VISILLO FR', 'TERCIOPELO', 'RAYA', 'BUCLE',
    'PANA', 'TEJIDO', 'FALSO LISO', 'PAPEL PARED', 'TERCIOPELO FR',
    'FLORES', 'ESTAMAPADO', 'ESPIGA', 'RAYAS', "CUADROS"
];
const DIBUJOS_INVALIDOS = [
    'TELAS CON FLORES', 'BLACKOUT', 'WALLCOVERING', 'TERCIOPELO FR',
    'RAFIA', 'KILM', 'RAYA', 'IKAT ', 'WALLPAPER', 'FLORES', 'ANIMAL',
    'LISOS', 'ESTAMPADO', 'GEOMETRICA', 'ESPIGAS', 'VISILLO', 'TEJIDO',
    'TERCIOPELO', 'PANA'
];
const COLEC_INVALIDAS = ['MARRAKESH', 'CARIBEAN PARTY'];
const ALLOWED_COLORS = [
    'GRIS', 'NEGRO', 'VERDE', 'BEIGE', 'BLANCO', 'MARRON',
    'AZUL', 'AMARILLO', 'NARANJA', 'ROJO', 'MORADO', 'VIOLETA', 'ROSA'
];
const COLOR_MAP = {
    GRIS: '#808080', NEGRO: '#000000', VERDE: '#008000',
    BEIGE: '#F5F5DC', BLANCO: '#FFFFFF', MARRON: '#A52A2A',
    AZUL: '#0000FF', AMARILLO: '#FFFF00', NARANJA: '#FFA500',
    ROJO: '#FF0000', MORADO: '#800080', VIOLETA: '#EE82EE',
    ROSA: '#FFC0CB'
};

// These keys correspond to your JSON under filterPanelNew.martRanges
const MARTINDALE_RANGES = [
    { key: '0-20000' },
    { key: '20000-50000' },
    { key: '50000-100000' },
    { key: '100000+' }
];

export default function FilterPanel({ isOpen, close, applyFilters, currentFilters }) {
    const { t } = useTranslation('filterPanelNew');
    const { setMarcaActiva } = useMarca();

    // --- Selection state ---
    const [brandsSel, setBrandsSel] = useState(currentFilters?.brand || []);
    const [colorsSel, setColorsSel] = useState(currentFilters?.color || []);
    const [collectionsSel, setCollectionsSel] = useState(currentFilters?.collection || []);
    const [typesSel, setTypesSel] = useState(currentFilters?.fabricType || []);
    const [patternsSel, setPatternsSel] = useState(currentFilters?.fabricPattern || []);
    const [martSel, setMartSel] = useState(currentFilters?.martindale || []);

    // --- Dynamic options ---
    const [brands, setBrands] = useState([]);
    const [collections, setCollections] = useState([]);
    const [fabricTypes, setFabricTypes] = useState([]);
    const [fabricPatterns, setFabricPatterns] = useState([]);
    const [martindaleValues, setMartindale] = useState([]);
    const [colors, setColors] = useState([]);

    // --- Local search inputs ---
    const [collSearch, setCollSearch] = useState('');
    const [typeSearch, setTypeSearch] = useState('');
    const [patternSearch, setPatternSearch] = useState('');

    // --- Accordion toggles ---
    const [openSections, setOpenSections] = useState({
        marcas: true,
        colecciones: true,
        tipos: true,
        dibujo: true,
        colores: true,
        martindale: true
    });

    // Fetch filters once opened
    useEffect(() => {
        if (!isOpen) return;
        (async () => {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/filters`);
            if (!res.ok) return;
            const data = await res.json();

            const valid = (arr, validOpt = [], invalidOpt = []) => {
                const hasTilde = s => /[áéíóúÁÉÍÓÚ]/.test(s);
                return [...new Set(
                    arr.filter(item =>
                        item
                        && (!validOpt.length || validOpt.includes(item))
                        && (!invalidOpt.length || !invalidOpt.includes(item))
                        && item === item.toUpperCase()
                        && !hasTilde(item)
                        && !item.includes(';')
                    )
                )];
            };

            const COLOR_ORDER = [
                'BLANCO', 'BEIGE', 'AMARILLO', 'NARANJA', 'ROSA', 'ROJO',
                'VIOLETA', 'MORADO', 'VERDE', 'AZUL', 'MARRON', 'GRIS', 'NEGRO'
            ];

            setBrands(valid(data.brands, Object.keys(BRAND_NAMES)).sort((a, b) => a.localeCompare(b)));
            setCollections(valid(data.collections, [], COLEC_INVALIDAS).sort((a, b) => a.localeCompare(b)));
            setFabricTypes(valid(data.fabricTypes, [], TIPOS_INVALIDOS).sort((a, b) => a.localeCompare(b)));
            setFabricPatterns(valid(data.fabricPatterns, [], DIBUJOS_INVALIDOS).sort((a, b) => a.localeCompare(b)));
            setMartindale((data.martindaleValues || []).filter(v => v).sort((a, b) => b - a));
            setColors(valid(data.colors)
                .filter(c => ALLOWED_COLORS.includes(c.toUpperCase()))
                .sort((a, b) => COLOR_ORDER.indexOf(a.toUpperCase()) - COLOR_ORDER.indexOf(b.toUpperCase()))
            );
        })();
    }, [isOpen]);

    // Lock body scroll
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
        // Expandir martindale en valores reales
        let chosen = [];
        martSel.forEach(key => {
            const [minStr, maxStr] = key.split("-");
            const min = parseInt(minStr, 10);
            const max = maxStr.endsWith("+") ? Infinity : parseInt(maxStr, 10);
            martindaleValues.forEach(v => { if (v >= min && v <= max) chosen.push(v); });
        });
        chosen = Array.from(new Set(chosen));

        applyFilters({
            brand: brandsSel,
            color: colorsSel,
            collection: collectionsSel,
            fabricType: typesSel,
            fabricPattern: patternsSel,
            martindale: chosen
        });

        setMarcaActiva(null);
        clearAll();
        close();
    };

    if (!isOpen) return null;

    const totalSelected = [
        brandsSel, colorsSel, collectionsSel,
        typesSel, patternsSel, martSel
    ].flat().length;

    return (
        <>
            {/* backdrop */}
            <div onClick={close} className="fixed inset-0 bg-black bg-opacity-50 z-50" />

            <aside className="fixed top-0 left-0 h-screen w-80 bg-white shadow-lg z-50 flex flex-col">
                {/* header */}
                <div className="sticky top-0 bg-white border-b z-10">
                    <div className="flex items-center justify-between p-4">
                        <h2 className="text-2xl font-bold">{t('title')}</h2>
                        <button onClick={close}><FaTimes className="w-6 h-6 text-gray-600" /></button>
                    </div>
                    <div className="flex items-center justify-between px-4 pb-2">
                        <span className="text-gray-700">
                            {t('selectedCount', { count: totalSelected })}
                        </span>
                        <button onClick={clearAll} className="text-sm text-[#26659E] flex items-center hover:underline">
                            <FaTrashAlt className="mr-1" /> {t('clearAll')}
                        </button>
                    </div>
                </div>

                {/* content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {[
                        {
                            key: 'marcas', label: t('categories.brands'),
                            search: null, items: brands, sel: brandsSel, setSel: setBrandsSel,
                            render: b => BRAND_NAMES[b] || b
                        },
                        {
                            key: 'colecciones', label: t('categories.collections'),
                            search: collSearch, items: collections, sel: collectionsSel, setSel: setCollectionsSel
                        },
                        {
                            key: 'tipos', label: t('categories.fabricTypes'),
                            search: typeSearch, items: fabricTypes, sel: typesSel, setSel: setTypesSel
                        },
                        {
                            key: 'dibujo', label: t('categories.patterns'),
                            search: patternSearch, items: fabricPatterns, sel: patternsSel, setSel: setPatternsSel
                        },
                        {
                            key: 'colores', label: t('categories.colors'),
                            search: null, items: colors, sel: colorsSel, setSel: setColorsSel, isColor: true
                        }
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
                                                placeholder={t(`placeholders.search${s.key}`)}
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
                                                    const up = col.toUpperCase(),
                                                        bg = COLOR_MAP[up] || '#000',
                                                        sel = s.sel.includes(col),
                                                        br = up === 'BLANCO' ? 'border border-black' : '';
                                                    return (
                                                        <div
                                                            key={col}
                                                            onClick={() => toggle(s.sel, s.setSel, col)}
                                                            style={{ backgroundColor: bg }}
                                                            className={`h-10 w-10 rounded cursor-pointer flex items-center justify-center transition-transform hover:scale-105 ${sel ? 'ring-4 ring-[#26659E]' : ''} ${br}`}
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
                                                    .filter(item => s.search
                                                        ? item.toLowerCase().includes(s.search.toLowerCase())
                                                        : true
                                                    )
                                                    .map(item => (
                                                        <label key={item} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={s.sel.includes(item)}
                                                                onChange={() => toggle(s.sel, s.setSel, item)}
                                                                className="form-checkbox h-5 w-5 text-[#26659E]"
                                                            />
                                                            <span>
                                                                {s.key === 'tipos'
                                                                    ? t(`values.fabricTypes.${item}`)
                                                                    : s.key === 'dibujo'
                                                                        ? t(`values.patterns.${item}`)
                                                                        : s.render
                                                                            ? s.render(item)
                                                                            : item
                                                                }
                                                            </span>
                                                        </label>
                                                    ))
                                                }
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
                            <h3 className="text-lg font-semibold">{t('categories.martindale')}</h3>
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
                                                w-full text-start px-4 py-2 rounded-lg border transition
                                                ${sel ? 'bg-[#26659E] text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
                                            `}
                                        >
                                            {t(`martRanges.${r.key}`)}
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
                        className="w-full py-2 bg-[#26659E] hover:bg-[#1F4F7B] text-white rounded-lg font-semibold transition"
                    >
                        {t('apply')}
                    </button>
                </footer>
            </aside>
        </>
    );
}
