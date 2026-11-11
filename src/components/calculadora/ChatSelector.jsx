import React, {
    useState,
} from 'react';

import {
    ArrowUpRight,
    Blinds,
    CircleDot,
    Scissors,
    Sparkles,
    Wallpaper,
} from 'lucide-react';


const FALLBACK_IMG =
    'https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/BOHEMIAN/HARB_AMB_BOHEMIAN_01%2035X35.jpg';


const DEFAULT_ITEMS = [
    {
        key:
            'curtains',

        title:
            'Confeccionar cortinas',

        description:
            'Calcula tejido, medidas y confección paso a paso.',

        bgUrl:
            'https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/GOTLAND/DSC00156%20RIVIERA.jpg',

        disabled:
            false,
    },

    {
        key:
            'puff',

        title:
            'Confeccionar puf',

        description:
            'Configura tejidos y obtén una estimación profesional.',

        bgUrl:
            'https://bassari.eu/ImagenesTelasCjmw/Carruseles/HARBOUR/HAR01942%20CARIBBEAN%20PARTY%20JUNGLE%20INDIGO_%20SILLA%20PISCINA.jpg',

        disabled:
            false,
    },

    {
        key:
            'stores',

        title:
            'Confeccionar estores',

        description:
            'Calcula medidas, tejido y confección de tu estor.',

        bgUrl:
            'https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/HARBOUR%20AMBIENTE/GOTLAND/DSC00156%20RIVIERA.jpg',

        disabled:
            false,
    },

    {
        key:
            'wallpaper',

        title:
            'Calcular papel pintado',

        description:
            'Calcula los rollos necesarios según las medidas del proyecto.',

        bgUrl:
            '',

        disabled:
            false,
    },
];


const ASSISTANT_ICONS = {
    curtains:
        Scissors,

    puff:
        CircleDot,

    stores:
        Blinds,

    wallpaper:
        Wallpaper,
};


function AssistantCard({
    item,
    index,
    onClick,
}) {
    const isDisabled =
        Boolean(
            item.disabled
        );

    const Icon =
        ASSISTANT_ICONS[
        item.key
        ] ||
        Scissors;

    const backgroundImage =
        item.bgUrl ||
        FALLBACK_IMG;


    return (
        <button
            type="button"
            disabled={
                isDisabled
            }
            onClick={
                onClick
            }
            aria-label={
                item.title
            }
            className={`
                group
                relative
                flex
                min-h-[440px]
                flex-col
                overflow-hidden
                rounded-[30px]
                border
                border-stone-200/80
                bg-white
                p-2
                text-left
                shadow-[0_12px_40px_-24px_rgba(28,25,23,0.4)]
                transition-all
                duration-500
                ease-out

                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-stone-950
                focus-visible:ring-offset-4

                ${isDisabled
                    ? `
                            cursor-not-allowed
                            opacity-60
                        `
                    : `
                            cursor-pointer

                            hover:-translate-y-2
                            hover:border-stone-300
                            hover:shadow-[0_28px_70px_-28px_rgba(28,25,23,0.38)]
                        `
                }
            `}
        >
            {/* IMAGEN */}
            <div
                className="
                    relative
                    min-h-[310px]
                    flex-1
                    overflow-hidden
                    rounded-[24px]
                    bg-stone-100
                "
            >
                <img
                    src={
                        backgroundImage
                    }
                    alt=""
                    loading="lazy"
                    className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        ease-out

                        group-hover:scale-[1.045]
                    "
                />


                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/45
                        via-transparent
                        to-black/5
                    "
                />


                {/* ICONO */}
                <div
                    className="
                        absolute
                        left-4
                        top-4
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-white/40
                        bg-white/85
                        text-stone-900
                        shadow-sm
                        backdrop-blur-xl
                    "
                >
                    <Icon
                        className="
                            h-[18px]
                            w-[18px]
                            stroke-[1.6]
                        "
                    />
                </div>


                {/* NÚMERO */}
                <div
                    className="
                        absolute
                        right-4
                        top-4
                        flex
                        h-9
                        min-w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/30
                        bg-black/20
                        px-3
                        text-[10px]
                        font-semibold
                        tracking-[0.18em]
                        text-white
                        backdrop-blur-xl
                    "
                >
                    {String(
                        index + 1
                    ).padStart(
                        2,
                        '0'
                    )}
                </div>


                <div
                    className="
                        absolute
                        bottom-4
                        left-4
                        right-4
                        flex
                        items-center
                        justify-between
                    "
                >
                    <span
                        className="
                            rounded-full
                            border
                            border-white/30
                            bg-black/20
                            px-3
                            py-1.5
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.17em]
                            text-white
                            backdrop-blur-lg
                        "
                    >
                        Asistente profesional
                    </span>


                    {!isDisabled && (
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-stone-950
                                shadow-lg
                                transition-all
                                duration-300

                                group-hover:rotate-6
                                group-hover:scale-110
                            "
                        >
                            <ArrowUpRight
                                className="
                                    h-[18px]
                                    w-[18px]
                                "
                            />
                        </div>
                    )}
                </div>
            </div>


            {/* TEXTO */}
            <div
                className="
                    px-3
                    pb-3
                    pt-5
                "
            >
                <h3
                    className="
                        text-[1.4rem]
                        font-medium
                        leading-tight
                        tracking-[-0.035em]
                        text-stone-950
                    "
                >
                    {item.title}
                </h3>


                {item.description && (
                    <p
                        className="
                            mt-2
                            max-w-sm
                            text-sm
                            leading-6
                            text-stone-500
                        "
                    >
                        {
                            item.description
                        }
                    </p>
                )}


                <div
                    className="
                        mt-5
                        flex
                        items-center
                        justify-between
                        border-t
                        border-stone-100
                        pt-4
                    "
                >
                    <span
                        className="
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-stone-400
                        "
                    >
                        {isDisabled
                            ? 'Próximamente'
                            : 'Comenzar proyecto'}
                    </span>


                    {!isDisabled && (
                        <span
                            className="
                                h-2
                                w-2
                                rounded-full
                                bg-emerald-500
                                shadow-[0_0_0_4px_rgba(16,185,129,0.10)]
                            "
                        />
                    )}
                </div>
            </div>
        </button>
    );
}


