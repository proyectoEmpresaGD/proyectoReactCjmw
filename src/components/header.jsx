import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { RiMenu3Fill, RiSearchLine, RiShoppingCartFill, RiUserFill, RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { FaGlobe } from "react-icons/fa";

export const Header = () => {
    const location = useLocation();
    const [logoSrc, setLogoSrc] = useState('/logoCJM.png');

    useEffect(() => {
        // Verifica la ruta actual y establece el logo del Navbar en consecuencia
        switch (location.pathname) {
            case '/harbourHome':
                setLogoSrc('/logoHarbour.png');
                break;
            case '/arenaHome':
                setLogoSrc('/logoArena.png');
                break;
            case '/cjmHome':
                setLogoSrc('/logoCJM.png');
                break;
            case '/flamencoHome':
                setLogoSrc('/logoFlamenco.png');
                break;
            default:
                setLogoSrc('/logoCJM.png');
        }
    }, [location.pathname]);

    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [translationMap, setTranslationMap] = useState({});

    useEffect(() => {
        const exampleLanguages = [
            { code: "en", name: "English" },
            { code: "es", name: "Spanish" },
            { code: "fr", name: "French" },
            { code: "de", name: "German" },
            { code: "it", name: "Italian" }
        ];
        setLanguages(exampleLanguages);
    }, []);

    const changeLanguage = (languageCode) => {
        if (!translationMap[languageCode]) {
            fetchTranslation(languageCode);
        }
    };

    const fetchTranslation = (languageCode) => {
        const textToTranslate = document.documentElement.innerHTML;
        const apiKey = 'TU_CLAVE_DE_API';
        const maxCharacters = 5000; // Máximo de caracteres permitidos por solicitud

        // Divide el texto en partes más pequeñas
        const chunks = [];
        for (let i = 0; i < textToTranslate.length; i += maxCharacters) {
            chunks.push(textToTranslate.substring(i, i + maxCharacters));
        }

        // Realiza una solicitud de traducción para cada parte
        Promise.all(chunks.map(chunk => {
            const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(chunk)}&target=${languageCode}`;

            return fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const translatedText = data.data.translations[0].translatedText;
                    return translatedText;
                });
        }))
            .then(translations => {
                // Une las traducciones en un solo texto
                const translatedText = translations.join('');
                // Actualiza el estado con la traducción completa
                setTranslationMap(prevMap => ({
                    ...prevMap,
                    [languageCode]: translatedText
                }));
                // Reemplaza solo el texto en el DOM
                document.querySelectorAll('*').forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.parentElement && node.parentElement.tagName !== 'SCRIPT') {
                        const translatedNode = document.createElement('span');
                        translatedNode.innerHTML = translatedText;
                        node.parentElement.replaceChild(translatedNode, node);
                    }
                });
            })
            .catch(error => console.error("Error fetching translation:", error));
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const toggleBrandsDropdown = () => {
        setShowBrandsDropdown(!showBrandsDropdown);
        if (showUserDropdown) {
            setShowUserDropdown(false);
        }
        if (showSearchBar) {
            setShowSearchBar(false);
        }
        // Cerrar menú de idiomas si está abierto
        if (showLanguageDropdown) {
            setShowLanguageDropdown(false);
        }
    };

    const toggleUserDropdown = () => {
        setShowUserDropdown(!showUserDropdown);
        if (showBrandsDropdown) {
            setShowBrandsDropdown(false);
        }
        if (showSearchBar) {
            setShowSearchBar(false);
        }
        // Cerrar menú de idiomas si está abierto
        if (showLanguageDropdown) {
            setShowLanguageDropdown(false);
        }
    };

    const toggleSearchBar = () => {
        setShowSearchBar(!showSearchBar);
        if (showBrandsDropdown) {
            setShowBrandsDropdown(false);
        }
        if (showUserDropdown) {
            setShowUserDropdown(false);
        }
        // Cerrar menú de idiomas si está abierto
        if (showLanguageDropdown) {
            setShowLanguageDropdown(false);
        }
    };

    const toggleLanguageDropdown = () => {
        setShowLanguageDropdown(!showLanguageDropdown);
        // Cerrar otros menús si están abiertos
        if (showBrandsDropdown || showUserDropdown || showSearchBar) {
            setShowBrandsDropdown(false);
            setShowUserDropdown(false);
            setShowSearchBar(false);
        }
    };

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Búsqueda realizada:", searchQuery);
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white z-50">
            <div className="container mx-auto flex items-center justify-between py-4 px-6 lg:px-8">
                <div className="flex items-center">
                    <button className="text-gray-800 lg:hidden focus:outline-none" onClick={toggleMenu}>
                        {showMenu ? (
                            <RiArrowDropUpLine size={24} />
                        ) : (
                            <RiMenu3Fill size={24} />
                        )}
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
                            <button className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg focus:outline-none" onClick={toggleBrandsDropdown}>
                                Brands {showBrandsDropdown ? <RiArrowDropUpLine size={16} /> : <RiArrowDropDownLine size={16} />}
                            </button>
                            <div className={`bg-slate-100 absolute top-full left-0 mt-1 bg-ivory shadow-lg rounded-md py-2 w-40 ${showBrandsDropdown ? '' : 'hidden'}`}>
                                <Link to="/arenaHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Arena</Link>
                                <Link to="/harbourHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Harbour</Link>
                                <Link to="/cjmHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">CJM</Link>
                                <Link to="/flamencoHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Flamenco</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button className="text-gray-800 focus:outline-none" onClick={toggleUserDropdown}>
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
                        <button className="text-gray-800 focus:outline-none" onClick={toggleSearchBar}>
                            <RiSearchLine size={24} />
                        </button>
                        {showSearchBar && (
                            <div className="absolute top-16 right-0 transition-all duration-500 ease-in-out">
                                <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md shadow-md flex items-center">
                                    <input
                                        type="text"
                                        className="px-4 py-2 focus:outline-none flex-1"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={handleChange}
                                    />
                                    <button type="submit" className="text-gray-600 focus:outline-none">
                                        <RiSearchLine size={24} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <button className="text-gray-800 focus:outline-none" onClick={toggleLanguageDropdown}>
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
                    <button className="text-gray-800 focus:outline-none" onClick={() => { }}>
                        <RiShoppingCartFill size={24} />
                    </button>
                </div>
            </div>
            <div className={`bg-white lg:hidden ${showMenu ? '' : 'hidden'}`}>
                <div className="bg-ivory py-2 px-4">
                    <Link to="/about" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg">About Us</Link>
                    <Link to="/contact" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg">Contact Us</Link>
                    <Link to="/products" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg">Products</Link>

                    <div className="relative">
                        <button className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg focus:outline-none" onClick={toggleBrandsDropdown}>
                            Brands {showBrandsDropdown ? <RiArrowDropUpLine size={16} /> : <RiArrowDropDownLine size={16} />}
                        </button>
                        <div className={`bg-slate-100 absolute top-full left-0 mt-1 bg-ivory shadow-lg rounded-md py-2 w-40 ${showBrandsDropdown ? '' : 'hidden'}`}>
                            <Link to="/arenaHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Arena</Link>
                            <Link to="/harbourHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Harbour</Link>
                            <Link to="/cjmHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">CJM</Link>
                            <Link to="/flamencoHome" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Flamenco</Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
