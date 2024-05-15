import Carrusel from "../components/ComponentesHome/carrusel"
import { Header } from "../components/header"
import Footer from "../components/footer"
import Works from "../components/ComponentesHome/pinesNoticias"
import Clients from "../components/ComponentesHome/clients"
import { CartProvider } from '../components/CartContext';

const images = [
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel3.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel4.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel2.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/HARBOUR/HarbourCarrusel1.webp",
    "https://cjmw.eu/CarpetaPaginaWebCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",

]

function Home() {
    return (
        <>
            <CartProvider>
                <Header />
                <Carrusel images={images} />
                <Works />
                <Clients />
                <Footer />
            </CartProvider>
        </>
    )
}
export default Home