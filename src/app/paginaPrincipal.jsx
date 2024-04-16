import Carrusel from "../components/carrusel"
import { Header } from "../components/header"
import Footer from "../components/footer"
import Works from "../components/pinesNoticias"
import Clients from "../components/clients"

function Home() {
    return (
        <>
            <Header />
            <Carrusel />
            <Works />
            <Clients />
            <Footer />
        </>
    )
}
export default Home