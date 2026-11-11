import {
    motion,
} from "framer-motion";

import {
    ArrowUpRight,
} from "lucide-react";

import {
    useTranslation,
} from "react-i18next";


export default function InicioInspiracionColecciones({
    moodboards = [],
    onOpenCollections,
}) {
    const {
        t,
    } = useTranslation(
        "homePage"
    );


    if (!moodboards.length) {
        return null;
    }


    const [
        paletas,
        capas,
        combinaciones,
    ] = moodboards;


    return (
        <section
            className="
                bg-[#eee9e2]
                px-5
                py-20

                sm:px-8

                lg:px-12
                lg:py-28

                xl:px-16
            "
        >
            <div
                className="
                    mx-auto
                    max-w-[1500px]
                "
            >
                <div
                    className="
                        mb-12
                        grid
                        gap-6

                        lg:grid-cols-12
                        lg:items-end
                    "
                >
                    <div
                        className="
                            lg:col-span-8
                        "
                    >
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.3em]
                                text-stone-500
                            "
                        >
                            {t(
                                "moodboards.kicker"
                            )}
                        </p>


                        <h2
                            className="
                                mt-5
                                text-4xl
                                font-light
                                leading-[0.98]
                                tracking-[-0.05em]
                                text-stone-950

                                sm:text-5xl

                                lg:text-6xl
                            "
                        >
                            {t(
                                "moodboards.titleLine1"
                            )}

                            <span
                                className="
                                    block
                                    text-stone-400
                                "
                            >
                                {t(
                                    "moodboards.titleLine2"
                                )}
                            </span>
                        </h2>
                    </div>


                    <div
                        className="
                            lg:col-span-4
                            lg:flex
                            lg:justify-end
                        "
                    >
                        <p
                            className="
                                max-w-sm
                                text-sm
                                leading-6
                                text-stone-500
                            "
                        >
                            {t(
                                "moodboards.intro"
                            )}
                        </p>
                    </div>
                </div>


                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4

                        lg:grid-cols-12
                        lg:grid-rows-2
                        lg:gap-5
                    "
                >
                    <InspiracionCard
                        item={
                            paletas
                        }
                        t={
                            t
                        }
                        onOpenCollections={
                            onOpenCollections
                        }
                        className="
                            min-h-[480px]

                            lg:col-span-8
                            lg:row-span-2
                            lg:min-h-[720px]
                        "
                        featured
                    />


                    <InspiracionCard
                        item={
                            capas
                        }
                        t={
                            t
                        }
                        onOpenCollections={
                            onOpenCollections
                        }
                        className="
                            min-h-[340px]

                            lg:col-span-4
                            lg:row-span-1
                            lg:min-h-0
                        "
                    />


                    <InspiracionCard
                        item={
                            combinaciones
                        }
                        t={
                            t
                        }
                        onOpenCollections={
                            onOpenCollections
                        }
                        className="
                            min-h-[340px]

                            lg:col-span-4
                            lg:row-span-1
                            lg:min-h-0
                        "
                    />
                </div>
            </div>
        </section>
    );
}


function InspiracionCard({
    item,
    t,
    onOpenCollections,
    className = "",
    featured = false,
}) {
    if (!item) {
        return null;
    }


    const title =
        item.titleKey
            ? t(
                item.titleKey
            )
            : item.title;


    const description =
        item.descriptionKey
            ? t(
                item.descriptionKey
            )
            : item.description;


    const handleClick =
        () => {
            if (
                !Array.isArray(
                    item.collections
                ) ||
                item.collections.length === 0 ||
                !onOpenCollections
            ) {
                return;
            }


            onOpenCollections(
                item.collections
            );
        };


    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 24,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.15,
            }}
            transition={{
                duration: 0.65,
            }}
            className={`
                group
                relative
                overflow-hidden
                rounded-[28px]
                bg-stone-300

                ${className}
            `}
        >
            <button
                type="button"
                onClick={
                    handleClick
                }
                className="
                    absolute
                    inset-0
                    block
                    h-full
                    w-full
                    cursor-pointer
                    text-left
                "
            >
                <img
                    src={
                        item.image
                    }
                    alt={
                        title
                    }
                    loading="lazy"
                    decoding="async"
                    className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-[1200ms]
                        ease-out

                        group-hover:scale-[1.035]
                    "
                />


                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/70
                        via-black/15
                        to-black/5
                    "
                />


                <div
                    className="
                        absolute
                        left-5
                        top-5

                        flex
                        items-center
                        gap-3

                        sm:left-6
                        sm:top-6
                    "
                >
                    <span
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.25em]
                            text-white/70
                        "
                    >
                        {
                            item.number
                        }
                    </span>


                    <span
                        className="
                            h-px
                            w-8
                            bg-white/40
                        "
                    />
                </div>


                <div
                    className="
                        absolute
                        right-5
                        top-5

                        sm:right-6
                        sm:top-6
                    "
                >
                    <span
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/30
                            bg-white/10
                            text-white
                            backdrop-blur-md
                            transition-all
                            duration-300

                            group-hover:bg-white
                            group-hover:text-stone-950
                        "
                    >
                        <ArrowUpRight
                            className="
                                h-4
                                w-4
                            "
                        />
                    </span>
                </div>


                <div
                    className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        p-6

                        sm:p-7

                        lg:p-8
                    "
                >
                    <h3
                        className={`
                            font-light
                            leading-none
                            tracking-[-0.04em]
                            text-white

                            ${featured
                                ? `
                                        text-4xl
                                        sm:text-5xl
                                        lg:text-6xl
                                    `
                                : `
                                        text-3xl
                                        lg:text-4xl
                                    `
                            }
                        `}
                    >
                        {
                            title
                        }
                    </h3>


                    {description && (
                        <p
                            className={`
                                mt-4
                                text-sm
                                leading-6
                                text-white/70

                                ${featured
                                    ? `
                                            max-w-lg
                                        `
                                    : `
                                            max-w-sm
                                        `
                                }
                            `}
                        >
                            {
                                description
                            }
                        </p>
                    )}
                </div>
            </button>
        </motion.article>
    );
}