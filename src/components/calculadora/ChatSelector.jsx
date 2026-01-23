import React, { useState } from 'react';

const FALLBACK_IMG =
    'https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/BOHEMIAN/HARB_AMB_BOHEMIAN_01%2035X35.jpg';

const DEFAULT_ITEMS = [
    {
        key: 'curtains',
        title: 'Confeccionar cortinas',
        bgUrl: 'https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/GOTLAND/DSC00156%20RIVIERA.jpg',
        iconUrl: '',
        disabled: false
    },
    {
        key: 'puff',
        title: 'Confeccionar puf',
        bgUrl: 'https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01942%20CARIBBEAN%20PARTY%20JUNGLE%20INDIGO_%20SILLA%20PISCINA.jpg',
        iconUrl: '',
        disabled: false
    },
    {
        key: 'stores',
        title: 'Confeccionar estores',
        bgUrl: 'https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/GOTLAND/DSC00156%20RIVIERA.jpg',
        iconUrl: '',
        disabled: false
    },
    { key: 'tbd2', title: 'Próximamente', bgUrl: '', iconUrl: '', disabled: true },
];

/**
 * ChatSelector
 * - variant="page": se renderiza como página (sin overlay, sin botón Volver)
 * - variant="modal": modal a pantalla completa (usa open/onClose)
 */
const ChatSelector = ({
    items = DEFAULT_ITEMS,
    renderChat,
    variant = 'page',
    open = false,
    onClose,
}) => {
    const [activeKey, setActiveKey] = useState(null);
    const isModal = variant === 'modal';

    if (isModal && !open) return null;

    const handleTileClick = (item) => {
        if (item.disabled) return;
        setActiveKey(item.key);
    };

    const handleChatExit = () => setActiveKey(null);

    const renderActiveChat = () => {
        if (!activeKey || typeof renderChat !== 'function') return null;
        const node = renderChat(activeKey);
        if (React.isValidElement(node)) {
            return React.cloneElement(node, {
                initialOpen: true,
                onClose: handleChatExit,
                onFinished: handleChatExit,
            });
        }
        return node;
    };

    return (
        <div
            role={isModal ? 'dialog' : undefined}
            aria-modal={isModal ? 'true' : undefined}
            className={
                isModal
                    ? 'fixed inset-0 z-[9999] flex flex-col bg-black/80 backdrop-blur-sm'
                    : 'w-full flex flex-col'
            }
            onClick={isModal ? onClose : undefined}
        >
            {/* Contenido */}
            {activeKey ? (
                <div
                    className={isModal ? 'flex-1 overflow-auto p-3 md:p-6' : 'flex-1 overflow-auto p-0 md:p-0'}
                    onClick={isModal ? (e) => e.stopPropagation() : undefined}
                >
                    <div className="max-w-5xl mx-auto bg-transparent px-4 md:px-6 py-6 md:py-10">
                        {renderActiveChat()}
                    </div>
                </div>
            ) : (
                <div
                    className={isModal
                        ? 'flex-1 p-4 md:p-8'
                        : 'p-0'
                    }
                    onClick={isModal ? (e) => e.stopPropagation() : undefined}
                >
                    {/* Grid moderna */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                        {items.map((item) => {
                            const isDisabled = !!item.disabled;
                            const bg = item.bgUrl || FALLBACK_IMG;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => handleTileClick(item)}
                                    disabled={isDisabled}
                                    className={[
                                        'group relative isolate overflow-hidden rounded-2xl',
                                        'ring-1 ring-black/5 shadow-sm hover:shadow-xl',
                                        'transition-all duration-300 ease-out',
                                        isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5',
                                        // Alturas responsivas agradables
                                        'h-[240px] sm:h-[260px] md:h-[300px]',
                                        // Fondo
                                        'bg-neutral-100'
                                    ].join(' ')}
                                    aria-label={item.title}
                                    title={item.title}
                                >
                                    {/* Imagen fondo */}
                                    <img
                                        src={bg}
                                        alt=""
                                        className="absolute inset-0 h-full w-full object-cover object-center"
                                        loading="lazy"
                                    />
                                    {/* Degradado superior e inferior para legibilidad */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 " />
                                    {/* Efecto brillo diagonal sutil al hover */}
                                    <div className="absolute -inset-x-10 -inset-y-10 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 rotate-12 transition-opacity" />

                                    {/* Contenido centrado */}
                                    <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-4">
                                        {item.iconUrl ? (
                                            <img
                                                src={item.iconUrl}
                                                alt=""
                                                className="h-14 w-14 md:h-16 md:w-16 object-contain drop-shadow"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="h-14 w-14 md:h-16 md:w-16 rounded-full backdrop-blur bg-white/10 ring-1 ring-white/20" />
                                        )}
                                        <h3
                                            className={[
                                                'mt-4 font-semibold tracking-tight drop-shadow',
                                                'text-white text-lg md:text-xl'
                                            ].join(' ')}
                                        >
                                            {item.title}
                                        </h3>
                                        {!isDisabled && (
                                            <span className="mt-3 text-xs md:text-sm text-white/90 backdrop-blur-sm rounded-full px-3 py-1 ring-1 ring-white/20">
                                                Empezar
                                            </span>
                                        )}
                                        {isDisabled && (
                                            <span className="mt-3 text-xs md:text-sm text-white/70 backdrop-blur-sm rounded-full px-3 py-1 ring-1 ring-white/20">
                                                Próximamente
                                            </span>
                                        )}
                                    </div>

                                    {/* Borde luminoso al foco/hover accesible */}
                                    <span
                                        className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-transparent group-focus-visible:ring-white/70 group-hover:ring-white/30 transition"
                                        aria-hidden="true"
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatSelector;
