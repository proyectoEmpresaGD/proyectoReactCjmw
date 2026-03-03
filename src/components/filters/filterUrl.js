// src/app/products/filterUrl.js
const normalizeKey = (value) =>
    value?.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase();

const uniqueList = (arr) => {
    if (!Array.isArray(arr)) return [];
    const seen = new Set();
    const out = [];
    for (const v of arr) {
        const val = (v ?? "").toString().trim();
        if (!val) continue;
        const k = normalizeKey(val);
        if (!k || seen.has(k)) continue;
        seen.add(k);
        out.push(val);
    }
    return out;
};

export const EMPTY_FILTERS = {
    brand: [],
    color: [],
    collection: [],
    fabricType: [],
    fabricPattern: [],
    martindale: [],
    uso: [],
    mantenimiento: [],
    martindaleRanges: [],
};

export function buildProductsSearchFromFilters(selectedFilters) {
    const f = { ...EMPTY_FILTERS, ...(selectedFilters || {}) };

    // Normaliza arrays para evitar duplicados raros
    f.brand = uniqueList(f.brand);
    f.color = uniqueList(f.color);
    f.collection = uniqueList(f.collection);
    f.fabricType = uniqueList(f.fabricType);
    f.fabricPattern = uniqueList(f.fabricPattern);
    f.uso = uniqueList(f.uso);
    f.mantenimiento = uniqueList(f.mantenimiento);
    f.martindaleRanges = uniqueList(f.martindaleRanges);

    // Martindale numérico
    const martindaleNums = Array.isArray(f.martindale)
        ? f.martindale.map((n) => Number(n)).filter((n) => Number.isFinite(n))
        : [];

    const qs = new URLSearchParams();
    qs.set("page", "1");

    f.brand.forEach((v) => qs.append("brand", v));
    f.color.forEach((v) => qs.append("color", v));
    f.collection.forEach((v) => qs.append("collection", v));
    f.fabricType.forEach((v) => qs.append("fabricType", v));
    f.fabricPattern.forEach((v) => qs.append("fabricPattern", v));
    martindaleNums.forEach((v) => qs.append("martindale", String(v)));
    f.martindaleRanges.forEach((v) => qs.append("martindaleRange", v));
    f.uso.forEach((v) => qs.append("uso", v));
    f.mantenimiento.forEach((v) => qs.append("mantenimiento", v));

    return qs.toString();
}