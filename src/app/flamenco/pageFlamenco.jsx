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
import BloquesInformativos from "../../components/ComponentesBrands/TiposDestacados";
import NuevasColeccionesGrid from "../../components/ComponentesBrands/nuevasColeccionesGrid";
import BrandGallery from "../../components/ComponentesBrands/BrandGallery";
import InstagramPromo from "../../components/ComponentesBrands/InstagramPromo";
import ModalProductosPorCodigos from "../../components/ComponentesBrands/ModalProductosPorCodigos";
import BrandRandomSelectionCarousel from "../../components/ComponentesBrands/BrandRandomSelectionCarousel";
import Reveal from "../../components/ComponentesBrands/Reveal";
function FlamencoHome() {
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalAbierta, setModalAbierta] = useState(false);
    const { t } = useTranslation("pageFlamenco");
    const navigate = useNavigate();
    const [codesModalOpen, setCodesModalOpen] = useState(false);
    const [codesModalCodes, setCodesModalCodes] = useState([]);
    const [codesModalTitle, setCodesModalTitle] = useState("Productos relacionados");

    const handleOpenProductsFromGallery = (codes, item) => {
        const list = (codes || []).filter(Boolean);
        if (!list.length) return;

        setCodesModalCodes(list);
        setCodesModalTitle(item?.title ? `Productos — ${item.title}` : "Productos relacionados");
        setCodesModalOpen(true);
    };
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

    usePageMeta({
        title: "Arena | CJM Group",
        description:
            "Arena fusiona elegancia y naturaleza en tejidos para cortinas y tapicería. Diseños contemporáneos inspirados en paisajes orgánicos que aportan sofisticación y armonía a cada espacio.",
    });

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

    const nuevasColecciones = [
        {
            name: "INDIENNE STRIPES",
            image:
                "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/FLAMENCO%20AMBIENTE/INDIENNE%20STRIPES/CJM_FLAMENCO_2026_INDIENNE%20OCEAN.webp",
            description: t("newCollections.indienne.description")
        },
        {
            name: "PALACIO DE LAS DUEÑAS",
            image:
                "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/FLAMENCO%20AMBIENTE/PALACIO%20DE%20DUE%C3%91AS/CJM_FLAMENCO_JARDIN%20DE%20ACEITE%20_OLIVE_2.webp",
            description: t("newCollections.palacio.description")
        },
    ];

    const marca = "FLA";

    const bloquesUso = [
        {
            nombre: "FLORALES",
            imagen: images[4],
            filtros: { brand: marca, fabricPattern: "FLORAL" },
        },
        {
            nombre: "RAYAS",
            imagen: images[0],
            filtros: { brand: marca, fabricPattern: "RAYAS" },
        },

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
            <div className="">
                <BloquesInformativos
                    titulo={t("tiposDestacados.title")}
                    bloques={bloquesUso}
                />
            </div>
            <NuevasColeccionesGrid items={nuevasColecciones} />

            {/* <div className="flex items-center justify-center h-full pt-3">
                <img
                    className="h-20 md:h-32 xl:h-40"
                    src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoFlamenco.png"
                    alt="Logo Flamenco"
                />
            </div> */}

            {/* <CarruselColeccionesNuevas slides={slides} durationMs={15000} /> */}

            <Reveal className="mt-10">
                <BrandRandomSelectionCarousel
                    brandCode={marca}
                    brandName="FLAMENCO"
                    onProductClick={(p) => {
                        setProductoSeleccionado(p);
                        setModalAbierta(true);
                    }}
                />
            </Reveal>

            {/* ✅ NUEVO (como Harbour): galería + modal por códigos */}
            <BrandGallery
                brandKey="flamenco"
                title={t("galeria.title")}
                texto={t("galeria.texto")}
                onOpenProducts={handleOpenProductsFromGallery}
            />

            <ModalProductosPorCodigos
                isOpen={codesModalOpen}
                onClose={() => setCodesModalOpen(false)}
                codes={codesModalCodes}
                apiUrl={import.meta.env.VITE_API_BASE_URL}
                title={codesModalTitle}
                onProductClick={(p) => {
                    setProductoSeleccionado(p);
                    setModalAbierta(true);
                }}
            />

            {productoSeleccionado && (
                <Modal
                    isOpen={modalAbierta}
                    close={() => setModalAbierta(false)}
                    product={productoSeleccionado}
                />
            )}

            <section id="colecciones">
                <ColeccionesMarcas marca={marca} />
            </section>

            {/* ✅ NUEVO (como Harbour): promo Instagram al final */}
            <InstagramPromo
                className="mt-12 mb-12"
                account="@flamencofabrics"
                href="https://www.instagram.com/flamencofabrics/"
                imageUrl="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/FLAMENCO%20AMBIENTE/GRAZALEMA/FLA_GRAZALEMA_ROCIODUSTYPINKYSALMON_02.webp"
            />
            <Footer />
        </CartProvider>
    );
}

export default FlamencoHome;
