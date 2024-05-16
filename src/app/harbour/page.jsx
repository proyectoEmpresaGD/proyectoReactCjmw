import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/ComponentesHome/carrusel"
import NewCollection from "../../components/ComponentesBrands/cardNewCollection"
import { CartProvider } from '../../components/CartContext';
import CardProductBrand from "../../components/ComponentesProductos/cardProductBrand"
import { Link } from "react-router-dom";

const images = [
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel3.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel4.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/HARBOUR/HarbourCarrusel1.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/HARBOUR/HarbourCarrusel2.webp",
]

const imagesCollection = [
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/HARBOUR/HarbourCarrusel1.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel3.webp",
]


const titles = [
    "ARENA DUNE",
    "ARENA DUNE",
    "ArenaCarrusel2.webp",
    "ArenaCarrusel3.webp"
]

function HarbourHome() {

    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={images} />
                <body className=" bg-gradient-to-b-from">
                    <div className=" flex items-center justify-center h-full">
                        <Link to={"/harbourColecciones"} title="" >
                            <img src="/logoHarbour.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                        </Link>
                    </div>
                </body>
                <NewCollection images={imagesCollection} titles={titles} />
                <CardProductBrand brand="HAR" />
                <Footer />
            </CartProvider>
        </>
    )
}
export default HarbourHome