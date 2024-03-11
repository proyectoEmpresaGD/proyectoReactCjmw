import { Header } from "./header"
import Footer from './footer'

function About() {

    return (
        <>
            <Header />
            <section className="py-10 bg-gray-800 lg:py-0">
                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid items-stretch grid-cols-1 lg:grid-cols-2 ">
                        <div className="h-full pr-12 lg:order-2 lg:mb-40 lg:mt-20 lg:ml-10 ">
                            <div className="relative h-full lg:h-auto  ">
                                <div className="absolute w-full h-full mb-12 overflow-hidden bg-gradient-to-r from-fuchsia-600 to-blue-600 top-12 left-12 xl:left-16 lg:top-0  lg:scale-y-100 lg:origin-top ">
                                    <img className="object-cover object-right w-full h-full scale-150" src="https://cdn.rareblocks.xyz/collection/celebration/images/content/2/lines.svg" alt="" />
                                </div>
                                <div className="relative lg:-top-12 h-full ">
                                    <img className=" mt-20" src="imagenAbout2.jpg" alt="" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-start py-10 mt-28 lg:order-1 sm:py-16 md:mt-20 sm:mt-10  lg:py-24 xl:py-24">
                            <div>
                                <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase">Dejanos ser tu guia en la busqueda de la perfección para tu hogar</p>
                                <h2 className="mt-8 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">Descrubre la esencia del lujo italiano</h2>
                                <p className="text-xl leading-relaxed text-gray-200 mt-9">Sumergete en el mundo de diseño de interiores de lujo con David Sánchez.
                                    Desde magestusosas piezas de mobiliraio hasta accesorios exquisitamente
                                    elaborados. </p>
                                <p className="mt-6 text-xl leading-relaxed text-gray-200">Nos dedicamos a ofrecer una experiencia de compra unica, donde cada artiuclo
                                    refleja la artesania incomparable y la pasión por el diseño que caracteriza
                                    a Italia.</p>
                                <p className="text-xl leading-relaxed text-gray-200 mt-9">Creemos que el hogar es más que un simple espacio; es un reflejo de estilo y
                                    sofisticación, desde clásicos atemporales hasta creaciones contemporáneas,
                                    cada pieza está meticulosamente diseñada para insipirar y elevar cualquier
                                    espacio interior. </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </>
    )
}
export default About;