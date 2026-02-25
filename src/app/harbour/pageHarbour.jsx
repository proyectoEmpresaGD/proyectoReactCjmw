import { Header } from "../../components/header"
import { useState } from "react";
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import { CartProvider } from '../../components/CartContext';
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas"
import { useTranslation } from 'react-i18next';
import CarruselColeccionesNuevas from "../../components/ComponentesBrands/carruselColecionesNuevas"
import CarruselProductosColeccionEspecifica from "../../components/ComponentesBrands/CarruselProductosColeccionEspecifica";
import PresentacionColeccion from "../../components/ComponentesBrands/ultimaColeccionTextoAnimado";
import Modal from "../../components/ComponentesProductos/modal";
import usePageMeta from "../../utils/usePageMeta";

function HarbourHome() {
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalAbierta, setModalAbierta] = useState(false);
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    usePageMeta({
        title: "Harbour | CJM Group",
        description:
            "Harbour presenta tejidos para cortinas y tapicería que combinan diseño y calidad. Linos, jacquards y chenillas en estilos clásicos y contemporáneos para aportar elegancia y carácter a cada espacio.",
    });

    const images = [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/HARBOUR/HARB_AMB_BOHEMIAN_01CARROUSEL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/HARBOUR/HARB_AMB_BOHEMIAN_06CARROUSEL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/HARBOUR/HARB_BOHEMIAN_03CARROUSEL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/HARBOUR/HARB_AMB_BOHEMIAN_07CARROUSEL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01942%20CARIBBEAN%20PARTY%20JUNGLE%20INDIGO_%20SILLA%20PISCINA.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01946%20CARIBBEAN%20PARTY%20REEF%20INDIGO.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01933%20CARIBBEAN%20PARTY%20LONG%20BEACH%20INDIGO_%20TEJIDO%20RAYA%20ANCHA(1).jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01937%20CARIBBEAN%20PARTY%20LONG%20BEACH%20BANANA_SILLA%20DERECHA.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01942%20CARIBBEAN%20PARTY%20JUNGLE%20INDIGO_%20CABECERO%20CARIBBEAN%20INDIGO.jpg",
    ]

    const marca = 'HAR';
    const { t } = useTranslation('pageHarbour');
    // const brochures = [
    //     {
    //         imageUrl:
    //             "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BROCHURE_COSY_ARENA_HARBOUR.jpg",
    //         pdfUrl: "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/ARN_HABITAT_VLC_25_25_BROUCHURE_2025_AAFF.pdf",
    //         title: "BOHEMIAN",
    //         description: t('BrouchureBohemianHarbour'),
    //     },
    //     {
    //         imageUrl:
    //             "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BROCHURE_CARIBBEANPARTY.png",
    //         pdfUrl: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/HAR_CARIBBEAN_PARTY_BROUCHURE_SOLOTITULARES.pdf",
    //         title: "CARIBBEAN PARTY",
    //         description: t('BrouchureHarbour'),
    //     },

    // ];

    const slides = [
        {
            name: "BOHEMIAN",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-2"
                >
                    <PresentacionColeccion
                        titulo="NEW COLLECTION BOHEMIAN"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/BOHEMIAN/HARB_AMB_BOHEMIAN_01%2035X35.jpg"
                        descripcion="Takumi es una colección inspirada en la artesanía japonesa, con tejidos que evocan paciencia y detalle. Sus tonos suaves y colores únicos transforman tapicerías y cortinas en piezas armónicas y poéticas."

                    />
                    <div className="">
                        <CarruselProductosColeccionEspecifica
                            coleccion="BOHEMIAN"
                            onProductClick={(p) => { setProductoSeleccionado(p); setModalAbierta(true); }}
                        />
                    </div>
                </div>
            ),
        },
        {
            name: "HUSKY",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-6"
                >
                    <PresentacionColeccion
                        titulo="NEW COLLECTION HUSKY"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/HUSKY/DSC00225%20MINIATURA.jpg"
                        descripcion="Husky: Dentro de la línea Harbour presentamos Husky, diseñadas para no incendiarse ni propagar llamas, ofreciendo protección en entornos peligrosos. Ofrece un 100% de opacidad, su gama cromática resulta fácil de integrar en todo tipo de proyectos, ideal para espacios contract como hoteles y restaurantes. Una opción elegante y práctica sin duda."
                    />
                    <CarruselProductosColeccionEspecifica
                        coleccion="HUSKY"
                        onProductClick={(p) => { setProductoSeleccionado(p); setModalAbierta(true); }}
                    />
                </div>
            ),
        },
        {
            name: "FUTURE",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-6"
                >
                    <PresentacionColeccion
                        titulo="NEW COLLECTION FUTURE"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/FUTURE/DSC00231%20MINIATURA.jpg"
                        descripcion="Nuestro tejido Future está diseñado para adaptarse con precisión a formas esféricas, ofreciendo un acabado uniforme y de gran calidad. Combina resistencia, flexibilidad y versatilidad, lo que lo convierte en la opción ideal para proyectos que requieren un material innovador y de alto rendimiento."
                    />
                    <CarruselProductosColeccionEspecifica
                        coleccion="FUTURE"
                        onProductClick={(p) => { setProductoSeleccionado(p); setModalAbierta(true); }}
                    />
                </div>
            ),
        },
    ];


    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                {/* <NotificationPopup brochures={brochures} /> */}
                {/* className=" bg-[#273A5C]" */}
                {/* <main>
                    <div className=" flex items-center justify-center h-full pt-3">
                        <img src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoHarbour.png" alt="" className=" lg:w-[20%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                    </div>
                    
                    <NewCollection images={imagesCollection} titles={titles} productCodes={CodProduHar} />
                    
                </main> */}
                <CarruselColeccionesNuevas slides={slides} durationMs={15000} />
                {productoSeleccionado && (
                    <Modal
                        isOpen={modalAbierta}
                        close={() => setModalAbierta(false)}
                        product={productoSeleccionado}
                    />
                )}
                <ColeccionesMarcas marca={marca} />
                <Footer />
            </CartProvider>
        </>
    )
}
export default HarbourHome