import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    RiMenu3Fill,
    RiSearchLine,
    RiShoppingCartFill,
    RiUserFill,
    RiArrowDropDownLine,
    RiArrowDropUpLine,
} from 'react-icons/ri';
import { FaSlidersH } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ShoppingCart from './shoppingCart';
import { useCart } from './CartContext';
import ScrollToTop from './ScrollToTop';
import 'tailwindcss/tailwind.css';
import SearchBar from './SearchBar';
import { useMarca } from './MarcaContext';

// Importar constantes desde el archivo de constantes
import { languageOptions, brandLogos, defaultLogo } from '../Constants/constants';

export const Header = ({ closeModal }) => {
    const { t, i18n } = useTranslation('header');
    const navigate = useNavigate();
    const location = useLocation();
    const { itemCount } = useCart();
    const { marcaActiva, setMarcaActiva } = useMarca();

    // Dropdown states
    const [showCart, setShowCart] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
    const [showProductsDropdown, setShowProductsDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Selected language
    const [selectedLanguage, setSelectedLanguage] = useState(
        languageOptions.find(opt => opt.value === i18n.language) || languageOptions[0]
    );
    useEffect(() => {
        const found = languageOptions.find(opt => opt.value === i18n.language);
        if (found) setSelectedLanguage(found);
    }, [i18n.language]);

    // Refs for outside-click detection
    const searchRef = useRef(null);
    const cartRef = useRef(null);
    const userRef = useRef(null);
    const languageRef = useRef(null);
    const menuRef = useRef(null);
    const brandsRef = useRef(null);
    const productsRef = useRef(null);

    // --- mapa ruta -> código de marca y sincronización estado/ruta ---
    const pathToBrand = {
        '/arenaHome': 'ARE',
        '/harbourHome': 'HAR',
        '/bassariHome': 'BAS',
        '/cjmHome': 'CJM',
        '/flamencoHome': 'FLA',
    };

    useEffect(() => {
        const code = pathToBrand[location.pathname] || null;
        if (code && marcaActiva !== code) {
            setMarcaActiva(code);
        }
    }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    // Logo robusto: prioriza marcaActiva, luego ruta, luego fallback
    const codeFromPath = pathToBrand[location.pathname];
    const logoSrc =
        (marcaActiva && brandLogos[marcaActiva]) ? brandLogos[marcaActiva]
            : (codeFromPath && brandLogos[codeFromPath]) ? brandLogos[codeFromPath]
                : brandLogos[location.pathname] || defaultLogo;

    const closeAllDropdowns = useCallback(() => {
        setShowBrandsDropdown(false);
        setShowProductsDropdown(false);
        setShowUserDropdown(false);
        setShowLanguageDropdown(false);
    }, []);
    const closeSearchAndCart = useCallback(() => {
        setShowSearchBar(false);
        setShowCart(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = event => {
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
            if (
                !searchRef.current?.contains(event.target) &&
                !cartRef.current?.contains(event.target)
            ) {
                closeSearchAndCart();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeAllDropdowns, closeSearchAndCart]);

    const toggleDropdown = dropdown => {
        closeAllDropdowns();
        switch (dropdown) {
            case 'menu': setShowMenu(!showMenu); break;
            case 'brands': setShowBrandsDropdown(!showBrandsDropdown); break;
            case 'products': setShowProductsDropdown(!showProductsDropdown); break;
            case 'user': setShowUserDropdown(!showUserDropdown); break;
            case 'language': setShowLanguageDropdown(!showLanguageDropdown); break;
            case 'search': setShowSearchBar(!showSearchBar); break;
            case 'cart': setShowCart(!showCart); break;
            default: break;
        }
    };

    const handleLinkClick = path => {
        if (typeof window.closeModalGlobal === 'function') {
            window.closeModalGlobal();
        }
        setTimeout(() => navigate(path), 100);
        setShowMenu(false);
        closeAllDropdowns();
    };

    // NUEVO: abrir filtros (mobile → SubMenuCarousel, desktop → FilterPanel)
    const hasActiveFilters = useMemo(() => {
        if (!location.pathname.startsWith('/products')) return false;
        const params = new URLSearchParams(location.search);
        const filterKeys = [
            'brand',
            'color',
            'collection',
            'fabricType',
            'fabricPattern',
            'martindale',
            'martindaleRange',
            'uso',
            'mantenimiento',
        ];
        return filterKeys.some((key) => params.getAll(key).length > 0);
    }, [location.pathname, location.search]);

    const openFilters = useCallback(() => {
        closeAllDropdowns();
        closeSearchAndCart();
        setShowMenu(false);

        if (location.pathname.startsWith('/products')) {
            // Ya estamos en products: disparamos evento global
            window.dispatchEvent(new CustomEvent('openProductFilters'));
            return;
        }

        // No estamos en products:
        // Navegamos a /products y marcamos en el state que hay que abrir filtros
        navigate('/products', { state: { openFilters: true } });
    }, [closeAllDropdowns, closeSearchAndCart, location.pathname, navigate]);

    const changeLanguage = opt => {
        i18n.changeLanguage(opt.value);
        setSelectedLanguage(opt);
        setShowLanguageDropdown(false);
    };

    return (
        <>
            <ScrollToTop />

            <header
                className={`fixed top-0 left-0 w-full z-40 bg-white opacity-80 hover:opacity-100 transition-all duration-500 ${isHovered ||
                    showSearchBar ||
                    showUserDropdown ||
                    showBrandsDropdown ||
                    showProductsDropdown ||
                    showLanguageDropdown ||
                    showCart ||
                    showMenu
                    ? 'shadow-md'
                    : 'bg-transparent'
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="container mx-auto flex items-center justify-between py-2 px-4 lg:px-8">

                    {/* Mobile menu & logo */}
                    <div className="flex items-center">
                        <button
                            className="text-gray-800 lg:hidden focus:outline-none"
                            onClick={() => toggleDropdown('menu')}
                            ref={menuRef}
                        >
                            {showMenu ? <RiArrowDropUpLine size={24} /> : <RiMenu3Fill size={24} />}
                        </button>
                        <Link
                            to="/"
                            onClick={() => setMarcaActiva(null)}
                            className="flex items-center space-x-2 text-gray-800 hover:scale-110 duration-150 font-semibold py-2 px-2 rounded-lg"
                        >
                            <img key={logoSrc} src={logoSrc} className="h-9 lg:h-10 xl:h-14" alt="Logo" />
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex flex-grow justify-center items-center space-x-4">
                        <Link
                            to="/"
                            className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg"
                        >
                            {t('home')}
                        </Link>

                        {/* Brands */}
                        <div className="relative" ref={brandsRef}>
                            <button
                                className="flex items-center text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg focus:outline-none"
                                onClick={() => toggleDropdown('brands')}
                            >
                                {t('brands')}
                                {showBrandsDropdown
                                    ? <RiArrowDropUpLine size={16} className="ml-2" />
                                    : <RiArrowDropDownLine size={16} className="ml-2" />
                                }
                            </button>
                            {showBrandsDropdown && (
                                <div className="absolute top-full left-0 w-full mt-1 bg-ivory bg-slate-100 shadow-lg rounded-md py-2 z-50 flex flex-col">
                                    {['arenaHome', 'harbourHome', 'cjmHome', 'flamencoHome', 'bassariHome'].map(key => (
                                        <button
                                            key={key}
                                            onMouseDown={() => handleLinkClick(`/${key}`)}
                                            className="px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md text-left"
                                        >
                                            {t(key.replace('Home', '').toLowerCase())}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Products */}
                        <div className="relative" ref={productsRef}>
                            <button
                                className="flex items-center text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg focus:outline-none"
                                onClick={() => toggleDropdown('products')}
                            >
                                {t('products')}
                                {showProductsDropdown
                                    ? <RiArrowDropUpLine size={16} className="ml-2" />
                                    : <RiArrowDropDownLine size={16} className="ml-2" />
                                }
                            </button>
                            {showProductsDropdown && (
                                <div className="absolute top-full left-0 mt-1 bg-ivory bg-slate-100 shadow-lg rounded-md py-2 w-40 z-50 flex flex-col">
                                    <button
                                        onMouseDown={() => handleLinkClick('/products')}
                                        className="py-2 pl-4 text-gray-800 hover:bg-gray-200 rounded-md"
                                    >
                                        {t('allProducts')}
                                    </button>
                                    <button
                                        onMouseDown={() => handleLinkClick('/products?type=papel')}
                                        className="py-2 pl-4 text-gray-800 hover:bg-gray-200 rounded-md"
                                    >
                                        {t('paper')}
                                    </button>
                                    <button
                                        onMouseDown={() => handleLinkClick('/products?type=tela')}
                                        className="py-2 pl-4 text-gray-800 hover:bg-gray-200 rounded-md"
                                    >
                                        {t('fabric')}
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link to="/about" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">{t('about')}</Link>
                        <Link to="/media" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">{t('media')}</Link>
                        <Link to="/contact" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">{t('contact')}</Link>
                        <Link to="/contract" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">{t('contract')}</Link>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Filters (icono, SIN texto tipo “Encuentra el tejido…”) */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={openFilters}
                                className="text-gray-800 focus:outline-none relative"
                                aria-label={t('openFilters', 'Abrir filtros')}
                            >
                                <FaSlidersH size={20} />
                                {hasActiveFilters && (
                                    <span className="absolute top-0 right-0 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#26659E]" />
                                )}
                            </button>
                        </div>

                        {/* User */}
                        <div className="relative" ref={userRef}>
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('user')}>
                                <RiUserFill size={24} />
                            </button>
                            {showUserDropdown && (
                                <div className="absolute top-full right-0 bg-ivory bg-slate-100 shadow-lg rounded-md py-2 w-40 z-50">
                                    <p className="px-4 py-2 text-gray-500">{t('userFeature')}</p>
                                </div>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative" ref={searchRef}>
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('search')}>
                                <RiSearchLine size={24} />
                            </button>
                            {showSearchBar && (
                                <div className="absolute top-full right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-50 p-4">
                                    <SearchBar closeSearchBar={() => setShowSearchBar(false)} />
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <div className="relative cart" ref={cartRef}>
                            <button className="text-gray-800 focus:outline-none relative" onClick={() => toggleDropdown('cart')}>
                                <RiShoppingCartFill size={24} />
                                {itemCount > 0 && (
                                    <span
                                        className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1"
                                        style={{ transform: 'translate(50%,-50%)', fontSize: '0.75rem' }}
                                    >
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

                        {/* Language */}
                        <div className="relative" ref={languageRef}>
                            {showLanguageDropdown && (
                                <div className="absolute top-full right-0 mt-2 bg-slate-100 shadow-lg rounded-md py-2 w-32 z-50">
                                    {languageOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                            onClick={() => changeLanguage(opt)}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`lg:hidden fixed top-0 left-0 w-full h-full bg-white z-50 transition-all ${showMenu ? 'block' : 'hidden'}`}>
                    <div className="bg-white shadow-lg py-4 px-6 h-full overflow-auto">
                        <div className="flex justify-between mb-4">
                            <Link to="/" className="font-semibold text-gray-800 hover:bg-gray-300 py-2 px-4 rounded-lg">
                                <img src={logoSrc} className="h-10" alt="Logo Empresa" />
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
                                {t('brands')}
                                {showBrandsDropdown ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
                            </button>
                            {showBrandsDropdown && (
                                <div className="pl-4 mt-2">
                                    {['arenaHome', 'harbourHome', 'cjmHome', 'flamencoHome', 'bassariHome'].map(key => (
                                        <button
                                            key={key}
                                            onMouseDown={() => handleLinkClick(`/${key}`)}
                                            className="block py-1 text-gray-700 hover:text-gray-900"
                                        >
                                            {t(key.replace('Home', '').toLowerCase())}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="border-b-2 py-2">
                            <button
                                className="flex justify-between items-center w-full text-gray-800 font-semibold text-left"
                                onClick={() => toggleDropdown('products')}
                            >
                                {t('products')}
                                {showProductsDropdown ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
                            </button>
                            {showProductsDropdown && (
                                <div className="pl-4 mt-2">
                                    <button onMouseDown={() => handleLinkClick('/products')} className="block py-1 text-gray-700 hover:text-gray-900">
                                        {t('allProducts')}
                                    </button>
                                    <button onMouseDown={() => handleLinkClick('/products?type=papel')} className="block py-1 text-gray-700 hover:text-gray-900">
                                        {t('paper')}
                                    </button>
                                    <button onMouseDown={() => handleLinkClick('/products?type=tela')} className="block py-1 text-gray-700 hover:text-gray-900">
                                        {t('fabric')}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Botón de filtros en móvil: texto corto “Filtros”, no el texto largo */}
                        <button
                            onClick={openFilters}
                            className="mt-6 w-full rounded-lg bg-[#26659E] py-3 text-center text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-[#26659E]/60"
                        >
                            {t('filtersButtonLabel', 'Filtros')}
                        </button>

                        <button onClick={() => handleLinkClick('/about')} className="block text-gray-800 font-semibold py-2">
                            {t('about')}
                        </button>
                        <button onClick={() => handleLinkClick('/media')} className="block text-gray-800 font-semibold py-2">
                            {t('media')}
                        </button>
                        <button onClick={() => handleLinkClick('/contact')} className="block text-gray-800 font-semibold py-2">
                            {t('contact')}
                        </button>
                        <button onClick={() => handleLinkClick('/contract')} className="block text-gray-800 font-semibold py-2">
                            {t('contract')}
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
