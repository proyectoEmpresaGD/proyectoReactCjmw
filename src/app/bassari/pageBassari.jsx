import { useState, useMemo, useCallback } from "react";
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
import { coleccionConfigByName } from "../../Constants/constants";

const normalizeColeccionName = (name) => String(name || "").trim().toUpperCase();

function BassariHome() {
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalAbierta, setModalAbierta] = useState(false);
    const { t } = useTranslation("pageBassari");
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

    const marca = "BAS";

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

    // =========================
    // Builder único de params (state->query)
    // =========================
    const buildColeccionParams = useCallback(
        (collectionName) => {
            const key = normalizeColeccionName(collectionName);
            const cfg = coleccionConfigByName[key];
            if (!cfg) return null;

            const imgs = imagenesColecciones?.[cfg.imagesKey] || [];
            const heroImage = imgs?.[cfg.heroIndex] || null;
            const brochureImage = imgs?.[cfg.brochureImageIndex] || null;

            return {
                introTop: t(cfg.introTopKey),
                introBottom: t(cfg.introBottomKey),
                introBrouchure: t(cfg.introBrouchureKey),
                heroImage,
                images: imgs,
                brochureImage,
                brochurePdf: cfg.brochurePdf,
            };
        },
        [t]
    );

    const goToColeccion = useCallback(
        (collectionName) => {
            navigate(`/coleccion/${encodeURIComponent(collectionName)}`);
        },
        [navigate]
    );



    const images = [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASS_ESSENCESDUNIL_ANCESTRAL3.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/BASSA_ESSENCESDUNIL_YUBA4.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASS_ESSENCESDUNIL_LEVOYAGEDESWOLOFS%20LA%20CROIX.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASS_ESSENCESDUNIL_YUBA1.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASSARI%20LE%20VOYAGE%20DES%20WOLOF%20ZOSER%202.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/BASSARI%20AMBIENTE/ESSENCES%20DU%20NIL/CJM_BASSARI_2026-1-2_DETALLE%20ESSENCES%20DU%20NIL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/BASSARI/LE%20VOYAGE%20DES%20WOLOF%20/BASS_LIBRO_LEVOYAGEDESWOLOFS_34X34%2B3MM_SANGRE_resultado%20(1)_resultado.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/07_IMAGENES%20PAGINA%20COLECCIONES%20NUEVAS%20/BASSARI/ESSENCES%20DU%20NIL/BASS_LIBRO_ESSENCES_DU_NIL_44X44%2B3MM_SANGRE_resultado_resultado.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/BASSARI/BASSARI%20KASSUMAY%20IWOL%20ARGILE%20(COLCHA)%20WOLOF%20SAVANE%20(CORTINA)%20LOMPOUL%20ARGILE%20(COJINES%20TRASEROS)%20KAOLACK%20ARGILE(COJINES%20DELANTEROS)_35_11zon_13_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/BASSARI/BASSARI%20KASSUMAY%20YEMBE%20_17_11zon_32_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/BASSARI/BASSARI%20UNIVERS%20MARTIEN%20SAUGE%20ET%20VERT%20EMPIRE_34_11zon_8_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/BASSARI/BASSARI%20TRIBAL%20INDEFELO%20LA%20MER%20_29_11zon_3_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/BASSARI/BASSARI%20TRIBAL%20DANDE%20ARGILE%20(COJ%C3%8DN%20PEQUE%C3%91O)_27_1.webp",
    ];

    // Helpers para obtener imagen de fondo de la colección (sin repetir)
    const getColeccionCover = useCallback((collectionName) => {
        const key = normalizeColeccionName(collectionName);
        const cfg = coleccionConfigByName[key];
        if (!cfg) return null;
        const imgs = imagenesColecciones?.[cfg.imagesKey] || [];
        return imgs?.[cfg.heroIndex] || null;
    }, []);

    const slides = useMemo(
        () => [
            {
                name: "LE VOYAGE DES WOLOF",
                render: () => (
                    <div
                        onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                        onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                        className="grid grid-cols-1 gap-6"
                    >
                        <PresentacionColeccion
                            titulo={t("newCollections.voyage.title")}
                            imagenFondo={getColeccionCover("LE VOYAGE DES WOLOF")}
                            descripcion={t("newCollections.voyage.description")}
                            onDiscoverCollections={() => goToColeccion("LE VOYAGE DES WOLOF")}
                        />
                        <CarruselProductosColeccionEspecifica
                            coleccion="LE VOYAGE DES WOLOF"
                            onProductClick={handleProductClick}
                        />
                    </div>
                ),
            },
            {
                name: "ESSENCES DU NIL",
                render: () => (
                    <div
                        onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                        onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                        className="grid grid-cols-1 gap-6"
                    >
                        <PresentacionColeccion
                            titulo={t("newCollections.essences.title")}
                            imagenFondo={getColeccionCover("ESSENCES DU NIL")}
                            descripcion={t("newCollections.essences.description")}
                            onDiscoverCollections={() => goToColeccion("ESSENCES DU NIL")}
                        />
                        <CarruselProductosColeccionEspecifica
                            coleccion="ESSENCES DU NIL"
                            onProductClick={handleProductClick}
                        />
                    </div>
                ),
            },
        ],
        [t, getColeccionCover, goToColeccion]
    );

    return (
        <CartProvider>
            <Header />

            <Carrusel images={shuffleArray([...images])} />

            <div className="flex items-center justify-center h-full mt-[2%]">
                <img
                    src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGO%20BASSARI%20negro.png"
                    alt=""
                    className="lg:w-[20%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full"
                />
            </div>

            <CarruselColeccionesNuevas slides={slides} durationMs={15000} />

            {productoSeleccionado && (
                <Modal isOpen={modalAbierta} close={handleCloseModal} product={productoSeleccionado} />
            )}

            <section id="colecciones">
                <ColeccionesMarcas marca={marca} />
            </section>

            <Footer />
        </CartProvider>
    );
}

export default BassariHome;
