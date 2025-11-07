// src/components/filters/categoryConfig.js
export const CATEGORY_CONFIG = [
    /* ============ ESTILOS (fabricPattern) ============ */
    { key: 'FLORAL', labelKey: 'categories.floral', groupKey: 'sections.estilos', target: 'fabricPattern' },
    { key: 'LISO', labelKey: 'categories.liso', groupKey: 'sections.estilos', target: 'fabricPattern' },
    { key: 'FALSO LISO', labelKey: 'categories.falsoLiso', groupKey: 'sections.estilos', target: 'fabricPattern' },
    { key: 'GEOMETRICO', labelKey: 'categories.geometrico', groupKey: 'sections.estilos', target: 'fabricPattern' },
    { key: 'RAYAS', labelKey: 'categories.rayas', groupKey: 'sections.estilos', target: 'fabricPattern' },
    { key: 'CUADROS', labelKey: 'categories.cuadros', groupKey: 'sections.estilos', target: 'fabricPattern' },
    { key: 'ESPIGA', labelKey: 'categories.espiga', groupKey: 'sections.estilos', target: 'fabricPattern' },
    { key: 'ETNICO', labelKey: 'categories.etnico', groupKey: 'sections.estilos', target: 'fabricPattern' },
    { key: 'CON ANIMALES', labelKey: 'categories.conAnimales', groupKey: 'sections.estilos', target: 'fabricPattern' },
    { key: 'CON TEXTURAS', labelKey: 'categories.conTexturas', groupKey: 'sections.estilos', target: 'fabricPattern' },
    { key: 'RAFIA', labelKey: 'categories.rafia', groupKey: 'sections.estilos', target: 'fabricPattern' },
    { key: 'TELAS TROPICALES', labelKey: 'categories.telasTropicales', groupKey: 'sections.estilos', target: 'fabricPattern' },

    /* ============ TELAS ESPECIALES (Usos + Funcionalidad) ============ */
    { key: 'OUTDOOR', labelKey: 'categories.outdoor', groupKey: 'sections.especiales', target: 'usage' },
    { key: 'FR', labelKey: 'categories.fr', groupKey: 'sections.especiales', target: 'usage' },
    { key: 'IMO', labelKey: 'categories.imo', groupKey: 'sections.especiales', target: 'usage' },
    { key: 'EASYCLEAN', labelKey: 'categories.easyClean', groupKey: 'sections.especiales', target: 'maintenance' },

    /* ============ TIPOS (fabricType) ============ */
    { key: 'ALGODON', labelKey: 'categories.algodon', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'BLACKOUT', labelKey: 'categories.blackout', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'CUADROS', labelKey: 'categories.cuadros', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'DIMOUT', labelKey: 'categories.dimout', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'DRALON ACRYLIC', labelKey: 'categories.dralonAcrylic', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'ESTAMPADO', labelKey: 'categories.estampado', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'FOSCURIT', labelKey: 'categories.foscurit', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'JACQUARD', labelKey: 'categories.jacquard', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'JUTE', labelKey: 'categories.jute', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'LANA', labelKey: 'categories.lana', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'LINO', labelKey: 'categories.lino', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'LISO', labelKey: 'categories.liso', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'OLEFINA', labelKey: 'categories.olefina', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'POLIESTER', labelKey: 'categories.poliester', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'POLIPIEL', labelKey: 'categories.polipiel', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'POLIPROPILENO', labelKey: 'categories.polipropileno', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'POLYOLEFIN', labelKey: 'categories.polyolefin', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'RAYAS', labelKey: 'categories.rayas', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'TERCIOPELO', labelKey: 'categories.terciopelo', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'VISILLO', labelKey: 'categories.visillo', groupKey: 'sections.tipos', target: 'fabricType' },
    { key: 'WALLPAPER', labelKey: 'categories.wallpaper', groupKey: 'sections.tipos', target: 'fabricType', onlyIfNotTela: true },
];

export const groupCategories = (translate, type = 'tela') => {
    return CATEGORY_CONFIG.reduce((acc, cat) => {
        if (cat.onlyIfNotTela && type === 'tela') return acc;
        const label = translate(cat.groupKey);
        if (!acc[label]) acc[label] = [];
        acc[label].push(cat);
        return acc;
    }, {});
};

