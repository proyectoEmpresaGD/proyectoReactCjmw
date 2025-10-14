import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import { CartProvider } from '../../components/CartContext';
import BrochureCard from '../../components/ComponentesMedia/BrochureCard';
import BrochureBookViewer from '../../components/ComponentesMedia/BrochureBookViewer';
import VideoCard from '../../components/ComponentesMedia/VideoCard';
import VideoModal from '../../components/ComponentesMedia/VideoModal';
import { brochureCollections, videoContent } from '../../Constants/mediaContent';

const tabs = ['brochures', 'videos'];

const MediaPage = () => {
    const { t } = useTranslation(['media', 'pageArena', 'pageHarbour', 'pageBassari', 'pageFlamenco']);
    const [activeTab, setActiveTab] = useState('brochures');
    const [selectedBrochure, setSelectedBrochure] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);

    return (
        <CartProvider>
            <Header />
            <main className="min-h-screen bg-[#f5f3ef] pt-20 pb-12 sm:pt-24 sm:pb-16">
                <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:pb-16">
                    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#e0d2c0] via-[#f5ede3] to-white shadow-lg">
                        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:p-10">
                            <div className="space-y-6 text-center lg:text-left">
                                <span className="inline-flex items-center justify-center rounded-full bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.4em] text-gray-600 lg:justify-start">
                                    {t('hero.badge')}
                                </span>
                                <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl lg:text-5xl">
                                    {t('hero.title')}
                                </h1>
                                <p className="mx-auto max-w-2xl text-base text-gray-700 sm:text-lg lg:mx-0">
                                    {t('hero.description')}
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 lg:justify-start">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        {t('hero.brochuresHighlight')}
                                    </div>
                                    {/* <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                                        {t('hero.videosHighlight')}
                                    </div> */}
                                </div>
                            </div>
                            <div className="relative mx-auto max-w-sm sm:max-w-md lg:mx-0 lg:max-w-none">
                                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-black/10 via-white to-white blur-3xl" />
                                <img
                                    src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/KANNATURA%20VOL%20II/AR_AMBIENTE_RAFIAS_YUKI.jpg"
                                    alt={t('hero.imageAlt')}
                                    className="relative z-10 h-full w-full rounded-[2.5rem] object-cover shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
                    <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-2xl font-semibold text-gray-900 text-center sm:text-left">{t('sectionTitle')}</h2>

                        {/*
                        -------------------------------
                        COMENTADO: Selector de pestañas
                        -------------------------------
                        <nav
                            aria-label={t('tabs.label')}
                            className="flex w-full gap-3 overflow-x-auto rounded-full bg-white p-2 shadow sm:w-auto"
                        >
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition sm:px-5 ${
                                        activeTab === tab
                                            ? 'bg-gray-900 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {t(`tabs.${tab}`)}
                                </button>
                            ))}
                        </nav>
                        */}
                    </div>


                    {activeTab === 'brochures' && (
                        <div className="mt-10 space-y-10">
                            {brochureCollections.map((collection) => {
                                const brandName = t(`brands.${collection.brandId}`);
                                const localizedBrochures = collection.brochures.map(({ descriptionKey, ...brochure }) => ({
                                    ...brochure,
                                    description: t(`${collection.namespace}:${descriptionKey}`),
                                }));

                                return (
                                    <section key={collection.brandId} className="space-y-6">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {t('brandSectionHeading', { brand: brandName })}
                                            </h3>
                                            {collection.brandHref && (
                                                <Link
                                                    to={collection.brandHref}
                                                    className="inline-flex items-center justify-center rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
                                                >
                                                    {t('brandVisitLink', { brand: brandName })}
                                                </Link>
                                            )}
                                        </div>

                                        <div className="grid gap-8 sm:grid-cols-2 md:gap-10 xl:grid-cols-3">
                                            {localizedBrochures.map((brochure) => (
                                                <BrochureCard
                                                    key={brochure.id}
                                                    brochure={brochure}
                                                    onView={setSelectedBrochure}
                                                />
                                            ))}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    )}


                    {/*
                    ---------------------------------------
                    COMENTADO: Sección de Videos (pestaña 2)
                    ---------------------------------------
                    {activeTab === 'videos' && (
                        <div className="mt-10 grid gap-8 sm:grid-cols-2 md:gap-10">
                            {videoContent.map((video) => (
                                <VideoCard
                                    key={video.id}
                                    video={video}
                                    onSelect={setSelectedVideo}
                                />
                            ))}
                        </div>
                    )}
                    */}
                </section>
            </main>
            <Footer />

            {/*
            COMENTADO: Modales de visualización
            {selectedBrochure && (
                <BrochureBookViewer
                    brochure={selectedBrochure}
                    onClose={() => setSelectedBrochure(null)}
                />
            )}

            {selectedVideo && (
                <VideoModal
                    video={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}
            */}
        </CartProvider>
    );
};

export default MediaPage;
