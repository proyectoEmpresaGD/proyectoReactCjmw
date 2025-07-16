import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash.debounce';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';
import { defaultImageUrl } from '../Constants/constants';
import { useTranslation } from 'react-i18next';

// Variantes para la animación del dropdown
const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// Normaliza la consulta
const normalizeQuery = q => q.trim().replace(/\s+/g, ' ');

const SearchBar = ({ closeSearchBar }) => {
    const { t } = useTranslation('search');
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [productSuggestions, setProductSuggestions] = useState([]);
    const [collectionSuggestions, setCollectionSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const inputRef = useRef(null);
    const suggestionRefs = useRef([]);

    // Fetch productos
    const fetchProductSuggestions = async q => {
        try {
            const norm = normalizeQuery(q);
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/products/search?query=${encodeURIComponent(norm)}`,
                { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate' } }
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            setProductSuggestions(Array.isArray(data.products) ? data.products : []);
        } catch {
            setProductSuggestions([]);
        }
    };

    // Fetch colecciones
    const fetchCollectionSuggestions = async q => {
        try {
            const norm = normalizeQuery(q);
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/products/searchCollections?searchTerm=${encodeURIComponent(norm)}`,
                { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate' } }
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            setCollectionSuggestions(Array.isArray(data) ? data : []);
        } catch {
            setCollectionSuggestions([]);
        }
    };

    // Lanza ambos
    const fetchAll = async q => {
        if (q.length < 3) {
            setProductSuggestions([]);
            setCollectionSuggestions([]);
            return;
        }
        setIsLoading(true);
        await Promise.all([fetchProductSuggestions(q), fetchCollectionSuggestions(q)]);
        setIsLoading(false);
    };

    const debouncedFetch = useCallback(debounce(fetchAll, 300), []);

    const handleChange = e => {
        const val = e.target.value.toUpperCase();
        setQuery(val);
        debouncedFetch(val);
    };

    const total = productSuggestions.length + collectionSuggestions.length;

    const handleKeyDown = e => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => Math.min(prev + 1, total - 1));
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => Math.max(prev - 1, 0));
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
    }, []);

    const addToHistory = term => {
        setHistory(prev => [term, ...prev.filter(h => h !== term)].slice(0, 5));
    };

    const selectProduct = item => {
        const txt = `${item.nombre} (${item.coleccion || t('noCollection')}, ${item.tonalidad || t('noTone')})`;
        setQuery(txt);
        addToHistory(txt);
        navigate(`/products?productId=${encodeURIComponent(item.codprodu)}&page=1`);
        reset();
    };

    const selectCollection = col => {
        const txt = `${t('collectionPrefix')} ${col}`;
        setQuery(txt);
        addToHistory(txt);
        navigate(`/products?collection=${encodeURIComponent(col)}&page=1`);
        reset();
    };

    const submitSearch = q => {
        const norm = normalizeQuery(q);
        if (!norm) return;
        addToHistory(norm);
        navigate(`/products?search=${encodeURIComponent(norm)}&page=1`);
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

    return (
        <div className="relative w-full max-w-md">
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
                        style={{ maxHeight: '240px', overflowY: 'auto' }}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={dropdownVariants}
                    >
                        {isLoading ? (
                            <div className="px-4 py-2 text-center text-sm text-gray-600">{t('loading')}</div>
                        ) : total > 0 ? (
                            <>
                                {/* Productos */}
                                {productSuggestions.length > 0 && (
                                    <div>
                                        <div className="px-4 py-1 text-xs text-gray-500 uppercase">{t('productsSection')}</div>
                                        <ul>
                                            {productSuggestions.map((item, idx) => (
                                                <li
                                                    key={item.codprodu}
                                                    ref={el => (suggestionRefs.current[idx] = el)}
                                                    className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${activeIndex === idx ? 'bg-gray-100' : ''
                                                        }`}
                                                    onClick={() => selectProduct(item)}
                                                >
                                                    <img
                                                        src={item.image || defaultImageUrl}
                                                        alt={item.nombre}
                                                        className="w-10 h-10 object-cover rounded-full mr-3 shadow-sm"
                                                        onError={e => (e.target.src = defaultImageUrl)}
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800">{item.nombre}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {item.coleccion || t('noCollection')} &middot; {item.tonalidad || t('noTone')}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {/* Colecciones */}
                                {collectionSuggestions.length > 0 && (
                                    <div>
                                        <div className="px-4 py-1 text-xs text-gray-500 uppercase">{t('collectionsSection')}</div>
                                        <ul>
                                            {collectionSuggestions.map((col, idx) => {
                                                const gIdx = productSuggestions.length + idx;
                                                return (
                                                    <li
                                                        key={col}
                                                        ref={el => (suggestionRefs.current[gIdx] = el)}
                                                        className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${activeIndex === gIdx ? 'bg-gray-100' : ''
                                                            }`}
                                                        onClick={() => selectCollection(col)}
                                                    >
                                                        <p className="font-medium text-gray-800">{t('collectionPrefix')} {col}</p>
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
                            <div className="px-4 py-2 text-center text-sm text-gray-600">
                                {t('noResults')}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Historial */}
            {history.length > 0 && query.length < 3 && (
                <div className="absolute z-50 w-full bg-white shadow-lg rounded-lg mt-1 overflow-y-auto max-h-60">
                    <div className="px-4 py-2 border-b font-semibold text-gray-700">{t('recent')}</div>
                    <ul>
                        {history.map((term, idx) => (
                            <li
                                key={idx}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => submitSearch(term)}
                            >
                                {term}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
