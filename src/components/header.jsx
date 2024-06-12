import { useState, useEffect, useRef } from 'react';
import {
    RiMenu3Fill, RiSearchLine, RiShoppingCartFill, RiUserFill,
    RiArrowDropDownLine, RiArrowDropUpLine
} from 'react-icons/ri';
import { FaGlobe } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ShoppingCart from './shoppingCart';
import { useCart } from './CartContext';
import ScrollToTop from './ScrollToTop';
import Select from 'react-select';
import 'tailwindcss/tailwind.css';

const API_KEY = 'AIzaSyBEFFDik11kmsKfW1pelqJ1k1_UbakEzvo';

export const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [logoSrc, setLogoSrc] = useState('/logoCJM.png');
    const [showCart, setShowCart] = useState(false);
    const { itemCount } = useCart();
    const [showMenu, setShowMenu] = useState(false);
    const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const searchInputRef = useRef(null);
    const [inputText, setInputText] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState({ value: 'es', label: 'Spanish' });

    const languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'it', label: 'Italian' }
    ];

    // Función para traducir texto utilizando la API de Google Translate
    const translateText = async (text, targetLanguage) => {
        try {
            const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    target: targetLanguage
                })
            });
            const data = await response.json();
            return data.data.translations[0].translatedText;
        } catch (error) {
            console.error('Error translating text:', error);
            return '';
        }
    };

    // Función para decodificar entidades HTML
    const decodeHTMLEntities = (text) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    };

    // Función para aplicar traducciones personalizadas
    const customTranslations = (text, targetLanguage) => {
        const customTerms = {
            "telas": { "en": "Fabrics", "fr": "Tissu", "it": "Tessuto", "de": "Stoff", "es": "Telas" }
        };

        Object.keys(customTerms).forEach(term => {
            const translation = customTerms[term][targetLanguage];
            if (translation) {
                const regex = new RegExp(`\\b${term}\\b`, 'gi');
                text = text.replace(regex, translation);
            }
        });

        return text;
    };

    // Función para traducir la página
    const translatePage = async (targetLanguage) => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }

        for (const node of nodes) {
            const originalText = node.nodeValue;
            if (originalText && originalText.trim()) {
                let translatedText = await translateText(originalText.trim(), targetLanguage);
                translatedText = decodeHTMLEntities(translatedText); // Decodificar entidades HTML
                translatedText = customTranslations(translatedText, targetLanguage); // Aplicar traducciones personalizadas
                node.nodeValue = translatedText;
            }
        }
    };

    // Función para aplicar el idioma guardado
    const applySavedLanguage = async () => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage) {
            await translatePage(savedLanguage);
        }
    };

    useEffect(() => {
        setLanguages(languageOptions);

        switch (location.pathname) {
            case '/harbourHome': setLogoSrc('/logoHarbour.png'); break;
            case '/arenaHome': setLogoSrc('/logoArena.png'); break;
            case '/cjmHome': setLogoSrc('/logoCJM.png'); break;
            case '/flamencoHome': setLogoSrc('/logoFlamenco.png'); break;
            default: setLogoSrc('/logoCJM.png'); break;
        }

        applySavedLanguage();
    }, [location.pathname]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const closeAllDropdowns = () => {
        setShowBrandsDropdown(false);
        setShowUserDropdown(false);
        setShowLanguageDropdown(false);
    };

    const toggleDropdown = (dropdown) => {
        closeAllDropdowns();
        switch (dropdown) {
            case 'menu':
                setShowMenu(!showMenu);
                break;
            case 'brands':
                setShowBrandsDropdown(!showBrandsDropdown);
                break;
            case 'user':
                setShowUserDropdown(!showUserDropdown);
                break;
            case 'language':
                setShowLanguageDropdown(!showLanguageDropdown);
                break;
            case 'search':
                setShowSearchBar(!showSearchBar);
                setTimeout(() => {
                    if (searchInputRef.current) {
                        searchInputRef.current.focus();
                    }
                }, 100);
                break;
            default:
                break;
        }
    };

    const handleSearchInputChange = async (event) => {
        const query = event.target.value;
        if (query.length >= 3) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/search?query=${query}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const results = await response.json();
                const filteredResults = results.filter(result =>
                    !searchHistory.some(historyItem => historyItem.codprodu === result.codprodu)
                );
                setSuggestions(filteredResults.slice(0, 3));
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const query = searchInputRef.current.value;
        if (query.length > 0) {
            const newHistory = [query, ...searchHistory].slice(0, 2);
            setSearchHistory(newHistory);
            setShowSearchBar(false);
            navigate(`/products?search=${query}`);
        }
    };

    const handleRecentSearchClick = (search) => {
        setShowSearchBar(false);
        navigate(`/products?search=${search}`);
    };

    const handleSuggestionClick = (item) => {
        const newHistory = [item.desprodu, ...searchHistory].slice(0, 2);
        setSearchHistory(newHistory);
        setShowSearchBar(false);
        navigate(`/products?productId=${item.codprodu}`);
    };

    const handleLanguageChange = (selectedOption) => {
        setSelectedLanguage(selectedOption);
        localStorage.setItem('preferredLanguage', selectedOption.value);
        translatePage(selectedOption.value);
    };

    return (
        <>
            <ScrollToTop />
            <header className="fixed top-0 left-0 w-full bg-white z-50">
                <div className="container mx-auto flex items-center justify-between py-4 px-6 lg:px-8">
                    <div className="flex items-center">
                        <button className="text-gray-800 lg:hidden focus:outline-none" onClick={() => toggleDropdown('menu')}>
                            {showMenu ? <RiArrowDropUpLine size={24} /> : <RiMenu3Fill size={24} />}
                        </button>
                        <Link to="/" className="flex items-center space-x-2 text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">
                            <img className="h-8 lg:h-10" src={logoSrc} alt="Logo" />
                            <span className="hidden lg:block">Home</span>
                        </Link>
                    </div>
                    <div className="hidden lg:flex flex-grow justify-center items-center space-x-4">
                        <Link to="/products" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Productos</Link>
                        <div className="relative">
                            <button
                                className="flex items-center text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg focus:outline-none"
                                onClick={() => toggleDropdown('brands')}>
                                <span>Marcas & Colecciones</span>
                                {showBrandsDropdown ?
                                    <RiArrowDropUpLine size={16} className="ml-2" /> :
                                    <RiArrowDropDownLine size={16} className="ml-2" />
                                }
                            </button>
                            {showBrandsDropdown && (
                                <div className="bg-slate-100 absolute top-full left-0 mt-1 bg-ivory shadow-lg rounded-md py-2 w-40 z-50">
                                    <Link to="/arenaHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Arena</Link>
                                    <Link to="/harbourHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Harbour</Link>
                                    <Link to="/cjmHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">CJM</Link>
                                    <Link to="/flamencoHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Flamenco</Link>
                                </div>
                            )}
                        </div>
                        <Link to="/about" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Sobre nosotros</Link>
                        <Link to="/contact" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Contáctanos</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('user')}>
                                <RiUserFill size={24} />
                            </button>
                            {showUserDropdown && (
                                <div className="bg-slate-100 absolute top-full right-0 bg-ivory shadow-lg rounded-md py-2 w-40 z-50">
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => setShowUserDropdown(false)}>Sign In</button>
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => setShowUserDropdown(false)}>Sign Out</button>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('search')}>
                                <RiSearchLine size={24} />
                            </button>
                        </div>
                        <div className="relative">
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('language')}>
                                <FaGlobe size={24} />
                            </button>
                            {showLanguageDropdown && (
                                <div className="absolute top-full right-0 bg-ivory shadow-lg rounded-md py-2 w-40 z-50">
                                    <Select
                                        options={languageOptions}
                                        value={selectedLanguage}
                                        onChange={handleLanguageChange}
                                        menuPlacement="auto"
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                cursor: 'pointer',
                                            }),
                                            menu: (provided) => ({
                                                ...provided,
                                                zIndex: 9999,
                                            }),
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button className="text-gray-800 focus:outline-none relative" onClick={() => setShowCart(!showCart)}>
                                <RiShoppingCartFill size={24} />
                                {itemCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1" style={{ transform: 'translate(50%, -50%)', fontSize: '0.75rem' }}>
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`bg-white lg:hidden ${showMenu ? '' : 'hidden'}`}>
                    <div className="bg-ivory py-2 px-4">
                        <Link to="/about" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg">Sobre nosotros</Link>
                        <Link to="/contact" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg">Contáctanos</Link>
                        <Link to="/products" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg">Productos</Link>
                        <div className="relative">
                            <button className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg focus:outline-none" onClick={() => toggleDropdown('brands')}>
                                Brands {showBrandsDropdown ? <RiArrowDropUpLine size={16} /> : <RiArrowDropDownLine size={16} />}
                            </button>
                            {showBrandsDropdown && (
                                <div className={`bg-slate-100 absolute top-full left-0 mt-1 bg-ivory shadow-lg rounded-md py-2 w-40 z-50`}>
                                    <Link to="/arenaHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Arena</Link>
                                    <Link to="/harbourHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Harbour</Link>
                                    <Link to="/cjmHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">CJM</Link>
                                    <Link to="/flamencoHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Flamenco</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showCart && <ShoppingCart onClose={() => setShowCart(false)} />}
            </header>

            {showSearchBar && (
                <div className="fixed top-20 left-0 w-full bg-white z-50 px-6 py-2 shadow-lg transition duration-300 ease-in-out">
                    <div className="container mx-auto">
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search..."
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none"
                                onChange={handleSearchInputChange}
                            />
                        </form>
                        {(searchHistory.length > 0 || suggestions.length > 0) && (
                            <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {searchHistory.length > 0 && (
                                    <div>
                                        <div className="p-2 border-b border-gray-300 text-gray-800">
                                            <strong>Recent Searches:</strong>
                                        </div>
                                        <ul>
                                            {searchHistory.map((search, index) => (
                                                <li key={index} className="p-1 cursor-pointer hover:bg-gray-200" onClick={() => handleRecentSearchClick(search)}>
                                                    {search}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {suggestions.length > 0 && (
                                    <div>
                                        <div className="p-2 border-b border-gray-300 text-gray-800">
                                            <strong>Suggestions:</strong>
                                        </div>
                                        {suggestions.map((item, index) => (
                                            <div key={index} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSuggestionClick(item)}>
                                                {item.desprodu}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;