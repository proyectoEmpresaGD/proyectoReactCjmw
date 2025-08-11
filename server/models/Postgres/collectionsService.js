// models/Postgres/collectionsService.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ENV opcionales:
// COLLECTIONS_JSON_PATH   -> ruta absoluta al JSON (prioridad máxima)
// COLLECTIONS_JSON_INLINE -> contenido Base64 del JSON (fallback serverless)
// IMG_BASE_URL            -> para completar rutas relativas (si algún día aparecen)
// CDN_BASE                -> para reescritura opcional a CDN
const IMG_BASE_URL = process.env.IMG_BASE_URL?.replace(/\/$/, '') || '';
const CDN_BASE = process.env.CDN_BASE?.replace(/\/$/, '') || '';

let collectionsCache = null;
let lastLoadTs = 0;
const RELOAD_MS = 60 * 1000;

// Normalizador de claves: quita tildes/espacios/símbolos y pone MAYÚSCULAS
function normalizeKey(s = '') {
    return s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/&/g, 'AND')
        .replace(/[^A-Za-z0-9]/g, '')
        .toUpperCase();
}

/** Intenta leer el JSON desde:
 *  1) process.env.COLLECTIONS_JSON_PATH (ruta absoluta)
 *  2) process.env.COLLECTIONS_JSON_INLINE (Base64)
 *  3) require() de rutas empaquetadas
 *  4) fs en rutas comunes del repo
 */
async function readCollectionsJSON() {
    // 1) Ruta absoluta por env
    if (process.env.COLLECTIONS_JSON_PATH) {
        const p = process.env.COLLECTIONS_JSON_PATH;
        const raw = await fs.readFile(p, 'utf8');
        return JSON.parse(raw);
    }

    // 2) Inline Base64 por env (útil en serverless)
    if (process.env.COLLECTIONS_JSON_INLINE) {
        const raw = Buffer.from(process.env.COLLECTIONS_JSON_INLINE, 'base64').toString('utf8');
        return JSON.parse(raw);
    }

    // 3) require() de rutas “bundled”
    const requireCandidates = [
        // junto al servicio
        path.join(__dirname, 'data', 'collections.json'),
        path.join(__dirname, '..', 'data', 'collections.json'),
        // ubicaciones típicas del repo
        path.resolve(process.cwd(), 'server', 'models', 'Postgres', 'data', 'collections.json'),
        path.resolve(process.cwd(), 'server', 'models', 'data', 'collections.json'),
        path.resolve(process.cwd(), 'models', 'data', 'collections.json')
    ];

    for (const p of requireCandidates) {
        try {
            // Si existe, require lo resolverá tras el build
            // (si falla, lanzará excepción; probamos la siguiente)
            const data = require(p);
            return data;
        } catch { /* probar siguiente */ }
    }

    // 4) fs como último recurso
    for (const p of requireCandidates) {
        try {
            const raw = await fs.readFile(p, 'utf8');
            return JSON.parse(raw);
        } catch { /* probar siguiente */ }
    }

    throw new Error('No se encontró collections.json en ninguna ruta conocida. Usa COLLECTIONS_JSON_PATH o COLLECTIONS_JSON_INLINE.');
}

async function loadCollections() {
    const now = Date.now();
    if (collectionsCache && (now - lastLoadTs < RELOAD_MS)) return collectionsCache;

    const parsed = await readCollectionsJSON();

    // Estructura esperada: { BAS: { "KASSUMAY":[...], ... }, ARE: {...}, ... }
    const brandIndex = parsed || {};
    const brandIndexNorm = {};

    for (const [brand, cols] of Object.entries(brandIndex)) {
        const normMap = {};
        for (const [colName, arr] of Object.entries(cols || {})) {
            normMap[normalizeKey(colName)] = arr;
        }
        brandIndexNorm[brand] = normMap;
    }

    collectionsCache = { brandIndex, brandIndexNorm };
    lastLoadTs = now;
    return collectionsCache;
}

function toAbsoluteUrl(u) {
    if (!u) return null;
    try {
        const t = new URL(u);
        return t.toString(); // ya es absoluta
    } catch {
        // relativa -> completar con IMG_BASE_URL si existe
        if (!IMG_BASE_URL) return u;
        return `${IMG_BASE_URL}${u.startsWith('/') ? '' : '/'}${u}`;
    }
}

// Reescribe a CDN solo si apunta a *.bassari.eu (ajusta según tu caso)
function maybeCdn(url) {
    if (!url || !CDN_BASE) return url;
    try {
        const u = new URL(url);
        if (u.hostname.endsWith('bassari.eu')) {
            return `${CDN_BASE}${u.pathname}${u.search || ''}`;
        }
        return url;
    } catch {
        return url;
    }
}

// --------- API del modelo ----------

export async function getRandomImageUrlFromJson({ marca, coleccion, key }) {
    const { brandIndex, brandIndexNorm } = await loadCollections();
    const brand = brandIndex[marca];
    if (!brand) return null;

    let list = null;

    // 1) prioridad: key normalizada si viene
    if (key && brandIndexNorm[marca]) {
        list = brandIndexNorm[marca][normalizeKey(key)] || null;
    }

    // 2) “coleccion” bonita (exacta) o normalizada
    if (!list && coleccion) {
        list = brand[coleccion] || brandIndexNorm[marca]?.[normalizeKey(coleccion)] || null;
    }

    if (!Array.isArray(list) || list.length === 0) return null;

    const random = list[Math.floor(Math.random() * list.length)];
    const abs = toAbsoluteUrl(random);
    return maybeCdn(abs);
}

export async function getAllImagesForCollection({ marca, coleccion, key }) {
    const { brandIndex, brandIndexNorm } = await loadCollections();
    const brand = brandIndex[marca];
    if (!brand) return [];

    let list = null;

    if (key && brandIndexNorm[marca]) {
        list = brandIndexNorm[marca][normalizeKey(key)] || null;
    }
    if (!list && coleccion) {
        list = brand[coleccion] || brandIndexNorm[marca]?.[normalizeKey(coleccion)] || null;
    }

    return (Array.isArray(list) ? list : [])
        .map(toAbsoluteUrl)
        .map(maybeCdn)
        .filter(Boolean);
}

export async function getCollectionsForBrand(marca) {
    const { brandIndex } = await loadCollections();
    const brand = brandIndex[marca] || {};
    const result = {};
    for (const [col, arr] of Object.entries(brand)) {
        result[col] = (arr || []).map(toAbsoluteUrl).map(maybeCdn).filter(Boolean);
    }
    return result;
}
