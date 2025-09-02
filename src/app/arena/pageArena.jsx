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
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/BARANDILLA%20web.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/JEWEL/JEWEL%20NORDIC%20BLUE%20web.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/KANNATURA%20WALLPAPER/KANNATURA%20WALLPAPER%201.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/KANNATURA%20WALLPAPER/KANNATURA%20WALLPAPER%202.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/KANNATURA%20WALLPAPER/KANNATURA%20WALLPAPER%20AND%20COSY.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MONTANA/MAKALU%20RAVEN%20%20web.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/MONTANA/OREGON%20CHFFON_16_11zon_11zon.webp"
    ]

    const imagesNewCollections = [
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/JEWEL/JEWEL%20DUCK%20EGG%204_2_11zon_1_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/MONTANA/NEBRASCA%20SAND%202_12_11zon_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/MONTANA/APACHE%20CHERRY%202_4_11zon_11zon.webp",
    ]

    const titles = [
        "JEWEL",
        "NEBRASCA",
        "APACHE",
    ]

    const datos = [
        {
            imagen: 'https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/ARTISAN%20WEAVES/ARTISAN_DETALLE_1_11zon_1_11zon.webp',
            nombre: 'CORTINAS',
            filtros: {
                brand: 'ARE',
                uso: 'CORTINA'
            }
        },
        {
            imagen: 'https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/KANNATURA%20VOL%20II/ARN_RAFIAS_AMBIENTE_THI.jpg',
            nombre: 'PAPELES',
            filtros: {
                brand: 'ARE',
                fabricType: 'WALLPAPER'
            }
        },
        {
            imagen: 'https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/PAPIRO/TERRA%20PORCELAIN_6_11zon_6_11zon.webp',
            nombre: 'VISILLOS',
            filtros: {
                brand: 'ARE',
                fabricType: 'VISILLO'
            }
        },
        {
            imagen: 'https://bassari.eu/ImagenesTelasCjmw/ImagenesAmbienteParaCarruselesWeb/ARENA%20AMBIENTE/PURITTY/BURLAP%202_7_11zon_3_11zon.webp',
            nombre: 'VISILLOS',
            filtros: {
                brand: 'ARE',
                fabricType: 'VISILLO'
            }
        }
    ];

    const CodProduAre = [
        "ARE01319",
        "ARE01607",
        "ARE01559",
    ]

    const brochures = [
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
            name: "KASSUMAY",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-2"
                >
                    <PresentacionColeccion
                        titulo="NEW COLECCTION KASSUMAY"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/LEVANTINE(1)_9_11zon_5_11zon.webp"
                        descripcion="Una colección elegante, suave y atemporal que refleja la esencia de Arena y su conexión con la naturaleza.Explora todas las propuestas de la marca."
                    />
                    <div className="">
                        <CarruselProductosColeccionEspecifica
                            coleccion="KASSUMAY"
                            onProductClick={(p) => { setProductoSeleccionado(p); setModalAbierta(true); }}
                        />
                    </div>
                </div>
            ),
        },
        {
            name: "DUNE",
            render: () => (
                <div
                    onMouseEnter={() => window.dispatchEvent(new CustomEvent("carousel-pause"))}
                    onMouseLeave={() => window.dispatchEvent(new CustomEvent("carousel-resume"))}
                    className="grid grid-cols-1 gap-6"
                >
                    <PresentacionColeccion
                        titulo="NEW COLECCTION DUNE"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/LEVANTINE(1)_9_11zon_5_11zon.webp"
                        descripcion="Una colección elegante, suave y atemporal que refleja la esencia de Arena y su conexión con la naturaleza.Explora todas las propuestas de la marca."
                    />
                    <CarruselProductosColeccionEspecifica
                        coleccion="DUNE"
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
                    />
                    <CarruselColeccionesNuevas slides={slides} durationMs={15000} />
                    <PresentacionMarca
                        titulo="ARENA"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/LEVANTINE(1)_9_11zon_5_11zon.webp"
                        descripcion="Una colección elegante, suave y atemporal que refleja la esencia de Arena y su conexión con la naturaleza. Explora todas las propuestas de la marca."
                    />

                    {productoSeleccionado && (
                        <Modal
                            isOpen={modalAbierta}
                            close={() => setModalAbierta(false)}
                            product={productoSeleccionado}
                        />
                    )} */}
                    <NewCollection images={imagesNewCollections} titles={titles} productCodes={CodProduAre} />
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
