import { Header } from "./header"
import Footer from "./footer"
import { Link } from "react-router-dom";

export function Tienda() {
    return (
        <>
            <Header />
            <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-end justify-between">
                        <div className="flex-1 text-center lg:text-left">
                            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Accesorios</h2>
                            <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600 lg:mx-0">Si desea alguno de nuestros productos, no dude en contactar o pedir cita para algo más personalizado</p>
                        </div>
                    </div>
                    <div className="max-w-3xl mx-auto text-center mt-14">
                        <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">Armarios</h1>

                        <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600">Lujo italiano en cada detalle: armarios exclusivos</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-3 md:mt-16 lg:gap-x-12">
                        <div>
                            <Link to={"/contacto"} title="">
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg" src="armario1.jpg" alt="" />
                            </Link>
                        </div>

                        <div>
                            <Link to={"/contacto"} title="">
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg" src="armario2.jpg" alt="" />
                            </Link>
                        </div>

                        <div>
                            <Link to={"/contacto"} title="">
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg" src="armario3.jpg" alt="" />
                            </Link>
                        </div>
                    </div>
                    <div className="max-w-3xl mx-auto text-center mt-14">
                        <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">Grifería</h1>

                        <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600">Grifería italiana: elegancia en cada gota</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-3 md:mt-16 lg:gap-x-12">
                        <div>
                            <Link to={"/contacto"} title="">
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg" src="griferia1.jpg" alt="" />
                            </Link>
                        </div>

                        <div>
                            <Link to={"/contacto"} title="">
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg" src="griferia2.jpg" alt="" />
                            </Link>
                        </div>

                        <div>
                            <Link to={"/contacto"} title="">
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg" src="griferia3.jpg" alt="" />
                            </Link>
                        </div>
                    </div>
                    <div className="max-w-3xl mx-auto text-center mt-14">
                        <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">Cortinas</h1>

                        <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600">Cortinas de lujo: la sofisticación italiana en cada pliegue</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-3 md:mt-16 lg:gap-x-12">
                        <div>
                            <Link to={"/contacto"} title="">
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg" src="cortina1.jpg" alt="" />
                            </Link>
                        </div>

                        <div>
                            <Link to={"/contacto"} title="">
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg" src="cortina2.jpg" alt="" />
                            </Link>
                        </div>

                        <div>
                            <Link to={"/contacto"} title="">
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg" src="cortina3.jpg" alt="" />
                            </Link>
                        </div>
                    </div>
                    <div className="max-w-3xl mx-auto text-center mt-14">
                        <h1 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl lg:leading-tight">Lámparas</h1>

                        <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600">Iluminación sublime: lámparas italianas que cautivan</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-3 md:mt-16 lg:gap-x-12">
                        <div>
                            <Link to={"/contacto"} title="">
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg" src="lampara1.jpg" alt="" />
                            </Link>
                        </div>

                        <div>
                            <Link to={"/contacto"} title="">
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg" src="lampara2.jpg" alt="" />
                            </Link>
                        </div>

                        <div>
                            <Link to={"/contacto"} title="">
                                <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg" src="lampara3.jpg" alt="" />
                            </Link>
                        </div>
                    </div>

                </div>
            </section>
            <Footer />
        </>
    )
}
export default Tienda