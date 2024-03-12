import { Header } from "./header"
import Footer from './footer'
import { Link } from "react-router-dom";

function Interiores() {
    return (
        <>
            <Header />
            <section className="py-10 bg-white sm:py-16 lg:py-24">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">Italia en casa</h1>

                    <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600">Selección de muebles para las estancias de tu hogar</p>
                </div>
                <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8 mt-10">
                    <div className="mx-auto text-left md:max-w-lg lg:max-w-2xl md:text-center">
                        <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">
                            Dormitorio
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 mt-8 md:mt-20 gap-y-6 md:grid-cols-2 gap-x-10">
                        <div>
                            <Link to={"/Dormitorios"} title="" >
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg " src="dormitorio1.jpg" alt="" />
                            </Link>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Una seleccion de nuestros mejores dormitorios italianos.</h3>
                            <p className="mt-4 text-lg text-gray-700">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                            <p className="mt-4 text-lg text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                            <h3 className="mt-8 text-lg font-semibold text-gray-900">How do I do this without any investment?</h3>
                            <p className="mt-4 text-lg text-gray-700">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8 mt-10">
                    <div className="mx-auto text-left md:max-w-lg lg:max-w-2xl md:text-center">
                        <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">
                            Salón
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 mt-8 md:mt-20 gap-y-6 md:grid-cols-2 gap-x-10">
                        <div>
                        <Link to={"/salones"} title="" >
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg " src="salon7.jpg" alt="" />
                        </Link>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Una seleccion de nuestros mejores dormitorios italianos.</h3>
                            <p className="mt-4 text-lg text-gray-700">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                            <p className="mt-4 text-lg text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                            <h3 className="mt-8 text-lg font-semibold text-gray-900">How do I do this without any investment?</h3>
                            <p className="mt-4 text-lg text-gray-700">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                    </div>
                </div>
                <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="mx-auto text-left md:max-w-lg lg:max-w-2xl md:text-center mt-10">
                        <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">
                            Cocina
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 mt-8 md:mt-20 gap-y-6 md:grid-cols-2 gap-x-10 mb-10">
                        <div>
                        <Link to={"/cocinas"} title="" >
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg " src="cocina7.jpg" alt="" />
                        </Link>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Una seleccion de nuestros mejores dormitorios italianos.</h3>
                            <p className="mt-4 text-lg text-gray-700">Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.</p>
                            <p className="mt-4 text-lg text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                            <h3 className="mt-8 text-lg font-semibold text-gray-900">How do I do this without any investment?</h3>
                            <p className="mt-4 text-lg text-gray-700">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}
export default Interiores

{/* <section className="py-10 bg-white sm:py-16 lg:py-24">
<div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
    <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">Italia en casa</h1>

        <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600">Selección de muebles para las estancias de tu hogar</p>
    </div>
    <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">Dormitorios</h1>
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
    <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">Cocinas</h1>
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
    <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">Salon</h1>
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
</div>
</section> */}