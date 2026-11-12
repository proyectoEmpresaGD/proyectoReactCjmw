import MarcaLogo from "./MarcaLogo";
import {
    useTranslation,
} from "react-i18next";

import {
    motion,
} from "framer-motion";


export default function InicioPresentacionGrupo({
    pillars,
}) {
    const {
        t,
    } = useTranslation(
        "homePage"
    );


    return (
        <section
            id="home-group-intro"
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
                <div
                    className="
                        grid
                        gap-10
                        border-b
                        border-stone-300
                        pb-14

                        lg:grid-cols-12
                        lg:gap-12
                        lg:pb-20
                    "
                >
                    <motion.div
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
                            amount: 0.25,
                        }}
                        transition={{
                            duration: 0.6,
                        }}
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

                            <MarcaLogo brand="cjm-group" className="w-[156px] sm:w-[172px]" />
                        </div>


                        <h2
                            className="
                                mt-6
                                max-w-5xl
                                text-4xl
                                font-light
                                leading-[1.02]
                                tracking-[-0.055em]
                                text-stone-950

                                sm:text-5xl

                                lg:text-6xl

                                xl:text-7xl
                            "
                        >
                            {t(
                                "group.titleLine1"
                            )}

                            <br />

                            <span
                                className="
                                    text-stone-400
                                "
                            >
                                {t(
                                    "group.titleLine2"
                                )}
                            </span>
                        </h2>
                    </motion.div>


                    <motion.div
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
                            amount: 0.25,
                        }}
                        transition={{
                            duration: 0.6,
                            delay: 0.08,
                        }}
                        className="
                            flex
                            items-end

                            lg:col-span-4
                            lg:col-start-9
                        "
                    >
                        <p
                            className="
                                max-w-lg
                                text-sm
                                leading-7
                                text-stone-500

                                lg:text-[15px]
                                lg:leading-8
                            "
                        >
                            {t(
                                "group.description"
                            )}
                        </p>
                    </motion.div>
                </div>


                <div
                    className="
                        grid
                        gap-0

                        md:grid-cols-3
                    "
                >
                    {pillars.map(
                        (
                            pillar,
                            index
                        ) => (
                            <motion.article
                                key={
                                    pillar.key
                                }
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                    amount: 0.3,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay:
                                        index *
                                        0.07,
                                }}
                                className="
                                    border-b
                                    border-stone-300
                                    py-8

                                    md:border-b-0
                                    md:border-r
                                    md:px-8
                                    md:py-10

                                    md:first:pl-0
                                    md:last:border-r-0
                                    md:last:pr-0
                                "
                            >
                                <span className="block h-px w-10 bg-stone-400" aria-hidden="true" />


                                <h3
                                    className="
                                        mt-5
                                        text-2xl
                                        font-light
                                        tracking-[-0.035em]
                                        text-stone-950
                                    "
                                >
                                    {
                                        t(
                                            pillar.titleKey
                                        )
                                    }
                                </h3>


                                <p
                                    className="
                                        mt-4
                                        max-w-sm
                                        text-sm
                                        leading-6
                                        text-stone-500
                                    "
                                >
                                    {
                                        t(
                                            pillar.descriptionKey
                                        )
                                    }
                                </p>
                            </motion.article>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}