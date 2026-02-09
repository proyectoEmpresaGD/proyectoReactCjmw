//!!!!IMPORTANTE PARA BUSCAR
//Buscar con Control + F por la ruta relativa del componente o el nombre de la carpeta y encontrara todas las constantes


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!CARPETA COMPONENTES SIN ENTRAR A SUBCARPETAS!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//src\components\CartContext.jsx


// Clave para almacenar el carrito en localStorage
export const CART_STORAGE_KEY = 'cartItems';

// Obtener el carrito inicial desde localStorage
export const getInitialCart = () => {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
        return Array.isArray(savedCart) ? savedCart : [];
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return [];
    }
};

// src/Constants/curtains.js
export const CURTAIN_CONFIG = {
    fabricBoltWidthCm: 140,           // ancho de la pieza de tela
    sideMarginCm: 30,                  // margen lateral por lado
    topHemCm: 10,                     // dobladillo superior
    bottomHemCm: 10,
    extraBottonPosadaCm: 5,            // dobladillo inferior
    extraBottomColganteCm: 10,         // extra si el bajo es "colgante"
    // Factor de fruncido/onda por tipo de confección
    fullnessFactorByType: {
        ondaPerfecta: 2.2,
        ollaos: 2.0,
        tablasCocidas: 2.0,
        dosPinzas: 2.0,
        tresPinzas: 2.5,
        fruncido: 2.0,
    },
    // Coste de confección por metro (ajústalo a tu tarifa real)
    makingCostPerMeter: {
        ondaPerfecta: 9.0,
        ollaos: 7.5,
        tablasCocidas: 10.0,
        dosPinzas: 11.0,
        tresPinzas: 12.5,
        fruncido: 8.0,
    },
    // Recargo fijo por panel (opcional)
    makingFixedPerPanel: {
        ondaPerfecta: 0,
        ollaos: 0,
        tablasCocidas: 0,
        dosPinzas: 0,
        tresPinzas: 0,
        fruncido: 0,
    },
};

//
//
//
//src\components\footer.jsx


// Constantes de URLs para logos
export const LOGO_URL = "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/ESCUDOS/ESCUDO%20FAMILIAR/CJMlogo.png";

// Redes Sociales
export const SOCIAL_MEDIA_LINKS = {
    instagram: "https://www.instagram.com/cjmwfabrics/",
    facebook: "https://www.facebook.com/cjmwfabrics/",
    twitter: "#",
};

// Links para PDF de políticas y términos
export const PDF_LINKS = {
    terminosCompra: "https://bassari.eu/ImagenesTelasCjmw/PDF/NORMATIVA%20PAGINA%20WEB/LSSI%20T%C3%89RMINOS%20Y%20CONDICIONES%20DE%20COMPRA%2C%20CJM%20WORLDWIDE%20S.L..pdf ",
    politicaCookies: "https://bassari.eu/ImagenesTelasCjmw/PDF/NORMATIVA%20PAGINA%20WEB/LSSI%20POLITICA%20DE%20COOKIES%2C%20CJM%20WORLDWIDE%20S.L..pdf ",
    politicaPrivacidad: "https://bassari.eu/ImagenesTelasCjmw/PDF/NORMATIVA%20PAGINA%20WEB/LSSI%20POLITICA%20DE%20PRIVACIDAD%2C%20CJM%20WORLDWIDE%20S.L..pdf ",
};

// Texto del pie de página
export const COPYRIGHT_TEXT = "© CJM WORLDWIDE S.L. 2025 - Todos los Derechos Reservados";

// Rutas de navegación interna
export const NAVIGATION_LINKS = {
    about: "/about",
    contact: "/contact",
    events: "/contact",
    cjmHome: "https://www.cjmw.eu/#/cjmHome",
    arenaHome: "https://www.cjmw.eu/#/arenaHome",
    flamencoHome: "https://www.cjmw.eu/#/flamencoHome",
    harbourHome: "https://www.cjmw.eu/#/harbourHome",
    bassariHome: "https://www.cjmw.eu/#/bassariHome"

};

//
//
//
//src\components\header.jsx


//IMAGENES COMPONENTES PRESENTACION COLECCIONES
export const imagenesColecciones = {
    imagesLeVoyageDesWolofs: [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASS_ESSENCESDUNIL_LEVOYAGEDESWOLOFS%20LA%20CROIX.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASS_LIBRO_LEVOYAGEDESWOLOFS_34X34%2B3MM_LA%20CROIX.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASS_ESSENCESDUNIL_YUBA1.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASSARI%20LE%20VOYAGE%20DES%20WOLOF%20ZOSER.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASSARI%20LE%20VOYAGE%20DES%20WOLOF%20ZOSER%202.jpg"
    ],
    imagesEssencesDuNil: [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_ANCESTRAL3.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_BERBERE6.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_ESSENCES%20DU%20NIL%20Y%20LE%20KHAYMA5.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_JON%20Y%20RABAK7.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_LABYRINTHE%20D%C2%B4AFRIQUE_2.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_LIBRO_ESSENCES_DU_NIL_44X44%2B3MM_SANGRELABYRINTHE%20D%C2%B4AFRIQUE%2C%20ESSENCES%20DU%20NIL%20Y%20KALOUSIE.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASSA_ESSENCESDUNIL_YUBA4.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_BERBERE6_DETALLE.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/CJM_BASSARI_2026-1-2_DETALLE%20ESSENCES%20DU%20NIL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/CJM_BASSARI_2026-3%202LE%20KHAYMA.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/CJM_BASSARI_2026-12JONC.jpg",

    ],
    imagesIndienneStripes: [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/INDIENNE%20STRIPES/CJM_FLAMENCO_2026_INDIENNE%20OCEAN.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/INDIENNE%20STRIPES/CJM_FLAMENCO_MAYA_OCEAN_DETALLE.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/INDIENNE%20STRIPES/CJM_FLAMENCO_FUENTECLARAOCEAN.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/INDIENNE%20STRIPES/CJM_FLAMENCO_2026-TRESTELAS.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/INDIENNE%20STRIPES/CJM_FLAMENCO_2026_OAXACA%20TANGERINE%20.jpg"

    ],
    imagesPalacioDeDueñas: [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_2026_SALON%20DE%20LA%20GITANA%20MUSTARD_1.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_PINEDA_IBORY.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_TAPIZ%20DE_LOS_DUQUES_BLUE_ISH_2.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_2026-JARDIN%20DE%20ACEITE_OLIVE-DETALLE%202.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_FUENTECLARAOCEAN.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_2026-JARDIN%20DE%20ACEITE_OLIVE-DETALLE.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_2026_SALON%20DE%20LA%20GITANA%20DEEP%20TEAL_DETALLE.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_TAPIZ%20DE_LOS_DUQUES_BLUE_ISH_DETALLE.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_2026_SALO%CC%81N%20DE%20LA%20GITANA%20DEEP%20TEAL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_2026_JARDIN%20DE%20ACEITE%20DEEP%20TEAL_DETALLE.jpg"
    ]

}

