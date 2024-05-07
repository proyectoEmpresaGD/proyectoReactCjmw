import { Header } from "../../components/header"
import Footer from '../../components/footer'
import { Link } from "react-router-dom";
import { CartProvider } from '../../components/CartContext';
function Interiores() {
    return (
        <>
            <CartProvider>
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
                                    <img className="w-full mx-auto sm:max-w-xs lg:max-w-lg " src="dormitorio7.jpg" alt="" />
                                </Link>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Una selección de nuestros mejores dormitorios italianos.</h3>
                                <p className="mt-4 text-lg text-gray-700">Sumérgete en la elegancia y el confort de nuestros dormitorios italianos de lujo. Cada detalle de estos espacios está diseñado para brindarte una experiencia de descanso incomparable. Desde los muebles cuidadosamente seleccionados hasta los tejidos de alta calidad y los detalles decorativos exquisitos, nuestros dormitorios son un oasis de tranquilidad y sofisticación.</p>
                                <p className="mt-4 text-lg text-gray-700">Disfruta de la armonía entre el diseño moderno y la tradición italiana, creando un ambiente acogedor y relajante que invita al descanso y la serenidad. Con una atención meticulosa a la calidad y el estilo, nuestros dormitorios italianos de lujo ofrecen un refugio perfecto para renovar cuerpo y mente al final de cada día.</p>

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
                                <h3 className="text-lg font-semibold text-gray-900">Una selección de nuestros mejores salones italianos.</h3>
                                <p className="mt-4 text-lg text-gray-700">Descubre la elegancia y el encanto italiano en nuestros exclusivos salones de lujo. Sumérgete en un ambiente sofisticado y refinado, donde cada detalle ha sido cuidadosamente seleccionado para ofrecerte una experiencia excepcional.</p>
                                <p className="mt-4 text-lg text-gray-700">Desde la opulenta decoración hasta el impecable servicio, nuestros salones italianos te invitan a vivir momentos inolvidables en un entorno que refleja la pasión y la belleza de Italia. Disfruta de una exquisita gastronomía, una cuidada selección de vinos y un ambiente acogedor que te transportará a la esencia misma del estilo italiano.</p>
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
                                <h3 className="text-lg font-semibold text-gray-900">Una selección de nuestras mejores cocinas italianas.</h3>
                                <p className="mt-4 text-lg text-gray-700">Explora el refinamiento y la exquisitez de nuestras cocinas italianas de lujo. Sumérgete en un mundo de sabores auténticos y tradiciones culinarias centenarias. Nuestras cocinas, meticulosamente diseñadas con materiales de alta calidad y tecnología de vanguardia, te invitan a disfrutar de una experiencia gastronómica única.</p>
                                <p className="mt-4 text-lg text-gray-700">Desde los aromas tentadores hasta los platos exquisitamente presentados, cada detalle está cuidadosamente elaborado para deleitar tus sentidos y satisfacer tus más altas expectativas. Descubre el verdadero sabor de Italia en un ambiente elegante y acogedor que te transportará a las regiones más emblemáticas del país.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </CartProvider>
        </>
    )
}
export default Interiores