import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronRight, FaSpinner, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { cdnUrl } from '../../Constants/cdn';
import { fetchCategoryPreview, groupCategories } from '../filters/categoryConfig';

// Normaliza texto (acentos/espacios/mayús) para comparaciones seguras
const norm = (v = '') =>
    String(v)
        .trim()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/\s+/g, ' ')
        .toUpperCase();

/**
 * Conjuntos para inferir correctamente el tipo de filtro:
 * - TYPE_KEYS: deben mapear a fabricType
 * - USAGE_KEYS: deben mapear a uso
 * - MAINT_KEYS: deben mapear a mantenimiento
 *
 * Añadimos TODOS los que has indicado en la sección TIPOS.
 * Usamos la versión normalizada (sin tildes, mayúsculas).
 */
const TYPE_KEYS = new Set([
    // Ya existentes / comunes
    'WALLPAPER', 'PAPEL PINTADO',
    'VISILLO', 'TERCIOPELO', 'DIMOUT', 'BLACKOUT', 'SCREEN', 'POLIPIEL', 'LANA',

    // LISTA "TIPOS" que pides mapear a fabricType:
    'ALGODON',            // Algodón
    'BLACKOUT',          // Blackout
    'CUADROS',           // Cuadros
    'DIMOUT',            // Dimout
    'DRALON ACRILICO',   // Dralon acrílico
    'ESTAMPADO',         // Estampado
    'FOSCURIT',          // Foscurit
    'JACQUARD',          // Jacquard
    'YUTE',              // Yute
    'LANA',              // Lana
    'LINO',              // Lino
    'LISO',              // Liso
    'OLEFINA',           // Olefina
    'POLIESTER',         // Poliéster
    'POLIPIEL',          // Polipiel
    'POLIPROPILENO',     // Polipropileno
    'POLIOLEFINA',       // Poliolefina
    'RAYAS',             // Rayas
    'TERCIOPELO',        // Terciopelo
    'VISILLO',           // Visillo
    'PAPEL PINTADO'      // Papel pintado
]);

const USAGE_KEYS = new Set([
    'FR', 'OUTDOOR', 'IMO'
]);

const MAINT_KEYS = new Set([
    'EASYCLEAN', 'EASY CLEAN', 'EASY-CLEAN'
]);

/** Dada una key y un groupKey original, decide el groupKey correcto */
const inferGroupKey = (key, originalGroupKey) => {
    const k = norm(key);

    if (TYPE_KEYS.has(k)) return 'types';
    if (USAGE_KEYS.has(k)) return 'usage';
    if (MAINT_KEYS.has(k)) return 'maintenance';

    // Si no coincide con ninguno de los conjuntos, respetamos el original
    // y, si no viene, caemos a 'patterns' (fabricPattern)
    return originalGroupKey || 'patterns';
};

