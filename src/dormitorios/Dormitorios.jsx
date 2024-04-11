import { Header } from "../components/header";
import Footer from "../components/footer";

function Dormitorios() {
    return (
        <>
            <Header />
            <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">Italia en casa</h1>

                <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600">Selección de muebles para las estancias de tu hogar</p>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-3 md:mt-16 lg:gap-x-12">
                <div>
                    <img className="w-full" src="dormitorio1.jpg" alt="" />
                </div>

                <div>
                    <img className="w-full" src="dormitorio2.jpg" alt="" />
                </div>

                <div>
                    <img className="w-full" src="dormitorio3.jpg" alt="" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-3 md:mt-16 lg:gap-x-12 mb-10">
                <div>
                    <img className="w-full" src="dormitorio4.jpg" alt="" />
                </div>

                <div>
                    <img className="w-full" src="dormitorio5.jpg" alt="" />
                </div>

                <div>
                    <img className="w-full" src="dormitorio6.jpg" alt="" />
                </div>
            </div>
            <Footer />
        </>
    )
}
export default Dormitorios