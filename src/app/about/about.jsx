import { Header } from "../../components/header";
import Footer from '../../components/footer';
import { CartProvider } from '../../components/CartContext';

function About() {
    return (
        <>
            <CartProvider>
                <Header />
                {/* Gradiente en todo el cuerpo */}
                <div className="min-h-screen xl:pt-[4%] lg:pt-[8%] md:pt-[6%] sm:pt-[8%] pt-[10%] bg-gradient-to-r from-[#ebdecf] to-[#a78d6e]">
                    {/* Sección "CJM: Transformando espacios con telas de calidad" */}
                    <section className="py-20 lg:py-12 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="flex items-center justify-center lg:justify-start">
                                    <div className="w-full max-w-lg border rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-transform duration-500">
                                        <img src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SET%20OF%20THREADS/ANNUM%20ANTHRACITE_8_11zon_1_11zon.webp" alt="Tu imagen" className="w-full h-auto object-cover" />
                                    </div>
                                </div>
                                <div className="lg:pl-10">
                                    <div className="text-center lg:text-left">
                                        <p className="text-sm font-semibold tracking-widest text-gray-800 uppercase mb-2">De un vistazo</p>
                                        <h2 className="text-center font-semibold text-gray-600 text-2xl mb-6">CJM: Transformando espacios con telas de calidad</h2>
                                        <p className="text-lg leading-relaxed text-gray-800 mt-6">CJM es responsable del negocio global de CJM, HARBOUR, ARENA y FLAMENCO, nuestras cuatro marcas de textiles decorativos. Fundada el 23 de noviembre de 2000 por la familia Caracuel Jiménez Marqués, la empresa se centra en el desarrollo, producción y venta de telas para mobiliario interior y exterior de uso doméstico o para el mercado contract.</p>
                                        <p className="text-lg leading-relaxed text-gray-800 mt-6">En CJM, la fabricación y el diseño de telas de calidad van de la mano. Nuestras dos divisiones comerciales están en constante expansión global, estando presentes en más de 30 países en cuatro continentes.</p>
                                        <p className="text-lg leading-relaxed text-gray-800 mt-6">Ecología y sostenibilidad significan crear valor duradero para nuestros clientes, empleados y la sociedad. La base de la estrategia empresarial sostenible de CJM es la responsabilidad respecto a los efectos en el medio ambiente en el desarrollo de sus telas e instalaciones decorativas.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección "Made in Spain" */}
                    <section className="py-20 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="text-gray-800 text-lg text-justify">
                                <div className="text-center font-semibold text-gray-600 text-2xl mb-6">Hecho en España</div>
                                <p className="mb-6 text-center">Desde Andalucía para el mundo</p>
                                <p className="mb-6">CJM WORLDWIDE LTD. diseña y fabrica todas sus telas y papeles pintados en España. Nuestra filosofía de producción implica incluir a nuestros proveedores como un valor intrínseco de nuestra empresa y así obtener productos de alto valor cualitativo.</p>
                                <p className="mb-6">Somos una empresa abierta y para el desarrollo de nuestras cuatro marcas recogemos la personalidad e influencias de cada cultura para cada nueva colección. Nos gusta la diferencia, investigar y caminar nuestro propio camino.</p>
                                <p>Cremos firmemente en el diseño y la innovación de CJMW, HARBOUR, ARENA y FLAMENCO.</p>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end">
                                <div className="w-full max-w-lg border rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-transform duration-500">
                                    <img src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/ATMOSPHERE/ATMOSPHERE%20MOSS_3_11zon_7_11zon.webp" alt="Hecho en España" className="w-full h-auto object-cover" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección "Headquarters" */}
                    <section className="py-20 lg:py-12 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="flex items-center justify-center lg:justify-start">
                                <div className="w-full max-w-lg border rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-transform duration-500">
                                    <img src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/JARAPA/Vani_Living_326_Brkt_Portrait%20copy_3_11zon_6_11zon.webp" alt="Headquarters" className="w-full h-auto object-cover" />
                                </div>
                            </div>
                            <div className="text-gray-800 text-lg text-justify">
                                <div className="text-center font-semibold text-gray-600 text-2xl mb-6">Sede</div>
                                <p className="mb-6">Nuestra sede se encuentra en Montilla, Córdoba, España, donde realizamos el diseño, almacenamiento y venta al por mayor de nuestras telas. Contamos con plataformas para un proceso de fabricación y distribución estable.</p>
                                <p className="mb-6">El proceso de fabricación se lleva a cabo aplicando estrategias de gestión de la cadena de suministro. CJMW coordina a todos sus proveedores, externaliza sus operaciones logísticas y desarrolla sus propias creaciones dentro de la empresa.</p>
                                <p>Utilizar servicios externos facilita la entrega justo a tiempo y nos permite ofrecer un servicio inmediato al cliente final, siendo nuestra plataforma de venta una extensión directa de nuestra empresa.</p>
                            </div>
                        </div>
                    </section>
                </div>
                <Footer />
            </CartProvider>
        </>
    );
}

export default About;