export const coleccionConfigByName = {
    "ESSENCES DU NIL": {
        textKey: "essencesDuNil",
        imagesKey: "imagesEssencesDuNil",
        brochurePdf: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BASS_BROUCHURE_ENERO2026.pdf",
        brochureImageIndex: 4,
        heroIndex: 0,

    },
    "LE VOYAGE DES WOLOF": {
        textKey: "leVoyageDesWolof",
        imagesKey: "imagesLeVoyageDesWolofs",
        brochurePdf: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BASS_BROUCHURE_ENERO2026.pdf",
        brochureImageIndex: 4,
        heroIndex: 0,
    },
    "INDIENNE STRIPES": {
        textKey: "indienne",
        imagesKey: "imagesIndienneStripes",
        brochurePdf: null,
        brochureImageIndex: 0,
        heroIndex: 0,
    },
    "PALACIO DE LAS DUEÑAS": {
        textKey: "palacioDeDueñas",
        imagesKey: "imagesPalacioDeDueñas",
        brochurePdf: null,
        brochureImageIndex: 0,
        heroIndex: 0,
    },
};


// Opciones de idioma
export const languageOptions = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
];

// Logos de las marcas
export const brandLogos = {
    '/arenaHome': 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoArena.png',
    '/harbourHome': 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoHarbour.png',
    '/cjmHome': 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM-sintexto.png',
    '/flamencoHome': 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoFlamenco.png',
    '/bassariHome': 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png',
    HAR: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoHarbour.png",
    ARE: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoArena.png",
    CJM: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM-sintexto.png",
    FLA: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoFlamenco.png",
    BAS: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png",
};

// Logo predeterminado
export const defaultLogo = 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM_group.png';

// Íconos de redes sociales
export const socialMediaIcons = [
    { icon: 'RiInstagramLine', link: 'https://www.instagram.com/cjmwfabrics/' },
    { icon: 'RiFacebookLine', link: 'https://www.facebook.com/cjmwfabrics/' },
    { icon: 'RiTwitterXFill', link: '#' }
];

// Rutas de archivos PDF de términos, cookies, privacidad
export const pdfLinks = {
    terms: "public/pdfs/LSSI TÉRMINOS Y CONDICIONES DE COMPRA, CJM WORLDWIDE S.L..pdf",
    cookies: "public/pdfs/LSSI POLITICA DE COOKIES, CJM WORLDWIDE S.L..pdf",
    privacy: "public/pdfs/LSSI POLITICA DE PRIVACIDAD, CJM WORLDWIDE S.L..pdf"
};

// Opciones de navegación
export const navigationLinks = [
    { label: 'Sobre Nosotros', path: '/about' },
    { label: 'Prensa', path: '#' },
    { label: 'Inversores', path: '#' },
    { label: 'Eventos', path: '/contact' },
    { label: 'Términos de Compra', path: pdfLinks.terms, download: true },
    { label: 'Política de Cookies', path: pdfLinks.cookies, download: true },
    { label: 'Política de Privacidad', path: pdfLinks.privacy, download: true }
];

//
//
//
//src\components\ScrollToTop.jsx


export const scrollPosition = {
    x: 0,
    y: 0
};

//
//
//
//src\components\shoppingCart.jsx

// src/Constants/constants.jsx

export const cartConfig = {
    cartOpenDelay: 100,  // Milisegundos de delay para mostrar el carrito
};

export const cartTexts = {
    cartTitle: 'Shopping Cart',
    width: 'Ancho',
    color: 'Color',
    totalLabel: 'Total:',
    checkoutPlaceholder: 'Comprar',  // Texto del botón de checkout
};

//
//
//
//src\components\translate.jsx
// src/Constants/constants.jsx

export const translationConfig = {
    apiKey: 'AIzaSyBEFFDik11kmsKfW1pelqJ1k1_UbakEzvo',
    apiUrl: 'https://translation.googleapis.com/language/translate/v2',
};

// export const cartConfig = {
//     cartOpenDelay: 100,  // Milisegundos de delay para mostrar el carrito
// };

// export const cartTexts = {
//     cartTitle: 'Shopping Cart',
//     width: 'Ancho',
//     color: 'Color',
//     totalLabel: 'Total:',
//     checkoutPlaceholder: 'Proximamente disponible',  // Texto del botón de checkout
// };



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!SUBCARPETAS DE COMPONENTES!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!CARPETA colecciones!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//src\components\colecciones\ColeccionesMarcas.jsx

export const coleccionesPorMarca = {
    BAS: [
        "LE VOYAGE DES WOLOF", "ESSENCES DU NIL", "KASSUMAY", "TRIBAL", "UNIVERS",
    ],
    ARE: [
        "TAKUMI", "LIGHTHOUSE", "MADAMA BUTTERFLY", "CRANE", "SOBOKUNA", "COSY", "KANNATURA VOL II", "KANNATURA", "ATMOSPHERE", "JEWEL", "PURITTY", "MONTANA", "CALCUTA", "CÔTE D´AZUR", "DUNE", "FENICIA", "LINOTTO",
        "MEDITERRANEAN STRIPES", "NOMAD", "PAPIRO",
        "STONE", "STRATOS", "TAIGA", "TOUCH", "RUSTICA"
    ],
    HAR: [
        "BOHEMIAN",
        "HUSKY",
        "FUTURE",
        "BOLONIA&VARADERO",
        "CARIBBEAN PARTY",
        "DUKE",
        "BALTIC",
        "GOTLAND",
        "BARENTS",
        "BAUPRES",
        "BLINDER",
        "ARISTOS",
        "CRUST",
        "ETHNIC MOOD",
        "LIENZO",
        "MACAO",
        "OYSTER",
        "PARABAN"
    ],
    FLA: [
        "INDIENNE STRIPES",
        "PALACIO DE LAS DUEÑAS",
        "GRAZALEMA",
        "MARRAKECH",
        "TEDDY",
        "SISAL",
        "VELLUTISSIMO",
        "RIVIERA",
        "ARTISAN WEAVES",
        "BUCLÉ",
        "COURTYARD GARDEN",
        "DIAMANTE",
        "EAST COAST",
        "COASTAL LINENS",
        "LUXURY DRAPES",
        "EASTERN MEMORIES",
        "GENESIS",
        "REVOLTOSO",


    ],
    CJM: [
        "TOKIO",
        "COLONY",
        "COLONY WALLPAPER",
        "FRESCO",
        "ROADS TO ASIA",
        "SALT & PEPPER",
        "SET OF THREADS",
        "SUEDER",
        "TAYLORED",
        "URBAN CONTEMPORARY",
        "VELVETY",
        "VERANDA",
        "SABANNA"
    ]
};


