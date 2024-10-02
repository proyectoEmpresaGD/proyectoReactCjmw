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
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HarbourCarrusel1_5_11zon_4_11zon.webp",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/ARISTOS%20MARINE%20CARRUSEL_2_11zon_1_11zon.webp",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/DESERT%20GATE%20INDIGO_3_11zon_2_11zon.webp",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/DESERT%20GATE%20NOIR_4_11zon_3_11zon.webp",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/ROOTS%20PORCELAIN_6_11zon_5_11zon.webp",

]

const imagesCollection = [
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/ETHNIC%20MOOD/HAIMA%20MARINE%202_1_11zon_4_11zon.webp",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/MOODBOARDS/MOOD%20BOARD%20BOLONIA_9_11zon_1_11zon.webp",
    "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/HARBOUR%20AMBIENTE/ARISTOS/ARISTOS%20TANGERINE_1_11zon.webp",
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
                        <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/logoHarbour.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                    </div>
                </body>
                <NewCollection images={imagesCollection} titles={titles} productCodes={CodProduHar} />
                <ColeccionesMarcas marca={marca} />
                <Footer />
            </CartProvider>
        </>
    )
}
export default HarbourHome