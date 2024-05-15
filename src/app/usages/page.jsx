import { Header } from "../../components/header"
import Footer from "../../components/footer"
import CareUsages from "../../components/ComponentesUsages/usosCard"
import { CartProvider } from '../../components/CartContext';


function Usages() {

    return (
        <>
            <CartProvider >
                <Header />
                <CareUsages />
                <Footer />
            </CartProvider>
        </>
    )
}
export default Usages