export const coleccionesTexts = {
    title: "Explora nuestras colecciones",
    mobileHint: "Toca para ver",
};

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!CARPETA componenentesCockies!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//src\components\ComponenetesCookies\CookieConsent.jsx

// Textos para el componente de consentimiento de cookies
export const cookieConsentTexts = {
    message: "We use cookies to improve your experience. By continuing, you agree to our cookie policy.",
    rejectButton: "Rechazarlas todas",
    acceptButton: "Aceptarlas todas",
    cookiePolicyLink: "/cookie-policy"
};

//
//
//

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!CARPETA ComponentesBrands!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//src\components\ComponentesBrands\cardNewCollection.jsx

// Este las constantes que tiene necesitan de parametro por eso estan integradas en el codigo


//
//
//

//src\components\ComponentesBrands\CarruselColecciones.jsx¡

export const carruselConfig = {
    noImagesText: 'No images available',
    imageAltText: 'Random Display',
};

//
//
//

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!CARPETA ComponentesContact!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//src\components\ComponentesContact\contacts.jsx
export const CONTACT_CONSENT_VERSION = '2025-01';

export const CONTACT_BANNER_IMAGE =
    'https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/03_AMBIENTES%20PARA%20PAGINA%20CONTACTS/ARN_COSY_8_resultado.webp';

// src/Constants/constants.js

export const contactInfo = [
    {
        id: 'cjm',
        nombre: 'CJM Group',
        direccion: 'Av. de Europa, 19',
        codigoPostal: '14550',
        ciudad: 'Montilla',
        pais: 'España',
        telefono: '+34 957 65 64 75',
        correo: 'info@cjmw.eu',
        horario: 'De lunes a viernes, de 9:00 a 18:00',
        googleMapsUrl:
            'https://www.google.com/maps/place/CJM+Group/@37.5860011,-4.6604229,17z/data=!3m1!4b1!4m6!3m5!1s0xd6d1489062003d9:0x240df88bc1abecb9!8m2!3d37.5859969!4d-4.657848!16s%2Fg%2F11z9l6xfv?entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D',
        googleMapsEmbed:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3140.979995544716!2d-4.660422924888231!3d37.58600107196062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6d1489062003d9%3A0x240df88bc1abecb9!2sCJM%20Group!5e0!3m2!1ses!2ses!4v1728235637896!5m2!1ses!2ses',
    },
];


//
//
//

//src\components\ComponentesContact\iconoMapa.jsx

//Esta ahora mismo no utiliza constantes

//
//
//

//src\components\ComponentesContact\map.jsx

export const puntos = [
    { lat: -34.397, lng: 150.644, title: "Sydney", description: "Tienda de cortinas y más en Sydney." },
    { lat: 40.712776, lng: -74.005974, title: "New York", description: "Lo último en decoración de interiores." },
    { lat: 37.586784, lng: -4.658694, title: "CJMW Montilla", description: "Especialistas en cortinas y decoración.", direccion: "Avenida Andalucia 19", telefono: "656565656" },
    { lat: 37.46784, lng: -4.658694, title: "Prueba", description: "Especialistas en cortinas y decoración." },
    { lat: 40.436792, lng: -3.709762, title: "Showroom Madrid", description: "Showroom exclusivo con las últimas tendencias." }
];

export const GOOGLE_MAPS_API_KEY = "AIzaSyAtnktr-IqG1RseoruDMk7ZpLIrzdtPgbg";

//
//
//

//src\components\ComponentesContact\scrollToLocation.jsx

//Este no tiene constantes

//
//
//

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!CARPETA Componentes Home!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//src\components\ComponentesHome\carrusel.jsx

export const textosCarrusel = [
    "Texto para la imagen 1",
    "Texto para la imagen 2",
    "Texto para la imagen 3",
    "Texto para la imagen 4",
    "Texto para la imagen 5",
    "Texto para la imagen 6",
    "Texto para la imagen 7",
    "Texto para la imagen 8"
];

//
//
//

//src\components\ComponentesHome\carruselHome.jsx

//Las constantes que tiene las recibe todas por parametro

//
//
//

//src\components\ComponentesHome\clients.jsx

export const clientLogos = [
    {
        link: "/arenaHome",
        imgSrc: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoArena.png",
        imgAlt: "Client Logo Arena",
        imgSize: "w-48 h-48",
    },
    {
        link: "/cjmHome",
        imgSrc: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM-sintexto.png",
        imgAlt: "Client Logo CJM",
        imgSize: "w-20 h-20",
    },
    {
        link: "/flamencoHome",
        imgSrc: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoFlamenco.png",
        imgAlt: "Client Logo Flamenco",
        imgSize: "w-48 h-48",
    },
    {
        link: "/harbourHome",
        imgSrc: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoHarbour.png",
        imgAlt: "Client Logo Harbour",
        imgSize: "w-48 h-48",
    }
];

//
//
//

//src\components\ComponentesHome\pinesNoticias.jsx

export const blogPosts = [
    {
        imgSrc: "https://bassari.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel4.webp",
        altText: "Últimas tendencias en telas naturales",
        date: "March 20, 2024",
        title: "Últimas tendencias en telas naturales",
        description: "Descubre las últimas tendencias en telas naturales y cómo están impactando en la industria textil.",
        link: "/BlogHome/1"
    },
    {
        imgSrc: "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HarbourCarrusel1.webp",
        altText: "Innovaciones tecnológicas en la fabricación textil",
        date: "April 5, 2024",
        title: "Innovaciones tecnológicas en la fabricación textil",
        description: "Conoce las últimas innovaciones tecnológicas que están revolucionando la fabricación de textiles en la industria.",
        link: "/BlogHome/2"
    },
    {
        imgSrc: "https://bassari.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
        altText: "Impacto ambiental de la industria textil",
        date: "April 12, 2024",
        title: "Impacto ambiental de la industria textil",
        description: "Examina el impacto ambiental de la industria textil y las medidas que se están tomando para reducirlo.",
        link: "/BlogHome/3"
    },
    {
        imgSrc: "https://bassari.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel3.webp",
        altText: "Nuevas técnicas de teñido y estampado",
        date: "April 18, 2024",
        title: "Nuevas técnicas de teñido y estampado",
        description: "Descubre las nuevas técnicas de teñido y estampado que están marcando tendencia en el mundo de la moda.",
        link: "/BlogHome/4"
    }
];

//
//
//

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!CARPETA ComponentesProductos!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//src\components\ComponentesProductos\cardProduct.jsx

