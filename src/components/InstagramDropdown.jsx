import { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";

const ua = () => (typeof navigator !== "undefined" ? navigator.userAgent : "");
const isAndroid = () => /Android/i.test(ua());
const isIOS = () => /iPhone|iPad|iPod/i.test(ua());
const isMobile = () => isAndroid() || isIOS();

function openInstagram({ username, webUrl }) {
    if (!username || !webUrl) return;

    const cleanUsername = String(username).replace(/^@/, "").trim();
    if (!cleanUsername) return;

    const encodedUsername = encodeURIComponent(cleanUsername);
    const webProfileUrl = `https://www.instagram.com/${encodedUsername}/`;

    // Desktop: web directo (tu comportamiento actual)
    if (!isMobile()) {
        window.open(webUrl, "_blank", "noopener,noreferrer");
        return;
    }

    // Android: Intent link (lo más fiable para forzar la app)
    if (isAndroid()) {
        const intentUrl =
            `intent://www.instagram.com/${encodedUsername}/` +
            `#Intent;package=com.instagram.android;scheme=https;end`;

        window.location.href = intentUrl;

        // Fallback a web si no abre la app
        setTimeout(() => {
            window.location.href = webProfileUrl;
        }, 900);

        return;
    }

    // iOS: scheme (mejor esfuerzo; Instagram puede abrir en buscar/home según versión)
    if (isIOS()) {
        const schemeUrl = `instagram://user?username=${encodedUsername}`;
        window.location.href = schemeUrl;

        // Fallback a web si no abre la app
        setTimeout(() => {
            window.location.href = webProfileUrl;
        }, 900);

        return;
    }

    // Fallback genérico
    window.location.href = webProfileUrl;
}

export default function InstagramDropdown({ items = [], buttonClassName = "" }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function onClickOutside(e) {
            if (!wrapperRef.current) return;
            if (wrapperRef.current.contains(e.target)) return;
            setOpen(false);
        }

        function onKeyDown(e) {
            if (e.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", onClickOutside);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("mousedown", onClickOutside);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    const toggle = () => setOpen((v) => !v);

    if (!items?.length) {
        return (
            <button
                type="button"
                className={buttonClassName}
                aria-label="Instagram"
                onClick={(e) => e.preventDefault()}
            >
                <Instagram size={18} className="text-white" />
            </button>
        );
    }

    return (
        <div ref={wrapperRef} className="relative">
            <button
                type="button"
                onClick={toggle}
                className={buttonClassName}
                aria-label="Instagram"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <Instagram size={18} className="text-white" />
            </button>

            <div
                role="menu"
                className={[
                    "absolute z-50 mt-2 rounded-xl border border-black/10 bg-white p-2 shadow-lg",
                    "left-1/2 -translate-x-1/2 w-[min(320px,calc(100vw-24px))]",
                    "sm:left-auto sm:translate-x-0 sm:right-0 sm:w-[320px]",
                    "origin-top transition-all duration-200 ease-out",
                    open
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none",
                ].join(" ")}
                aria-hidden={!open}
            >
                <div className="flex items-center justify-center gap-3">
                    {items.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            role="menuitem"
                            className="flex items-center justify-center rounded-lg hover:bg-black/5"
                            title={item.alt}
                            onClick={() => {
                                openInstagram({ username: item.username, webUrl: item.href });
                                setOpen(false);
                            }}
                        >
                            <img
                                src={item.img}
                                alt={item.alt}
                                className="max-h-9 max-w-20 object-contain"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
