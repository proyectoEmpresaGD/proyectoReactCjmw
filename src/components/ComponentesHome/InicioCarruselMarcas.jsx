import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, Pause, Play } from "lucide-react";
import MarcaLogo from "./MarcaLogo";
import { getBrandNavigationLogoClasses } from "../../Constants/brandLogoStyles";

const SLIDE_DURATION_MS = 7000;

const getHeroLogoWidth = (brand) => {
    if (brand === "bassari") return "w-[min(280px,62vw)] lg:w-[208px]";
    if (brand === "cjm") return "w-[min(248px,59vw)] lg:w-[166px]";
    return "w-[min(560px,72vw)] lg:w-[min(424px,52vw)]";
};


export default function InicioCarruselMarcas({
    brands = [],
    activeBrand,
    activeIndex,
    onSelectBrand,
    onOpenBrand,
    onOpenCollections,
}) {
    const { t } = useTranslation("homePage");
    const heroRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);
    const [isDocumentVisible, setIsDocumentVisible] = useState(() =>
        typeof document === "undefined" || document.visibilityState !== "hidden"
    );
    const [reducedMotion, setReducedMotion] = useState(false);
    const [manuallyPaused, setManuallyPaused] = useState(false);
    const [navigationHovered, setNavigationHovered] = useState(false);
    const [navigationFocused, setNavigationFocused] = useState(false);

    useEffect(() => {
        const element = heroRef.current;
        if (!element || typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.2),
            { threshold: [0, 0.2, 0.5] }
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const updateVisibility = () => setIsDocumentVisible(document.visibilityState !== "hidden");
        document.addEventListener("visibilitychange", updateVisibility);
        return () => document.removeEventListener("visibilitychange", updateVisibility);
    }, []);

    useEffect(() => {
        if (typeof window.matchMedia !== "function") return;
        const media = window.matchMedia("(prefers-reduced-motion: reduce)");
        const updatePreference = () => setReducedMotion(media.matches);
        updatePreference();
        media.addEventListener?.("change", updatePreference);
        return () => media.removeEventListener?.("change", updatePreference);
    }, []);

    const isPlaying =
        brands.length > 1 &&
        isVisible &&
        isDocumentVisible &&
        !reducedMotion &&
        !manuallyPaused &&
        !navigationHovered &&
        !navigationFocused;

    useEffect(() => {
        if (!isPlaying || !activeBrand) return;

        const timer = window.setTimeout(() => {
            const nextIndex = (activeIndex + 1) % brands.length;
            onSelectBrand(brands[nextIndex].key);
        }, SLIDE_DURATION_MS);

        return () => window.clearTimeout(timer);
    }, [activeBrand, activeIndex, brands, isPlaying, onSelectBrand]);

    const scrollToPresentation = () => {
        document.getElementById("home-group-intro")?.scrollIntoView({ behavior: "smooth" });
    };

    if (!activeBrand) return null;

    return (
        <section
            ref={heroRef}
            aria-label={t("hero.discoverFiveBrands")}
            className="relative isolate min-h-[100svh] overflow-hidden bg-stone-950 text-white"
        >
            <AnimatePresence mode="sync" initial={false}>
                <motion.div
                    key={activeBrand.key}
                    initial={{ opacity: 0, scale: 1.035 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ opacity: { duration: 0.75 }, scale: { duration: 1.3, ease: [0.22, 1, 0.36, 1] } }}
                    className="absolute inset-0 -z-30"
                >
                    <img
                        src={activeBrand.background}
                        alt=""
                        aria-hidden="true"
                        loading={activeIndex === 0 ? "eager" : "lazy"}
                        fetchPriority={activeIndex === 0 ? "high" : undefined}
                        decoding="async"
                        className="h-full w-full object-cover object-center"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 -z-20 bg-black/15" />
            <div className="absolute inset-0 -z-20 bg-gradient-to-r from-black/75 via-black/35 to-black/5" />
            <div className="absolute inset-0 -z-20 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            <div className="mx-auto flex min-h-[100svh] w-full max-w-[1800px] flex-col justify-end px-5 pb-44 pt-32 sm:px-8 lg:px-12 lg:pb-40 xl:px-16">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={activeBrand.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-3xl"
                        aria-live="off"
                    >
                        {/* El concepto editorial acompaña al logo; no se numera la marca. */}
                        <div className="flex items-center gap-4">
                            <span className="h-px w-9 shrink-0 bg-white/55" aria-hidden="true" />
                            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/75 sm:text-xs">
                                {t(activeBrand.eyebrowKey)}
                            </p>
                        </div>

                        <h1 className="mt-7 flex min-h-[95px] items-center sm:min-h-[130px] lg:min-h-[106px]">
                            <MarcaLogo
                                brand={activeBrand.key}
                                light
                                loading="eager"
                                className={`${getHeroLogoWidth(activeBrand.key)} max-h-[116px] drop-shadow-sm lg:max-h-[84.8px]`}
                            />
                        </h1>

                        <p className="mt-6 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                            {t(activeBrand.descriptionKey)}
                        </p>

                        <div className="mt-9 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => onOpenBrand(activeBrand)}
                                className="group inline-flex items-center gap-3 rounded-full border border-white/50 bg-black/20 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-md transition hover:border-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                            >
                                {t("hero.discoverBrand")}
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onOpenCollections(activeBrand)}
                                className="group inline-flex items-center gap-3 rounded-full border border-white/50 bg-black/20 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-md transition hover:border-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                            >
                                {t("hero.viewCollections")}
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Los logos son el selector, con tarjeta activa y avance visual del autoplay. */}
            <nav
                aria-label={t("hero.selectBrand")}
                onMouseEnter={() => setNavigationHovered(true)}
                onMouseLeave={() => setNavigationHovered(false)}
                onFocusCapture={() => setNavigationFocused(true)}
                onBlurCapture={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setNavigationFocused(false);
                }}
                className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/65 shadow-[0_-24px_70px_rgba(0,0,0,0.38)] backdrop-blur-2xl"
            >
                <div className="mx-auto flex max-w-[1800px] items-stretch gap-2 overflow-x-auto px-3 py-3 sm:px-6 lg:max-w-[1460px] lg:gap-3 lg:px-10 lg:py-2 xl:max-w-[1540px] xl:px-14">
                    {brands.map((brand) => {
                        const isActive = brand.key === activeBrand.key;
                        return (
                            <button
                                key={brand.key}
                                type="button"
                                onClick={() => onSelectBrand(brand.key)}
                                aria-label={`${t("hero.selectBrand")}: ${brand.title}`}
                                aria-pressed={isActive}
                                title={brand.title}
                                className={`group relative flex h-[84px] min-w-[118px] flex-1 cursor-pointer items-center justify-center rounded-2xl border px-3 text-center transition-all duration-300 focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-[90px] sm:min-w-[132px] lg:h-[80px] lg:min-w-[160px] lg:rounded-xl xl:h-[84px] ${isActive
                                    ? "border-white/30 bg-white/12 text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] lg:border-stone-500/60 lg:bg-white/[0.07] lg:shadow-none"
                                    : "border-white/8 bg-white/[0.03] text-white/75 hover:border-white/20 hover:bg-white/[0.08] hover:text-white lg:border-stone-600/50 lg:bg-white/[0.025] lg:hover:border-stone-400/45 lg:hover:bg-white/[0.065]"
                                    }`}
                            >
                                <MarcaLogo
                                    brand={brand.key}
                                    light
                                    decorative
                                    loading="eager"
                                    className={`max-h-[48px] max-w-full opacity-80 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100 sm:max-h-[52px] ${getBrandNavigationLogoClasses(brand.key)} ${isActive ? "opacity-100" : ""}`}
                                />
                                {isActive && (
                                    <span className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden bg-white/25 lg:h-[2px] lg:bg-stone-500/30">
                                        <motion.span
                                            key={`${brand.key}-${isPlaying}`}
                                            className="block h-full origin-left bg-white lg:bg-stone-300/80"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: isPlaying ? 1 : 0 }}
                                            transition={{ duration: isPlaying ? SLIDE_DURATION_MS / 1000 : 0, ease: "linear" }}
                                        />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>

            <div className="absolute bottom-[124px] right-5 z-10 hidden items-center gap-2 md:flex lg:bottom-[110px] lg:right-12 xl:bottom-[115px] xl:right-16">
                {!reducedMotion && brands.length > 1 && (
                    <button
                        type="button"
                        onClick={() => setManuallyPaused((previous) => !previous)}
                        aria-label={t(manuallyPaused ? "hero.playCarousel" : "hero.pauseCarousel")}
                        title={t(manuallyPaused ? "hero.playCarousel" : "hero.pauseCarousel")}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur-md transition hover:bg-white hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        {manuallyPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </button>
                )}
                <button
                    type="button"
                    onClick={scrollToPresentation}
                    aria-label={t("hero.scrollToNextSection")}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/35 text-white backdrop-blur-md transition hover:bg-white hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    <ArrowDown className="h-4 w-4" />
                </button>
            </div>
        </section>
    );
}
