import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { defaultImageUrl } from '../Constants/constants';

// Variantes para la animación del dropdown
const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// Función para normalizar la consulta (trim y eliminar espacios extra)
const normalizeQuery = (q) => q.trim().replace(/\s+/g, ' ');

const SearchBar = ({ closeSearchBar }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [productSuggestions, setProductSuggestions] = useState([]);
    const [collectionSuggestions, setCollectionSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);

    const inputRef = useRef(null);
    const suggestionRefs = useRef([]);

    // API: obtener sugerencias de productos (usa ILIKE en el backend para ser insensible a mayúsculas)
    const fetchProductSuggestions = async (q) => {
        try {
            const normalized = normalizeQuery(q);
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/products/search?query=${encodeURIComponent(normalized)}`,
                { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate' } }
            );
            if (!res.ok) throw new Error('Error fetching product suggestions');
            const data = await res.json();
            if (Array.isArray(data.products) && data.products.length > 0) {
                setProductSuggestions(data.products.slice(0, 5));
            } else {
                setProductSuggestions([]);
            }
        } catch (error) {
            console.error('Error fetching product suggestions:', error);
            setProductSuggestions([]);
        }
    };

    // API: obtener sugerencias de colecciones
    const fetchCollectionSuggestions = async (q) => {
        try {
            const normalized = normalizeQuery(q);
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/products/searchCollections?searchTerm=${encodeURIComponent(normalized)}`,
                { headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate' } }
            );
            if (!res.ok) throw new Error('Error fetching collection suggestions');
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                setCollectionSuggestions(data.slice(0, 5));
            } else {
                setCollectionSuggestions([]);
            }
        } catch (error) {
            console.error('Error fetching collection suggestions:', error);
            setCollectionSuggestions([]);
        }
    };

    const fetchAllSuggestions = async (q) => {
        if (q.length < 3) {
            setProductSuggestions([]);
            setCollectionSuggestions([]);
            return;
        }
        setIsLoading(true);
        await Promise.all([fetchProductSuggestions(q), fetchCollectionSuggestions(q)]);
        setIsLoading(false);
    };

    const debouncedFetch = useCallback(debounce(fetchAllSuggestions, 300), []);

    // Convertir el input a mayúsculas siempre
    const handleChange = (e) => {
        const val = e.target.value.toUpperCase();
        setQuery(val);
        debouncedFetch(val);
    };

    const totalSuggestions = productSuggestions.length + collectionSuggestions.length;

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, totalSuggestions - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0) {
                if (activeIndex < productSuggestions.length) {
                    selectProductSuggestion(productSuggestions[activeIndex]);
                } else {
                    const colIndex = activeIndex - productSuggestions.length;
                    selectCollectionSuggestion(collectionSuggestions[colIndex]);
                }
            } else {
                submitSearch(query);
            }
        }
    };

    useEffect(() => {
        if (activeIndex >= 0 && suggestionRefs.current[activeIndex]) {
            suggestionRefs.current[activeIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [activeIndex]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const selectProductSuggestion = (item) => {
        const displayText = `${item.nombre} (${item.coleccion || 'SIN COLECCIÓN'}, ${item.tonalidad || 'SIN TONALIDAD'})`;
        setQuery(displayText);
        addToHistory(displayText);
        navigate(`/products?productId=${encodeURIComponent(item.codprodu)}`);
        setActiveIndex(-1);
        setProductSuggestions([]);
        setCollectionSuggestions([]);
        if (closeSearchBar) closeSearchBar();
    };

    const selectCollectionSuggestion = (col) => {
        const displayText = `COLECCIÓN: ${col}`;
        setQuery(displayText);
        addToHistory(displayText);
        navigate(`/products?collection=${encodeURIComponent(col)}`);
        setActiveIndex(-1);
        setProductSuggestions([]);
        setCollectionSuggestions([]);
        if (closeSearchBar) closeSearchBar();
    };

    const submitSearch = (q) => {
        const normalized = normalizeQuery(q);
        if (normalized === '') return;
        addToHistory(normalized);
        navigate(`/products?search=${encodeURIComponent(normalized)}`);
        setProductSuggestions([]);
        setCollectionSuggestions([]);
        if (closeSearchBar) closeSearchBar();
    };

    const addToHistory = (term) => {
        setHistory((prev) => [term, ...prev.filter((h) => h !== term)].slice(0, 5));
    };

    useEffect(() => {
        if (query === '') setActiveIndex(-1);
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
                    placeholder="BUSCAR TELAS... (EJ. SAN FERNANDO, GRAZALEMA, FLA000860)"
                    value={query}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    role="combobox"
                    aria-expanded={query.length >= 3 && totalSuggestions > 0}
                    aria-controls="search-suggestions"
                />
                {query && (
                    <button onClick={() => setQuery('')} className="focus:outline-none" aria-label="Clear search">
                        <RiCloseLine className="text-gray-500" size={20} />
                    </button>
                )}
            </div>
            {query.length > 0 && query.length < 3 && (
                <div className="mt-1 text-xs text-gray-500">ESCRIBE AL MENOS 3 CARACTERES PARA BUSCAR.</div>
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
                            <div className="px-4 py-2 text-center text-sm text-gray-600">CARGANDO...</div>
                        ) : totalSuggestions > 0 ? (
                            <>
                                {productSuggestions.length > 0 && (
                                    <div>
                                        <div className="px-4 py-1 text-xs text-gray-500 uppercase">PRODUCTOS</div>
                                        <ul>
                                            {productSuggestions.map((item, idx) => (
                                                <li
                                                    key={item.codprodu}
                                                    ref={(el) => (suggestionRefs.current[idx] = el)}
                                                    role="option"
                                                    aria-selected={activeIndex === idx}
                                                    className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${activeIndex === idx ? 'bg-gray-100' : ''}`}
                                                    onClick={() => selectProductSuggestion(item)}
                                                >
                                                    <img
                                                        src={item.image || defaultImageUrl}
                                                        alt={item.nombre}
                                                        className="w-10 h-10 object-cover rounded-full mr-3 shadow-sm"
                                                        onError={(e) => { e.target.src = defaultImageUrl; }}
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800">{item.nombre}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {item.coleccion || 'SIN COLECCIÓN'} · {item.tonalidad || 'SIN TONALIDAD'}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {collectionSuggestions.length > 0 && (
                                    <div>
                                        <div className="px-4 py-1 text-xs text-gray-500 uppercase">COLECCIONES</div>
                                        <ul>
                                            {collectionSuggestions.map((col, idx) => {
                                                const globalIndex = productSuggestions.length + idx;
                                                return (
                                                    <li
                                                        key={col}
                                                        ref={(el) => (suggestionRefs.current[globalIndex] = el)}
                                                        role="option"
                                                        aria-selected={activeIndex === globalIndex}
                                                        className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${activeIndex === globalIndex ? 'bg-gray-100' : ''}`}
                                                        onClick={() => selectCollectionSuggestion(col)}
                                                    >
                                                        <p className="font-medium text-gray-800">COLECCIÓN: {col}</p>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                                <div
                                    className="sticky bottom-0 bg-white border-t text-center cursor-pointer hover:bg-gray-100 px-4 py-3"
                                    onClick={() => submitSearch(query)}
                                >
                                    <span className="font-medium text-blue-600">VER TODOS LOS RESULTADOS</span>
                                </div>
                            </>
                        ) : (
                            <div className="px-4 py-2 text-center text-sm text-gray-600">
                                NO SE ENCONTRARON RESULTADOS. INTENTA BUSCAR POR <strong>NOMBRE, COLECCIÓN</strong>, <strong>TONALIDAD</strong> O <strong>CÓDIGO DE PRODUCTO</strong>.
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {history.length > 0 && query.length < 3 && (
                <div className="absolute z-50 w-full bg-white shadow-lg rounded-lg mt-1 overflow-y-auto max-h-60">
                    <div className="px-4 py-2 border-b font-semibold text-gray-700">BÚSQUEDAS RECIENTES</div>
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
