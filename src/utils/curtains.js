// src/utils/curtains.js
import { CURTAIN_CONFIG } from '../Constants/constants.jsx';

/**
 * Parser robusto para campos de precio provenientes de inputs de texto.
 * Acepta formatos con € y comas.
 */
export const parsePrecioToNumber = (raw) => {
    if (raw == null) return 0;
    const s = String(raw).trim().replace('€', '').replace(/\s+/g, '').replace(',', '.');
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
};

/**
 * Parser robusto para "ancho" de pieza (e.g. "300 cm", "3 m", "280").
 * Devuelve centímetros.
 */
export function parseBoltWidthCm(input, fallback = 140) {
    if (input == null) return Number(fallback) || 140;
    const s = String(input).trim().toLowerCase().replace(',', '.');
    const m = s.match(/(\d+(\.\d+)?)/);
    if (!m) return Number(fallback) || 140;
    let v = parseFloat(m[1]);
    if (!Number.isFinite(v)) return Number(fallback) || 140;
    // Si el string menciona metros y no "cm", interpretamos en metros
    if (s.includes('m') && !s.includes('cm')) v = v * 100; // "3 m" -> 300 cm
    return v;
}

/**
 * Intenta obtener el ancho de pieza desde varios posibles campos del producto/color.
 * Devuelve un número en cm (o fallback si no encuentra nada).
 */
export function getBoltWidthFromEntity(entity, fallback = 140) {
    if (!entity) return Number(fallback) || 140;
    const candidates = [
        entity.ancho,
        entity.width,
        entity.widthCm,
        entity.anchoTela,
        entity.anchoPieza,
        entity.anchoCm,
        entity.ancho_en_cm,
        entity.ANCHO,
        entity.WIDTH,
        entity.descripcion,
        entity.description,
        entity.detalle,
        entity.detail,
    ].filter(Boolean);

    // Primer valor parseable que encontremos
    for (const c of candidates) {
        const parsed = parseBoltWidthCm(c, NaN);
        if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
    return Number(fallback) || 140;
}

/**
 * Reglas de precio de confección por metro.
 * (Definidas por negocio, 2025-10-07)
 */
const MAKING_PRICE_PER_METER = {
    ollaos: 45,
    fruncido: 16,
    ondaPerfecta: 16,
    dosPinzas: 16,
    tresPinzas: 16,
    tablasCocidas: 16,
};

const LINING_EXTRA_PER_METER = 25; // coste adicional si es forrada

/**
 * Cálculo base reutilizable: devuelve metros, caídas, etc. SIN costes ni paneles.
 */
export function calculateMeters({
    heightCm,
    widthCm,
    fabricBoltWidthCm, // si no viene, usa cfg.fabricBoltWidthCm
    makingType = 'tablasCocidas',
    bottom = 'aRas',
}) {
    const cfg = CURTAIN_CONFIG;
    const fullness = cfg.fullnessFactorByType[makingType] ?? 2.0;

    const effectiveWidthCm = (Number(widthCm) + cfg.sideMarginCm * 2) * fullness;
    const bolt = Math.max(
        1,
        Number(fabricBoltWidthCm ?? cfg.fabricBoltWidthCm ?? 140) || 140
    );
    const drops = Math.max(1, Math.ceil(effectiveWidthCm / bolt));
    const extraBottom = bottom === 'colgante' ? cfg.extraBottomColganteCm : 0;
    const heightPerDropCm = Number(heightCm) + cfg.topHemCm + cfg.bottomHemCm + extraBottom;

    // Metros para UN conjunto (sin multiplicar por paneles)
    const metersFabric = round1((heightPerDropCm * drops) / 100);

    return {
        metersFabric,
        drops,
        heightPerDropCm,
        effectiveWidthCm: round2(effectiveWidthCm),
        boltWidthUsedCm: bolt,
        fullness,
    };
}

/**
 * Cálculo de cortinas (motor general del proyecto).
 * Multiplica por paneles (perPanel).
 */
export function calculateCurtain({
    heightCm,
    widthCm,
    panels = 'simple',           // 'simple' | 'doble'
    makingType = 'tablasCocidas', // 'ollaos' | 'fruncido' | 'ondaPerfecta' | 'dosPinzas' | 'tresPinzas' | 'tablasCocidas'
    bottom = 'aRas',              // 'aRas' | 'colgante'
    lining = 'sin forrar',        // 'forrada' | 'sin forrar'
    pricePerMeter = 0,            // €/m de la tela
    includeMaking = true,
    fabricBoltWidthCm,            // ancho de pieza (si no va, usa cfg.fabricBoltWidthCm)
}) {
    // 1) Paneles
    const perPanel = panels === 'doble' ? 2 : 1;

    // 2) Base de metros (sin paneles)
    const base = calculateMeters({
        heightCm,
        widthCm,
        fabricBoltWidthCm,
        makingType,
        bottom,
    });

    // 3) Metros totales (aplicando paneles)
    const metersFabric = round1(base.metersFabric * perPanel);

    // 4) Coste de tela
    const fabricCost = round2(metersFabric * Number(pricePerMeter || 0));

    // 5) Coste de confección
    const baseMakingPerM = MAKING_PRICE_PER_METER[makingType] ?? 0;
    const liningExtraPerM = lining === 'forrada' ? LINING_EXTRA_PER_METER : 0;
    const makingPerM = baseMakingPerM + liningExtraPerM;
    const makingCost = includeMaking ? round2(metersFabric * makingPerM) : 0;

    // 6) Total
    const total = round2(fabricCost + makingCost);

    return {
        input: {
            heightCm: Number(heightCm),
            widthCm: Number(widthCm),
            panels,
            makingType,
            bottom,
            lining,
            pricePerMeter: Number(pricePerMeter || 0),
            includeMaking,
            fabricBoltWidthCm: Number(fabricBoltWidthCm ?? 0) || null,
        },
        metersFabric,
        drops: base.drops,
        heightPerDropCm: base.heightPerDropCm,
        effectiveWidthCm: base.effectiveWidthCm,
        boltWidthUsedCm: base.boltWidthUsedCm,
        perPanel,
        fullness: base.fullness,
        // costes
        fabricCost,
        makingCost,
        makingPerM,
        total,
    };
}

function round2(n) {
    return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}
function round1(n) {
    return Math.round((Number(n) + Number.EPSILON) * 10) / 10;
}
