import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas"
import NotificationPopup from "../../components/ComponentesBrands/NotificationPopup";
import { useTranslation } from 'react-i18next';

function FlamencoHome() {
    const { t } = useTranslation('pageFlamenco');
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const marca = 'FLA';

    const images = [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA001199-SEA-STRIPE-SPRING-GREEN.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA001218%20COLONIAL%20DAMASK%20SPRING%20GREEN_01%20.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA001248%20HAITI%20ESCARLET_3.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA001273%20%20%20%20VERACRUZ%20PORCELAIN%2003.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA_GRAZALEMA_BANNER_WEB_01.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA_MARRAKECH_AGDAL_OLIVE%20.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA_MARRAKECH_COMPOTELAS.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA_MARRAKECH_KUTUBIA%20APRICOT.jpg"
    ]

    const imagesNewCollections = [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/RIVIERA/RIVIERA.jpeg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/TEDDY/DSC09692%20MINIATURA.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/SISAL/Cover%20Front.jpg",
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
            description: t('BrouchureFlamenco'),
        },
        {
            imageUrl:
                "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BRO_RIVIERA.png",
            pdfUrl: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/FLA_RIVIERA_BROCHURE_OK.pdf",
            title: "RIVIERA",
            description: t('BrouchureRiviera'),
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

