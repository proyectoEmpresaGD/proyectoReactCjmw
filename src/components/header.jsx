import {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback
} from "react";
import { useTranslation } from "react-i18next";
import {
    Menu,
    Search,
    ChevronDown,
    ChevronUp,
    SlidersHorizontal,
    ArrowRight,
    ArrowLeft,
    X,
    Globe,
    Mail
} from "lucide-react";
import {
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";

import "tailwindcss/tailwind.css";

import SearchBar from "./SearchBar";
import { useMarca } from "./MarcaContext";
import { useAuth } from "../context/AuthContext.jsx";
import ModalMapa from "./ComponentesProductos/modalMapa.jsx";

import {
    languageOptions,
    brandLogos,
    defaultLogo,
} from "../Constants/constants";


const getBrandCodeFromLocation = (
    location,
    pathToBrandMap,
    logosByBrand
) => {
    if (!location) {
        return null;
    }

    const params =
        new URLSearchParams(
            location.search || ""
        );

    const brandFromQuery =
        params.get("brand");

    if (
        brandFromQuery &&
        logosByBrand?.[brandFromQuery]
    ) {
        return brandFromQuery;
    }

    const brandFromPath =
        pathToBrandMap?.[
        location.pathname
        ];

    if (
        brandFromPath &&
        logosByBrand?.[brandFromPath]
    ) {
        return brandFromPath;
    }

    return null;
};


const getHeaderLogoSrc = (
    location,
    {
        pathToBrandMap,
        logosByBrand,
        fallbackLogo
    }
) => {
    const brandCode =
        getBrandCodeFromLocation(
            location,
            pathToBrandMap,
            logosByBrand
        );

    return brandCode
        ? logosByBrand[brandCode]
        : fallbackLogo;
};


export const Header = () => {
    const { t, i18n } =
        useTranslation("header");

    const navigate = useNavigate();
    const location = useLocation();

    const {
        marcaActiva,
        setMarcaActiva
    } = useMarca();

    const {
        isAuthenticated
    } = useAuth();


    /* ──────────────────────────────
       STATE
       ────────────────────────────── */

    const [
        showMenu,
        setShowMenu
    ] = useState(false);

    const [
        showBrandsDropdown,
        setShowBrandsDropdown
    ] = useState(false);

    const [
        showProductsDropdown,
        setShowProductsDropdown
    ] = useState(false);

    const [
        showFabricLayer,
        setShowFabricLayer
    ] = useState(false);

    const [
        showWallpaperLayer,
        setShowWallpaperLayer
    ] = useState(false);

    const [
        showCompanyDropdown,
        setShowCompanyDropdown
    ] = useState(false);

    const [
        showLanguageDropdown,
        setShowLanguageDropdown
    ] = useState(false);

    const [
        showSearchBar,
        setShowSearchBar
    ] = useState(false);

    const [
        showDrawerLinks,
        setShowDrawerLinks
    ] = useState(false);

    const [
        isHovered,
        setIsHovered
    ] = useState(false);

    const [
        showStoreLocator,
        setShowStoreLocator
    ] = useState(false);

    const [
        selectedLanguage,
        setSelectedLanguage
    ] = useState(
        languageOptions.find(
            (opt) =>
                opt.value ===
                i18n.language
        ) || languageOptions[0]
    );


    /* ──────────────────────────────
       REFS
       ────────────────────────────── */

    const searchRef = useRef(null);
    const languageRef = useRef(null);

    const menuRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const brandsRef = useRef(null);
    const productsRef = useRef(null);
    const companyRef = useRef(null);

    const desktopDrawerRef =
        useRef(null);


    /* ──────────────────────────────
       BRAND
       ────────────────────────────── */

    const pathToBrand = {
        "/arenaHome": "ARE",
        "/harbourHome": "HAR",
        "/bassariHome": "BAS",
        "/cjmHome": "CJM",
        "/flamencoHome": "FLA",
    };


    /* ──────────────────────────────
       LINKS
       ────────────────────────────── */

    const brandsLinks = useMemo(
        () =>
            [
                "arenaHome",
                "harbourHome",
                "cjmHome",
                "flamencoHome",
                "bassariHome"
            ].map((key) => ({
                key,

                label: t(
                    key
                        .replace(
                            "Home",
                            ""
                        )
                        .toLowerCase()
                ),

                path: `/${key}`,
            })),
        [t]
    );


    const productLinks = useMemo(
        () => [
            {
                key: "wallpaper",

                label: t(
                    "productMenu.wallpaper.title"
                ),

                hasSubmenu: true
            },
            {
                key: "fabric",

                label: t(
                    "fabric"
                ),

                hasSubmenu: true
            },
        ],
        [t]
    );


    const wallpaperMenu = useMemo(
        () => ({
            all: {
                key: "wallpaperAll",

                label: t(
                    "productMenu.viewAll"
                ),

                path:
                    "/products?type=wallpaper"
            },

            sectionLabel: t(
                "productMenu.type"
            ),

            items: [
                {
                    key: "raffia",

                    label: t(
                        "productMenu.wallpaper.raffia"
                    ),

                    path:
                        "/products?type=wallpaper&codtipo=103"
                },
                {
                    key: "wallpaperPaper",

                    label: t(
                        "productMenu.wallpaper.wallpaperPaper"
                    ),

                    path:
                        "/products?type=wallpaper&codtipo=111"
                },
                {
                    key: "vinylWallpaper",

                    label: t(
                        "productMenu.wallpaper.vinylWallpaper"
                    ),

                    path:
                        "/products?type=wallpaper&codtipo=112"
                },
            ]
        }),
        [t]
    );


    const fabricMenu = useMemo(
        () => ({
            all: {
                key: "fabricAll",

                label: t(
                    "productMenu.viewAll"
                ),

                path:
                    "/products?type=tela"
            },

            sections: [
                {
                    key: "fabricType",

                    label: t(
                        "productMenu.type"
                    ),

                    items: [
                        {
                            key: "velvet",

                            label: t(
                                "productMenu.fabric.velvet"
                            ),

                            path:
                                "/products?type=tela&fabricType=TERCIOPELO"
                        },
                        {
                            key: "sheer",

                            label: t(
                                "productMenu.fabric.sheer"
                            ),

                            path:
                                "/products?type=tela&fabricType=VISILLO"
                        },
                        {
                            key: "linen",

                            label: t(
                                "productMenu.fabric.linen"
                            ),

                            path:
                                "/products?type=tela&fabricType=LINO"
                        },
                        {
                            key: "printed",

                            label: t(
                                "productMenu.fabric.printed"
                            ),

                            path:
                                "/products?type=tela&fabricType=ESTAMPADO"
                        },
                        {
                            key: "cotton",

                            label: t(
                                "productMenu.fabric.cotton"
                            ),

                            path:
                                "/products?type=tela&fabricType=ALGODON"
                        },
                    ]
                },

                {
                    key: "fabricUsage",

                    label: t(
                        "productMenu.usage"
                    ),

                    items: [
                        {
                            key: "easyClean",

                            label: t(
                                "productMenu.fabric.easyClean"
                            ),

                            path:
                                "/products?type=tela&mantenimiento=EASYCLEAN"
                        },
                        {
                            key: "fireRetardant",

                            label: t(
                                "productMenu.fabric.fireRetardant"
                            ),

                            path:
                                "/products?type=tela&uso=FR"
                        },
                        {
                            key: "outdoor",

                            label: t(
                                "productMenu.fabric.outdoor"
                            ),

                            path:
                                "/products?type=tela&uso=OUTDOOR"
                        },
                        {
                            key: "imo",

                            label: t(
                                "productMenu.fabric.imo"
                            ),

                            path:
                                "/products?type=tela&uso=IMO"
                        },
                        {
                            key: "blackout",

                            label: t(
                                "productMenu.fabric.blackout"
                            ),

                            path:
                                "/products?type=tela&uso=100%25%20OPACIDAD"
                        },
                    ]
                }
            ]
        }),
        [t]
    );


    const companyLinks = useMemo(
        () => [
            {
                key: "about",
                label: t("about"),
                path: "/about"
            },
            {
                key: "contact",
                label: t("contact"),
                path: "/contact"
            },
            {
                key: "contract",
                label: t("contract"),
                path: "/contract"
            },
            {
                key: "brochures",
                label: t("brochures"),
                path: "/media"
            },
        ],
        [t]
    );


    /* ──────────────────────────────
       DESKTOP PANEL
       ────────────────────────────── */

    const activeDesktopPanel =
        useMemo(() => {
            if (showBrandsDropdown) {
                return {
                    title:
                        t("brands"),

                    description:
                        t(
                            "drawer.brandsDescription"
                        ),

                    links:
                        brandsLinks,
                };
            }

            if (showProductsDropdown) {
                return {
                    title:
                        t("products"),

                    description:
                        t(
                            "drawer.productsDescription"
                        ),

                    links:
                        productLinks,
                };
            }

            if (showCompanyDropdown) {
                return {
                    title:
                        t("company"),

                    description:
                        t(
                            "drawer.companyDescription"
                        ),

                    links:
                        companyLinks,
                };
            }

            return null;
        }, [
            brandsLinks,
            companyLinks,
            productLinks,
            showBrandsDropdown,
            showCompanyDropdown,
            showProductsDropdown,
            t
        ]);


    const activePanelKey =
        useMemo(() => {
            if (showBrandsDropdown) {
                return "brands";
            }

            if (showProductsDropdown) {
                return "products";
            }

            if (showCompanyDropdown) {
                return "company";
            }

            return "none";
        }, [
            showBrandsDropdown,
            showProductsDropdown,
            showCompanyDropdown
        ]);


    /* ──────────────────────────────
       LANGUAGE
       ────────────────────────────── */

    useEffect(() => {
        const found =
            languageOptions.find(
                (opt) =>
                    opt.value ===
                    i18n.language
            );

        if (found) {
            setSelectedLanguage(
                found
            );
        }
    }, [i18n.language]);


    /* ──────────────────────────────
       BRAND FROM LOCATION
       ────────────────────────────── */

    useEffect(() => {
        const code =
            getBrandCodeFromLocation(
                location,
                pathToBrand,
                brandLogos
            );

        if (
            marcaActiva !== code
        ) {
            setMarcaActiva(
                code
            );
        }
    }, [
        location.pathname,
        location.search
    ]); // eslint-disable-line react-hooks/exhaustive-deps


    const logoSrc =
        getHeaderLogoSrc(
            location,
            {
                pathToBrandMap:
                    pathToBrand,

                logosByBrand:
                    brandLogos,

                fallbackLogo:
                    defaultLogo,
            }
        );


    /* ──────────────────────────────
       CLOSE HELPERS
       ────────────────────────────── */

    const closeAllDropdowns =
        useCallback(() => {
            setShowBrandsDropdown(
                false
            );

            setShowProductsDropdown(
                false
            );

            setShowFabricLayer(
                false
            );

            setShowWallpaperLayer(
                false
            );

            setShowCompanyDropdown(
                false
            );

            setShowLanguageDropdown(
                false
            );

            setShowDrawerLinks(
                false
            );
        }, []);


    const closeMobileMenu =
        useCallback(() => {
            closeAllDropdowns();

            setShowSearchBar(
                false
            );

            setShowMenu(
                false
            );
        }, [
            closeAllDropdowns
        ]);


    /* ──────────────────────────────
       CLICK OUTSIDE
       ────────────────────────────── */

    useEffect(() => {
        const handleClickOutside =
            (event) => {
                const clickedInsideMenu =
                    mobileMenuRef.current
                        ?.contains(
                            event.target
                        );

                if (
                    clickedInsideMenu
                ) {
                    return;
                }

                if (
                    !searchRef.current
                        ?.contains(
                            event.target
                        ) &&
                    !languageRef.current
                        ?.contains(
                            event.target
                        ) &&
                    !menuRef.current
                        ?.contains(
                            event.target
                        ) &&
                    !brandsRef.current
                        ?.contains(
                            event.target
                        ) &&
                    !productsRef.current
                        ?.contains(
                            event.target
                        ) &&
                    !companyRef.current
                        ?.contains(
                            event.target
                        ) &&
                    !desktopDrawerRef
                        .current
                        ?.contains(
                            event.target
                        )
                ) {
                    closeAllDropdowns();
                }

                if (
                    !searchRef.current
                        ?.contains(
                            event.target
                        )
                ) {
                    setShowSearchBar(
                        false
                    );
                }
            };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [
        closeAllDropdowns
    ]);


    /* ──────────────────────────────
       DRAWER ANIMATION
       ────────────────────────────── */

    useEffect(() => {
        let timeoutId;

        if (activeDesktopPanel) {
            setShowDrawerLinks(
                false
            );

            timeoutId =
                setTimeout(() => {
                    setShowDrawerLinks(
                        true
                    );
                }, 500);
        } else {
            setShowDrawerLinks(
                false
            );
        }

        return () => {
            if (timeoutId) {
                clearTimeout(
                    timeoutId
                );
            }
        };
    }, [
        activePanelKey,
        activeDesktopPanel
    ]);


    /* ──────────────────────────────
       DESKTOP TOGGLE
       ────────────────────────────── */

    const toggleDropdown =
        (dropdown) => {
            const isBrandsOpen =
                showBrandsDropdown;

            const isProductsOpen =
                showProductsDropdown;

            const isCompanyOpen =
                showCompanyDropdown;

            const isMenuOpen =
                showMenu;

            const isLanguageOpen =
                showLanguageDropdown;

            const isSearchOpen =
                showSearchBar;

            closeAllDropdowns();

            if (
                dropdown !== "search"
            ) {
                setShowSearchBar(
                    false
                );
            }

            switch (dropdown) {
                case "menu":
                    setShowMenu(
                        !isMenuOpen
                    );
                    break;

                case "brands":
                    setShowBrandsDropdown(
                        !isBrandsOpen
                    );
                    break;

                case "products":
                    setShowProductsDropdown(
                        !isProductsOpen
                    );
                    break;

                case "company":
                    setShowCompanyDropdown(
                        !isCompanyOpen
                    );
                    break;

                case "language":
                    setShowLanguageDropdown(
                        !isLanguageOpen
                    );
                    break;

                case "search":
                    setShowSearchBar(
                        !isSearchOpen
                    );
                    break;

                default:
                    break;
            }
        };


    /* ──────────────────────────────
       MOBILE NAVIGATION
       ────────────────────────────── */

    const openMobileProducts =
        () => {
            setShowBrandsDropdown(
                false
            );

            setShowCompanyDropdown(
                false
            );

            setShowFabricLayer(
                false
            );

            setShowWallpaperLayer(
                false
            );

            setShowProductsDropdown(
                true
            );
        };


    const openMobileFabric =
        () => {
            setShowWallpaperLayer(
                false
            );

            setShowFabricLayer(
                true
            );
        };


    const openMobileWallpaper =
        () => {
            setShowFabricLayer(
                false
            );

            setShowWallpaperLayer(
                true
            );
        };


    const backToMobileMain =
        () => {
            setShowFabricLayer(
                false
            );

            setShowWallpaperLayer(
                false
            );

            setShowProductsDropdown(
                false
            );
        };


    const backToMobileProducts =
        () => {
            setShowFabricLayer(
                false
            );

            setShowWallpaperLayer(
                false
            );
        };


    /* ──────────────────────────────
       STORE LOCATOR
       ────────────────────────────── */

    const openStoreLocator = () => {
        closeAllDropdowns();

        setShowSearchBar(
            false
        );

        setShowMenu(
            false
        );

        setShowStoreLocator(
            true
        );
    };


    /* ──────────────────────────────
       NAVIGATION
       ────────────────────────────── */

    const handleLinkClick =
        (path) => {
            if (
                typeof window
                    .closeModalGlobal ===
                "function"
            ) {
                window
                    .closeModalGlobal();
            }

            setTimeout(
                () =>
                    navigate(path),
                100
            );

            closeMobileMenu();
        };


    /* ──────────────────────────────
       ACTIVE FILTER
       ────────────────────────────── */

    const hasActiveFilters =
        useMemo(() => {
            if (
                !location.pathname
                    .startsWith(
                        "/products"
                    )
            ) {
                return false;
            }

            const params =
                new URLSearchParams(
                    location.search
                );

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
                "codtipo",
            ];

            return filterKeys.some(
                (key) =>
                    params
                        .getAll(key)
                        .length > 0
            );
        }, [
            location.pathname,
            location.search
        ]);


    /* ──────────────────────────────
       FILTERS
       ────────────────────────────── */

    const openFilters =
        useCallback(() => {
            closeAllDropdowns();

            setShowSearchBar(
                false
            );

            setShowMenu(
                false
            );

            if (
                location.pathname
                    .startsWith(
                        "/products"
                    )
            ) {
                window.dispatchEvent(
                    new CustomEvent(
                        "openProductFilters"
                    )
                );

                return;
            }

            navigate(
                "/products",
                {
                    state: {
                        openFilters:
                            true
                    }
                }
            );
        }, [
            closeAllDropdowns,
            location.pathname,
            navigate
        ]);


    /* ──────────────────────────────
       LANGUAGE CHANGE
       ────────────────────────────── */

    const changeLanguage =
        (opt) => {
            i18n.changeLanguage(
                opt.value
            );

            setSelectedLanguage(
                opt
            );

            setShowLanguageDropdown(
                false
            );
        };


    /* ──────────────────────────────
       DESKTOP DRAWER LINKS
       ────────────────────────────── */

    const renderDrawerLinks =
        (links, isVisible) =>
            links.map(
                (
                    link,
                    index
                ) => {
                    const isFabric =
                        link.key ===
                        "fabric";

                    const isWallpaper =
                        link.key ===
                        "wallpaper";

                    const isActive =
                        showProductsDropdown &&
                        (
                            (
                                isFabric &&
                                showFabricLayer
                            ) ||
                            (
                                isWallpaper &&
                                showWallpaperLayer
                            )
                        );

                    return (
                        <button
                            key={
                                link.key
                            }
                            onClick={(
                                event
                            ) => {
                                event.preventDefault();
                                event.stopPropagation();

                                if (
                                    showProductsDropdown &&
                                    isFabric
                                ) {
                                    setShowWallpaperLayer(
                                        false
                                    );

                                    setShowFabricLayer(
                                        (
                                            current
                                        ) =>
                                            !current
                                    );

                                    return;
                                }

                                if (
                                    showProductsDropdown &&
                                    isWallpaper
                                ) {
                                    setShowFabricLayer(
                                        false
                                    );

                                    setShowWallpaperLayer(
                                        (
                                            current
                                        ) =>
                                            !current
                                    );

                                    return;
                                }

                                if (
                                    link.path
                                ) {
                                    handleLinkClick(
                                        link.path
                                    );
                                }
                            }}
                            type="button"
                            style={{
                                transitionDelay:
                                    isVisible
                                        ? `${index * 120}ms`
                                        : "0ms",
                            }}
                            className={`
                                group
                                flex w-full
                                items-center
                                justify-between
                                rounded-2xl
                                border
                                px-4 py-4
                                text-left
                                transition-all
                                duration-500
                                ease-out
                                hover:border-slate-200
                                hover:bg-white
                                hover:shadow-sm

                                ${isActive
                                    ? "border-slate-300 bg-white shadow-sm"
                                    : "border-transparent bg-white/70"
                                }

                                ${isVisible
                                    ? "translate-x-0 opacity-100"
                                    : "-translate-x-12 opacity-0 pointer-events-none"
                                }
                            `}
                        >
                            <span className="font-medium text-slate-800">
                                {
                                    link.label
                                }
                            </span>

                            <ArrowRight
                                className={`
                                    h-4 w-4
                                    transition
                                    group-hover:translate-x-1

                                    ${isActive
                                        ? "translate-x-1 text-slate-700"
                                        : "text-slate-400 group-hover:text-slate-700"
                                    }
                                `}
                            />
                        </button>
                    );
                }
            );


    return (
        <>
            <header
                className={`
                    fixed
                    left-0
                    top-0
                    z-40
                    w-full
                    bg-white
                    transition-all
                    duration-500
                    ease-in-out

                    ${isHovered ||
                        showSearchBar ||
                        showBrandsDropdown ||
                        showProductsDropdown ||
                        showCompanyDropdown ||
                        showLanguageDropdown ||
                        showMenu
                        ? "shadow-md"
                        : "bg-transparent"
                    }
                `}
                onMouseEnter={() =>
                    setIsHovered(
                        true
                    )
                }
                onMouseLeave={() =>
                    setIsHovered(
                        false
                    )
                }
            >

                {/* HEADER PRINCIPAL */}
                <div className="container mx-auto flex items-center justify-between px-4 py-2 lg:px-8">

                    {/* LOGO / MOBILE MENU */}
                    <div className="flex items-center">
                        <button
                            ref={menuRef}
                            type="button"
                            className="text-gray-800 focus:outline-none lg:hidden"
                            onClick={() =>
                                toggleDropdown(
                                    "menu"
                                )
                            }
                            aria-label={
                                t(
                                    "navigation"
                                )
                            }
                        >
                            {showMenu ? (
                                <ChevronUp className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>

                        <Link
                            to="/"
                            className="flex items-center space-x-2 rounded-lg px-2 py-2 font-semibold text-gray-800 duration-150 hover:scale-110"
                        >
                            <img
                                key={
                                    logoSrc
                                }
                                src={
                                    logoSrc
                                }
                                className="h-9 lg:h-14 xl:h-14"
                                alt="Logo"
                            />
                        </Link>
                    </div>


                    {/* DESKTOP NAV */}
                    <div className="hidden flex-grow items-center justify-center gap-2 lg:flex xl:gap-3">

                        {/* MARCAS */}
                        <div
                            ref={
                                brandsRef
                            }
                            className="relative"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    toggleDropdown(
                                        "brands"
                                    )
                                }
                                className={`
                                    flex items-center
                                    rounded-full
                                    px-2 py-2.5
                                    font-semibold
                                    transition
                                    xl:px-4

                                    ${showBrandsDropdown
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                                    }
                                `}
                            >
                                {t(
                                    "brands"
                                )}

                                {showBrandsDropdown ? (
                                    <ChevronUp className="ml-2 h-4 w-4" />
                                ) : (
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                )}
                            </button>
                        </div>


                        {/* COLECCIONES */}
                        <Link
                            to="/colecciones"
                            className="flex items-center rounded-full px-2 py-2.5 font-semibold text-gray-800 transition hover:bg-gray-200 hover:text-gray-900 xl:px-4"
                        >
                            {t(
                                "collections",
                                "Colecciones"
                            )}
                        </Link>


                        {/* PRODUCTOS */}
                        <div
                            ref={
                                productsRef
                            }
                            className="relative"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    toggleDropdown(
                                        "products"
                                    )
                                }
                                className={`
                                    flex items-center
                                    rounded-full
                                    px-2 py-2.5
                                    font-semibold
                                    transition
                                    xl:px-4

                                    ${showProductsDropdown
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                                    }
                                `}
                            >
                                {t(
                                    "products"
                                )}

                                {showProductsDropdown ? (
                                    <ChevronUp className="ml-2 h-4 w-4" />
                                ) : (
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                )}
                            </button>
                        </div>


                        {/* PUNTOS DE VENTA */}
                        <button
                            type="button"
                            onClick={
                                openStoreLocator
                            }
                            className="rounded-full px-2 py-2.5 font-semibold text-gray-800 transition hover:bg-gray-200 hover:text-gray-900 xl:px-4"
                        >
                            {t(
                                "storeLocations",
                                "Puntos de venta"
                            )}
                        </button>


                        {/* CONFECCIÓN */}
                        {isAuthenticated && (
                            <Link
                                to="/confeccion"
                                className="rounded-full px-2 py-2.5 font-semibold text-gray-800 transition hover:bg-gray-200 hover:text-gray-900 xl:px-4"
                            >
                                {t(
                                    "tailoring"
                                )}
                            </Link>
                        )}


                        {/* EMPRESA */}
                        <div
                            ref={
                                companyRef
                            }
                            className="relative"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    toggleDropdown(
                                        "company"
                                    )
                                }
                                className={`
                                    flex items-center
                                    rounded-full
                                    px-2 py-2.5
                                    font-semibold
                                    transition
                                    xl:px-4

                                    ${showCompanyDropdown
                                        ? "bg-slate-900 text-white shadow-md"
                                        : "text-gray-800 hover:bg-gray-200 hover:text-gray-900"
                                    }
                                `}
                            >
                                {t(
                                    "company"
                                )}

                                {showCompanyDropdown ? (
                                    <ChevronUp className="ml-2 h-4 w-4" />
                                ) : (
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>


                    {/* ICONOS DERECHA */}
                    <div className="flex items-center space-x-2 xl:space-x-4">

                        {/* FILTROS */}
                        <div className="group relative">
                            <button
                                type="button"
                                onClick={
                                    openFilters
                                }
                                className="relative text-gray-800 transition hover:text-[#26659E] focus:outline-none focus-visible:text-[#26659E]"
                                aria-label={t(
                                    "openFilters",
                                    "Abrir filtros"
                                )}
                            >
                                <SlidersHorizontal className="h-6 w-6" />

                                {hasActiveFilters && (
                                    <span className="absolute right-0 top-0 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#26659E]" />
                                )}
                            </button>

                            <div
                                role="tooltip"
                                className="pointer-events-none absolute left-1/2 top-full z-[100] mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 lg:block"
                            >
                                {t(
                                    "openFilters",
                                    "Abrir filtros"
                                )}

                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-gray-900" />
                            </div>
                        </div>


                        {/* BUSCADOR */}
                        <div
                            ref={
                                searchRef
                            }
                            className="relative"
                        >
                            <div className="group relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        toggleDropdown(
                                            "search"
                                        )
                                    }
                                    className="text-gray-800 transition hover:text-[#26659E] focus:outline-none focus-visible:text-[#26659E]"
                                    aria-label={t(
                                        "search",
                                        "Buscar"
                                    )}
                                >
                                    <Search className="h-6 w-6" />
                                </button>

                                <div
                                    role="tooltip"
                                    className="pointer-events-none absolute left-1/2 top-full z-[100] mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 lg:block"
                                >
                                    {t(
                                        "search",
                                        "Buscar"
                                    )}

                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-gray-900" />
                                </div>
                            </div>

                            {showSearchBar && (
                                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg bg-white p-4 shadow-lg">
                                    <SearchBar
                                        closeSearchBar={() =>
                                            setShowSearchBar(
                                                false
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </div>


                        {/* IDIOMA */}
                        <div
                            ref={
                                languageRef
                            }
                            className="relative"
                        >
                            <div className="group relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        toggleDropdown(
                                            "language"
                                        )
                                    }
                                    className="text-gray-800 transition hover:text-[#26659E] focus:outline-none focus-visible:text-[#26659E]"
                                    aria-label={t(
                                        "changeLanguage",
                                        "Cambiar idioma"
                                    )}
                                >
                                    <Globe className="h-6 w-6" />
                                </button>

                                <div
                                    role="tooltip"
                                    className="pointer-events-none absolute left-1/2 top-full z-[100] mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 lg:block"
                                >
                                    {t(
                                        "changeLanguage",
                                        "Cambiar idioma"
                                    )}

                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-x-4 border-b-4 border-x-transparent border-b-gray-900" />
                                </div>
                            </div>

                            {showLanguageDropdown && (
                                <div className="absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-md bg-white py-2 shadow-lg">
                                    {languageOptions.map(
                                        (
                                            opt
                                        ) => {
                                            const isActive =
                                                selectedLanguage
                                                    ?.value ===
                                                opt.value;

                                            return (
                                                <button
                                                    key={
                                                        opt.value
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        changeLanguage(
                                                            opt
                                                        )
                                                    }
                                                    className={`
                                                        block
                                                        w-full
                                                        px-4 py-2
                                                        text-left
                                                        text-sm
                                                        transition

                                                        ${isActive
                                                            ? "bg-stone-200 font-semibold text-stone-900"
                                                            : "text-stone-700 hover:bg-stone-100"
                                                        }
                                                    `}
                                                >
                                                    {
                                                        opt.label
                                                    }
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* OVERLAY DESKTOP */}
                <div
                    className={`
                        pointer-events-none
                        fixed inset-0
                        top-[84px]
                        hidden
                        transition
                        duration-300
                        lg:block

                        ${activeDesktopPanel
                            ? "bg-slate-950/20 opacity-100"
                            : "opacity-0"
                        }
                    `}
                />


                {/* DRAWER PRINCIPAL DESKTOP */}
                <aside
                    ref={
                        desktopDrawerRef
                    }
                    className={`
                        fixed
                        left-0
                        top-[84px]
                        z-50
                        hidden
                        h-[calc(100vh-84px)]
                        w-1/4
                        min-w-[300px]
                        overflow-auto
                        border-r
                        border-slate-200
                        bg-gradient-to-b
                        from-white
                        via-slate-50
                        to-slate-100
                        shadow-2xl
                        transition-all
                        duration-500
                        ease-out
                        lg:block

                        ${activeDesktopPanel
                            ? "translate-x-0"
                            : "-translate-x-full"
                        }
                    `}
                >
                    <div className="flex min-h-full flex-col px-6 py-8">

                        <div className="mb-8 flex items-start justify-between gap-4">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    {t(
                                        "navigation"
                                    )}
                                </p>

                                <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                                    {
                                        activeDesktopPanel
                                            ?.title
                                    }
                                </h2>

                                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                                    {
                                        activeDesktopPanel
                                            ?.description
                                    }
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeAllDropdowns
                                }
                                className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                                aria-label={t(
                                    "closeMenu"
                                )}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>


                        <div
                            key={
                                activePanelKey
                            }
                            className="space-y-3"
                        >
                            {renderDrawerLinks(
                                activeDesktopPanel
                                    ?.links ||
                                [],
                                showDrawerLinks
                            )}
                        </div>


                        <div
                            className={`
                                mt-8
                                border-t
                                border-slate-400
                                pt-6
                                transition-all
                                duration-500

                                ${showDrawerLinks
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-4 opacity-0"
                                }
                            `}
                        >
                            <button
                                type="button"
                                onMouseDown={() =>
                                    handleLinkClick(
                                        "/contact"
                                    )
                                }
                                className="group flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-black" />

                                    <span className="font-semibold text-black">
                                        {t(
                                            "contact"
                                        )}
                                    </span>
                                </div>

                                <ArrowRight className="h-4 w-4 text-black transition group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </aside>


                {/* TELAS DESKTOP */}
                <aside
                    className={`
                        fixed
                        left-1/4
                        top-[84px]
                        z-40
                        hidden
                        h-[calc(100vh-84px)]
                        w-[390px]
                        overflow-y-auto
                        border-r
                        border-stone-200/80
                        bg-[#FCFBF9]
                        shadow-[18px_0_45px_-28px_rgba(15,23,42,0.35)]
                        transition-all
                        duration-500
                        ease-out
                        lg:block

                        ${showProductsDropdown &&
                            showFabricLayer
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-full opacity-0 pointer-events-none"
                        }
                    `}
                    aria-hidden={
                        !(
                            showProductsDropdown &&
                            showFabricLayer
                        )
                    }
                >
                    <div className="flex min-h-full flex-col px-8 py-9">

                        <div className="mb-9 flex items-start justify-between gap-5">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-stone-400">
                                    {t(
                                        "products"
                                    )}
                                </p>

                                <h3 className="mt-3 text-[30px] font-medium leading-none tracking-[-0.03em] text-stone-900">
                                    {t(
                                        "fabric"
                                    )}
                                </h3>

                                <div className="mt-4 h-px w-10 bg-stone-900" />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowFabricLayer(
                                        false
                                    )
                                }
                                className="group flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 shadow-sm transition-all duration-300 hover:-rotate-90 hover:border-stone-300 hover:text-stone-900 hover:shadow-md"
                                aria-label={t(
                                    "closeMenu"
                                )}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>


                        <button
                            type="button"
                            onMouseDown={() =>
                                handleLinkClick(
                                    fabricMenu
                                        .all
                                        .path
                                )
                            }
                            className="group relative mb-10 flex w-full items-center justify-between overflow-hidden border-y border-stone-200 py-4 text-left"
                        >
                            <span className="relative z-10 text-[13px] font-semibold tracking-[0.08em] text-stone-900 transition-transform duration-300 group-hover:translate-x-1">
                                {
                                    fabricMenu
                                        .all
                                        .label
                                }
                            </span>

                            <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-black">
                                <ArrowRight className="h-3.5 w-3.5" />
                            </span>

                            <span className="absolute inset-0 origin-left scale-x-0 bg-stone-100/80 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                        </button>


                        <div className="space-y-10">
                            {fabricMenu
                                .sections
                                .map(
                                    (
                                        section
                                    ) => (
                                        <section
                                            key={
                                                section.key
                                            }
                                        >
                                            <div className="mb-4 flex items-center gap-4">
                                                <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                                                    {
                                                        section.label
                                                    }
                                                </p>

                                                <span className="h-px flex-1 bg-stone-200" />
                                            </div>

                                            <div>
                                                {section
                                                    .items
                                                    .map(
                                                        (
                                                            item
                                                        ) => (
                                                            <button
                                                                key={
                                                                    item.key
                                                                }
                                                                type="button"
                                                                onMouseDown={() =>
                                                                    handleLinkClick(
                                                                        item.path
                                                                    )
                                                                }
                                                                className="group relative flex w-full items-center justify-between border-b border-stone-100 py-3.5 text-left transition-all duration-300 last:border-b-0"
                                                            >
                                                                <span className="relative text-[14px] font-normal tracking-[0.015em] text-stone-600 transition-all duration-300 group-hover:translate-x-2 group-hover:font-medium group-hover:text-stone-950">
                                                                    {
                                                                        item.label
                                                                    }
                                                                </span>

                                                                <span className="flex h-7 w-7 translate-x-2 items-center justify-center rounded-full border border-transparent text-stone-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:border-stone-200 group-hover:bg-white group-hover:text-stone-800 group-hover:opacity-100">
                                                                    <ArrowRight className="h-3 w-3" />
                                                                </span>

                                                                <span className="absolute bottom-0 left-0 h-px w-0 bg-stone-800 transition-all duration-500 group-hover:w-full" />
                                                            </button>
                                                        )
                                                    )}
                                            </div>
                                        </section>
                                    )
                                )}
                        </div>


                        <div className="mt-auto pt-12">
                            <div className="border-t border-stone-200 pt-5">
                                <p className="max-w-[260px] text-[11px] leading-5 tracking-[0.04em] text-stone-400">
                                    {t(
                                        "productMenu.fabric.description"
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>


                {/* WALLPAPERS DESKTOP */}
                <aside
                    className={`
                        fixed
                        left-1/4
                        top-[84px]
                        z-40
                        hidden
                        h-[calc(100vh-84px)]
                        w-[390px]
                        overflow-y-auto
                        border-r
                        border-stone-200/80
                        bg-[#FCFBF9]
                        shadow-[18px_0_45px_-28px_rgba(15,23,42,0.35)]
                        transition-all
                        duration-500
                        ease-out
                        lg:block

                        ${showProductsDropdown &&
                            showWallpaperLayer
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-full opacity-0 pointer-events-none"
                        }
                    `}
                    aria-hidden={
                        !(
                            showProductsDropdown &&
                            showWallpaperLayer
                        )
                    }
                >
                    <div className="flex min-h-full flex-col px-8 py-9">

                        <div className="mb-9 flex items-start justify-between gap-5">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-stone-400">
                                    {t(
                                        "products"
                                    )}
                                </p>

                                <h3 className="mt-3 text-[30px] font-medium leading-none tracking-[-0.03em] text-stone-900">
                                    {t(
                                        "productMenu.wallpaper.title"
                                    )}
                                </h3>

                                <div className="mt-4 h-px w-10 bg-stone-900" />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowWallpaperLayer(
                                        false
                                    )
                                }
                                className="group flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 shadow-sm transition-all duration-300 hover:-rotate-90 hover:border-stone-300 hover:text-stone-900 hover:shadow-md"
                                aria-label={t(
                                    "closeMenu"
                                )}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>


                        <button
                            type="button"
                            onMouseDown={() =>
                                handleLinkClick(
                                    wallpaperMenu
                                        .all
                                        .path
                                )
                            }
                            className="group relative mb-10 flex w-full items-center justify-between overflow-hidden border-y border-stone-200 py-4 text-left"
                        >
                            <span className="relative z-10 text-[13px] font-semibold tracking-[0.08em] text-stone-900 transition-transform duration-300 group-hover:translate-x-1">
                                {
                                    wallpaperMenu
                                        .all
                                        .label
                                }
                            </span>

                            <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-black">
                                <ArrowRight className="h-3.5 w-3.5" />
                            </span>

                            <span className="absolute inset-0 origin-left scale-x-0 bg-stone-100/80 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                        </button>


                        <section>
                            <div className="mb-4 flex items-center gap-4">
                                <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                                    {
                                        wallpaperMenu
                                            .sectionLabel
                                    }
                                </p>

                                <span className="h-px flex-1 bg-stone-200" />
                            </div>

                            <div>
                                {wallpaperMenu
                                    .items
                                    .map(
                                        (
                                            item
                                        ) => (
                                            <button
                                                key={
                                                    item.key
                                                }
                                                type="button"
                                                onMouseDown={() =>
                                                    handleLinkClick(
                                                        item.path
                                                    )
                                                }
                                                className="group relative flex w-full items-center justify-between border-b border-stone-100 py-3.5 text-left transition-all duration-300 last:border-b-0"
                                            >
                                                <span className="relative text-[14px] font-normal tracking-[0.015em] text-stone-600 transition-all duration-300 group-hover:translate-x-2 group-hover:font-medium group-hover:text-stone-950">
                                                    {
                                                        item.label
                                                    }
                                                </span>

                                                <span className="flex h-7 w-7 translate-x-2 items-center justify-center rounded-full border border-transparent text-stone-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:border-stone-200 group-hover:bg-white group-hover:text-stone-800 group-hover:opacity-100">
                                                    <ArrowRight className="h-3 w-3" />
                                                </span>

                                                <span className="absolute bottom-0 left-0 h-px w-0 bg-stone-800 transition-all duration-500 group-hover:w-full" />
                                            </button>
                                        )
                                    )}
                            </div>
                        </section>


                        <div className="mt-auto pt-12">
                            <div className="border-t border-stone-200 pt-5">
                                <p className="max-w-[260px] text-[11px] leading-5 tracking-[0.04em] text-stone-400">
                                    {t(
                                        "productMenu.wallpaper.description"
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>


                {/* ─────────────────────────────
                    MOBILE MENU
                    ───────────────────────────── */}
                <div
                    ref={
                        mobileMenuRef
                    }
                    className={`
                        fixed
                        left-0
                        top-0
                        z-50
                        h-[100dvh]
                        w-full
                        overflow-hidden
                        bg-white
                        transition-all
                        lg:hidden

                        ${showMenu
                            ? "block"
                            : "hidden"
                        }
                    `}
                >

                    {/* MENÚ PRINCIPAL MOBILE */}
                    <div className="h-full overflow-y-auto bg-white px-6 py-4">

                        <div className="mb-6 flex items-center justify-between">

                            <Link
                                to="/"
                                onClick={
                                    closeMobileMenu
                                }
                                className="rounded-lg px-2 py-2"
                            >
                                <img
                                    src={
                                        logoSrc
                                    }
                                    className="h-10"
                                    alt="Logo Empresa"
                                />
                            </Link>

                            <button
                                type="button"
                                onClick={
                                    closeMobileMenu
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-600"
                                aria-label={t(
                                    "closeMenu"
                                )}
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>


                        {/* MARCAS MOBILE */}
                        <div className="border-b border-stone-200 py-4">
                            <button
                                type="button"
                                onClick={() =>
                                    toggleDropdown(
                                        "brands"
                                    )
                                }
                                className="flex w-full items-center justify-between text-left font-semibold text-gray-800"
                            >
                                {t(
                                    "brands"
                                )}

                                {showBrandsDropdown ? (
                                    <ChevronUp className="h-5 w-5" />
                                ) : (
                                    <ChevronDown className="h-5 w-5" />
                                )}
                            </button>

                            {showBrandsDropdown && (
                                <div className="mt-3 space-y-1 pl-4">
                                    {brandsLinks.map(
                                        (
                                            link
                                        ) => (
                                            <button
                                                key={
                                                    link.key
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleLinkClick(
                                                        link.path
                                                    )
                                                }
                                                className="block w-full py-2 text-left text-sm text-gray-600"
                                            >
                                                {
                                                    link.label
                                                }
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                        </div>


                        {/* COLECCIONES MOBILE */}
                        <div className="border-b border-stone-200 py-4">
                            <button
                                type="button"
                                onClick={() =>
                                    handleLinkClick(
                                        "/colecciones"
                                    )
                                }
                                className="block w-full text-left font-semibold text-gray-800"
                            >
                                {t(
                                    "collections",
                                    "Colecciones"
                                )}
                            </button>
                        </div>


                        {/* PRODUCTOS MOBILE */}
                        <div className="border-b border-stone-200 py-4">
                            <button
                                type="button"
                                onClick={
                                    openMobileProducts
                                }
                                className="flex w-full items-center justify-between text-left font-semibold text-gray-800"
                            >
                                <span>
                                    {t(
                                        "products"
                                    )}
                                </span>

                                <ArrowRight className="h-5 w-5 text-stone-400" />
                            </button>
                        </div>


                        {/* EMPRESA MOBILE */}
                        <div className="border-b border-stone-200 py-4">
                            <button
                                type="button"
                                onClick={() =>
                                    toggleDropdown(
                                        "company"
                                    )
                                }
                                className="flex w-full items-center justify-between text-left font-semibold text-gray-800"
                            >
                                {t(
                                    "company"
                                )}

                                {showCompanyDropdown ? (
                                    <ChevronUp className="h-5 w-5" />
                                ) : (
                                    <ChevronDown className="h-5 w-5" />
                                )}
                            </button>

                            {showCompanyDropdown && (
                                <div className="mt-3 space-y-1 pl-4">
                                    {companyLinks.map(
                                        (
                                            link
                                        ) => (
                                            <button
                                                key={
                                                    link.key
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleLinkClick(
                                                        link.path
                                                    )
                                                }
                                                className="block w-full py-2 text-left text-sm text-gray-600"
                                            >
                                                {
                                                    link.label
                                                }
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                        </div>


                        {/* PUNTOS DE VENTA MOBILE */}
                        <div className="border-b border-stone-200 py-4">
                            <button
                                type="button"
                                onClick={
                                    openStoreLocator
                                }
                                className="block w-full text-left font-semibold text-gray-800"
                            >
                                {t(
                                    "storeLocations",
                                    "Puntos de venta"
                                )}
                            </button>
                        </div>


                        {/* FILTROS MOBILE */}
                        <button
                            type="button"
                            onClick={
                                openFilters
                            }
                            className="mt-8 w-full rounded-xl bg-[#26659E] py-3 text-center font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#26659E]/60"
                        >
                            {t(
                                "filtersButtonLabel",
                                "Filtros"
                            )}
                        </button>
                    </div>


                    {/* PANEL PRODUCTOS MOBILE */}
                    <div
                        className={`
                            absolute
                            inset-0
                            z-10
                            h-full
                            bg-gradient-to-b
                            from-white
                            via-slate-50
                            to-slate-100
                            transition-transform
                            duration-500
                            ease-out

                            ${showProductsDropdown
                                ? "translate-x-0"
                                : "translate-x-full pointer-events-none"
                            }
                        `}
                    >
                        <div className="flex h-full flex-col overflow-y-auto px-6 py-7">

                            <div className="mb-8">

                                <div className="mb-6 flex items-center justify-between">

                                    <button
                                        type="button"
                                        onClick={
                                            backToMobileMain
                                        }
                                        className="flex items-center gap-2 text-sm font-medium text-slate-500"
                                    >
                                        <ArrowLeft className="h-4 w-4" />

                                        {t(
                                            "navigation"
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            closeMobileMenu
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600"
                                        aria-label={t(
                                            "closeMenu"
                                        )}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>


                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                    {t(
                                        "navigation"
                                    )}
                                </p>

                                <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                                    {t(
                                        "products"
                                    )}
                                </h2>

                                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                                    {t(
                                        "drawer.productsDescription"
                                    )}
                                </p>
                            </div>


                            <div className="space-y-3">
                                {productLinks.map(
                                    (
                                        link
                                    ) => (
                                        <button
                                            key={
                                                link.key
                                            }
                                            type="button"
                                            onClick={() => {
                                                if (
                                                    link.key ===
                                                    "wallpaper"
                                                ) {
                                                    openMobileWallpaper();

                                                    return;
                                                }

                                                if (
                                                    link.key ===
                                                    "fabric"
                                                ) {
                                                    openMobileFabric();

                                                    return;
                                                }

                                                if (
                                                    link.path
                                                ) {
                                                    handleLinkClick(
                                                        link.path
                                                    );
                                                }
                                            }}
                                            className="group flex w-full items-center justify-between rounded-2xl border border-transparent bg-white/70 px-4 py-4 text-left transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-sm"
                                        >
                                            <span className="font-medium text-slate-800">
                                                {
                                                    link.label
                                                }
                                            </span>

                                            <ArrowRight className="h-4 w-4 text-slate-400" />
                                        </button>
                                    )
                                )}
                            </div>


                            <div className="mt-auto border-t border-slate-300 pt-6">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleLinkClick(
                                            "/contact"
                                        )
                                    }
                                    className="flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-black" />

                                        <span className="font-semibold text-black">
                                            {t(
                                                "contact"
                                            )}
                                        </span>
                                    </div>

                                    <ArrowRight className="h-4 w-4 text-black" />
                                </button>
                            </div>
                        </div>
                    </div>


                    {/* WALLPAPERS MOBILE */}
                    <div
                        className={`
                            absolute
                            inset-0
                            z-20
                            h-full
                            bg-[#FCFBF9]
                            transition-transform
                            duration-500
                            ease-out

                            ${showProductsDropdown &&
                                showWallpaperLayer
                                ? "translate-x-0"
                                : "translate-x-full pointer-events-none"
                            }
                        `}
                    >
                        <div className="flex h-full flex-col overflow-y-auto px-8 py-8">

                            <div className="mb-7 flex items-center justify-between">

                                <button
                                    type="button"
                                    onClick={
                                        backToMobileProducts
                                    }
                                    className="flex items-center gap-2 text-sm font-medium text-stone-500"
                                >
                                    <ArrowLeft className="h-4 w-4" />

                                    {t(
                                        "products"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        closeMobileMenu
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500"
                                    aria-label={t(
                                        "closeMenu"
                                    )}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>


                            <div className="mb-9">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-stone-400">
                                    {t(
                                        "products"
                                    )}
                                </p>

                                <h3 className="mt-3 text-[30px] font-medium leading-none tracking-[-0.03em] text-stone-900">
                                    {t(
                                        "productMenu.wallpaper.title"
                                    )}
                                </h3>

                                <div className="mt-4 h-px w-10 bg-stone-900" />
                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    handleLinkClick(
                                        wallpaperMenu
                                            .all
                                            .path
                                    )
                                }
                                className="mb-10 flex w-full items-center justify-between border-y border-stone-200 py-4 text-left"
                            >
                                <span className="text-[13px] font-semibold tracking-[0.08em] text-stone-900">
                                    {
                                        wallpaperMenu
                                            .all
                                            .label
                                    }
                                </span>

                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white">
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </button>


                            <section>
                                <div className="mb-4 flex items-center gap-4">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                                        {
                                            wallpaperMenu
                                                .sectionLabel
                                        }
                                    </p>

                                    <span className="h-px flex-1 bg-stone-200" />
                                </div>

                                <div>
                                    {wallpaperMenu
                                        .items
                                        .map(
                                            (
                                                item
                                            ) => (
                                                <button
                                                    key={
                                                        item.key
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleLinkClick(
                                                            item.path
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-between border-b border-stone-100 py-4 text-left text-sm text-stone-600"
                                                >
                                                    <span>
                                                        {
                                                            item.label
                                                        }
                                                    </span>

                                                    <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
                                                </button>
                                            )
                                        )}
                                </div>
                            </section>


                            <div className="mt-auto pt-12">
                                <div className="border-t border-stone-200 pt-5">
                                    <p className="max-w-[260px] text-[11px] leading-5 tracking-[0.04em] text-stone-400">
                                        {t(
                                            "productMenu.wallpaper.description"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* TELAS MOBILE */}
                    <div
                        className={`
                            absolute
                            inset-0
                            z-20
                            h-full
                            bg-[#FCFBF9]
                            transition-transform
                            duration-500
                            ease-out

                            ${showProductsDropdown &&
                                showFabricLayer
                                ? "translate-x-0"
                                : "translate-x-full pointer-events-none"
                            }
                        `}
                    >
                        <div className="flex h-full flex-col overflow-y-auto px-8 py-8">

                            <div className="mb-7 flex items-center justify-between">

                                <button
                                    type="button"
                                    onClick={
                                        backToMobileProducts
                                    }
                                    className="flex items-center gap-2 text-sm font-medium text-stone-500"
                                >
                                    <ArrowLeft className="h-4 w-4" />

                                    {t(
                                        "products"
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        closeMobileMenu
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500"
                                    aria-label={t(
                                        "closeMenu"
                                    )}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>


                            <div className="mb-9">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-stone-400">
                                    {t(
                                        "products"
                                    )}
                                </p>

                                <h3 className="mt-3 text-[30px] font-medium leading-none tracking-[-0.03em] text-stone-900">
                                    {t(
                                        "fabric"
                                    )}
                                </h3>

                                <div className="mt-4 h-px w-10 bg-stone-900" />
                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    handleLinkClick(
                                        fabricMenu
                                            .all
                                            .path
                                    )
                                }
                                className="mb-10 flex w-full items-center justify-between border-y border-stone-200 py-4 text-left"
                            >
                                <span className="text-[13px] font-semibold tracking-[0.08em] text-stone-900">
                                    {
                                        fabricMenu
                                            .all
                                            .label
                                    }
                                </span>

                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-900 text-white">
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </span>
                            </button>


                            <div className="space-y-10">
                                {fabricMenu
                                    .sections
                                    .map(
                                        (
                                            section
                                        ) => (
                                            <section
                                                key={
                                                    section.key
                                                }
                                            >
                                                <div className="mb-4 flex items-center gap-4">
                                                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                                                        {
                                                            section.label
                                                        }
                                                    </p>

                                                    <span className="h-px flex-1 bg-stone-200" />
                                                </div>

                                                <div>
                                                    {section
                                                        .items
                                                        .map(
                                                            (
                                                                item
                                                            ) => (
                                                                <button
                                                                    key={
                                                                        item.key
                                                                    }
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleLinkClick(
                                                                            item.path
                                                                        )
                                                                    }
                                                                    className="flex w-full items-center justify-between border-b border-stone-100 py-4 text-left text-sm text-stone-600"
                                                                >
                                                                    <span>
                                                                        {
                                                                            item.label
                                                                        }
                                                                    </span>

                                                                    <ArrowRight className="h-3.5 w-3.5 text-stone-400" />
                                                                </button>
                                                            )
                                                        )}
                                                </div>
                                            </section>
                                        )
                                    )}
                            </div>


                            <div className="mt-auto pt-12">
                                <div className="border-t border-stone-200 pt-5">
                                    <p className="max-w-[260px] text-[11px] leading-5 tracking-[0.04em] text-stone-400">
                                        {t(
                                            "productMenu.fabric.description"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>


            <ModalMapa
                isOpen={
                    showStoreLocator
                }
                close={() =>
                    setShowStoreLocator(
                        false
                    )
                }
            />
        </>
    );
};


export default Header;