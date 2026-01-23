import React from 'react';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import { CartProvider } from '../../components/CartContext';

import ChatSelector from '../../components/calculadora/ChatSelector.jsx';
import CurtainChatAssistant from './calculadoraCortinas/CurtainChatAssistant.jsx';
import PuffCalculator from '../../components/calculadora/calculadoraPuf/PuffCalculator.jsx';
import StoreChatAssistant from './calculadoraStores/StoreChatAssistant.jsx';
import WallpaperChatAssistant from './calculadoraPapeles/WallpaperChatAssistant.jsx';

const HERO_IMG = 'https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01937%20CARIBBEAN%20PARTY%20LONG%20BEACH%20BANANA_SILLA%20DERECHA.jpg';

export default function Confeccion() {
    return (
        <>
            <CartProvider>
                <Header />
                <main className="min-h-screen bg-white">
                    {/* HERO */}
                    <section className="relative h-[36vh] md:h-[46vh] w-full overflow-hidden">
                        <img
                            src={HERO_IMG}
                            alt="Confección"
                            className="absolute inset-0 h-full w-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                        <div className="relative z-10 h-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-start justify-end pb-8 md:pb-12">
                            <h1 className="text-white text-3xl md:text-5xl font-semibold tracking-tight drop-shadow">
                                Confección
                            </h1>
                            <p className="mt-3 text-white/90 max-w-2xl">
                                Elige un asistente para configurar tus cortinas o pufs con precisión profesional.
                            </p>
                        </div>
                    </section>

                    {/* CONTENIDO */}
                    <section className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
                        <ChatSelector
                            variant="page"
                            items={[
                                {
                                    key: 'curtains',
                                    title: 'Confeccionar cortinas',
                                    bgUrl: 'https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/BOHEMIAN/HARB_AMB_BOHEMIAN_07%2035X35.jpg',
                                    iconUrl: '',
                                    disabled: false
                                },
                                {
                                    key: 'puff',
                                    title: 'Confeccionar puf',
                                    bgUrl: 'https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01946%20CARIBBEAN%20PARTY%20REEF%20INDIGO.jpg',
                                    iconUrl: '',
                                    disabled: false
                                },
                                { key: 'stores', title: 'Confeccionar estores', bgUrl: 'https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES/ARENA%20AMBIENTE/COSY/ARN_COSY_5%20MINIATURA.jpg', iconUrl: '', disabled: false },
                                {
                                    key: 'wallpaper',
                                    title: 'Calcular rollos de papel pintado',
                                    bgUrl: 'https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/GOTLAND/DSC00156%20RIVIERA.jpg',
                                    iconUrl: '',
                                    disabled: false
                                },
                            ]}
                            renderChat={(key) => {
                                if (key === 'curtains') return <CurtainChatAssistant key="curtain-chat" />;
                                if (key === 'stores') return <StoreChatAssistant key="store-chat" initialOpen={true} />;
                                if (key === 'puff') return <PuffCalculator key="puff-calculator" initialOpen={true} />;
                                if (key === 'wallpaper') return <WallpaperChatAssistant key="wallpaper-calculator" initialOpen={true} />;
                                return null;
                            }}
                        />
                    </section>
                </main>

                <Footer />
            </CartProvider>
        </>
    );
}
