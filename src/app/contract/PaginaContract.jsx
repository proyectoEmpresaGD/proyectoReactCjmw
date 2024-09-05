import { Header } from "../../components/header";
import { CartProvider } from '../../components/CartContext';

function Contract() {
    return (
        <>
            <CartProvider>
                <Header />
                <div className="min-h-screen bg-black text-white" style={{ background: 'linear-gradient(to right, #110586, ##000080)' }}>
                    <div className=" text-center mx-auto">
                        <h1 className="p-[2%] text-5xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">Contract & Services</h1>
                    </div>
                    <section className="py-20 lg:py-12 bg-ivory font-Corinthia text-center mx-auto">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                <div className="flex items-center justify-center lg:justify-start">
                                    <div className="max-w-lg border rounded-lg overflow-hidden shadow-xl shadow-slate-200">
                                        <img src="https://cjmw.eu/____impro/1/onewebmedia/CONTRACT01.jpg?etag=%2253113-5edfa2df%22&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=601%2B400&quality=85" alt="Tu imagen" className="w-full h-auto" />
                                    </div>
                                </div>
                                <div className="lg:pl-10 text-justify">
                                    <div className="text-center lg:text-left">

                                        <h2 style={{ color: ('#967a03') }} className="mt-8 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl lg:leading-tight">The team</h2>
                                        <p className="text-lg leading-relaxed mt-6">The illusion of improving in each decoration, the order in execution and the perfect completion, encourage the creation of a team of professionals who travel to any part of the world, installing our articles made to measure for each project.</p>
                                        <p className="text-lg leading-relaxed mt-6">Each hotel is a new adventure, a new learning experience to increase our experience and a new place where we can demonstrate our dynamism.</p>
                                        <p className="text-lg leading-relaxed mt-6">We are all a team, from the first to the last, we all depend on everyone, and from the beginning of the manufacturing process until it ends, that path is governed by love for work and for our colleagues.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección "The department" */}
                    <section className="py-20 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="text-white text-lg text-justify">
                                <div style={{ color: ('#967a03') }} className="text-center font-semibold text-lg my-10">department</div>
                                <p className="mb-4">In 2008, our company created a new line of work dedicated to hotel installation.</p>
                                <p className="mb-4">In 2008, our company created a new line of work dedicated to hotel installation. Step by step and relying on different projects, we professionalize and automate our Tailor Made section, incorporating machinery and training our staff.</p>
                                <p className="mb-4">Based on quality clothing and “just in time” delivery, we develop our own installation team.</p>
                                <p className="mb-4">Our goal is to shape the space by reading the personality of the decorative project.</p>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end">
                                <div className="max-w-lg border rounded-lg overflow-hidden shadow-xl shadow-slate-200">
                                    <img src="https://cjmw.eu/____impro/1/onewebmedia/CONTRACT02.jpg?etag=%225268b-5edfacbc%22&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=390%2B390&quality=85" alt="Tu imagen" className="w-full h-auto" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección "Significant projects" */}
                    <section className="py-20 lg:py-12 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="flex items-center justify-center lg:justify-start">
                                <div className="max-w-lg border rounded-lg overflow-hidden shadow-xl shadow-slate-200">
                                    <img src="https://cjmw.eu/____impro/1/onewebmedia/CONTRACT03.jpg?etag=%225eb6c-5edfb3d0%22&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=390%2B390&quality=85" alt="Tu imagen" className="w-full h-auto" />
                                </div>
                            </div>
                            <div className="text-white text-lg text-justify">
                                <div style={{ color: ('#967a03') }} className="text-center font-semibold text-lg my-10">Significant projects</div>
                                <p className="mb-4">Most of our work is focused on the decoration of theme restaurants and 4 and 5 star hotels. Projects led by the most significant decoration studios in Spain and in the world.</p>
                                <p className="mb-4">Boutique hotels in inland cities such as Berlin, Córdoba, Lisbon, London, Madrid, Marbella, Rome and Seville among others.</p>
                                <p className="mb-4">Large hotels in Cancun (Mexico), Montego Bay (Jamaica), Punta Cana (Dominican Republic) and in Spain: Lanzarote, Fuerteventura, Estepona and Mallorca.</p>
                            </div>
                        </div>
                    </section>

                    {/* Sección "Exclusive fabrics on demand" */}
                    <section className="py-20 lg:py-12 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div className="text-white text-lg text-justify">
                                <div style={{ color: ('#967a03') }} className="text-center font-semibold text-lg my-10">Exclusive fabrics on demand</div>
                                <p className="mb-4">Throughout our history we have been developing fabrics that comply with the different specific regulations of each country. Currently, under our HARBOUR brand, we offer a wide range of fireproof and outdoor fabrics, which are immediately available, and which are all suitable for use in public facilities.
                                    We create fabrics tailored to the project, following the technical criteria of the construction management and provide solutions to the various critical points that shape the decoration.</p>
                                <p className="mb-4">UNE, DIN, BS or IMO standards are intrinsic characteristics of our fabrics.</p>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end">
                                <div className="max-w-lg border rounded-lg overflow-hidden shadow-xl shadow-slate-200">
                                    <img src="https://cjmw.eu/____impro/1/onewebmedia/CONTRACT04.jpg?etag=W%2F%2272255-5edfb3e1%22&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=390%2B390&quality=85" alt="Tu imagen" className="w-full h-auto" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

            </CartProvider>
        </>
    );
}

export default Contract;
