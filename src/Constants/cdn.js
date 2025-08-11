// Constants/cdn.js
export function cdnUrl(u) {
    if (!u) return u;

    // No tocar blobs/Data URLs
    if (typeof u === "string" && /^(data:|blob:)/i.test(u)) return u;

    try {
        // Base para resolver relativas (en entorno SSR no hay window)
        const baseForRelative =
            typeof window !== "undefined" && window.location
                ? window.location.origin
                : "http://localhost";

        const absolute = new URL(u, baseForRelative);

        const cdnBaseRaw = import.meta.env.VITE_CDN_BASE?.trim();
        if (!cdnBaseRaw) return absolute.href; // sin CDN configurado → tal cual

        const cdnBase = new URL(cdnBaseRaw);

        // Si YA viene del CDN, no reescribir
        if (absolute.host === cdnBase.host) return absolute.href;

        // Solo reescribir hosts *.bassari.eu
        const isBassari = /\.?bassari\.eu$/i.test(absolute.hostname);
        if (!isBassari) return absolute.href;

        // Construir URL en el CDN preservando path, query y hash
        const path = absolute.pathname.startsWith("/")
            ? absolute.pathname
            : `/${absolute.pathname}`;

        return `${cdnBase.origin}${path}${absolute.search}${absolute.hash}`;
    } catch {
        // Si falla el parseo, devuelve lo que te dieron
        return u;
    }
}
