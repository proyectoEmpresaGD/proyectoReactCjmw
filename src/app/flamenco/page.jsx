import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas"

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
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/GENESIS%20C01%20%20(3).jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/GENESIS%20DAMSON%20%20(2).jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/jarapa.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/LUMIERE.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/TULUM%20C01%20(2).jpg",
    ]

    const imagesNewCollections = [
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/1200%20FLAMENCO%20KUKULKAN.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/1200%20FLAMENCO%20PUMMERIN.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/1200%20FLAMENCO%20PERRAULT.jpg",
    ]
    const titles = [
        "KUKULKAN",
        "PUMMERIN",
        "PERRAULT",
    ]

    const CodProduFla = [
        "FLA00166",
        "CJM00392",
        "FLA00120"
    ]

    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <body className="">
                    <div className=" flex items-center justify-center h-full pt-3">
                        <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/logoFlamenco.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                    </div>
                
                <NewCollection images={imagesNewCollections} titles={titles} productCodes={CodProduFla} />
                <ColeccionesMarcas marca={marca} />
                </body>
                <Footer />
            </CartProvider>
        </>
    )
}
export default FlamencoHome