import { Header } from "../../components/header"
import Footer from "../../components/footer"
import CardProduct from "../../components/cardProduct"

function HarbourHome() {

    return (
        <>
            <Header />
            <body className=" bg-gradient-to-b-from">
                <div className=" flex items-center justify-center h-full">
                    <img src="/logoHarbour.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
                </div>
            </body>
            <CardProduct/>
            <Footer />
        </>
    )
}
export default HarbourHome