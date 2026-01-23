import { useEffect, useMemo, useRef, useState } from 'react';
import WallpaperPickerModal from './WallpaperPickerModal';

// Reglas del cálculo de rollos (tu definición)
function ceil(n) { return Math.ceil(Number(n)); }
function floor(n) { return Math.floor(Number(n)); }
function toNumber(v) {
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : NaN;
}

const TOTAL_STEPS = 4;          // 0 papel, 1 ancho, 2 alto, 3 resumen
const W_MIN_CM = 30;
const H_MIN_CM = 30;

export default function WallpaperChatAssistant({
    initialOpen = false,
    onClose,
    onFinished,
}) {
    const [open, setOpen] = useState(initialOpen);
    const [step, setStep] = useState(0);

    // Papel seleccionado
    const [paper, setPaper] = useState(null); // { id, name, collection, price }
    const [showModal, setShowModal] = useState(false);

    // Medidas (UI en cm, cálculo en m)
    const [widthCm, setWidthCm] = useState(400);
    const [heightCm, setHeightCm] = useState(250);

    // Chat
    const [messages, setMessages] = useState([
        { role: 'bot', text: '¡Hola! Soy tu asistente para calcular rollos de papel pintado. ¿Empezamos?' }
    ]);
    const pushBot = (text) => setMessages((m) => [...m, { role: 'bot', text }]);
    const pushUser = (text) => setMessages((m) => [...m, { role: 'user', text }]);

    const scrollRef = useRef(null);
    const widthInputRef = useRef(null);
    const heightInputRef = useRef(null);

    useEffect(() => { if (open) scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, step, open]);

    // Mensajes por paso (igual patrón que estores)
    useEffect(() => {
        if (!open) return;
        if (step === 0) pushBot('Elige el papel (catálogo de WALLPAPER).');
        if (step === 1) pushBot(`Indica el ANCHO de la pared en cm (mínimo ${W_MIN_CM} cm).`);
        if (step === 2) pushBot(`Ahora el ALTO de la pared en cm (mínimo ${H_MIN_CM} cm).`);
        if (step === 3) pushBot('Listo. Te muestro el resumen.');
    }, [step, open]);

    useEffect(() => {
        if (!open) return;
        if (step === 1) widthInputRef.current?.focus();
        if (step === 2) heightInputRef.current?.focus();
    }, [open, step]);

    // Conversión a metros para el cálculo
    const anchoM = useMemo(() => Number(widthCm) / 100 || 0, [widthCm]);
    const altoM = useMemo(() => Number(heightCm) / 100 || 0, [heightCm]);

    const isColony = (paper?.collection || '').trim().toUpperCase() === 'COLONY WALLPAPER';

    const calc = useMemo(() => {
        if (!paper || !Number.isFinite(anchoM) || !Number.isFinite(altoM) || anchoM <= 0 || altoM <= 0) return null;

        const rollo = isColony ? 10 : 5.50;           // metros
        const step1Raw = rollo / altoM;               // unidades
        const step1 = floor(step1Raw);                // redondeo a la baja
        if (step1 < 1) return { error: 'El alto de la pared supera la longitud útil del rollo. (step1 = 0)' };

        const factor = isColony ? 0.50 : 0.90;        // metros “útiles” por tramo
        const resultado2 = step1 * factor;            // metros efectivos por tramo
        if (resultado2 <= 0) return { error: 'Resultado intermedio inválido. Revisa las medidas.' };

        const rollos = ceil(anchoM / resultado2);     // redondeo al alza
        return { rollo, step1Raw, step1, factor, resultado2, rollos };
    }, [paper, anchoM, altoM, isColony]);

    const totalPrice = useMemo(() => {
        if (!calc || calc.error) return null;
        const price = Number(paper?.price) || 0; // PVP por rollo (tp.pvp)
        return price > 0 ? (calc.rollos * price) : null;
    }, [calc, paper]);

    const headerSub = paper
        ? `Precio/rollo: ${Number(paper.price) > 0 ? `${Number(paper.price).toFixed(2)} €` : '—'}`
        : 'Elige un papel para ver precio/rollo';

    const closeAndReset = () => {
        setOpen(false);
        setTimeout(() => {
            setStep(0);
            setMessages([{ role: 'bot', text: '¡Hola! Soy tu asistente para calcular rollos de papel pintado. ¿Empezamos?' }]);
            setPaper(null);
            setShowModal(false);
            setWidthCm(400);
            setHeightCm(250);
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
                    <div className="text-gray-500">Papel</div>
                    <div className="font-semibold">
                        {paper ? `${paper.name}${paper.collection ? ` · Colección ${paper.collection}` : ''}` : 'No seleccionado'}
                    </div>
                </div>

                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                    <div className="text-gray-500">Medidas pared</div>
                    <div className="font-semibold">{Number(widthCm)} × {Number(heightCm)} cm</div>
                </div>


                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                    <div className="text-gray-500">Rollos necesarios</div>
                    <div className="font-semibold">
                        {calc?.error ? '—' : (calc?.rollos ?? '—')}
                    </div>
                </div>

                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                    <div className="text-gray-500">Precio por rollo</div>
                    <div className="font-semibold">{Number(paper?.price) > 0 ? `${Number(paper.price).toFixed(2)} €` : '—'}</div>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1 rounded-xl border bg-gray-50 px-4 py-3">
                <div className="text-sm text-gray-600 w-full flex justify-between">
                    <span>Total estimado</span>
                    <span className="text-xl font-semibold tracking-tight">
                        {calc?.error ? '—' : (totalPrice != null ? `${totalPrice.toFixed(2)} €` : '—')}
                    </span>
                </div>
                {calc?.error && <div className="w-full text-xs text-red-700">{calc.error}</div>}
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
                {/* Header (igual estilo estores) */}
                <div className="flex items-center justify-between gap-3 rounded-t-2xl bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-4 text-white">
                    <div>
                        <h3 className="text-base font-semibold leading-tight">Asistente de papeles</h3>
                        <p className="mt-0.5 text-xs text-white/80">{headerSub}</p>
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
                        {step === 3 && (<Bubble role="bot"><Summary /></Bubble>)}
                        <div ref={scrollRef} />
                    </div>

                    <div className="mt-4 space-y-3">
                        {/* Paso 0: Papel */}
                        {step === 0 && (
                            <div className="flex items-center gap-2">
                                <button
                                    className="inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
                                    onClick={() => setShowModal(true)}
                                >
                                    {paper ? 'Cambiar papel' : 'Elegir papel'}
                                </button>
                                {paper && (
                                    <div className="text-sm text-gray-700">
                                        {paper.name}{paper.collection ? ` · ${paper.collection}` : ''}
                                    </div>
                                )}
                                {paper && (
                                    <button
                                        className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
                                        onClick={() => { pushUser('Papel elegido'); setStep(1); }}
                                    >
                                        Continuar
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Paso 1: Ancho (cm) */}
                        {step === 1 && (
                            <form
                                className="flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    let v = Number(widthCm);
                                    if (!v) return;
                                    if (v < W_MIN_CM) {
                                        v = W_MIN_CM;
                                        setWidthCm(String(v));
                                        pushBot(`He ajustado el ancho al mínimo: ${W_MIN_CM} cm.`);
                                    }
                                    pushUser(`${v} cm`);
                                    setStep(2);
                                }}
                            >
                                <input
                                    ref={widthInputRef}
                                    type="number"
                                    min={W_MIN_CM}
                                    className="w-44 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                    value={widthCm}
                                    onChange={(e) => setWidthCm(e.target.value)}
                                    placeholder={`Ancho (${W_MIN_CM}+ cm)`}
                                    autoFocus
                                />
                                <button className="inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90">
                                    OK
                                </button>
                            </form>
                        )}

                        {/* Paso 2: Alto (cm) */}
                        {step === 2 && (
                            <form
                                className="flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    let v = Number(heightCm);
                                    if (!v) return;
                                    if (v < H_MIN_CM) {
                                        v = H_MIN_CM;
                                        setHeightCm(String(v));
                                        pushBot(`He ajustado el alto al mínimo: ${H_MIN_CM} cm.`);
                                    }
                                    pushUser(`${v} cm`);
                                    setStep(3);
                                }}
                            >
                                <input
                                    ref={heightInputRef}
                                    type="number"
                                    min={H_MIN_CM}
                                    className="w-44 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                    placeholder={`Alto (${H_MIN_CM}+ cm)`}
                                    autoFocus
                                />
                                <button className="inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90">
                                    OK
                                </button>
                            </form>
                        )}

                        {/* Paso 3: Resumen */}
                        {step === 3 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                                    onClick={() => setStep(0)}
                                >
                                    Empezar de nuevo
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal PAPEL (similar a la de cortinas) */}
            <WallpaperPickerModal
                open={showModal}
                onClose={() => { setShowModal(false); }}
                onPicked={(p) => {
                    setPaper(p || null);
                    setShowModal(false);
                }}
            />
        </div>
    );
}
