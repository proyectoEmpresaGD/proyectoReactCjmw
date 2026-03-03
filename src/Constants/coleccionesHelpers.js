const normalize = (s) => String(s || "").trim().toUpperCase();

export function buildColeccionParams({ collectionName, t, imagenesColecciones, configByName }) {
    const key = normalize(collectionName);
    const cfg = configByName?.[key];
    if (!cfg) return null;

    const imgs = imagenesColecciones?.[cfg.imagesKey] || [];
    const heroImage = imgs?.[cfg.heroIndex ?? 0] || null;
    const brochureImage = Number.isFinite(cfg.brochureImageIndex) ? (imgs?.[cfg.brochureImageIndex] || null) : null;

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
    };
}

export function getColeccionCover({ collectionName, imagenesColecciones, configByName }) {
    const key = normalize(collectionName);
    const cfg = configByName?.[key];
    if (!cfg) return null;
    const imgs = imagenesColecciones?.[cfg.imagesKey] || [];
    return imgs?.[cfg.heroIndex ?? 0] || null;
}


// Mapa: lo que llega en URL / nombre visible => key del JSON
export const coleccionKeyByName = {
    "LE VOYAGE DES WOLOF": "leVoyageDesWolof",
    "ESSENCES DU NIL": "essencesDuNil",
    "INDIENNE STRIPES": "indienne",
    "PALACIO DE LAS DUEÑAS": "palacioDeDueñas",
};

// Config de imágenes/PDF por colección
export const coleccionConfigByName = {
    "ESSENCES DU NIL": {
        textKey: "essencesDuNil",
        imagesKey: "imagesEssencesDuNil",
        brochurePdf: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BASS_BROUCHURE_ENERO2026.pdf",
        brochureImageIndex: 4,
        heroIndex: 0,

    },
    "LE VOYAGE DES WOLOF": {
        textKey: "leVoyageDesWolof",
        imagesKey: "imagesLeVoyageDesWolofs",
        brochurePdf: "https://bassari.eu/ImagenesTelasCjmw/PDF/BROUCHURE/BASS_BROUCHURE_ENERO2026.pdf",
        brochureImageIndex: 4,
        heroIndex: 0,
    },
    "INDIENNE STRIPES": {
        textKey: "indienne",
        imagesKey: "imagesIndienneStripes",
        brochurePdf: null,
        brochureImageIndex: 0,
        heroIndex: 0,
    },
    "PALACIO DE LAS DUEÑAS": {
        textKey: "palacioDeDueñas",
        imagesKey: "imagesPalacioDeDueñas",
        brochurePdf: null,
        brochureImageIndex: 0,
        heroIndex: 0,
    },
    "BOHEMIAN": {
        textKey: "bohemian",
        imagesKey: "imagesHarBohemian",
        brochurePdf: "https://bassari.eu/ImagenesTelasCjmw/imagenes%20Newletters/2025/BROUCHURES%20LIBROS/ARN_HABITAT_VLC_25_25_BROUCHURE_2025_AAFF.pdf",
        brochureImageIndex: 0, // índice dentro del array imagesHarBohemian
        heroIndex: 0,          // índice dentro del array imagesHarBohemian
    },
};

// Construye params listos para buildColeccionUrl


