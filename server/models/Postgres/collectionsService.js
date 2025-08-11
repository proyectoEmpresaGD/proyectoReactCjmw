// models/Postgres/collectionsService.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ENV opcionales:
// COLLECTIONS_JSON_PATH = ruta absoluta al collections.json (prioridad máxima)
// IMG_BASE_URL          = https://bassari.eu   (para completar rutas relativas si algún día aparecen)
// CDN_BASE              = https://img.bassari.eu (para reescritura opcional a CDN)
const IMG_BASE_URL = process.env.IMG_BASE_URL?.replace(/\/$/, '') || '';
const CDN_BASE = process.env.CDN_BASE?.replace(/\/$/, '') || '';

let collectionsCache = null;
let lastLoadTs = 0;
const RELOAD_MS = 60 * 1000;

// Normaliza claves: quita tildes/espacios/símbolos y pone MAYÚSCULAS
function normalizeKey(s = '') {
    return s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/&/g, 'AND')
        .replace(/[^A-Za-z0-9]/g, '')
        .toUpperCase();
}

// Resuelve la ruta del JSON probando varias ubicaciones comunes
async function resolveCollectionsPath() {
    const candidates = [];

    if (process.env.COLLECTIONS_JSON_PATH) {
        candidates.push(process.env.COLLECTIONS_JSON_PATH);
    }

    // 1) ../data junto al servicio (server/models/Postgres/data/collections.json)
    candidates.push(path.join(__dirname, '..', 'data', 'collections.json'));
    // 2) ./data al lado del servicio (server/models/Postgres/collectionsService.js -> server/models/Postgres/data)
    candidates.push(path.join(__dirname, 'data', 'collections.json'));
    // 3) la ruta que te marcaba el error (server/models/data)
    candidates.push(path.resolve(process.cwd(), 'server', 'models', 'data', 'collections.json'));
    // 4) por si ejecutas desde server/
    candidates.push(path.resolve(process.cwd(), 'models', 'data', 'collections.json'));

    for (const p of candidates) {
        try {
            await fs.access(p);
            return p;
        } catch { /* probar siguiente */ }
    }

    throw new Error(
        `collections.json no encontrado. Revisa COLLECTIONS_JSON_PATH o coloca el archivo en:
- server/models/Postgres/data/collections.json
- server/models/data/collections.json`
    );
}

async function loadCollections() {
    const now = Date.now();
    if (collectionsCache && now - lastLoadTs < RELOAD_MS) return collectionsCache;

    const jsonPath = await resolveCollectionsPath();
    const raw = await fs.readFile(jsonPath, 'utf8');
    const parsed = JSON.parse(raw);

    // Preconstruimos un índice normalizado por marca->colección
    // Estructura: { BAS: { KASSUMAY:[...], TRIBAL:[...] }, ... }
    // y además brandIndexNorm: { BAS: { KASSUMAY:[...], KANNATURAVOLII:[...] } }
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
        // absoluta válida
        const t = new URL(u);
        return t.toString();
    } catch {
        // relativa -> completar con IMG_BASE_URL si existe
        if (!IMG_BASE_URL) return u;
        return `${IMG_BASE_URL}${u.startsWith('/') ? '' : '/'}${u}`;
    }
}

// Reescribe a CDN solo para el dominio bassari.eu (o ajusta a tu caso)
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

// --- API del modelo ---

export async function getRandomImageUrlFromJson({ marca, coleccion, key }) {
    const { brandIndex, brandIndexNorm } = await loadCollections();

    const brand = brandIndex[marca] || null;
    if (!brand) return null;

    let list = null;

    // 1) si me pasas key normalizada, pruebo directa
    if (key && brandIndexNorm[marca]) {
        list = brandIndexNorm[marca][normalizeKey(key)] || null;
    }

    // 2) si no hubo suerte con key, pruebo con el nombre bonito
    if (!list && coleccion) {
        // a) coincidencia exacta (sensitivo)
        list = brand[coleccion] || null;

        // b) normalizada (insensible a tildes/espacios/símbolos)
        if (!list) {
            const n = normalizeKey(coleccion);
            list = brandIndexNorm[marca]?.[n] || null;
        }
    }

    if (!Array.isArray(list) || list.length === 0) return null;

    const random = list[Math.floor(Math.random() * list.length)];
    const abs = toAbsoluteUrl(random);
    return maybeCdn(abs);
}

export async function getAllImagesForCollection({ marca, coleccion, key }) {
    const { brandIndex, brandIndexNorm } = await loadCollections();

    const brand = brandIndex[marca] || null;
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
