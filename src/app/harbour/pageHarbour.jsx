import { Header } from "../../components/header";
import { useEffect, useMemo, useState } from "react";
import Footer from "../../components/footer";
import Carrusel from "../../components/ComponentesHome/carrusel";
import { CartProvider } from "../../components/CartContext";
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas";
import { useTranslation } from "react-i18next";
import CarruselProductosColeccionEspecifica from "../../components/ComponentesBrands/CarruselProductosColeccionEspecifica";
import PresentacionColeccion from "../../components/ComponentesBrands/ultimaColeccionTextoAnimado";
import Modal from "../../components/ComponentesProductos/modal";
import usePageMeta from "../../utils/usePageMeta";
import BloquesInformativos from "../../components/ComponentesBrands/TiposDestacados";
import NuevasColeccionesGrid from "../../components/ComponentesBrands/nuevasColeccionesGrid";
import BrandGallery from "../../components/ComponentesBrands/BrandGallery";
import { useNavigate } from "react-router-dom";
import ModalProductosPorCodigos from "../../components/ComponentesBrands/ModalProductosPorCodigos";
import Reveal from "../../components/ComponentesBrands/Reveal";
import BrandRandomSelectionCarousel from "../../components/ComponentesBrands/BrandRandomSelectionCarousel";
import InstagramPromo from "../../components/ComponentesBrands/InstagramPromo";
import { cdnUrl } from "../../Constants/cdn";

