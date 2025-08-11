// services/cache.js

let kv = null;
try {
    // No revienta si no existe en tu deploy local
    kv = (await import('@vercel/kv')).kv;
} catch { }

const mem = new Map();

function memGet(key) {
    const hit = mem.get(key);
    if (!hit) return null;
    const { value, exp } = hit;
    if (exp && Date.now() > exp) {
        mem.delete(key);
        return null;
    }
    return value;
}
function memSet(key, value, ttlSeconds) {
    mem.set(key, { value, exp: ttlSeconds ? Date.now() + ttlSeconds * 1000 : 0 });
}

export async function cacheGetJSON(key) {
    if (kv) {
        const raw = await kv.get(key);
        return raw ? JSON.parse(raw) : null;
    }
    return memGet(key);
}

export async function cacheSetJSON(key, value, ttlSeconds) {
    if (kv) {
        await kv.set(key, JSON.stringify(value), { ex: ttlSeconds });
    } else {
        memSet(key, value, ttlSeconds);
    }
}
