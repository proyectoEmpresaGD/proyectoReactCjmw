import CarruselHome from "../components/ComponentesHome/carruselHome"; // Cambiado el nombre de la importación
import { Header } from "../components/header";
import { CartProvider } from '../components/CartContext';

const images = [
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/PADDINGTON_3_11zon_11zon.webp",
    "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/ARISTOS%20MARINE%20CARRUSEL.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20CARRUSEL%20HOME.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbiente/LOFT%20ALUMINIUM%202.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/BASSARI/KASSUMAY/Mejor%20calidad/BASSARI%20KASSUMAY%20IWOL%20ARGILE%20(COLCHA)%20WOLOF%20SAVANE%20(CORTINA)%20LOMPOUL%20ARGILE%20(COJINES%20TRASEROS)%20KAOLACK%20ARGILE(COJINES%20DELANTEROS).jpg",
];

const texts = [
    'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Arena%20blanco%20transparente.png',
    'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Harbour%20transparente%20BLANCO.png',
    'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Flamenco%20gris%20transparente%20NEGRO.png',
    'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/CJM%20marca%20blanco.png',
    'https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOBASSARI_01.png'
];

const names = [
    "ARENA",
    "HARBOUR",
    "FLAMENCO",
    "CJM",
    "BASSARI",
]

const rutas = [
    "arenaHome",
    "harbourHome",
    "flamencoHome",
    "cjmHome",
    "bassariHome",
]


// function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
// }

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