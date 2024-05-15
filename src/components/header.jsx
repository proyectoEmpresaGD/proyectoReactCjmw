import { useState, useEffect, useRef } from 'react';
import { RiMenu3Fill, RiSearchLine, RiShoppingCartFill, RiUserFill, RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import { FaGlobe } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ShoppingCart from './shoppingCart ';
import { useCart } from './CartContext';
import ScrollToTop from './ScrollToTop';
import { autocomplete } from '@algolia/autocomplete-js';
import '@algolia/autocomplete-theme-classic';

export const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [logoSrc, setLogoSrc] = useState('/logoCJM.png');
    const [showCart, setShowCart] = useState(false);
    const { itemCount } = useCart();
    const [showMenu, setShowMenu] = useState(false);
    const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const searchContainerRef = useRef(null);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        setLanguages([
            { code: "en", name: "English" },
            { code: "es", name: "Spanish" },
            { code: "fr", name: "French" },
            { code: "de", name: "German" },
            { code: "it", name: "Italian" }
        ]);

        switch (location.pathname) {
            case '/harbourHome': setLogoSrc('/logoHarbour.png'); break;
            case '/arenaHome': setLogoSrc('/logoArena.png'); break;
            case '/cjmHome': setLogoSrc('/logoCJM.png'); break;
            case '/flamencoHome': setLogoSrc('/logoFlamenco.png'); break;
            default: setLogoSrc('/logoCJM.png'); break;
        }
    }, [location.pathname]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const closeAllDropdowns = () => {
        setShowBrandsDropdown(false);
        setShowUserDropdown(false);
        setShowSearchBar(false);
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
                    if (searchContainerRef.current) {
                        searchContainerRef.current.querySelector('input').focus();
                    }
                }, 100);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (showSearchBar && searchContainerRef.current) {
            autocomplete({
                container: searchContainerRef.current,
                placeholder: 'Search...',
                openOnFocus: true,
                getSources({ query }) {
                    return [
                        {
                            sourceId: 'products',
                            getItems() {
                                return fetch(`http://localhost:3000/products/search?query=${query}`)
                                    .then(response => response.json())
                                    .catch(error => {
                                        console.error('Error fetching suggestions:', error);
                                        return [];
                                    });
                            },
                            templates: {
                                item({ item }) {
                                    return (
                                        <div className="aa-ItemWrapper p-2 hover:bg-gray-200 cursor-pointer">
                                            <div className="aa-ItemContent">
                                                <div className="aa-ItemTitle text-gray-800">{item.desprodu}</div>
                                            </div>
                                        </div>
                                    );
                                },
                                noResults() {
                                    return <div className="p-2 text-gray-800">No products found</div>;
                                },
                                header() {
                                    return (
                                        <div className="aa-Header p-2 text-gray-800">
                                            <strong>Recent Searches:</strong>
                                            <ul>
                                                {searchHistory.map((search, index) => (
                                                    <li key={index} className="p-1 hover:bg-gray-200 cursor-pointer" onClick={() => navigate(`/products?search=${search}`)}>
                                                        {search}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                }
                            }
                        }
                    ];
                },
                onSubmit({ state }) {
                    const newHistory = [state.query, ...searchHistory].slice(0, 2);
                    setSearchHistory(newHistory);
                    navigate(`/products?search=${state.query}`);
                    setShowSearchBar(false);
                },
                onSelect({ item }) {
                    const newHistory = [item.desprodu, ...searchHistory].slice(0, 2);
                    setSearchHistory(newHistory);
                    navigate(`/products/${item.codprodu}`);
                    setShowSearchBar(false);
                }
            });
        }
    }, [showSearchBar, navigate, searchHistory]);

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
                    <div className="hidden lg:flex flex-grow justify-center">
                        <div className="flex items-center space-x-4">
                            <Link to="/about" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">About Us</Link>
                            <Link to="/contact" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Contact Us</Link>
                            <Link to="/products" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Products</Link>
                            <div className="relative">
                                <button
                                    className="flex items-center text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg focus:outline-none"
                                    onClick={() => toggleDropdown('brands')}>
                                    <span>Brands</span>
                                    {showBrandsDropdown ?
                                        <RiArrowDropUpLine size={16} className="ml-2" /> :
                                        <RiArrowDropDownLine size={16} className="ml-2" />
                                    }
                                </button>

                                {showBrandsDropdown && (
                                    <div className="bg-slate-100 absolute top-full left-0 mt-1 bg-ivory shadow-lg rounded-md py-2 w-40">
                                        <Link to="/arenaHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Arena</Link>
                                        <Link to="/harbourHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Harbour</Link>
                                        <Link to="/cjmHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">CJM</Link>
                                        <Link to="/flamencoHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Flamenco</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('user')}>
                                <RiUserFill size={24} />
                            </button>
                            {showUserDropdown && (
                                <div className="bg-slate-100 absolute top-full right-0 bg-ivory shadow-lg rounded-md py-2 w-40">
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => setShowUserDropdown(false)}>Sign In</button>
                                    <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => setShowUserDropdown(false)}>Sign Out</button>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('search')}>
                                <RiSearchLine size={24} />
                            </button>
                            {showSearchBar && (
                                <div className="absolute top-16 right-0 transition-all duration-500 ease-in-out w-60">
                                    <div ref={searchContainerRef} className="autocomplete-container"></div>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button className="text-gray-800 focus:outline-none" onClick={() => toggleDropdown('language')}>
                                <FaGlobe size={24} />
                            </button>
                            {showLanguageDropdown && (
                                <div className="bg-slate-100 absolute top-full right-0 bg-ivory shadow-lg rounded-md py-2 w-40">
                                    {languages.map((language, index) => (
                                        <button key={index} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => changeLanguage(language.code)}>{language.name}</button>
                                    ))}
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
                        <Link to="/about" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg">About Us</Link>
                        <Link to="/contact" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg">Contact Us</Link>
                        <Link to="/products" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg">Products</Link>
                        <div className="relative">
                            <button className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg focus:outline-none" onClick={() => toggleDropdown('brands')}>
                                Brands {showBrandsDropdown ? <RiArrowDropUpLine size={16} /> : <RiArrowDropDownLine size={16} />}
                            </button>
                            {showBrandsDropdown && (
                                <div className={`bg-slate-100 absolute top-full left-0 mt-1 bg-ivory shadow-lg rounded-md py-2 w-40`}>
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
        </>
    );
};
