import { Header } from '../../components/header'
import Footer from '../../components/footer'
import Contacts from "../../components/ComponentesContact/contacts"
import GeocodingService from "../../components/ComponentesContact/map"
import { CartProvider } from '../../components/CartContext';

function Contacto() {
    return (
        <>
            <CartProvider>
                <Header />
                <Contacts />
                <GeocodingService />
                <Footer />
            </CartProvider>
        </>
    )
}

export default Contacto


