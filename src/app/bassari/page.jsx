import { useEffect, useState } from "react";
import { Header } from "../../components/header";
import Footer from "../../components/footer";
import Carrusel from "../../components/ComponentesHome/carrusel";
import NewCollection from "../../components/ComponentesBrands/cardNewCollection";
import { CartProvider } from '../../components/CartContext';
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas";
import NotificationPopup from "../../components/ComponentesBrands/NotificationPopup";

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
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/BASSARI/BASSARI%20KASSUMAY%20IWOL%20ARGILE%20(COLCHA)%20WOLOF%20SAVANE%20(CORTINA)%20LOMPOUL%20ARGILE%20(COJINES%20TRASEROS)%20KAOLACK%20ARGILE(COJINES%20DELANTEROS)_35_11zon_13_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/BASSARI/BASSARI%20KASSUMAY%20YEMBE%20_17_11zon_32_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/BASSARI/BASSARI%20UNIVERS%20MARTIEN%20SAUGE%20ET%20VERT%20EMPIRE_34_11zon_8_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/BASSARI/BASSARI%20TRIBAL%20INDEFELO%20LA%20MER%20_29_11zon_3_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/BASSARI/BASSARI%20TRIBAL%20DANDE%20ARGILE%20(COJ%C3%8DN%20PEQUE%C3%91O)_27_1.webp",
    ];

    const imagesNewCollections = [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/TRIBAL/BASSARI%20TRIBAL%20BEDICK%20VERT%20(CORTINA)_4_11zon_9_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/UNIVERS/BASSARI%20UNIVERS%20MARTIEN%20SAUGE%20ET%20VERT%20EMPIRE_11zon_11zon_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/BASSARI%20AMBIENTE/KASSUMAY/BASSARI%20KASSUMAY%20KARABANE%20ARGILE%20II_5_11zon_12_11zon.webp",
    ];

    const titles = ["BEDICK", "ASTEROIDE", "KARABANE"];
    const CodProduBas = ["BAS00058", "BAS00241", "BAS00128"];

    const brochures = [
        {
            imageUrl:
                "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BRO_BASSARI.jpg",
            pdfUrl:
                "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BROCHURE_BASS_EDICION_INTERGIF_25_OK.pdf",
            title: "AFRICAN SOUL",
            description:
                "Un viaje al lugar más remoto del Senegal inspira estas colecciones. Descúbrelas.",
        },
    ];

    const videoDesktop = "https://bassari.eu/VIDEOS%20CARRUSEL%20MARCAS/BASSARI/BASS_PORTADAS_REELS-06.mp4";
    const videoMobile = "https://bassari.eu/VIDEOS%20CARRUSEL%20MARCAS/BASSARI/MOVIL/BASS_POST_11.mp4";

    const [videoIntro, setVideoIntro] = useState(videoDesktop);

    useEffect(() => {
        if (typeof window !== "undefined" && window.innerWidth <= 768) {
            setVideoIntro(videoMobile);
        }
    }, []);

    return (
        <CartProvider>
            <Header />
            <Carrusel images={shuffleArray([...images])} videoSrc={videoIntro} />
            <NotificationPopup brochures={brochures} />
            <div className="flex items-center justify-center h-full mt-[2%]">
                <img
                    src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGO%20BASSARI%20negro.png"
                    alt=""
                    className="lg:w-[20%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full"
                />
            </div>
            <NewCollection images={imagesNewCollections} titles={titles} productCodes={CodProduBas} />
            <ColeccionesMarcas marca={marca} />
            <Footer />
        </CartProvider>
    );
}

export default BassariHome;
