import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas"
import NotificationPopup from "../../components/ComponentesBrands/NotificationPopup";


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const images = [
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01942%20CARIBBEAN%20PARTY%20JUNGLE%20INDIGO_%20SILLA%20PISCINA.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01946%20CARIBBEAN%20PARTY%20REEF%20INDIGO.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01933%20CARIBBEAN%20PARTY%20LONG%20BEACH%20INDIGO_%20TEJIDO%20RAYA%20ANCHA(1).jpg",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01937%20CARIBBEAN%20PARTY%20LONG%20BEACH%20BANANA_SILLA%20DERECHA.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01942%20CARIBBEAN%20PARTY%20JUNGLE%20INDIGO_%20CABECERO%20CARIBBEAN%20INDIGO.jpg",
]

const imagesCollection = [
    "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01946%20CARIBBEAN%20PARTY%20REEF%20INDIGO(1).jpg",
    "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01933%20CARIBBEAN%20PARTY%20LONG%20BEACH%20INDIGO.%20TEJIDO%20RAYA%20ANCHA.jpg",
    "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01942%20CARIBBEAN%20PARTY%20JUNGLE%20INDIGO.%20SILLA%20IZQUIERDAjpg.jpg",
]


const titles = [
    "REEF INDIGO",
    "LONG BEACH INDIGO",
    "JUNGLE INDIGO"
]

const CodProduHar = [
    "HAR01946",
    "HAR01933",
    "HAR01942"
]

const marca = 'HAR';

const brochures = [
    {
        imageUrl:
            "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BROCHURE_CARIBBEANPARTY.png",
        pdfUrl: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/HAR_CARIBBEAN_PARTY_BROUCHURE_SOLOTITULARES.pdf",
        title: "CARIBBEAN PARTY",
        description: "Colores vibrantes y fibras naturales para viajar a la época colonial. Descúbrelas",
    },
];


function HarbourHome() {

    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <NotificationPopup brochures={brochures} />
                <body className=" bg-gradient-to-b-from">
                    <div className=" flex items-center justify-center h-full pt-3">
                        <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/logoHarbour.png" alt="" className=" lg:w-[20%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                    </div>
                </body>
                <NewCollection images={imagesCollection} titles={titles} productCodes={CodProduHar} />
                <ColeccionesMarcas marca={marca} />
                <Footer />
            </CartProvider>
        </>
    )
}
export default HarbourHome