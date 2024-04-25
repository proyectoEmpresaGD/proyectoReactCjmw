import { Header } from '../../components/header'
import Footer from '../../components/footer'
import Contacts from "../../components/contacts"
import GeocodingService from "../../components/map"


function Contacto() {
    return (
        <>
            <Header />
            <Contacts/>
            <GeocodingService />
            <Footer />
        </>
    )
}

export default Contacto


