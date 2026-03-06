// src/services/collectionsClient.js
// Cliente HTTP para pedir imágenes de colecciones al backend (/api/collections/*)

const toQuery = (params = {}) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        sp.set(k, String(v));
    });
    return sp.toString();
};

export async function fetchCollectionImages({ marca, coleccion, key, signal } = {}) {
    if (!marca || (!coleccion && !key)) {
        throw new Error('fetchCollectionImages: falta "marca" y (al menos) "coleccion" o "key".');
    }

    const qs = toQuery({ marca, coleccion, key });
    const res = await fetch(`/api/collections/images?${qs}`, { signal });

    if (!res.ok) {
        throw new Error(`Error ${res.status} al cargar imágenes de colección`);
    }

    const data = await res.json();
    return Array.isArray(data?.images) ? data.images : [];
}

export async function fetchBrandCollections({ marca, signal } = {}) {
    if (!marca) throw new Error('fetchBrandCollections: falta "marca".');

    const res = await fetch(`/api/collections/brand/${encodeURIComponent(marca)}`, { signal });
    if (!res.ok) {
        throw new Error(`Error ${res.status} al cargar colecciones de marca`);
    }

    const data = await res.json();
    // { marca, collections: { "NOMBRE COLECCION": ["url1", ...], ... } }
    return data?.collections ?? {};
}