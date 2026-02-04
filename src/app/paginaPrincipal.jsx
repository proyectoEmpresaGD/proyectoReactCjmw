// src/app/paginaPrincipal.jsx
import CarruselHome from "../components/ComponentesHome/carruselHome";
import { Header } from "../components/header";
import { CartProvider } from "../components/CartContext.jsx";


const imagesDesktop = [
    // Harbour (igual que antes)
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_HORIZONTAL_ESSENCES%20DU%20NIL%20Y%20LE%20KHAYMA.jpg",

    // Flamenco (Nuevas colecciones - collage)
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_HORIZONTAL_ESSENCES%20DU%20NIL%20Y%20LE%20KHAYMA.jpg",

    // Bassari (Nuevas colecciones - collage)
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_2026_INDIENNE%20OCEAN.jpg",

    // Harbour (igual que antes)
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01933%20CARIBBEAN%20PARTY%20LONG%20BEACH%20INDIGO_%20TEJIDO%20RAYA%20ANCHA(1).jpg",

    // Arena (igual que antes)
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/ARENA/CORTINA_PASARELA%20web.jpg",

    // CJM (igual que antes)
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/edicion-salt-and-pepper-3.jpg",
];

const imagesMobile = [
    // Harbour (igual que antes)
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_BERBERE6.jpg",

    // Flamenco (Nuevas colecciones - collage móvil)
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_BERBERE6.jpg",

    // Bassari (Nuevas colecciones - collage móvil)

    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_FUENTECLARAOCEAN.jpg",
    // Harbour (igual que antes)
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01894%20CARIBBEAN%20PARTY%20ICE%20CREAM%20INDIGO_%20TEJIDO%20LISO(1).jpg",

    // Arena (igual que antes)
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/LIGHTHOUSE/_26A5050_OK%2035x35.jpg",

    // CJM (igual que antes)
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px.jpg",
];

const videos = [
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/01_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINA%20HOME/VIDEOS/HOME%20VIDEO.mp4",
];

// Logos (igual que tu lógica actual)
const texts = [
    "",
    "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS%20BLANCOS/LOGOBASSARI_BLANCO.png",
    "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS%20BLANCOS/Flamenco%20blanco%20gris%20transparente%20BLANCO.png",
    "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Harbour%20transparente%20BLANCO.png",
    "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Arena%20blanco%20transparente.png",
    "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS%20BLANCOS/CJM%20marca%20blanco.png",
];

const names = ["", "BASSARI", "FLAMENCO", "HARBOUR", "ARENA", "CJM"];

// ⛳ Rutas: respetamos tu sistema
const rutas = ["", "bassariHome", "flamencoHome", "harbourHome", "arenaHome", "cjmHome"];

function Home() {
    return (
        <>
            <CartProvider>
                <Header />
                <CarruselHome
                    imagesMobile={imagesMobile}
                    imagesDesktop={imagesDesktop}
                    texts={texts}
                    names={names}
                    routes={rutas}
                    videos={videos}
                />
            </CartProvider>
        </>
    );
}

export default Home;