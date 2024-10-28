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
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/FLAMENCO/GENESIS%20C01%20%20(3)_5_11zon_3_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/FLAMENCO/GENESIS%20DAMSON%20%20(2)_6_11zon_4_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/FLAMENCO/jarapa_7_11zon_5_11zon_1_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/FLAMENCO/LUMIERE_8_11zon_6_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/FLAMENCO/TULUM%20C01%20(2)_9_11zon_7_11zon.webp",
    ]

    const imagesNewCollections = [
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/RIVIERA/RIVIERA.jpeg",
        "https://bassari.eu/ImagenesTelasCjmw/IMAGENES_PRODUCTS/FLAMENCO/TEDDY/Artistica/FLA001365%20TEDDY%20RHINO%20ARTISTICA-1200.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/SISAL/Cover%20Front_4_11zon_5_11zon.webp",
    ]

    const titles = [
        "GUANAHANI",
        "TEDDY",
        "SISAL",
    ]

    const CodProduFla = [
        "FLA001206",
        "FLA001365",
        "FLA001088"
    ]

    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                    <div className=" flex items-center justify-center h-full pt-3">
                        <img className="h-20 md:h-32 xl:h-40" src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Flamenco%20gris%20transparente%20NEGRO.png" alt=""/>
                    </div>
                    <NewCollection images={imagesNewCollections} titles={titles} productCodes={CodProduFla} />
                    <ColeccionesMarcas marca={marca} />
                <Footer />
            </CartProvider>
        </>
    )
}
export default FlamencoHome