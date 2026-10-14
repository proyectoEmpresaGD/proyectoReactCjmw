import test from "node:test";
import assert from "node:assert/strict";
import { retryDelayMs, classifyStore, syncStoreGeographyOnce } from "../services/storeGeographyAutoSync.js";

const noLogs = { info() {}, warn() {}, error() {} };

function makeDatabase(points, now = () => Date.now()) {
    const stores = new Map(points.map((p) => [String(p.id), { ...p, id: String(p.id) }]));
    const geography = new Map();
    const retries = new Map();
    const queries = [];
    let lockAvailable = true;
    const client = {
        async query(sql, args = []) {
            queries.push(sql);
            if (sql.includes("pg_try_advisory_lock")) return { rows: [{ adquirido: lockAvailable }] };
            if (sql.includes("pg_advisory_unlock")) return { rows: [{}] };
            if (sql.includes("DELETE FROM public.puntos_venta_geografia g")) {
                for (const [id, cached] of geography) {
                    const point = stores.get(id);
                    if (!point || point.lat !== cached.lat || point.lng !== cached.lng) geography.delete(id);
                }
                return { rows: [] };
            }
            if (sql.includes("DELETE FROM public.puntos_venta_geografia_reintentos r")) {
                for (const [id] of retries) if (!stores.has(id)) retries.delete(id);
                return { rows: [] };
            }
            if (sql.includes("MAX(proximo_intento) AS bloqueo_hasta")) {
                const until = Math.max(0, ...[...retries.values()]
                    .filter((item) => /^\[HTTP (401|403|429)\]/.test(item.error))
                    .map((item) => item.next));
                return { rows: [{ bloqueo_hasta: until ? new Date(until) : null }] };
            }
            if (sql.includes("FROM public.puntos_venta p") && sql.includes("LIMIT $1")) {
                const rows = [...stores.values()].filter((point) => {
                    if (point.lat == null || point.lng == null) return false;
                    if (Math.abs(point.lat) > 90 || Math.abs(point.lng) > 180 || (point.lat === 0 && point.lng === 0)) return false;
                    const old = geography.get(point.id);
                    if (old?.lat === point.lat && old?.lng === point.lng && old.pais && old.provincia) return false;
                    const retry = retries.get(point.id);
                    return !retry || retry.lat !== point.lat || retry.lng !== point.lng || retry.next <= now();
                }).sort((a, b) => Number(a.id) - Number(b.id)).slice(0, args[0]).map((point) => {
                    const retry = retries.get(point.id);
                    return { ...point, pais_nativo: point.pais_nativo || null,
                        provincia_nativa: point.provincia_nativa || null,
                        intentos_previos: retry?.attempts || null,
                        lat_previa: retry?.lat ?? null, lng_previa: retry?.lng ?? null };
                });
                return { rows };
            }
            if (sql.includes("INSERT INTO public.puntos_venta_geografia\n")) {
                const [id, lat, lng, pais, provincia] = args;
                geography.set(String(id), { lat, lng, pais, provincia });
                return { rows: [] };
            }
            if (sql.includes("DELETE FROM public.puntos_venta_geografia_reintentos WHERE codpunto")) {
                retries.delete(String(args[0])); return { rows: [] };
            }
            if (sql.includes("INSERT INTO public.puntos_venta_geografia_reintentos\n")) {
                const [id, lat, lng, attempts, when, error] = args;
                retries.set(String(id), { lat, lng, attempts, next: when.getTime(), error });
                return { rows: [] };
            }
            throw new Error(`SQL inesperado en mock: ${sql.slice(0, 90)}`);
        },
        release() {},
    };
    return { stores, geography, retries, queries, setLock(value) { lockAvailable = value; },
        pool: { async connect() { return client; } } };
}

function sync(database, extra = {}) {
    return syncStoreGeographyOnce({ pool: database.pool, prepare: async () => {},
        logger: noLogs, pause: async () => {}, ...extra });
}

test("Las 21 tiendas conocidas se guardan sin ninguna petición externa", async () => {
    const db = makeDatabase([{ id: 2, lat: 37.586784324249166, lng: -4.658694292094171 }]);
    const first = await sync(db, { reverse() { throw Error("No debe llamar a la API"); } });
    assert.equal(first.updated, 1);
    assert.deepEqual(db.geography.get("2"), {
        lat: 37.586784324249166, lng: -4.658694292094171,
        pais: "España", provincia: "Córdoba",
    });
    const second = await sync(db);
    assert.equal(second.updated, 0);
});

