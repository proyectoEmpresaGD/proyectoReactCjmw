/**
 * Enriquecimiento geográfico usando el servicio inverso de Pelias/HeiGIT,
 * que ya se utiliza en este proyecto para geocodificación y rutas.
 * Sin dependencia de Nominatim ni solicitudes desde los navegadores.
 */

import { canonicalGeography } from "./canonicalGeography.js";

export const DEFAULT_REVERSE_GEOCODE_URL = "https://api.heigit.org/pelias/v1/reverse";

function clean(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function parseReverseGeography(data) {
    const features = Array.isArray(data?.features) ? data.features : [];
    // Preferimos una respuesta que permita especificar provincia/departamento.
    const candidates = features
        .map((feature) => feature?.properties || {})
        .filter((properties) => clean(properties.country));
    const closest = candidates[0];
    if (!closest) return null;
    // Evitar saltar a un país distinto si el punto está cerca de una frontera.
    const sameCountry = candidates.filter((p) => p.country === closest.country);
    const candidate = sameCountry.find((p) => clean(p.county || p.region)) || closest;
    if (!candidate) return null;
    const pais = clean(candidate.country);
    // En Países Bajos county suele ser un municipio: región = provincia.
    // En Portugal se prefiere región/distrito frente a concelho.
    // En España y Francia county suele representar provincia/departamento.
    const countryKey = pais.toLocaleLowerCase("es");
    const preferRegion = ["netherlands", "nederland", "países bajos", "portugal"]
        .some((name) => countryKey.includes(name));
    const provincia = clean(preferRegion
        ? candidate.region || candidate.macroregion || candidate.county
        : candidate.county || candidate.region || candidate.macroregion);
    return canonicalGeography({ pais, provincia: provincia || null });
}

export async function reverseGeocodeStore({ lat, lng, apiKey, fetchImpl = fetch }) {
    if (!apiKey) throw new Error("Falta OPENROUTESERVICE_API_KEY");
    const url = new URL(process.env.PUNTOS_VENTA_REVERSE_URL || DEFAULT_REVERSE_GEOCODE_URL);
    url.searchParams.set("point.lat", String(lat));
    url.searchParams.set("point.lon", String(lng));
    url.searchParams.set("size", "5");
    url.searchParams.set("lang", "es");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
        const response = await fetchImpl(url.toString(), {
            headers: {
                Accept: "application/json",
                Authorization: apiKey,
                "User-Agent": "CJMW-StoreLocator/1.0 (https://www.cjmw.eu)",
            },
            signal: controller.signal,
        });
        if (!response.ok) {
            const error = new Error(`Servicio geográfico HTTP ${response.status}`);
            error.status = response.status;
            throw error;
        }
        return parseReverseGeography(await response.json());
    } finally {
        clearTimeout(timeout);
    }
}