/* ========================= Aliases / equivalencias ========================= */
const SPECIAL_ALIASES = {
    OUTDOOR: {
        uso: ['OUTDOOR'],
        fabricType: ['EXTERIOR', 'LISO;EXTERIOR', 'ESTAMPADO;EXTERIOR'],
    },
    FR: {
        uso: ['FR'],
        fabricType: ['VISILLO FR', 'TERCIOPELO FR'],
        fabricPattern: ['TERCIOPELO FR'],
    },
    IMO: { uso: ['IMO', 'FR,IMO'] },
    EASYCLEAN: { mantenimiento: ['EASYCLEAN', 'LAVABLE'] },
    FOSCURIT: { fabricType: ['FOSCURIT', 'BLACKOUT'] },
    BLACKOUT: { fabricType: ['BLACKOUT', 'FOSCURIT'] },
};

/* ========================= Imagen: tamaños fallback ========================= */
const IMAGE_SIZES = ['Buena', 'Mediana', 'Grande', 'Pequena', 'Mini', 'Original'];

async function fetchAnyImage(codprodu) {
    for (const size of IMAGE_SIZES) {
        try {
            const r = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${codprodu}/${size}`);
            if (!r.ok) continue;
            const j = await r.json();
            if (j?.ficadjunto) return `https://${j.ficadjunto}`;
        } catch {
            /* continuar */
        }
    }
    return null;
}

/* ========================= Helpers búsqueda ========================= */
async function tryQuery(body, limit = 12) {
    try {
        const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/products/filter`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, limit }) }
        );
        if (!res.ok) return [];
        const data = await res.json();
        const arr = Array.isArray(data?.products) ? data.products : Array.isArray(data) ? data : [];
        return arr;
    } catch {
        return [];
    }
}

async function choosePreviewFromList(products) {
    // Primero, cualquiera que tenga imagen
    for (const p of products) {
        const img = await fetchAnyImage(p.codprodu);
        if (img) return { id: p.codprodu, name: p.nombre, imageUrl: img };
    }
    // Si ninguno tiene imagen, devolver el primero (imageUrl=null) para mostrar “Sin vista previa”
    if (products.length) {
        const p0 = products[0];
        return { id: p0.codprodu, name: p0.nombre, imageUrl: null };
    }
    return null;
}

/**
 * Busca un producto de ejemplo para previsualizar una categoría.
 * Compatible con backend (claves en español) y datos no homogéneos.
 * Incluye fallbacks y alias (FOSCURIT↔BLACKOUT, OUTDOOR↔EXTERIOR, FR…).
 */
export const fetchCategoryPreview = async (catKey, groupKey) => {
    const KEY = String(catKey || '').toUpperCase().trim();

    // 1) payloads base según grupo
    const basePayloads = [];
    switch (groupKey) {
        case 'sections.estilos':
            basePayloads.push({ fabricPattern: [KEY] });
            break;
        case 'sections.tipos':
            basePayloads.push({ fabricType: [KEY] });
            break;
        case 'sections.especiales':
            // Usos + mantenimiento simultáneamente
            basePayloads.push({ uso: [KEY] });
            basePayloads.push({ mantenimiento: [KEY] });
            break;
        case 'sections.usos':
            basePayloads.push({ uso: [KEY] });
            break;
        case 'sections.funcionalidad':
            basePayloads.push({ mantenimiento: [KEY] });
            break;
        default:
            return null;
    }

    // Intentos principales
    for (const p of basePayloads) {
        const products = await tryQuery(p, 12);
        const hit = await choosePreviewFromList(products);
        if (hit) return hit;
    }

    // 2) Alias/fallbacks si nada salió
    const alias = SPECIAL_ALIASES[KEY];
    if (alias) {
        const aliasPayloads = [];
        if (alias.uso) aliasPayloads.push({ uso: alias.uso });
        if (alias.mantenimiento) aliasPayloads.push({ mantenimiento: alias.mantenimiento });
        if (alias.fabricType) aliasPayloads.push({ fabricType: alias.fabricType });
        if (alias.fabricPattern) aliasPayloads.push({ fabricPattern: alias.fabricPattern });

        for (const ap of aliasPayloads) {
            const products = await tryQuery(ap, 12);
            const hit = await choosePreviewFromList(products);
            if (hit) return hit;
        }
    }

    // 3) Nada encontrado
    return null;
};
