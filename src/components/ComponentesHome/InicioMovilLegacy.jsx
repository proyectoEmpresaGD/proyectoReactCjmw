import CarruselHome
    from "./carruselHome";


const imagesMobile = [
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_BERBERE6.webp",

    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_BERBERE6.webp",

    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_FUENTECLARAOCEAN.webp",

    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01894%20CARIBBEAN%20PARTY%20ICE%20CREAM%20INDIGO_%20TEJIDO%20LISO(1).jpg",

    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/ARENA%20AMBIENTE/LIGHTHOUSE/_26A5050_OK%2035x35.webp",

    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px.jpg",
];


const texts = [
    "",

    "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS%20BLANCOS/LOGOBASSARI_BLANCO.png",

    "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS%20BLANCOS/Flamenco%20blanco%20gris%20transparente%20BLANCO.png",

    "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS%20BLANCOS/Harbour%20transparente%20BLANCO.png",

    "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS%20BLANCOS/Arena%20blanco%20transparente.png",

    "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS%20BLANCOS/CJM%20marca%20blanco.png",
];


const names = [
    "",
    "BASSARI",
    "FLAMENCO",
    "HARBOUR",
    "ARENA",
    "CJM",
];


const routes = [
    "",
    "bassariHome",
    "flamencoHome",
    "harbourHome",
    "arenaHome",
    "cjmHome",
];


const newCollectionsByBrand = {
    BASSARI: [
        "ESSENCES DU NIL",
        "LE VOYAGE DES WOLOF",
    ],

    FLAMENCO: [
        "INDIENNE STRIPES",
        "PALACIO DE LAS DUEÑAS",
    ],

    ARENA: [
        "KANNATURA VOL III",
    ],
};


export default function HomeLegacyMobile() {
    return (
        <CarruselHome
            imagesMobile={
                imagesMobile
            }
            imagesDesktop={
                imagesMobile
            }
            texts={
                texts
            }
            names={
                names
            }
            routes={
                routes
            }
            newCollectionsByBrand={
                newCollectionsByBrand
            }
        />
    );
}
