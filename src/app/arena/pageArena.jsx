import { useState } from "react";
import { Header } from "../../components/header";
import Footer from "../../components/footer";
import Carrusel from "../../components/ComponentesHome/carrusel";
import { CartProvider } from "../../components/CartContext";
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas";
import PresentacionColeccion from "../../components/ComponentesBrands/ultimaColeccionTextoAnimado";
import { useTranslation } from "react-i18next";
import CarruselProductosColeccionEspecifica from "../../components/ComponentesBrands/CarruselProductosColeccionEspecifica";
import Modal from "../../components/ComponentesProductos/modal";
import CarruselColeccionesNuevas from "../../components/ComponentesBrands/carruselColecionesNuevas";
import usePageMeta from "../../utils/usePageMeta";
import BloquesInformativos from "../../components/ComponentesBrands/TiposDestacados";
import NuevasColeccionesGrid from "../../components/ComponentesBrands/nuevasColeccionesGrid";
import BrandGallery from "../../components/ComponentesBrands/BrandGallery";
import ModalProductosPorCodigos from "../../components/ComponentesBrands/ModalProductosPorCodigos";
import Reveal from "../../components/ComponentesBrands/reveal";
import BrandRandomSelectionCarousel from "../../components/ComponentesBrands/BrandRandomSelectionCarousel";
import InstagramPromo from "../../components/ComponentesBrands/InstagramPromo";

