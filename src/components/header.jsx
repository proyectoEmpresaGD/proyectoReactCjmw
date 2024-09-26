import { useState, useEffect, useRef } from 'react';
import {
    RiMenu3Fill, RiSearchLine, RiShoppingCartFill, RiUserFill,
    RiArrowDropDownLine, RiArrowDropUpLine
} from 'react-icons/ri';
import { FaGlobe } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ShoppingCart from './shoppingCart';
import { useCart } from './CartContext';
import ScrollToTop from './ScrollToTop';
import Select from 'react-select';
import 'tailwindcss/tailwind.css';

export const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { itemCount } = useCart();

    const [showCart, setShowCart] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
    const [showProductsDropdown, setShowProductsDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showClearButton, setShowClearButton] = useState(false);
    const searchInputRef = useRef(null);
    const [selectedLanguage, setSelectedLanguage] = useState({ value: 'es', label: 'Spanish' });
    const [isHovered, setIsHovered] = useState(false);
    const [filtersActive, setFiltersActive] = useState(false);

    const searchRef = useRef(null);
    const cartRef = useRef(null);
    const userRef = useRef(null);
    const languageRef = useRef(null);
    const menuRef = useRef(null);
    const brandsRef = useRef(null);
    const productsRef = useRef(null);

    const languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'de', label: 'German' },
        { value: 'it', label: 'Italian' }
    ];

    // Map URLs to logos
    const brandLogos = {
        '/arenaHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoArena.png',
        '/harbourHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoHarbour.png',
        '/cjmHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoCJM-sintexto.png',
        '/flamencoHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoFlamenco.png',
        '/bassariHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOBASSARI_01.png',
    };

    // Default corporate logo
    const defaultLogo = 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoCJM_group.png';

    // Determine current logo based on location
    const logoSrc = brandLogos[location.pathname] || defaultLogo;

    const closeAllDropdowns = () => {
        setShowBrandsDropdown(false);
        setShowProductsDropdown(false);
        setShowUserDropdown(false);
        setShowLanguageDropdown(false);
    };

    const closeSearchAndCart = () => {
        setShowSearchBar(false);
        setShowCart(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                !searchRef.current?.contains(event.target) &&
                !cartRef.current?.contains(event.target) &&
                !userRef.current?.contains(event.target) &&
                !languageRef.current?.contains(event.target) &&
                !menuRef.current?.contains(event.target) &&
                !brandsRef.current?.contains(event.target) &&
                !productsRef.current?.contains(event.target)
            ) {
                closeAllDropdowns();
            }
            if (!searchRef.current?.contains(event.target) && !cartRef.current?.contains(event.target)) {
                closeSearchAndCart();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = (dropdown) => {
        closeAllDropdowns();
        switch (dropdown) {
            case 'menu':
                setShowMenu(!showMenu);
                break;
            case 'brands':
                setShowBrandsDropdown(!showBrandsDropdown);
                break;
            case 'products':
                setShowProductsDropdown(!showProductsDropdown);
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
        setSearchQuery(query);

        if (query.length >= 3) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/search?query=${query}`);
                if (!response.ok) {
                    throw new Error('Error fetching suggestions');
                }
                const results = await response.json();

                if (Array.isArray(results.products)) {
                    setSuggestions(results.products.slice(0, 3));
                } else {
                    setSuggestions([]);
                }
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
        if (searchQuery.length > 0) {
            const newHistory = [searchQuery, ...searchHistory].slice(0, 3);
            setSearchHistory(newHistory);
            setShowSearchBar(false);
            setFiltersActive(true);
            setShowClearButton(true);

            navigate(`/products?search=${searchQuery}`);
        }
    };

    const handleRecentSearchClick = (search) => {
        setSearchQuery(search);
        setShowSearchBar(false);
        setFiltersActive(true);
        navigate(`/products?search=${search}`);
    };

    const handleSuggestionClick = (item) => {
        const newHistory = [item.nombre, ...searchHistory].slice(0, 3);
        setSearchHistory(newHistory);
        setSearchQuery(item.nombre);
        setShowSearchBar(false);
        setFiltersActive(true);
        navigate(`/products?productId=${item.codprodu}`);
    };

    const handleLanguageChange = (selectedOption) => {
        setSelectedLanguage(selectedOption);
        localStorage.setItem('preferredLanguage', selectedOption.value);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setSearchHistory([]);
        setShowClearButton(false);
        setFiltersActive(false);
        navigate('/products');
    };

    const handleLinkClick = (path) => {
        setTimeout(() => {
            navigate(path);
        }, 100);
        setShowMenu(false);
        setShowBrandsDropdown(false);
        setShowProductsDropdown(false);
    };

    return (
        <>
            <ScrollToTop />
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isHovered || showSearchBar || showUserDropdown || showBrandsDropdown || showProductsDropdown || showLanguageDropdown || showCart || showMenu ? 'bg-white shadow-md' : 'bg-transparent'
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="container mx-auto flex items-center justify-between py-2 px-4 lg:px-8">
                    <div className="flex items-center">
                        <button className="text-gray-800 lg:hidden focus:outline-none" onClick={() => toggleDropdown('menu')} ref={menuRef}>
                            {showMenu ? <RiArrowDropUpLine size={24} /> : <RiMenu3Fill size={24} />}
                        </button>

                        <Link to="/" className="flex items-center space-x-2 text-gray-800 hover:scale-110 duration-150 font-semibold py-2 px-2 rounded-lg">
                            <img className="h-9 lg:h-10 xl:h-14" src={logoSrc} alt="Logo" />
                        </Link>
                    </div>

                    <div className="hidden lg:flex flex-grow justify-center items-center space-x-4">
                        <Link to="/" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Inicio</Link>
                        <div className="relative" ref={brandsRef}>
                            <button
                                className="flex items-center text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg focus:outline-none"
                                onClick={() => toggleDropdown('brands')}
                            >
                                <span>Marcas</span>
                                {showBrandsDropdown ? <RiArrowDropUpLine size={16} className="ml-2" /> : <RiArrowDropDownLine size={16} className="ml-2" />}
                            </button>
                            {showBrandsDropdown && (
                                <div className="bg-slate-100 absolute w-full top-full left-0 mt-1 bg-ivory shadow-lg rounded-md py-2 z-50 flex flex-col justify-center items-center">
                                    <button onMouseDown={() => handleLinkClick('/arenaHome')} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Arena</button>
                                    <button onMouseDown={() => handleLinkClick('/harbourHome')} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Harbour</button>
                                    <button onMouseDown={() => handleLinkClick('/cjmHome')} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">CJM</button>
                                    <button onMouseDown={() => handleLinkClick('/flamencoHome')} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Flamenco</button>
                                    <button onMouseDown={() => handleLinkClick('/bassariHome')} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Bassari</button>
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={productsRef}>
                            <button
                                className="flex items-center text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg focus:outline-none"
                                onClick={() => toggleDropdown('products')}
                            >
                                <span>Productos</span>
                                {showProductsDropdown ? <RiArrowDropUpLine size={16} className="ml-2" /> : <RiArrowDropDownLine size={16} className="ml-2" />}
                            </button>
                            {showProductsDropdown && (
                                <div className="bg-slate-100 absolute top-full left-0 mt-1 bg-ivory shadow-lg rounded-md py-2 w-40 z-50 flex flex-col justify-center items-center">
                                    <button onMouseDown={() => handleLinkClick('/products')} className="block py-2 w-full text-gray-800 hover:bg-gray-200 rounded-md text-center">Todos los productos</button>
                                    <button onMouseDown={() => handleLinkClick('/products?type=papel')} className="block py-2 w-full text-gray-800 hover:bg-gray-200 rounded-md text-center">Papeles</button>
                                    <button onMouseDown={() => handleLinkClick('/products?type=tela')} className="block py-2 w-full text-gray-800 hover:bg-gray-200 rounded-md text-center">Telas</button>
                                </div>
                            )}
                        </div>

                        <Link to="/about" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Sobre nosotros</Link>
                        <Link to="/contact" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Contáctanos</Link>
                        <Link to="/contract" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Contract</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative dropdown" ref={userRef}>
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('user')}>
                                <RiUserFill size={24} />
                            </button>
                            {showUserDropdown && (
                                <div className="bg-slate-100 absolute top-full right-0 bg-ivory shadow-lg rounded-md py-2 w-40 z-50">
                                    <p className="block px-4 py-2 text-gray-500 hover:bg-gray-200 w-full text-left">Feature in development</p>
                                </div>
                            )}
                        </div>

                        <div className="relative search" ref={searchRef}>
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('search')}>
                                <RiSearchLine size={24} />
                            </button>
                            {showSearchBar && (
                                <div className="absolute top-full right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-50 p-4">
                                    <form onSubmit={handleSearchSubmit}>
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={searchQuery}
                                            placeholder="Buscar..."
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none"
                                            onChange={handleSearchInputChange}
                                        />
                                    </form>
                                    {(searchHistory.length > 0 || suggestions.length > 0) && (
                                        <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {searchHistory.length > 0 && (
                                                <div>
                                                    <div className="p-2 border-b border-gray-300 text-gray-800">
                                                        <strong>Búsquedas recientes:</strong>
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
                                                        <strong>Sugerencias:</strong>
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
                            )}
                        </div>

                        <div className="relative cart" ref={cartRef}>
                            <button className="text-gray-800 focus:outline-none relative" onClick={() => toggleDropdown('cart')}>
                                <RiShoppingCartFill size={24} />
                                {itemCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1" style={{ transform: 'translate(50%, -50%)', fontSize: '0.75rem' }}>
                                        {itemCount}
                                    </span>
                                )}
                            </button>
                            {showCart && (
                                <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg p-4 z-50">
                                    <ShoppingCart onClose={() => setShowCart(false)} />
                                </div>
                            )}
                        </div>

                        <div className="relative language" ref={languageRef}>
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('language')}>
                                <FaGlobe size={24} />
                            </button>
                            {showLanguageDropdown && (
                                <div className="absolute top-full right-0 bg-white shadow-lg rounded-md py-2 w-40 z-50">
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
                    </div>
                </div>

                <div className={`lg:hidden transition-all ${showMenu ? 'block' : 'hidden'} fixed top-0 left-0 w-full h-full bg-white z-50`}>
                    <div className="bg-white shadow-lg py-4 px-6 h-full">
                        <div className="flex justify-between mb-4">
                            <Link to="/" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">
                                <img className="h-10" src={logoSrc} alt="Logo Empresa" />
                            </Link>
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('menu')}>
                                <RiArrowDropUpLine size={24} />
                            </button>
                        </div>

                        <div className="border-b-2 py-2">
                            <button
                                className="flex justify-between items-center w-full text-gray-800 font-semibold text-left"
                                onClick={() => toggleDropdown('brands')}
                            >
                                Marcas
                                {showBrandsDropdown ? <RiArrowDropUpLine size={20} /> : <RiArrowDropDownLine size={20} />}
                            </button>
                            {showBrandsDropdown && (
                                <div className="pl-4 mt-2">
                                    <button onMouseDown={() => handleLinkClick('/arenaHome')} className="block py-1 text-gray-700 hover:text-gray-900">Arena</button>
                                    <button onMouseDown={() => handleLinkClick('/harbourHome')} className="block py-1 text-gray-700 hover:text-gray-900">Harbour</button>
                                    <button onMouseDown={() => handleLinkClick('/cjmHome')} className="block py-1 text-gray-700 hover:text-gray-900">CJM</button>
                                    <button onMouseDown={() => handleLinkClick('/flamencoHome')} className="block py-1 text-gray-700 hover:text-gray-900">Flamenco</button>
                                    <button onMouseDown={() => handleLinkClick('/bassariHome')} className="block py-1 text-gray-700 hover:text-gray-900">Bassari</button>
                                </div>
                            )}
                        </div>

                        <div className="border-b-2 py-2">
                            <button
                                className="flex justify-between items-center w-full text-gray-800 font-semibold text-left"
                                onClick={() => toggleDropdown('products')}
                            >
                                Productos
                                {showProductsDropdown ? <RiArrowDropUpLine size={20} /> : <RiArrowDropDownLine size={20} />}
                            </button>
                            {showProductsDropdown && (
                                <div className="pl-4 mt-2">
                                    <button onMouseDown={() => handleLinkClick('/products')} className="block py-1 text-gray-700 hover:text-gray-900 text-center">Todos los productos</button>
                                    <button onMouseDown={() => handleLinkClick('/products?type=papel')} className="block py-1 text-gray-700 hover:text-gray-900 text-center">Papeles</button>
                                    <button onMouseDown={() => handleLinkClick('/products?type=tela')} className="block py-1 text-gray-700 hover:text-gray-900 text-center">Telas</button>
                                </div>
                            )}
                        </div>

                        <button onClick={() => handleLinkClick('/about')} className="block text-gray-800 font-semibold py-2">Sobre nosotros</button>
                        <button onClick={() => handleLinkClick('/contact')} className="block text-gray-800 font-semibold py-2">Contáctanos</button>
                        <button onClick={() => handleLinkClick('/contract')} className="block text-gray-800 font-semibold py-2">Contract</button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
