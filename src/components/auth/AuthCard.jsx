export default function AuthCard({
    eyebrow = "CJM Group",
    title,
    subtitle,
    sideLabel,
    sideTitle,
    sideDescription,
    sideImage = "/1200ARENADUNE01.jpg",
    sideContent = null,
    children,
}) {
    const hasSideContent =
        Boolean(
            sideContent
        );


    /*
     * REGISTER
     *
     * Cuando existe sideContent utilizamos
     * una imagen superior común y dos columnas
     * blancas exactamente con el mismo estilo.
     */
    if (
        hasSideContent
    ) {
        return (
            <section
                className="
                    w-full
                    overflow-hidden
                    rounded-[30px]
                    border
                    border-stone-200/80
                    bg-white
                    shadow-[0_30px_90px_rgba(28,25,23,0.10)]

                    lg:rounded-[36px]
                "
            >
                {/* IMAGEN SUPERIOR COMÚN */}
                <div
                    className="
                        relative
                        h-[180px]
                        overflow-hidden

                        sm:h-[210px]

                        lg:h-[230px]
                    "
                >
                    <img
                        src={
                            sideImage
                        }
                        alt=""
                        aria-hidden="true"
                        className="
                            absolute
                            inset-0
                            h-full
                            w-full
                            object-cover
                            object-center
                        "
                    />


                    <div
                        className="
                            absolute
                            inset-0
                            bg-gradient-to-r
                            from-black/65
                            via-black/35
                            to-black/15
                        "
                    />


                    <div
                        className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/25
                            via-transparent
                            to-transparent
                        "
                    />


                    <div
                        className="
                            relative
                            flex
                            h-full
                            items-end
                            px-6
                            pb-7

                            sm:px-9

                            lg:px-12
                            lg:pb-9
                        "
                    >
                        <div
                            className="
                                max-w-2xl
                            "
                        >
                            {sideLabel ? (
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >
                                    <span
                                        className="
                                            h-px
                                            w-8
                                            bg-white/50
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
                                            sideLabel
                                        }
                                    </p>
                                </div>
                            ) : null}


                            {sideTitle ? (
                                <h2
                                    className="
                                        mt-3
                                        text-2xl
                                        font-light
                                        leading-tight
                                        tracking-[-0.04em]
                                        text-white

                                        sm:text-3xl

                                        lg:text-4xl
                                    "
                                >
                                    {
                                        sideTitle
                                    }
                                </h2>
                            ) : null}


                            {sideDescription ? (
                                <p
                                    className="
                                        mt-3
                                        max-w-xl
                                        text-sm
                                        leading-6
                                        text-white/70
                                    "
                                >
                                    {
                                        sideDescription
                                    }
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>


                {/* CABECERA GENERAL */}
                <div
                    className="
                        border-b
                        border-stone-200
                        px-6
                        py-7

                        sm:px-9

                        lg:px-12
                        lg:py-8
                    "
                >
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.28em]
                            text-stone-400
                        "
                    >
                        {
                            eyebrow
                        }
                    </p>


                    <div
                        className="
                            mt-3

                            lg:flex
                            lg:items-end
                            lg:justify-between
                            lg:gap-10
                        "
                    >
                        <h1
                            className="
                                text-3xl
                                font-light
                                leading-tight
                                tracking-[-0.04em]
                                text-stone-950

                                sm:text-4xl
                            "
                        >
                            {
                                title
                            }
                        </h1>


                        {subtitle ? (
                            <p
                                className="
                                    mt-3
                                    max-w-xl
                                    text-sm
                                    leading-6
                                    text-stone-500

                                    lg:mt-0
                                    lg:text-right
                                "
                            >
                                {
                                    subtitle
                                }
                            </p>
                        ) : null}
                    </div>
                </div>


                {/* DOS COLUMNAS IDÉNTICAS */}
                <div
                    className="
                        grid

                        lg:grid-cols-2
                    "
                >
                    {/* IZQUIERDA */}
                    <div
                        className="
                            border-b
                            border-stone-200
                            bg-white
                            p-6

                            sm:p-9

                            lg:border-b-0
                            lg:border-r
                            lg:p-10

                            xl:p-12
                        "
                    >
                        {
                            sideContent
                        }
                    </div>


                    {/* DERECHA */}
                    <div
                        className="
                            bg-white
                            p-6

                            sm:p-9

                            lg:p-10

                            xl:p-12
                        "
                    >
                        {
                            children
                        }
                    </div>
                </div>
            </section>
        );
    }


    /*
     * RESTO DE PÁGINAS DE AUTENTICACIÓN
     *
     * Login, recuperación, etc.
     * mantienen el diseño clásico:
     * imagen izquierda + contenido derecha.
     */
    return (
        <section
            className="
                grid
                w-full
                overflow-hidden
                rounded-[30px]
                border
                border-stone-200/80
                bg-white
                shadow-[0_30px_90px_rgba(28,25,23,0.10)]

                lg:grid-cols-[1.04fr_0.96fr]
                lg:rounded-[36px]
            "
        >
            {/* IMAGEN */}
            <aside
                className="
                    relative
                    hidden
                    min-h-[680px]
                    overflow-hidden
                    bg-stone-950
                    text-white

                    lg:block
                "
            >
                <img
                    src={
                        sideImage
                    }
                    alt=""
                    aria-hidden="true"
                    className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        object-center
                    "
                />


                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-b
                        from-black/20
                        via-black/10
                        to-black/75
                    "
                />

                <div
                    className="
                        relative
                        flex
                        h-full
                        min-h-[680px]
                        flex-col
                        justify-between
                        p-10

                        xl:p-14
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <span
                            className="
                                h-px
                                w-10
                                bg-white/60
                            "
                        />

                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.28em]
                                text-white/80
                            "
                        >
                            {
                                sideLabel
                            }
                        </p>
                    </div>

                    <div
                        className="
                            max-w-xl
                        "
                    >
                        <p
                            className="
                                text-[11px]
                                font-medium
                                uppercase
                                tracking-[0.3em]
                                text-white/65
                            "
                        >
                            {
                                eyebrow
                            }
                        </p>

                        <h2
                            className="
                                mt-5
                                max-w-lg
                                text-4xl
                                font-light
                                leading-[1.08]
                                tracking-[-0.04em]

                                xl:text-5xl
                            "
                        >
                            {
                                sideTitle
                            }
                        </h2>

                        {sideDescription ? (
                            <p
                                className="
                                    mt-6
                                    max-w-lg
                                    text-sm
                                    leading-7
                                    text-white/75

                                    xl:text-[15px]
                                "
                            >
                                {
                                    sideDescription
                                }
                            </p>
                        ) : null}
                    </div>
                </div>
            </aside>

            {/* CONTENIDO */}
            <div
                className="
                    flex
                    items-center
                    bg-white
                    p-6

                    sm:p-9

                    lg:p-10

                    xl:p-12
                "
            >
                <div
                    className="
                        mx-auto
                        w-full
                        max-w-xl
                    "
                >
                    <div
                        className="
                            mb-8
                        "
                    >
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.28em]
                                text-stone-400
                            "
                        >
                            {
                                eyebrow
                            }
                        </p>


                        <h1
                            className="
                                mt-4
                                text-3xl
                                font-light
                                leading-tight
                                tracking-[-0.035em]
                                text-stone-950

                                sm:text-4xl
                            "
                        >
                            {
                                title
                            }
                        </h1>


                        {subtitle ? (
                            <p
                                className="
                                    mt-4
                                    max-w-lg
                                    text-sm
                                    leading-6
                                    text-stone-500
                                "
                            >
                                {
                                    subtitle
                                }
                            </p>
                        ) : null}
                    </div>


                    {
                        children
                    }
                </div>
            </div>
        </section>
    );
}