// src/app/paginaPrincipal.jsx (ajusta la ruta si aplica)
import CarruselHome from "../components/ComponentesHome/carruselHome";
import { Header } from "../components/header";
import { CartProvider } from "../components/CartContext.jsx";

const imagesDesktop = [
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/FONDO-WEB-HABITAT-2025Bueno.png",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/FLA001199-SEA-STRIPE-SPRING-GREEN.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/BASSARI/KASSUMAY/Mejor%20calidad/BASSARI%20KASSUMAY%20IWOL%20ARGILE%20(COLCHA)%20WOLOF%20SAVANE%20(CORTINA)%20LOMPOUL%20ARGILE%20(COJINES%20TRASEROS)%20KAOLACK%20ARGILE(COJINES%20DELANTEROS).jpg",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01933%20CARIBBEAN%20PARTY%20LONG%20BEACH%20INDIGO_%20TEJIDO%20RAYA%20ANCHA(1).jpg",
    "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CARRUSEL%20HOME/ARENA/CORTINA_PASARELA%20web.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/edicion-salt-and-pepper-3.jpg",
];

const imagesMobile = [
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/fondo-web-feria-MOVIL.png",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/FLAMENCO%20AMBIENTE/MOODBOARDS/MOOD%20BOARD%20JARAPA%20(COJINES).jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/BASSARI%20AMBIENTE/TRIBAL/BASSARI%20TRIBAL%20KARITE%20AMBRE%20.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01894%20CARIBBEAN%20PARTY%20ICE%20CREAM%20INDIGO_%20TEJIDO%20LISO(1).jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/SANTORINI%20NOIR%202_4_11zon_11zon.webp",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_MarcasNueva/CJM%20AMBIENTE/MOODBOARDS/MOODBOARD%20SET%20OF%20THREADS%2072px.jpg",
];

const videos = [
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/VIDEOS/WEB%20FONDO%20TAKUMI.mp4",
];

const texts = [
    "",
    "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Flamenco%20blanco%20gris%20transparente%20BLANCO.png",
    "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGO%20BASSARI%20negro.png",
    "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Harbour%20transparente%20BLANCO.png",
    "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Arena%20blanco%20transparente.png",
    "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS%20BLANCOS/CJM%20marca%20blanco.png",
];

const names = ["", "FLAMENCO", "BASSARI", "HARBOUR", "ARENA", "CJM"];

const rutas = ["", "flamencoHome", "bassariHome", "harbourHome", "arenaHome", "cjmHome"];

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
