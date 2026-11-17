import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Header } from "../header";
import Footer from "../footer";
import { eventsData } from "../../data/newsData";

import "./events.css";

const GALLERY_INTERVAL_MS = 5000;
const EVENT_STYLES = ["deco-off", "editorial", "gallery"];

const listingStyles = `
    .events-page.events-page-listing {
        background: #fcfcfa;
    }

    .events-editorial {
        padding: 24px 0 40px;
    }

    .events-editorial-heading {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: end;
        gap: 48px;
        padding-bottom: 56px;
        margin-bottom: 48px;
        border-bottom: 1px solid #e5e7df;
    }

    .events-editorial-kicker {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 22px !important;
        color: #697364;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: .2em;
        events-editorial-kicker
    }

    .events-editorial-kicker::before {
        content: "";
        width: 28px;
        height: 1px;
        background: #8a957e;
    }

    .events-editorial-heading h1 {
        color: #28312a;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(3.6rem, 7vw, 6.8rem);
        font-weight: 400;
        line-height: 1;
        letter-spacing: -.055em;
    }

    .events-editorial-description {
        max-width: 430px;
        justify-self: end;
        padding-bottom: 5px;
        color: #73796f;
        font-size: 16px;
        line-height: 1.9;
    }

    .events-editorial-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 56px 36px;
    }

    .events-editorial-card {
        min-width: 0;
    }

    .events-editorial-card:first-child {
        grid-column: 1 / -1;
    }

    .events-editorial-link {
        display: flex;
        flex-direction: column;
        height: 100%;
        color: inherit;
        text-decoration: none;
    }

    .events-editorial-card:first-child .events-editorial-link {
        display: grid;
        grid-template-columns: 1.35fr 1fr;
        align-items: stretch;
        overflow: hidden;
        border: 1px solid #e8eae2;
        border-radius: 18px;
        background: #f3f4ee;
    }

    .events-editorial-image {
        position: relative;
        overflow: hidden;
        aspect-ratio: 16 / 11;
        border-radius: 14px;
        background: #e9ece3;
    }

    .events-editorial-card:first-child .events-editorial-image {
        height: 100%;
        min-height: 480px;
        aspect-ratio: auto;
        border-radius: 0;
    }

    .events-editorial-image::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: rgba(31, 46, 29, .035);
    }

    .events-editorial-image img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 900ms cubic-bezier(.2, .65, .3, 1);
    }

    .events-editorial-link:hover .events-editorial-image img {
        transform: scale(1.035);
    }

    .events-editorial-copy {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-top: 26px;
    }

    .events-editorial-card:first-child .events-editorial-copy {
        justify-content: center;
        padding: clamp(30px, 4vw, 58px);
    }

    .events-editorial-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        margin-bottom: 22px;
        color: #6f7868;
        font-size: 11px;
        font-weight: 500;
        letter-spacing: .1em;
        line-height: 1.8;
        text-transform: uppercase;
    }

    .events-editorial-meta-dot {
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #a4ae98;
    }

    .events-editorial-copy h2 {
        max-width: 560px;
        color: #2d362e;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(1.8rem, 3.2vw, 3.2rem);
        font-weight: 400;
        line-height: 1.15;
        letter-spacing: -.035em;
        text-wrap: balance;
    }

    .events-editorial-excerpt {
        max-width: 470px;
        margin-top: 22px !important;
        color: #72786d;
        font-size: 15px;
        line-height: 1.9;
    }

    .events-editorial-cta {
        display: inline-flex;
        align-items: center;
        gap: 22px;
        margin-top: 34px;
        padding-bottom: 8px;
        border-bottom: 1px solid #a6b09b;
        color: #34432f;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: .025em;
        transition: gap 250ms ease;
    }

    .events-editorial-link:hover .events-editorial-cta {
        gap: 30px;
    }

    .events-editorial-cta svg {
        flex-shrink: 0;
        transition: transform 250ms ease;
    }

    .events-editorial-link:hover .events-editorial-cta svg {
        transform: translate(2px, -2px);
    }

    .events-editorial-link:focus-visible {
        outline: 2px solid #66755b;
        outline-offset: 7px;
        border-radius: 14px;
    }

    @media (max-width: 900px) {
        .events-editorial-heading {
            gap: 30px;
        }

        .events-editorial-card:first-child .events-editorial-link {
            grid-template-columns: 1.1fr 1fr;
        }

        .events-editorial-card:first-child .events-editorial-image {
            min-height: 430px;
        }

        .events-editorial-card:first-child .events-editorial-copy {
            padding: 30px;
        }
    }

    @media (max-width: 640px) {
        .events-editorial {
            padding-top: 10px;
        }

        .events-editorial-heading {
            grid-template-columns: 1fr;
            gap: 25px;
            padding-bottom: 32px;
            margin-bottom: 30px;
        }

        .events-editorial-description {
            justify-self: start;
            max-width: 100%;
            font-size: 15px;
        }

        .events-editorial-grid {
            grid-template-columns: 1fr;
            gap: 38px;
        }

        .events-editorial-card:first-child .events-editorial-link {
            grid-template-columns: 1fr;
        }

        .events-editorial-card:first-child .events-editorial-image {
            height: auto;
            min-height: 0;
            aspect-ratio: 4 / 3;
        }

        .events-editorial-card:first-child .events-editorial-copy {
            padding: 30px 26px 34px;
        }

        .events-editorial-copy h2 {
            font-size: 2.1rem;
        }

        .events-editorial-meta {
            font-size: 10px;
            gap: 8px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .events-editorial *,
        .events-editorial *::after {
            animation: none !important;
            transition: none !important;
        }

        .events-editorial-link:hover .events-editorial-image img,
        .events-editorial-link:hover .events-editorial-cta svg {
            transform: none;
        }
    }
`;