// Normaliza: sin tildes/diacríticos, sin símbolos, MAYÚSCULAS (igual que ColeccionesMarcas)
const normalizeKey = (s) =>
    (s || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, "AND")
        .replace(/[^A-Za-z0-9]/g, "")
        .toUpperCase();

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

    const navigate = useNavigate();
    const { t } = useTranslation("pageHarbour");

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
    ];

    const marca = "HAR";

    const bloquesUso = [
        { nombre: "IGNIFUGO", imagen: images[0], filtros: { brand: marca, uso: "FR" } },
        { nombre: "IMO", imagen: images[4], filtros: { brand: marca, uso: "IMO" } },
        { nombre: "OUTDOOR", imagen: images[5], filtros: { brand: marca, uso: "OUTDOOR" } },
    ];

    // ✅ Fallback inicial (SIEMPRE tiene image)
    const [nuevasColecciones, setNuevasColecciones] = useState(() => [
        {
            name: "BOHEMIAN",
            image:
                "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/BOHEMIAN/HARB_AMB_BOHEMIAN_01%2035X35.jpg",
            description:
                t("newCollections.bohemian.description")
        },
        {
            name: "HUSKY",
            image:
                "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/HUSKY/DSC00225%20MINIATURA.jpg",
            description:
                t("newCollections.husky.description")
        },
        {
            name: "FUTURE",
            image:
                "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/FUTURE/DSC00231%20MINIATURA.jpg",
            description:
                t("newCollections.future.description")
        },
    ]);

    // ✅ Igual que ColeccionesMarcas: pedimos TODA la marca y mapeamos por normalizeKey
    useEffect(() => {
        const ac = new AbortController();

        const fetchBrand = async () => {
            try {
                const url = `${import.meta.env.VITE_API_BASE_URL}/api/collections/brand/${encodeURIComponent(marca)}`;
                const res = await fetch(url, { signal: ac.signal });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json(); // { marca, collections: { "BOHEMIAN": ["url1", ...], ... } }

                const byNormKey = {};
                for (const [nombreColeccion, arrUrls] of Object.entries(data.collections || {})) {
                    byNormKey[normalizeKey(nombreColeccion)] = Array.isArray(arrUrls) ? arrUrls : [];
                }

                setNuevasColecciones((prev) =>
                    prev.map((item) => {
                        const k = normalizeKey(item.name);
                        const lista = byNormKey[k] || [];
                        if (!lista.length) return item;

                        // cogemos la primera imagen (o aleatoria si quieres)
                        const pick = lista[0];
                        return { ...item, image: cdnUrl(pick) };
                    })
                );
            } catch (err) {
                if (err?.name === "AbortError") return;
                console.error("Error cargando brand collections HAR:", err);
                // No hacemos nada: quedan los fallbacks y el grid seguirá pintando
            }
        };

        fetchBrand();
        return () => ac.abort();
    }, [marca]);

    // slides (si lo reactivas)
    const slides = useMemo(
        () => [
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
                            imagenFondo={nuevasColecciones.find((c) => c.name === "BOHEMIAN")?.image}
                            descripcion="Takumi es una colección inspirada en la artesanía japonesa, con tejidos que evocan paciencia y detalle. Sus tonos suaves y colores únicos transforman tapicerías y cortinas en piezas armónicas y poéticas."
                        />
                        <CarruselProductosColeccionEspecifica
                            coleccion="BOHEMIAN"
                            onProductClick={(p) => {
                                setProductoSeleccionado(p);
                                setModalAbierta(true);
                            }}
                        />
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
                            imagenFondo={nuevasColecciones.find((c) => c.name === "HUSKY")?.image}
                            descripcion="Husky: Dentro de la línea Harbour presentamos Husky, diseñadas para no incendiarse ni propagar llamas, ofreciendo protección en entornos peligrosos. Ofrece un 100% de opacidad, su gama cromática resulta fácil de integrar en todo tipo de proyectos, ideal para espacios contract como hoteles y restaurantes. Una opción elegante y práctica sin duda."
                        />
                        <CarruselProductosColeccionEspecifica
                            coleccion="HUSKY"
                            onProductClick={(p) => {
                                setProductoSeleccionado(p);
                                setModalAbierta(true);
                            }}
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
                            imagenFondo={nuevasColecciones.find((c) => c.name === "FUTURE")?.image}
                            descripcion="Nuestro tejido Future está diseñado para adaptarse con precisión a formas esféricas, ofreciendo un acabado uniforme y de gran calidad. Combina resistencia, flexibilidad y versatilidad, lo que lo convierte en la opción ideal para proyectos que requieren un material innovador y de alto rendimiento."
                        />
                        <CarruselProductosColeccionEspecifica
                            coleccion="FUTURE"
                            onProductClick={(p) => {
                                setProductoSeleccionado(p);
                                setModalAbierta(true);
                            }}
                        />
                    </div>
                ),
            },
        ],
        [nuevasColecciones]
    );

    return (
        <>
            <CartProvider>
                <Header />

                <Carrusel images={shuffleArray([...images])} />

                <BloquesInformativos
                    titulo={t("tiposDestacados.title")}
                    bloques={bloquesUso}
                />

                {/* ✅ aquí ya llegarán (fallback inmediato + reemplazo por backend si existe) */}
                <NuevasColeccionesGrid items={nuevasColecciones} />

                <Reveal className="mt-10">
                    <BrandRandomSelectionCarousel
                        brandCode={marca}
                        brandName="HARBOUR"
                        onProductClick={(p) => {
                            setProductoSeleccionado(p);
                            setModalAbierta(true);
                        }}
                    />
                </Reveal>

                <BrandGallery
                    brandKey="harbour"
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
                    <Modal isOpen={modalAbierta} close={() => setModalAbierta(false)} product={productoSeleccionado} />
                )}

                <ColeccionesMarcas marca={marca} />

                {/* <InstagramPromo
                    className="mt-12 mb-12"
                    account="@harbourfabrics"
                    href="https://www.instagram.com/harbour_fabrics/"
                    imageUrl="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/HARBOUR%20AMBIENTE/CARIBBEAN%20PARTY/HAR01894%20CARIBBEAN%20PARTY%20ICE%20CREAM%20INDIGO_%20TEJIDO%20SUELO.webp"
                /> */}
                <Footer />
            </CartProvider>
        </>
    );
}

export default HarbourHome;