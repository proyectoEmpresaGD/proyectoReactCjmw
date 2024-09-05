import CarruselHome from "../components/ComponentesHome/carruselHome"; // Cambiado el nombre de la importación
import { Header } from "../components/header";
import { CartProvider } from '../components/CartContext';

const images = [
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel3.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel4.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
];

const texts = [
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoArena.png',
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoHarbour.png',
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoFlamenco.png',
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoCJM.png',
    'https://cjmw.eu/ImagenesTelasCjmw/Iconos/LOGOBASSARI_01.png'
];


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
                <CarruselHome images={images} texts={texts} />
            </CartProvider>
        </>
    );
}

export default Home;