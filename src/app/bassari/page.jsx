import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas"

function BassariHome() {

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    

    const marca = 'BAS';

    const images = [
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/BARANDILLA.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/ARE00992%20ANTIBES%20RUBY%202.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ]

    const titles = [
        "TOUCH",
        "ARTISAN",
        "SANTORINI",
    ]

    const CodProduBas = [
        "",
        "",
        ""
    ]

    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <body className=" bg-gradient-to-b-from">
                    <div className=" flex items-center justify-center h-full mt-[2%]">
                        <img src="https://cjmw.eu/ImagenesTelasCjmw/Iconos/LOGOBASSARI_01.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                    </div>
                </body>
                <NewCollection images={images} titles={titles} productCodes={CodProduBas} />
                <ColeccionesMarcas marca={marca}/>
                <Footer />
            </CartProvider>
        </>
    )
}
export default BassariHome