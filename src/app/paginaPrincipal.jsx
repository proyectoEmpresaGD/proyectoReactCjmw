// src/app/paginaPrincipal.jsx
import CarruselHome from "../components/ComponentesHome/carruselHome";
import { Header } from "../components/header";
import { CartProvider } from "../components/CartContext.jsx";

const imagesDesktop = [
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_HORIZONTAL_ESSENCES%20DU%20NIL%20Y%20LE%20KHAYMA.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_HORIZONTAL_ESSENCES%20DU%20NIL%20Y%20LE%20KHAYMA.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_2026_INDIENNE%20OCEAN.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01933%20CARIBBEAN%20PARTY%20LONG%20BEACH%20INDIGO_%20TEJIDO%20RAYA%20ANCHA(1).jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/LIGHTHOUSE/_26A4907-2-OK%2035x35.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/edicion-salt-and-pepper-3.jpg",
];

const imagesMobile = [
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_BERBERE6.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_BERBERE6.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_FUENTECLARAOCEAN.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01894%20CARIBBEAN%20PARTY%20ICE%20CREAM%20INDIGO_%20TEJIDO%20LISO(1).jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/LIGHTHOUSE/_26A5050_OK%2035x35.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px.jpg",
];

const videos = [
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/VIDEOS/HOME%20VIDEO.mp4",
];

const texts = [
    "",
    "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS%20BLANCOS/LOGOBASSARI_BLANCO.png",
    "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS%20BLANCOS/Flamenco%20blanco%20gris%20transparente%20BLANCO.png",
    "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoHarbour.png",
    "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoArena.png",
    "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM-sintexto.png",
];

const names = ["", "BASSARI", "FLAMENCO", "HARBOUR", "ARENA", "CJM"];
const rutas = ["", "bassariHome", "flamencoHome", "harbourHome", "arenaHome", "cjmHome"];

const newCollectionsByBrand = {
    BASSARI: ["ESSENCES DU NIL", "LE VOYAGE DES WOLOF"],
    FLAMENCO: ["INDIENNE STRIPES", "PALACIO DE LAS DUEÑAS"],
};

// ✅ Añadimos heroCollections para el hero en 2 imágenes
const heroCollections = [
    {
        brand: "BASSARI",
        collection: "ESSENCES DU NIL",
        image:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_HORIZONTAL_ESSENCES%20DU%20NIL%20Y%20LE%20KHAYMA.jpg",
        route: "bassariHome",
    },
    {
        brand: "BASSARI",
        collection: "ESSENCES DU NIL",
        image:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASSA_ESSENCESDUNIL_YUBA4.jpg",
        route: "bassariHome",
    },
    {
        brand: "BASSARI",
        collection: "LE VOYAGE DES WOLOF",
        image:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASSARI%20LE%20VOYAGE%20DES%20WOLOF%20ZOSER%202.jpg",
        route: "bassariHome",
    }, {
        brand: "BASSARI",
        collection: "LE VOYAGE DES WOLOF",
        image:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASS_ESSENCESDUNIL_YUBA1.jpg",
        route: "bassariHome",
    },
    {
        brand: "FLAMENCO",
        collection: "INDIENNE STRIPES",
        image:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_2026_INDIENNE%20OCEAN.jpg",
        route: "flamencoHome",
    },
    {
        brand: "FLAMENCO",
        collection: "INDIENNE STRIPES",
        image:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/INDIENNE%20STRIPES/CJM_FLAMENCO_2026-TRESTELAS.jpg",
        route: "flamencoHome",
    },
    {
        brand: "FLAMENCO",
        collection: "PALACIO DE LAS DUEÑAS",
        image:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_PINEDA_IBORY.jpg",
        route: "flamencoHome",
    },
    {
        brand: "FLAMENCO",
        collection: "PALACIO DE LAS DUEÑAS",
        image:
            "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_2026_SALON%20DE%20LA%20GITANA%20MUSTARD_1.jpg",
        route: "flamencoHome",
    },
];


function Home() {
    return (
        <CartProvider>
            <Header />
            <CarruselHome
                imagesMobile={imagesMobile}
                imagesDesktop={imagesDesktop}
                texts={texts}
                names={names}
                routes={rutas}
                heroCollections={heroCollections}
                newCollectionsByBrand={newCollectionsByBrand}
                videos={videos}
            />
        </CartProvider>
    );
}

export default Home;


