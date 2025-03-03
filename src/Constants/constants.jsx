//!!!!IMPORTANTE PARA BUSCAR
//Buscar con Control + F por la ruta relativa del componente o el nombre de la carpeta y encontrara todas las constantes


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!CARPETA COMPONENTES SIN ENTRAR A SUBCARPETAS!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//src\components\CartContext.jsx


// Clave para almacenar el carrito en localStorage
export const CART_STORAGE_KEY = 'cartItems';

// Obtener el carrito inicial desde localStorage
export const getInitialCart = () => JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];


//
//
//
//src\components\footer.jsx


// Constantes de URLs para logos
export const LOGO_URL = "https://bassari.eu/ImagenesTelasCjmw/Iconos/CJMlogo.png";

// Redes Sociales
export const SOCIAL_MEDIA_LINKS = {
    instagram: "https://www.instagram.com/cjmwfabrics/",
    facebook: "https://www.facebook.com/cjmwfabrics/",
    twitter: "#",
};

// Links para PDF de políticas y términos
export const PDF_LINKS = {
    terminosCompra: "public/pdfs/LSSI TÉRMINOS Y CONDICIONES DE COMPRA, CJM WORLDWIDE S.L..pdf",
    politicaCookies: "public/pdfs/LSSI POLITICA DE COOKIES, CJM WORLDWIDE S.L..pdf",
    politicaPrivacidad: "public/pdfs/LSSI POLITICA DE PRIVACIDAD, CJM WORLDWIDE S.L..pdf",
};

// Texto del pie de página
export const COPYRIGHT_TEXT = "© CJM WORLDWIDE S.L. 2024 - Todos los Derechos Reservados";

// Rutas de navegación interna
export const NAVIGATION_LINKS = {
    about: "/about",
    contact: "/contact",
    events: "/contact", // Ajustar si el enlace es distinto para eventos
};

//
//
//
//src\components\header.jsx


// Opciones de idioma
export const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' }
];

// Logos de las marcas
export const brandLogos = {
    '/arenaHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoArena.png',
    '/harbourHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoHarbour.png',
    '/cjmHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoCJM-sintexto.png',
    '/flamencoHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoFlamenco.png',
    '/bassariHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGO%20BASSARI%20negro.png',
};

// Logo predeterminado
export const defaultLogo = 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoCJM_group.png';

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
    checkoutPlaceholder: 'Proximamente disponible',  // Texto del botón de checkout
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

