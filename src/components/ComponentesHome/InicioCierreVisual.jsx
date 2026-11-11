import { useTranslation } from "react-i18next";

import {
    motion,
} from "framer-motion";

import {
    ArrowRight,
} from "lucide-react";


export default function HomeClosingVisual({
    content,
    onOpenCollections,
}) {
    const {
        t,
    } = useTranslation(
        "homePage"
    );


    if (
        !content
    ) {
        return null;
    }


    return (
        <section
            className="
                relative
                min-h-[72vh]
                overflow-hidden
                bg-stone-950
                text-white
            "
        >
            <img
                src={
                    content.image
                }
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                "
            />


            <div
                className="
                    absolute
                    inset-0
                    bg-black/30
                "
            />


            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-black/75
                    via-black/25
                    to-transparent
                "
            />


            <div
                className="
                    relative
                    mx-auto
                    flex
                    min-h-[72vh]
                    max-w-[1800px]
                    items-end
                    px-5
                    py-16

                    sm:px-8

                    lg:px-12
                    lg:py-20

                    xl:px-16
                "
            >
                <motion.div
                    initial={{
                        opacity:
                            0,
                        y:
                            26,
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
                            0.2,
                    }}
                    transition={{
                        duration:
                            0.65,
                    }}
                    className="
                        max-w-4xl
                    "
                >
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.26em]
                            text-white/60
                        "
                    >
                        {
                            content.eyebrow
                        }
                    </p>


                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-light
                            leading-[1.02]
                            tracking-[-0.055em]

                            sm:text-5xl

                            lg:text-7xl
                        "
                    >
                        {
                            t(content.titleKey)
                        }
                    </h2>


                    <div
                        className="
                            mt-7
                            flex
                            flex-col
                            gap-6

                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >
                        <p
                            className="
                                max-w-xl
                                text-sm
                                leading-7
                                text-white/65
                            "
                        >
                            {
                                t(content.descriptionKey)
                            }
                        </p>


                        <button
                            type="button"
                            onClick={
                                onOpenCollections
                            }
                            className="
                                group
                                inline-flex
                                w-fit
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
                            {t("closing.cta")}

                            <ArrowRight
                                className="
                                    h-4
                                    w-4
                                    transition-transform

                                    group-hover:translate-x-1
                                "
                            />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
