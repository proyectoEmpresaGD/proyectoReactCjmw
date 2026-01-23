// src/components/calculadora/PuffCalculator.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import FabricPickerModal from './FabricPickerModal';
import { useTranslation } from 'react-i18next';
import {
    calculatePuffQuote,
    parsePrecio,
    PUFF_TYPES,
    CONFECCION_COST,
    METERS_SINGLE,
    METERS_SPLIT_EACH,
} from '../../../utils/puff';
import { generatePuffQuotePDF } from '../../../utils/quotePdf';
function round2(n) { return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }

function Choice({ active, onClick, label }) {
    return (
        <button
            className={[
                'rounded-xl px-3 py-2 text-sm transition shadow-sm',
                active
                    ? 'border border-gray-900 bg-gray-900 text-white'
                    : 'border border-gray-300 bg-white text-gray-900 hover:border-gray-900 hover:bg-gray-50',
            ].join(' ')}
            onClick={onClick}
            type="button"
        >
            {label}
        </button>
    );
}

/**
 * Props recomendadas:
 *  - selectedProduct: producto de la ficha (se auto-sugiere como principal al entrar en 2 tejidos)
 *  - pricePerMeter: €/m del producto actual
 */
export default function PuffCalculator({
    pricePerMeter = 0,
    selectedProduct = null,
    currency = '€',
    initialOpen = false,
    onClose,
    onFinished,
}) {
    const [open, setOpen] = useState(initialOpen);
    const { t } = useTranslation('puffCalculator');
    // PASOS: 0 tipo → 1 nº tejidos → 2 elección(es) → 3 resumen
    const TOTAL_STEPS = 4;
    const [step, setStep] = useState(0);

    const [puffType, setPuffType] = useState('mediaLuna'); // mediaLuna | redondo | trebol
    const [fabricsMode, setFabricsMode] = useState('uno'); // 'uno' | 'dos'

    // Selecciones de tejido
    const [fabric1, setFabric1] = useState(
        selectedProduct ? { product: selectedProduct, color: null } : null
    ); // Principal
    const [fabric2, setFabric2] = useState(null); // Tapa (cuando son 2 tejidos)

    // €/m de cada uno
    const price1 = useMemo(
        () =>
            parsePrecio(
                fabric1?.product?.precioMetro ??
                fabric1?.product?.pricePerMeter ??
                pricePerMeter ??
                0
            ),
        [fabric1?.product, pricePerMeter]
    );
    const price2 = useMemo(
        () => parsePrecio(fabric2?.product?.precioMetro ?? fabric2?.product?.pricePerMeter ?? 0),
        [fabric2?.product]
    );

    const quote = useMemo(
        () => calculatePuffQuote({ puffType, fabricsMode, price1, price2 }),
        [puffType, fabricsMode, price1, price2]
    );

    // Chat UI
    const [messages, setMessages] = useState([
        { role: 'bot', text: t('chat.greeting') },
    ]);
    const pushBot = (text) => setMessages((m) => [...m, { role: 'bot', text }]);
    const pushUser = (text) => setMessages((m) => [...m, { role: 'user', text }]);

    const scrollRef = useRef(null);
    useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, step, open]);

    useEffect(() => {
        if (!open) return;
        if (step === 0) {
            pushBot(t('chat.dims'));
            pushBot(t('chat.step1'));
        }
        if (step === 1) pushBot(t('chat.step2'));
        if (step === 2) {
            pushBot(fabricsMode === 'uno' ? t('chat.step3.one') : t('chat.step3.two'));
        }
        if (step === 3) pushBot(t('chat.step4Confirm', { defaultValue: '4) Te muestro el presupuesto. ¿Confirmamos?' }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step, open]);

    // Al entrar en "dos", sugerimos como principal el producto de la ficha (se puede cambiar)
    useEffect(() => {
        if (fabricsMode === 'dos' && selectedProduct) {
            setFabric1((prev) => prev ?? { product: selectedProduct, color: null });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fabricsMode, selectedProduct?.codprodu]);

    const closeAndReset = () => {
        setOpen(false);
        setTimeout(() => {
            setStep(0);
            setMessages([{ role: 'bot', text: t('chat.greeting') }]);
            setPuffType('mediaLuna');
            setFabricsMode('uno');
            setFabric1(selectedProduct ? { product: selectedProduct, color: null } : null);
            setFabric2(null);
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
                {fabricsMode === 'uno' ? (
                    <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2 col-span-2">
                        <div className="text-gray-500">{t('ui.fabric')} ({METERS_SINGLE.toFixed(2)} {t('chat.meters')} × {t('chat.pricePerMeter')})</div>
                        <div className="font-semibold">
                            {METERS_SINGLE.toFixed(2)} {t('chat.meters')} × {price1.toFixed(2)} {t('chat.pricePerMeter')} = {(METERS_SINGLE * price1).toFixed(2)} {currency}
                            {fabric1?.product && (
                                <span className="ml-2 text-xs text-gray-500">
                                    ({fabric1.product.nombre || fabric1.product.name}{fabric1?.color?.name ? ` – ${fabric1.color.name}` : ''})
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                            <div className="text-gray-500">{t('chat.mainFabric')} ({METERS_SPLIT_EACH.toFixed(2)} {t('chat.meters')} × {t('chat.pricePerMeter')})</div>
                            <div className="font-semibold">
                                {METERS_SPLIT_EACH.toFixed(2)} {t('chat.meters')} × {price1.toFixed(2)} {t('chat.pricePerMeter')} = {(METERS_SPLIT_EACH * price1).toFixed(2)} {currency}
                                {fabric1?.product && (
                                    <span className="ml-2 text-xs text-gray-500">
                                        ({fabric1.product.nombre || fabric1.product.name}{fabric1?.color?.name ? ` – ${fabric1.color.name}` : ''})
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                            <div className="text-gray-500">{t('chat.topFabric')} ({METERS_SPLIT_EACH.toFixed(2)} {t('chat.meters')} × {t('chat.pricePerMeter')})</div>
                            <div className="font-semibold">
                                {METERS_SPLIT_EACH.toFixed(2)} {t('chat.meters')} × {price2.toFixed(2)} {t('chat.pricePerMeter')} = {(METERS_SPLIT_EACH * price2).toFixed(2)} {currency}
                                {fabric2?.product && (
                                    <span className="ml-2 text-xs text-gray-500">
                                        ({fabric2.product.nombre || fabric2.product.name}{fabric2?.color?.name ? ` – ${fabric2.color.name}` : ''})
                                    </span>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2 col-span-2">
                    <div className="text-gray-500">{t('ui.sewing')}</div>
                    <div className="font-semibold">{CONFECCION_COST.toFixed(2)} {currency}</div>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1 rounded-xl border bg-gray-50 px-4 py-3">
                <div className="text-sm text-gray-600 w-full flex justify-between">
                    <span>{t('ui.totalEstimated', { defaultValue: 'Total estimado' })}</span>
                    <span className="text-xl font-semibold tracking-tight">{quote.total.toFixed(2)} {currency}</span>
                </div>
            </div>

            <p className="text-xs text-gray-500">
                {t('chat.dimNote', { defaultValue: 'Medidas del puf:' })} <strong>50 cm × 47 cm</strong>.
            </p>
        </div>
    );

    // Modal selector (misma que el forro; estilos iguales)
    const [pickTarget, setPickTarget] = useState(null); // 'f1' | 'f2'
    const openPicker = (target) => setPickTarget(target);
    const closePicker = () => setPickTarget(null);

    // Validación para continuar
    const canContinueFromStep = () => {
        if (step === 0) return true;
        if (step === 1) return true;
        if (step === 2) {
            if (fabricsMode === 'uno') return !!fabric1?.product;
            return !!fabric1?.product && !!fabric2?.product; // en dos tejidos: ambos elegidos
        }
        return true;
    };

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
                        <h3 className="text-base font-semibold leading-tight">{t('ui.assistantTitle', { defaultValue: 'Asistente de puf' })}</h3>
                        <p className="mt-0.5 text-xs text-white/80">
                            {t('ui.fixedSewing', { defaultValue: 'Confección fija:' })} <span className="font-medium">{CONFECCION_COST.toFixed(2)} {currency}</span>
                        </p>
                    </div>
                    <button
                        className="rounded-md p-2 text-white/90 transition hover:bg-white/10 hover:text-white"
                        onClick={closeAndReset}
                        aria-label={t('ui.closeAssistantAria', { defaultValue: 'Cerrar asistente' })}
                        title={t('ui.close', { defaultValue: 'Cerrar' })}
                    >
                        ✕
                    </button>
                </div>

                {/* Progreso */}
                <div className="px-5 pt-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                        <span>{t('ui.stepOf', { defaultValue: 'Paso {{cur}} de {{total}}', cur: Math.min(step + 1, TOTAL_STEPS), total: TOTAL_STEPS })}</span>
                        {step > 0 && step < TOTAL_STEPS - 1 && (
                            <button className="text-gray-600 underline hover:text-gray-900" onClick={() => setStep(Math.max(0, step - 1))}>
                                {t('ui.back', { defaultValue: 'Volver' })}
                            </button>
                        )}
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-gray-900 transition-all"
                            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
                        />
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
                        {/* Paso 0: tipo */}
                        {step === 0 && (
                            <div className="flex flex-wrap gap-2">
                                {PUFF_TYPES.map((tType) => (
                                    <Choice
                                        key={tType}
                                        active={puffType === tType}
                                        onClick={() => { setPuffType(tType); pushUser(labelType(tType, t)); setStep(1); }}
                                        label={labelType(tType, t)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Paso 1: nº de tejidos */}
                        {step === 1 && (
                            <div className="flex gap-2">
                                <Choice
                                    active={fabricsMode === 'uno'}
                                    onClick={() => { setFabricsMode('uno'); pushUser(t('ui.oneFabric')); setStep(2); }}
                                    label={t('ui.oneFabric')}
                                />
                                <Choice
                                    active={fabricsMode === 'dos'}
                                    onClick={() => {
                                        setFabricsMode('dos');
                                        pushUser(t('ui.twoFabrics'));
                                        setStep(2);
                                    }}
                                    label={t('ui.twoFabrics')}
                                />
                            </div>
                        )}

                        {/* Paso 2: selección de tejidos */}
                        {step === 2 && (
                            <div className="space-y-3">
                                {/* Tejido principal */}
                                <div className="bg-white rounded-xl border p-3">
                                    <div className="font-medium text-sm">
                                        {fabricsMode === 'dos' ? t('chat.mainFabric') : t('ui.fabric')}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {fabricsMode === 'uno'
                                            ? `${METERS_SINGLE} ${t('chat.meters')} × ${t('chat.pricePerMeter')}`
                                            : `${METERS_SPLIT_EACH} ${t('chat.meters')} × ${t('chat.pricePerMeter')}`}
                                    </div>

                                    <div className="mt-1 text-sm">
                                        {fabric1?.product ? (
                                            <>
                                                {fabric1.product.nombre || fabric1.product.name || t('ui.selectedFabric', { defaultValue: 'Tejido seleccionado' })}
                                                {fabric1?.color?.name ? ` — ${fabric1.color.name}` : ''}
                                                {Number.isFinite(price1) && <span> — {t('chat.pricePerMeter')}: {price1.toFixed(2)}</span>}
                                            </>
                                        ) : (
                                            <span className="text-gray-500">{t('ui.noFabric', { defaultValue: 'Sin tejido seleccionado.' })}</span>
                                        )}
                                    </div>

                                    <div className="mt-2 flex gap-2">
                                        {selectedProduct && !fabric1?.product && (
                                            <button
                                                className="px-3 py-2 rounded-xl border hover:bg-gray-50 text-sm"
                                                onClick={() => { setFabric1({ product: selectedProduct, color: null }); }}
                                            >
                                                {t('ui.useCurrentFabric', { defaultValue: 'Usar tejido actual' })}
                                            </button>
                                        )}
                                        <button
                                            className="px-3 py-2 rounded-xl bg-gray-900 text-white hover:opacity-90 text-sm"
                                            onClick={() => openPicker('f1')}
                                        >
                                            {fabric1?.product ? t('ui.change', { defaultValue: 'Cambiar' }) : t('ui.choose', { defaultValue: 'Elegir' })}
                                        </button>
                                    </div>
                                </div>

                                {/* Tejido tapa (solo en 2 tejidos) */}
                                {fabricsMode === 'dos' && (
                                    <div className="bg-white rounded-xl border p-3">
                                        <div className="font-medium text-sm">{t('chat.topFabric')}</div>
                                        <div className="text-xs text-gray-600">{METERS_SPLIT_EACH} {t('chat.meters')} × {t('chat.pricePerMeter')}</div>

                                        <div className="mt-1 text-sm">
                                            {fabric2?.product ? (
                                                <>
                                                    {fabric2.product.nombre || fabric2.product.name || t('ui.selectedFabric', { defaultValue: 'Tejido seleccionado' })}
                                                    {fabric2?.color?.name ? ` — ${fabric2.color.name}` : ''}
                                                    {Number.isFinite(price2) && <span> — {t('chat.pricePerMeter')}: {price2.toFixed(2)}</span>}
                                                </>
                                            ) : (
                                                <span className="text-gray-500">{t('ui.noFabric', { defaultValue: 'Sin tejido seleccionado.' })}</span>
                                            )}
                                        </div>

                                        <div className="mt-2">
                                            <button
                                                className="px-3 py-2 rounded-xl bg-gray-900 text-white hover:opacity-90 text-sm"
                                                onClick={() => openPicker('f2')}
                                            >
                                                {fabric2?.product ? t('ui.change', { defaultValue: 'Cambiar' }) : t('ui.choose', { defaultValue: 'Elegir' })}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <button
                                        className="inline-flex items-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-50"
                                        onClick={() => setStep(3)}
                                        disabled={!canContinueFromStep()}
                                    >
                                        {t('ui.next', { defaultValue: 'Siguiente →' })}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Paso 3: resumen + confirmar */}
                        {step === 3 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
                                    onClick={async () => {
                                        await generatePuffQuotePDF({
                                            puffType,
                                            fabricsMode,
                                            fabric1,
                                            fabric2,
                                            fabricCost1: (fabricsMode === 'uno' ? 1.20 : 0.60) * (Number.isFinite(price1) ? price1 : 0),
                                            fabricCost2: fabricsMode === 'uno' ? 0 : (0.60 * (Number.isFinite(price2) ? price2 : 0)),
                                            confeccion: CONFECCION_COST,
                                            total: quote.total,
                                            currency,
                                        });
                                        // cerrar asistente después de descargar
                                        closeAndReset();
                                    }}
                                >
                                    {t('chat.downloadPdf', { defaultValue: 'Descargar presupuesto (PDF)' })}
                                </button>

                                <button className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setStep(0)}>
                                    {t('ui.restart', { defaultValue: 'Empezar de nuevo' })}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de selección (mismos estilos que la de forro) */}
            <FabricPickerModal
                open={!!pickTarget}
                onClose={closePicker}
                onPicked={(sel) => {
                    if (pickTarget === 'f1') setFabric1(sel);
                    if (pickTarget === 'f2') setFabric2(sel);
                    closePicker();
                }}
            />
        </div>
    );
}

function labelType(tType, t) {
    switch (tType) {
        case 'mediaLuna': return t('types.halfMoon', { defaultValue: 'Media luna' });
        case 'redondo': return t('types.round', { defaultValue: 'Redondo' });
        case 'trebol': return t('types.clover', { defaultValue: 'Trébol' });
        default: return tType;
    }
}
