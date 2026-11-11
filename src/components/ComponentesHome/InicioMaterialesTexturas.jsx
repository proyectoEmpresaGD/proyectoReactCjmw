import { useTranslation } from "react-i18next";

import {
    motion,
} from "framer-motion";

import {
    ArrowRight,
} from "lucide-react";


export default function HomeMaterialsTextures({
    materials,
    onOpenProducts,
}) {
    const {
        t,
    } = useTranslation(
        "homePage"
    );


    if (
        !materials?.length
    ) {
        return null;
    }


    return (
        <section
            className="
                bg-stone-950
                px-5
                py-20
                text-white

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
                <div
                    className="
                        grid
                        gap-10

                        lg:grid-cols-12
                        lg:gap-12
                    "
                >
                    <div
                        className="
                            lg:col-span-4
                        "
                    >
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.26em]
                                text-white/45
                            "
                        >
                            {t("materials.kicker")}
                        </p>


                        <h2
                            className="
                                mt-5
                                text-4xl
                                font-light
                                leading-[1.03]
                                tracking-[-0.05em]

                                sm:text-5xl

                                lg:text-6xl
                            "
                        >
                            {t("materials.titleLine1")}
                            <br />

                            <span
                                className="
                                    text-white/40
                                "
                            >
                                {t("materials.titleLine2")}
                            </span>
                        </h2>


                        <p
                            className="
                                mt-7
                                max-w-sm
                                text-sm
                                leading-7
                                text-white/55
                            "
                        >
                            {t("materials.description")}
                        </p>


                        <button
                            type="button"
                            onClick={
                                onOpenProducts
                            }
                            className="
                                group
                                mt-8
                                inline-flex
                                items-center
                                gap-3
                                rounded-full
                                border
                                border-white/20
                                px-5
                                py-3
                                text-sm
                                text-white
                                transition

                                hover:border-white/50
                                hover:bg-white
                                hover:text-stone-950
                            "
                        >
                            {t("materials.exploreFabrics")}

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


                    <div
                        className="
                            grid
                            gap-6

                            md:grid-cols-3

                            lg:col-span-8
                        "
                    >
                        {materials.map(
                            (
                                material,
                                index
                            ) => (
                                <motion.article
                                    key={
                                        material.key
                                    }
                                    initial={{
                                        opacity:
                                            0,
                                        y:
                                            24,
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
                                            0.55,
                                        delay:
                                            index *
                                            0.07,
                                    }}
                                >
                                    <div
                                        className="
                                            aspect-square
                                            overflow-hidden
                                            rounded-full
                                            bg-white/10
                                        "
                                    >
                                        <img
                                            src={
                                                material.image
                                            }
                                            alt={
                                                t(material.titleKey)
                                            }
                                            loading="lazy"
                                            decoding="async"
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                        />
                                    </div>


                                    <div
                                        className="
                                            mt-6
                                            border-t
                                            border-white/15
                                            pt-5
                                        "
                                    >
                                        <span
                                            className="
                                                text-[9px]
                                                font-semibold
                                                tracking-[0.2em]
                                                text-white/35
                                            "
                                        >
                                            {
                                                material.number
                                            }
                                        </span>


                                        <h3
                                            className="
                                                mt-3
                                                text-xl
                                                font-light
                                                tracking-[-0.03em]
                                            "
                                        >
                                            {
                                                t(material.titleKey)
                                            }
                                        </h3>


                                        <p
                                            className="
                                                mt-3
                                                text-sm
                                                leading-6
                                                text-white/50
                                            "
                                        >
                                            {
                                                t(material.descriptionKey)
                                            }
                                        </p>
                                    </div>
                                </motion.article>
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
