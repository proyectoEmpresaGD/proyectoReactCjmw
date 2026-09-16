import fetch from "node-fetch";

const GEOCODE_URL = "https://api.heigit.org/pelias/v1/search";

const ROUTE_URL =
    "https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson";

const REQUEST_TIMEOUT_MS = 8000;

const GEOCODE_CACHE_TTL_MS = 10 * 60 * 1000;
const ROUTE_CACHE_TTL_MS = 5 * 60 * 1000;

class MapsUpstreamError extends Error {
    constructor(message, status = 502, code = "UPSTREAM_ERROR") {
        super(message);

        this.name = "MapsUpstreamError";
        this.status = status;
        this.code = code;
    }
}

function getCached(cache, key) {
    const entry = cache.get(key);

    if (!entry) {
        return null;
    }

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

async function parseUpstreamResponse(response) {
    const text = await response.text();

    let data = {};

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = {};
        }
    }

    if (!response.ok) {
        const status = response.status;

        if (status === 429) {
            throw new MapsUpstreamError(
                "OpenRouteService quota exceeded",
                429,
                "QUOTA_EXCEEDED"
            );
        }

        const message =
            data?.error?.message ||
            data?.error ||
            data?.message ||
            `HeiGIT responded with status ${status}`;

        throw new MapsUpstreamError(
            message,
            status >= 500 ? 502 : status
        );
    }

    return data;
}

export class MapsModel {
    constructor({
        apiKey = process.env.OPENROUTESERVICE_API_KEY,
        fetchImpl = fetch,
    } = {}) {
        this.apiKey = apiKey;
        this.fetchImpl = fetchImpl;

        this.geocodeCache = new Map();
        this.routeCache = new Map();

        this.inFlightGeocodes = new Map();
        this.inFlightRoutes = new Map();
    }

    assertConfigured() {
        if (!this.apiKey) {
            const error = new Error(
                "OPENROUTESERVICE_API_KEY is not configured"
            );

            error.status = 500;
            error.code = "MAPS_API_KEY_MISSING";

            throw error;
        }
    }

    async request(url, options = {}) {
        this.assertConfigured();

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, REQUEST_TIMEOUT_MS);

        try {
            const response = await this.fetchImpl(url, {
                ...options,

                headers: {
                    Authorization: this.apiKey,
                    ...(options.headers ?? {}),
                },

                signal: controller.signal,
            });

            return await parseUpstreamResponse(response);
        } catch (error) {
            if (error?.name === "AbortError") {
                throw new MapsUpstreamError(
                    "HeiGIT request timed out",
                    504,
                    "UPSTREAM_TIMEOUT"
                );
            }

            throw error;
        } finally {
            clearTimeout(timeout);
        }
    }

    async withCache({
        cache,
        inFlight,
        key,
        ttlMs,
        request,
    }) {
        const cached = getCached(cache, key);

        if (cached) {
            return cached;
        }

        if (inFlight.has(key)) {
            return inFlight.get(key);
        }

        const promise = request()
            .then((value) => {
                setCached(cache, key, value, ttlMs);

                return value;
            })
            .finally(() => {
                inFlight.delete(key);
            });

        inFlight.set(key, promise);

        return promise;
    }

    async geocode(query) {
        const normalizedQuery = query
            .trim()
            .toLowerCase();

        return this.withCache({
            cache: this.geocodeCache,
            inFlight: this.inFlightGeocodes,

            key: normalizedQuery,

            ttlMs: GEOCODE_CACHE_TTL_MS,

            request: async () => {
                const url = new URL(GEOCODE_URL);

                url.searchParams.set("text", query);
                url.searchParams.set("size", "1");

                return this.request(
                    url.toString(),
                    {
                        method: "GET",

                        headers: {
                            Accept: "application/json",
                        },
                    }
                );
            },
        });
    }

    async route(origin, destination) {
        const routeKey = [
            origin.lat.toFixed(6),
            origin.lng.toFixed(6),
            destination.lat.toFixed(6),
            destination.lng.toFixed(6),
        ].join(":");

        return this.withCache({
            cache: this.routeCache,
            inFlight: this.inFlightRoutes,

            key: routeKey,

            ttlMs: ROUTE_CACHE_TTL_MS,

            request: () =>
                this.request(
                    ROUTE_URL,
                    {
                        method: "POST",

                        headers: {
                            Accept: "application/geo+json",
                            "Content-Type": "application/json",
                        },

                        body: JSON.stringify({
                            coordinates: [
                                [
                                    origin.lng,
                                    origin.lat,
                                ],
                                [
                                    destination.lng,
                                    destination.lat,
                                ],
                            ],
                        }),
                    }
                ),
        });
    }
}

export { MapsUpstreamError };