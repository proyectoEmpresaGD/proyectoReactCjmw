import { Header } from '../../components/header'
import Footer from '../../components/footer'


function FlamencoColecciones() {
    return (
        <>
            <Header />
            <div className=" flex items-center justify-center h-full">
                <img src="/logoFlamenco.png" alt="" className=" lg:w-[30%] lg:h-[20%] w-[40%] h-[30%] max-w-full max-h-full " />
            </div>
            <Footer />

        </>
    )
}

export default FlamencoColecciones