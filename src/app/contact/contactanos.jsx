import { Header } from '../../components/header'
import Footer from '../../components/footer'
import Contacts from "../../components/ComponentesContact/contacts"
import { CartProvider } from '../../components/CartContext';

function Contacto() {
    return (
        <>
            <CartProvider>
                <Header />
                <Contacts />
                <Footer />
            </CartProvider>
        </>
    )
}

export default Contacto


