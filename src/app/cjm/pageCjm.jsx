import { Header } from "../../components/header"
import { useMemo, useState, useCallback } from "react";
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas"
import usePageMeta from "../../utils/usePageMeta";
import BloquesInformativos from "../../components/ComponentesBrands/TiposDestacados";
import { useNavigate } from "react-router-dom";
import NuevasColeccionesGrid from "../../components/ComponentesBrands/nuevasColeccionesGrid";
import { useTranslation } from "react-i18next";
import BrandGallery from "../../components/ComponentesBrands/BrandGallery";
import Reveal from "../../components/ComponentesBrands/reveal";
import BrandRandomSelectionCarousel from "../../components/ComponentesBrands/BrandRandomSelectionCarousel";
import ModalProductosPorCodigos from "../../components/ComponentesBrands/ModalProductosPorCodigos";
import Modal from "../../components/ComponentesProductos/modal";

function CjmHome() {


    const { t } = useTranslation("pageCjm");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalAbierta, setModalAbierta] = useState(false);
    const navigate = useNavigate();
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

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

    const handleProductClick = (producto) => {
        if (!producto) return;
        setProductoSeleccionado(producto);
        setModalAbierta(true);
    };

    const goToColeccion = useCallback(
        (collectionName) => {
            navigate(`/coleccion/${encodeURIComponent(collectionName)}`);
        },
        [navigate]
    );

    usePageMeta({
        title: "CJM | CJM Group",
        description:
            "CJM presenta papeles decorativos con acabados premium y gran resistencia. Descubre también sus tejidos para cortinas y tapicería que aportan estilo y personalidad a cada espacio.",
    });



    const images = [
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/CJMW/TOKIO%20Y%20SHIBULLA.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/Carruseles/CJMW/TOKIO%20Y%20SHIBULLA%20ANTIGUA.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/edicion-salt-and-pepper.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/edicion-salt-and-pepper-2.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SALT%20AND%20PEPPER/edicion-salt-and-pepper-3.jpg"

    ]

    const nuevasColecciones = [
        {
            name: "TOKIO",
            image:
                "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/CJM%20AMBIENTE/TOKIO/TOKIO%20Y%20KIOTO.webp",
            description: t("newCollections.tokio.description")
        },
        {
            name: "COLONY WALLPAPER",
            image:
                "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/CJM%20AMBIENTE/COLONY%20WALLPAPER/Amb%20Colony%2007Miniatura.webp",
            description: t("newCollections.colony.description")
        },
    ];

    const marca = 'CJM';

    const bloquesUso = [
        {
            nombre: "PAPELES PINTADOS",
            imagen: "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/CJM%20AMBIENTE/COLONY%20WALLPAPER/Amb%20Colony%2001Miniatura.webp",
            filtros: { brand: marca, fabricType: "WALLPAPER" },
        },
        {
            nombre: "EASYCLEAN",
            imagen: "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/CJM%20AMBIENTE/VERANDA/VERANDA%20EMERALD%20F1.webp",
            filtros: { brand: marca, mantenimiento: "EASYCLEAN" },
        },

    ];



    return (
        <>
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
                <Reveal className="mt-10">
                    <BrandRandomSelectionCarousel
                        brandCode={marca}
                        brandName="CJM"
                        onProductClick={(p) => {
                            setProductoSeleccionado(p);
                            setModalAbierta(true);
                        }}
                    />
                </Reveal>

                {/* ✅ NUEVO (como Harbour): galería + modal por códigos */}
                <BrandGallery
                    brandKey="cjm"
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
                <Footer />
            </CartProvider>
        </>
    )
}
export default CjmHome