export const secretKey = 'R2tyY1|YO.Bp!bK£BCl7l*?ZC1dT+q~6cAT-4|nx2z`0l3}78U';
export const itemsPerPage = 16;
export const defaultImageUrl = 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/04_ICONOS_USADOS_EN_DIFERENTES_SITIOS/ProductoNoEncontrado.webp';
export const apiUrl = import.meta.env.VITE_API_BASE_URL;

//
//
//

//src\components\ComponentesProductos\modal.jsx

export const defaultImageUrlModalProductos = 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/04_ICONOS_USADOS_EN_DIFERENTES_SITIOS/ProductoNoEncontrado.webp';
export const mantenimientoImages = {
    "LAVAR A 30º": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Lavar%20a%2030%C2%BA.jpg',
    "LAVAR A 30º DELICADO": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/02-Lavar-a-30%C2%BA-delicado.jpg',
    "LAVAR A 30º MUY DELICADO": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/03-Lavar-a-30%C2%BA-muy-delicado.jpg',
    "LAVAR A 40º": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Lavar%20a%2040%C2%BA.jpg',
    "LAVAR A 90º": '',
    "NO LAVAR": "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/No%20lavar.jpg",
    "PLANCHAR A 120º": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Planchar%20a%20120%C2%BA.jpg',
    "PLANCHAR A 160º": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Planchar%20a%20160%C2%BA.jpg',
    "PLANCHAR A 210º": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Planchar%20a%20210%C2%BA.jpg',
    "NO PLANCHAR": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/No%20planchar.jpg',
    "LAVAR A MANO": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Lavar%20a%20mano.jpg',
    "NO USAR LEJIA": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/No%20lejia.jpg',
    "LAVAR EN SECO": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Lavar%20en%20seco.jpg',
    "NO LAVAR EN SECO": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/No%20lavar%20en%20seco.jpg',
    "NO USAR SECADORA": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/No%20usar%20secadora.jpg',
    "USAR LEJIA": '',
    "EASYCLEAN": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/EASY%20CLEAN.jpg',
    "USAR SECADORA": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Usar%20secadora.jpg',
    "SECADO VERTICAL": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Secado%20vertical.jpg',
};

export const usoImages = {
    "TAPICERIA DECORATIVA": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Tapiceria%20decorativa.jpg',
    "TAPICERIA": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Tapiceria.jpg',
    'CORTINAS': 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Cortinas.jpg',
    "ESTORES": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Estores.jpg',
    "COLCHAS": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Colchas.jpg',
    "ALFOMBRAS": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Alfombras.jpg',
    "FR": "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/FR.jpg",
    "OUTDOOR": "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/OUTDOOR.jpg",
    "IMO": "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/IMO.jpg",
    "CASADO LIBRE": "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/CASADO%20LIBRE.jpg",
    "RESISTENCIA MODERADA SOL": "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/RESISTENCIA%20MODERADA%20AL%20SOL.jpg",
    "SEPARABLE EN SECO": "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/SEPARABLE%20EN%20SECO.jpg",
    "ADHESIVO SOBRE EL PAPEL": "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/ADHESIVO%20SOBRE%20EL%20PAPEL.jpg",
    "100% OPACIDAD": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Opaco.jpg',
    "90% OPACIDAD": 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Semi-opaco.jpg'
};

export const marcasMap = {
    "ARE": "ARENA",
    "CJM": "CJM",
    "FLA": "FLAMENCO",
    "HAR": "HARBOUR",
    "BAS": "BASSARI",
};

export const direccionLogos = {
    "NON-DIRECTIONAL": "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/03_ICONOS_DIRECCIONES/NON-DIRECTIONAL.png",
    "NON-RAILROADED": "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/03_ICONOS_DIRECCIONES/NON-RAILROADED.png",
    "RAILROADED": "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/03_ICONOS_DIRECCIONES/RAILROADED.png",
}

//
//
//

//src\components\ComponentesProductos\modalMapa.jsx

//Este componente no tiene constantes

//
//
//

//src\components\ComponentesProductos\ShareButton.jsx

//Este componente no tiene constantes

//
//
//

//src\components\ComponentesProductos\skeletonLoader.jsx

//Este componente no tiene constantes

//
//
//

//src\components\ComponentesProductos\SubMenuCarousel.jsx

export const buttonClassBase = "px-5 py-2 text-md font-semibold transition-all duration-300 whitespace-nowrap rounded-md";
export const activeButtonClass = "bg-blue-500 text-white";
export const inactiveButtonClass = "bg-gray-100 text-gray-700 hover:bg-blue-100";

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!CARPETA ComponentesUsages!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//src/app/paginaprincipal.jsx

