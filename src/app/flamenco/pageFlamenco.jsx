import { useMemo, useState, useCallback } from "react";
import { Header } from "../../components/header";
import Footer from "../../components/footer";
import Carrusel from "../../components/ComponentesHome/carrusel";
import { CartProvider } from "../../components/CartContext";
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas";
import CarruselColeccionesNuevas from "../../components/ComponentesBrands/carruselColecionesNuevas";
import CarruselProductosColeccionEspecifica from "../../components/ComponentesBrands/CarruselProductosColeccionEspecifica";
import PresentacionColeccion from "../../components/ComponentesBrands/ultimaColeccionTextoAnimado";
import Modal from "../../components/ComponentesProductos/modal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { imagenesColecciones } from "../../Constants/constants";
import { buildColeccionParams, getColeccionCover } from "../../Constants/coleccionesHelpers";
import { coleccionConfigByName } from "../../Constants/constants";
import InstagramFeed from "../../components/ComponentesBrands/instagramPost";
import usePageMeta from "../../utils/usePageMeta";

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

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const marca = "FLA";

    const buildColeccionUrl = (coleccion, params = {}) => {
        const sp = new URLSearchParams();

        if (params.introTop) sp.set("introTop", params.introTop);
        if (params.introBottom) sp.set("introBottom", params.introBottom);
        if (params.introBrouchure) sp.set("introBrouchure", params.introBrouchure);

        if (params.brochureImage) sp.set("brochureImage", params.brochureImage);
        if (params.brochurePdf) sp.set("brochurePdf", params.brochurePdf);
        if (params.heroImage) sp.set("heroImage", params.heroImage);

        if (Array.isArray(params.images) && params.images.length > 0) {
            sp.set("images", JSON.stringify(params.images));
        }

        const qs = sp.toString();
        return `/coleccion/${encodeURIComponent(coleccion)}${qs ? `?${qs}` : ""}`;
    };

    const goToColeccion = useCallback(
        (collectionName) => {
            navigate(`/coleccion/${encodeURIComponent(collectionName)}`);
        },
        [navigate]
    );

    const images = [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_2026_SALON%20DE%20LA%20GITANA%20MUSTARD_1.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_PINEDA_IBORY.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS%20Y%20INDIENNE%20STRIPES/CJM_FLAMENCO_JARDIN%20DE%20ACEITE%20_OLIVE_2.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/FLAMENCO/INDIENNE%20STRIPES/FLA_INDIENNE_STRIPES_34XX26%252B3MM_SANGRE_resultado.webp",
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

    usePageMeta({
        title: "Flamenco | CJM Group",
        description:
            "Flamenco presenta tejidos para cortinas y tapicería que combinan estilo y calidad. Linos, jacquards y chenillas en diseños clásicos y contemporáneos para realzar cada estancia.",
    });

    const slides = useMemo(
        () => [
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
                            imagenFondo={getColeccionCover({
                                collectionName: "INDIENNE STRIPES",
                                imagenesColecciones,
                                configByName: coleccionConfigByName,
                            })}
                            descripcion={t("newCollections.indienne.description")}
                            onDiscoverCollections={() => goToColeccion("INDIENNE STRIPES")}
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
                            imagenFondo={getColeccionCover({
                                collectionName: "PALACIO DE LAS DUEÑAS",
                                imagenesColecciones,
                                configByName: coleccionConfigByName,
                            })}
                            descripcion={t("newCollections.palacio.description")}
                            onDiscoverCollections={() => goToColeccion("PALACIO DE LAS DUEÑAS")}
                        />

                        <CarruselProductosColeccionEspecifica
                            coleccion="PALACIO DE LAS DUEÑAS"
                            onProductClick={handleProductClick}
                        />
                    </div>
                ),
            },
        ],
        [goToColeccion, t, handleProductClick]
    );

    return (
        <CartProvider>
            <Header />
            <Carrusel images={shuffleArray([...images])} />

            <div className="flex items-center justify-center h-full pt-3">
                <img
                    className="h-20 md:h-32 xl:h-40"
                    src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoFlamenco.png"
                    alt="Logo Flamenco"
                />
            </div>

            <CarruselColeccionesNuevas slides={slides} durationMs={15000} />

            {productoSeleccionado && (
                <Modal isOpen={modalAbierta} close={handleCloseModal} product={productoSeleccionado} />
            )}

            <section id="colecciones">
                <ColeccionesMarcas marca={marca} />
            </section>
            {/* <InstagramFeed brand="flamenco" className="mt-10" /> */}
            <Footer />
        </CartProvider>
    );
}

export default FlamencoHome;
