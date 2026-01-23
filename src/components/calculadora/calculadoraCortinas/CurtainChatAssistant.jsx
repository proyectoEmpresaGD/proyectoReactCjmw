// src/components/calculadora/CurtainChatAssistant.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import LiningPickerModal from '../LiningPickerModal';
import CurtainFabricPickerModal from './CurtainFabricPickerModal';
import { generateCurtainQuotePDF } from '../../../utils/quotePdf';
import { cdnUrl } from '../../../Constants/cdn';
import { useTranslation } from 'react-i18next';
import {
    calculateMeters as calcMetersUtil,
    getBoltWidthFromEntity,
} from '../../../utils/curtains';
/**/
/* ===========================
   Helpers (idénticos a la modal + rescate por API)
   =========================== */

// NO top-level await: Vercel/Vite (esbuild) no lo permite en el target configurado.
const LOGO_HTTP =
    'https://bassari.eu/ImagenesTelasCjmw/ICONOS/01_LOGOTIPOS/LOGOS%20MARCAS%20BLANCOS/logo_cjm_blanco.png';

// Cache del logo para no descargarlo cada vez que el usuario pulsa el botón.
let logoDataUrlCache = '';
let logoDataUrlInflight = null;

// Igual que en modal.jsx (con validación: solo image/*)
async function toBase64Modal(url) {
    if (!url) return '';
    try {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(decodeURIComponent(url))}`;
        const res = await fetch(proxyUrl, { cache: 'no-store' });
        if (!res.ok) return '';

        const ct = (res.headers.get('Content-Type') || '').toLowerCase();
        if (!ct.startsWith('image/')) return '';

        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
            const fr = new FileReader();
            fr.onloadend = () =>
                resolve(typeof fr.result === 'string' && fr.result.startsWith('data:image') ? fr.result : '');
            fr.onerror = reject;
            fr.readAsDataURL(blob);
        });
    } catch {
        return '';
    }
}

function withCdn(url) {
    try {
        return url ? cdnUrl(url) : '';
    } catch {
        return url || '';
    }
}

async function getLogoDataUrl() {
    if (logoDataUrlCache) return logoDataUrlCache;
    if (logoDataUrlInflight) return logoDataUrlInflight;

    logoDataUrlInflight = (async () => {
        const resolved = await toBase64Modal(withCdn(LOGO_HTTP));
        logoDataUrlCache = resolved || '';
        logoDataUrlInflight = null;
        return logoDataUrlCache;
    })();

    return logoDataUrlInflight;
}

// Si no hay imágenes en el objeto, haz lo mismo que la modal: consulta al backend por Buena/Baja
async function getImageUrlByApi(codprodu) {
    if (!codprodu) return '';
    const base = (import.meta?.env?.VITE_API_BASE_URL || '').replace(/\/+$/, '');
    try {
        const [bRes, lRes] = await Promise.all([
            fetch(`${base}/api/images/${codprodu}/Buena`).then((r) => (r.ok ? r.json() : null)),
            fetch(`${base}/api/images/${codprodu}/Baja`).then((r) => (r.ok ? r.json() : null)),
        ]);
        const rawB = bRes?.ficadjunto ? `${bRes.ficadjunto}` : '';
        const rawL = lRes?.ficadjunto ? `${lRes.ficadjunto}` : '';
        // Igual que la modal: prioriza Buena y ambas pasan por cdnUrl
        return withCdn(rawB || rawL || '');
    } catch {
        return '';
    }
}

// Construye candidatos tal como renderiza la modal (color → producto) y si no hay, intenta por API
async function firstImageBase64({ product, color }) {
    const candidates = [];

    // 1) Color primero
    if (color) {
        if (color.imageBuena) candidates.push(withCdn(color.imageBuena));
        if (color.imageBaja) candidates.push(withCdn(color.imageBaja));
        if (color.image) candidates.push(withCdn(color.image));
        if (color.imagen) candidates.push(withCdn(color.imagen));
    }

    // 2) Producto
    if (product) {
        if (product.imageBuena) candidates.push(withCdn(product.imageBuena));
        if (product.imageBaja) candidates.push(withCdn(product.imageBaja));
        if (product.image) candidates.push(withCdn(product.image));
        if (product.imagen) candidates.push(withCdn(product.imagen));
    }

    // 3) Si nada anterior existe, intenta por API usando codprodu (como hace la modal cuando no tiene URLs)
    const byApiUrl =
        !candidates.length && (product?.codprodu || color?.codprodu)
            ? await getImageUrlByApi(product?.codprodu || color?.codprodu)
            : '';
    if (byApiUrl) candidates.push(byApiUrl);

    // 4) Devuelve el primer base64 válido vía proxy
    for (const url of candidates) {
        if (!url) continue;
        try {
            const b64 = await toBase64Modal(url);
            if (b64) return b64;
        } catch {
            // siguiente
        }
    }
    return '';
}

/* ===========================
   Cálculos
   =========================== */

const H_MIN = 100,
    H_MAX = 280;
const W_MIN = 100,
    W_MAX = 400;

function round2(n) {
    return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

// Calcula metros/caídas usando el motor compartido (utils/curtains.js)
function calculateMeters({ heightCm, widthCm, fabricBoltWidthCm, makingType = 'tablasCocidas', bottom = 'aRas' }) {
    return calcMetersUtil({
        heightCm,
        widthCm,
        fabricBoltWidthCm, // puede venir null/undefined → utils usa fallback interno
        makingType,
        bottom,
    });
}

function calculateCurtain({
    heightCm,
    widthCm,
    fabricBoltWidthCm,
    panels = 'simple',
    makingType = 'tablasCocidas',
    bottom = 'aRas',
    lining = 'sin forrar',
    pricePerMeter = 0,
    includeMaking = true,
}) {
    // Base de metros (sin multiplicar por paneles, tal como estaba en el chat)
    const base = calculateMeters({ heightCm, widthCm, fabricBoltWidthCm, makingType, bottom });
    const fabricCost = round2(base.metersFabric * Number(pricePerMeter || 0));

    let makingPerM = 0;
    if (makingType === 'ollaos') {
        makingPerM = lining === 'forrada' ? 90 : 45;
    } else if (['fruncido', 'ondaPerfecta', 'dosPinzas', 'tresPinzas', 'tablasCocidas'].includes(makingType)) {
        makingPerM = lining === 'forrada' ? 25 : 16;
    } else {
        makingPerM = 16;
    }
    const makingCost = includeMaking ? round2(base.metersFabric * makingPerM) : 0;

    const subtotal = round2(fabricCost + makingCost);

    return {
        ...base,
        panelsInfo: panels,
        fabricCost,
        makingCost,
        makingPerM,
        subtotal,
    };
}

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

/* ===========================
   Componente
   =========================== */

export default function CurtainChatAssistant({
    pricePerMeter = 0,
    fabricBoltWidthCm = 140, // fallback global del proyecto
    currency = '€',
    onConfirm,
    defaultHeightCm = 200,
    defaultWidthCm = 400,
    liningNameCandidates = ['HUSKY', 'DUNE'],
    initialOpen = false,
    onClose,
    onFinished,
}) {
    const { t } = useTranslation('curtainChat');
    const [open, setOpen] = useState(initialOpen);

    const TOTAL_STEPS = 9;
    const [step, setStep] = useState(0);

    const [heightCm, setHeightCm] = useState(defaultHeightCm);
    const [widthCm, setWidthCm] = useState(defaultWidthCm);

    // IMPORTANTE: empezamos en null para no mostrar "140 cm" hasta que se elija tela.
    const [boltWidthCm, setBoltWidthCm] = useState(null);

    const [panels, setPanels] = useState('simple');

    // Tela principal
    const [selectedMainFabricProduct, setSelectedMainFabricProduct] = useState(null);
    const [selectedMainFabricColor, setSelectedMainFabricColor] = useState(null);
    const [showMainFabricModal, setShowMainFabricModal] = useState(false);

    // Forro
    const [lining, setLining] = useState('sin forrar');
    const [selectedLiningProduct, setSelectedLiningProduct] = useState(null);
    const [selectedLiningColor, setSelectedLiningColor] = useState(null);
    const [showLiningModal, setShowLiningModal] = useState(false);

    const [makingType, setMakingType] = useState('tablasCocidas');
    const [bottom, setBottom] = useState('aRas');
    const [includeMaking, setIncludeMaking] = useState(true);

    const [ppm, setPpm] = useState(Number(pricePerMeter) || 0);
    useEffect(() => {
        if (!selectedMainFabricProduct) setPpm(Number(pricePerMeter) || 0);
    }, [pricePerMeter, selectedMainFabricProduct]);

    // Cada vez que cambie la tela principal o su color, reintentamos calcular el ancho de pieza robustamente
    useEffect(() => {
        if (!selectedMainFabricProduct && !selectedMainFabricColor) return;
        const cmFromProduct = getBoltWidthFromEntity(selectedMainFabricProduct, boltWidthCm ?? fabricBoltWidthCm);
        const cmFromColor = getBoltWidthFromEntity(selectedMainFabricColor, cmFromProduct);
        if (Number.isFinite(cmFromColor) && cmFromColor > 0) {
            setBoltWidthCm(cmFromColor);
        }
    }, [selectedMainFabricProduct, selectedMainFabricColor, fabricBoltWidthCm]); // boltWidthCm no se incluye para evitar bucles

    // RESULTADO: usa el ancho detectado si existe; si no, cae al prop/fallback (para poder calcular algo)
    const result = useMemo(
        () =>
            calculateCurtain({
                heightCm,
                widthCm,
                fabricBoltWidthCm: Number(boltWidthCm ?? fabricBoltWidthCm) || undefined,
                panels,
                makingType,
                bottom,
                lining,
                pricePerMeter: ppm,
                includeMaking,
            }),
        [heightCm, widthCm, boltWidthCm, fabricBoltWidthCm, panels, makingType, bottom, lining, ppm, includeMaking]
    );

    // Forro: también buscamos el ancho de forma robusta (si existiera en el producto/color)
    const liningBoltWidthCm = useMemo(() => {
        if (!selectedLiningProduct && !selectedLiningColor) return 140;
        const fromProd = getBoltWidthFromEntity(selectedLiningProduct, 140);
        const fromColor = getBoltWidthFromEntity(selectedLiningColor, fromProd);
        return fromColor;
    }, [selectedLiningProduct, selectedLiningColor]);

    const liningCalc = useMemo(() => {
        if (lining !== 'forrada' || !selectedLiningProduct) return null;
        return calcMetersUtil({
            heightCm,
            widthCm,
            fabricBoltWidthCm: liningBoltWidthCm, // ← usa ancho de forro seleccionado
            makingType,
            bottom,
        });
    }, [lining, selectedLiningProduct, heightCm, widthCm, liningBoltWidthCm, makingType, bottom]);

    const liningMeters = liningCalc?.metersFabric ?? 0;

    const liningFabricCost = useMemo(() => {
        if (!liningMeters) return 0;
        if (lining !== 'forrada' || !selectedLiningProduct?.pricePerMeter) return 0;
        return round2(liningMeters * Number(selectedLiningProduct.pricePerMeter));
    }, [lining, liningMeters, selectedLiningProduct?.pricePerMeter]);

    const finalTotal = useMemo(() => round2((result?.subtotal || 0) + liningFabricCost), [result?.subtotal, liningFabricCost]);

    // chat
    const [messages, setMessages] = useState([
        { role: 'bot', text: t('chat.greeting', { defaultValue: '¡Hola! Soy tu asistente para calcular cortinas. ¿Empezamos?' }) },
    ]);
    const pushBot = (text) => setMessages((m) => [...m, { role: 'bot', text }]);
    const pushUser = (text) => setMessages((m) => [...m, { role: 'user', text }]);

    const scrollRef = useRef(null);
    const heightInputRef = useRef(null);
    const widthInputRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, step, open]);

    useEffect(() => {
        if (!open) return;
        if (step === 0) pushBot(t('chat.stepHeight', { defaultValue: `Dime la ALTURA de tu ventana en cm (permitido ${H_MIN}-${H_MAX}).`, H_MIN, H_MAX }));
        if (step === 1) pushBot(t('chat.stepWidth', { defaultValue: `Ahora la ANCHURA en cm (permitido ${W_MIN}-${W_MAX}).`, W_MIN, W_MAX }));
        if (step === 2) pushBot(t('chat.stepMainFabric', { defaultValue: 'Elige la TELA PRINCIPAL (uso CORTINA).' }));
        if (step === 3) pushBot(t('chat.stepPanels', { defaultValue: '¿Quieres 1 panel (SIMPLE) o 2 paneles (DOBLE)? (solo informativo)' }));
        if (step === 4) pushBot(t('chat.stepLining', { defaultValue: '¿Quieres la cortina FORRADA? Selecciona el producto y color.' }));
        if (step === 5) pushBot(t('chat.stepMakingType', { defaultValue: 'Elige el tipo de CONFECCIÓN (si es forrada se suman +25 €/m dentro de la confección).' }));
        if (step === 6) pushBot(t('chat.stepBottom', { defaultValue: '¿Cómo quieres el BAJO?' }));
        if (step === 7) pushBot(t('chat.stepIncludeMaking', { defaultValue: '¿Quieres que nos encarguemos de la confección?' }));
        if (step === 8) pushBot(t('chat.stepSummary', { defaultValue: 'Listo. Te muestro el presupuesto. ¿Confirmamos?' }));
    }, [step, open, t]);

    useEffect(() => {
        if (!open) return;
        if (step === 0) heightInputRef.current?.focus();
        if (step === 1) widthInputRef.current?.focus();
    }, [open, step]);

    const closeAndReset = () => {
        setOpen(false);
        setTimeout(() => {
            setStep(0);
            setMessages([{ role: 'bot', text: t('chat.greeting', { defaultValue: '¡Hola! Soy tu asistente para calcular cortinas. ¿Empezamos?' }) }]);
            setHeightCm(defaultHeightCm);
            setWidthCm(defaultWidthCm);
            setBoltWidthCm(null); // ← vuelve a null para no mostrar 140 cm por defecto
            setPanels('simple');

            setSelectedMainFabricProduct(null);
            setSelectedMainFabricColor(null);

            setLining('sin forrar');
            setSelectedLiningProduct(null);
            setSelectedLiningColor(null);
            setMakingType('tablasCocidas');
            setBottom('aRas');
            setIncludeMaking(true);
            setPpm(Number(pricePerMeter) || 0);
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
                    <div className="text-gray-500">{t('ui.mainFabric')}</div>
                    <div className="font-semibold">
                        {selectedMainFabricProduct
                            ? `${selectedMainFabricProduct.name}${selectedMainFabricColor ? ` – ${selectedMainFabricColor.name}` : ''}`
                            : t('ui.notSelected', { defaultValue: 'No seleccionada' })}
                    </div>
                </div>
                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                    <div className="text-gray-500">{t('ui.requiredFabric', { defaultValue: 'Tela necesaria' })}</div>
                    <div className="font-semibold">{result.metersFabric} m</div>
                </div>
                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                    <div className="text-gray-500">{t('ui.fabricPrice', { defaultValue: 'Precio tela' })}</div>
                    <div className="font-semibold">
                        {result.fabricCost.toLocaleString()} {currency}
                    </div>
                </div>
                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                    <div className="text-gray-500">{t('ui.sewing')}</div>
                    <div className="font-semibold">
                        {result.makingCost.toLocaleString()} {currency}
                        <span className="ml-1 text-xs text-gray-500">({result.makingPerM} €/m)</span>
                    </div>
                </div>
                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2">
                    <div className="text-gray-500">{t('ui.panels', { defaultValue: 'Paños' })}</div>
                    <div className="font-semibold">
                        {result.drops} {t('ui.panelUnit', { defaultValue: 'paño' })}{result.drops !== 1 ? t('ui.panelPlural', { defaultValue: 's' }) : ''} de {(result.heightPerDropCm / 100).toFixed(1)} m
                        <span className="ml-2 text-xs text-gray-500">({t('ui.heightNote', { defaultValue: 'de alto' })})</span>
                    </div>
                </div>
                <div className="rounded-lg border bg-white/60 backdrop-blur px-3 py-2 col-span-2">
                    <div className="text-gray-500">{t('ui.linedFabric', { defaultValue: 'Tejido forrado' })}</div>
                    {lining === 'forrada' && selectedLiningProduct ? (
                        <div className="font-semibold">
                            {liningMeters} m × {Number(selectedLiningProduct.pricePerMeter).toFixed(2)} €/m = {liningFabricCost.toLocaleString()} {currency}
                            <span className="ml-1 text-xs text-gray-500">
                                ({selectedLiningProduct.name}
                                {selectedLiningColor ? ` – ${selectedLiningColor.name}` : ''}
                                {liningBoltWidthCm ? ` · ${t('ui.boltWidthShort', { defaultValue: 'ancho' })} ${liningBoltWidthCm} cm` : ''})
                            </span>
                        </div>
                    ) : (
                        <div className="text-gray-500">{t('ui.notSelectedShort', { defaultValue: 'No seleccionado' })}</div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-end gap-1 rounded-xl border bg-gray-50 px-4 py-3">
                <div className="text-sm text-gray-600 w-full flex justify-between">
                    <span>{t('ui.totalEstimated', { defaultValue: 'Total estimado' })}</span>
                    <span className="text-xl font-semibold tracking-tight">{finalTotal.toLocaleString()} {currency}</span>
                </div>
            </div>
        </div>
    );

    if (!open) return null;

    const headerBoltText = selectedMainFabricProduct || selectedMainFabricColor ? (Number(result?.boltWidthUsedCm) ? `${result.boltWidthUsedCm} cm` : '—') : '—';

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
                        <h3 className="text-base font-semibold leading-tight">{t('ui.assistantTitle', { defaultValue: 'Asistente de cortinas' })}</h3>
                        <p className="mt-0.5 text-xs text-white/80">
                            {t('ui.pricePerMeter', { defaultValue: 'Precio/metro:' })} <span className="font-medium">{ppm > 0 ? `${ppm.toLocaleString()} ${currency}` : '—'}</span>{' '}
                            | {t('ui.boltWidth', { defaultValue: 'Ancho paño:' })} <span className="font-medium">{headerBoltText}</span>
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
                        <div className="h-full rounded-full bg-gray-900 transition-all" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
                    </div>
                </div>

                {/* Chat + controles */}
                <div className="mt-3 flex h-[460px] flex-col px-5 pb-5">
                    <div className="flex-1 space-y-3 overflow-auto rounded-xl border bg-gradient-to-b from-white to-gray-50 p-3">
                        {messages.map((m, i) => (
                            <Bubble key={i} role={m.role}>
                                {m.text}
                            </Bubble>
                        ))}
                        {step === 8 && (
                            <Bubble role="bot">
                                <Summary />
                            </Bubble>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    <div className="mt-4 space-y-3">
                        {/* Paso 0 */}
                        {step === 0 && (
                            <form
                                className="flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const v = Number(heightCm);
                                    if (!v) return;
                                    const clamped = Math.min(Math.max(v, H_MIN), H_MAX);
                                    if (clamped !== v) {
                                        setHeightCm(clamped);
                                        pushBot(
                                            t('messages.heightClamped', {
                                                defaultValue: `He ajustado la altura a ${clamped} cm (permitido: ${H_MIN}-${H_MAX}).`,
                                                value: clamped,
                                                H_MIN,
                                                H_MAX,
                                            })
                                        );
                                    }
                                    pushUser(`${clamped} cm`);
                                    setStep(1);
                                }}
                            >
                                <input
                                    ref={heightInputRef}
                                    type="number"
                                    min={H_MIN}
                                    max={H_MAX}
                                    className="w-44 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                    placeholder={t('ui.heightPlaceholder', { defaultValue: `Altura (${H_MIN}-${H_MAX} cm)`, H_MIN, H_MAX })}
                                    autoFocus
                                />
                                <button className="inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90">
                                    {t('ui.ok', { defaultValue: 'OK' })}
                                </button>
                            </form>
                        )}

                        {/* Paso 1 */}
                        {step === 1 && (
                            <form
                                className="flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const v = Number(widthCm);
                                    if (!v) return;
                                    const clamped = Math.min(Math.max(v, W_MIN), W_MAX);
                                    if (clamped !== v) {
                                        setWidthCm(clamped);
                                        pushBot(
                                            t('messages.widthClamped', {
                                                defaultValue: `He ajustado el ancho a ${clamped} cm (permitido: ${W_MIN}-${W_MAX}).`,
                                                value: clamped,
                                                W_MIN,
                                                W_MAX,
                                            })
                                        );
                                    }
                                    pushUser(`${clamped} cm`);
                                    setStep(2);
                                    setShowMainFabricModal(true);
                                }}
                            >
                                <input
                                    ref={widthInputRef}
                                    type="number"
                                    min={W_MIN}
                                    max={W_MAX}
                                    className="w-44 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                                    value={widthCm}
                                    onChange={(e) => setWidthCm(e.target.value)}
                                    placeholder={t('ui.widthPlaceholder', { defaultValue: `Anchura (${W_MIN}-${W_MAX} cm)`, W_MIN, W_MAX })}
                                    autoFocus
                                />
                                <button className="inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90">
                                    {t('ui.ok', { defaultValue: 'OK' })}
                                </button>
                            </form>
                        )}

                        {/* Paso 2 */}
                        {step === 2 && (
                            <div className="flex items-center gap-2">
                                <button
                                    className="inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
                                    onClick={() => setShowMainFabricModal(true)}
                                >
                                    {selectedMainFabricProduct ? t('ui.changeMainFabric', { defaultValue: 'Cambiar tela principal' }) : t('ui.chooseMainFabric', { defaultValue: 'Elegir tela principal' })}
                                </button>
                                {selectedMainFabricProduct && (
                                    <div className="text-sm text-gray-700">
                                        {selectedMainFabricProduct.name}
                                        {selectedMainFabricColor ? ` – ${selectedMainFabricColor.name}` : ''}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Paso 3 */}
                        {step === 3 && (
                            <div className="flex gap-2">
                                <Choice
                                    active={panels === 'simple'}
                                    onClick={() => {
                                        setPanels('simple');
                                        pushUser(t('ui.simpleInfo', { defaultValue: 'SIMPLE (informativo)' }));
                                        setStep(4);
                                    }}
                                    label={t('ui.simple', { defaultValue: 'Simple' })}
                                />
                                <Choice
                                    active={panels === 'doble'}
                                    onClick={() => {
                                        setPanels('doble');
                                        pushUser(t('ui.doubleInfo', { defaultValue: 'DOBLE (informativo)' }));
                                        setStep(4);
                                    }}
                                    label={t('ui.double', { defaultValue: 'Doble' })}
                                />
                            </div>
                        )}

                        {/* Paso 4 */}
                        {step === 4 && (
                            <div className="flex gap-2">
                                <Choice
                                    active={lining === 'forrada'}
                                    onClick={() => {
                                        setLining('forrada');
                                        setShowLiningModal(true);
                                    }}
                                    label={
                                        selectedLiningProduct?.name
                                            ? `${t('ui.lined', { defaultValue: 'Forrada' })}: ${selectedLiningProduct.name}`
                                            : t('ui.linedWithCatalog', { defaultValue: 'Forrada (+catálogo)' })
                                    }
                                />
                                <Choice
                                    active={lining === 'sin forrar'}
                                    onClick={() => {
                                        setLining('sin forrar');
                                        setSelectedLiningProduct(null);
                                        setSelectedLiningColor(null);
                                        pushUser(t('ui.unlined', { defaultValue: 'Sin forrar' }));
                                        setStep(5);
                                    }}
                                    label={t('ui.unlined', { defaultValue: 'Sin forrar' })}
                                />
                            </div>
                        )}

                        {/* Paso 5 */}
                        {step === 5 && (
                            <div className="flex flex-wrap gap-2">
                                {[
                                    ['ondaPerfecta', t('types.ondaPerfecta', { defaultValue: 'Onda perfecta' })],
                                    ['ollaos', t('types.ollaos', { defaultValue: 'Ollaos' })],
                                    ['tablasCocidas', t('types.tablasCocidas', { defaultValue: 'Tablas cosidas' })],
                                    ['dosPinzas', t('types.dosPinzas', { defaultValue: 'Dos pinzas' })],
                                    ['tresPinzas', t('types.tresPinzas', { defaultValue: 'Tres pinzas' })],
                                    ['fruncido', t('types.fruncido', { defaultValue: 'Fruncido' })],
                                ].map(([key, label]) => (
                                    <Choice
                                        key={key}
                                        active={makingType === key}
                                        onClick={() => {
                                            setMakingType(key);
                                            pushUser(label);
                                            setStep(6);
                                        }}
                                        label={label}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Paso 6 */}
                        {step === 6 && (
                            <div className="flex gap-2">
                                <Choice
                                    active={bottom === 'aRas'}
                                    onClick={() => {
                                        setBottom('aRas');
                                        pushUser(t('ui.bottomFlush', { defaultValue: 'Bajo a ras' }));
                                        setStep(7);
                                    }}
                                    label={t('ui.bottomFlushShort', { defaultValue: 'A ras' })}
                                />
                                <Choice
                                    active={bottom === 'colgante'}
                                    onClick={() => {
                                        setBottom('colgante');
                                        pushUser(t('ui.bottomHanging', { defaultValue: 'Bajo colgante' }));
                                        setStep(7);
                                    }}
                                    label={t('ui.bottomHangingShort', { defaultValue: 'Colgante' })}
                                />
                                <Choice
                                    active={bottom === 'posada'}
                                    onClick={() => {
                                        setBottom('posada');
                                        pushUser(t('ui.bottomResting', { defaultValue: 'Bajo posada' }));
                                        setStep(7);
                                    }}
                                    label={t('ui.bottomRestingShort', { defaultValue: 'Posada' })}
                                />
                            </div>
                        )}

                        {/* Paso 7 */}
                        {step === 7 && (
                            <div className="flex gap-2">
                                <Choice
                                    active={includeMaking}
                                    onClick={() => {
                                        setIncludeMaking(true);
                                        pushUser(t('ui.includeMakingYes', { defaultValue: 'Sí, con confección' }));
                                        setStep(8);
                                    }}
                                    label={t('ui.includeMakingYes', { defaultValue: 'Sí, con confección' })}
                                />
                                <Choice
                                    active={!includeMaking}
                                    onClick={() => {
                                        setIncludeMaking(false);
                                        pushUser(t('ui.includeMakingNo', { defaultValue: 'No, sin confección' }));
                                        setStep(8);
                                    }}
                                    label={t('ui.includeMakingNo', { defaultValue: 'No, sin confección' })}
                                />
                            </div>
                        )}

                        {/* Paso 8: PDF */}
                        {step === 8 && (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
                                    onClick={async () => {
                                        // === Logo (sin top-level await, con cache) ===
                                        const logoDataUrl = await getLogoDataUrl();

                                        // === Principal: intenta como la modal (candidatos + API por codprodu) ===
                                        const mainImageDataUrl = await firstImageBase64({
                                            product: selectedMainFabricProduct,
                                            color: selectedMainFabricColor,
                                        });

                                        // === Forro (si procede) ===
                                        const liningImageDataUrl =
                                            lining === 'forrada'
                                                ? await firstImageBase64({
                                                    product: selectedLiningProduct,
                                                    color: selectedLiningColor,
                                                })
                                                : '';

                                        await generateCurtainQuotePDF({
                                            meters: result.metersFabric,
                                            pricePerMeter: ppm,
                                            fabricCost: result.fabricCost,
                                            makingCost: result.makingCost,
                                            subtotalWithoutLining: result.subtotal,

                                            liningMeters,
                                            liningPricePerMeter: selectedLiningProduct?.pricePerMeter ?? 0,
                                            liningFabricCost,

                                            total: Number(finalTotal) || 0,

                                            // Paños por tejido
                                            dropsMain: result.drops,
                                            dropHeightCmMain: result.heightPerDropCm,
                                            dropsLining: liningCalc?.drops ?? 0,
                                            dropHeightCmLining: liningCalc?.heightPerDropCm ?? 0,

                                            config: {
                                                heightCm: Number(heightCm),
                                                widthCm: Number(widthCm),
                                                fabricBoltWidthCm: Number(result?.boltWidthUsedCm ?? boltWidthCm ?? fabricBoltWidthCm) || 140, // usado realmente
                                                panels, // "simple" | "doble" → etiqueta "Estilo"
                                                dropHeightCm: result.heightPerDropCm, // opcional en el resumen

                                                // principal
                                                mainFabricProduct: selectedMainFabricProduct,
                                                mainFabricColor: selectedMainFabricColor,

                                                // forro
                                                lining,
                                                liningProduct: selectedLiningProduct,
                                                liningColor: selectedLiningColor,
                                                liningBoltWidthCm,

                                                makingType,
                                                bottom,
                                                includeMaking,
                                            },
                                            currency, // ← usa la moneda del prop
                                            assets: {
                                                logoDataUrl,
                                                mainImageDataUrl,
                                                liningImageDataUrl,
                                            },
                                        });

                                        closeAndReset();
                                        onFinished?.();
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

            {/* Modal TELA PRINCIPAL */}
            <CurtainFabricPickerModal
                open={showMainFabricModal}
                onClose={() => {
                    setShowMainFabricModal(false);
                }}
                onPicked={({ product, color, pricePerMeter }) => {
                    const finalProduct = {
                        ...product,
                        pricePerMeter: typeof pricePerMeter === 'number' ? pricePerMeter : product?.pricePerMeter ?? null,
                    };
                    setSelectedMainFabricProduct(finalProduct);
                    setSelectedMainFabricColor(color || null);

                    if (typeof finalProduct.pricePerMeter === 'number') {
                        setPpm(finalProduct.pricePerMeter);
                    }

                    // Determinación robusta del ancho desde producto/color
                    const cmFromProduct = getBoltWidthFromEntity(finalProduct, boltWidthCm ?? fabricBoltWidthCm);
                    const cmFromColor = getBoltWidthFromEntity(color, cmFromProduct);
                    if (Number.isFinite(cmFromColor) && cmFromColor > 0) {
                        setBoltWidthCm(cmFromColor);
                    }

                    setShowMainFabricModal(false);
                    setStep(3);
                }}
            />

            {/* Modal FORRO */}
            <LiningPickerModal
                open={showLiningModal}
                onClose={() => {
                    setShowLiningModal(false);
                }}
                nameCandidates={liningNameCandidates}
                onPicked={({ product, color, pricePerMeter }) => {
                    const finalProduct = {
                        ...product,
                        pricePerMeter: typeof pricePerMeter === 'number' ? pricePerMeter : product?.pricePerMeter ?? null,
                    };
                    setSelectedLiningProduct(finalProduct);
                    setSelectedLiningColor(color || null);
                    setShowLiningModal(false);
                    setLining('forrada');
                    setStep(5);
                }}
            />
        </div>
    );
}
