import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas"

function ArenaHome() {
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const marca = 'ARE';

    const images = [
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/BARANDILLA.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/ARE00992%20ANTIBES%20RUBY%202.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ]

    const imagesNewCollections = [
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/BARANDILLA.jpg",
    ]

    const titles = [
        "TOUCH",
        "ATISAN",
        "SANTORINI",
    ]

    const CodProduAre = [
        "ARE00192",
        "ARE01106",
        "ARE00582",
    ]

    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <body className=" bg-gradient-to-r from-[#ebdecf] to-[#a78d6e] ">
                    <div className=" flex items-center justify-center h-full pt-3">
                        <img src="https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoArena.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                    </div>
                
                <NewCollection images={imagesNewCollections} titles={titles} productCodes={CodProduAre} />
                <ColeccionesMarcas marca={marca} />
                </body>
                <Footer />
            </CartProvider>
        </>
    )
}
export default ArenaHome