test("Nueva tienda y cambio de coordenadas: se reclasifican automáticamente", async () => {
    const db = makeDatabase([{ id: 91, lat: 36.72, lng: -4.42 }]);
    let requests = 0;
    const reverse = async ({ lat }) => {
        requests += 1;
        return lat === 36.72
            ? { pais: "España", provincia: "Málaga" }
            : { pais: "Francia", provincia: "Alpes-Maritimes" };
    };
    await sync(db, { apiKey: "clave", reverse });
    assert.equal(db.geography.get("91").pais, "España");
    assert.equal(db.geography.get("91").provincia, "Málaga");
    db.stores.set("91", { id: "91", lat: 43.57, lng: 7.02 });
    await sync(db, { apiKey: "clave", reverse });
    assert.equal(db.geography.get("91").pais, "Francia");
    assert.equal(db.geography.get("91").provincia, "Alpes-Maritimes");
    assert.equal(requests, 2);
});

test("Al borrar la tienda desaparece también su geografía y estado de reintento", async () => {
    const db = makeDatabase([{ id: 3, lat: 36.42922354580339, lng: -5.159631118892461 }]);
    await sync(db);
    db.stores.delete("3");
    await sync(db);
    assert.equal(db.geography.has("3"), false);
});

test("Fallo externo: reintento diferido y posterior recuperación", async () => {
    let clock = 1_000_000;
    const db = makeDatabase([{ id: 95, lat: 48.8566, lng: 2.3522 }], () => clock);
    let count = 0;
    const reverse = async () => {
        count += 1;
        if (count === 1) throw Object.assign(new Error("temporal"), { status: 503 });
        return { pais: "Francia", provincia: "Paris" };
    };
    const options = { apiKey: "clave", reverse, now: () => clock };
    assert.equal((await sync(db, options)).failed, 1);
    assert.equal(db.retries.get("95").attempts, 1);
    assert.equal((await sync(db, options)).inspected, 0);
    clock += retryDelayMs(1, 503) + 1;
    assert.equal((await sync(db, options)).updated, 1);
    assert.equal(db.retries.has("95"), false);
});

test("Credenciales/cuota: no procesar las demás tiendas en esta pasada", async () => {
    const db = makeDatabase([
        { id: 96, lat: 48.86, lng: 2.35 },
        { id: 97, lat: 47.2, lng: 1.1 },
    ]);
    let count = 0;
    const result = await sync(db, { reverse: async () => {
        count += 1;
        throw Object.assign(new Error("cuota agotada"), { status: 429 });
    } });
    assert.equal(count, 1);
    assert.equal(result.failed, 1);
    assert.equal(db.retries.get("96").attempts, 1);
    assert.equal(db.retries.has("97"), false);
    const next = await sync(db, { reverse: async () => {
        throw Error("No debe llamar: cooldown global");
    } });
    assert.match(next.skipped, /temporalmente bloqueado/);
});

test("Bloqueo entre instancias: segunda no procesa registros", async () => {
    const db = makeDatabase([{ id: 90, lat: 36, lng: -4 }]);
    db.setLock(false);
    const result = await sync(db);
    assert.ok(result.skipped);
    assert.equal(result.updated, 0);
});

test("Columnas geográficas nativas evitan llamadas externas", async () => {
    const db = makeDatabase([{
        id: 88, lat: 43.5, lng: 7.1,
        pais_nativo: "France", provincia_nativa: "Alpes-Maritimes",
    }]);
    const result = await sync(db, { reverse() { throw Error("No llamar"); } });
    assert.equal(result.updated, 1);
    assert.equal(db.geography.get("88").pais, "Francia");
});

test("Cuotas y fallos permanentes limitan los reintentos", () => {
    assert.equal(retryDelayMs(1, 429), 3_600_000);
    assert.equal(retryDelayMs(1, 401), 86_400_000);
    assert.equal(retryDelayMs(1, 500), 600_000);
    assert.ok(retryDelayMs(8, 500) <= 86_400_000);
});

test("Las ubicaciones no clasificables no se asignan a un país inventado", async () => {
    await assert.rejects(() => classifyStore({ id: 89, lat: 1, lng: 1 }, {
        reverse: async () => ({ pais: "Francia", provincia: null }),
    }), /país y provincia/);
});