export const imageSet = {
    'ARE': [
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/ATMOSPHERE/ATMOSPHERE%20MOSS_3_11zon_7_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/ATMOSPHERE/BLIZZARD%20BLOSSOM_4_11zon_1_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/ATMOSPHERE/BLIZZARD%20SHELL_5_11zon_2_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/ATMOSPHERE/STORM%20DUSK_1_11zon_5_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/CALCUTA/MOODBOARD%20CALCUTA.jpg",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/COTE%20D%C2%B4AZUR/ANTIBES%20RUBY%202_8_11zon_9_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/COTE%20D%C2%B4AZUR/ANTIBES%20RUBY%203_9_11zon_10_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/COTE%20D%C2%B4AZUR/MONTECARLO%20RUBY%204_4_11zon_5_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/DUNE/DUNE%20SAHARA_5_11zon_4_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/DUNE/DUNE%20PATAGONIA_4_11zon_3_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/DUNE/AMASTISTA%20ALOE_7_11zon_6_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/FENICIA/ARE01804%20FENICIA%20MARINE%20ARTISTICA_3_11zon_3_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/FENICIA/ARE01805%20FENICIA%20SUNSHINE%20ARTISTICA_2_11zon_1_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/FENICIA/ARE01806%20FENICIA%20ROUGE%20ARTISTICA_1_11zon_2_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/JEWEL/JEWEL%20DUCK%20EGG%202_6_11zon_5_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/JEWEL/JEWEL%20NORDIC%20BLUE_4_11zon_3_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/JEWEL/JEWEL%20DUCK%20EGG%203_1_11zon_6_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/ARENA/KANNATURA/buena%20calidad/ARE01697%20NAHI%201500x1500x72.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/ARENA/KANNATURA/buena%20calidad/ARE01698%20TIMIZ%201500x1500x72.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/ARENA/KANNATURA/buena%20calidad/ARE01706%20SIKETY%201500x1500x72.jpg",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/ARENA/ARENA%20LINOTTO/artistica/ARE01458%20%20%20%20LINOTTO%20COTTON%20ARTISTICA-1200.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/ARENA/ARENA%20LINOTTO/artistica/ARE01459%20%20%20%20LINOTTO%20SNOW%20ARTISTICA-1200.jpg",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/MIKONOS%20LINEN%20(2)%20(2)%20(2)_9_11zon_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/CAPRI%20SPRING%20GREEN%20jpg_6_11zon_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/PADDINGTON_3_11zon_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MONTANA/COJINES%20MONTANA_5_11zon_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MONTANA/MAKALU%20RAVEN%20_7_11zon_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MONTANA/YELLOWSTONE%20PORCELAIN_3_11zon_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/NOMAD/HABITAT%20SAND_8_11zon_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/NOMAD/LUNAR%20BURGUNDY_9_11zon_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/NOMAD/NOMAD%20BURGUNDY%203_10_11zon_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PAPIRO/TERRA%20PORCELAIN%202_4_11zon_4_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PAPIRO/TERRA%20PORCELAIN_6_11zon_6_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PAPIRO/SMOKE%20ASH_3_11zon_3_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/LEVANTINE(1)_9_11zon_5_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/SHROUD%20WHITE_18_11zon_14_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/TRELLIS%20OFF%20WHITE_6_11zon_2_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/RUSTICA/SACO%20GARNET_1_11zon_2_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/RUSTICA/SACO%20GARNET(1)_3_11zon_1_11zon.webp",

        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/STONE/STONE%20CANAIMA_3_11zon_3_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/STONE/STONE%20TRANGO_1_11zon_1_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/STRATOS/ANTILLA%20VELVET%20C%2003_4_11zon_1_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/STRATOS/RINPA_10_11zon_7_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/STRATOS/SURIRI%20RAVEN%202_11_11zon_8_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TAIGA/TUNDRA%20KOLA%202_14_11zon_11_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TAIGA/ZAMFARA%20BAOBAB_4_11zon_1_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TAIGA/TUNDRA%2002_10_11zon_7_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TOUCH/TOUCH%20GRACE%203_4_11zon_6_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TOUCH/TOUCH%20BACALL%202_9_11zon_2_11zon.webp",

        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TOUCH/TOUCH%20LILLIAN%20GISH_6_11zon_8_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TOUCH/TOUCH%20GRACE_5_11zon_7_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/TOUCH/TOUCH%20AUDREY_8_11zon_1_11zon.webp",
        ],
    ],
    'HAR': [
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/ARISTOS/ARISTOS%20MARINE_2_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/HARBOUR/BALTIC/Artistica/HAR01530%20BALTIC%20IVORY%20ARTISTICA.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/HARBOUR/BALTIC/Artistica/HAR01582%20BALTIC%20SOFT%20SKY%20ARTISTICA.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/HARBOUR/BALTIC/Artistica/HAR01584%20BALTIC%20PUMICE%20ARTISTICA.jpg"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/BARENTS%20ROYAL%20BLUE_7_11zon_1_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/BLINDER/image00004_2_11zon_3_11zon.webp",

        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/MOODBOARDS/MOOD%20BOARD%20VARADERO_5_11zon_6_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/MOODBOARDS/MOOD%20BOARD%20VARADERO%202_4_11zon_5_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CARIBEAN/artistica/HAR01922%20%20%20%20CARIBBEAN%20ONYX%20OUTDOOR%20300%20CM%20ARTISTICA-1200.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01953%20CARIBBEAN%20PARTY%20PALM%20BEACH%20MARSHMALLOW_MANTEL.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01894%20CARIBBEAN%20PARTY%20ICE%20CREAM%20INDIGO_TEJIDO%20LISO.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01923%20CARIBBEAN%20PARTY%20CARIBBEAN%20INDIGO.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR1942%20CARIBBEAN%20PARTY%20JUNGLE%20INDIGO.%20SILLA%20TRASERA.%20COJIN%20CABECERO%20CARIBBEAN%20INDIGO.jpg",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CRUST/artistica/HAR01865%20CRUST%20SAPHIRE%20ARTISTICA-1200.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CRUST/artistica/HAR01861%20CRUST%20SAND%20ARTISTICA-1200.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/CRUST/artistica/HAR01868%20CRUST%20TANGERINE%20ARTISTICA-1200.jpg"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/DESERT%20GATE%20INDIGO.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/HAIMA%20MARINE%202_1_11zon_4_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/ROOTS%20PORCELAIN.jpg"

        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/PARABAN/artistica/HAR01652%20%20%20%20PARABAN%20CLOUD%20FR%20300%20CM%20ARTISTICA-1200.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/PARABAN/artistica/HAR01655%20%20%20%20PARABAN%20ALUMINIUM%20FR%20300%20CM%20ARTISTICA-1200.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/COLECCIONES%20NUEVAS%202024/HARBOUR/PARABAN/artistica/HAR01656%20%20%20%20PARABAN%20IRON%20FR%20300%20CM%20ARTISTICA-1200.jpg"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/HARBOUR/HARBOUR%20LIENZO/baja%20calidad/HAR01200%20LIENZO%20C05%20ANCHO%20280-280.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/HARBOUR/HARBOUR%20LIENZO/baja%20calidad/HAR01205%20LIENZO%20C10%20ANCHO%20280-280.jpg",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/MIKONOS%20LINEN%20(2)%20(2)%20(2)_9_11zon_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/SANTORINI%20NOIR%202_4_11zon_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/CAPRI%20SPRING%20GREEN%20jpg_6_11zon_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/GOTLAND/RIVIERA_1_11zon_1_11zon.webp"
        ],



    ],
    'FLA': [
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/ARTISAN%20WEAVES/ALEXANDRIA%20ABYSS%20(4)_13_11zon_9_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/ARTISAN%20WEAVES/ALEXANDRIA%20BRICK_14_11zon_6_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/ARTISAN%20WEAVES/ALEXANDRIA%20ABYSS%20(3)_12_11zon_8_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/BUCL%C3%89/BUCLE%20%20CANVAS_7_11zon_4_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/BUCL%C3%89/BUCLE%20LEAF%20(2)_2_11zon_9_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/BUCL%C3%89/BUCLE%20FOSSIL%20(2)_10_11zon_7_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/COASTAL%20LINENS/GRANADELLA%20CLOUD(2)_3_11zon_7_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/COASTAL%20LINENS/GRANADELLA%20CLOUD(3)_4_11zon_8_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/COASTAL%20LINENS/AMBOLO%20BLUEBERRY%20(2)_6_11zon_1_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/COURTYARD%20GARDEN/ADELFAS%20MOSS%20(3)_4_11zon_25_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/COURTYARD%20GARDEN/JARAPA%20(AMPLIADO)_20_11zon_12_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/COURTYARD%20GARDEN/QUEEN%20DAHLIA%20JUNIPER%20(2)_32_11zon_24_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/DIAMANTE/DIAMANTE%2002%20(AMPLIADO)_3_11zon_6_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/DIAMANTE/DIAMANTE%20C02%2002_6_11zon_3_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/DIAMANTE/DIAMANTE%20C02%20%20(3)_5_11zon_2_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/EAST%20COAST/NIAGARA%20SUNSHINE%20(2)_4_11zon_3_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/EAST%20COAST/JERSEY%20PUMICE%20(3)_3_11zon_2_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/EAST%20COAST/TIMES%20SQUARE%20AEGEAN_1_11zon_5_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/EASTERN%20MEMORIES/ESATER%20MEMORIES%20(AMPLIADA)(7)_5_11zon_7_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/EASTERN%20MEMORIES/NAZARI%20AZURE%2001_12_11zon_14_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/EASTERN%20MEMORIES/NAZARI%20TANGERINE%20(2)_13_11zon_15_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/GENESIS/GENESIS%20C01%20%20(2)_4_11zon_13_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/MOODBOARDS/MOODBOARD%20GENESIS_2_11zon_5_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/GENESIS/GENESIS%20LACQUER%20RRE%20(6)_14_11zon_23_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/GRAZALEMA/SAN%20FERNANDO%20CORAL(CABECERO)ROCIO%20DUSTY%20PINK%20Y%20SALMON%20(COJINES)%20SANLUCAR%20BLOSSOM%20(PRIMER%20COJIN)_WEB.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/GRAZALEMA/CHIPIONA%20ROUGE(COJIN)%20Y%20JARA%20ROUGE(BUTACA).jpg",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/GRAZALEMA/SANLUCAR%20BLOSSOM.jpg"
        ],

        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/LUXURY%20DREAPS/LA%20RETE%20BILLBERRY(2)_4_11zon_5_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/LUXURY%20DREAPS/LA%20RETE%20DEEP%20TEAL(6)_5_11zon_1_11zon.webp"
        ],
        // [
        //     "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/MARRAKECH/(DE%20IZQUIERDA%20A%20DERECHA)KUTUBIA%20OCEAN%20MENARA%20COBALT%20RIAD%20DENIM%20MARRAKECH%20COBALT%20AGDAL%20ROYAL%20BLUE%20MAMOUNIA%20AZURE.JPG"
        // ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/REVOLTOSO/BORNEO_3_11zon_28_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/REVOLTOSO/IMPERIAL_4_11zon_29_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/REVOLTOSO/LUMIERE_8_11zon_3_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/RIVIERA/RIVIERA.jpeg",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/RIVIERA/FLA001218%20COLONIAL%20DAMASK%20PRING%20GREEN_03.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/RIVIERA/FLA001208%20GUANAHANI%20SPRING%20GREEN_02.jpg"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/SISAL/Cover%20Front_4_11zon_5_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/SISAL/insert%20back_5_11zon_1_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/SISAL/insert%20front_1_11zon_2_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/SISAL/cover%20back_3_11zon_4_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/FLAMENCO/TEDDY/Artistica/FLA001377%20TEDDY%20SALMON%20ARTISTICA-1200.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/FLAMENCO/TEDDY/Artistica/FLA001375%20TEDDY%20BUFF%20ARTISTICA-1200.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/FLAMENCO/TEDDY/Artistica/FLA001368%20TEDDY%20CHARCOAL%20ARTISTICA-1200.jpg",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/FLAMENCO/VELLUTISSIMO/buena%20calidad/FLA000407%20VELLUTISSIMO%20EVERGREEN%20300%20CM.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/FLAMENCO/VELLUTISSIMO/buena%20calidad/FLA000415%20VELLUTISSIMO%20PAPRIKA%20300%20CM.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/FLAMENCO/VELLUTISSIMO/buena%20calidad/FLA000402%20VELLUTISSIMO%20CANVAS%20300%20CM.jpg"
        ],
    ],
    'CJM': [
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/VERANDA/VERANDA%20EVERGREEN_4_11zon_6_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/VERANDA/VERANDA%20EMERALD%20F1_3_11zon_5_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/VERANDA/VERANDA%20SUNSHINE%202_6_11zon_2_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SABANNA%2001_3_11zon_3_11zon.webp"

        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/TOKIO/COLECCI%C3%93N%20TOKIO_4_1.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/TOKIO/COLECCI%C3%93N%20TOKIO%202_3_4.webp"

        ],

        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/VELVETY/VELVETY%20ALOE_9_11zon_1_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/VELVETY/VELVETY%20EVERGREEN_2_11zon_5_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/VELVETY/VELVETY%20LAVAROCK%202_5_11zon_8_11zon.webp"

        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/ROAD%20TO%20ASIA/BOTANICAL%20KOMORI%20MAGNESIUM_7_11zon_4_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/ROAD%20TO%20ASIA/LINOUS%20HEMP_19_11zon_16_11zon.webp",

        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20FRESCO%2001_2_11zon_2_11zon.webp"

        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px_1_11zon_1_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SET%20OF%20THREADS/ROKKI%20PUMICE_7_11zon_10_11zon.webp",


        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/URBAN%20CONTEMPORARY/LOFT%20ALUMINIUM%202_2_11zon_4_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/URBAN%20CONTEMPORARY/LOFT%20ALUMINIUM_3_11zon_1_11zon.webp"

        ],

        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/COLONY/FIYI%20%20LAGOON_13_11zon_16_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/COLONY/TROPICAL%20LEAVES%20EVERGREEN_12_11zon_15_11zon_2_11zon.webp",
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/CJMW/CHEVIOT/buena/CJM02527%20CHEVIOT%20NORDIC%20BLUE-1200.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/CJMW/CJM%20OTOMAN/buena%20calidad/CJM02715%20%20%20%20OTOMAN%20MILK-1200.jpg",
            "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/CJMW/CJMW%20COURDROY/buena%20calidad/CJM02485%20%20%20%20COURDROY%20OFF%20WHITE%20140%20CM-1200.jpg"

        ],
        [

            "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/SANTORINI%20NOIR%202_4_11zon_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/SALT%20TANGERINE_1_11zon_1_11zon.webp"

        ],
    ],
    'BAS': [
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/KASSUMAY/BASSARI%20KASSUMAY%20IWOL%20ARGILE%20(COLCHA)%20WOLOF%20SAVANE%20(CORTINA)%20LOMPOUL%20ARGILE%20(COJINES%20TRASEROS)%20KAOLACK%20ARGILE(COJINES%20DELANTEROS)_3_11zon_3_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/KASSUMAY/BASSARI%20KASSUMAY%20KAOLACK%20MOUTARDE_2_11zon_9_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/KASSUMAY/BASSARI%20KASSUMAY%20KARABANE%20AMBRE%20ARGILE%20ET%20MOUTARDE_3_11zon_10_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/TRIBAL/BASSARI%20TRIBAL%20DAKAR%20BOUE%20SABLE%20ET%20GRIS%20NUAGE_6_11zon_11_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/TRIBAL/BASSARI%20TRIBAL%20DAKAR%20INDIGO_3_11zon_2_11zon.webp",
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/TRIBAL/BASSARI%20TRIBAL%20KARITE%20AMBRE%20_2_11zon_13_11zon.webp"
        ],
        [
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/UNIVERS/BASSARI%20UNIVERS%20MARTIEN%20SAUGE%20ET%20VERT%20EMPIRE_11zon_11zon_11zon.webp",

        ],
    ],
}

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

