import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import ColeccionesMarcas from "../../components/colecciones/ColeccionesMarcas"
import NotificationPopup from "../../components/ComponentesBrands/NotificationPopup";
import BloquesInformativos from "../../components/ComponentesBrands/TiposDestacados";
import PresentacionColeccion from "../../components/ComponentesBrands/ultimaColeccionTextoAnimado";
import PresentacionMarca from "../../components/ComponentesBrands/UltimaColeccion"
import { useTranslation } from 'react-i18next';

function ArenaHome() {
    const { t } = useTranslation('pageArena');
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const marca = 'ARE';

    const images = [
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/LEVANTINE(1)_5_11zon_4_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/ANTIBES%20RUBY%202_2_11zon_1_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/BLIZZARD%20SHELL_3_11zon_2_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/JEWEL%20BURNT%20ORANGE_4_11zon_3_11zon.webp",
        "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_HOME/ARENA/MIKONOS%20LINEN%20(2)%20(2)%20(2)_1_11zon_5_11zon.webp",
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

    return (
        <>
            {/* bg-gradient-to-r from-[#ebdecf] to-[#a78d6e]*/}
            <CartProvider>
                <Header />
                <Carrusel images={shuffleArray([...images])} />
                <NotificationPopup brochures={brochures} />
                <div className="">
                    <div className=" flex items-center justify-center h-full pt-3">
                        <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/logoArena.png" alt="" className=" lg:w-[21%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                    </div>
                    {/* <BloquesInformativos
                        titulo="Tipos mas destacados"
                        texto="Este es el texto de descripción que se mostrará centrado bajo el título."
                        bloques={datos}
                    />
                    <PresentacionColeccion
                        titulo="NEW COLECCTION FARO"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/LEVANTINE(1)_9_11zon_5_11zon.webp"
                        descripcion="Una colección elegante, suave y atemporal que refleja la esencia de Arena y su conexión con la naturaleza. Explora todas las propuestas de la marca."
                    />
                    <h1>CARRUSEL PRODUCTOS NUEVA COLECCION</h1>
                    <PresentacionMarca

                        titulo="ARENA"
                        imagenFondo="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/PURITTY/LEVANTINE(1)_9_11zon_5_11zon.webp"
                        descripcion="Una colección elegante, suave y atemporal que refleja la esencia de Arena y su conexión con la naturaleza. Explora todas las propuestas de la marca."
                    /> */}
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