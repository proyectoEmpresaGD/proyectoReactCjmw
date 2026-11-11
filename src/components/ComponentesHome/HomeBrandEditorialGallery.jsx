import {
    motion,
} from "framer-motion";

import {
    ArrowUpRight,
} from "lucide-react";


const EDITORIAL_LAYOUT = {
    arena: `
        md:col-span-5
        md:row-span-2
    `,

    bassari: `
        md:col-span-7
    `,

    cjm: `
        md:col-span-7
    `,

    flamenco: `
        md:col-span-7
    `,

    harbour: `
        md:col-span-5
    `,
};


export default function HomeBrandEditorialGallery({
    brands,
    onOpenBrand,
}) {
    return (
        <section
            id="home-brand-gallery"
            className="
                bg-[#f7f5f1]
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
                    max-w-[1800px]
                "
            >
                <header
                    className="
                        mb-12
                        grid
                        gap-8

                        lg:grid-cols-12
                        lg:items-end
                        lg:gap-10

                        xl:mb-16
                    "
                >
                    <div
                        className="
                            lg:col-span-7
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
                                    h-px
                                    w-10
                                    bg-stone-400
                                "
                            />

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.26em]
                                    text-stone-500
                                "
                            >
                                CJM Group
                            </p>
                        </div>


                        <h2
                            className="
                                mt-5
                                max-w-4xl
                                text-4xl
                                font-light
                                leading-[1.03]
                                tracking-[-0.05em]
                                text-stone-950

                                sm:text-5xl

                                lg:text-6xl
                            "
                        >
                            Cinco identidades.
                            <br />

                            <span
                                className="
                                    text-stone-400
                                "
                            >
                                Una misma visión.
                            </span>
                        </h2>
                    </div>


                    <div
                        className="
                            lg:col-span-4
                            lg:col-start-9
                        "
                    >
                        <p
                            className="
                                max-w-md
                                text-sm
                                leading-7
                                text-stone-500

                                lg:ml-auto
                            "
                        >
                            Cada marca interpreta
                            el interior desde una
                            mirada propia. Materiales,
                            color, tradición y diseño
                            contemporáneo reunidos en
                            cinco universos diferentes.
                        </p>
                    </div>
                </header>


                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4

                        md:grid-cols-12
                        md:auto-rows-[260px]

                        lg:auto-rows-[310px]
                        lg:gap-5
                    "
                >
                    {brands.map(
                        (
                            brand,
                            index
                        ) => (
                            <EditorialBrandCard
                                key={
                                    brand.key
                                }
                                brand={
                                    brand
                                }
                                index={
                                    index
                                }
                                className={
                                    EDITORIAL_LAYOUT[
                                        brand.key
                                    ] ||
                                    "md:col-span-6"
                                }
                                onClick={() =>
                                    onOpenBrand(
                                        brand
                                    )
                                }
                            />
                        )
                    )}
                </div>
            </div>
        </section>
    );
}


function EditorialBrandCard({
    brand,
    index,
    className,
    onClick,
}) {
    return (
        <motion.button
            type="button"
            onClick={
                onClick
            }
            initial={{
                opacity:
                    0,
                y:
                    30,
            }}
            whileInView={{
                opacity:
                    1,
                y:
                    0,
            }}
            viewport={{
                once:
                    true,

                amount:
                    0.15,
            }}
            transition={{
                duration:
                    0.6,

                delay:
                    Math.min(
                        index,
                        4
                    ) *
                    0.06,

                ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                ],
            }}
            className={`
                group
                relative
                min-h-[380px]
                overflow-hidden
                rounded-[26px]
                bg-stone-200
                text-left

                md:min-h-0

                ${className}
            `}
        >
            <img
                src={
                    brand.editorialImage
                }
                alt={
                    brand.title
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
                    duration-[900ms]
                    ease-out

                    group-hover:scale-[1.035]
                "
            />


            <div
                className="
                    absolute
                    inset-0
                    bg-black/10
                    transition-colors
                    duration-500

                    group-hover:bg-black/20
                "
            />


            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/10
                    to-transparent
                "
            />


            <div
                className="
                    absolute
                    right-5
                    top-5
                    flex
                    h-10
                    min-w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/30
                    bg-black/10
                    px-3
                    text-[9px]
                    font-semibold
                    tracking-[0.18em]
                    text-white
                    backdrop-blur-md

                    lg:right-6
                    lg:top-6
                "
            >
                {String(
                    index +
                    1
                ).padStart(
                    2,
                    "0"
                )}
            </div>


            <div
                className="
                    absolute
                    inset-x-0
                    bottom-0
                    p-6

                    lg:p-8
                "
            >
                <p
                    className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.24em]
                        text-white/60
                    "
                >
                    {
                        brand.eyebrow
                    }
                </p>


                <div
                    className="
                        mt-3
                        flex
                        items-end
                        justify-between
                        gap-6
                    "
                >
                    <div
                        className="
                            min-w-0
                        "
                    >
                        <h3
                            className="
                                text-3xl
                                font-light
                                tracking-[-0.045em]
                                text-white

                                lg:text-4xl
                            "
                        >
                            {
                                brand.title
                            }
                        </h3>


                        <p
                            className="
                                mt-3
                                max-w-md
                                text-sm
                                leading-6
                                text-white/65
                                transition
                                duration-500

                                lg:translate-y-3
                                lg:opacity-0

                                lg:group-hover:translate-y-0
                                lg:group-hover:opacity-100
                            "
                        >
                            {
                                brand.description
                            }
                        </p>
                    </div>


                    <span
                        className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-stone-950
                            transition-all
                            duration-300

                            group-hover:rotate-6
                            group-hover:scale-110
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
            </div>


            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    rounded-[26px]
                    border
                    border-white/10
                "
            />
        </motion.button>
    );
}
