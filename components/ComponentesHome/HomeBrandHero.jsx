import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    ArrowDown,
    ArrowRight,
} from "lucide-react";


const formatIndex = (
    value
) =>
    String(
        value
    ).padStart(
        2,
        "0"
    );


export default function HomeBrandHero({
    brands,
    activeBrand,
    activeIndex,
    onSelectBrand,
    onOpenBrand,
    onOpenCollections,
}) {
    if (
        !activeBrand
    ) {
        return null;
    }


    const handleScrollToGallery =
        () => {
            document
                .getElementById(
                    "home-brand-gallery"
                )
                ?.scrollIntoView({
                    behavior:
                        "smooth",
                });
        };


    return (
        <section
            className="
                relative
                isolate
                min-h-[100svh]
                overflow-hidden
                bg-stone-950
                text-white
            "
        >
            <AnimatePresence
                mode="sync"
                initial={
                    false
                }
            >
                <motion.div
                    key={
                        activeBrand.key
                    }
                    initial={{
                        opacity:
                            0,
                        scale:
                            1.035,
                    }}
                    animate={{
                        opacity:
                            1,
                        scale:
                            1,
                    }}
                    exit={{
                        opacity:
                            0,
                    }}
                    transition={{
                        opacity: {
                            duration:
                                0.65,
                        },

                        scale: {
                            duration:
                                1.2,

                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        },
                    }}
                    className="
                        absolute
                        inset-0
                        -z-30
                    "
                >
                    <img
                        src={
                            activeBrand.background
                        }
                        alt=""
                        aria-hidden="true"
                        className="
                            h-full
                            w-full
                            object-cover
                            object-center
                        "
                    />
                </motion.div>
            </AnimatePresence>


            <div
                className="
                    absolute
                    inset-0
                    -z-20
                    bg-black/15
                "
            />


            <div
                className="
                    absolute
                    inset-0
                    -z-20
                    bg-gradient-to-r
                    from-black/70
                    via-black/30
                    to-black/5
                "
            />


            <div
                className="
                    absolute
                    inset-0
                    -z-20
                    bg-gradient-to-t
                    from-black/75
                    via-transparent
                    to-black/20
                "
            />


            <div
                className="
                    mx-auto
                    flex
                    min-h-[100svh]
                    w-full
                    max-w-[1800px]
                    flex-col
                    justify-end
                    px-5
                    pb-40
                    pt-32

                    sm:px-8

                    lg:px-12
                    lg:pb-44

                    xl:px-16
                "
            >
                <AnimatePresence
                    mode="wait"
                >
                    <motion.div
                        key={
                            activeBrand.key
                        }
                        initial={{
                            opacity:
                                0,
                            y:
                                24,
                        }}
                        animate={{
                            opacity:
                                1,
                            y:
                                0,
                        }}
                        exit={{
                            opacity:
                                0,
                            y:
                                -12,
                        }}
                        transition={{
                            duration:
                                0.45,

                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                        className="
                            max-w-3xl
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-4
                            "
                        >
                            <span
                                className="
                                    text-[10px]
                                    font-semibold
                                    tracking-[0.24em]
                                    text-white/65
                                "
                            >
                                {formatIndex(
                                    activeIndex +
                                    1
                                )}
                                {" / "}
                                {formatIndex(
                                    brands.length
                                )}
                            </span>


                            <span
                                className="
                                    h-px
                                    w-12
                                    bg-white/40
                                "
                            />


                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.26em]
                                    text-white/70
                                "
                            >
                                {
                                    activeBrand.eyebrow
                                }
                            </p>
                        </div>


                        <h1
                            className="
                                mt-6
                                text-[3.6rem]
                                font-light
                                leading-[0.88]
                                tracking-[-0.065em]
                                text-white

                                sm:text-[5rem]

                                lg:text-[7rem]

                                xl:text-[8.5rem]
                            "
                        >
                            {
                                activeBrand.title
                            }
                        </h1>


                        <p
                            className="
                                mt-7
                                max-w-xl
                                text-sm
                                leading-7
                                text-white/70

                                sm:text-base
                            "
                        >
                            {
                                activeBrand.description
                            }
                        </p>


                        <div
                            className="
                                mt-8
                                flex
                                flex-wrap
                                items-center
                                gap-3
                            "
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    onOpenBrand(
                                        activeBrand
                                    )
                                }
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-4
                                    rounded-full
                                    bg-white
                                    px-6
                                    py-3.5
                                    text-sm
                                    font-medium
                                    text-stone-950
                                    transition

                                    hover:bg-stone-100
                                "
                            >
                                Descubrir marca

                                <ArrowRight
                                    className="
                                        h-4
                                        w-4
                                        transition-transform
                                        duration-300

                                        group-hover:translate-x-1
                                    "
                                />
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    onOpenCollections(
                                        activeBrand
                                    )
                                }
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-3
                                    rounded-full
                                    border
                                    border-white/30
                                    bg-white/5
                                    px-6
                                    py-3.5
                                    text-sm
                                    font-medium
                                    text-white
                                    backdrop-blur-md
                                    transition

                                    hover:border-white/60
                                    hover:bg-white/10
                                "
                            >
                                Ver colecciones

                                <ArrowRight
                                    className="
                                        h-4
                                        w-4
                                        transition-transform
                                        duration-300

                                        group-hover:translate-x-1
                                    "
                                />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>


            <div
                className="
                    absolute
                    inset-x-0
                    bottom-0
                    border-t
                    border-white/15
                    bg-black/15
                    backdrop-blur-md
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        max-w-[1800px]
                        items-stretch
                        overflow-x-auto
                        px-5

                        sm:px-8

                        lg:px-12

                        xl:px-16
                    "
                >
                    {brands.map(
                        (
                            brand,
                            index
                        ) => {
                            const isActive =
                                brand.key ===
                                activeBrand.key;


                            return (
                                <button
                                    key={
                                        brand.key
                                    }
                                    type="button"
                                    onClick={() =>
                                        onSelectBrand(
                                            brand.key
                                        )
                                    }
                                    onFocus={() =>
                                        onSelectBrand(
                                            brand.key
                                        )
                                    }
                                    className={`
                                        group
                                        relative
                                        flex
                                        min-w-max
                                        flex-1
                                        items-center
                                        gap-3
                                        px-4
                                        py-6
                                        text-left
                                        transition

                                        first:pl-0

                                        lg:px-6

                                        ${
                                            isActive
                                                ? `
                                                    text-white
                                                `
                                                : `
                                                    text-white/45

                                                    hover:text-white/80
                                                `
                                        }
                                    `}
                                >
                                    <span
                                        className="
                                            text-[9px]
                                            font-semibold
                                            tracking-[0.18em]
                                            opacity-60
                                        "
                                    >
                                        {formatIndex(
                                            index +
                                            1
                                        )}
                                    </span>


                                    <span
                                        className="
                                            text-xs
                                            font-medium
                                            uppercase
                                            tracking-[0.18em]

                                            lg:text-sm
                                        "
                                    >
                                        {
                                            brand.title
                                        }
                                    </span>


                                    <span
                                        className={`
                                            absolute
                                            inset-x-4
                                            bottom-0
                                            h-[2px]
                                            origin-left
                                            bg-white
                                            transition-transform
                                            duration-500

                                            first:left-0

                                            ${
                                                isActive
                                                    ? `
                                                        scale-x-100
                                                    `
                                                    : `
                                                        scale-x-0
                                                    `
                                            }
                                        `}
                                    />
                                </button>
                            );
                        }
                    )}
                </div>
            </div>


            <button
                type="button"
                onClick={
                    handleScrollToGallery
                }
                aria-label="Descubrir las cinco marcas"
                className="
                    absolute
                    bottom-28
                    right-5
                    hidden
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/25
                    bg-black/10
                    text-white
                    backdrop-blur-md
                    transition

                    hover:bg-white
                    hover:text-stone-950

                    md:flex

                    lg:right-12

                    xl:right-16
                "
            >
                <ArrowDown
                    className="
                        h-4
                        w-4
                    "
                />
            </button>
        </section>
    );
}
