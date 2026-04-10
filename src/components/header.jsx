import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
    Menu,
    Search,
    ShoppingCart as ShoppingCartIcon,
    User,
    ChevronDown,
    ChevronUp,
    SlidersHorizontal,
    ArrowRight,
    X,
    Globe,
    Mail
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ShoppingCartPanel from "./shoppingCart";
import { useCart } from "./CartContext";
import "tailwindcss/tailwind.css";
import SearchBar from "./SearchBar";
import { useMarca } from "./MarcaContext";
import { useAuth } from "../context/AuthContext.jsx";
import { languageOptions, brandLogos, defaultLogo } from "../Constants/constants";

const getBrandCodeFromLocation = (location, pathToBrandMap, logosByBrand) => {
    if (!location) return null;

    const params = new URLSearchParams(location.search || "");
    const brandFromQuery = params.get("brand");
    if (brandFromQuery && logosByBrand?.[brandFromQuery]) {
        return brandFromQuery;
    }

    const brandFromPath = pathToBrandMap?.[location.pathname];
    if (brandFromPath && logosByBrand?.[brandFromPath]) {
        return brandFromPath;
    }

    return null;
};

const getHeaderLogoSrc = (location, { pathToBrandMap, logosByBrand, fallbackLogo }) => {
    const brandCode = getBrandCodeFromLocation(location, pathToBrandMap, logosByBrand);
    return brandCode ? logosByBrand[brandCode] : fallbackLogo;
};

