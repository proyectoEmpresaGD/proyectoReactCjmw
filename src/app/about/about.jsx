import { Header } from "../../components/header";
import Footer from '../../components/footer';
import { CartProvider } from '../../components/CartContext';

function About() {
    return (
        <>

            <CartProvider>
                <Header />
                {/* Gradiente en todo el cuerpo */}
                <div className="min-h-screen" style={{ background: 'linear-gradient(to right, #ebdecf, #a78d6e)' }}>
                    <section className="py-20 lg:py-12 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                <div className="flex items-center justify-center lg:justify-start">
                                    <div className="max-w-lg border rounded-lg overflow-hidden">
                                        <img src="https://cjmw.eu/CarpetaPaginaWebCjmw/ImagenesAmbiente/1200%20FLAMENCO%20FOTOART/1200%20FLAMENCO%20BUCLE%2008.jpg" alt="Tu imagen" className="w-full h-auto" />
                                    </div>
                                </div>
                                <div className="lg:pl-10">
                                    <div className="text-center lg:text-left">
                                        <p className="text-sm font-semibold tracking-widest text-gray-800 uppercase">At a glance</p>
                                        <h2 className="mt-8 text-3xl font-bold leading-tight text-gray-800 sm:text-4xl lg:text-5xl lg:leading-tight">CJM: Transforming Spaces with Quality Fabrics</h2>
                                        <p className="text-lg leading-relaxed text-[#000806] mt-6">CJM is responsible for the global business of CJM, HARBOUR, ARENA and FLAMENCO, our four decorative textiles brands. Founded on November 23rd 2000 by the Caracuel Jiménez Marqués family, the company focuses on the development, production and sale of fabrics for furnishings indoors and outdoors used domestically or for contract use. In addition, the company aspires to be a leader in the fields of comfort, connectivity and development of new technology that creates fabrics that are designed to be both smart and ecological.</p>
                                        <p className="text-lg leading-relaxed text-[#000806] mt-6">At CJM, manufacturing and designing quality fabrics come together. Our two business divisions: The sale of fabrics to designers for residential homes and to the contract market, are continuously expanding globally, being present in more than 30 countries on four continents. Whilst complying with ecological requirements, sustainability is important to both business divisions.</p>
                                        <p className="text-lg leading-relaxed text-[#000806] mt-6">For the company, ecology and sustainability means creating lasting value for our customers, employees and society as a whole. The basis for CJM's sustainable business strategy is the company’s responsibility of the effects to the environment in the development of its fabrics and decorative installations. We look for natural beauty whilst creating smart quality fabrics.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección "Made in Spain" */}
                    <section className="py-20 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="text-[#000806] text-lg text-justify">
                                <div className="text-center font-semibold text-gray-600 text-lg my-10">Made in Spain</div>
                                <p className="mb-4 text-center">From Andalusia to the world</p>
                                <p className="mb-4">CJM WORLDWIDE LTD. designs and manufactures all its fabrics and wallpapers in Spain.</p>
                                <p className="mb-4">Our production philosophy involves including our suppliers as an intrinsic value of our company and thus obtaining products of high qualitative value.</p>
                                <p className="mb-4">Of course, as our name indicates, we are a WORLDWIDE company and we believe in the integration of peoples and in the mixture of cultures; therefore, to obtain ideas and fabrics that evolve over time, we have suppliers from different countries that provide us with constant sap.</p>
                                <p className="mb-4">We are an open company and for the development of our four brands we collect the personality and influences of each culture for each new collection. We like the difference, we like to investigate and we like to walk our own path.</p>
                                <p>We firmly believe in the personality of CJMW, HARBOUR, ARENA and FLAMENCO. We believe in design and innovation.</p>
                            </div>
                            <div className="flex items-center justify-center lg:justify-start">
                                <div className="max-w-lg border rounded-lg overflow-hidden">
                                    <img src="https://cjmw.eu/CarpetaPaginaWebCjmw/ImagenesAmbiente/1200%20FLAMENCO%20FOTOART/1200%20FLAMENCO%20BORNEO.jpg" alt="Tu imagen" className="w-full h-auto" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección "Headquarters" */}
                    <section className="py-20 lg:py-12 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="flex items-center justify-center lg:justify-start">
                                <div className="max-w-lg border rounded-lg overflow-hidden">
                                    <img src="https://cjmw.eu/CarpetaPaginaWebCjmw/ImagenesAmbiente/1200%20FLAMENCO%20FOTOART/1200%20FLAMENCO%20ZAHARA%2001.jpg" alt="Tu imagen" className="w-full h-auto" />
                                </div>
                            </div>
                            <div className="text-[#000806] text-lg text-justify">
                                <div className="text-center font-semibold text-gray-600 text-lg my-10">Headquarters</div>
                                <p className="mb-4">Montilla - Córdoba - Andalusia - Spain</p>
                                <p className="mb-4">Our company, along its life, has been developing different areas of action. We rely on different platforms to reach a stable manufacturing and distribution process.</p>
                                <p className="mb-4">CJMW headquarters is settled down in Montilla, Cordoba, Spain, where we do the design, the storage and the holdsale of our fabrics.</p>
                                <p className="mb-4">Manufacturing process is made applying strategies Supply Chain Management Solutions. CJMW coordinates all its suppliers, making its logistic operations out and developing its own creations inside of the company.</p>
                                <p>Using external servicies make easy the just-in-time delivery and therefore, our Official Selling Point can offer an immediate service to the final customer, becoming a straight branch of our enterprise.</p>
                            </div>
                        </div>
                    </section>

                    <Footer />

                </div>
            </CartProvider>
        </>
    );
}

export default About;
