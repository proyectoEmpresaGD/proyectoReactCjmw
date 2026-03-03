// src/components/FilterPanel.jsx
import { useState, useEffect } from 'react';
import { ChevronRight, X } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { buildProductsSearchFromFilters, EMPTY_FILTERS } from "./filterUrl";

const BRAND_NAMES = { ARE: 'Arena', HAR: 'Harbour', FLA: 'Flamenco', CJM: 'CJM', BAS: 'Bassari' };
const TIPOS_INVALIDOS = ["JAQUARD", "CUADROS", "RAYAS", "TEJIDO ", "VISILLO FR", "TERCIOPELO", "RAYA", "BUCLE", "PANA", "TEJIDO", "FALSO LISO", "PAPEL PARED", "TERCIOPELO FR", "FLORES", "ESTAMAPADO", "ESPIGA", "RAYAS"];
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
    const navigate = useNavigate();
    const { t } = useTranslation('filterPanel');
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

            const COLOR_ORDER = [
                'BLANCO', 'BEIGE', 'AMARILLO', 'NARANJA', 'ROSA', 'ROJO',
                'VIOLETA', 'MORADO', 'VERDE', 'AZUL', 'MARRON', 'GRIS', 'NEGRO'
            ];

            const toKey = (value) =>
                String(value ?? '')
                    .trim()
                    .normalize('NFD')
                    .replace(/\p{Diacritic}/gu, '')
                    .toUpperCase();

            const localeSort = (list) =>
                (list || []).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

            // ✅ valid robusto: trim + sets normalizados + dedup por key
            const valid = (arr, validOpt = [], invalidOpt = []) => {
                const hasAccent = (s) => /[áéíóúÁÉÍÓÚ]/.test(s);

                const validSet = validOpt.length ? new Set(validOpt.map(toKey)) : null;
                const invalidSet = invalidOpt.length ? new Set(invalidOpt.map(toKey)) : null;

                const seen = new Set();
                const out = [];

                (arr || []).forEach((raw) => {
                    if (typeof raw !== 'string') return;
                    const item = raw.trim();
                    if (!item) return;

                    // Mantengo tus reglas, pero aplicadas sobre el item "limpio"
                    if (item.includes(';')) return;
                    if (hasAccent(item)) return;
                    if (item !== item.toUpperCase()) return;

                    const k = toKey(item);
                    if (!k) return;

                    if (invalidSet && invalidSet.has(k)) return;
                    if (validSet && !validSet.has(k)) return;

                    if (seen.has(k)) return;
                    seen.add(k);
                    out.push(item);
                });

                return out;
            };

            // ✅ Regla especial: RAYAS/CUADROS deben ser "Estilos" (fabricPattern), no "Tipos" (fabricType)
            const removeMisplacedFromTypes = (list) =>
                (list || []).filter((tipo) => {
                    const k = toKey(tipo);
                    // elimina exactos y también variantes tipo "RAYAS - ..." / "CUADROS - ..."
                    if (k.includes('RAYAS')) return false;
                    if (k.includes('CUADROS')) return false;
                    return true;
                });

            const ensurePatterns = (list) => {
                const current = Array.isArray(list) ? list : [];
                const set = new Set(current.map(toKey));
                const out = [...current];

                if (!set.has('RAYAS')) out.push('RAYAS');
                if (!set.has('CUADROS')) out.push('CUADROS');

                return out;
            };

            // ===== Brands / Collections =====
            setBrands(localeSort(valid(data.brands, Object.keys(BRAND_NAMES))));
            setCollections(localeSort(valid(data.collections, [], COLEC_INVALIDAS)));

            // ===== Tipos =====
            const fabricTypesList = removeMisplacedFromTypes(
                valid(data.fabricTypes, [], TIPOS_INVALIDOS)
            );
            setFabricTypes(localeSort(fabricTypesList));

            // ===== Estilos / Dibujo =====
            const patternsList = ensurePatterns(
                valid(data.fabricPatterns, [], DIBUJOS_INVALIDOS)
            );
            setFabricPatterns(localeSort(patternsList));

            // ===== Martindale =====
            setMartindale(
                (data.martindaleValues || [])
                    .map((v) => Number(String(v ?? '').trim()))
                    .filter((n) => Number.isFinite(n))
                    .sort((a, b) => b - a)
            );

            // ===== Colores =====
            const allowedColorSet = new Set(ALLOWED_COLORS.map(toKey));
            const orderIndex = (value) => {
                const idx = COLOR_ORDER.indexOf(toKey(value));
                return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
            };

            const colorsList = valid(data.colors)
                .filter((color) => allowedColorSet.has(toKey(color)))
                .sort((a, b) => {
                    const diff = orderIndex(a) - orderIndex(b);
                    if (diff !== 0) return diff;
                    return a.localeCompare(b, undefined, { sensitivity: 'base' });
                });

            setColors(colorsList);
        })();
    }, [isOpen]);

    useEffect(() => {
        document.body.classList.toggle('overflow-hidden', isOpen);
        return () => document.body.classList.remove('overflow-hidden');
    }, [isOpen]);

    const toggle = (arr, setFn, val) => {
        setFn(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
    };

    const normalizeKey = (value) =>
        String(value ?? '')
            .trim()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .toUpperCase();

    const MISPLACED = new Set(['RAYAS', 'CUADROS'].map(normalizeKey));

    const moveMisplacedTypeToPattern = ({ fabricType, fabricPattern }) => {
        const types = Array.isArray(fabricType) ? fabricType : [];
        const patterns = Array.isArray(fabricPattern) ? fabricPattern : [];

        const movedToPatterns = [];
        const cleanedTypes = [];

        for (const t of types) {
            const k = normalizeKey(t);
            if (MISPLACED.has(k)) movedToPatterns.push(k); // guardamos normalizado
            else cleanedTypes.push(t);
        }

        // añadimos a patterns sin duplicar (comparación normalizada)
        const patternSet = new Set(patterns.map(normalizeKey));
        const nextPatterns = [...patterns];

        for (const m of movedToPatterns) {
            if (!patternSet.has(m)) {
                nextPatterns.push(m); // “RAYAS”/“CUADROS”
                patternSet.add(m);
            }
        }

        return { fabricType: cleanedTypes, fabricPattern: nextPatterns };
    };

    const apply = () => {
        // 1) construyes filtros como siempre
        let selectedFilters = {
            ...EMPTY_FILTERS,
            brand: brandsSel,
            color: colorsSel,
            collection: collectionsSel,
            fabricType: typesSel,
            fabricPattern: patternsSel,
            martindale: martSel,
            // si en móvil añades uso/mantenimiento, también aquí
        };

        // 2) ✅ blindaje: si RAYAS/CUADROS cayeron en fabricType, los movemos a fabricPattern
        const fixed = moveMisplacedTypeToPattern({
            fabricType: selectedFilters.fabricType,
            fabricPattern: selectedFilters.fabricPattern,
        });

        selectedFilters = {
            ...selectedFilters,
            fabricType: fixed.fabricType,
            fabricPattern: fixed.fabricPattern,
        };

        // 3) navegas igual
        const search = buildProductsSearchFromFilters(selectedFilters);
        console.log('typesSel:', typesSel);
        console.log('patternsSel:', patternsSel);
        navigate(`/products?${search}`);
        setIsOpen(false);

        try { window.scrollTo({ top: 0, behavior: "auto" }); } catch { }
    };

    return <>
        {/* Toggle button */}
        <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-20">
            <button
                onClick={() => setIsOpen(o => !o)}
                className="p-3 bg-black bg-opacity-60 text-white rounded-full shadow-lg hover:bg-opacity-80 transition"
            >
                <ChevronRight className={`text-2xl transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>

        {isOpen && <>
            <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-40" />
            <aside className="fixed top-0 left-0 h-screen w-80 bg-white shadow-xl z-50 flex flex-col">
                {/* header */}
                <header className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">{t('filters')}</h2>
                    <button onClick={() => setIsOpen(false)}>
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
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
                        <h3 className="font-semibold mb-2">{t('brands')}</h3>
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
                        <h3 className="font-semibold mb-2">{t('collections')}</h3>
                        <input type="text" placeholder={t('searchCollections')}
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
                        <h3 className="font-semibold mb-2">{t('fabricTypes')}</h3>
                        <input type="text" placeholder={t('searchTypes')}
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
                        <h3 className="font-semibold mb-2">{t('fabricPatterns')}</h3>
                        <input type="text" placeholder={t('searchPatterns')}
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
                        <h3 className="font-semibold mb-2">{t('colors')}</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {colors.map(col => {
                                const up = col.toUpperCase();
                                const bg = COLOR_MAP[up] || '#000';
                                const sel = colorsSel.includes(col);
                                return <div key={col}
                                    onClick={() => toggle(colorsSel, setColorsSel, col)}
                                    style={{ background: bg }}
                                    className={`h-10 w-10 rounded cursor-pointer flex items-center justify-center transition hover:scale-105 ${sel ? 'ring-4 ring-[#D2B48C]' : ''}`}
                                >
                                    {sel && <div className="h-4 w-4 bg-white rounded-full" />}
                                </div>;
                            })}
                        </div>
                    </section>

                    {/* Martindale */}
                    <section>
                        <h3 className="font-semibold mb-2">{t('martindale')}</h3>
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
                        {t('applyFilters')}
                    </button>
                </footer>
            </aside>
        </>}
    </>;
}
