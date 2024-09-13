import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import { Link } from "react-router-dom";
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas"

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const images = [
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel3.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel4.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HarbourCarrusel1.webp",
]

const imagesCollection = [
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HarbourCarrusel1.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel3.webp",
]


const titles = [
    "ARENA DUNE",
    "ARENA DUNE",
    "ArenaCarrusel2.webp",
    "ArenaCarrusel3.webp"
]
const marca = 'HAR';


function HarbourHome() {

    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <body className=" bg-gradient-to-b-from">
                    <div className=" flex items-center justify-center h-full">
                        <img src="https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoHarbour.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                    </div>
                </body>
                <NewCollection images={imagesCollection} titles={titles} />
                <ColeccionesMarcas marca={marca} />
                <Footer />
            </CartProvider>
        </>
    )
}
export default HarbourHome