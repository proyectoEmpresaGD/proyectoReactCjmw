/**
 * Referencias geográficas verificadas a partir de los 21 puntos de venta
 * suministrados. Se usan SOLO si codpunto y coordenadas siguen coincidiendo.
 * No constituyen el catálogo de filtros; estos se crean a partir de los
 * establecimientos que la API devuelve realmente desde PostgreSQL.
 */
const KNOWN_LOCATIONS = new Map([
    ["2", { lat: 37.586784324249166, lng: -4.658694292094171, pais: "España", provincia: "Córdoba" }],
    ["3", { lat: 36.42922354580339, lng: -5.159631118892461, pais: "España", provincia: "Málaga" }],
    ["4", { lat: 36.51254673169135, lng: -4.905043607819556, pais: "España", provincia: "Málaga" }],
    ["5", { lat: 36.48195147648294, lng: -4.99383859545655, pais: "España", provincia: "Málaga" }],
    ["6", { lat: 36.70691487900119, lng: -4.46788387043145, pais: "España", provincia: "Málaga" }],
    ["7", { lat: 40.42126384054199, lng: -3.686159246195406, pais: "España", provincia: "Madrid" }],
    ["8", { lat: 40.42575768247665, lng: -3.6817537054880294, pais: "España", provincia: "Madrid" }],
    ["9", { lat: 40.42619930095491, lng: -3.682414714808484, pais: "España", provincia: "Madrid" }],
    ["10", { lat: 40.42409200413065, lng: -3.6957327754449825, pais: "España", provincia: "Madrid" }],
    ["11", { lat: 40.44755031575113, lng: -3.6730568431495314, pais: "España", provincia: "Madrid" }],
    ["12", { lat: 40.43846531268905, lng: -3.634704247472065, pais: "España", provincia: "Madrid" }],
    ["13", { lat: 40.429672308903186, lng: -3.681004668378678, pais: "España", provincia: "Madrid" }],
    ["14", { lat: 40.41381784812596, lng: -3.699832652981245, pais: "España", provincia: "Madrid" }],
    ["15", { lat: 41.1517459168177, lng: -8.628341240515946, pais: "Portugal", provincia: "Porto" }],
    ["16", { lat: 52.292102209674276, lng: 4.577443641546199, pais: "Países Bajos", provincia: "Zuid-Holland" }],
    ["17", { lat: 52.06891817515861, lng: 4.365991624333963, pais: "Países Bajos", provincia: "Zuid-Holland" }],
    ["18", { lat: 51.97234223558989, lng: 5.346069851779655, pais: "Países Bajos", provincia: "Utrecht" }],
    ["19", { lat: 51.931896548802264, lng: 4.485197454539532, pais: "Países Bajos", provincia: "Zuid-Holland" }],
    ["20", { lat: 52.09124810919306, lng: 4.30451582433533, pais: "Países Bajos", provincia: "Zuid-Holland" }],
    ["21", { lat: 43.57722499289682, lng: 7.02037709687001, pais: "Francia", provincia: "Alpes-Maritimes" }],
    ["22", { lat: 37.12125, lng: -3.60525, pais: "España", provincia: "Granada" }],
]);

export function getKnownStoreGeography(id, lat, lng) {
    const location = KNOWN_LOCATIONS.get(String(id));
    if (!location) return null;
    const currentLat = Number(lat);
    const currentLng = Number(lng);
    if (!Number.isFinite(currentLat) || !Number.isFinite(currentLng)) return null;
    // Evita asignar una provincia antigua si la tienda se ha trasladado.
    if (Math.abs(currentLat - location.lat) > 0.00001 ||
        Math.abs(currentLng - location.lng) > 0.00001) return null;
    return { pais: location.pais, provincia: location.provincia };
}