export const Header = ({ closeModal }) => {
    const { t, i18n } = useTranslation("header");
    const navigate = useNavigate();
    const location = useLocation();
    const { itemCount } = useCart();
    const { marcaActiva, setMarcaActiva } = useMarca();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    const [showCart, setShowCart] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
    const [showProductsDropdown, setShowProductsDropdown] = useState(false);
    const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showDrawerLinks, setShowDrawerLinks] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const [selectedLanguage, setSelectedLanguage] = useState(
        languageOptions.find((opt) => opt.value === i18n.language) || languageOptions[0]
    );

    const searchRef = useRef(null);
    const cartRef = useRef(null);
    const userRef = useRef(null);
    const languageRef = useRef(null);
    const menuRef = useRef(null);
    const brandsRef = useRef(null);
    const productsRef = useRef(null);
    const companyRef = useRef(null);
    const desktopDrawerRef = useRef(null);

    const pathToBrand = {
        "/arenaHome": "ARE",
        "/harbourHome": "HAR",
        "/bassariHome": "BAS",
        "/cjmHome": "CJM",
        "/flamencoHome": "FLA",
    };

    const brandsLinks = useMemo(
        () =>
            ["arenaHome", "harbourHome", "cjmHome", "flamencoHome", "bassariHome"].map((key) => ({
                key,
                label: t(key.replace("Home", "").toLowerCase()),
                path: `/${key}`,
            })),
        [t]
    );

    const productLinks = useMemo(
        () => [
            { key: "allProducts", label: t("allProducts"), path: "/products" },
            { key: "paper", label: t("paper"), path: "/products?type=papel" },
            { key: "fabric", label: t("fabric"), path: "/products?type=tela" },
        ],
        [t]
    );

    const companyLinks = useMemo(
        () => [
            { key: "about", label: t("about"), path: "/about" },
            { key: "contact", label: t("contact"), path: "/contact" },
            { key: "contract", label: t("contract"), path: "/contract" },
        ],
        [t]
    );

    const customerLinks = useMemo(
        () => [
            { key: "myData", label: t("myData"), path: "/mis-datos" },
            { key: "myInvoices", label: t("myInvoices"), path: "/mis-facturas" },
        ],
        [t]
    );

    const activeDesktopPanel = useMemo(() => {
        if (showBrandsDropdown) {
            return {
                title: t("brands"),
                description: t("drawer.brandsDescription"),
                links: brandsLinks,
            };
        }

        if (showProductsDropdown) {
            return {
                title: t("products"),
                description: t("drawer.productsDescription"),
                links: productLinks,
            };
        }

        if (showCompanyDropdown) {
            return {
                title: t("company"),
                description: t("drawer.companyDescription"),
                links: companyLinks,
            };
        }

        return null;
    }, [brandsLinks, companyLinks, productLinks, showBrandsDropdown, showCompanyDropdown, showProductsDropdown, t]);

    const activePanelKey = useMemo(() => {
        if (showBrandsDropdown) return "brands";
        if (showProductsDropdown) return "products";
        if (showCompanyDropdown) return "company";
        return "none";
    }, [showBrandsDropdown, showProductsDropdown, showCompanyDropdown]);

    const handleLogout = async () => {
        try {
            await logout();
            setShowUserDropdown(false);
            navigate("/");
        } catch (error) {
            console.error("Error cerrando sesión de cliente:", error);
        }
    };

    useEffect(() => {
        const found = languageOptions.find((opt) => opt.value === i18n.language);
        if (found) setSelectedLanguage(found);
    }, [i18n.language]);

    useEffect(() => {
        const code = getBrandCodeFromLocation(location, pathToBrand, brandLogos);
        if (marcaActiva !== code) {
            setMarcaActiva(code);
        }
    }, [location.pathname, location.search]); // eslint-disable-line react-hooks/exhaustive-deps

    const logoSrc = getHeaderLogoSrc(location, {
        pathToBrandMap: pathToBrand,
        logosByBrand: brandLogos,
        fallbackLogo: defaultLogo,
    });

    const closeAllDropdowns = useCallback(() => {
        setShowBrandsDropdown(false);
        setShowProductsDropdown(false);
        setShowCompanyDropdown(false);
        setShowUserDropdown(false);
        setShowLanguageDropdown(false);
        setShowDrawerLinks(false);
    }, []);

    const closeSearchAndCart = useCallback(() => {
        setShowSearchBar(false);
        setShowCart(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                !searchRef.current?.contains(event.target) &&
                !cartRef.current?.contains(event.target) &&
                !userRef.current?.contains(event.target) &&
                !languageRef.current?.contains(event.target) &&
                !menuRef.current?.contains(event.target) &&
                !brandsRef.current?.contains(event.target) &&
                !productsRef.current?.contains(event.target) &&
                !companyRef.current?.contains(event.target) &&
                !desktopDrawerRef.current?.contains(event.target)
            ) {
                closeAllDropdowns();
            }

            if (!searchRef.current?.contains(event.target) && !cartRef.current?.contains(event.target)) {
                closeSearchAndCart();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeAllDropdowns, closeSearchAndCart]);

    useEffect(() => {
        let timeoutId;

        if (activeDesktopPanel) {
            setShowDrawerLinks(false);

            timeoutId = setTimeout(() => {
                setShowDrawerLinks(true);
            }, 500);
        } else {
            setShowDrawerLinks(false);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [activePanelKey, activeDesktopPanel]);

    const toggleDropdown = (dropdown) => {
        const isBrandsOpen = showBrandsDropdown;
        const isProductsOpen = showProductsDropdown;
        const isCompanyOpen = showCompanyDropdown;
        const isMenuOpen = showMenu;
        const isUserOpen = showUserDropdown;
        const isLanguageOpen = showLanguageDropdown;
        const isSearchOpen = showSearchBar;
        const isCartOpen = showCart;

        closeAllDropdowns();
        closeSearchAndCart();

        switch (dropdown) {
            case "menu":
                setShowMenu(!isMenuOpen);
                break;
            case "brands":
                setShowBrandsDropdown(!isBrandsOpen);
                break;
            case "products":
                setShowProductsDropdown(!isProductsOpen);
                break;
            case "company":
                setShowCompanyDropdown(!isCompanyOpen);
                break;
            case "user":
                setShowUserDropdown(!isUserOpen);
                break;
            case "language":
                setShowLanguageDropdown(!isLanguageOpen);
                break;
            case "search":
                setShowSearchBar(!isSearchOpen);
                break;
            case "cart":
                setShowCart(!isCartOpen);
                break;
            default:
                break;
        }
    };

    const handleLinkClick = (path) => {
        if (typeof window.closeModalGlobal === "function") {
            window.closeModalGlobal();
        }

        setTimeout(() => navigate(path), 100);
        setShowMenu(false);
        closeAllDropdowns();
    };

    const hasActiveFilters = useMemo(() => {
        if (!location.pathname.startsWith("/products")) return false;

        const params = new URLSearchParams(location.search);
        const filterKeys = [
            "brand",
            "color",
            "collection",
            "fabricType",
            "fabricPattern",
            "martindale",
            "martindaleRange",
            "uso",
            "mantenimiento",
        ];

        return filterKeys.some((key) => params.getAll(key).length > 0);
    }, [location.pathname, location.search]);

    const openFilters = useCallback(() => {
        closeAllDropdowns();
        closeSearchAndCart();
        setShowMenu(false);

        if (location.pathname.startsWith("/products")) {
            window.dispatchEvent(new CustomEvent("openProductFilters"));
            return;
        }

        navigate("/products", { state: { openFilters: true } });
    }, [closeAllDropdowns, closeSearchAndCart, location.pathname, navigate]);

    const changeLanguage = (opt) => {
        i18n.changeLanguage(opt.value);
        setSelectedLanguage(opt);
        setShowLanguageDropdown(false);
    };

    const renderDrawerLinks = (links, isVisible) =>
        links.map((link, index) => (
            <button
                key={link.key}
                onMouseDown={() => handleLinkClick(link.path)}
                type="button"
                style={{
                    transitionDelay: isVisible ? `${index * 120}ms` : "0ms",
                }}
                className={`group flex w-full items-center justify-between rounded-2xl border border-transparent bg-white/70 px-4 py-4 text-left
                    transition-all duration-500 ease-out hover:border-slate-200 hover:bg-white hover:shadow-sm
                    ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0 pointer-events-none"}`}
            >
                <span className="font-medium text-slate-800">{link.label}</span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700" />
            </button>
        ));

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-40
                    bg-white
                    transition-all duration-500 ease-in-out
                    ${isHovered ||
                        showSearchBar ||
                        showUserDropdown ||
                        showBrandsDropdown ||
                        showProductsDropdown ||
                        showCompanyDropdown ||
                        showLanguageDropdown ||
                        showCart ||
                        showMenu
                        ? "shadow-md"
                        : "bg-transparent"
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="container mx-auto flex items-center justify-between py-2 px-4 lg:px-8">
                    <div className="flex items-center">
                        <button
                            className="text-gray-800 lg:hidden focus:outline-none"
                            onClick={() => toggleDropdown("menu")}
                            ref={menuRef}
                            type="button"
                        >
                            {showMenu ? <ChevronUp className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>

                        <Link
                            to="/"
                            className="flex items-center space-x-2 text-gray-800 hover:scale-110 duration-150 font-semibold py-2 px-2 rounded-lg"
                        >
                            <img key={logoSrc} src={logoSrc} className="h-9 lg:h-14 xl:h-14" alt="Logo" />
                        </Link>
                    </div>

                    <div className="hidden lg:flex flex-grow justify-center items-center gap-2 xl:gap-3">
                        <div className="relative" ref={brandsRef}>
                            <button
                                className={`flex items-center rounded-full px-4 py-2.5 font-semibold transition ${showBrandsDropdown
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                                    }`}
                                onClick={() => toggleDropdown("brands")}
                                type="button"
                            >
                                {t("brands")}
                                {showBrandsDropdown ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                            </button>
                        </div>

                        <div className="relative" ref={productsRef}>
                            <button
                                className={`flex items-center rounded-full px-4 py-2.5 font-semibold transition ${showProductsDropdown
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                                    }`}
                                onClick={() => toggleDropdown("products")}
                                type="button"
                            >
                                {t("products")}
                                {showProductsDropdown ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                            </button>
                        </div>

                        <Link
                            to="/media"
                            className="text-gray-800 font-semibold hover:bg-gray-200 hover:text-gray-900 py-2.5 px-4 rounded-full transition"
                        >
                            {t("media")}
                        </Link>

                        {/* {isAuthenticated && (
                            <Link
                                to="/confeccion"
                                className="text-gray-800 font-semibold hover:bg-gray-200 hover:text-gray-900 py-2.5 px-4 rounded-full transition"
                            >
                                {t("tailoring")}
                            </Link>
                        )} */}

                        <div className="relative" ref={companyRef}>
                            <button
                                className={`flex items-center rounded-full px-4 py-2.5 font-semibold transition ${showCompanyDropdown
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                                    }`}
                                onClick={() => toggleDropdown("company")}
                                type="button"
                            >
                                {t("company")}
                                {showCompanyDropdown ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={openFilters}
                                className="text-gray-800 focus:outline-none relative"
                                aria-label={t("openFilters", "Abrir filtros")}
                            >
                                <SlidersHorizontal className="h-5 w-5" />
                                {hasActiveFilters && (
                                    <span className="absolute top-0 right-0 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#26659E]" />
                                )}
                            </button>
                        </div>

                        {/* <div className="relative" ref={userRef}>
                            <button
                                className="text-gray-800 focus:outline-none"
                                onClick={() => toggleDropdown("user")}
                                type="button"
                            >
                                <User className="h-6 w-6" />
                            </button>

                            {showUserDropdown && (
                                <div className="absolute top-full right-0 z-50 w-64 rounded-md bg-slate-100 py-2 shadow-lg">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="border-b border-stone-200 px-4 py-3">
                                                <p className="text-xs uppercase tracking-wide text-stone-500">{t("customerArea")}</p>
                                                <p className="mt-1 text-sm font-medium text-stone-800">
                                                    {user?.activeCustomer?.razclien || user?.activeCustomer?.nomcomer || user?.nif}
                                                </p>
                                                <p className="mt-1 text-xs text-stone-500">{t("nifLabel")} {user?.nif}</p>
                                            </div>

                                            {isAdmin && (
                                                <button
                                                    className="block w-full px-4 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-200"
                                                    onClick={() => {
                                                        setShowUserDropdown(false);
                                                        navigate("/admin/solicitudes");
                                                    }}
                                                    type="button"
                                                >
                                                    {t("adminPanel")}
                                                </button>
                                            )}

                                            <button
                                                className="block w-full px-4 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-200"
                                                onClick={() => {
                                                    setShowUserDropdown(false);
                                                    navigate("/mis-datos");
                                                }}
                                                type="button"
                                            >
                                                {t("myData")}
                                            </button>

                                            <button
                                                className="block w-full px-4 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-200"
                                                onClick={() => {
                                                    setShowUserDropdown(false);
                                                    navigate("/mis-facturas");
                                                }}
                                                type="button"
                                            >
                                                {t("myInvoices")}
                                            </button>

                                            <button
                                                className="block w-full px-4 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-200"
                                                onClick={handleLogout}
                                                type="button"
                                            >
                                                {t("logout")}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="block w-full px-4 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-200"
                                                onClick={() => {
                                                    setShowUserDropdown(false);
                                                    navigate("/login");
                                                }}
                                                type="button"
                                            >
                                                {t("login")}
                                            </button>

                                            <button
                                                className="block w-full px-4 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-200"
                                                onClick={() => {
                                                    setShowUserDropdown(false);
                                                    navigate("/register");
                                                }}
                                                type="button"
                                            >
                                                {t("createAccount")}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div> */}

                        <div className="relative" ref={searchRef}>
                            <button
                                className="text-gray-800 focus:outline-none"
                                onClick={() => toggleDropdown("search")}
                                type="button"
                            >
                                <Search className="h-6 w-6" />
                            </button>

                            {showSearchBar && (
                                <div className="absolute top-full right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-50 p-4">
                                    <SearchBar closeSearchBar={() => setShowSearchBar(false)} />
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={languageRef}>
                            <button
                                className="text-gray-800 focus:outline-none"
                                onClick={() => toggleDropdown("language")}
                                type="button"
                                aria-label={t("changeLanguage", "Cambiar idioma")}
                                title={t("changeLanguage", "Cambiar idioma")}
                            >
                                <Globe className="h-6 w-6" />
                            </button>

                            {showLanguageDropdown && (
                                <div className="absolute top-full right-0 mt-2 min-w-[180px] rounded-md bg-white py-2 shadow-lg z-50">
                                    {languageOptions.map((opt) => {
                                        const isActive = selectedLanguage?.value === opt.value;

                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => changeLanguage(opt)}
                                                className={`block w-full px-4 py-2 text-left text-sm transition ${isActive
                                                    ? "bg-stone-200 text-stone-900 font-semibold"
                                                    : "text-stone-700 hover:bg-stone-100"
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* <div className="relative cart" ref={cartRef}>
                            <button
                                className="text-gray-800 focus:outline-none relative"
                                onClick={() => toggleDropdown("cart")}
                                type="button"
                            >
                                <ShoppingCartIcon className="h-6 w-6" />
                                {itemCount > 0 && (
                                    <span
                                        className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1"
                                        style={{ transform: "translate(50%,-50%)", fontSize: "0.75rem" }}
                                    >
                                        {itemCount}
                                    </span>
                                )}
                            </button>

                            {showCart && (
                                <div className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg p-4 z-50">
                                    <ShoppingCartPanel onClose={() => setShowCart(false)} />
                                </div>
                            )}
                        </div> */}
                    </div>
                </div>

                <div
                    className={`pointer-events-none hidden lg:block fixed inset-0 top-[84px] transition duration-300 ${activeDesktopPanel ? "bg-slate-950/20 opacity-100" : "opacity-0"
                        }`}
                />

                <aside
                    ref={desktopDrawerRef}
                    className={`hidden lg:block fixed left-0 top-[84px] z-50 h-[calc(100vh-84px)] w-1/4 min-w-[300px] overflow-auto border-r border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-2xl transition-transform duration-500 ease-out ${activeDesktopPanel ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex min-h-full flex-col px-6 py-8">
                        <div className="mb-8 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    {t("navigation")}
                                </p>
                                <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                                    {activeDesktopPanel?.title}
                                </h2>
                                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                                    {activeDesktopPanel?.description}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeAllDropdowns}
                                className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                                aria-label={t("closeMenu")}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div key={activePanelKey} className="space-y-3">
                            {renderDrawerLinks(activeDesktopPanel?.links || [], showDrawerLinks)}
                        </div>
                        <div
                            className={`mt-8 border-t border-slate-400 pt-6 transition-all duration-500 ${showDrawerLinks ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                }`}
                        >
                            <button
                                onMouseDown={() => handleLinkClick("/contact")}
                                type="button"
                                className="group flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left text-white transition"
                            >
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-black" />
                                    <span className="font-semibold text-black">{t("contact")}</span>
                                </div>

                                <ArrowRight className="h-4 w-4 text-black transition group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </aside>

                <div className={`lg:hidden fixed top-0 left-0 w-full h-[100vh] bg-white z-50 transition-all ${showMenu ? "block" : "hidden"}`}>
                    <div className="bg-white shadow-lg py-4 px-6 h-full overflow-auto">
                        <div className="flex justify-between mb-4">
                            <Link to="/" className="font-semibold text-gray-800 hover:bg-gray-300 py-2 px-4 rounded-lg">
                                <img src={logoSrc} className="h-10" alt="Logo Empresa" />
                            </Link>

                            <button
                                className="text-gray-800 focus:outline-none"
                                onClick={() => toggleDropdown("menu")}
                                type="button"
                            >
                                <ChevronUp className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="border-b-2 py-2">
                            <button
                                className="flex justify-between items-center w-full text-gray-800 font-semibold text-left"
                                onClick={() => toggleDropdown("brands")}
                                type="button"
                            >
                                {t("brands")}
                                {showBrandsDropdown ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </button>

                            {showBrandsDropdown && (
                                <div className="pl-4 mt-2">
                                    {brandsLinks.map((link) => (
                                        <button
                                            key={link.key}
                                            onMouseDown={() => handleLinkClick(link.path)}
                                            className="block py-1 text-gray-700 hover:text-gray-900"
                                            type="button"
                                        >
                                            {link.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-b-2 py-2">
                            <button
                                className="flex justify-between items-center w-full text-gray-800 font-semibold text-left"
                                onClick={() => toggleDropdown("products")}
                                type="button"
                            >
                                {t("products")}
                                {showProductsDropdown ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </button>

                            {showProductsDropdown && (
                                <div className="pl-4 mt-2">
                                    {productLinks.map((link) => (
                                        <button
                                            key={link.key}
                                            onMouseDown={() => handleLinkClick(link.path)}
                                            className="block py-1 text-gray-700 hover:text-gray-900"
                                            type="button"
                                        >
                                            {link.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-b-2 py-2">
                            <button
                                className="flex justify-between items-center w-full text-gray-800 font-semibold text-left"
                                onClick={() => toggleDropdown("company")}
                                type="button"
                            >
                                {t("company")}
                                {showCompanyDropdown ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </button>

                            {showCompanyDropdown && (
                                <div className="pl-4 mt-2">
                                    {companyLinks.map((link) => (
                                        <button
                                            key={link.key}
                                            onMouseDown={() => handleLinkClick(link.path)}
                                            className="block py-1 text-gray-700 hover:text-gray-900"
                                            type="button"
                                        >
                                            {link.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => handleLinkClick("/media")}
                            className="block text-gray-800 font-semibold py-2"
                            type="button"
                        >
                            {t("media")}
                        </button>

                        {/* {isAuthenticated && (
                            <button
                                onClick={() => handleLinkClick("/confeccion")}
                                className="block w-full text-left text-gray-800 font-semibold py-2"
                                type="button"
                            >
                                {t("tailoring")}
                            </button>
                        )} */}

                        <button
                            onClick={openFilters}
                            className="mt-6 w-full rounded-lg bg-[#26659E] py-3 text-center text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-[#26659E]/60"
                            type="button"
                        >
                            {t("filtersButtonLabel", "Filtros")}
                        </button>

                        {/* {isAuthenticated && (
                            <div className="mt-6 border-t border-b border-stone-200 py-4">
                                <p className="mb-3 text-xs uppercase tracking-wide text-stone-500">{t("customerArea")}</p>

                                {customerLinks.map((link) => (
                                    <button
                                        key={link.key}
                                        onClick={() => handleLinkClick(link.path)}
                                        className="block w-full text-left text-gray-800 font-semibold py-2"
                                        type="button"
                                    >
                                        {link.label}
                                    </button>
                                ))}
                            </div>
                        )} */}


                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;