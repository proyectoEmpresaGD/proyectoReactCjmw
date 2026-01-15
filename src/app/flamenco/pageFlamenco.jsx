import { useState } from "react";
import { Header } from "../../components/header";
import Footer from "../../components/footer";
import Carrusel from "../../components/ComponentesHome/carrusel";
import NewCollection from "../../components/ComponentesBrands/cardNewCollection";
import { CartProvider } from "../../components/CartContext";
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas";
import CarruselColeccionesNuevas from "../../components/ComponentesBrands/carruselColecionesNuevas";
import CarruselProductosColeccionEspecifica from "../../components/ComponentesBrands/CarruselProductosColeccionEspecifica";
import PresentacionColeccion from "../../components/ComponentesBrands/ultimaColeccionTextoAnimado";
import Modal from "../../components/ComponentesProductos/modal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function FlamencoHome() {
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalAbierta, setModalAbierta] = useState(false);
    const { t } = useTranslation("pageFlamenco");
    const navigate = useNavigate();

    const handleCloseModal = () => {
        setModalAbierta(false);
        setProductoSeleccionado(null);
    };

    const handleProductClick = (producto) => {
        if (!producto) return;
        setProductoSeleccionado(producto);
        setModalAbierta(true);
    };

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const marca = "FLA";

    const images = [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/FLAMENCO/INDIENNE%20STRIPES/FLA_INDIENNE_STRIPES_34XX26%2B3MM_SANGRE_resultado_resultado.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/FLAMENCO/PALACIO%20DE%20LAS%20DUE%C3%91AS/FLA_PALCIO_DUENAS_LIBRO_34x34MM_3MM_SANGRE_resultado_resultado.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA001199-SEA-STRIPE-SPRING-GREEN.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA001218%20COLONIAL%20DAMASK%20SPRING%20GREEN_01%20.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA001248%20HAITI%20ESCARLET_3.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA001273%20%20%20%20VERACRUZ%20PORCELAIN%2003.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA_GRAZALEMA_BANNER_WEB_01.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA_MARRAKECH_AGDAL_OLIVE%20.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA_MARRAKECH_COMPOTELAS.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/02_AMBIENTES%20PARA%20CARRUSEL%20PRINCIPAL%20PAGINAS%20DE%20LAS%20MARCAS%20/FLAMENCO/FLA_MARRAKECH_KUTUBIA%20APRICOT.jpg",
    ];

    const imagesNewCollections = [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/RIVIERA/RIVIERA.jpeg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/TEDDY/DSC09692%20MINIATURA.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/FLAMENCO%20AMBIENTE/SISAL/Cover%20Front.jpg",
    ];

    const titles = ["GUANAHANI", "TEDDY", "SISAL"];
    const CodProduFla = ["FLA001206", "FLA001365", "FLA001088"];

    const slides = [
        {
            name: "INDIENNE STRIPES",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-6"
                >
                    <PresentacionColeccion
                        titulo={t("newCollections.indienne.title")}
                        imagenFondo={images[0]}
                        descripcion={t("newCollections.indienne.description")}
                    />
                    <CarruselProductosColeccionEspecifica
                        coleccion="INDIENNE STRIPES"
                        onProductClick={handleProductClick}
                    />
                </div>
            ),
        },
        {
            name: "PALACIO DE LAS DUEÑAS",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-6"
                >
                    <PresentacionColeccion
                        titulo={t("newCollections.palacio.title")}
                        imagenFondo={images[1]}
                        descripcion={t("newCollections.palacio.description")}

                    />
                    <CarruselProductosColeccionEspecifica
                        coleccion="PALACIO DE LAS DUEÑAS"
                        onProductClick={handleProductClick}
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

                <div className="flex items-center justify-center h-full pt-3">
                    <img
                        className="h-20 md:h-32 xl:h-40"
                        src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/Flamenco%20gris%20transparente%20NEGRO.png"
                        alt="Logo Flamenco"
                    />
                </div>

                <CarruselColeccionesNuevas slides={slides} durationMs={15000} />

                {productoSeleccionado && (
                    <Modal isOpen={modalAbierta} close={handleCloseModal} product={productoSeleccionado} />
                )}

                {/* <NewCollection images={imagesNewCollections} titles={titles} productCodes={CodProduFla} /> */}
                <section id="colecciones">
                    <ColeccionesMarcas marca={marca} />
                </section>
                <Footer />
            </CartProvider>
        </>
    );
}

export default FlamencoHome;
