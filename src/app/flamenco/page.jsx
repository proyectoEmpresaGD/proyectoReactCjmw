import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import FlamencoColecciones from "../colecciones/flamencoColeccion"

function FlamencoHome() {

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const marca = 'FLA';

    const images = [
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/1200%20FLAMENCO%20KUKULKAN.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/1200%20FLAMENCO%20PUMMERIN.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/1200%20FLAMENCO%20PERRAULT.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/1200%20FLAMENCO%20TOPKAPI.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/1200%20FLAMENCO%20ZAHARA%2002.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/1200%20FLAMENCO%20MOREAU.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/1200%20FLAMENCO%20ZAHARA%2001.jpg",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/1200%20FLAMENCO%20AHURA.jpg",
    ]

    const titles = [
        "KUKULKAN",
        "PUMMERIN",
        "PERRAULT",
        "KUKULKAN",

    ]

    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <body className=" bg-gradient-to-b-from">
                    <div className=" flex items-center justify-center h-full">
                        <img src="https://cjmw.eu/ImagenesTelasCjmw/Iconos/logoFlamenco.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                    </div>
                </body>
                <NewCollection images={images} titles={titles} />
                <ColeccionesMarcas marca={marca} />
                <Footer />
            </CartProvider>
        </>
    )
}
export default FlamencoHome