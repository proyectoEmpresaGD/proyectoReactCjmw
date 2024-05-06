import { Header } from '../../components/header'
import Footer from '../../components/footer'
import Contacts from "../../components/ComponentesContact/contacts"
import GeocodingService from "../../components/ComponentesContact/map"


function Contacto() {
    return (
        <>
            <Header />
            <Contacts />
            <GeocodingService />
            <Footer />
        </>
    )
}

export default Contacto


