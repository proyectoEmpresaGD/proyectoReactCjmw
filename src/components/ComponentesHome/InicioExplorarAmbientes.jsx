import MarcaLogo from "./MarcaLogo";
import { useTranslation } from "react-i18next";

import {
    motion,
} from "framer-motion";

import {
    ArrowUpRight,
} from "lucide-react";


export default function HomeExploreSpaces({
    spaces,
    onOpenRoute,
}) {
    const {
        t,
    } = useTranslation(
        "homePage"
    );


    if (
        !spaces?.length
    ) {
        return null;
    }


    const [
        mainSpace,
        ...secondarySpaces
    ] = spaces;


    return (
        <section
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
                        flex
                        flex-col
                        gap-5

                        lg:mb-16
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    "
                >
                    <div>
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.26em]
                                text-stone-500
                            "
                        >
                            {t("spaces.kicker")}
                        </p>


                        <h2
                            className="
                                mt-5
                                text-4xl
                                font-light
                                leading-[1.03]
                                tracking-[-0.05em]
                                text-stone-950

                                sm:text-5xl

                                lg:text-6xl
                            "
                        >
                            {t("spaces.titleLine1")}
                            <br />

                            <span
                                className="
                                    text-stone-400
                                "
                            >
                                {t("spaces.titleLine2")}
                            </span>
                        </h2>
                    </div>


                    <p
                        className="
                            max-w-md
                            text-sm
                            leading-7
                            text-stone-500
                        "
                    >
                        {t("spaces.description")}
                    </p>
                </header>


                <div
                    className="
                        grid
                        gap-5

                        lg:grid-cols-12
                        lg:auto-rows-[300px]
                    "
                >
                    <SpaceCard
                        space={
                            mainSpace
                        }
                        className="
                            lg:col-span-7
                            lg:row-span-2
                        "
                        titleClassName="
                            text-4xl

                            lg:text-5xl
                        "
                        t={
                            t
                        }
                        onClick={() =>
                            onOpenRoute(
                                mainSpace.route
                            )
                        }
                    />


                    {secondarySpaces.map(
                        space => (
                            <SpaceCard
                                key={
                                    space.key
                                }
                                space={
                                    space
                                }
                                className="
                                    lg:col-span-5
                                "
                                titleClassName="
                                    text-3xl
                                "
                                t={
                                    t
                                }
                                onClick={() =>
                                    onOpenRoute(
                                        space.route
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


function SpaceCard({
    space,
    className,
    titleClassName,
    t,
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
                    0.15,
            }}
            transition={{
                duration:
                    0.6,
            }}
            className={`
                group
                relative
                min-h-[390px]
                overflow-hidden
                rounded-[28px]
                bg-stone-200
                text-left

                lg:min-h-0

                ${className}
            `}
        >
            <img
                src={
                    space.image
                }
                alt={
                    t(space.titleKey)
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
                    duration-[1000ms]
                    ease-out

                    group-hover:scale-[1.035]
                "
            />


            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/75
                    via-black/10
                    to-transparent
                "
            />


            <div
                className="
                    absolute
                    inset-x-0
                    bottom-0
                    p-6

                    lg:p-8
                "
            >
                <div className="flex min-h-9 items-center">
                    <MarcaLogo brand={space.eyebrow} light className="w-[145px] max-h-10" />
                </div>


                <div
                    className="
                        mt-3
                        flex
                        items-end
                        justify-between
                        gap-6
                    "
                >
                    <div>
                        <h3
                            className={`
                                font-light
                                tracking-[-0.045em]
                                text-white

                                ${titleClassName}
                            `}
                        >
                            {
                                t(space.titleKey)
                            }
                        </h3>


                        <p
                            className="
                                mt-3
                                max-w-md
                                text-sm
                                leading-6
                                text-white/70
                            "
                        >
                            {
                                t(space.descriptionKey)
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
                            transition-transform
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
        </motion.button>
    );
}
