export default function AuthCard({
    eyebrow = "CJM Group",
    title,
    subtitle,
    sideLabel,
    sideTitle,
    sideDescription,
    sideImage = "https://bassari.eu/ImagenesTelasCjmw/FOTOS%20WEB%20CJMW%20AMBIENTE%20Y%20CARRUSELES/00_AMBIENTES_PARA_CARRUSELES_PAGINAS_MARCAS_COLECCIONES_WEBP/BASSARI%20AMBIENTE/LE%20VOYAGE%20DES%20WOLOFS/BASS_ESSENCESDUNIL_LEVOYAGEDESWOLOFS%20LA%20CROIX.webp",
    children,
}) {
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

                lg:min-h-[680px]
                lg:grid-cols-[1.04fr_0.96fr]
                lg:rounded-[36px]
            "
        >
            <aside
                className="
                    relative
                    hidden
                    overflow-hidden
                    bg-stone-950
                    text-white

                    lg:block
                "
            >
                <img
                    src={sideImage}
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
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-black/20
                        via-transparent
                        to-transparent
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
                            {sideLabel}
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
                            {eyebrow}
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
                            {sideTitle}
                        </h2>

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
                            {sideDescription}
                        </p>
                    </div>
                </div>
            </aside>

            <div
                className="
                    flex
                    items-center
                    bg-white
                    p-6

                    sm:p-9

                    lg:p-12

                    xl:p-16
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
                            mb-9

                            sm:mb-10
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
                            {eyebrow}
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
                            {title}
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
                                {subtitle}
                            </p>
                        ) : null}
                    </div>

                    {children}
                </div>
            </div>
        </section>
    );
}