export const contactInfo = {
    montilla: {
        direccion: "Avenida de Europa 19",
        telefono: "+34-957-656-475",
        nombre: "MONTILLA",
        correo: "info@cjmw.eu"
    },
    madrid: {
        direccion: "C/ Juan Álvarez Mendizabal 53",
        telefono: "+34-673 342 185",
        nombre: "MADRID",
        correo: "info@cjmw.eu"
    },
    barcelona: {
        direccion: "Aribau 228 Bajos 1º",
        telefono: "+34-666-538-045",
        nombre: "BARCELONA",
        correo: "info@cjmw.eu"
    },
    holanda: {
        direccion: "Nieuve showroom, ETC DESIGN CENTER 1e Etage Stand 32",
        telefono: "+31-614-446-800",
        nombre: "HOLANDA",
        correo: "info@cjmw.eu"
    },
};

export const contactTexts = {
    sectionTitle: "Contáctanos",
    showroomTitle: "Visita nuestros showrooms",
    contactButtonText: "Contáctenos",
    socialMediaFollow: "Síguenos en",
};

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
        imgSrc: "https://bassari.eu/ImagenesTelasCjmw/Iconos/logoArena.png",
        imgAlt: "Client Logo Arena",
        imgSize: "w-48 h-48",
    },
    {
        link: "/cjmHome",
        imgSrc: "https://bassari.eu/ImagenesTelasCjmw/Iconos/logoCJM.png",
        imgAlt: "Client Logo CJM",
        imgSize: "w-20 h-20",
    },
    {
        link: "/flamencoHome",
        imgSrc: "https://bassari.eu/ImagenesTelasCjmw/Iconos/logoFlamenco.png",
        imgAlt: "Client Logo Flamenco",
        imgSize: "w-48 h-48",
    },
    {
        link: "/harbourHome",
        imgSrc: "https://bassari.eu/ImagenesTelasCjmw/Iconos/logoHarbour.png",
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
export const defaultImageUrl = 'https://bassari.eu/ImagenesTelasCjmw/Iconos/ProductoNoEncontrado.webp';
export const apiUrl = import.meta.env.VITE_API_BASE_URL;

//
//
//

//src\components\ComponentesProductos\modal.jsx

export const defaultImageUrlModalProductos = 'https://bassari.eu/ImagenesTelasCjmw/Iconos/ProductoNoEncontrado.webp';
export const mantenimientoImages = {
    "LAVAR A 30º": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%2030%C2%BA.jpg',
    "LAVAR A 40º": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%2040%C2%BA.jpg',
    "LAVAR A 90º": '',
    "NO LAVAR": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lavar.jpg",
    "PLANCHAR A 120º": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20120%C2%BA.jpg',
    "PLANCHAR A 160º": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20160%C2%BA.jpg',
    "PLANCHAR A 210º": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20210%C2%BA.jpg',
    "NO PLANCHAR": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20planchar.jpg',
    "LAVAR A MANO": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%20mano.jpg',
    "NO USAR LEJIA": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lejia.jpg',
    "LAVAR EN SECO": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20en%20seco.jpg',
    "NO LAVAR EN SECO": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lavar%20en%20seco.jpg',
    "NO USAR SECADORA": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20usar%20secadora.jpg',
    "USAR LEJIA": '',
    "EASYCLEAN": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/EASY%20CLEAN.jpg',
    "USAR SECADORA": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Usar%20secadora.jpg',
    "SECADO VERTICAL": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Secado%20vertical.jpg',
};

export const usoImages = {
    "TAPICERIA DECORATIVA": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Tapiceria%20decorativa.jpg',
    "TAPICERIA": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Tapiceria.jpg',
    'CORTINAS': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Cortinas.jpg',
    "ESTORES": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Estores.jpg',
    "COLCHAS": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Colchas.jpg',
    "ALFOMBRAS": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Alfombras.jpg',
    "FR": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/FR.jpg",
    "OUTDOOR": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/OUTDOOR.jpg",
    "IMO": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/IMO.jpg",
    "CASADO LIBRE": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/CASADO%20LIBRE.jpg",
    "RESISTENCIA MODERADA SOL": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/RESISTENCIA%20MODERADA%20AL%20SOL.jpg",
    "SEPARABLE EN SECO": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/SEPARABLE%20EN%20SECO.jpg",
    "ADHESIVO SOBRE EL PAPEL": "https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/ADHESIVO%20SOBRE%20EL%20PAPEL.jpg",
};

export const marcasMap = {
    "ARE": "ARENA",
    "CJM": "CJM",
    "FLA": "FLAMENCO",
    "HAR": "HARBOUR",
    "BAS": "BASSARI",
};

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

//src\components\ComponentesUsages\footerHome.jsx

// Iconos de redes sociales
export const socialIcons = [
    { href: "https://www.instagram.com/cjmwfabrics/", icon: "RiInstagramLine" },
    { href: "https://www.facebook.com/cjmwfabrics/", icon: "RiFacebookLine" },
    { href: "#", icon: "RiTwitterXFill" },
];

// Imagen de QR
export const qrCodeSrc = "https://bassari.eu/ImagenesTelasCjmw/Iconos/qr-code.svg";

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
export const logoSrc = "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logo.png";
export const contactText = "Contáctanos";
export const copyrightText = "© CJM WORLDWIDE S.L. 2024 - Todos los Derechos Reservados";

//
//
//

//src\components\ComponentesUsages\usosCard.jsx

export const careInstructions = [
    {
        id: 1,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%2030%C2%BA.jpg',
        title: "Lavar a 30º",
        details: [
            "Apto para lavar a 30° en lavadora.",
            "No utilizar productos de limpieza que contengan agentes blanqueadores.",
            "No mezclar con colores diferentes."
        ],
    },
    {
        id: 2,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%2040%C2%BA.jpg',
        title: "Lavar a 40º",
        details: [
            "Apto para lavar a 40° en lavadora.",
            "No utilizar productos de limpieza que contengan agentes blanqueadores.",
            "No mezclar con colores diferentes."
        ],
    },
    {
        id: 3,
        iconPath: "https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lavar.jpg",
        title: "No lavable a máquina",
        details: [
            "Si se indica, recomendamos limpiar la tela a mano o en seco siguiendo las instrucciones especificadas en cada caso.",
            "El daño y el encogimiento pueden ocurrir si se limpia la tela en la lavadora."
        ],
    },
    {
        id: 4,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20120%C2%BA.jpg',
        title: "Planchar a 120°",
        details: ["Se recomienda planchar la tela siempre por el reverso hasta 120 grados."],
    },
    {
        id: 5,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20160%C2%BA.jpg',
        title: "Planchar a 160°",
        details: ["Se recomienda planchar la tela siempre por el reverso hasta 160 grados."],
    },
    {
        id: 6,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Planchar%20a%20210%C2%BA.jpg',
        title: "Planchar a 210°",
        details: ["Se recomienda planchar la tela siempre por el reverso hasta 210 grados."],
    },
    {
        id: 7,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20planchar.jpg',
        title: "No planchar",
        details: [
            "Se usan fibras especiales para hacer la tela indicada.",
            "No se necesita planchar para mantener la apariencia correcta de la tela, por lo que se recomienda vaporizar la tela."
        ],
    },
    {
        id: 8,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20a%20mano.jpg',
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
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lejia.jpg',
        title: "No usar blanqueador",
        details: [
            "Ninguna de nuestras telas puede ser tratada con blanqueador.",
            "El blanqueador cambiará el color original de cualquiera de nuestras telas."
        ],
    },
    {
        id: 10,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Lavar%20en%20seco.jpg',
        title: "Limpieza en seco",
        details: [
            "Apto para ser limpiado en seco sin usar percloroetileno.",
            "Empresas con experiencia en la limpieza de telas de muebles son utilizadas."
        ],
    },
    {
        id: 11,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20lavar%20en%20seco.jpg',
        title: "No lavar en seco",
        details: [
            "Apto para ser limpiado en seco sin usar percloroetileno.",
            "Empresas con experiencia en la limpieza de telas de muebles son utilizadas."
        ],
    },
    {
        id: 12,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/No%20usar%20secadora.jpg',
        title: "No usar secadora",
        details: [
            "Después de lavar las telas en la lavadora, se recomienda dejarlas colgadas en un tendedero para secar.",
            "Usar la secadora puede causar encogimientos y daños en las telas."
        ],
    },
    {
        id: 13,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/EASY%20CLEAN.jpg',
        title: "EASY CLEAN",
        details: [
            "Las telas con tecnología EASY CLEAN permiten una limpieza fácil y rápida de manchas.",
            "Simplemente se requiere usar agua y jabón para eliminar la mayoría de las manchas."
        ],
    },
    {
        id: 14,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Usar%20secadora.jpg',
        title: "Usar secadora",
        details: [
            "Apto para usar en secadora.",
            "Recomendado secar a baja temperatura para evitar daños en la tela."
        ],
    },
    {
        id: 15,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Mantenimientos/Secado%20vertical.jpg',
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
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Tapiceria%20decorativa.jpg',
        title: "Tapicería decorativa",
        details: [
            "Adecuado para tapicería decorativa.",
            "El grado de uso recomendado debe especificarse en cada caso.",
            "Los tejidos estampados pueden usarse con fines decorativos.",
        ],
    },
    {
        id: 2,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Tapiceria.jpg',
        title: "Tapicería",
        details: [
            "Adecuado para tapicería.",
            "El grado de uso recomendado debe especificarse en cada caso.",
            "Las telas teñidas están bien preparadas para tapicería general.",
        ],
    },
    {
        id: 3,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Cortinas.jpg',
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
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Estores.jpg',
        title: "Estores",
        details: [
            "Adecuado para estores.",
            "La exposición continua a la luz solar puede dañar las telas. Es recomendable proteger los estores del sol.",
            "Se recomienda instalar los estores en el interior, siempre cubiertos por una cortina o un blackout adicional.",
        ],
    },
    {
        id: 5,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/Colchas.jpg',
        title: "Colchas",
        details: [
            "Adecuado para colchas.",
            "Es recomendable forrar la tela principal con un forro y, si se desea, también con una entretela de espuma.",
            "Deben respetarse las instrucciones de lavado. Contacta con nuestro departamento de investigación para recibir instrucciones precisas de cuidado y uso.",
        ],
    },
    {
        id: 6,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/FR.jpg',
        title: "FR (Resistente al fuego)",
        details: [
            "Resistentes al fuego.",
            "Las telas FR están diseñadas para no incendiarse ni propagar llamas, ofreciendo protección en entornos peligrosos como industrias eléctricas o petroquímicas.",
            "La resistencia al fuego es duradera y no se pierde con el uso o lavados.",
        ],
    },
    {
        id: 7,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/IMO.jpg',
        title: "IMO (Uso marítimo)",
        details: [
            "Adecuado para uso marítimo.",
            "Las telas IMO cumplen con normas de seguridad marítima, siendo resistentes al fuego y diseñadas para su uso en barcos y embarcaciones.",
            "Estas telas ofrecen protección contra incendios y son obligatorias en entornos marítimos para garantizar la seguridad a bordo.",
        ],
    },
    {
        id: 8,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/OUTDOOR.jpg',
        title: "Outdoor (Uso exterior)",
        details: [
            "Adecuado para el exterior.",
            "Las telas outdoor están diseñadas para resistir condiciones exteriores como sol, lluvia y humedad.",
            "Son duraderas, resistentes a rayos UV y moho, y fáciles de mantener, ideales para muebles de jardín y toldos.",
        ],
    },
    {
        id: 9,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/ADHESIVO%20SOBRE%20EL%20PAPEL.jpg',
        title: "Adhesivo sobre el papel",
        details: [
            "El papel tapiz debe colgarse aplicando esta pasta directamente en la parte posterior del papel y dejandolo tiempo para que penetre en el papel antes de aplicarlo en la pared.",
            "Este tipo de papel es la forma tradicional de colgar papel tapiz, sin embargo, requiere algunos pasos mas para colgar el papel tapiz que otros tipos de tecnicas adhesivas para papel tapiz.",
        ],
    },
    {
        id: 10,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/CASADO%20LIBRE.jpg',
        title: "Casado libre",
        details: [
            "Este tipo de papel tapiz no necesita alineación. Simplemente cuelgue el papel tapiz de la forma que desee y el patrón se alineará, lo que significa que, como resultado, se desperciará menos papel tapiz",
        ],
    },
    {
        id: 11,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/RESISTENCIA%20MODERADA%20AL%20SOL.jpg',
        title: "Resistencia al sol moderada",
        details: [
            "Evite colgar papeles pintados con solidez a la luz moderada/satisfactoria en zonas expuestas a una cantidad significativa de luz solar, ya que se desvanecerán más rapidamente",
        ],
    },
    {
        id: 12,
        iconPath: 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Usos/SEPARABLE%20EN%20SECO.jpg',
        title: "Separable en seco",
        details: [
            "El papel tapiz despegable solo permite que la capa superior del papel tapoz se desprenda de la pared, lo que significa que el papel posterior queda atrás cuando se despega. Este papel también se puede quiter cuando el papel tapiz esté seco",
        ],
    }
];

