// src/app/products/SubMenuCarousel.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { cdnUrl } from '../../Constants/cdn';
import { fetchCategoryPreview, groupCategories } from '../filters/categoryConfig';

/* ==============================
   Hook de media query (mobile-only)
============================== */
function useMediaQuery(query) {
    const getMatch = () =>
        (typeof window !== 'undefined' && 'matchMedia' in window)
            ? window.matchMedia(query).matches
            : false;

    const [matches, setMatches] = useState(getMatch);

    useEffect(() => {
        if (typeof window === 'undefined' || !('matchMedia' in window)) return;
        const mql = window.matchMedia(query);
        const onChange = () => setMatches(mql.matches);
        onChange();
        mql.addEventListener?.('change', onChange);
        return () => mql.removeEventListener?.('change', onChange);
    }, [query]);

    return matches;
}

// Solo queremos que SE MUESTRE en pantallas pequeñas (< 1024px)
const useIsSmallScreen = () => useMediaQuery('(max-width: 1023.98px)');

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
 */
const TYPE_KEYS = new Set([
    // Ya existentes / comunes
    'WALLPAPER', 'PAPEL PINTADO',
    'VISILLO', 'TERCIOPELO', 'DIMOUT', 'BLACKOUT', 'SCREEN', 'POLIPIEL', 'LANA',

    // LISTA "TIPOS"
    'ALGODON', 'BLACKOUT', 'CUADROS', 'DIMOUT', 'DRALON ACRILICO',
    'ESTAMPADO', 'FOSCURIT', 'JACQUARD', 'YUTE', 'LANA', 'LINO', 'LISO',
    'OLEFINA', 'POLIESTER', 'POLIPIEL', 'POLIPROPILENO', 'POLIOLEFINA',
    'RAYAS', 'TERCIOPELO', 'VISILLO', 'PAPEL PINTADO'
]);

const USAGE_KEYS = new Set(['FR', 'OUTDOOR', 'IMO']);
const MAINT_KEYS = new Set(['EASYCLEAN', 'EASY CLEAN', 'EASY-CLEAN']);

/** Dada una key y un groupKey original, decide el groupKey correcto */
const inferGroupKey = (key, originalGroupKey) => {
    const k = norm(key);
    if (TYPE_KEYS.has(k)) return 'types';
    if (USAGE_KEYS.has(k)) return 'usage';
    if (MAINT_KEYS.has(k)) return 'maintenance';
    return originalGroupKey || 'patterns';
};

export default function SubMenuCarousel({ onFilterClick, type = 'tela', activeCategory }) {
    // TODOS los hooks se ejecutan SIEMPRE en el mismo orden
    const isSmall = useIsSmallScreen();
    const { t } = useTranslation('subMenuCarousel');
    const navigate = useNavigate();
    const location = useLocation();

    const [open, setOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [hoveredKey, setHoveredKey] = useState(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

    const cacheRef = useRef({});          // cache pos/neg
    const isMountedRef = useRef(true);

    // Promesas en vuelo por categoría
    const inFlightRef = useRef(new Map()); // cacheKey -> Promise
    const lastTokenRef = useRef(new Map()); // cacheKey -> number
    const MISS = Symbol('MISS');           // marca cache negativa

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // sections = [ [groupLabel, cats[]] ]
    // cada cat debe tener: { key, labelKey, groupKey }
    const sections = useMemo(
        () => Object.entries(groupCategories(t, type)),
        [t, type]
    );

    const flatCategories = useMemo(
        () => sections.flatMap(([, cats]) => cats),
        [sections]
    );

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

    // ESCUCHAR openProductFilters SOLO EN MÓVIL
    useEffect(() => {
        if (!isSmall) return;

        const handler = (event) => {
            const requestedType = event?.detail?.productType;

            if (requestedType && requestedType !== type) {
                const qs = new URLSearchParams(window.location.search);
                qs.set('type', requestedType);
                navigate(`/products?${qs.toString()}`, { state: { openFilters: true } });
                return;
            }

            setOpen(true);
        };

        window.addEventListener('openProductFilters', handler);
        return () => window.removeEventListener('openProductFilters', handler);
    }, [isSmall, navigate, type]);

    // Si venimos de otra ruta con state.openFilters, abrir directamente el menú en móvil
    useEffect(() => {
        if (!isSmall) return;
        if (!location.state || !location.state.openFilters) return;

        setOpen(true);

        const { openFilters, ...restState } = location.state;
        const cleanedState = Object.keys(restState).length ? restState : null;

        navigate(
            `${location.pathname}${location.search}${location.hash || ''}`,
            { replace: true, state: cleanedState },
        );
    }, [isSmall, location.hash, location.pathname, location.search, location.state, navigate]);

    // 👇 early return DESPUÉS de todos los hooks
    if (!isSmall) {
        return null;
    }

    // Solo usamos el menú móvil
    const mobileMenu = (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setOpen(false)}>
            <div
                className="w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl p-6 overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
                            {t('previewTitle', 'Vista previa')}
                        </p>
                        {/* Título corto, ya no la frase larga del botón */}
                        <h3 className="text-lg font-semibold text-slate-900">
                            {t('panelTitle', 'Filtros')}
                        </h3>
                    </div>
                    {/* Botón de cerrar más visible pero manteniendo estética limpia */}
                    <button
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white font-semibold shadow-md shadow-slate-500/40 hover:bg-slate-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700"
                    >
                        <FaTimes />
                        <span className="text-sm">
                            {t('closeButton', 'Cerrar filtros')}
                        </span>
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

    // Ya no hay botón con el texto largo; solo se abre desde el botón de filtros del header
    return (
        <>
            {open && mobileMenu}
        </>
    );
}
