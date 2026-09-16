const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const MAPS_API_BASE = `${API_BASE}/api/maps`;

const GEOCODE_CACHE_TTL_MS = 10 * 60 * 1000;
const ROUTE_CACHE_TTL_MS = 5 * 60 * 1000;

const geocodeCache = new Map();
const routeCache = new Map();

function getCached(cache, key) {
    const entry = cache.get(key);

    if (!entry) return null;

    if (entry.expiresAt <= Date.now()) {
        cache.delete(key);
        return null;
    }

    return entry.value;
}

function setCached(cache, key, value, ttlMs) {
    cache.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
    });
}

async function parseResponse(response) {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data?.error || data?.message || "Map request failed");
        error.status = response.status;
        error.code = data?.code || null;
        error.data = data;
        throw error;
    }

    return data;
}

async function postJson(path, payload, signal) {
    const response = await fetch(`${MAPS_API_BASE}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal,
    });

    return parseResponse(response);
}

export async function geocodeLocation(query, { signal } = {}) {
    const normalizedQuery = String(query ?? "").trim().toLowerCase();
    const cached = getCached(geocodeCache, normalizedQuery);

    if (cached) return cached;

    const result = await postJson("/geocode", { query: String(query ?? "").trim() }, signal);

    setCached(geocodeCache, normalizedQuery, result, GEOCODE_CACHE_TTL_MS);

    return result;
}

export async function requestDrivingRoute(origin, destination, { signal } = {}) {
    const routeKey = [
        Number(origin.lat).toFixed(6),
        Number(origin.lng).toFixed(6),
        Number(destination.lat).toFixed(6),
        Number(destination.lng).toFixed(6),
    ].join(":");

    const cached = getCached(routeCache, routeKey);

    if (cached) return cached;

    const result = await postJson(
        "/route",
        {
            origin: {
                lat: origin.lat,
                lng: origin.lng,
            },
            destination: {
                lat: destination.lat,
                lng: destination.lng,
            },
        },
        signal
    );

    setCached(routeCache, routeKey, result, ROUTE_CACHE_TTL_MS);

    return result;
}