export default function SubMenuCarousel({ onFilterClick, type = 'tela', activeCategory }) {
    const { t } = useTranslation('subMenuCarousel');
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [hoveredKey, setHoveredKey] = useState(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

    const timeoutRef = useRef(null);
    const cacheRef = useRef({});                 // cache pos/neg
    const isMountedRef = useRef(true);

    // Promesas en vuelo por categoría
    const inFlightRef = useRef(new Map());       // cacheKey -> Promise
    const lastTokenRef = useRef(new Map());      // cacheKey -> number
    const MISS = Symbol('MISS');                 // marca cache negativa

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // sections = [ [groupLabel, cats[]] ]
    // cada cat debe tener: { key, labelKey, groupKey }
    const sections = useMemo(() => Object.entries(groupCategories(t, type)), [t, type]);
    const flatCategories = useMemo(() => sections.flatMap(([, cats]) => cats), [sections]);
    const hoveredCategory = useMemo(
        () => flatCategories.find(cat => cat.key === hoveredKey),
        [flatCategories, hoveredKey]
    );

    // Enviamos al padre un payload estructurado { key, groupKey } con groupKey *corregido*
    const selectCategory = (cat) => {
        setOpen(false);
        setPreviewData(null);
        setHoveredKey(null);

        const fixedGroupKey = inferGroupKey(cat.key, cat.groupKey);
        const isActive = norm(activeCategory) === norm(cat.key);

        onFilterClick(isActive ? null : { key: cat.key, groupKey: fixedGroupKey });
    };

    const withTimeout = (promise, ms = 4000) =>
        Promise.race([
            promise,
            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)),
        ]);

    const loadPreview = useCallback(async (cat) => {
        if (!cat) return;
        const fixedGroupKey = inferGroupKey(cat.key, cat.groupKey);
        const cacheKey = `${fixedGroupKey}:${cat.key}`;

        if (cacheKey in cacheRef.current) {
            const cached = cacheRef.current[cacheKey];
            setPreviewData(cached === MISS ? null : cached);
            setLoadingPreview(false);
            return;
        }

        if (inFlightRef.current.has(cacheKey)) {
            setLoadingPreview(true);
            try {
                const result = await inFlightRef.current.get(cacheKey);
                if (!isMountedRef.current) return;
                setPreviewData(result === MISS ? null : result);
            } finally {
                setLoadingPreview(false);
            }
            return;
        }

        const token = (lastTokenRef.current.get(cacheKey) || 0) + 1;
        lastTokenRef.current.set(cacheKey, token);

        setLoadingPreview(true);

        const task = (async () => {
            try {
                const data = await withTimeout(fetchCategoryPreview(cat.key, fixedGroupKey), 4000);
                return data ?? null;
            } catch {
                return null;
            }
        })();

        inFlightRef.current.set(cacheKey, task);

        try {
            const data = await task;
            if (!isMountedRef.current) return;
            if (token !== lastTokenRef.current.get(cacheKey)) return;

            const toStore = data ?? MISS;
            cacheRef.current[cacheKey] = toStore;
            setPreviewData(toStore === MISS ? null : toStore);
        } finally {
            inFlightRef.current.delete(cacheKey);
            if (isMountedRef.current) setLoadingPreview(false);
        }
    }, []);

    const handleFocusCategory = (cat) => {
        setHoveredKey(cat.key);
        setPreviewData(null);
        loadPreview(cat);
    };

    // Si abrimos y hay categoría activa (desde URL), precargamos su preview
    useEffect(() => {
        if (!open || !activeCategory) return;
        const target = flatCategories.find(cat => norm(cat.key) === norm(activeCategory));
        if (target) {
            setHoveredKey(target.key);
            loadPreview(target);
        }
    }, [activeCategory, flatCategories, loadPreview, open]);

    const openMenu = () => {
        clearTimeout(timeoutRef.current);
        setOpen(true);
    };

    const closeMenu = () => {
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
            setPreviewData(null);
            setHoveredKey(null);
            setLoadingPreview(false);
        }, 160);
    };

    const renderCategoryButton = (cat) => {
        const label = t(cat.labelKey);
        const isActive = norm(activeCategory) === norm(cat.key);
        return (
            <button
                key={`${inferGroupKey(cat.key, cat.groupKey)}:${cat.key}`}
                onClick={() => selectCategory(cat)}
                onMouseEnter={() => handleFocusCategory(cat)}
                onFocus={() => handleFocusCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E3A8A] ${isActive
                        ? 'bg-[#1E3A8A] text-white shadow-lg shadow-blue-200'
                        : 'bg-white/70 text-gray-700 border border-slate-200 hover:bg-white'
                    }`}
            >
                {label}
            </button>
        );
    };

    const desktopMenu = (
        <div className="hidden lg:block absolute left-1/2 top-full mt-3 -translate-x-1/2 w-[min(1080px,95vw)] z-50">
            <div className="rounded-3xl bg-white/90 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
                <div className="grid grid-cols-[2.1fr_1fr]">
                    <div className="p-8 space-y-7 max-h-[460px] overflow-y-auto">
                        {sections.map(([groupLabel, cats]) => (
                            <div key={groupLabel}>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                        {groupLabel}
                                    </h4>
                                    <span className="h-px flex-1 ml-4 bg-gradient-to-r from-slate-200 to-transparent" />
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {cats.map(renderCategoryButton)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="relative bg-gradient-to-br from-[#0b1736] via-[#132f5f] to-[#1f4f8d] text-white p-8 flex flex-col">
                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-[0.5em] text-white/60">
                                {t('previewTitle', 'Vista previa')}
                            </p>
                            <h3 className="text-2xl font-semibold leading-tight">
                                {hoveredCategory
                                    ? t('previewLabel', { label: t(hoveredCategory.labelKey) })
                                    : t('hoverInfo')}
                            </h3>
                        </div>
                        <div className="mt-6 flex-1 flex items-center justify-center">
                            {loadingPreview ? (
                                <FaSpinner className="animate-spin text-3xl text-white/70" />
                            ) : previewData && previewData.imageUrl ? (
                                <div
                                    className="w-full group cursor-pointer"
                                    onClick={() => {
                                        if (!previewData?.id) return;
                                        navigate(`/products?productId=${previewData.id}`);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl shadow-black/20">
                                        <img
                                            src={cdnUrl(previewData.imageUrl)}
                                            alt={previewData.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-sm font-medium text-white/90">
                                            {previewData.name}
                                        </span>
                                        <span className="flex items-center text-xs font-semibold uppercase tracking-widest text-white/70">
                                            {t('previewCta', 'Ver producto')}
                                            <FaChevronRight className="ml-2" />
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-white/60 text-center leading-relaxed">
                                    {t(
                                        'emptyPreview',
                                        'Selecciona una categoría para descubrir un producto destacado.'
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const mobileMenu = (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end" onClick={() => setOpen(false)}>
            <div
                className="w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl p-6 overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                            {t('previewTitle', 'Vista previa')}
                        </p>
                        <h3 className="text-lg font-semibold text-slate-900">
                            {t('triggerDefault')}
                        </h3>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                    >
                        <FaTimes />
                    </button>
                </div>

                {previewData && previewData.imageUrl && (
                    <div className="mb-6">
                        <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
                            <img
                                src={cdnUrl(previewData.imageUrl)}
                                alt={previewData.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="mt-3 text-sm font-medium text-slate-800">{previewData.name}</p>
                    </div>
                )}

                <div className="space-y-6">
                    {sections.map(([groupLabel, cats]) => (
                        <div key={groupLabel}>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 mb-3">
                                {groupLabel}
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {cats.map(cat => {
                                    const label = t(cat.labelKey);
                                    const isActive = norm(activeCategory) === norm(cat.key);
                                    return (
                                        <button
                                            key={`${inferGroupKey(cat.key, cat.groupKey)}:${cat.key}`}
                                            onClick={() => {
                                                handleFocusCategory(cat);
                                                selectCategory(cat);
                                            }}
                                            className={`px-4 py-2 rounded-2xl text-sm font-medium transition shadow-sm ${isActive
                                                    ? 'bg-[#1E3A8A] text-white shadow-blue-200'
                                                    : 'bg-slate-100 text-slate-700'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative mt-10" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
            <div className="flex justify-center">
                <button
                    onClick={() => setOpen(o => !o)}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#1F4F8D] to-[#4DA4FF] text-white shadow-lg shadow-blue-200/60 hover:shadow-blue-300/70 transition"
                >
                    <span className="text-base font-semibold tracking-wide">
                        {t('triggerDefault')}
                    </span>
                    <FaChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {open && (
                <>
                    {desktopMenu}
                    {mobileMenu}
                </>
            )}
        </div>
    );
}
