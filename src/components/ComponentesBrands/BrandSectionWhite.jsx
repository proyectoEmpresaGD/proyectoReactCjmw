export default function BrandSectionWhite({
    kicker,
    title,
    subtitle,
    children,
    className = "",
}) {
    return (
        <section className={`py-14 ${className}`}>
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
                <div className="max-w-3xl">
                    {kicker ? (
                        <p className="text-[11px] font-medium tracking-[0.32em] text-zinc-500">
                            {kicker}
                        </p>
                    ) : null}

                    {title ? (
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                            {title}
                        </h2>
                    ) : null}

                    {subtitle ? (
                        <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                            {subtitle}
                        </p>
                    ) : null}

                    <div className="mt-7 h-px w-20 bg-zinc-200" />
                </div>

                <div className="mt-10">{children}</div>
            </div>
        </section>
    );
}
