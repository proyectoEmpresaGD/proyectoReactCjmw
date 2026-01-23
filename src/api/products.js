// src/api/products.js
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1234';

export async function searchLinings({ names = [], q = '' } = {}) {
    const res = await fetch(`${API}/api/products/linings/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names, q }),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Error ${res.status} buscando forros`);
    }
    const data = await res.json();
    return Array.isArray(data?.items) ? data.items : [];
}

export async function getProductColors(productId) {
    const res = await fetch(`${API}/api/products/${productId}/colors`);
    if (!res.ok) throw new Error(`Error ${res.status} cargando colores`);
    const data = await res.json();
    return Array.isArray(data?.colors) ? data.colors : [];

}

export async function searchCurtainFabrics({ q = '' } = {}) {
    // Usa la misma base que el resto de endpoints
    const base = import.meta.env.VITE_API_BASE_URL || API;

    // Asumiendo que ya tienes el endpoint del backend:
    // POST /api/products/curtains/search  ->  { items: [...] }
    const resp = await fetch(`${base}/api/products/curtains/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q }),
    });

    if (!resp.ok) {
        // Si quieres ser tolerante, devuelve [] en vez de lanzar
        // para no romper la UI cuando el backend aún no está listo.
        return [];
    }

    const json = await resp.json();
    const items = Array.isArray(json?.items) ? json.items : [];

    return items.map(p => ({
        id: p.id ?? p.codprodu,
        name: p.name ?? p.nombre,
        pricePerMeter: p.pricePerMeter ?? safeNumber(p.precioMetro) ?? safeNumber(p.precioMetroRaw),
        imageUrl: p.imageUrl ?? null,
        // IMPORTANTE: el ancho de la pieza (bolt width) que usaremos en el cálculo
        // Mantenemos el string si viene con unidades (p.e. "280 cm" / "2.8 m")
        ancho: p.ancho ?? null,
    }));
}

// === BÚSQUEDA DE PAPELES (type = WALLPAPER) ===
export async function searchWallpapers({ limit = 80 } = {}) {
    const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1234';

    const res = await fetch(`${API}/api/products/wallpapers/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit }), // ya no enviamos q
    });

    if (!res.ok) return [];

    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];

    return items.map(p => ({
        id: p.id ?? p.codprodu,
        name: p.name ?? p.nombre ?? '',
        imageUrl: p.imageUrl ?? null,
        collection: p.collection ?? p.coleccion ?? '',
        price: p.price != null ? Number(p.price) : null,
        width: p.width ?? null,
        type: p.type ?? null,
        style: p.style ?? null
    }));
}


function hasUpholsteryUsage(product) {
    const xml = product?.usoXml || product?.uso || '';
    const s = String(xml).toUpperCase();
    // filtro tolerante: busca “TAPICERIA” dentro del XML/texto
    return /TAPICER[ÍI]A/.test(s);
}

/**
 * Busca tejidos cuyo uso incluya TAPICERIA.
 * Devuelve [{ id, name, pricePerMeter, imageUrl?, ... }]
 */
// === BÚSQUEDA DE TEJIDOS DE TAPICERÍA (sin helper http) ===
// Buscar TEJIDOS de TAPICERÍA (usa el endpoint nuevo del backend)
export async function searchUpholsteryFabrics({ q = '' } = {}) {
    const base = import.meta.env.VITE_API_BASE_URL;
    const resp = await fetch(`${base}/api/products/upholstery/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q }),
    });
    if (!resp.ok) return [];
    const json = await resp.json();
    const items = Array.isArray(json?.items) ? json.items : [];
    return items.map(p => ({
        id: p.id ?? p.codprodu,
        name: p.name,
        pricePerMeter: p.pricePerMeter ?? null,
        imageUrl: p.imageUrl ?? null,
    }));
}

function safeNumber(v) {
    if (v == null) return null;
    const n = Number(String(v).replace(',', '.').replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : null;
}
