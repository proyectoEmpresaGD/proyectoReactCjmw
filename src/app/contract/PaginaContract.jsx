import { Header } from "../../components/header";
import { CartProvider } from '../../components/CartContext';

function Contract() {
    return (
        <>
            <CartProvider>
                <Header />
                <div className="min-h-screen bg-white text-white xl:pt-[7%] lg:pt-[12%] md:pt-[10%] sm:pt-[15%] pt-[20%] ">
                    <div className="text-center mx-auto">
                        <h1 className="p-[2%] text-5xl font-extrabold text-black tracking-wide">
                            Contract  Services
                        </h1>
                    </div>

                    {/* Sección "The team" */}
                    <section className="py-20 lg:py-12 bg-white text-black font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="max-w-lg mx-auto lg:mx-0 lg:max-w-none">
                                    <img
                                        src="https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT04.jpg"
                                        alt="Team"
                                        className="w-full h-auto rounded-lg shadow-xl hover:scale-105 transform transition-transform duration-500"
                                    />
                                </div>
                                <div className="lg:pl-10 text-justify">
                                    <div className="text-left">
                                        <h2 className="text-4xl font-bold mb-4 text-black">
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
                    <section className="py-20 bg-white text-black font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="text-lg text-justify">
                                <h2 className="text-4xl font-bold mb-4 text-black">The Department</h2>
                                <p className="mb-4">
                                    In 2008, our company created a new line of work dedicated to hotel installation. Step by step and relying on different projects, we professionalized and automated our Tailor-Made section, incorporating machinery and training our staff.
                                </p>
                                <p className="mb-4">
                                    Based on quality clothing and “just in time” delivery, we developed our own installation team. Our goal is to shape the space by reading the personality of the decorative project.
                                </p>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end">
                                <img
                                    src="https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT03.jpg"
                                    alt="Department"
                                    className="rounded-lg shadow-xl hover:scale-105 transform transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Sección "Significant projects" */}
                    <section className="py-20 lg:py-12 bg-white text-black font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="max-w-lg mx-auto lg:mx-0 lg:max-w-none">
                                <img
                                    src="https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT02.jpg"
                                    alt="Projects"
                                    className="rounded-lg shadow-xl hover:scale-105 transform transition-transform duration-500"
                                />
                            </div>
                            <div className="text-lg text-justify">
                                <h2 className="text-4xl font-bold mb-4 text-black">
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
                    <section className="py-20 lg:py-12 bg-white text-black font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="text-lg text-justify">
                                <h2 className="text-4xl font-bold mb-4 text-black">
                                    Exclusive Fabrics on Demand
                                </h2>
                                <p className="mb-4">
                                    We develop fabrics tailored to each project's specific regulations, including UNE, DIN, BS, or IMO standards. All fabrics are available under our HARBOUR brand, which includes a wide range of fireproof and outdoor fabrics.
                                </p>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end">
                                <img
                                    src="https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT09.jpg"
                                    alt="Fabrics"
                                    className="rounded-lg shadow-xl hover:scale-105 transform transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Sección "Contáctanos" */}
                    <section className="py-20 bg-white text-gray-300 font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl text-center">
                            <h2 className="text-4xl font-bold mb-6 text-black">Contáctanos</h2>
                            <p className="text-lg leading-relaxed text-black mb-8">
                                Si tienes alguna pregunta o quieres más información sobre nuestros servicios, no dudes en contactarnos. ¡Estaremos encantados de ayudarte!
                            </p>
                            <p className="text-lg leading-relaxed text-black mb-4">
                                Escríbenos a: <a href="mailto:info@cjmw.eu" className="text-blue-500 hover:text-blue-700 underline transition duration-300">info@cjmw.eu</a>
                            </p>

                            <div className="mt-10">
                                <a
                                    href="mailto:info@cjmw.eu"
                                    className="inline-block bg-black hover:bg-white text-white hover:text-black border-2 border-black hover:border-gray-400 hover:rounded-xl font-semibold py-3 px-8 rounded-md transition-transform transform hover:scale-105 shadow-lg"
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
