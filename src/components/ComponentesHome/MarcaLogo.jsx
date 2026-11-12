import { LOGO_URL, LOGO_URL_DARK } from "../../Constants/constants";

/**
 * Logotipos originales del proyecto, recortados únicamente por sus márgenes
 * transparentes para que mantengan sus proporciones y sean legibles en el home.
 * Las marcas usan su archivo original; para un fondo oscuro, la versión
 * blanca se consigue mediante CSS. CJM Group utiliza las variantes oficiales
 * según el fondo, manteniendo el diseño original de cada archivo.
 */
const BRAND_MARKS = {
    arena: "/home-brand-logos/arena.png",
    bassari: "/home-brand-logos/bassari.png",
    flamenco: "/home-brand-logos/flamenco.png",
    harbour: "/home-brand-logos/harbour.png",
    cjm: "https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS/logoCJM-sintexto.png",
    "cjm-group": LOGO_URL,
};

const BRAND_NAMES = {
    arena: "Arena",
    bassari: "Bassari",
    flamenco: "Flamenco",
    harbour: "Harbour",
    cjm: "CJM",
    "cjm-group": "CJM Group",
};

export default function MarcaLogo({
    brand,
    light = false,
    className = "",
    loading = "lazy",
    decorative = false,
}) {
    const key = String(brand || "").trim().toLowerCase();
    const image = key === "cjm-group" && light
        ? LOGO_URL_DARK
        : BRAND_MARKS[key];

    if (!image) return <span>{brand}</span>;

    return (
        <img
            src={image}
            alt={decorative ? "" : BRAND_NAMES[key]}
            aria-hidden={decorative ? "true" : undefined}
            loading={loading}
            decoding="async"
            draggable="false"
            className={`block h-auto max-w-full object-contain ${light && key !== "cjm-group" ? "brightness-0 invert" : ""} ${className}`.trim()}
        />
    );
}
