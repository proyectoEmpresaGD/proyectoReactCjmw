import React, { useState } from "react";
import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas"
import NotificationPopup from "../../components/ComponentesBrands/NotificationPopup";
import BloquesInformativos from "../../components/ComponentesBrands/TiposDestacados";
import PresentacionColeccion from "../../components/ComponentesBrands/ultimaColeccionTextoAnimado";
import PresentacionMarca from "../../components/ComponentesBrands/presentacionMarca"
import { useTranslation } from 'react-i18next';
import CarruselProductosColeccionEspecifica from "../../components/ComponentesBrands/CarruselProductosColeccionEspecifica";
import Modal from "../../components/ComponentesProductos/modal";
import CarruselColeccionesNuevas from "../../components/ComponentesBrands/carruselColecionesNuevas"

function ArenaHome() {
    const { t } = useTranslation('pageArena');
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [modalAbierta, setModalAbierta] = useState(false);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const marca = 'ARE';

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
    ]
    const brochures = [
        {
            imageUrl:
                "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/MINIATURA-BROUCHURE-ARENA-Y-HARBOUR-BOHEMIAN.jpg",
            pdfUrl: "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/ARN_HABITAT_VLC_25_25_BROUCHURE_2025_AAFF.pdf",
            title: "COSY",
            description: t('BrouchureBohemianArena'),
        },
        {
            imageUrl:
                "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/PORTADA_BRO_ARENA.png",
            pdfUrl: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/CAT_ARENA_PURITTY_CJM_23_OK.pdf",
            title: "PURITTY",
            description: t('BrouchurePuritty'),
        },

    ];

    // Slides del carrusel (pausa solo encima del contenido)
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
                            onProductClick={(p) => { setProductoSeleccionado(p); setModalAbierta(true); }}
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
                        onProductClick={(p) => { setProductoSeleccionado(p); setModalAbierta(true); }}
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
                        onProductClick={(p) => { setProductoSeleccionado(p); setModalAbierta(true); }}
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
                        onProductClick={(p) => { setProductoSeleccionado(p); setModalAbierta(true); }}
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
                        onProductClick={(p) => { setProductoSeleccionado(p); setModalAbierta(true); }}
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
                <NotificationPopup brochures={brochures} />
                {/* className=" bg-[#B5AFA4]" */}
                <div >
                    {/* <BloquesInformativos
                        titulo="Tipos mas destacados"
                        texto="Este es el texto de descripción que se mostrará centrado bajo el título."
                        bloques={datos}
                    /> */}
                    <CarruselColeccionesNuevas slides={slides} durationMs={15000} />
                    {/* <PresentacionMarca
                        titulo="ARENA"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/LEVANTINE(1)_9_11zon_5_11zon.webp"
                        descripcion="Una colección elegante, suave y atemporal que refleja la esencia de Arena y su conexión con la naturaleza. Explora todas las propuestas de la marca."
                    /> */}

                    {productoSeleccionado && (
                        <Modal
                            isOpen={modalAbierta}
                            close={() => setModalAbierta(false)}
                            product={productoSeleccionado}
                        />
                    )}
                    {/* <NewCollection images={imagesNewCollections} titles={titles} productCodes={CodProduAre} /> */}
                    <section id="colecciones">
                        <ColeccionesMarcas marca={marca} />
                    </section>
                </div>
                <Footer />
            </CartProvider>
        </>
    )
}
export default ArenaHome
