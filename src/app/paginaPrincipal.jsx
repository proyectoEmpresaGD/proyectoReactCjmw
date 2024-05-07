import Carrusel from "../components/ComponentesHome/carrusel"
import { Header } from "../components/header"
import Footer from "../components/footer"
import Works from "../components/ComponentesHome/pinesNoticias"
import Clients from "../components/ComponentesHome/clients"
import { CartProvider } from '../components/CartContext';

const images = [
    "showroom1.jpg",
    "showroom2.jpg",
    "4.jpg"
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