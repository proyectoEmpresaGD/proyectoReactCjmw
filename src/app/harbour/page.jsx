import { Header } from "../../components/header"
import  Footer  from "../../components/footer"
import CarruselHarbour from "../../components/carruselHarbour"
function HarbourHome() {

    return (
        <>
            <Header/>
            <CarruselHarbour />
            <body>
            <div className= " flex items-center justify-center h-full">
                <img src="/logoHarbour.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full "/>
            </div>
            </body>
            <Footer/>
        </>
    )
}
export default HarbourHome