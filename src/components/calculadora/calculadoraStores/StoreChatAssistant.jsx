// src/components/calculadora/StoreChatAssistant.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import CurtainFabricPickerModal from '../calculadoraCortinas/CurtainFabricPickerModal';
import {
    computeMaxDimensions,
    computeStorePrice,
    computeFabricCutAndArea,
    getRollWidthCm,
    toSquareMeters,
    round2
} from '../../../utils/stores';
import { generateStoreQuotePDF } from '../../../utils/quotePdf';

const TOTAL_STEPS = 5;
const W_MIN = 30;
const H_MIN = 30;

export default function StoreChatAssistant({
    initialOpen = false,
    onClose,
    onFinished,
}) {
    const [open, setOpen] = useState(initialOpen);
    const [step, setStep] = useState(0);

    // Tela principal (un solo tejido)
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [showFabricModal, setShowFabricModal] = useState(false);

    // Precio por metro lineal de la tela
    const [ppm, setPpm] = useState(0);

    // Medidas
    const [widthCm, setWidthCm] = useState(120);
    const [heightCm, setHeightCm] = useState(150);

    // Mecanismo
    const [withRods, setWithRods] = useState(true);

    // Usar el producto tal cual; el util leerá "ancho"
    const fabric = selectedProduct;

    // Límites dinámicos por tejido (usa parseo de "ancho")
    const { maxWidth, maxHeight, rollWidth, warnPrinted } = useMemo(
        () => computeMaxDimensions(fabric || {}),
        [fabric]
    );

    const clampedWidth = Math.min(Math.max(Number(widthCm) || 0, W_MIN), maxWidth || Infinity);
    const clampedHeight = Math.min(Math.max(Number(heightCm) || 0, H_MIN), maxHeight || Infinity);

    const price = useMemo(
        () => computeStorePrice({ widthCm: clampedWidth, withRods }),
        [clampedWidth, withRods]
    );

    // Ancho de rollo ya parseado en cm (desde "ancho")
    const rollWidthCm = useMemo(() => rollWidth || getRollWidthCm(fabric || {}), [rollWidth, fabric]);

    // --- Cálculo original del util (lo mantenemos para el caso normal) ---
    const cutInfoRaw = useMemo(() => {
        return computeFabricCutAndArea({ widthCm: clampedWidth, heightCm: clampedHeight, rollWidthCm });
    }, [clampedWidth, clampedHeight, rollWidthCm]);

    // === NUEVA LÓGICA: caso simple cuando el rollo es más ancho que el alto
    // y además el ancho del estor NO supera el ancho del rollo.
    // Queremos: metrosLineales = (ancho + 10) / 100, sin mostrar márgenes ni etiquetas.
    const simpleRoll = useMemo(() => {
        const rw = Number(rollWidthCm) || 0;
        const h = Number(clampedHeight) || 0;
        const w = Number(clampedWidth) || 0;
        // Condición pedida:
        // 1) rollo más ancho que el alto del estor
        // 2) el ancho del estor cabe en el rollo
        return rw > 0 && rw > h && w <= rw;
    }, [rollWidthCm, clampedHeight, clampedWidth]);

    // Información de corte que se muestra (sin márgenes visibles)
    const cutInfoDisplay = useMemo(() => {
        if (simpleRoll) {
            return {
                cutWidth: clampedWidth,     // se muestra tal cual
                cutHeight: clampedHeight,   // se muestra tal cual (sin +10)
                rule: 'simple-roll'         // etiqueta interna (no se muestra)
            };
        }
        // Caso normal: usamos lo que diga el util
        return {
            cutWidth: cutInfoRaw?.cutWidth ?? clampedWidth,
            cutHeight: cutInfoRaw?.cutHeight ?? clampedHeight,
            rule: cutInfoRaw?.rule
        };
    }, [simpleRoll, clampedWidth, clampedHeight, cutInfoRaw]);

    // Área solo tiene sentido en el caso no-simple. En simple no se usa ni se muestra.
    const areaM2 = useMemo(() => {
        if (simpleRoll) return NaN; // evitamos usar m²
        return toSquareMeters(cutInfoRaw);
    }, [simpleRoll, cutInfoRaw]);

    // Metros lineales
    const metersLinear = useMemo(() => {
        if (simpleRoll) {
            // Regla solicitada: (ancho + 10) / 100
            return (Number(clampedWidth) + 10) / 100;
        }
        // Regla anterior (no simple): m² / (ancho de rollo en metros)
        const rollM = Number(rollWidthCm) / 100 || 0;
        const area = Number(areaM2) || 0;
        return rollM > 0 ? area / rollM : 0;
    }, [simpleRoll, clampedWidth, rollWidthCm, areaM2]);

    const fabricCost = useMemo(() => round2((Number(metersLinear) || 0) * (Number(ppm) || 0)), [metersLinear, ppm]);

    // Chat
    const [messages, setMessages] = useState([{ role: 'bot', text: '¡Hola! Soy tu asistente para calcular estores. ¿Empezamos?' }]);
    const pushBot = (text) => setMessages((m) => [...m, { role: 'bot', text }]);
    const pushUser = (text) => setMessages((m) => [...m, { role: 'user', text }]);

    const scrollRef = useRef(null);
    const widthInputRef = useRef(null);
    const heightInputRef = useRef(null);

    useEffect(() => { if (open) scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, step, open]);

    useEffect(() => {
        if (!open) return;
        // 0) Tela → 1) Ancho → 2) Alto → 3) Varillas → 4) Resumen/PDF
        if (step === 0) pushBot('Elige la tela del ESTOR.');
        if (step === 1) {
            const baseMsg = `Indica el ANCHO (cm). Máximo permitido: ${maxWidth || '—'} cm.`;
            pushBot(baseMsg);
        }
        if (step === 2) pushBot(`Ahora el ALTO (cm). Máximo permitido: ${maxHeight || '—'} cm.`);
        if (step === 3) pushBot('¿Lo quieres CON varillas o SIN varillas?');
        if (step === 4) pushBot('Listo. Te muestro el resumen. ¿Descargamos el PDF?');
    }, [step, open, maxWidth, maxHeight, warnPrinted]);

    useEffect(() => {
        if (!open) return;
        if (step === 1) widthInputRef.current?.focus();
        if (step === 2) heightInputRef.current?.focus();
    }, [open, step]);

    // Cabecera: mismos datos que cortinas
    const headerSub = selectedProduct
        ? `Precio/metro: ${ppm > 0 ? `${ppm.toLocaleString()} €` : '—'}  |  Ancho paño: ${Number(rollWidthCm) || 0} cm`
        : 'Elige un tejido para ver precio/metro y ancho de paño';

    const closeAndReset = () => {
        setOpen(false);
        setTimeout(() => {
            setStep(0);
            setMessages([{ role: 'bot', text: '¡Hola! Soy tu asistente para calcular estores. ¿Empezamos?' }]);
            setSelectedProduct(null);
            setSelectedColor(null);
            setShowFabricModal(false);
            setWidthCm(120);
            setHeightCm(150);
            setWithRods(true);
            setPpm(0);
        }, 180);
        onClose?.();
    };

    const Bubble = ({ role, children }) => (
        <div className={`flex ${role === 'bot' ? 'justify-start' : 'justify-end'}`}>
            <div
                className={
                    role === 'bot'
                        ? 'max-w-[85%] rounded-2xl px-4 py-3 text-[0.925rem] leading-5 bg-white/70 backdrop-blur border border-gray-200 shadow-sm text-gray-900'
                        : 'max-w-[85%] rounded-2xl px-4 py-3 text-[0.925rem] leading-5 bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow'
                }
            >
                {children}
            </div>
        </div>
    );

    const Summary = () => (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2 col-span-2">
                    <div className="text-gray-500">Tejido</div>
                    <div className="font-semibold">
                        {selectedProduct
                            ? `${selectedProduct.name || selectedProduct.nombre}${selectedColor ? ` – ${selectedColor.name || selectedColor.nombre}` : ''}${rollWidthCm ? ` · Ancho rollo ${rollWidthCm} cm` : ''}`
                            : 'No seleccionado'}
                    </div>
                </div>

                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                    <div className="text-gray-500">Corte de tela</div>
                    <div className="font-semibold">
                        {/* Mostrar SIEMPRE sin márgenes ni etiquetas */}
                        {cutInfoDisplay?.cutWidth ?? '—'} × {cutInfoDisplay?.cutHeight ?? '—'} cm
                    </div>
                </div>

                {/* En modo simple no mostramos m² porque no aplica */}
                {!simpleRoll && (
                    <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                        <div className="text-gray-500">Tela necesaria</div>
                        <div className="font-semibold">{Number.isFinite(areaM2) ? round2(areaM2).toFixed(2) : '—'} m²</div>
                    </div>
                )}

                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                    <div className="text-gray-500">Metros lineales</div>
                    <div className="font-semibold">{Number.isFinite(metersLinear) ? round2(metersLinear).toFixed(2) : '—'} m</div>
                </div>

                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                    <div className="text-gray-500">Precio tela</div>
                    <div className="font-semibold">
                        {ppm > 0 ? `${round2(fabricCost).toFixed(2)} €` : '—'}
                        <span className="ml-1 text-xs text-gray-500">{ppm > 0 ? `(${round2(metersLinear).toFixed(2)} m × ${Number(ppm).toFixed(2)} €/m)` : ''}</span>
                    </div>
                </div>

                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                    <div className="text-gray-500">Mecanismo</div>
                    <div className="font-semibold">
                        {withRods ? 'Con varillas' : 'Sin varillas'} · {price.mechPerMeter} €/m → {round2(price.mechCost).toFixed(2)} €
                    </div>
                </div>

                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                    <div className="text-gray-500">Confección</div>
                    <div className="font-semibold">{round2(price.makingFixed).toFixed(2)} €</div>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1 rounded-xl border bg-gray-50 px-4 py-3">
                <div className="text-sm text-gray-600 w-full flex justify-between">
                    <span>Total estimado</span>
                    <span className="text-xl font-semibold tracking-tight">
                        {round2((price.total || 0) + (fabricCost || 0)).toFixed(2)} €
                    </span>
                </div>
            </div>
        </div>
    );

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeAndReset} aria-hidden="true" />
            <div
                role="dialog"
                aria-modal="true"
                className="absolute left-1/2 top-1/2 w-[92vw] max-w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-white/90 shadow-2xl backdrop-blur"
            >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 rounded-t-2xl bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-4 text-white">
                    <div>
                        <h3 className="text-base font-semibold leading-tight">Asistente de estores</h3>
                        <p className="mt-0.5 text-xs text-white/80">
                            {selectedProduct
                                ? <>Precio/metro: {ppm > 0 ? `${ppm.toLocaleString()} €` : '—'}  |  Ancho paño: <span className="font-medium">{Number(rollWidthCm) || 0} cm</span></>
                                : 'Elige un tejido para ver precio/metro y ancho de paño'}
                        </p>
                    </div>
                    <button
                        className="rounded-md p-2 text-white/90 transition hover:bg-white/10 hover:text-white"
                        onClick={closeAndReset}
                        aria-label="Cerrar asistente"
                        title="Cerrar"
                    >✕</button>
                </div>

                {/* Progreso */}
                <div className="px-5 pt-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                        <span>Paso {Math.min(step + 1, TOTAL_STEPS)} de {TOTAL_STEPS}</span>
                        {step > 0 && step < TOTAL_STEPS - 1 && (
                            <button className="text-gray-600 underline hover:text-gray-900" onClick={() => setStep(Math.max(0, step - 1))}>
                                Volver
                            </button>
                        )}
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-gray-900 transition-all" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
                    </div>
                </div>

                {/* Chat + controles */}
                <div className="mt-3 flex h-[460px] flex-col px-5 pb-5">
                    <div className="flex-1 space-y-3 overflow-auto rounded-xl border bg-gradient-to-b from-white to-gray-50 p-3">
                        {messages.map((m, i) => (<Bubble key={i} role={m.role}>{m.text}</Bubble>))}
                        {step === 4 && (<Bubble role="bot"><Summary /></Bubble>)}
                        <div ref={scrollRef} />
                    </div>

                    <div className="mt-4 space-y-3">
                        {/* Paso 0: Tela */}
                        {step === 0 && (
                            <div className="flex items-center gap-2">
                                <button
                                    className="inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
                                    onClick={() => setShowFabricModal(true)}
                                >
                                    {selectedProduct ? 'Cambiar tela' : 'Elegir tela'}
                                </button>
                                {selectedProduct && (
                                    <div className="text-sm text-gray-700">
                                        {selectedProduct.name || selectedProduct.nombre}{selectedColor ? ` – ${selectedColor.name || selectedColor.nombre}` : ''}
                                    </div>
                                )}
                                {selectedProduct && (
                                    <button
                                        className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                                        onClick={() => { pushUser('Tela elegida'); setStep(1); }}
                                    >
                                        Continuar
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Paso 1: Ancho (capado duro al máximo) */}
                        {step === 1 && (
                            <form
                                className="flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    let v = Number(widthCm);
                                    if (!v) return;
                                    const max = Number(maxWidth) || v;
                                    if (v > max) {
                                        v = max;
                                        setWidthCm(String(v));
                                        pushBot(`He ajustado el ancho al máximo permitido: ${max} cm.`);
                                    }
                                    if (v < W_MIN) {
                                        v = W_MIN;
                                        setWidthCm(String(v));
                                        pushBot(`He ajustado el ancho al mínimo: ${W_MIN} cm.`);
                                    }
                                    pushUser(`${v} cm`);
                                    setStep(2);
                                }}
                            >
                                <input
                                    ref={widthInputRef}
                                    type="number"
                                    min={W_MIN}
                                    max={maxWidth || undefined}
                                    className="w-44 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                    value={widthCm}
                                    onChange={(e) => {
                                        const raw = e.target.value;
                                        const vNum = Number(raw);
                                        if (maxWidth && vNum > maxWidth) {
                                            setWidthCm(String(maxWidth));
                                        } else {
                                            setWidthCm(raw);
                                        }
                                    }}
                                    placeholder={`Ancho (${W_MIN}–${maxWidth || '—'} cm)`}
                                    autoFocus
                                />
                                <button className="inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90">
                                    OK
                                </button>
                            </form>
                        )}

                        {/* Paso 2: Alto */}
                        {step === 2 && (
                            <form
                                className="flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    let v = Number(heightCm);
                                    if (!v) return;
                                    const max = Number(maxHeight) || v;
                                    if (v > max) {
                                        v = max;
                                        setHeightCm(String(v));
                                        pushBot(`He ajustado el alto al máximo permitido: ${max} cm.`);
                                    }
                                    if (v < H_MIN) {
                                        v = H_MIN;
                                        setHeightCm(String(v));
                                        pushBot(`He ajustado el alto al mínimo: ${H_MIN} cm.`);
                                    }
                                    pushUser(`${v} cm`);
                                    setStep(3);
                                }}
                            >
                                <input
                                    ref={heightInputRef}
                                    type="number"
                                    min={H_MIN}
                                    max={maxHeight || undefined}
                                    className="w-44 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                    placeholder={`Alto (${H_MIN}–${maxHeight || '—'} cm)`}
                                    autoFocus
                                />
                                <button className="inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90">
                                    OK
                                </button>
                            </form>
                        )}

                        {/* Paso 3: Varillas / Sin varillas */}
                        {step === 3 && (
                            <div className="flex gap-2">
                                <button
                                    className={`rounded-xl px-3 py-2 text-sm transition shadow-sm ${withRods ? 'border border-gray-900 bg-gray-900 text-white' : 'border border-gray-300 bg-white text-gray-900 hover:border-gray-900 hover:bg-gray-50'}`}
                                    onClick={() => { setWithRods(true); pushUser('Con varillas'); setStep(4); }}
                                    type="button"
                                >
                                    Con varillas (35 €/m)
                                </button>
                                <button
                                    className={`${!withRods ? 'border border-gray-900 bg-gray-900 text-white' : 'border border-gray-300 bg-white text-gray-900 hover:border-gray-900 hover:bg-gray-50'} rounded-xl px-3 py-2 text-sm transition shadow-sm`}
                                    onClick={() => { setWithRods(false); pushUser('Sin varillas'); setStep(4); }}
                                    type="button"
                                >
                                    Sin varillas (32 €/m)
                                </button>
                            </div>
                        )}

                        {/* Paso 4: Resumen + PDF */}
                        {step === 4 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
                                    onClick={async () => {
                                        await generateStoreQuotePDF({
                                            widthCm: clampedWidth,
                                            heightCm: clampedHeight,
                                            withRods,
                                            mechPerMeter: price.mechPerMeter,
                                            mechCost: round2(price.mechCost),
                                            makingFixed: round2(price.makingFixed),
                                            total: round2(price.total + fabricCost),
                                            // Enviamos el corte mostrado (sin márgenes visibles en simple)
                                            cutInfo: cutInfoDisplay,
                                            // En simple no usamos m²
                                            areaM2: Number.isFinite(areaM2) ? Number(areaM2) : 0,
                                            pricePerMeter: Number(ppm) || 0,
                                            metersLinear: Number(metersLinear) || 0,
                                            fabricCost: Number(fabricCost) || 0,
                                            fabric: { product: selectedProduct, color: selectedColor, rollWidth: rollWidthCm },
                                        });
                                        closeAndReset();
                                        onFinished?.();
                                    }}
                                >
                                    Descargar presupuesto (PDF)
                                </button>
                                <button className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setStep(0)}>
                                    Empezar de nuevo
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal TELAS (misma ventana del chat de cortinas) */}
            <CurtainFabricPickerModal
                open={showFabricModal}
                onClose={() => { setShowFabricModal(false); }}
                onPicked={({ product, color, pricePerMeter }) => {
                    const finalProduct = {
                        ...product,
                        // si el backend ya manda pricePerMeter, úsalo
                        pricePerMeter: typeof pricePerMeter === 'number' ? pricePerMeter : product?.pricePerMeter ?? null
                    };
                    setSelectedProduct(finalProduct || null);
                    setSelectedColor(color || null);
                    if (typeof finalProduct?.pricePerMeter === 'number') setPpm(Number(finalProduct.pricePerMeter) || 0);
                    setShowFabricModal(false);
                }}
            />
        </div>
    );
}
