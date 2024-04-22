import { Header } from "../../components/header"
import Footer from "../../components/footer"
import Carrusel from "../../components/carrusel"
import NewCollection from "../../components/cardNewCollection"
import CardAllProducts from "../../components/cardAllProducts"


function HarbourHome() {

    return (
        <>
            <Header />
            <Carrusel />
            <body className=" bg-gradient-to-b-from">
                <div className=" flex items-center justify-center h-full">
                    <img src="/logoHarbour.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                </div>
            </body>
            <NewCollection />
            <CardAllProducts />
            <Footer />
        </>
    )
}
export default HarbourHome