const ChatSelector = ({
    items = DEFAULT_ITEMS,
    renderChat,
    variant = 'page',
    open = false,
    onClose,
}) => {
    const [
        activeKey,
        setActiveKey,
    ] = useState(
        null
    );


    const isModal =
        variant ===
        'modal';


    if (
        isModal &&
        !open
    ) {
        return null;
    }


    const handleTileClick =
        item => {
            if (
                item.disabled
            ) {
                return;
            }


            setActiveKey(
                item.key
            );
        };


    const handleChatExit =
        () => {
            setActiveKey(
                null
            );
        };


    const renderActiveChat =
        () => {
            if (
                !activeKey ||
                typeof renderChat !==
                'function'
            ) {
                return null;
            }


            const node =
                renderChat(
                    activeKey
                );


            if (
                React.isValidElement(
                    node
                )
            ) {
                return React.cloneElement(
                    node,
                    {
                        initialOpen:
                            true,

                        onClose:
                            handleChatExit,

                        onFinished:
                            handleChatExit,
                    }
                );
            }


            return node;
        };


    return (
        <div
            role={
                isModal
                    ? 'dialog'
                    : undefined
            }
            aria-modal={
                isModal
                    ? 'true'
                    : undefined
            }
            onClick={
                isModal
                    ? onClose
                    : undefined
            }
            className={
                isModal
                    ? `
                        fixed
                        inset-0
                        z-[9999]
                        flex
                        flex-col
                        overflow-y-auto
                        bg-stone-950/70
                        backdrop-blur-xl
                    `
                    : `
                        w-full
                    `
            }
        >
            {activeKey ? (
                <div
                    className={
                        isModal
                            ? `
                                flex-1
                                overflow-auto
                                p-3

                                md:p-6
                            `
                            : `
                                flex-1
                            `
                    }
                    onClick={
                        isModal
                            ? event =>
                                event.stopPropagation()
                            : undefined
                    }
                >
                    <div
                        className="
                            mx-auto
                            max-w-5xl
                        "
                    >
                        {
                            renderActiveChat()
                        }
                    </div>
                </div>
            ) : (
                <div
                    onClick={
                        isModal
                            ? event =>
                                event.stopPropagation()
                            : undefined
                    }
                    className={
                        isModal
                            ? `
                                flex-1
                                p-5

                                md:p-8
                            `
                            : `
                                w-full
                            `
                    }
                >
                    {/* CABECERA */}
                    <div
                        className="
                            mb-10
                            rounded-[32px]
                            border
                            border-stone-200
                            bg-white
                            px-6
                            py-7
                            shadow-[0_16px_50px_-35px_rgba(28,25,23,0.35)]

                            sm:px-8

                            lg:flex
                            lg:items-end
                            lg:justify-between
                            lg:px-10
                            lg:py-9
                        "
                    >
                        <div
                            className="
                                max-w-2xl
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-stone-400
                                "
                            >
                                <Sparkles
                                    className="
                                        h-4
                                        w-4
                                    "
                                />

                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.22em]
                                    "
                                >
                                    Asistencia profesional
                                </p>
                            </div>


                            <h2
                                className="
                                    mt-4
                                    text-3xl
                                    font-light
                                    tracking-[-0.045em]
                                    text-stone-950

                                    md:text-[2.6rem]
                                "
                            >
                                ¿Qué quieres confeccionar?
                            </h2>


                            <p
                                className="
                                    mt-4
                                    max-w-xl
                                    text-sm
                                    leading-6
                                    text-stone-500
                                "
                            >
                                Selecciona un proyecto y te guiaremos
                                paso a paso para calcular materiales,
                                medidas y confección.
                            </p>
                        </div>


                        <div
                            className="
                                mt-6
                                inline-flex
                                items-center
                                gap-3
                                rounded-full
                                bg-stone-100
                                px-4
                                py-2.5
                                text-xs
                                font-medium
                                text-stone-500

                                lg:mt-0
                            "
                        >
                            <span
                                className="
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-emerald-500
                                "
                            />

                            {
                                items.filter(
                                    item =>
                                        !item.disabled
                                ).length
                            } asistentes disponibles
                        </div>
                    </div>


                    {/* TARJETAS */}
                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-5

                            sm:grid-cols-2

                            xl:grid-cols-4
                        "
                    >
                        {items.map(
                            (
                                item,
                                index
                            ) => (
                                <AssistantCard
                                    key={
                                        item.key
                                    }
                                    item={
                                        item
                                    }
                                    index={
                                        index
                                    }
                                    onClick={() =>
                                        handleTileClick(
                                            item
                                        )
                                    }
                                />
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


export default ChatSelector;