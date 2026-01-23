// src/utils/imageDataUrl.js
// Solo proxy (como en la modal) + resolución robusta del primer dataURL válido.

function blobToDataURL(blob) {
    return new Promise((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = rej;
        fr.readAsDataURL(blob);
    });
}

export function isDataURL(str) {
    return typeof str === 'string' && str.startsWith('data:');
}

function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') return null;
    const u = url.trim();
    if (u.startsWith('//')) return `https:${u}`;
    if (/^https?:\/\//i.test(u)) return u;
    return u;
}

function proxyBase() {
    const base = (import.meta?.env?.VITE_API_BASE_URL || '').trim();
    return base ? `${base.replace(/\/+$/, '')}/api/proxy` : '/api/proxy';
}

/** Convierte URL -> dataURL solo vía proxy. Si el proxy devolviera HTML, se descarta. */
export async function toDataURLViaProxy(url, { timeout = 10000, label = '' } = {}) {
    if (!url || typeof url !== 'string') return null;
    if (isDataURL(url)) return url;

    const clean = sanitizeUrl(url);
    if (!clean) return null;

    const proxied = `${proxyBase()}?url=${encodeURIComponent(clean)}&ts=${Date.now()}`;

    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const res = await fetch(proxied, { signal: controller.signal, cache: 'no-store' });
        clearTimeout(id);

        if (!res.ok) {
            console.debug('[img] proxy NOT OK', res.status, clean, label);
            return null;
        }

        const blob = await res.blob();
        const dataUrl = await blobToDataURL(blob);

        if (typeof dataUrl === 'string' && dataUrl.startsWith('data:text/html')) {
            console.debug('[img] proxy returned HTML (discarded)', clean, label);
            return null;
        }
        if (typeof dataUrl === 'string' && dataUrl.startsWith('data:image')) {
            return dataUrl;
        }

        console.debug('[img] proxy returned non-image (discarded)', clean, label);
        return null;
    } catch (err) {
        console.debug('[img] proxy error', err, clean, label);
        return null;
    }
}

/** Heurística flexible para encontrar una URL de imagen en un objeto */
export function guessImageUrl(obj) {
    if (!obj || typeof obj !== 'object') return null;

    const direct =
        obj.imageBuena || obj.imageBaja || obj.imageUrl || obj.image || obj.imagen || obj.foto ||
        obj.thumbnail || obj.thumbUrl || obj.previewUrl || obj.swatchUrl;
    if (typeof direct === 'string') return direct;

    const nested = obj?.image?.url || obj?.imagen?.url || obj?.assets?.thumbnail || obj?.assets?.image;
    if (nested) return nested;

    const arr =
        (Array.isArray(obj.images) && obj.images[0]) ||
        (Array.isArray(obj.fotos) && obj.fotos[0]) ||
        (obj?.assets?.images && obj.assets.images[0]) ||
        null;

    if (typeof arr === 'string') return arr;
    if (arr && typeof arr === 'object') {
        return arr.url || arr.imageUrl || arr.thumbnail || arr.previewUrl || arr.swatchUrl || null;
    }

    return null;
}

/** Prueba varias URLs y devuelve el PRIMER dataURL válido (o null) */
export async function resolveFirstDataUrl(candidates, { label = '' } = {}) {
    for (const url of candidates) {
        if (!url || typeof url !== 'string' || !url.trim()) continue;
        const data = await toDataURLViaProxy(url, { label });
        if (data) return data;
    }
    return null;
}
