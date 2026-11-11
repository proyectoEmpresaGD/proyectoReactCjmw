import {
    ArrowUpRight,
    Linkedin,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    BRAND_INSTAGRAM_LINKS,
    LOGO_URL,
    NAVIGATION_LINKS,
    PDF_LINKS,
    SOCIAL_MEDIA_LINKS,
} from "../Constants/constants";

import {
    useMarca,
} from "./MarcaContext";

import {
    useTranslation,
} from "react-i18next";

import InstagramDropdown
    from "./InstagramDropdown";


const brandLinks = [
    {
        key: "arena",
        to: "/arenaHome",
        img: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoArena.png",
        alt: "Arena",
    },

    {
        key: "bassari",
        to: "/bassariHome",
        img: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png",
        alt: "Bassari",
    },

    {
        key: "flamenco",
        to: "/flamencoHome",
        img: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoFlamenco.png",
        alt: "Flamenco",
    },

    {
        key: "harbour",
        to: "/harbourHome",
        img: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoHarbour.png",
        alt: "Harbour",
    },

    {
        key: "cjm",
        to: "/cjmHome",
        img: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM-sintexto.png",
        alt: "CJM",
    },
];


const Footer = () => {
    const {
        setMarcaActiva,
    } = useMarca();

    const {
        t,
    } = useTranslation(
        "footer"
    );


    const resetBrand = () => {
        setMarcaActiva(
            null
        );
    };


    return (
        <footer
            className="
                overflow-hidden
                bg-stone-950
                text-stone-100
            "
        >
            <div
                className="
                    mx-auto
                    max-w-[1800px]
                    px-5
                    pb-7
                    pt-14

                    sm:px-8
                    sm:pt-16

                    lg:px-12
                    lg:pb-9
                    lg:pt-20

                    xl:px-16
                "
            >
                <div
                    className="
                        grid
                        gap-10
                        border-b
                        border-white/10
                        pb-12

                        sm:gap-12
                        sm:pb-14

                        lg:grid-cols-12
                        lg:gap-8
                        lg:pb-16
                    "
                >
                    <div
                        className="
                            lg:col-span-5
                        "
                    >
                        <Link
                            to="/"
                            onClick={
                                resetBrand
                            }
                            className="
                                inline-block
                            "
                        >
                            <img
                                src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOTIPOS%20AMBIENTADOS/NAVIDAD/LOGO%20NAVIDAD%20BLANCO.webp"

                                alt={
                                    t(
                                        "altLogo"
                                    )
                                }
                                loading="lazy"
                                decoding="async"
                                className="
                                    h-auto
                                    w-32
                                    object-contain
                                    sm:w-40
                                "
                            />
                        </Link>


                        <h2
                            className="
                                mt-7
                                max-w-lg
                                text-2xl
                                font-light
                                leading-[1.15]
                                tracking-[-0.04em]
                                text-stone-100

                                sm:mt-8
                                sm:text-4xl
                            "
                        >
                            {t(
                                "claimLine1"
                            )}

                            <span
                                className="
                                    text-stone-500
                                "
                            >
                                {" "}
                                {t(
                                    "claimLine2"
                                )}
                            </span>
                        </h2>


                        <p
                            className="
                                mt-5
                                max-w-md
                                text-sm
                                font-light
                                leading-7
                                text-stone-400
                            "
                        >
                            {t(
                                "description"
                            )}
                        </p>


                        <div
                            className="
                                mt-7
                                flex
                                items-center
                                gap-3

                                sm:mt-8
                            "
                        >
                            <InstagramDropdown
                                items={
                                    BRAND_INSTAGRAM_LINKS
                                }
                                buttonClassName="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/15
                                    bg-white/5
                                    transition-all
                                    duration-300

                                    hover:border-white/30
                                    hover:bg-white/10
                                "
                            />


                            <a
                                href={
                                    SOCIAL_MEDIA_LINKS.linkedin
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-white/15
                                    bg-white/5
                                    text-white
                                    transition-all
                                    duration-300

                                    hover:border-white/30
                                    hover:bg-white/10
                                "
                            >
                                <Linkedin
                                    className="
                                        h-[17px]
                                        w-[17px]
                                    "
                                />
                            </a>
                        </div>
                    </div>


                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-x-6
                            gap-y-8

                            sm:grid-cols-3
                            sm:gap-x-8
                            sm:gap-y-10

                            lg:col-span-7
                            lg:grid-cols-3
                        "
                    >
                        <FooterColumn
                            title={
                                t(
                                    "sections.brands"
                                )
                            }
                        >
                            {brandLinks.map(
                                brand => (
                                    <Link
                                        key={
                                            brand.key
                                        }
                                        to={
                                            brand.to
                                        }
                                        onClick={
                                            resetBrand
                                        }
                                        className="
                                            group
                                            inline-flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-stone-400
                                            transition-colors

                                            hover:text-white
                                        "
                                    >
                                        {
                                            brand.alt
                                        }

                                        <ArrowUpRight
                                            className="
                                                h-3
                                                w-3
                                                opacity-0
                                                transition-all

                                                group-hover:-translate-y-0.5
                                                group-hover:translate-x-0.5
                                                group-hover:opacity-100
                                            "
                                        />
                                    </Link>
                                )
                            )}
                        </FooterColumn>


                        <FooterColumn
                            title={
                                t(
                                    "sections.company"
                                )
                            }
                        >
                            <Link
                                to={
                                    NAVIGATION_LINKS.about
                                }
                                className="
                                    text-sm
                                    text-stone-400
                                    transition-colors

                                    hover:text-white
                                "
                            >
                                {t(
                                    "aboutUs"
                                )}
                            </Link>


                            <Link
                                to={
                                    NAVIGATION_LINKS.contact
                                }
                                className="
                                    text-sm
                                    text-stone-400
                                    transition-colors

                                    hover:text-white
                                "
                            >
                                {t(
                                    "contactUs"
                                )}
                            </Link>
                        </FooterColumn>


                        <FooterColumn
                            title={
                                t(
                                    "sections.legal"
                                )
                            }
                            className="
                                col-span-2

                                sm:col-span-1
                            "
                        >
                            <ExternalFooterLink
                                href={
                                    PDF_LINKS.terminosCompra
                                }
                            >
                                {t(
                                    "terms"
                                )}
                            </ExternalFooterLink>


                            <ExternalFooterLink
                                href={
                                    PDF_LINKS.politicaPrivacidad
                                }
                            >
                                {t(
                                    "privacyPolicy"
                                )}
                            </ExternalFooterLink>


                            <ExternalFooterLink
                                href={
                                    PDF_LINKS.politicaCookies
                                }
                            >
                                {t(
                                    "cookiePolicy"
                                )}
                            </ExternalFooterLink>
                        </FooterColumn>
                    </div>
                </div>


                <div
                    className="
                        border-b
                        border-white/10
                        py-9

                        sm:py-10

                        lg:py-12
                    "
                >
                    <div
                        className="
                            mb-7
                            flex
                            items-center
                            justify-between
                            gap-6
                        "
                    >
                        <p
                            className="
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.28em]
                                text-stone-500
                            "
                        >
                            {t(
                                "ourBrands"
                            )}
                        </p>


                        <span
                            className="
                                hidden
                                text-[9px]
                                tracking-[0.2em]
                                text-stone-600

                                sm:block
                            "
                        >
                            CJM Group
                        </span>
                    </div>


                    <div
                        className="
                            grid
                            grid-cols-2
                            items-center
                            gap-x-8
                            gap-y-8

                            sm:grid-cols-3

                            lg:grid-cols-5
                            lg:gap-x-12
                        "
                    >
                        {brandLinks.map(
                            brand => (
                                <Link
                                    key={
                                        brand.key
                                    }
                                    to={
                                        brand.to
                                    }
                                    onClick={
                                        resetBrand
                                    }
                                    className="
                                        group
                                        flex
                                        min-h-12
                                        items-center
                                        justify-center
                                        px-2
                                    "
                                >
                                    <img
                                        src={
                                            brand.img
                                        }
                                        alt={
                                            brand.alt
                                        }
                                        loading="lazy"
                                        decoding="async"
                                        className={`
                                            max-w-full
                                            object-contain
                                            grayscale
                                            brightness-0
                                            invert
                                            opacity-45
                                            transition-all
                                            duration-300

                                            group-hover:scale-[1.03]
                                            group-hover:opacity-100

                                            ${brand.alt === "CJM"
                                                ? "h-7 sm:h-8"
                                                : "h-8 sm:h-10"
                                            }
                                        `}
                                    />
                                </Link>
                            )
                        )}
                    </div>
                </div>


                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        pt-6
                        text-center

                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:gap-5
                        sm:pt-7
                        sm:text-left
                    "
                >
                    <p
                        className="
                            text-xs
                            text-stone-500
                        "
                    >
                        {t(
                            "copyright"
                        )}
                    </p>


                    <p
                        className="
                            text-[9px]
                            uppercase
                            tracking-[0.22em]
                            text-stone-600
                        "
                    >
                    </p>
                </div>
            </div>
        </footer>
    );
};


function FooterColumn({
    title,
    children,
    className = "",
}) {
    return (
        <div
            className={
                className
            }
        >
            <p
                className="
                    mb-5
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.26em]
                    text-stone-600
                "
            >
                {
                    title
                }
            </p>


            <div
                className="
                    flex
                    flex-col
                    items-start
                    gap-3.5
                "
            >
                {
                    children
                }
            </div>
        </div>
    );
}


function ExternalFooterLink({
    href,
    children,
}) {
    return (
        <a
            href={
                href
            }
            target="_blank"
            rel="noopener noreferrer"
            className="
                group
                inline-flex
                items-center
                gap-2
                text-sm
                text-stone-400
                transition-colors

                hover:text-white
            "
        >
            {
                children
            }

            <ArrowUpRight
                className="
                    h-3
                    w-3
                    opacity-0
                    transition-all

                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    group-hover:opacity-100
                "
            />
        </a>
    );
}


export default Footer;