// src/data/homeBrands.js
export const homeBrands = [
    {
        key: "flamenco",
        title: "Flamenco",
        route: "/flamencoHome",
        productsHref: "/products",
        eyebrow: "DISEÑO · ARTE · RITMO",
        microcopy: "",
        background:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_2026_INDIENNE%20OCEAN.jpg",
        ambients: [
            {
                key: "fla-1",
                brand: "Flamenco",
                title: "Indienne Stripes",
                enlace: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BASSARI_FLAMENCO_INTERGIFT_2026_AAFF.pdf",
                subtitle: "Ambiente / lookbook",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/FLAMENCO/INDIENNE%20STRIPES/IMAGEN%20PORTADA%20FLAMENCO%20MOVIL.png",
            },
            {
                key: "fla-2",
                brand: "Flamenco",
                title: "Palacio de las Dueñas",
                enlace: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BASSARI_FLAMENCO_INTERGIFT_2026_AAFF.pdf",
                subtitle: "Ambiente / detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/FLAMENCO/PALACIO%20DE%20LAS%20DUE%C3%91AS/FLA_PALCIO_DUENAS_LIBRO_34x34MM_3MM_SANGRE_resultado_resultado.webp",
            },
        ],
        accentBarClass: "bg-[#FFFFFF]",
        accentGlowClass: "bg-gradient-to-t from-[#FFFFFF]/18 to-transparent",
        parallaxStrength: 34,
        featuredSections: [
            {
                title: "Destacados",
                kicker: "T E J I D O S ",
                limit: 12,
                perCollectionLimit: 4,
                accentBarClass: "bg-[#FFFFFF]",
                colecciones: ["Indienne Stripes", "PALACIO DE LAS DUEÑAS"],
            },
        ],
        gallery: [
            {
                key: "cjm-g-hero",
                title: "Espacio — Composición contemporánea",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/GRAZALEMA/CHIPIONA%20ROUGE(COJIN)%20Y%20JARA%20ROUGE(BUTACA).jpg",
                productCodes: ["FLA001523", "FLA001508"],
            },
            {
                key: "cjm-g-1",
                title: "Detalle — Trama y luz",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/GRAZALEMA/FLA_GRAZALEMA_SANFERNANDOCORAL(CABECERO)ROCIO%20DUSTY%20PINK%20Y%20SALMON%20(COJINES)%20SANLUCAR%20BLOSSOM%20(PRIMER%20COJIN)_1.jpg",
                productCodes: ["FLA001523", "FLA001508", "FLA001445", "FLA001460", "FLA001427", "FLA001475"],
            },
            {
                key: "cjm-g-2",
                title: "Espacio — Silueta y textura",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/MARRAKECH/FLA_MARRAKECH_KUTUBIA%20APRICOT.jpg",
                productCodes: ["FLA001681"],
            },
            {
                key: "cjm-g-3",
                title: "Detalle — Paleta neutral",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/MARRAKECH/FLA_MARRAKECH_MAJORELLE_ROSE.jpg",
                productCodes: ["FLA001647"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_2026_SALON%20DE%20LA%20GITANA%20MUSTARD_1.jpg",
                productCodes: ["FLA001917"],
            },
            {
                key: "cjm-g-2",
                title: "Espacio — Silueta y textura",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/MARRAKECH/FLA_MARRAKECH_KUTUBIA_STRAWBERRY_01.jpg",
                productCodes: ["FLA001680"],
            },
            {
                key: "cjm-g-3",
                title: "Detalle — Paleta neutral",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/SISAL/Cover%20Front.jpg",
                productCodes: ["FLA001118"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/RIVIERA/FLA001218%20COLONIAL%20DAMASK%20SPRING%20GREEN_01%20.jpg",
                productCodes: ["FLA001218"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_2026_SALO%CC%81N%20DE%20LA%20GITANA%20DEEP%20TEAL.jpg",
                productCodes: ["FLA001919"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_PINEDA_IBORY.jpg",
                productCodes: ["FLA001948"],
            },
        ],
    },

    {
        key: "bassari",
        title: "Bassari",
        route: "/bassariHome",
        productsHref: "/products",
        eyebrow: "SOFISTICACIÓN · VIAJE · PALETA",
        microcopy: "",
        background:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/BASSARI/ESSENCES%20DU%20NIL/home_hero_desktop_no_divider_1920x900.png",
        ambients: [
            {
                key: "bas-1",
                brand: "Bassari",
                title: "Essences du Nil",
                enlace: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BASSARI_FLAMENCO_INTERGIFT_2026_AAFF.pdf",
                subtitle: "Ambiente / lookbook",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/BASSARI/ESSENCES%20DU%20NIL/bassari_mobile_black_divider_clean_1080x1920.png",
            },
            {
                key: "bas-2",
                brand: "Bassari",
                title: "Le voyage des wolofs",
                enlace: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BASSARI_FLAMENCO_INTERGIFT_2026_AAFF.pdf",
                subtitle: "Ambiente / lookbook",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/BASSARI/LE%20VOYAGE%20DES%20WOLOF/bassari_voyage_mobile_1080x1920.jpg",
            },

        ],
        accentBarClass: "bg-[#ED9228]",
        accentGlowClass: "bg-gradient-to-t from-[#ED9228]/18 to-transparent",
        parallaxStrength: 28,
        featuredSections: [
            {
                title: "Selección",
                kicker: "NOVEDADES",
                limit: 12,
                perCollectionLimit: 4,
                accentBarClass: "bg-[#ED9228]",
                colecciones: ["Essences du Nil", "LE VOYAGE DES WOLOF"],
            },
        ],
        gallery: [
            {
                key: "cjm-g-hero",
                title: "Espacio — Composición contemporánea",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/KASSUMAY/BASSARI%20KASSUMAY%20IWOL%20ARGILE%20(COLCHA)%20WOLOF%20SAVANE%20(CORTINA)%20LOMPOUL%20ARGILE%20(COJINES%20TRASEROS)%20KAOLACK%20ARGILE(COJINES%20DELANTEROS)_3_11zon_3_11zon.webp",
                productCodes: ["CJM02757", "CJM02735", "CJM02795", "CJM02779", "CJM02802"],
            },
            {
                key: "cjm-g-1",
                title: "Detalle — Trama y luz",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/TRIBAL/BASSARI%20TRIBAL%20DAKAR%20BOUE%20SABLE%20ET%20GRIS%20NUAGE.jpg",
                productCodes: ["BAS00025"],
            },
            {
                key: "cjm-g-2",
                title: "Espacio — Silueta y textura",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_BERBERE6.jpg",
                productCodes: ["BAS00512"],
            },
            {
                key: "cjm-g-3",
                title: "Detalle — Paleta neutral",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASSARI%20LE%20VOYAGE%20DES%20WOLOF%20ZOSER%202.jpg",
                productCodes: ["BAS00440"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/UNIVERS/BASSARI%20UNIVERS%20MARTIEN%20SAUGE%20ET%20VERT%20EMPIRE.jpg",
                productCodes: ["BAS00241"],
            },
            {
                key: "cjm-g-2",
                title: "Espacio — Silueta y textura",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/KASSUMAY/BASSARI%20KASSUMAY%20WOLOF%20SAVANE_4_11zon_9_11zon.webp",
                productCodes: ["BAS00139"],
            },
            {
                key: "cjm-g-3",
                title: "Detalle — Paleta neutral",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/KASSUMAY/BASSARI%20KASSUMAY%20NIOKOLO%20KOBA%20NOIR_3_11zon_4_11zon.webp",
                productCodes: ["BAS00154"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_HORIZONTAL_ESSENCES%20DU%20NIL%20Y%20LE%20KHAYMA.jpg",
                productCodes: ["BAS00530", "BAS00561"],
            },
            {
                key: "cjm-g-3",
                title: "Detalle — Paleta neutral",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_LABYRINTHE%20D%C2%B4AFRIQUE_2.jpg",
                productCodes: ["BAS00498"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASS_ESSENCESDUNIL_LEVOYAGEDESWOLOFS%20LA%20CROIX.jpg",
                productCodes: ["BAS00466"],
            },
        ],
    },

    {
        key: "harbour",
        title: "Harbour",
        route: "/harbourHome",
        productsHref: "/products",
        eyebrow: "LUZ · NATURAL · MEDITERRÁNEO",
        microcopy: "",
        background:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/HARBOUR/HARB_AMB_BOHEMIAN_01CARROUSEL.jpg",
        ambients: [
            {
                key: "har-1",
                brand: "Harbour",
                title: "Bohemian",
                subtitle: "Ambiente",
                enlace: "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/ARN_HABITAT_VLC_25_25_BROUCHURE_2025_AAFF.pdf",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/BOHEMIAN/HARB_AMB_BOHEMIAN_07%2035X35.jpg",
            },
            {
                key: "har-2",
                brand: "Harbour",
                title: "Caribbean Party",
                subtitle: "Ambiente",
                enlace: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/HAR_CARIBBEAN_PARTY_BROUCHURE_SOLOTITULARES.pdf",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01933%20CARIBBEAN%20PARTY%20LONG%20BEACH%20INDIGO_%20TEJIDO%20RAYA%20ANCHA(1).jpg",
            },
        ],
        accentBarClass: "bg-[#3844F5]",
        accentGlowClass: "bg-gradient-to-t from-[#3844F5]/16 to-transparent",
        parallaxStrength: 26,
        featuredSections: [
            {
                title: "Destacados",
                kicker: "C U R A D O",
                limit: 20,
                perCollectionLimit: 8,
                accentBarClass: "bg-[#3844F5]",
                colecciones: ["Bohemian", "Caribbean Party"],
            },
        ],
        gallery: [
            {
                key: "cjm-g-hero",
                title: "Espacio — Composición contemporánea",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/HARBOUR%20AMBIENTE/BOHEMIAN/HARB_AMB_BOHEMIAN_07%2035X35.jpg",
                productCodes: ["HAR02397", "HAR02402", "HAR02406", "HAR02409", "HAR02387"],
            },
            {
                key: "cjm-g-1",
                title: "Detalle — Trama y luz",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01953%20CARIBBEAN%20PARTY%20PALM%20BEACH%20MARSHMALLOW_MANTEL.jpg",
                productCodes: ["HAR01898", "HAR01927", "HAR01937", "HAR01948", "HAR01953"],
            },
            {
                key: "cjm-g-2",
                title: "Espacio — Silueta y textura",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01903%20CARIBBEAN%20PARTY%20PARTY%20INDIGO_TEJIDO%20ESPIGA.jpg",
                productCodes: ["HAR01894", "HAR01933", "HAR01903", "HAR01913"],
            },
            {
                key: "cjm-g-3",
                title: "Detalle — Paleta neutral",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/HARBOUR%20AMBIENTE/GOTLAND/RIVIERA.jpg",
                productCodes: ["HAR00153"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/HARBOUR%20AMBIENTE/FUTURE/DSC00231%20MINIATURA.jpg",
                productCodes: ["HAR02484", "HAR02483"],
            },
            {
                key: "cjm-g-2",
                title: "Espacio — Silueta y textura",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01942%20CARIBBEAN%20PARTY%20JUNGLE%20INDIGO%20_%20SILLA%202.jpg",
                productCodes: ["HAR01923", "HAR01942", "HAR01952"],
            },
            {
                key: "cjm-g-3",
                title: "Detalle — Paleta neutral",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/HARBOUR%20AMBIENTE/DUKE/HAR01729%20DUKE%20DEEP%20TEAL%20IMG_0498%2035x35.jpg",
                productCodes: ["HAR01729"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/HARBOUR%20AMBIENTE/BOLONIA%20%26%20VARADERO/MOOD%20BOARD%20VARADERO.jpg",
                productCodes: ["HAR00171"],
            },
        ],
    },

    {
        key: "arena",
        title: "Arena",
        route: "/arenaHome",
        productsHref: "/products",
        eyebrow: "MATERIA · SILENCIO · EQUILIBRIO",
        microcopy: "",
        background:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/ARENA/CORTINA_PASARELA%20web.jpg",
        ambients: [
            {
                key: "are-1",
                brand: "Arena",
                title: "Lighthouse",
                enlace: "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/ARN_HABITAT_VLC_25_25_BROUCHURE_2025_AAFF.pdf",
                subtitle: "Ambiente",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/LIGHTHOUSE/_26A5100-2_OK%2035x35.jpg",
            },
            {
                key: "are-1",
                brand: "Arena",
                title: "Geisha",
                enlace: "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/ARN_HABITAT_VLC_25_25_BROUCHURE_2025_AAFF.pdf",
                subtitle: "Ambiente",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/MADAMA%20BUTTERFLY/ARN_AMB_NAGASAKI_02%20MINIATURA.jpg",
            },
        ],
        accentBarClass: "bg-[#B58836]",
        accentGlowClass: "bg-gradient-to-t from-[#B58836]/22 to-transparent",
        parallaxStrength: 22,
        featuredSections: [
            {
                title: "Selección",
                kicker: "NOVEDADES",
                limit: 20,
                perCollectionLimit: 8,
                accentBarClass: "bg-[#B58836]",
                colecciones: ["LIGHTHOUSE", "MADAMA BUTTERFLY", "TAKUMI"],
            },
        ],
        gallery: [
            {
                key: "cjm-g-hero",
                title: "Espacio — Composición contemporánea",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/SOBOKUNA/ARN_AMB_BIANCALANI_01%20MINIATURA.jpg",
                productCodes: ["ARE02045"],
            },
            {
                key: "cjm-g-1",
                title: "Detalle — Trama y luz",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/TAKUMI/_26A5010-2-OK%20MINIATURA.jpg",
                productCodes: ["ARE02174"],
            },
            {
                key: "cjm-g-2",
                title: "Espacio — Silueta y textura",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/CRANE/ARN_AMB_CRANE_02%20MINIATURA.jpg",
                productCodes: ["ARE01951"],
            },
            {
                key: "cjm-g-3",
                title: "Detalle — Paleta neutral",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/KANNATURA%20VOL%20II/ARN_RAFIAS_AMBIENTE_THI.jpg",
                productCodes: ["ARE01719"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/KANNATURA/ARN_RAFIAS_AMBIENTE_KLIM.jpg",
                productCodes: ["ARE01894"],
            },
            {
                key: "cjm-g-2",
                title: "Espacio — Silueta y textura",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/COSY/ARN_COSY_6%20MINIATURA.jpg",
                productCodes: ["ARE01826"],
            },
            {
                key: "cjm-g-3",
                title: "Detalle — Paleta neutral",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/PURITTY/TANGLED_SILVER_2_11zon_18_11zon.webp",
                productCodes: ["ARE01235"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/TOUCH/TOUCH%20GINGER%20R_2_11zon_4_11zon.webp",
                productCodes: ["ARE00015"],
            },
        ],
    },

    {
        key: "cjm",
        title: "CJM",
        route: "/cjmHome",
        productsHref: "/products",
        eyebrow: "CONTEMPORÁNEO · PROYECTO · VERSÁTIL",
        microcopy: "",
        background:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/edicion-salt-and-pepper-3.jpg",
        ambients: [
        ],
        accentBarClass: "bg-[#A3A3A3]",
        accentGlowClass: "bg-gradient-to-t from-[#A3A3A3]/20 to-transparent",
        parallaxStrength: 26,
        featuredSections: [
            {
                title: "Destacados",
                kicker: "T E J I D O S",
                limit: 12,
                perCollectionLimit: 4,
                accentBarClass: "bg-[#A3A3A3]",
                colecciones: ["JEWEL", "TOKIO", "COLONY"],
            },
        ],
        gallery: [
            {
                key: "cjm-g-hero",
                title: "Espacio — Composición contemporánea",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/CJM%20AMBIENTE/TOKIO/TOKIO%20Y%20KIOTO.jpg",
                productCodes: ["CJM02757", "CJM02735", "CJM02795", "CJM02779", "CJM02802"],
            },
            {
                key: "cjm-g-1",
                title: "Detalle — Trama y luz",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/CJM%20AMBIENTE/SET%20OF%20THREADS/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg",
                productCodes: ["CJM01384"],
            },
            {
                key: "cjm-g-2",
                title: "Espacio — Silueta y textura",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/CJM%20AMBIENTE/MEDITERRANEAN%20STRIPES/POISON%20RANGE%20OF%20COLOR.jpg",
                productCodes: ["CJM00382"],
            },
            {
                key: "cjm-g-3",
                title: "Detalle — Paleta neutral",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px.jpg",
                productCodes: ["CJM01341", "CJM01350", "CJM01356"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/CJM%20AMBIENTE/SABANNA/MOODBOARD%20SABANNA%2001.jpg",
                productCodes: ["CJM02230"],
            },
            {
                key: "cjm-g-2",
                title: "Espacio — Silueta y textura",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/CJM%20AMBIENTE/COLONY%20WALLPAPER/Amb%20Colony%2005Miniatura.jpg",
                productCodes: ["CJM02829"],
            },
            {
                key: "cjm-g-3",
                title: "Detalle — Paleta neutral",
                subtitle: "Detalle",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px.jpg",
                productCodes: ["CJM01341", "CJM01350", "CJM01356"],
            },
            {
                key: "cjm-g-4",
                title: "Espacio — Contraste suave",
                subtitle: "Proyecto / inspiración",
                image:
                    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/CJM%20AMBIENTE/URBAN%20CONTEMPORARY/LOFT%20ALUMINIUM%202.jpg",
                productCodes: ["CJM01764"],
            },
        ],
    },
];

//src\components\ComponentesUsages\footerHome.jsx

// Iconos de redes sociales
export const socialIcons = [
    { href: "https://www.instagram.com/cjmwfabrics/", icon: "RiInstagramLine" },
    { href: "https://www.facebook.com/cjmwfabrics/", icon: "RiFacebookLine" },
    { href: "#", icon: "RiTwitterXFill" },
];

// Imagen de QR
export const qrCodeSrc = "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/04_ICONOS_USADOS_EN_DIFERENTES_SITIOS/qr-code.svg";

// Enlaces de la sección Empresa
export const empresaLinks = [
    { to: "/about", text: "Sobre Nosotros" },
    { to: "/contact", text: "Eventos" },
];

// Enlaces de la sección Políticas
export const politicasLinks = [
    {
        href: "https://bassari.eu/ImagenesTelasCjmw/PDF/NORMATIVA%20PAGINA%20WEB/LSSI%20T%C3%89RMINOS%20Y%20CONDICIONES%20DE%20COMPRA%2C%20CJM%20WORLDWIDE%20S.L..pdf",
        text: "Términos de Compra",
        downloadName: "LSSI_TÉRMINOS_Y_CONDICIONES_DE_COMPRA_CJM_WORLDWIDE_S.L..pdf",
    },
    {
        href: "https://bassari.eu/ImagenesTelasCjmw/PDF/NORMATIVA%20PAGINA%20WEB/LSSI%20POLITICA%20DE%20COOKIES%2C%20CJM%20WORLDWIDE%20S.L..pdf",
        text: "Política de Cookies",
        downloadName: "LSSI_POLITICA_DE_COOKIES_CJM_WORLDWIDE_S.L..pdf",
    },
    {
        href: "https://bassari.eu/ImagenesTelasCjmw/PDF/NORMATIVA%20PAGINA%20WEB/LSSI%20POLITICA%20DE%20PRIVACIDAD%2C%20CJM%20WORLDWIDE%20S.L..pdf",
        text: "Política de Privacidad",
        downloadName: "LSSI_POLITICA_DE_PRIVACIDAD_CJM_WORLDWIDE_S.L..pdf",
    },
];

// Enlaces adicionales
export const logoSrc = "https://bassari.eu/ImagenesTelasCjmw/Logos/CJMlogo.png";
export const contactText = "Contáctanos";
export const copyrightText = "© CJM WORLDWIDE S.L. 2025 - Todos los Derechos Reservados";

//
//
//

//src\components\ComponentesUsages\usosCard.jsx

export const careInstructions = [
    {
        id: 1,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Lavar%20a%2030%C2%BA.jpg',
        title: "Lavar a 30º",
        details: [
            "Apto para lavar a 30° en lavadora.",
            "No utilizar productos de limpieza que contengan agentes blanqueadores.",
            "No mezclar con colores diferentes."
        ],
    },
    {
        id: 2,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Lavar%20a%2040%C2%BA.jpg',
        title: "Lavar a 40º",
        details: [
            "Apto para lavar a 40° en lavadora.",
            "No utilizar productos de limpieza que contengan agentes blanqueadores.",
            "No mezclar con colores diferentes."
        ],
    },
    {
        id: 3,
        iconPath: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/No%20lavar.jpg",
        title: "No lavable a máquina",
        details: [
            "Si se indica, recomendamos limpiar la tela a mano o en seco siguiendo las instrucciones especificadas en cada caso.",
            "El daño y el encogimiento pueden ocurrir si se limpia la tela en la lavadora."
        ],
    },
    {
        id: 4,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Planchar%20a%20120%C2%BA.jpg',
        title: "Planchar a 120°",
        details: ["Se recomienda planchar la tela siempre por el reverso hasta 120 grados."],
    },
    {
        id: 5,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Planchar%20a%20160%C2%BA.jpg',
        title: "Planchar a 160°",
        details: ["Se recomienda planchar la tela siempre por el reverso hasta 160 grados."],
    },
    {
        id: 6,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Planchar%20a%20210%C2%BA.jpg',
        title: "Planchar a 210°",
        details: ["Se recomienda planchar la tela siempre por el reverso hasta 210 grados."],
    },
    {
        id: 7,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/No%20planchar.jpg',
        title: "No planchar",
        details: [
            "Se usan fibras especiales para hacer la tela indicada.",
            "No se necesita planchar para mantener la apariencia correcta de la tela, por lo que se recomienda vaporizar la tela."
        ],
    },
    {
        id: 8,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Lavar%20a%20mano.jpg',
        title: "Lavar a mano",
        details: [
            "Apto para lavar a mano en agua tibia.",
            "Usar solo jabón transparente.",
            "No usar productos no autorizados.",
            "No mezclar con colores diferentes."
        ],
    },
    {
        id: 9,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/No%20lejia.jpg',
        title: "No usar blanqueador",
        details: [
            "Ninguna de nuestras telas puede ser tratada con blanqueador.",
            "El blanqueador cambiará el color original de cualquiera de nuestras telas."
        ],
    },
    {
        id: 10,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Lavar%20en%20seco.jpg',
        title: "Limpieza en seco",
        details: [
            "Apto para ser limpiado en seco sin usar percloroetileno.",
            "Empresas con experiencia en la limpieza de telas de muebles son utilizadas."
        ],
    },
    {
        id: 11,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/No%20lavar%20en%20seco.jpg',
        title: "No lavar en seco",
        details: [
            "Apto para ser limpiado en seco sin usar percloroetileno.",
            "Empresas con experiencia en la limpieza de telas de muebles son utilizadas."
        ],
    },
    {
        id: 12,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/No%20usar%20secadora.jpg',
        title: "No usar secadora",
        details: [
            "Después de lavar las telas en la lavadora, se recomienda dejarlas colgadas en un tendedero para secar.",
            "Usar la secadora puede causar encogimientos y daños en las telas."
        ],
    },
    {
        id: 13,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/EASY%20CLEAN.jpg',
        title: "EASY CLEAN",
        details: [
            "Las telas con tecnología EASY CLEAN permiten una limpieza fácil y rápida de manchas.",
            "Simplemente se requiere usar agua y jabón para eliminar la mayoría de las manchas."
        ],
    },
    {
        id: 14,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Usar%20secadora.jpg',
        title: "Usar secadora",
        details: [
            "Apto para usar en secadora.",
            "Recomendado secar a baja temperatura para evitar daños en la tela."
        ],
    },
    {
        id: 15,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/00_ICONOS_MANTENIMIENTO/Secado%20vertical.jpg',
        title: "Secado vertical",
        details: [
            "Apto para secado en posición vertical.",
            "Es ideal para evitar arrugas y mantener la forma original de la tela."
        ],
    }
];


export const usageInstructions = [
    {
        id: 1,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Tapiceria%20decorativa.jpg',
        title: "Tapicería decorativa",
        details: [
            "Adecuado para tapicería decorativa.",
            "El grado de uso recomendado debe especificarse en cada caso.",
            "Los tejidos estampados pueden usarse con fines decorativos.",
        ],
    },
    {
        id: 2,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Tapiceria.jpg',
        title: "Tapicería",
        details: [
            "Adecuado para tapicería.",
            "El grado de uso recomendado debe especificarse en cada caso.",
            "Las telas teñidas están bien preparadas para tapicería general.",
        ],
    },
    {
        id: 3,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Cortinas.jpg',
        title: "Cortinas",
        details: [
            "Adecuado para cortinas.",
            "La mayoría de nuestras telas están hechas con fibras naturales y tintes ecológicos.",
            "Es recomendable forrar las cortinas para evitar daños por la luz solar.",
            "Recomendamos usar blackout o dimout para proteger la tela principal del sol.",
        ],
    },
    {
        id: 4,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Estores.jpg',
        title: "Estores",
        details: [
            "Adecuado para estores.",
            "La exposición continua a la luz solar puede dañar las telas. Es recomendable proteger los estores del sol.",
            "Se recomienda instalar los estores en el interior, siempre cubiertos por una cortina o un blackout adicional.",
        ],
    },
    {
        id: 5,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/Colchas.jpg',
        title: "Colchas",
        details: [
            "Adecuado para colchas.",
            "Es recomendable forrar la tela principal con un forro y, si se desea, también con una entretela de espuma.",
            "Deben respetarse las instrucciones de lavado. Contacta con nuestro departamento de investigación para recibir instrucciones precisas de cuidado y uso.",
        ],
    },
    {
        id: 6,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/FR.jpg',
        title: "FR (Resistente al fuego)",
        details: [
            "Resistentes al fuego.",
            "Las telas FR están diseñadas para no incendiarse ni propagar llamas, ofreciendo protección en entornos peligrosos como industrias eléctricas o petroquímicas.",
            "La resistencia al fuego es duradera y no se pierde con el uso o lavados.",
        ],
    },
    {
        id: 7,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/IMO.jpg',
        title: "IMO (Uso marítimo)",
        details: [
            "Adecuado para uso marítimo.",
            "Las telas IMO cumplen con normas de seguridad marítima, siendo resistentes al fuego y diseñadas para su uso en barcos y embarcaciones.",
            "Estas telas ofrecen protección contra incendios y son obligatorias en entornos marítimos para garantizar la seguridad a bordo.",
        ],
    },
    {
        id: 8,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/OUTDOOR.jpg',
        title: "Outdoor (Uso exterior)",
        details: [
            "Adecuado para el exterior.",
            "Las telas outdoor están diseñadas para resistir condiciones exteriores como sol, lluvia y humedad.",
            "Son duraderas, resistentes a rayos UV y moho, y fáciles de mantener, ideales para muebles de jardín y toldos.",
        ],
    },
    {
        id: 9,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/ADHESIVO%20SOBRE%20EL%20PAPEL.jpg',
        title: "Adhesivo sobre el papel",
        details: [
            "El papel tapiz debe colgarse aplicando esta pasta directamente en la parte posterior del papel y dejandolo tiempo para que penetre en el papel antes de aplicarlo en la pared.",
            "Este tipo de papel es la forma tradicional de colgar papel tapiz, sin embargo, requiere algunos pasos mas para colgar el papel tapiz que otros tipos de tecnicas adhesivas para papel tapiz.",
        ],
    },
    {
        id: 10,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/CASADO%20LIBRE.jpg',
        title: "Casado libre",
        details: [
            "Este tipo de papel tapiz no necesita alineación. Simplemente cuelgue el papel tapiz de la forma que desee y el patrón se alineará, lo que significa que, como resultado, se desperciará menos papel tapiz",
        ],
    },
    {
        id: 11,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/RESISTENCIA%20MODERADA%20AL%20SOL.jpg',
        title: "Resistencia al sol moderada",
        details: [
            "Evite colgar papeles pintados con solidez a la luz moderada/satisfactoria en zonas expuestas a una cantidad significativa de luz solar, ya que se desvanecerán más rapidamente",
        ],
    },
    {
        id: 12,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/01_ICONOS_USOS/SEPARABLE%20EN%20SECO.jpg',
        title: "Separable en seco",
        details: [
            "El papel tapiz despegable solo permite que la capa superior del papel tapoz se desprenda de la pared, lo que significa que el papel posterior queda atrás cuando se despega. Este papel también se puede quiter cuando el papel tapiz esté seco",
        ],
    }
];

