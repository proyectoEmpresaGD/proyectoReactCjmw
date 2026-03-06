const normalize = (s) => String(s || "").trim().toUpperCase();

export function buildColeccionParams({ collectionName, t, images, configByName }) {
    const key = normalize(collectionName);
    const cfg = configByName?.[key];
    if (!cfg) return null;

    const imgs = Array.isArray(images) ? images : [];
    const heroImage = imgs?.[cfg.heroIndex ?? 0] || null;
    const brochureImage = Number.isFinite(cfg.brochureImageIndex)
        ? (imgs?.[cfg.brochureImageIndex] || null)
        : null;

    // 🔥 Textos SIEMPRE desde common.json
    const textKey = cfg.textKey; // ej: "palacioDeDueñas"
    const introTop = textKey ? t(`Colecciones.${textKey}.introTop`) : null;
    const introBottom = textKey ? t(`Colecciones.${textKey}.introBottom`) : null;
    const introBrouchure = textKey ? t(`Colecciones.${textKey}.introBrouchure`) : null;

    return {
        introTop,
        introBottom,
        introBrouchure,
        heroImage,
        images: imgs,
        brochureImage,
        brochurePdf: cfg.brochurePdf || null,
        marca: cfg.marca || null,
    };
}

export function getColeccionCover({ collectionName, images, configByName }) {
    const key = normalize(collectionName);
    const cfg = configByName?.[key];
    if (!cfg) return null;
    const imgs = Array.isArray(images) ? images : [];
    return imgs?.[cfg.heroIndex ?? 0] || null;
}

// Config de meta por colección (NO incluye arrays de imágenes: eso viene del backend)
export const coleccionConfigByName = {
    "ESSENCES DU NIL": {
        marca: "BAS",
        textKey: "essencesDuNil",
        brochurePdf: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BASS_BROUCHURE_ENERO2026.pdf",
        brochureImageIndex: 4,
        heroIndex: 0,
    },
    "LE VOYAGE DES WOLOF": {
        marca: "BAS",
        textKey: "leVoyageDesWolof",
        brochurePdf: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BASS_BROUCHURE_ENERO2026.pdf",
        brochureImageIndex: 4,
        heroIndex: 0,
    },
    "INDIENNE STRIPES": {
        marca: "FLA",
        textKey: "indienne",
        brochurePdf: null,
        brochureImageIndex: 0,
        heroIndex: 0,
    },
    "PALACIO DE LAS DUEÑAS": {
        marca: "FLA",
        textKey: "palacioDeDueñas",
        brochurePdf: null,
        brochureImageIndex: 0,
        heroIndex: 0,
    },
    "MADAMA BUTTERFLY": {
        marca: "ARE",
        textKey: "madamaButterfly",
        brochurePdf: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/ARN_HABITAT_VLC_25_25_BROUCHURE_2025_AAFF.pdf",
        brochureImageIndex: 1,
        heroIndex: 0,
    },
    "TAKUMI": {
        marca: "ARE",
        textKey: "takumi",
        brochurePdf: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/ARN_HABITAT_VLC_25_25_BROUCHURE_2025_AAFF.pdf",
        brochureImageIndex: 1,
        heroIndex: 0,
    },
    "LIGHTHOUSE": {
        marca: "ARE",
        textKey: "lighthouse",
        brochurePdf: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/ARN_HABITAT_VLC_25_25_BROUCHURE_2025_AAFF.pdf",
        brochureImageIndex: 1,
        heroIndex: 0,
    },
    "BOHEMIAN": {
        marca: "HAR",
        textKey: "bohemian",
        brochurePdf: "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/ARN_HABITAT_VLC_25_25_BROUCHURE_2025_AAFF.pdf",
        brochureImageIndex: 0,
        heroIndex: 0,
    },
    "HUSKY": {
        marca: "HAR",
        textKey: "husky",
        brochurePdf: null,
        brochureImageIndex: 0,
        heroIndex: 0,
    },
    "FUTURE": {
        marca: "HAR",
        textKey: "future",
        brochurePdf: null,
        brochureImageIndex: 0,
        heroIndex: 0,
    },
    "TOKIO": {
        marca: "CJM",
        textKey: "tokio",
        brochurePdf: null,
        brochureImageIndex: 0,
        heroIndex: 0,
    },
    "COLONY WALLPAPER": {
        marca: "CJM",
        textKey: "colony wallpaper",
        brochurePdf: null,
        brochureImageIndex: 0,
        heroIndex: 0,
    },
};