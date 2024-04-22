import { Header } from "../../components/header"
import Footer from "../../components/footer"
import CarruselFlamenco from "../../components/carruselFlamenco"
import NewCollection from "../../components/cardNewCollection"
import CardAllProducts from "../../components/cardAllProducts"
function FlamencoHome() {

    return (
        <>
            <Header />
            <CarruselFlamenco />
            <body className=" bg-gradient-to-b-from">
                <div className=" flex items-center justify-center h-full">
                    <img src="/logoFlamenco.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                </div>
            </body>
            <NewCollection />
            <CardAllProducts />
            <Footer />
        </>
    )
}
export default FlamencoHome