// src/pages/Contract.jsx
import { Header } from "../../components/header";
import { CartProvider } from '../../components/CartContext';
import { useTranslation } from 'react-i18next';

function Contract() {
    const { t } = useTranslation('contract');

    return (
        <>
            <CartProvider>
                <Header />
                <div className="min-h-screen bg-white xl:pt-[7%] lg:pt-[12%] md:pt-[10%] sm:pt-[15%] pt-[20%]">
                    {/* Título principal */}
                    <div className="text-center mx-auto">
                        <h1 className="p-[2%] text-5xl font-extrabold text-black tracking-wide">
                            {t('title')}
                        </h1>
                    </div>

                    {/* Sección "The Team" */}
                    <section className="py-20 lg:py-12 bg-white text-black font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="max-w-lg mx-auto lg:mx-0 lg:max-w-none">
                                    <img
                                        src="https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT04.jpg"
                                        alt={t('team.alt')}
                                        className="w-full h-auto rounded-lg shadow-xl hover:scale-105 transform transition-transform duration-500"
                                    />
                                </div>
                                <div className="lg:pl-10 text-justify">
                                    <h2 className="text-4xl font-bold mb-4 text-black">
                                        {t('team.heading')}
                                    </h2>
                                    <p className="text-lg leading-relaxed mb-4">
                                        {t('team.p1')}
                                    </p>
                                    <p className="text-lg leading-relaxed mb-4">
                                        {t('team.p2')}
                                    </p>
                                    <p className="text-lg leading-relaxed">
                                        {t('team.p3')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección "The Department" */}
                    <section className="py-20 bg-white text-black font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="text-lg text-justify">
                                <h2 className="text-4xl font-bold mb-4 text-black">
                                    {t('department.heading')}
                                </h2>
                                <p className="mb-4">{t('department.p1')}</p>
                                <p className="mb-4">{t('department.p2')}</p>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end">
                                <img
                                    src="https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT03.jpg"
                                    alt={t('department.alt')}
                                    className="rounded-lg shadow-xl hover:scale-105 transform transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Sección "Significant Projects" */}
                    <section className="py-20 lg:py-12 bg-white text-black font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="max-w-lg mx-auto lg:mx-0 lg:max-w-none">
                                <img
                                    src="https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT02.jpg"
                                    alt={t('projects.alt')}
                                    className="rounded-lg shadow-xl hover:scale-105 transform transition-transform duration-500"
                                />
                            </div>
                            <div className="text-lg text-justify">
                                <h2 className="text-4xl font-bold mb-4 text-black">
                                    {t('projects.heading')}
                                </h2>
                                <p className="mb-4">{t('projects.p1')}</p>
                                <p className="mb-4">{t('projects.p2')}</p>
                            </div>
                        </div>
                    </section>

                    {/* Sección "Exclusive Fabrics on Demand" */}
                    <section className="py-20 lg:py-12 bg-white text-black font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="text-lg text-justify">
                                <h2 className="text-4xl font-bold mb-4 text-black">
                                    {t('fabrics.heading')}
                                </h2>
                                <p className="mb-4">{t('fabrics.p1')}</p>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end">
                                <img
                                    src="https://bassari.eu/ImagenesTelasCjmw/CONTRACT/CONTRACT09.jpg"
                                    alt={t('fabrics.alt')}
                                    className="rounded-lg shadow-xl hover:scale-105 transform transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Sección "Contáctanos" */}
                    <section className="py-20 bg-white text-black font-light text-center">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl text-center">
                            <h2 className="text-4xl font-bold mb-6 text-black">
                                {t('contact.heading')}
                            </h2>
                            <p className="text-lg leading-relaxed text-black mb-8">
                                {t('contact.p1')}
                            </p>
                            <p className="text-lg leading-relaxed text-black mb-4">
                                {t('contact.p2')}
                                <a
                                    href="mailto:info@cjmw.eu"
                                    className="text-blue-500 hover:text-blue-700 underline transition duration-300"
                                >
                                    info@cjmw.eu
                                </a>
                            </p>

                            <div className="mt-10">
                                <a
                                    href="mailto:info@cjmw.eu"
                                    className="inline-block bg-black hover:bg-white text-white hover:text-black border-2 border-black hover:border-gray-400 font-semibold py-3 px-8 rounded-md transition-transform transform hover:scale-105 shadow-lg"
                                >
                                    {t('contact.button')}
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
