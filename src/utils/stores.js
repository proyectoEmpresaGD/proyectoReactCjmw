// src/utils/stores.js
// Utilidades puras para la calculadora de estores

const toStr = (v) => (v == null ? '' : String(v)).toUpperCase();

/**
 * Parsea valores tipo "140", "140cm", "140 cm", "1.4m", "1,4 m"
 * y devuelve siempre centímetros (number).
 */
export function parseRollWidthCm(input, fallback = 0) {
    if (input == null) return Number(fallback) || 0;
    const s = String(input).trim().toLowerCase().replace(',', '.');
    const m = s.match(/(\d+(\.\d+)?)/);
    if (!m) return Number(fallback) || 0;
    let v = parseFloat(m[1]);
    if (!Number.isFinite(v)) return Number(fallback) || 0;
    // Si incluye "m" y NO incluye "cm", interpretamos en metros -> pasa a cm
    if (s.includes('m') && !s.includes('cm')) v = v * 100;
    return v;
}

export function getRollWidthCm(fabric = {}) {
    // Ordena candidatos priorizando el campo "ancho" (que es el que usas en backend)
    const candidates = [
        fabric.ancho,           // <-- clave principal que nos indicas
        fabric.width,
        fabric.anchoTela, fabric.ancho_tela,
        fabric.anchoRollo, fabric.ancho_rollo,
        fabric.rollWidth, fabric.roll_width
    ];
    for (const c of candidates) {
        const n = parseRollWidthCm(c, 0);
        if (Number.isFinite(n) && n > 0) return n;
    }
    return 0;
}

export function isPlainOrLargePrint(fabric = {}) {
    const tipo = toStr(fabric.tipo);
    const estilo = toStr(fabric.estilo);
    const nombre = toStr(fabric.name || fabric.nombre);

    const isPlain = tipo.includes('LISO') || estilo.includes('LISO') || nombre.includes('LISO');
    const isLargePrint = estilo.includes('GRANDE') || tipo.includes('GRANDE') || nombre.includes('GRANDE');

    return { isPlain, isLargePrint, any: isPlain || isLargePrint };
}

// Reglas de límites:
// - LISO o estampado muy grande → ancho máx 270, alto máx 270
// - Estampado normal → ancho máx = (ancho de rollo - 10), alto máx 270
export function computeMaxDimensions(fabric = {}) {
    const rollWidth = getRollWidthCm(fabric);
    const { any } = isPlainOrLargePrint(fabric);
    const maxHeight = 270;

    if (!any) {
        const maxWidth = Math.max(0, rollWidth - 10);
        return { maxWidth, maxHeight, rollWidth, warnPrinted: true };
    }
    return { maxWidth: 270, maxHeight: 270, rollWidth, warnPrinted: false };
}

// Precio mecanismo + confección fija
// Con varillas: ancho(m) * 35 + 50
// Sin varillas: ancho(m) * 32 + 50
export function computeStorePrice({ widthCm, withRods }) {
    const mechPerMeter = withRods ? 35 : 32;
    const makingFixed = 50;
    const mechCost = (Number(widthCm) / 100) * mechPerMeter;
    const total = mechCost + makingFixed;
    return { mechCost, makingFixed, total, mechPerMeter };
}

/**
 * Corte y metros de tela necesarios.
 *
 * NUEVA REGLA:
 * - Si (ancho de rollo > alto del estor) → modo "simple-roll":
 *   - NO se añaden márgenes al corte mostrado.
 *   - metrosLineales = (ancho + 10) / 100
 *   - rule = 'simple-roll'
 *
 * CASO BASE (anterior):
 * - (ancho + 10) × (alto + 10), rule = 'base'
 * - Se calcula metersLinear usando m² / (anchoRollo en metros)
 */
export function computeFabricCutAndArea({ widthCm, heightCm, rollWidthCm }) {
    const w = Number(widthCm) || 0;
    const h = Number(heightCm) || 0;
    const roll = Number(rollWidthCm) || 0;

    // ✅ Modo simple-roll: rollo más ancho que el alto del estor
    if (roll > 0 && roll > h) {
        const metersLinear = (w + 10) / 100; // solo se usa el +10 en el ancho, para consumo real
        return {
            cutWidth: w,          // mostrado sin margen
            cutHeight: h,         // mostrado sin margen
            rule: 'simple-roll',
            metersLinear          // útil para saltarse el cálculo por m²
        };
    }

    // ⬇️ Caso base (se mantiene la lógica anterior con márgenes)
    const cutWidth = w + 10;
    const cutHeight = h + 10;

    let metersLinear = 0;
    if (roll > 0) {
        const areaM2 = (cutWidth * cutHeight) / 10000;
        metersLinear = areaM2 / (roll / 100);
    }

    return { cutWidth, cutHeight, rule: 'base', metersLinear };
}

export function toSquareMeters({ cutWidth, cutHeight }) {
    return (Number(cutWidth) * Number(cutHeight)) / 10000;
}

export function round2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }
