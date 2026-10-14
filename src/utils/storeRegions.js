/**
 * Filtros geográficos de puntos de venta.
 * Tanto las opciones como el filtrado proceden EXCLUSIVAMENTE de tiendas
 * incluidas en la respuesta de la API y con coordenadas válidas.
 * No se incluye ningún catálogo fijo de países o provincias.
 */

// Las tildes, diferencias de mayúsculas y espacios no crean opciones repetidas.
export function regionKey(value) {
    return String(value ?? "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .toLocaleLowerCase("es");
}

function regionLabel(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
}

function uniqueRegionOptions(stores, field) {
    const regions = new Map();

    for (const store of stores) {
        const label = regionLabel(store?.[field]);
        const key = regionKey(label);
        if (key && !regions.has(key)) {
            regions.set(key, { value: key, label });
        }
    }

    return [...regions.values()].sort((a, b) =>
        a.label.localeCompare(b.label, "es", { sensitivity: "base" })
    );
}

export function availableCountries(validStores) {
    return uniqueRegionOptions(validStores, "pais");
}

export function availableProvinces(validStores, countryKey) {
    if (!countryKey) return [];
    return uniqueRegionOptions(
        validStores.filter((store) => regionKey(store.pais) === countryKey),
        "provincia"
    );
}

export function storesInRegion(validStores, countryKey = "", provinceKey = "") {
    return validStores.filter((store) =>
        (!countryKey || regionKey(store.pais) === countryKey) &&
        (!provinceKey || (countryKey && regionKey(store.provincia) === provinceKey))
    );
}