export default function Events() {
    const { t } = useTranslation("events");
    const { newsId } = useParams();
    const reducedMotion = useReducedMotion();

    const [imageIndex, setImageIndex] = useState(0);

    const event = eventsData.find((item) => item.id === newsId);

    const copy = event
        ? t(`items.${event.translationKey}`, {
            returnObjects: true,
        })
        : null;

    const style = EVENT_STYLES.includes(event?.style)
        ? event.style
        : "editorial";

    const images = event?.images || [];
    const selectedIndex = imageIndex < images.length ? imageIndex : 0;

    const reveal = reducedMotion
        ? {}
        : {
            initial: { opacity: 0, y: 24 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
        };

    useEffect(() => {
        setImageIndex(0);
    }, [newsId]);

    useEffect(() => {
        if (images.length < 2) return;

        const timer = window.setInterval(() => {
            setImageIndex((index) => (index + 1) % images.length);
        }, GALLERY_INTERVAL_MS);

        return () => window.clearInterval(timer);
    }, [newsId, images.length]);

    useEffect(() => {
        const originalTitle = document.title;

        document.title = `${copy?.title || t("title")} | CJM GROUP`;

        return () => {
            document.title = originalTitle;
        };
    }, [copy?.title, t]);

    const linkAddress = (text) => {
        if (
            !copy?.address ||
            !copy?.mapsUrl ||
            typeof text !== "string" ||
            !text.includes(copy.address)
        ) {
            return text;
        }

        const parts = text.split(copy.address);

        return parts.map((part, index) => (
            <span key={index}>
                {index > 0 && (
                    <a
                        href={copy.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 hover:opacity-75"
                    >
                        {copy.address}
                        <span className="sr-only">{t("newTab")}</span>
                    </a>
                )}

                {part}
            </span>
        ));
    };

    const renderSections = () =>
        (Array.isArray(copy?.sections) ? copy.sections : []).map(
            (section, index) => (
                <motion.section
                    {...reveal}
                    key={index}
                    className="event-section"
                >
                    <h2>{section.title}</h2>

                    {(section.paragraphs || []).map((paragraph, i) => (
                        <p key={i}>{linkAddress(paragraph)}</p>
                    ))}
                </motion.section>
            )
        );

    const renderGallery = () =>
        images.length > 0 && (
            <section
                className="event-gallery"
                aria-label={t("gallery")}
            >
                <div className="event-gallery-frame">
                    {images.map((image, index) => (
                        <img
                            key={`${image}-${index}`}
                            className={`event-gallery-image${selectedIndex === index ? " is-active" : ""
                                }`}
                            src={image}
                            alt={copy?.imageAlts?.[index] || copy?.title}
                            aria-hidden={selectedIndex !== index}
                            loading="eager"
                        />
                    ))}

                    {images.length > 1 && (
                        <div
                            className="event-gallery-progress"
                            aria-hidden="true"
                        >
                            <span
                                key={`${newsId}-${selectedIndex}`}
                                style={{
                                    animationDuration: `${GALLERY_INTERVAL_MS}ms`,
                                }}
                            />
                        </div>
                    )}
                </div>

                {copy?.imageNote && (
                    <p className="event-caption">{copy.imageNote}</p>
                )}
            </section>
        );

    return (
        <>
            <Header />

            <main
                className={`events-page event-style-${style}${!newsId ? " events-page-listing" : ""
                    }`}
            >
                <div className="events-container">
                    {!newsId ? (
                        <section className="events-editorial">
                            <style>{listingStyles}</style>

                            <motion.div
                                {...reveal}
                                className="events-editorial-heading"
                            >
                                <div>
                                    <p className="events-editorial-kicker">
                                        {t("eyebrow")}
                                    </p>

                                    <h1>{t("title")}</h1>
                                </div>

                                <p className="events-editorial-description">
                                    {t("intro")}
                                </p>
                            </motion.div>

                            <div className="events-editorial-grid">
                                {eventsData.map((item, index) => {
                                    const text = t(
                                        `items.${item.translationKey}`,
                                        { returnObjects: true }
                                    );

                                    return (
                                        <motion.article
                                            {...reveal}
                                            key={item.id}
                                            className="events-editorial-card"
                                        >
                                            <Link
                                                to={`/eventos/${item.id}`}
                                                className="events-editorial-link"
                                            >
                                                <div className="events-editorial-image">
                                                    <img
                                                        src={item.images[0]}
                                                        alt={
                                                            text.imageAlts?.[0] ||
                                                            text.title
                                                        }
                                                        loading={
                                                            index === 0
                                                                ? "eager"
                                                                : "lazy"
                                                        }
                                                    />
                                                </div>

                                                <div className="events-editorial-copy">
                                                    <div className="events-editorial-meta">
                                                        <span>
                                                            {text.dateLabel}
                                                        </span>

                                                        <span
                                                            className="events-editorial-meta-dot"
                                                            aria-hidden="true"
                                                        />

                                                        <span>
                                                            {text.location}
                                                        </span>
                                                    </div>

                                                    <h2>{text.title}</h2>

                                                    <p className="events-editorial-excerpt">
                                                        {text.excerpt}
                                                    </p>

                                                    <span className="events-editorial-cta">
                                                        {t("readMore")}

                                                        <ArrowUpRight
                                                            size={17}
                                                            strokeWidth={1.5}
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                </div>
                                            </Link>
                                        </motion.article>
                                    );
                                })}
                            </div>
                        </section>
                    ) : !event ? (
                        <div className="events-heading">
                            <h1>{t("notFoundTitle")}</h1>
                            <p>{t("notFoundMessage")}</p>

                            <Link
                                className="event-button"
                                to="/eventos"
                            >
                                {t("back")}
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/eventos"
                                className="event-back"
                            >
                                <ArrowLeft
                                    size={18}
                                    aria-hidden="true"
                                />
                                {t("back")}
                            </Link>

                            <article>
                                <motion.header
                                    {...reveal}
                                    className="event-intro"
                                >
                                    <p className="event-eyebrow">
                                        {copy.category} · {copy.dateLabel}
                                    </p>

                                    <h1>{copy.title}</h1>

                                    <p className="event-lead">
                                        {copy.excerpt}
                                    </p>
                                </motion.header>

                                {style === "gallery" && renderGallery()}

                                {style !== "gallery" && images[0] && (
                                    <motion.div
                                        {...reveal}
                                        className="event-hero"
                                    >
                                        <img
                                            src={images[0]}
                                            alt={
                                                copy.imageAlts?.[0] ||
                                                copy.title
                                            }
                                            fetchPriority="high"
                                        />
                                    </motion.div>
                                )}

                                <div className="event-body">
                                    {style === "deco-off" && (
                                        <motion.aside
                                            {...reveal}
                                            className="event-fair"
                                        >
                                            {event.logo && (
                                                <img
                                                    className="event-fair-logo"
                                                    src={event.logo}
                                                    alt={copy.fairTitle}
                                                    width="200"
                                                    height="200"
                                                    loading="lazy"
                                                />
                                            )}

                                            <p className="event-eyebrow">
                                                {copy.fairLabel}
                                            </p>

                                            <h2>{copy.fairTitle}</h2>

                                            <p>{copy.dateLabel}</p>
                                            <p>{copy.location}</p>

                                            <p>
                                                {linkAddress(copy.visitNote)}
                                            </p>

                                            <a
                                                href={event.externalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="event-button"
                                            >
                                                {copy.linkLabel}

                                                <ArrowUpRight
                                                    size={18}
                                                    aria-hidden="true"
                                                />

                                                <span className="sr-only">
                                                    {t("newTab")}
                                                </span>
                                            </a>
                                        </motion.aside>
                                    )}

                                    <div className="event-text">
                                        {renderSections()}
                                    </div>
                                </div>

                                {style !== "gallery" && renderGallery()}

                                <motion.div
                                    {...reveal}
                                    className="event-closing"
                                >
                                    <p>{copy.closing}</p>

                                    <Link
                                        to="/contact"
                                        className="event-button"
                                    >
                                        {t("contact")}

                                        <ArrowUpRight
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </motion.div>
                            </article>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}