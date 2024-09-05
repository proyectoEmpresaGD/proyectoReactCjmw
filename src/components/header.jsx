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
    const [isHovered, setIsHovered] = useState(false); // Estado para manejar el hover

    const languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'it', label: 'Italian' }
    ];

    // Función para cerrar todos los dropdowns
    const closeAllDropdowns = () => {
        setShowBrandsDropdown(false);
        setShowUserDropdown(false);
        setShowLanguageDropdown(false);
        setShowSearchBar(false);
        setShowCart(false);
    };

    // Cierra los dropdowns si se hace clic fuera de ellos
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown, .cart, .search, .language')) {
                closeAllDropdowns();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = (dropdown) => {
        closeAllDropdowns(); // Cerramos todos los dropdowns antes de abrir uno nuevo
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
            case 'cart':
                setShowCart(!showCart);
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
        translatePage(selectedOption.value); // Traduce la página solo cuando el usuario selecciona un idioma
    };

    return (
        <>
            <ScrollToTop />
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isHovered || showSearchBar || showUserDropdown || showBrandsDropdown || showLanguageDropdown || showCart ? 'bg-white shadow-md' : 'bg-transparent'
                    }`}
                onMouseEnter={() => setIsHovered(true)} // Cambia el fondo a blanco al hacer hover
                onMouseLeave={() => setIsHovered(false)} // Vuelve a ser transparente al dejar el hover
            >
                <div className="container mx-auto flex items-center justify-between py-2 px-2 lg:px-2">
                    <div className="flex items-center">
                        <button className="text-gray-800 lg:hidden focus:outline-none" onClick={() => toggleDropdown('menu')}>
                            {showMenu ? <RiArrowDropUpLine size={24} /> : <RiMenu3Fill size={24} />}
                        </button>

                        <Link to="/" className='flex items-center space-x-2 text-gray-800 hover:scale-110 duration-150 font-semibold py-2 px-2 rounded-lg'>
                            <img className="h-8 lg:h-14" src={logoSrc} alt="Logo" />
                            <span className="hidden lg:block"></span>
                        </Link>
                    </div>
                    <div className="hidden lg:flex flex-grow justify-center items-center space-x-4">
                        <Link to="/" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Inicio</Link>
                        <div className="relative">
                            <button
                                className="flex items-center text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg focus:outline-none"
                                onClick={() => toggleDropdown('brands')}>
                                <span>Marcas</span>
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

                        <Link to="/products" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Muestras</Link>
                        <Link to="/about" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Sobre nosotros</Link>
                        <Link to="/contact" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Contáctanos</Link>
                        <Link to="/contract" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Contract</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative dropdown">
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
                        <div className="relative search">
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('search')}>
                                <RiSearchLine size={24} />
                            </button>
                        </div>
                        <div className="relative language">
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
                        <div className="relative cart">
                            <button className="text-gray-800 focus:outline-none relative" onClick={() => toggleDropdown('cart')}>
                                <RiShoppingCartFill size={24} />
                                {itemCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1" style={{ transform: 'translate(50%, -50%)', fontSize: '0.75rem' }}>
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                            {showCart && <ShoppingCart onClose={() => setShowCart(false)} />}
                        </div>
                    </div>
                </div>
                <div className={`bg-white lg:hidden ${showMenu ? '' : 'hidden'}`}>
                    <div className="bg-ivory py-2 px-4">
                        <Link to="/" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Inicio</Link>
                        <Link to="/products" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Muestras</Link>
                        <Link to="/about" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Sobre nosotros</Link>
                        <Link to="/contact" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Contáctanos</Link>
                        <Link to="/contract" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Contract</Link>
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
                                                {item.nombre}
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
