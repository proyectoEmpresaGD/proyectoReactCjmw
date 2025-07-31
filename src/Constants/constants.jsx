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



//
//
//
//src\components\footer.jsx


// Constantes de URLs para logos
export const LOGO_URL = "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/ESCUDOS/CJMlogo.png";

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
export const COPYRIGHT_TEXT = "© CJM WORLDWIDE S.L. 2025 - Todos los Derechos Reservados";

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
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
];

// Logos de las marcas
export const brandLogos = {
    '/arenaHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoArena.png',
    '/harbourHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoHarbour.png',
    '/cjmHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoCJM-sintexto.png',
    '/flamencoHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoFlamenco.png',
    '/bassariHome': 'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGO%20BASSARI%20negro.png',
    HAR: "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoHarbour.png",
    ARE: "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoArena.png",
    CJM: "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoCJM-sintexto.png",
    FLA: "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/logoFlamenco.png",
    BAS: "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGO%20BASSARI%20negro.png",
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
        "KASSUMAY", "TRIBAL", "UNIVERS",
    ],
    ARE: [
        "ATMOSPHERE", "CALCUTA", "CÔTE D´AZUR", "DUNE", "FENICIA",
        "JEWEL", "KANNATURA", "KANNATURA VOL II", "LINOTTO",
        "MEDITERRANEAN STRIPES", "MONTANA", "NOMAD", "PAPIRO",
        "PURITTY", "STONE", "STRATOS", "TAIGA", "TOUCH", "RUSTICA"
    ],
    "HAR": [
        "BOLONIA & VARADERO",
        "CARIBBEAN PARTY",
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
    "FLA": [
        "GRAZALEMA",
        "MARRAKECH",
        "VELLUTISSIMO",
        "SISAL",
        "TEDDY",
        "ARTISAN WEAVES",
        "BUCLÉ",
        "COASTAL LINENS",
        "COURTYARD GARDEN",
        "DIAMANTE",
        "EAST COAST",
        "EASTERN MEMORIES",
        "GENESIS",
        "LUXURY DREAPS",
        "REVOLTOSO",
        "RIVIERA",


    ],
    "CJM": [
        "TOKIO",
        "COLONY",
        "COLONY WALLPAPER",
        "FRESCO",
        "MEDITERRANEAN STRIPES",
        "ROADS TO ASIA",
        "SABANNA",
        "SALT & PEPPER",
        "SET OF THREADS",
        "SUEDER",
        "TAYLORED",
        "URBAN CONTEMPORARY",
        "VELVETY",
        "VERANDA"
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
    "100% OPACIDAD": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/ICONOS%20CON%20PSD/ICONOS%20TRANPARENCIA/Opaco.jpg',
    "90% OPACIDAD": 'https://bassari.eu/ImagenesTelasCjmw/Iconos/ICONOS%20CON%20PSD/ICONOS%20TRANPARENCIA/Semi-opaco.jpg'
};

export const marcasMap = {
    "ARE": "ARENA",
    "CJM": "CJM",
    "FLA": "FLAMENCO",
    "HAR": "HARBOUR",
    "BAS": "BASSARI",
};

export const direccionLogos = {
    "NON-DIRECTIONAL": "https://bassari.eu/ImagenesTelasCjmw/Iconos/DIRECCIONES-TELAS/NON-DIRECTIONAL.png",
    "NON-RAILROADED": "https://bassari.eu/ImagenesTelasCjmw/Iconos/DIRECCIONES-TELAS/NON-RAILROADED.png",
    "RAILROADED": "https://bassari.eu/ImagenesTelasCjmw/Iconos/DIRECCIONES-TELAS/RAILROADED.png",
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
export const logoSrc = "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/CJMlogo.png";
export const contactText = "Contáctanos";
export const copyrightText = "© CJM WORLDWIDE S.L. 2025 - Todos los Derechos Reservados";

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

