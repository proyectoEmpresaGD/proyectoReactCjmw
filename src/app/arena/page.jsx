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
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/LEVANTINE(1)_5_11zon_4_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/ANTIBES%20RUBY%202_2_11zon_1_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/BLIZZARD%20SHELL_3_11zon_2_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/JEWEL%20BURNT%20ORANGE_4_11zon_3_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/MIKONOS%20LINEN%20(2)%20(2)%20(2)_1_11zon_5_11zon.webp",
    ]

    const imagesNewCollections = [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/GENESIS/GENESIS%20C43%20(2)_11_11zon_20_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/GENESIS/GENESIS%20DAMSON%20%20(2)_12_11zon_21_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/REVOLTOSO/TULUM%20C01%20(2)_27_11zon_22_11zon.webp",
    ]

    const titles = [
        "MIKONOS",
        "TOUCH",
        "CIRRUS",
    ]

    const CodProduAre = [
        "ARE01058",
        "ARE00192",
        "ARE00851",
    ]

    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <body className=" bg-gradient-to-r from-[#ebdecf] to-[#a78d6e] ">
                    <div className=" flex items-center justify-center h-full pt-3">
                        <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/logoArena.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
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