function ArenaHome() {
    const { t } = useTranslation("pageArena");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalAbierta, setModalAbierta] = useState(false);

    // ✅ NUEVO (como Harbour) - modal de productos por códigos desde la galería
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

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    usePageMeta({
        title: "Arena | CJM Group",
        description:
            "Arena fusiona elegancia y naturaleza en tejidos para cortinas y tapicería. Diseños contemporáneos inspirados en paisajes orgánicos que aportan sofisticación y armonía a cada espacio.",
    });

    const images = [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/ARN_COSY_5CARROUSEL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/ARN_AMB_CRANE_05CARROUSEL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/ARN_AMB_NAGASAKI_02CARROUSEL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/_26A5230-2_OKCARROUSEL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/_26A5037-2_OKCARROUSEL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/ARN_AMB_BIANCALANI_01CARROUSEL.jpg",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/BARANDILLA%20web.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/KANNATURA%20WALLPAPER/lampara.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/KANNATURA%20WALLPAPER/KANNATURA%20WALLPAPER%202.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/KANNATURA%20WALLPAPER/KANNATURA%20WALLPAPER%20AND%20COSY.webp",
    ];

    const nuevasColecciones = [
        {
            name: "TAKUMI",
            image:
                "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ARENA%20AMBIENTE/TAKUMI/_26A5010-2-OK%20MINIATURA.jpg",
            description: t("newCollections.takumi.description")
        },
        {
            name: "LIGHTHOUSE",
            image:
                "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ARENA%20AMBIENTE/LIGHTHOUSE/_26A4907-2-OK%2035x35.jpg",
            description: t("newCollections.lighthouse.description")
        },
        {
            name: "MADAMA BUTTERFLY",
            image:
                "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ARENA%20AMBIENTE/MADAMA%20BUTTERFLY/ARN_AMB_FLORES_01%20MINIATURA.jpg",
            description: t("newCollections.madamaButterfly.description")
        },
    ];

    const marca = "ARE";

    const bloquesUso = [
        {
            nombre: "VISILLO",
            imagen: "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/ARENA%20AMBIENTE/PURITTY/BURLAP%20HEMP_8_11zon_4_11zon.webp",
            filtros: { brand: marca, fabricType: "VISILLO" },
        },
        {
            nombre: "RAFIA WALLCOVERING",
            imagen: "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/ARENA%20AMBIENTE/KANNATURA%20VOL%20II/AR_AMBIENTE_RAFIAS_YUKI.webp",
            filtros: { brand: marca, fabricPattern: "RAFIA" },
        },
    ];



    // Slides del carrusel (tu código intacto)
    const slides = [
        {
            name: "TAKUMI",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-2"
                >
                    <PresentacionColeccion
                        titulo="NEW COLLECTION TAKUMI"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ARENA%20AMBIENTE/TAKUMI/_26A5010-2-OK%20MINIATURA.jpg"
                        descripcion="Takumi es una colección inspirada en la artesanía japonesa, con tejidos que evocan paciencia y detalle. Sus tonos suaves y colores únicos transforman tapicerías y cortinas en piezas armónicas y poéticas."
                    />
                    <div className="">
                        <CarruselProductosColeccionEspecifica
                            coleccion="TAKUMI"
                            onProductClick={(p) => {
                                setProductoSeleccionado(p);
                                setModalAbierta(true);
                            }}
                        />
                    </div>
                </div>
            ),
        },
        {
            name: "LIGHTHOUSE",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-6"
                >
                    <PresentacionColeccion
                        titulo="NEW COLLECTION LIGHTHOUSE"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ARENA%20AMBIENTE/LIGHTHOUSE/_26A4907-2-OK%2035x35.jpg"
                        descripcion="Lighthouse explora la ligereza y transparencia de los visillos, con un aire orgánico y mediterráneo. Son tejidos que dejan pasar la luz de forma natural, creando ambientes acogedores en cualquier espacio, ya sea urbano, costero o de montaña."
                    />
                    <CarruselProductosColeccionEspecifica
                        coleccion="LIGHTHOUSE"
                        onProductClick={(p) => {
                            setProductoSeleccionado(p);
                            setModalAbierta(true);
                        }}
                    />
                </div>
            ),
        },
        {
            name: "MADAMA BUTTERFLY",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-6"
                >
                    <PresentacionColeccion
                        titulo="NEW COLLECTION MADAMA BUTTERFLY"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ARENA%20AMBIENTE/MADAMA%20BUTTERFLY/ARN_AMB_FLORES_01%20MINIATURA.jpg"
                        descripcion="Inspiradas en la ópera Madame Butterfly, estas colecciones unen tradición y emoción.
                        GEISHA: transmite delicadeza con tonos pastel que evocan calma y elegancia.
                        NAGASAKI: recrea paisajes japoneses en colores empolvados que reflejan nostalgia y serenidad.
                        Juntas crean espacios poéticos y equilibrados."
                    />
                    <CarruselProductosColeccionEspecifica
                        coleccion="MADAMA BUTTERFLY"
                        onProductClick={(p) => {
                            setProductoSeleccionado(p);
                            setModalAbierta(true);
                        }}
                    />
                </div>
            ),
        },
        {
            name: "CRANE",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-6"
                >
                    <PresentacionColeccion
                        titulo="NEW COLLECTION CRANE"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ARENA%20AMBIENTE/CRANE/ARN_AMB_CRANE_02%20MINIATURA.jpg"
                        descripcion="En Japón, la grulla simboliza fortuna y longevidad. De ahí nace Crane, un lino bordado que combina tradición y modernidad con un aire mediterráneo, vistiendo los espacios con elegancia y bienestar."
                    />
                    <CarruselProductosColeccionEspecifica
                        coleccion="CRANE"
                        onProductClick={(p) => {
                            setProductoSeleccionado(p);
                            setModalAbierta(true);
                        }}
                    />
                </div>
            ),
        },
        {
            name: "SOBOKUNA",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-6"
                >
                    <PresentacionColeccion
                        titulo="NEW COLLECTION SOBOKUNA"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ARENA%20AMBIENTE/SOBOKUNA/ARN_AMB_BIANCALANI_01%20MINIATURA.jpg"
                        descripcion="Una colección elegante, suave y atemporal que refleja la esencia de Arena y su conexión con la naturaleza.Explora todas las propuestas de la marca."
                    />
                    <CarruselProductosColeccionEspecifica
                        coleccion="SOBOKUNA"
                        onProductClick={(p) => {
                            setProductoSeleccionado(p);
                            setModalAbierta(true);
                        }}
                    />
                </div>
            ),
        },
        {
            name: "COSY",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-6"
                >
                    <PresentacionColeccion
                        titulo="NEW COLLECTION COSY"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ARENA%20AMBIENTE/COSY/ARN_COSY_5%20MINIATURA.jpg"
                        descripcion="Cosy es un terciopelo rústico con carácter contemporáneo y una amplia gama cromática, de tierras y arcillas a neutros y tonos empolvados. Versátil y elegante, aporta textura, calidez y modernidad a cualquier espacio."
                    />
                    <CarruselProductosColeccionEspecifica
                        coleccion="COSY"
                        onProductClick={(p) => {
                            setProductoSeleccionado(p);
                            setModalAbierta(true);
                        }}
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
                <div className="">
                    <BloquesInformativos
                        titulo={t("tiposDestacados.title")}
                        bloques={bloquesUso}
                    />
                </div>
                <NuevasColeccionesGrid items={nuevasColecciones} />

                <div>
                    {/* ✅ Tu carrusel de colecciones (igual que antes) */}
                    {/* <CarruselColeccionesNuevas slides={slides} durationMs={15000} /> */}

                    {/* ✅ NUEVO (como Harbour): carrusel 12 aleatorios + animación reveal */}
                    <Reveal className="mt-10">
                        <BrandRandomSelectionCarousel
                            brandCode={marca}
                            brandName="ARENA"
                            onProductClick={(p) => {
                                setProductoSeleccionado(p);
                                setModalAbierta(true);
                            }}
                        />
                    </Reveal>

                    {/* ✅ NUEVO (como Harbour): galería + modal por códigos */}
                    <BrandGallery
                        brandKey="arena"
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
                        account="@arenafabrics"
                        href="https://www.instagram.com/arenafabrics/"
                        imageUrl="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/ARENA%20AMBIENTE/COSY/ARN_COSY_5%20MINIATURA.webp"
                    />
                </div>

                <Footer />
            </CartProvider>
        </>
    );
}

export default ArenaHome;