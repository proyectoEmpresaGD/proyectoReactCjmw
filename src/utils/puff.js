// src/utils/puff.js
export const PUFF_TYPES = ['mediaLuna', 'redondo', 'trebol'];
export const CONFECCION_COST = 162;          // € fijos
export const METERS_SINGLE = 1.20;           // 1 tejido
export const METERS_SPLIT_EACH = 0.60;       // 2 tejidos → cada uno 0.60

/**
 * Convierte string de precio a número seguro (acepta "45,90", "45.90", "45 €"...)
 */
export function parsePrecio(raw) {
    if (raw == null) return 0;
    const s = String(raw).replace('€', '').replace(/\s+/g, '').replace(',', '.');
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
}

/**
 * Cálculo del presupuesto de puf.
 * @param {Object} input
 * @param {'mediaLuna'|'redondo'|'trebol'} input.puffType
 * @param {('uno'|'dos')} input.fabricsMode
 * @param {number} input.price1  Precio €/m del tejido 1
 * @param {number} [input.price2] Precio €/m del tejido 2 (si aplica)
 */
export function calculatePuffQuote({ puffType, fabricsMode, price1 = 0, price2 = 0 }) {
    const oneFabric = fabricsMode === 'uno';

    const fabricCost1 = oneFabric
        ? round2(METERS_SINGLE * price1)
        : round2(METERS_SPLIT_EACH * price1);

    const fabricCost2 = oneFabric ? 0 : round2(METERS_SPLIT_EACH * price2);

    const total = round2(fabricCost1 + fabricCost2 + CONFECCION_COST);

    return {
        puffType,
        fabricsMode,
        meters1: oneFabric ? METERS_SINGLE : METERS_SPLIT_EACH,
        meters2: oneFabric ? 0 : METERS_SPLIT_EACH,
        fabricCost1,
        fabricCost2,
        confeccion: CONFECCION_COST,
        total,
    };
}

function round2(n) {
    return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}
