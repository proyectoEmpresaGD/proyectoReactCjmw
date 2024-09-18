import CarruselHome from "../components/ComponentesHome/carruselHome"; // Cambiado el nombre de la importación
import { Header } from "../components/header";
import { CartProvider } from '../components/CartContext';

const images = [
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/MEDITERRANEAN%20STRIPES/PADDINGTON.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/ARISTOS%20MARINE%20CARRUSEL.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20CARRUSEL%20HOME.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/LOFT%20ALUMINIUM%202.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/IMG_9820.jpg",
];

const texts = [
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoArena.png',
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoHarbour.png',
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoFlamenco.png',
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/CJM-new-transparente.svg',
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/LOGOBASSARI_BLANCO.png'
];

const names =[
    "ARENA",
    "HARBOUR",
    "FLAMENCO",
    "CJM",
    "BASSARI",
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
                <CarruselHome images={images} texts={texts} names={names} />
            </CartProvider>
        </>
    );
}

export default Home;