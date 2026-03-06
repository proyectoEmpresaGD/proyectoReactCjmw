import { useTranslation } from "react-i18next";

export default function InstagramPromo({
    account, // "@harbour_fabrics"
    href, // "https://www.instagram.com/harbour_fabrics/"
    imageUrl, // foto ambiente
    className = "",
}) {
    const { t } = useTranslation("instagramPromo");

    return (
        <section className={`w-full ${className}`}>
            <div className="mx-auto max-w-7xl px-4">
                <div className="rounded-3xl border border-black/10 bg-white overflow-hidden shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Imagen */}
                        <div className="relative">
                            <div className="aspect-[16/10] md:aspect-auto md:h-full bg-black/5">
                                <img
                                    src={imageUrl}
                                    alt={t("imageAlt")}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Texto + CTA */}
                        <div className="p-6 md:p-10 flex flex-col justify-center gap-4">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-black">
                                    {t("title")}
                                </h3>
                                <p className="mt-2 text-sm md:text-base text-black/60 leading-relaxed">
                                    {t("subtitle")}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-semibold text-black/70 hover:text-black transition"
                                    aria-label={t("accountAria", { account })}
                                >
                                    {account}
                                </a>
                            </div>

                            <p className="text-xs text-black/40">
                                {t("note")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}