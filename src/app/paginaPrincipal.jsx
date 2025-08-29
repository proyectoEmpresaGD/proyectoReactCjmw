import CarruselHome from "../components/ComponentesHome/carruselHome"; // Cambiado el nombre de la importación
import { Header } from "../components/header";
import { CartProvider } from '../components/CartContext.jsxç';

const images = [
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/FLA001199-SEA-STRIPE-SPRING-GREEN.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/BASSARI/KASSUMAY/Mejor%20calidad/BASSARI%20KASSUMAY%20IWOL%20ARGILE%20(COLCHA)%20WOLOF%20SAVANE%20(CORTINA)%20LOMPOUL%20ARGILE%20(COJINES%20TRASEROS)%20KAOLACK%20ARGILE(COJINES%20DELANTEROS).jpg",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01933%20CARIBBEAN%20PARTY%20LONG%20BEACH%20INDIGO_%20TEJIDO%20RAYA%20ANCHA(1).jpg",
    "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CARRUSEL%20HOME/ARENA/CORTINA_PASARELA%20web.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/CJMW/TOKIO%20Y%20SHIBULLA_4_11zon.webp",
];

const texts = [
    'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Flamenco%20blanco%20gris%20transparente%20BLANCO.png',
    'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGO%20BASSARI%20negro.png',
    'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Harbour%20transparente%20BLANCO.png',
    'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Arena%20blanco%20transparente.png',
    'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS%20BLANCOS/CJM%20marca%20blanco.png',
];

const names = [
    "FLAMENCO",
    "BASSARI",
    "HARBOUR",
    "ARENA",
    "CJM",

]

const rutas = [
    "flamencoHome",
    "bassariHome",
    "harbourHome",
    "arenaHome",
    "cjmHome",

]

function Home() {
    return (
        <>
            <CartProvider>
                <Header />
                <CarruselHome images={images} texts={texts} names={names} routes={rutas} />
            </CartProvider>
        </>
    );
}

export default Home;