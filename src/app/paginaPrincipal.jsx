import CarruselHome from "../components/ComponentesHome/carruselHome"; // Cambiado el nombre de la importación
import { Header } from "../components/header";
import { CartProvider } from '../components/CartContext';

const images = [
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/TUNDRA%20KOLA.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/ARISTOS%20MARINE.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/%20KUKULKAN%20ASHES.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/VERANDA%20JUTE.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
];

const texts = [
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoArena.png',
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoHarbour.png',
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoFlamenco.png',
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoCJM.png',
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/LOGOBASSARI_01.png'
];

const names =[
    "Arena",
    "Harbour",
    "Cjm",
    "Flamenco",
    "Bassari",
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