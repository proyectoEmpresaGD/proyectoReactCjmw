import { Header } from "../../components/header";
import Footer from '../../components/footer';
import { CartProvider } from '../../components/CartContext';

function About() {
    return (
        <>
            <CartProvider>
                <Header />
                {/* Gradiente en todo el cuerpo */}
                <div className="min-h-screen xl:pt-[4%] lg:pt-[8%] md:pt-[6%] sm:pt-[8%]  pt-[10%]" style={{ background: 'linear-gradient(to right, #ebdecf, #a78d6e)' }} >
                    <section className="py-20 lg:py-12 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                <div className="flex items-center justify-center lg:justify-start">
                                    <div className="max-w-lg border rounded-lg overflow-hidden">
                                        <img src="https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/1200%20FLAMENCO%20FOTOART/1200%20FLAMENCO%20BUCLE%2008.jpg" alt="Tu imagen" className="w-full h-auto" />
                                    </div>
                                </div>
                                <div className="lg:pl-10">
                                    <div className="text-center lg:text-left">
                                        <p className="text-sm font-semibold tracking-widest text-gray-800 uppercase">De un vistazo</p>
                                        <h2 className="mt-8 text-3xl font-bold leading-tight text-gray-800 sm:text-4xl lg:text-5xl lg:leading-tight">CJM: Transformando espacios con telas de calidad</h2>
                                        <p className="text-lg leading-relaxed text-[#000806] mt-6">CJM es responsable del negocio global de CJM, HARBOUR, ARENA y FLAMENCO, nuestras cuatro marcas de textiles decorativos. Fundada el 23 de noviembre de 2000 por la familia Caracuel Jiménez Marqués, la empresa se centra en el desarrollo, producción y venta de telas para mobiliario interior y exterior de uso doméstico o para el mercado contract. Además, la empresa aspira a ser líder en los campos del confort, la conectividad y el desarrollo de nuevas tecnologías que creen telas diseñadas para ser tanto inteligentes como ecológicas.</p>
                                        <p className="text-lg leading-relaxed text-[#000806] mt-6">En CJM, la fabricación y el diseño de telas de calidad van de la mano. Nuestras dos divisiones comerciales: la venta de telas a diseñadores para hogares residenciales y al mercado contract, están en constante expansión global, estando presentes en más de 30 países en cuatro continentes. Cumpliendo con los requisitos ecológicos, la sostenibilidad es importante para ambas divisiones comerciales.</p>
                                        <p className="text-lg leading-relaxed text-[#000806] mt-6">Para la empresa, ecología y sostenibilidad significa crear valor duradero para nuestros clientes, empleados y la sociedad en su conjunto. La base de la estrategia empresarial sostenible de CJM es la responsabilidad de la empresa respecto a los efectos en el medio ambiente en el desarrollo de sus telas e instalaciones decorativas. Buscamos la belleza natural mientras creamos telas de calidad inteligente.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección "Made in Spain" */}
                    <section className="py-20 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="text-[#000806] text-lg text-justify">
                                <div className="text-center font-semibold text-gray-600 text-lg my-10">Hecho en España</div>
                                <p className="mb-4 text-center">Desde Andalucía para el mundo</p>
                                <p className="mb-4">CJM WORLDWIDE LTD. diseña y fabrica todas sus telas y papeles pintados en España.</p>
                                <p className="mb-4">Nuestra filosofía de producción implica incluir a nuestros proveedores como un valor intrínseco de nuestra empresa y así obtener productos de alto valor cualitativo.</p>
                                <p className="mb-4">Por supuesto, como nuestro nombre indica, somos una empresa MUNDIAL y creemos en la integración de los pueblos y en la mezcla de culturas; por lo tanto, para obtener ideas y telas que evolucionen con el tiempo, tenemos proveedores de diferentes países que nos proporcionan savia constante.</p>
                                <p className="mb-4">Somos una empresa abierta y para el desarrollo de nuestras cuatro marcas recogemos la personalidad e influencias de cada cultura para cada nueva colección. Nos gusta la diferencia, nos gusta investigar y nos gusta caminar nuestro propio camino.</p>
                                <p>Cremos firmemente en la personalidad de CJMW, HARBOUR, ARENA y FLAMENCO. Creemos en el diseño y la innovación.</p>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end">
                                <div className="max-w-lg border rounded-lg overflow-hidden">
                                    <img src="https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/1200%20FLAMENCO%20FOTOART/1200%20FLAMENCO%20BORNEO.jpg" alt="Tu imagen" className="w-full h-auto" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección "Headquarters" */}
                    <section className="py-20 lg:py-12 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="flex items-center justify-center lg:justify-start">
                                <div className="max-w-lg border rounded-lg overflow-hidden">
                                    <img src="https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/1200%20FLAMENCO%20FOTOART/1200%20FLAMENCO%20ZAHARA%2001.jpg" alt="Tu imagen" className="w-full h-auto" />
                                </div>
                            </div>
                            <div className="text-[#000806] text-lg text-justify">
                                <div className="text-center font-semibold text-gray-600 text-lg my-10">Sede</div>
                                <p className="mb-4">Montilla - Córdoba - Andalucía - España</p>
                                <p className="mb-4">Nuestra empresa, a lo largo de su vida, ha desarrollado diferentes áreas de acción. Contamos con diferentes plataformas para alcanzar un proceso de fabricación y distribución estable.</p>
                                <p className="mb-4">La sede de CJMW se encuentra en Montilla, Córdoba, España, donde realizamos el diseño, el almacenamiento y la venta al por mayor de nuestras telas.</p>
                                <p className="mb-4">El proceso de fabricación se lleva a cabo aplicando estrategias de soluciones de gestión de la cadena de suministro. CJMW coordina a todos sus proveedores, externaliza sus operaciones logísticas y desarrolla sus propias creaciones dentro de la empresa.</p>
                                <p>Utilizar servicios externos facilita la entrega justo a tiempo y, por lo tanto, nuestro punto de venta oficial puede ofrecer un servicio inmediato al cliente final, convirtiéndose en una rama directa de nuestra empresa.</p>
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
