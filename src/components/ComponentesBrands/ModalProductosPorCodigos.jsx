import { useEffect, useMemo, useState, useCallback } from "react";
import { cdnUrl } from "../../Constants/cdn";
import { defaultImageUrl } from "../../Constants/constants";

const DEFAULTS = Object.freeze({
    title: "Productos relacionados",
    maxCodes: 80,
    maxImageHydrate: 80,
});

function uniqueCodes(codes, max = DEFAULTS.maxCodes) {
    if (!Array.isArray(codes)) return [];
    const out = [];
    const seen = new Set();

    for (const c of codes) {
        const code = String(c || "").trim();
        if (!code || seen.has(code)) continue;
        seen.add(code);
        out.push(code);
        if (out.length >= max) break;
    }

    return out;
}

function buildByCodesUrl(apiUrl) {
    const base = String(apiUrl || "").replace(/\/$/, "");
    if (!base) throw new Error("VITE_API_BASE_URL no definido");
    return `${base}/api/products/by-codes`;
}

function buildImageUrl(apiUrl, codprodu, quality) {
    const base = String(apiUrl || "").replace(/\/$/, "");
    if (!base) throw new Error("VITE_API_BASE_URL no definido");
    return `${base}/api/images/${codprodu}/${quality}`;
}

/* =========================
   MODEL
   ========================= */
async function fetchProductsByCodes({ apiUrl, codes, signal }) {
    const normalized = uniqueCodes(codes);
    if (!normalized.length) return [];

    const url = buildByCodesUrl(apiUrl);

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codes: normalized }),
        signal,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
            `POST ${url} -> ${res.status} ${res.statusText}${text ? ` | ${text.slice(0, 200)}` : ""}`
        );
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        const text = await res.text().catch(() => "");
        throw new Error(`Respuesta no JSON en ${url}. content-type=${contentType}. Body: ${text.slice(0, 200)}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
}

async function fetchProductImage({ apiUrl, codprodu, quality, signal }) {
    if (!codprodu) return null;

    const url = buildImageUrl(apiUrl, codprodu, quality);
    const res = await fetch(url, { signal });

    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    const path = json?.ficadjunto;

    return path ? cdnUrl(path) : null;
}

async function hydrateLowResImages({ apiUrl, products, signal }) {
    const slice = Array.isArray(products) ? products.slice(0, DEFAULTS.maxImageHydrate) : [];

    const hydrated = await Promise.all(
        slice.map(async (p) => {
            if (!p?.codprodu) return p;

            // Si ya viene, no repetimos
            if (p.imageBaja) return p;

            const low = await fetchProductImage({
                apiUrl,
                codprodu: p.codprodu,
                quality: "PRODUCTO_BAJA",
                signal,
            });

            return { ...p, imageBaja: low || defaultImageUrl };
        })
    );

    // Si había más productos, los dejamos tal cual detrás
    if (products.length > hydrated.length) {
        return hydrated.concat(products.slice(hydrated.length));
    }

    return hydrated;
}

/* =========================
   CONTROLLER (hook)
   ========================= */
function useProductsByCodes({ isOpen, apiUrl, codes }) {
    const normalizedCodes = useMemo(() => uniqueCodes(codes), [codes]);

    const [state, setState] = useState(() => ({
        loading: false,
        error: null,
        products: [],
    }));

    useEffect(() => {
        if (!isOpen) return;

        const controller = new AbortController();
        let alive = true;

        async function run() {
            setState({ loading: true, error: null, products: [] });

            try {
                const products = await fetchProductsByCodes({
                    apiUrl,
                    codes: normalizedCodes,
                    signal: controller.signal,
                });

                const withLow = await hydrateLowResImages({
                    apiUrl,
                    products,
                    signal: controller.signal,
                });

                if (!alive) return;
                setState({ loading: false, error: null, products: withLow });
            } catch (err) {
                if (!alive) return;
                if (controller.signal.aborted) return;

                setState({
                    loading: false,
                    error: err instanceof Error ? err.message : "Error cargando productos",
                    products: [],
                });
            }
        }

        run();

        return () => {
            alive = false;
            controller.abort();
        };
    }, [isOpen, apiUrl, normalizedCodes]);

    return { ...state, normalizedCodes, setState };
}

/* =========================
   VIEW
   ========================= */
function ModalProductosPorCodigos({
    isOpen,
    onClose,
    codes,
    apiUrl,
    title = DEFAULTS.title,
    onProductClick, // (product) => void
}) {
    const { loading, error, products, normalizedCodes, setState } = useProductsByCodes({
        isOpen,
        apiUrl,
        codes,
    });

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose?.();
    };

    const handleClickProduct = useCallback(
        async (p) => {
            if (!p) return;

            // 1) aseguramos baja (por si no llegó aún)
            const imageBaja =
                p.imageBaja ||
                (await fetchProductImage({
                    apiUrl,
                    codprodu: p.codprodu,
                    quality: "PRODUCTO_BAJA",
                    signal: undefined,
                })) ||
                defaultImageUrl;

            // 2) precargamos buena para abrir el modal ya “con calidad”
            const imageBuena =
                p.imageBuena ||
                (await fetchProductImage({
                    apiUrl,
                    codprodu: p.codprodu,
                    quality: "PRODUCTO_BUENA",
                    signal: undefined,
                })) ||
                null;

            const next = { ...p, imageBaja, imageBuena: imageBuena || p.imageBuena };

            // opcional: reflejar la buena en el grid para siguientes aperturas
            setState((prev) => ({
                ...prev,
                products: prev.products.map((x) => (x?.codprodu === p.codprodu ? next : x)),
            }));

            onProductClick?.(next);
        },
        [apiUrl, onProductClick, setState]
    );

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[25] flex items-center  justify-center bg-black/50 p-4"
            onMouseDown={handleBackdrop}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-6xl max-h-[85%] mt-[5%] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4">
                    <div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full px-3 py-2 text-sm font-medium text-black/70 hover:bg-black/5"
                        aria-label="Cerrar"
                    >
                        Cerrar
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[75vh] overflow-auto p-5">
                    {loading && <div className="py-10 text-center text-black/70">Cargando productos…</div>}

                    {!loading && error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                            <div className="mt-2 text-xs text-red-700/80">
                                Endpoint esperado: <code>{buildByCodesUrl(apiUrl)}</code>
                            </div>
                        </div>
                    )}

                    {!loading && !error && products.length === 0 && (
                        <div className="py-10 text-center text-black/60">No se han encontrado productos para estos códigos.</div>
                    )}

                    {!loading && !error && products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {products.map((p) => {

                                const image = p?.imageBaja || defaultImageUrl;

                                return (
                                    <div className="flex-1 min-h-0 overflow-y-auto p-5">
                                        <button
                                            key={p.codprodu}
                                            type="button"
                                            onClick={() => handleClickProduct(p)}
                                            className="group text-left overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm hover:shadow-md transition"
                                        >
                                            <div className="aspect-[4/3] w-full overflow-hidden bg-black/5">
                                                <img
                                                    src={image}
                                                    alt={p.nombre}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                    onError={(e) => {
                                                        e.currentTarget.src = defaultImageUrl;
                                                    }}
                                                />
                                            </div>

                                            <div className="p-4">
                                                <div className="mt-1 line-clamp-2 text-sm font-semibold text-black">{p.nombre}</div>
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )
                    }
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 border-t border-black/10 px-5 py-4">
                    <div className="text-xs text-black/50">Tip: haz clic para ver el producto.</div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalProductosPorCodigos;