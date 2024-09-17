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
    "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HarbourCarrusel1.webp",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/ARISTOS/ARISTOS%20MARINE.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/DESERT%20GATE%20INDIGO.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/ROOTS%20PORCELAIN.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/DESERT%20GATE%20NOIR.jpg",
    
]

const imagesCollection = [
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/HAIMA%20MARINE%202.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/MOODBOARDS/MOOD%20BOARD%20BOLONIA.jpg",
    "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/ARISTOS/ARISTOS%20TANGERINE.jpg",
]


const titles = [
    "HAIMA",
    "BOLONIA",
    "ARISTOS"
]

const CodProduHar = [
    "HAR01053",
    "HAR00045",
    "HAR00715"
]

const marca = 'HAR';


function HarbourHome() {

    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <body className=" bg-gradient-to-b-from">
                    <div className=" flex items-center justify-center h-full pt-3">
                        <img src="https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoHarbour.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                    </div>
                </body>
                <NewCollection images={imagesCollection} titles={titles} productCodes={CodProduHar}/>
                <ColeccionesMarcas marca={marca} />
                <Footer />
            </CartProvider>
        </>
    )
}
export default HarbourHome