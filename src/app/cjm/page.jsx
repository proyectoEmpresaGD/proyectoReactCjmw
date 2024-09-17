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
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel3.webp",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel4.webp",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    ]

    const imagesNewCollections = [
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
        "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel3.webp",
    ]

    const titles = [
        "ArenaCarrusel1.webp",
        "ArenaCarrusel2.webp",
        "ArenaCarrusel3.webp"
    ]

    const marca = 'CJM';


    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <body className=" bg-gradient-to-b-from">
                    <div className=" flex items-center justify-center h-full mt-3">
                        <img src="https://cjmw.eu/ImagenesTelasCjmw/Iconos/CJM-new-transparente.svg" alt="" className=" lg:w-[20%] lg:h-[20%] w-[30%] h-[30%] max-w-full max-h-full " />
                    </div>
                </body>
                <NewCollection images={imagesNewCollections} titles={titles} />
                <ColeccionesMarcas marca={marca} />
                <Footer />
            </CartProvider>
        </>
    )
}
export default CjmHome