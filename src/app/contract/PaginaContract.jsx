import { Header } from "../../components/header";
import { CartProvider } from '../../components/CartContext';

function Contract() {
    return (
        <>
            <CartProvider>
                <Header />
                <div className="min-h-screen bg-black text-white xl:pt-[8%] lg:pt-[12%] md:pt-[10%] sm:pt-[15%] pt-[20%] ">
                    <div className="text-center mx-auto">
                        <h1 className="p-[2%] text-5xl font-extrabold text-white tracking-wide">
                            Contract  Services
                        </h1>
                    </div>

                    {/* Sección "The team" */}
                    <section className="py-20 lg:py-12 bg-black text-gray-300 font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="max-w-lg mx-auto lg:mx-0 lg:max-w-none">
                                    <img
                                        src="https://cjmw.eu/____impro/1/onewebmedia/CONTRACT01.jpg?etag=%2253113-5edfa2df%22&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=601%2B400&quality=85"
                                        alt="Team"
                                        className="w-full h-auto rounded-lg shadow-xl hover:scale-105 transform transition-transform duration-500"
                                    />
                                </div>
                                <div className="lg:pl-10 text-justify">
                                    <div className="text-left">
                                        <h2 className="text-4xl font-bold mb-4 text-yellow-500">
                                            The Team
                                        </h2>
                                        <p className="text-lg leading-relaxed mb-4">
                                            The illusion of improving in each decoration, the order in execution and the perfect completion, encourage the creation of a team of professionals who travel to any part of the world, installing our articles made to measure for each project.
                                        </p>
                                        <p className="text-lg leading-relaxed mb-4">
                                            Each hotel is a new adventure, a new learning experience to increase our experience and a new place where we can demonstrate our dynamism.
                                        </p>
                                        <p className="text-lg leading-relaxed">
                                            We are all a team, from the first to the last, and we all depend on everyone. From the beginning of the manufacturing process until it ends, that path is governed by love for work and for our colleagues.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección "The department" */}
                    <section className="py-20 bg-black text-gray-300 font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="text-lg text-justify">
                                <h2 className="text-4xl font-bold mb-4 text-yellow-500">The Department</h2>
                                <p className="mb-4">
                                    In 2008, our company created a new line of work dedicated to hotel installation. Step by step and relying on different projects, we professionalized and automated our Tailor-Made section, incorporating machinery and training our staff.
                                </p>
                                <p className="mb-4">
                                    Based on quality clothing and “just in time” delivery, we developed our own installation team. Our goal is to shape the space by reading the personality of the decorative project.
                                </p>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end">
                                <img
                                    src="https://cjmw.eu/____impro/1/onewebmedia/CONTRACT02.jpg?etag=%225268b-5edfacbc%22&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=390%2B390&quality=85"
                                    alt="Department"
                                    className="rounded-lg shadow-xl hover:scale-105 transform transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Sección "Significant projects" */}
                    <section className="py-20 lg:py-12 bg-black text-gray-300 font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="max-w-lg mx-auto lg:mx-0 lg:max-w-none">
                                <img
                                    src="https://cjmw.eu/____impro/1/onewebmedia/CONTRACT03.jpg?etag=%225eb6c-5edfb3d0%22&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=390%2B390&quality=85"
                                    alt="Projects"
                                    className="rounded-lg shadow-xl hover:scale-105 transform transition-transform duration-500"
                                />
                            </div>
                            <div className="text-lg text-justify">
                                <h2 className="text-4xl font-bold mb-4 text-yellow-500">
                                    Significant Projects
                                </h2>
                                <p className="mb-4">
                                    Most of our work is focused on the decoration of theme restaurants and 4 and 5-star hotels. Projects led by the most significant decoration studios in Spain and the world.
                                </p>
                                <p className="mb-4">
                                    Boutique hotels in cities such as Berlin, Córdoba, Lisbon, London, Madrid, Marbella, Rome, Seville, and large hotels in Cancun, Punta Cana, and Jamaica.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Sección "Exclusive fabrics on demand" */}
                    <section className="py-20 lg:py-12 bg-black text-gray-300 font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="text-lg text-justify">
                                <h2 className="text-4xl font-bold mb-4 text-yellow-500">
                                    Exclusive Fabrics on Demand
                                </h2>
                                <p className="mb-4">
                                    We develop fabrics tailored to each project's specific regulations, including UNE, DIN, BS, or IMO standards. All fabrics are available under our HARBOUR brand, which includes a wide range of fireproof and outdoor fabrics.
                                </p>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end">
                                <img
                                    src="https://cjmw.eu/____impro/1/onewebmedia/CONTRACT04.jpg?etag=W%2F%2272255-5edfb3e1%22&sourceContentType=image%2Fjpeg&ignoreAspectRatio&resize=390%2B390&quality=85"
                                    alt="Fabrics"
                                    className="rounded-lg shadow-xl hover:scale-105 transform transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Sección "Contáctanos" */}
                    <section className="py-20 bg-black text-gray-300 font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl text-center">
                            <h2 className="text-4xl font-bold mb-6 text-yellow-500">Contáctanos</h2>
                            <p className="text-lg leading-relaxed text-white mb-8">
                                Si tienes alguna pregunta o quieres más información sobre nuestros servicios, no dudes en contactarnos. ¡Estaremos encantados de ayudarte!
                            </p>
                            <p className="text-lg leading-relaxed text-white mb-4">
                                Escríbenos a: <a href="mailto:info@cjmw.eu" className="text-blue-500 hover:text-blue-700 underline transition duration-300">info@cjmw.eu</a>
                            </p>

                            <div className="mt-10">
                                <a
                                    href="mailto:info@cjmw.eu"
                                    className="inline-block bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-transform transform hover:scale-105 shadow-lg"
                                >
                                    Enviar correo
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </CartProvider>
        </>
    );
}

export default Contract;
