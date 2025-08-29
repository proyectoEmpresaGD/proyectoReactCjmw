import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash.debounce';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { defaultImageUrl } from '../Constants/constants';

const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const normalizeQuery = (q) => q.trim().replace(/\s+/g, ' ');
const HISTORY_STORAGE_KEY = 'searchHistoryV2';

const highlight = (text, q) => {
    if (!text) return null;
    const term = (q || '').trim();
    if (!term) return text;
    const idx = text.toUpperCase().indexOf(term.toUpperCase());
    if (idx === -1) return text;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="bg-yellow-200">{text.slice(idx, idx + term.length)}</mark>
            {text.slice(idx + term.length)}
        </>
    );
};

const SearchBar = ({ closeSearchBar }) => {
    const { t } = useTranslation('search');
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [productSuggestions, setProductSuggestions] = useState([]); // [{codprodu,nombre,coleccion,tonalidad,image}]
    const [collectionSuggestions, setCollectionSuggestions] = useState([]); // [string]
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]); // [{type:'product'|'collection'|'text', label, codprodu?, collection?, query?}]

    const inputRef = useRef(null);
    const suggestionRefs = useRef([]);
    const wrapperRef = useRef(null);
    const controllerRef = useRef(null); // AbortController

    // ---------- Historial (con migración v1 → v2) ----------
    useEffect(() => {
        const rawV2 = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (rawV2) {
            try {
                const parsed = JSON.parse(rawV2);
                if (Array.isArray(parsed)) {
                    setHistory(parsed);
                    return;
                }
            } catch { }
        }
        const rawV1 = localStorage.getItem('searchHistory');
        if (rawV1) {
            try {
                const parsedV1 = JSON.parse(rawV1);
                if (Array.isArray(parsedV1)) {
                    const migrated = parsedV1.map((label) => ({
                        type: 'text',
                        label: String(label),
                        query: String(label),
                    }));
                    setHistory(migrated.slice(0, 5));
                    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(migrated.slice(0, 5)));
                }
            } catch { }
        }
    }, []);

    const persistHistory = (list) => {
        setHistory(list);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(list));
    };

    const addToHistory = (item) => {
        const deduped = [item, ...history.filter((h) => h.label !== item.label)].slice(0, 5);
        persistHistory(deduped);
    };

    // ---------- Fetch sugerencias ----------
    const fetchAll = useCallback(
        async (q) => {
            if (q.length < 3) {
                setProductSuggestions([]);
                setCollectionSuggestions([]);
                return;
            }
            controllerRef.current?.abort();
            const controller = new AbortController();
            controllerRef.current = controller;

            setIsLoading(true);
            const norm = normalizeQuery(q);

            try {
                // nuevo endpoint
                const urlQuick = `${import.meta.env.VITE_API_BASE_URL}/api/products/search-quick?query=${encodeURIComponent(
                    norm
                )}&prodLimit=8&colLimit=6`;

                let rp = await fetch(urlQuick, { signal: controller.signal });
                // compatibilidad (por si en local aún está el endpoint antiguo en alguna rama)
                if (!rp.ok) {
                    const legacy = `${import.meta.env.VITE_API_BASE_URL}/api/products/search?query=${encodeURIComponent(
                        norm
                    )}&limit=8&page=1`;
                    rp = await fetch(legacy, { signal: controller.signal });
                }

                let dpProducts = [];
                let dcCollections = [];

                if (rp.ok) {
                    const data = await rp.json();
                    // si viene del endpoint nuevo
                    if (Array.isArray(data.products) || Array.isArray(data.collections)) {
                        dpProducts = data.products ?? [];
                        dcCollections = data.collections ?? [];
                    } else {
                        // compat: /search clásico
                        dpProducts = Array.isArray(data.products) ? data.products : [];
                        dcCollections = [];
                    }
                }

                // saneo: evita items incompletos que rompan los .map()
                const safeProducts = (dpProducts || [])
                    .filter(Boolean)
                    .filter((p) => p && (p.nombre || p.codprodu)) // al menos nombre o id
                    .slice(0, 8);

                const safeCollections = (dcCollections || [])
                    .filter(Boolean)
                    .map(String)
                    .slice(0, 6);

                setProductSuggestions(safeProducts);
                setCollectionSuggestions(safeCollections);
            } catch (e) {
                if (e.name !== 'AbortError') {
                    setProductSuggestions([]);
                    setCollectionSuggestions([]);
                }
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const debouncedFetch = useCallback(debounce(fetchAll, 250), [fetchAll]);

    const handleChange = (e) => {
        const val = e.target.value.toUpperCase();
        setQuery(val);
        debouncedFetch(val);
    };

    const total = productSuggestions.length + collectionSuggestions.length;

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, total - 1));
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0) {
                if (activeIndex < productSuggestions.length) {
                    selectProduct(productSuggestions[activeIndex]);
                } else {
                    const ci = activeIndex - productSuggestions.length;
                    selectCollection(collectionSuggestions[ci]);
                }
            } else {
                submitSearch(query);
            }
        }
    };

    useEffect(() => {
        if (activeIndex >= 0 && suggestionRefs.current[activeIndex]) {
            suggestionRefs.current[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [activeIndex]);

    useEffect(() => {
        inputRef.current?.focus();
        return () => controllerRef.current?.abort();
    }, []);

    // ---------- Selecciones ----------
    const selectProduct = (item) => {
        const nombre = item?.nombre || item?.codprodu || '';
        const label = `${nombre} (${item?.coleccion || t('noCollection')}, ${item?.tonalidad || t('noTone')})`;
        setQuery(label);
        addToHistory({ type: 'product', label, codprodu: item?.codprodu });
        if (item?.codprodu) {
            navigate(`/products?productId=${encodeURIComponent(item.codprodu)}&page=1`);
        } else {
            // Fallback por texto si faltara codprodu
            navigate(`/products?search=${encodeURIComponent(nombre)}&page=1`);
        }
        reset();
    };

    const selectCollection = (col) => {
        const label = `${t('collectionPrefix')} ${col}`;
        setQuery(label);
        addToHistory({ type: 'collection', label, collection: col });
        navigate(`/products?collection=${encodeURIComponent(col)}&page=1`);
        reset();
    };

    const submitSearch = (q) => {
        const norm = normalizeQuery(q);
        if (!norm) return;
        const pref = `${t('collectionPrefix')} `;
        if (norm.toUpperCase().startsWith(pref.toUpperCase())) {
            const col = norm.slice(pref.length).trim();
            addToHistory({ type: 'collection', label: norm, collection: col });
            navigate(`/products?collection=${encodeURIComponent(col)}&page=1`);
        } else {
            addToHistory({ type: 'text', label: norm, query: norm });
            navigate(`/products?search=${encodeURIComponent(norm)}&page=1`);
        }
        reset();
    };

    const reset = () => {
        setActiveIndex(-1);
        setProductSuggestions([]);
        setCollectionSuggestions([]);
        closeSearchBar?.();
    };

    useEffect(() => {
        if (!query) setActiveIndex(-1);
    }, [query]);

    // Cierra sugerencias si clic fuera
    useEffect(() => {
        const onClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setProductSuggestions([]);
                setCollectionSuggestions([]);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const activeId =
        activeIndex >= 0
            ? activeIndex < productSuggestions.length
                ? `opt-prod-${productSuggestions[activeIndex]?.codprodu || activeIndex}`
                : `opt-col-${collectionSuggestions[activeIndex - productSuggestions.length]}`
            : undefined;

    // ---------- click del historial ----------
    const handleHistoryClick = (item) => {
        setQuery(item.label || '');
        if (item.type === 'product' && item.codprodu) {
            navigate(`/products?productId=${encodeURIComponent(item.codprodu)}&page=1`);
        } else if (item.type === 'collection' && item.collection) {
            navigate(`/products?collection=${encodeURIComponent(item.collection)}&page=1`);
        } else if (item.type === 'text' && item.query) {
            navigate(`/products?search=${encodeURIComponent(item.query)}&page=1`);
        } else {
            navigate(`/products?search=${encodeURIComponent(item.label || '')}&page=1`);
        }
        reset();
    };

    return (
        <div className="relative w-full max-w-md" ref={wrapperRef}>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-full px-4 py-2 shadow-sm">
                <RiSearchLine className="text-gray-500 mr-2" size={20} />
                <input
                    ref={inputRef}
                    type="text"
                    style={{ textTransform: 'uppercase' }}
                    className="flex-grow bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
                    placeholder={t('placeholder')}
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    role="combobox"
                    aria-expanded={query.length >= 3 && total > 0}
                    aria-controls="search-suggestions"
                    aria-activedescendant={activeId}
                    aria-autocomplete="list"
                />
                {query && (
                    <button onClick={() => setQuery('')} className="focus:outline-none" aria-label={t('clear')}>
                        <RiCloseLine className="text-gray-500" size={20} />
                    </button>
                )}
            </div>

            {query && query.length < 3 && (
                <div className="mt-1 text-xs text-gray-500">{t('minChars')}</div>
            )}

            <AnimatePresence>
                {query.length >= 3 && (
                    <motion.div
                        id="search-suggestions"
                        className="absolute z-50 w-full bg-white rounded-lg mt-2 shadow-lg"
                        style={{ maxHeight: '260px', overflowY: 'auto' }}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                    >
                        {isLoading ? (
                            <div className="px-4 py-2 text-center text-sm text-gray-600">{t('loading')}</div>
                        ) : productSuggestions.length + collectionSuggestions.length > 0 ? (
                            <>
                                {/* Productos */}
                                {productSuggestions.length > 0 && (
                                    <div>
                                        <div className="px-4 py-1 text-xs text-gray-500 uppercase">
                                            {t('productsSection')}
                                        </div>
                                        <ul role="listbox" aria-label={t('productsSection')}>
                                            {productSuggestions.map((item, idx) => {
                                                const key = item?.codprodu || `${item?.nombre || 'item'}-${idx}`;
                                                const nombre = item?.nombre || t('noName', 'SIN NOMBRE');
                                                const coleccion = item?.coleccion || t('noCollection');
                                                const tonalidad = item?.tonalidad || t('noTone');
                                                return (
                                                    <li
                                                        id={`opt-prod-${key}`}
                                                        role="option"
                                                        aria-selected={activeIndex === idx}
                                                        key={key}
                                                        ref={(el) => (suggestionRefs.current[idx] = el)}
                                                        className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${activeIndex === idx ? 'bg-gray-100' : ''
                                                            }`}
                                                        onClick={() => selectProduct(item)}
                                                        onMouseEnter={() => setActiveIndex(idx)}
                                                    >
                                                        <img
                                                            src={item?.image || defaultImageUrl}
                                                            alt={nombre}
                                                            className="w-10 h-10 object-cover rounded-full mr-3 shadow-sm"
                                                            onError={(e) => (e.currentTarget.src = defaultImageUrl)}
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-gray-800 truncate">
                                                                {highlight(nombre, query)}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {coleccion} &middot; {tonalidad}
                                                            </p>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                                {/* Colecciones */}
                                {collectionSuggestions.length > 0 && (
                                    <div>
                                        <div className="px-4 py-1 text-xs text-gray-500 uppercase">
                                            {t('collectionsSection')}
                                        </div>
                                        <ul role="listbox" aria-label={t('collectionsSection')}>
                                            {collectionSuggestions.map((col, idx) => {
                                                const gIdx = productSuggestions.length + idx;
                                                return (
                                                    <li
                                                        id={`opt-col-${col}`}
                                                        role="option"
                                                        aria-selected={activeIndex === gIdx}
                                                        key={col}
                                                        ref={(el) => (suggestionRefs.current[gIdx] = el)}
                                                        className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${activeIndex === gIdx ? 'bg-gray-100' : ''
                                                            }`}
                                                        onClick={() => selectCollection(col)}
                                                        onMouseEnter={() => setActiveIndex(gIdx)}
                                                    >
                                                        <p className="font-medium text-gray-800">
                                                            {t('collectionPrefix')} {highlight(col, query)}
                                                        </p>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                                {/* Ver todos */}
                                <div
                                    className="sticky bottom-0 bg-white border-t text-center cursor-pointer hover:bg-gray-100 px-4 py-3"
                                    onClick={() => submitSearch(query)}
                                >
                                    <span className="font-medium text-blue-600">{t('seeAll')}</span>
                                </div>
                            </>
                        ) : (
                            <div className="px-4 py-2 text-center text-sm text-gray-600">{t('noResults')}</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Historial */}
            {history.length > 0 && query.length < 3 && (
                <div className="absolute z-50 w-full bg-white shadow-lg rounded-lg mt-1 overflow-y-auto max-h-60">
                    <div className="px-4 py-2 border-b font-semibold text-gray-700">{t('recent')}</div>
                    <ul>
                        {history.map((item, idx) => (
                            <li
                                key={idx}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleHistoryClick(item)}
                                title={
                                    item.type === 'product'
                                        ? t('productsSection')
                                        : item.type === 'collection'
                                            ? t('collectionsSection')
                                            : t('seeAll')
                                }
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
