import { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";

const isMobile = () =>
    typeof window !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function openInstagram({ username, webUrl }) {
    if (!username || !webUrl) return;

    // 1) Universal link que abre la app en el perfil (si está instalada)
    const appPreferredUrl = `https://www.instagram.com/_u/${encodeURIComponent(username)}/`;

    // Desktop: web directo
    if (!isMobile()) {
        window.open(webUrl, "_blank", "noopener,noreferrer");
        return;
    }

    // Mobile: intenta abrir app (universal link)
    window.location.href = appPreferredUrl;

    // 2) Fallback: si no abre app, abre web normal del perfil
    setTimeout(() => {
        window.location.href = webUrl;
    }, 800);
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
