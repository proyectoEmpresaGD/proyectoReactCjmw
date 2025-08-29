// src/pages/About.jsx
import { Header } from "../../components/header";
import Footer from '../../components/footer';
import { CartProvider } from '../../components/cartContext';
import { useTranslation } from 'react-i18next';

function About() {
    const { t } = useTranslation('about');

    return (
        <>
            <CartProvider>
                <Header />

                <div className="min-h-screen xl:pt-[4%] lg:pt-[8%] md:pt-[6%] sm:pt-[8%] pt-[10%]">
                    {/* Sección "CJM: Transformando espacios con telas de calidad" */}
                    <section className="py-20 lg:py-12 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="flex items-center justify-center lg:justify-start">
                                    <div className="w-full max-w-lg border rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-transform duration-500">
                                        <img
                                            src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/CJM%20AMBIENTE/SET%20OF%20THREADS/ANNUM%20ANTHRACITE_8_11zon_1_11zon.webp"
                                            alt={t('overview.imageAlt')}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="lg:pl-10">
                                    <p className="text-sm font-semibold tracking-widest text-gray-800 uppercase mb-2">
                                        {t('overview.subtitle')}
                                    </p>
                                    <h2 className="text-2xl font-semibold text-gray-600 mb-6">
                                        {t('overview.title')}
                                    </h2>
                                    <p className="text-lg leading-relaxed text-gray-800 mt-6">
                                        {t('overview.paragraph1')}
                                    </p>
                                    <p className="text-lg leading-relaxed text-gray-800 mt-6">
                                        {t('overview.paragraph2')}
                                    </p>
                                    <p className="text-lg leading-relaxed text-gray-800 mt-6">
                                        {t('overview.paragraph3')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección "Made in Spain" */}
                    <section className="py-20 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="text-gray-800 text-lg text-justify">
                                <h2 className="text-2xl font-semibold text-gray-600 text-center mb-6">
                                    {t('madeInSpain.title')}
                                </h2>
                                <p className="text-center mb-6">
                                    {t('madeInSpain.subtitle')}
                                </p>
                                <p className="mb-6">{t('madeInSpain.paragraph1')}</p>
                                <p className="mb-6">{t('madeInSpain.paragraph2')}</p>
                                <p>{t('madeInSpain.paragraph3')}</p>
                            </div>
                            <div className="flex items-center justify-center lg:justify-end">
                                <div className="w-full max-w-lg border rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-transform duration-500">
                                    <img
                                        src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/ARENA%20AMBIENTE/ATMOSPHERE/ATMOSPHERE%20MOSS_3_11zon_7_11zon.webp"
                                        alt={t('madeInSpain.imageAlt')}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sección "Headquarters" */}
                    <section className="py-20 lg:py-12 bg-ivory font-Corinthia">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="flex items-center justify-center lg:justify-start">
                                <div className="w-full max-w-lg border rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition-transform duration-500">
                                    <img
                                        src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/CARRUSELES_Colecciones_Marcas/FLAMENCO%20AMBIENTE/JARAPA/Vani_Living_326_Brkt_Portrait%20copy_3_11zon_6_11zon.webp"
                                        alt={t('headquarters.imageAlt')}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            </div>
                            <div className="text-gray-800 text-lg text-justify">
                                <h2 className="text-2xl font-semibold text-gray-600 text-center mb-6">
                                    {t('headquarters.title')}
                                </h2>
                                <p className="mb-6">{t('headquarters.paragraph1')}</p>
                                <p className="mb-6">{t('headquarters.paragraph2')}</p>
                                <p>{t('headquarters.paragraph3')}</p>
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
