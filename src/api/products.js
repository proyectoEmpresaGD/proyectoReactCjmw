// src/api/products.js
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1234';

export async function searchLinings({ names = [], q = '' } = {}) {
    const res = await fetch(`${API}/api/products/linings/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
    const res = await fetch(`${API}/api/products/${productId}/colors`, {
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error(`Error ${res.status} cargando colores`);
    }

    const data = await res.json();

    return Array.isArray(data?.colors) ? data.colors : [];
}

export async function searchCurtainFabrics({ q = '' } = {}) {
    const base = import.meta.env.VITE_API_BASE_URL || API;

    const resp = await fetch(`${base}/api/products/curtains/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ q }),
    });

    if (!resp.ok) {
        return [];
    }

    const json = await resp.json();
    const items = Array.isArray(json?.items) ? json.items : [];

    return items.map(p => ({
        id: p.id ?? p.codprodu,
        codprodu: p.codprodu,
        name: p.name ?? p.nombre,
        collection: p.collection ?? p.coleccion ?? '',
        pricePerMeter: p.pricePerMeter ?? safeNumber(p.precioMetro) ?? safeNumber(p.precioMetroRaw),
        imageUrl: p.imageUrl ?? null,
        ancho: p.ancho ?? null,
    }));
}

export async function searchWallpapers({ limit = 80 } = {}) {
    const res = await fetch(`${API}/api/products/wallpapers/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ limit }),
    });

    if (!res.ok) {
        return [];
    }

    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];

    return items.map(p => ({
        id: p.id ?? p.codprodu,
        codprodu: p.codprodu,
        name: p.name ?? p.nombre ?? '',
        imageUrl: p.imageUrl ?? null,
        collection: p.collection ?? p.coleccion ?? '',
        price: p.price != null ? Number(p.price) : null,
        width: p.width ?? null,
        type: p.type ?? null,
        style: p.style ?? null
    }));
}

export async function searchUpholsteryFabrics({ q = '' } = {}) {
    const base = import.meta.env.VITE_API_BASE_URL || API;

    const resp = await fetch(`${base}/api/products/upholstery/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ q }),
    });

    if (!resp.ok) {
        return [];
    }

    const json = await resp.json();
    const items = Array.isArray(json?.items) ? json.items : [];

    return items.map(p => ({
        id: p.id ?? p.codprodu,
        codprodu: p.codprodu,
        name: p.name ?? p.nombre,
        collection: p.collection ?? p.coleccion ?? '',
        pricePerMeter: p.pricePerMeter ?? null,
        imageUrl: p.imageUrl ?? null,
    }));
}

function safeNumber(v) {
    if (v == null) return null;

    const n = Number(String(v).replace(',', '.').replace(/[^\d.]/g, ''));

    return Number.isFinite(n) ? n : null;
}