import { Header } from "../components/header";
import Footer from '../components/footer';

function About() {
    return (
        <>
            <Header />
            <section className="py-10 lg:py-0" style={{ background: 'linear-gradient(135deg, #CBD5E0, #81E6D9, #FDBA74, #A0AEC0)' }}>
                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid items-stretch grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="flex items-center justify-center py-10">
                            <div>
                                <p className="text-sm font-semibold tracking-widest text-[#4f4437] uppercase">En resumen</p>
                                <h2 className="mt-8 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl lg:leading-tight">CJM: Transformando Espacios con Telas de Calidad</h2>
                                <p className="text-lg leading-relaxed text-gray-800 mt-6">CJM es responsable del negocio global de CJM, HARBOUR, ARENA y FLAMENCO, nuestras cuatro marcas de textiles decorativos. Fundada el 23 de noviembre de 2000 por la familia Caracuel Jiménez Marqués, la empresa se centra en el desarrollo, producción y venta de telas para muebles tanto para interiores como para exteriores, utilizadas en hogares o para uso contractual. Además, la empresa aspira a ser líder en los campos del confort, la conectividad y el desarrollo de nueva tecnología que crea telas diseñadas para ser tanto inteligentes como ecológicas.</p>
                                <p className="text-lg leading-relaxed text-gray-800 mt-6">En CJM, la fabricación y el diseño de telas de calidad se unen. Nuestras dos divisiones comerciales: la venta de telas a diseñadores para hogares residenciales y al mercado contractual, se están expandiendo continuamente a nivel global, estando presentes en más de 30 países en cuatro continentes. Mientras cumplimos con los requisitos ecológicos, la sostenibilidad es importante para ambas divisiones comerciales.</p>
                                <p className="text-lg leading-relaxed text-gray-800 mt-6">Para la empresa, la ecología y la sostenibilidad significa crear un valor duradero para nuestros clientes, empleados y la sociedad en su conjunto. La base de la estrategia comercial sostenible de CJM es la responsabilidad de la empresa de los efectos sobre el medio ambiente en el desarrollo de sus telas e instalaciones decorativas. Buscamos la belleza natural mientras creamos telas de calidad inteligentes.</p>
                            </div>
                        </div>
                        <div className="flex justify-center py-10 lg:py-0">
                            <img className="h-auto w-full md:max-w-md rounded-lg border-4 border-gray-800" src="public\khloe-arledge-8Rz_RIyp5FM-unsplash.jpg" alt="Imagen" />
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default About;
