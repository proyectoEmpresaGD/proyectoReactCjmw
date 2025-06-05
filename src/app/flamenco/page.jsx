import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas"
import NotificationPopup from "../../components/ComponentesBrands/NotificationPopup";

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
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/FLAMENCO/FLA001199-SEA-STRIPE-SPRING-GREEN.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/RIVIERA/FLA001218%20COLONIAL%20DAMASK%20SPRING%20GREEN_01%20.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/RIVIERA/FLA001248%20HAITI%20ESCARLET_3.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/RIVIERA/FLA001273%20%20%20%20VERACRUZ%20PORCELAIN_04.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/GRAZALEMA/FLA_GRAZALEMA_BANNER_WEB_01.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/MARRAKECH/FLA_MARRAKECH_AGDAL_OLIVE%20.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/MARRAKECH/FLA_MARRAKECH_COMPOTELAS.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/FLAMENCO%20AMBIENTE/MARRAKECH/FLA_MARRAKECH_KUTUBIA%20APRICOT.jpg"
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
        "FLA001088",
    ]

    const brochures = [
        {
            imageUrl:
                "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BRO_FLAMENCO.png",
            pdfUrl: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BROCHURE_FLAMENCO_WEB.pdf",
            title: "FLAMENCO",
            description: "El lugar donde el mestizaje de culturas inspira nuestras colecciones. Descúbrelas",
        },
        {
            imageUrl:
                "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BRO_RIVIERA.png",
            pdfUrl: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/FLA_RIVIERA_BROCHURE_OK.pdf",
            title: "RIVIERA",
            description: "Colores vibrantes y fibras naturales para viajar a la época colonial. Descúbrelas",
        },
    ];

    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <NotificationPopup brochures={brochures} />

                <div className="flex items-center justify-center h-full pt-3">
                    <img
                        className="h-20 md:h-32 xl:h-40"
                        src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Flamenco%20gris%20transparente%20NEGRO.png"
                        alt="Logo Flamenco"
                    />
                </div>
                <NewCollection images={imagesNewCollections} titles={titles} productCodes={CodProduFla} />
                <ColeccionesMarcas marca={marca} />
                <Footer />
            </CartProvider>
        </>
    )
}
export default FlamencoHome

