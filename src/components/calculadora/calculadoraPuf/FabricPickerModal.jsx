import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { searchUpholsteryFabrics, getProductColors } from '../../../api/products';
import { defaultImageUrlModalProductos } from '../../../Constants/constants';

const Q_BUENA = 'PRODUCTO_BUENA';
const Q_BAJA = 'PRODUCTO_BAJA';

export default function FabricPickerModal({ open, onClose, onPicked }) {
    const [q, setQ] = useState('');
    const [step, setStep] = useState(0); // 0 productos, 1 colores
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [colors, setColors] = useState([]);
    const [loadingColors, setLoadingColors] = useState(false);

    const getThumbForId = useCallback(async (id) => {
        const base = import.meta.env.VITE_API_BASE_URL;
        const urlBuena = `${base}/api/images/${id}/${encodeURIComponent(Q_BUENA)}`;
        const urlBaja = `${base}/api/images/${id}/${encodeURIComponent(Q_BAJA)}`;

        try {
            const [bRes, lRes] = await Promise.all([
                fetch(urlBuena).then((r) => (r.ok ? r.json() : null)),
                fetch(urlBaja).then((r) => (r.ok ? r.json() : null)),
            ]);

            // La URL viene completa del backend: usar tal cual
            return (
                bRes?.ficadjunto ||
                bRes?.ficAdjunto ||
                lRes?.ficadjunto ||
                lRes?.ficAdjunto ||
                defaultImageUrlModalProductos
            );
        } catch {
            return defaultImageUrlModalProductos;
        }
    }, []);

    // Reset al abrir
    useEffect(() => {
        if (!open) return;
        setQ('');
        setStep(0);
        setItems([]);
        setSelectedProduct(null);
        setColors([]);
        setError('');
    }, [open]);

    // STEP 0 → buscar tejidos con uso TAPICERÍA
    useEffect(() => {
        if (!open || step !== 0) return;
        let alive = true;

        setError('');
        setLoading(true);

        const handler = setTimeout(async () => {
            try {
                const baseItems = await searchUpholsteryFabrics({ q }); // [{id,name,pricePerMeter}]

                const enriched = await Promise.all(
                    (baseItems || []).map(async (p) => {
                        const thumb = await getThumbForId(p.id);
                        return { ...p, imageUrl: thumb };
                    })
                );

                if (!alive) return;
                setItems(enriched);
            } catch (e) {
                if (!alive) return;
                setItems([]);
                setError(e?.message || 'No se pudieron cargar los tejidos de tapicería');
            } finally {
                if (alive) setLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(handler);
            alive = false;
        };
    }, [open, step, q, getThumbForId]);

    // STEP 1 → colores del producto seleccionado
    useEffect(() => {
        if (!open || step !== 1 || !selectedProduct?.id) return;
        let alive = true;

        (async () => {
            setError('');
            setLoadingColors(true);

            try {
                const rawColors = await getProductColors(selectedProduct.id);

                const enriched = (rawColors || []).map((c) => ({
                    ...c,
                    name: c.name ?? c.nombre ?? c.tonalidad ?? c.colorprincipal ?? 'Color',
                    imageUrl: c.imageUrl || c.ficadjunto || c.ficAdjunto || defaultImageUrlModalProductos,
                }));
                setColors(enriched);

            } catch (e) {
                if (!alive) return;
                setColors([]);
                setError(e?.message || 'No se pudieron cargar los colores');
            } finally {
                if (alive) setLoadingColors(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [open, step, selectedProduct]);

    if (!open) return null;

    const modalUI = (
        <div className="fixed inset-0 z-[10050]">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-[36rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <h4 className="text-sm font-semibold">
                        {step === 0 ? 'Elige tu tejido' : `Colores de: ${selectedProduct?.name}`}
                    </h4>
                    <button className="rounded-md px-2 py-1 text-gray-600 hover:bg-gray-100" onClick={onClose} aria-label="Cerrar">
                        ✕
                    </button>
                </div>

                <div className="p-4">
                    {step === 0 && (
                        <>
                            <input
                                type="text"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Buscar por nombre…"
                                className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                            />

                            {loading && <div className="text-sm text-gray-500">Cargando…</div>}
                            {error && <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">{error}</div>}

                            <ul className="max-h-80 overflow-auto divide-y rounded-md border">
                                {items.length === 0 && !loading && <li className="p-3 text-sm text-gray-500">Sin resultados.</li>}

                                {items.map((p) => (
                                    <li key={p.id} className="flex items-center gap-3 p-3 hover:bg-gray-50">
                                        <img
                                            src={p.imageUrl || defaultImageUrlModalProductos}
                                            alt={p.name}
                                            className="h-10 w-10 rounded object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = defaultImageUrlModalProductos;
                                            }}
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-medium">{p.name}</div>
                                            {typeof p.pricePerMeter === 'number' && (
                                                <div className="text-xs text-gray-500">{p.pricePerMeter.toFixed(2)} €/m</div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedProduct(p);
                                                setStep(1);
                                            }}
                                            className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                                        >
                                            Ver colores
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            {loadingColors && <div className="text-sm text-gray-500">Cargando colores…</div>}
                            {error && <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-700">{error}</div>}

                            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-auto pr-1">
                                {colors.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => {
                                            onPicked?.({
                                                product: selectedProduct,
                                                color: c,
                                                pricePerMeter: selectedProduct?.pricePerMeter ?? null,
                                            });
                                            onClose?.();
                                        }}
                                        className="flex items-center gap-3 rounded-md border p-2 text-left hover:border-gray-900 hover:bg-gray-50"
                                    >
                                        <img
                                            src={c.imageUrl || defaultImageUrlModalProductos}
                                            alt={c.name}
                                            className="h-10 w-10 rounded object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = defaultImageUrlModalProductos;
                                            }}
                                        />

                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium">{c.name}</div>
                                        </div>
                                    </button>
                                ))}

                                {!loadingColors && colors.length === 0 && (
                                    <div className="col-span-2 text-sm text-gray-500">Este producto no tiene colores configurados.</div>
                                )}
                            </div>

                            <div className="mt-3 flex justify-between">
                                <button onClick={() => setStep(0)} className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-50">
                                    Volver a productos
                                </button>

                                <button
                                    onClick={() => {
                                        onPicked?.({
                                            product: selectedProduct,
                                            color: null,
                                            pricePerMeter: selectedProduct?.pricePerMeter ?? null,
                                        });
                                        onClose?.();
                                    }}
                                    className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                                >
                                    Elegir sin color
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalUI, document.body);
}
