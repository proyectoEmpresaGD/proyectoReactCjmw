export function buildRef(prefix = 'PRES') {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${prefix}-${y}${m}${day}-${rnd}`;
}

export function buildVerifyUrl(ref) {
    const base = (import.meta.env.PUBLIC_BASE_URL || window.__PUBLIC_BASE_URL__ || '').replace(/\/$/, '');
    return `${base}/verify/${encodeURIComponent(ref)}`;
}
