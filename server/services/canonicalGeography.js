/** Unificar variantes comunes de los datos de geocodificación. */
function key(value) {
    return String(value ?? "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim().toLowerCase().replace(/\s+/g, " ");
}
function cleaned(value) {
    const text = String(value ?? "").trim();
    return text && text.toUpperCase() !== "NULL" ? text : null;
}
const COUNTRY_NAMES = new Map([
    ...["espana", "spain", "es"].map(x => [x, "España"]),
    ...["france", "francia", "fr"].map(x => [x, "Francia"]),
    ...["portugal", "pt"].map(x => [x, "Portugal"]),
    ...["paises bajos", "the netherlands", "netherlands", "nederland", "holland", "nl"].map(x => [x, "Países Bajos"]),
]);
const NETHERLANDS_REGIONS = new Map([
    ["south holland", "Zuid-Holland"], ["zuid holland", "Zuid-Holland"], ["zuid-holland", "Zuid-Holland"],
    ["holanda meridional", "Zuid-Holland"],
    ["north holland", "Noord-Holland"], ["noord holland", "Noord-Holland"], ["noord-holland", "Noord-Holland"],
    ["utrecht", "Utrecht"],
]);
const SPAIN_REGIONS = new Map([
    ["cordoba", "Córdoba"], ["malaga", "Málaga"],
    ["granada", "Granada"], ["madrid", "Madrid"],
]);
export function canonicalGeography({ pais, provincia }) {
    const rawCountry = cleaned(pais);
    const rawProvince = cleaned(provincia);
    const country = COUNTRY_NAMES.get(key(rawCountry)) || rawCountry;
    const regionKey = key(rawProvince);
    let region = rawProvince;
    if (country === "Países Bajos") region = NETHERLANDS_REGIONS.get(regionKey) || region;
    if (country === "España") region = SPAIN_REGIONS.get(regionKey) || region;
    if (country === "Francia" && regionKey === "alpes maritimes") region = "Alpes-Maritimes";
    if (country === "Portugal" && ["oporto", "porto district", "distrito do porto"].includes(regionKey)) region = "Porto";
    return { pais: country, provincia: region };
}
