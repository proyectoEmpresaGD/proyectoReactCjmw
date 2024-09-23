import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas"

function CjmHome() {

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const images = [
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/CJMW/TOKIO%20Y%20SHIBULLA.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/CJMW/VERANDA%20EVERGREEN.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/CJMW/ROKKI%20PUMICE.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/CJMW/FIYI%20ALUMINIUM.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/CJMW/BOTANICAL%20KOMORI%20MAGNESIUM.jpg",
    ]

    const imagesNewCollections = [
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/COLONY/TONGA%20PUMICE.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/SET%20OF%20THREADS/ASIAN%20ROMANTICISM%20EVERGREEN%20(EDITAR).jpg",
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/CJM%20AMBIENTE/ROAD%20TO%20ASIA/BOTANICAL%20KOMORI%20ROYAL%20BLUE%2004.jpg",
    ]

    const titles = [
        "TONGA",
        "ASIAN ROMANTICISM",
        "BOTANICAL KOMORI"
    ]

    const CodProduCJM = [
        "CJM01750",
        "CJM01384",
        "CJM01395",
    ]

    const marca = 'CJM';


    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <body className=" bg-gradient-to-b-from">
                    <div className=" flex items-center justify-center h-full pt-3">
                        <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/CJM-new-transparente.svg" alt="" className=" lg:w-[20%] lg:h-[20%] w-[30%] h-[30%] max-w-full max-h-full " />
                    </div>
                </body>
                <NewCollection images={imagesNewCollections} titles={titles} productCodes={CodProduCJM} />
                <ColeccionesMarcas marca={marca} />
                <Footer />
            </CartProvider>
        </>
    )
}
export default CjmHome