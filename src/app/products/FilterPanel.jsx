// src/app/products/FilterPanel.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMarca } from '../../components/MarcaContext';
import {
    FaTimes, FaSearch, FaTrashAlt, FaChevronDown, FaChevronUp,
    FaSpinner, FaChevronRight, FaChevronLeft, FaListUl, FaCheck, FaMagic,
} from 'react-icons/fa';
import { cdnUrl } from '../../Constants/cdn';
import { CATEGORY_CONFIG, fetchCategoryPreview } from '../../components/filters/categoryConfig';

/* ==============================
   Hook de media query (desktop-only)
============================== */
function useMediaQuery(query) {
    const getMatch = () => (typeof window !== 'undefined' && 'matchMedia' in window)
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

// === Solo considerar pantallas grandes (>= 1024px) ===
const useIsLargeScreen = () => useMediaQuery('(min-width: 1024px)');

/* ==============================
   Constantes y utilidades
============================== */
// Galería: unimos usos + mantenimiento en una sección “Telas especiales”
const GALLERY_GROUPS = [
    { target: 'fabricPattern', groupKey: 'sections.estilos' },
    { target: 'fabricType', groupKey: 'sections.tipos' },
    { target: 'especial', groupKey: 'sections.especiales' }, // TELAS ESPECIALES

];

const BRAND_NAMES = { ARE: 'Arena', HAR: 'Harbour', FLA: 'Flamenco', CJM: 'CJM', BAS: 'Bassari' };

const TIPOS_INVALIDOS = [
    'JAQUARD', 'TEJIDO ', 'VISILLO FR', 'TERCIOPELO', 'RAYA', 'BUCLE',
    'PANA', 'TEJIDO', 'FALSO LISO', 'PAPEL PARED', 'TERCIOPELO FR',
    'FLORES', 'ESTAMAPADO', 'ESPIGA', 'RAYAS', 'CUADROS',
];

const DIBUJOS_INVALIDOS = [
    'TELAS CON FLORES', 'BLACKOUT', 'WALLCOVERING', 'TERCIOPELO FR',
    'RAFIA', 'KILM', 'RAYA', 'IKAT ', 'WALLPAPER', 'FLORES', 'ANIMAL',
    'LISOS', 'ESTAMPADO', 'GEOMETRICA', 'ESPIGAS', 'VISILLO', 'TEJIDO',
    'TERCIOPELO', 'PANA',
];

const COLEC_INVALIDAS = ['MARRAKESH', 'CARIBEAN PARTY'];

const ALLOWED_COLORS = [
    'GRIS', 'NEGRO', 'VERDE', 'BEIGE', 'BLANCO', 'MARRON',
    'AZUL', 'AMARILLO', 'NARANJA', 'ROJO', 'MORADO', 'VIOLETA', 'ROSA',
];

const COLOR_MAP = {
    GRIS: '#808080', NEGRO: '#000000', VERDE: '#008000',
    BEIGE: '#F5F5DC', BLANCO: '#FFFFFF', MARRON: '#A52A2A',
    AZUL: '#0000FF', AMARILLO: '#FFFF00', NARANJA: '#FFA500',
    ROJO: '#FF0000', MORADO: '#800080', VIOLETA: '#EE82EE',
    ROSA: '#FFC0CB'
};

const MARTINDALE_RANGES = [
    { key: '0-20000' },
    { key: '20000-50000' },
    { key: '50000-100000' },
    { key: '100000+' }
];

const buildColorStyle = color => {
    const up = color.toUpperCase();
    return {
        backgroundColor: COLOR_MAP[up] || '#000',
        border: up === 'BLANCO' ? '1px solid rgba(15, 23, 42, 0.25)' : 'none'
    };
};

const normalizeValue = (value) => {
    if (value == null) return '';
    return String(value).trim();
};

const toComparableKey = (value) => {
    const normalized = normalizeValue(value);
    if (!normalized) return '';
    return normalized
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toUpperCase();
};

const buildFilterList = (values = [], { allow = [], deny = [] } = {}) => {
    const allowSet = allow.length ? new Set(allow.map(toComparableKey)) : null;
    const denySet = deny.length ? new Set(deny.map(toComparableKey)) : null;
    const seen = new Set();
    const result = [];

    values.forEach((raw) => {
        const cleaned = normalizeValue(raw);
        if (!cleaned) return;
        const key = toComparableKey(cleaned);
        if (!key) return;
        if (denySet && denySet.has(key)) return;
        if (allowSet && !allowSet.has(key)) return;
        if (seen.has(key)) return;
        seen.add(key);
        result.push(cleaned);
    });

    return result;
};

const uniqueStringList = (values = []) => buildFilterList(values);

const uniqueNumberList = (values = []) => {
    const seen = new Set();
    const result = [];
    values.forEach((value) => {
        const num = typeof value === 'number' ? value : Number(normalizeValue(value));
        if (!Number.isFinite(num)) return;
        if (seen.has(num)) return;
        seen.add(num);
        result.push(num);
    });
    return result;
};

/* ==============================
   Componente
============================== */
export default function FilterPanel({
    isOpen,
    close,
    applyFilters,
    currentFilters,
    productType = 'tela'
}) {
    const isLarge = useIsLargeScreen(); // hook siempre se ejecuta

    const { t } = useTranslation('filterPanelNew');
    const { t: tCategories } = useTranslation('subMenuCarousel');
    const { setMarcaActiva } = useMarca();

    // Selecciones
    const [brandsSel, setBrandsSel] = useState(currentFilters?.brand || []);
    const [colorsSel, setColorsSel] = useState(currentFilters?.color || []);
    const [collectionsSel, setCollectionsSel] = useState(currentFilters?.collection || []);
    const [typesSel, setTypesSel] = useState(currentFilters?.fabricType || []);
    const [patternsSel, setPatternsSel] = useState(currentFilters?.fabricPattern || []);
    const [martSel, setMartSel] = useState(currentFilters?.martindaleRanges || []);
    const [usageSel, setUsageSel] = useState(currentFilters?.uso || []);
    const [maintenanceSel, setMaintenanceSel] = useState(currentFilters?.mantenimiento || []);

    // Catálogo
    const [brands, setBrands] = useState([]);
    const [collections, setCollections] = useState([]);
    const [fabricTypes, setFabricTypes] = useState([]);
    const [fabricPatterns, setFabricPatterns] = useState([]);
    const [martindaleValues, setMartindale] = useState([]);
    const [colors, setColors] = useState([]);
    const [usageOptions, setUsageOptions] = useState([]);
    const [maintenanceOptions, setMaintenanceOptions] = useState([]);

    // UI + búsquedas
    const [collSearch, setCollSearch] = useState('');
    const [typeSearch, setTypeSearch] = useState('');
    const [collectionsOnlySelected, setCollectionsOnlySelected] = useState(false);

    const [openSections, setOpenSections] = useState({
        marcas: true, colecciones: true, tipos: true, martindale: true,
    });

    // Galería categorías
    const [categoryPreviews, setCategoryPreviews] = useState({});
    const [categoryPreviewLoading, setCategoryPreviewLoading] = useState({});

    // Refs
    const asideRef = useRef(null); // para quicknav
    const categoryPreviewCacheRef = useRef({});
    const isMountedRef = useRef(false);
    const filterSectionRefs = useRef({});
    const galleryRailRefs = useRef({});

    // Concurrencia
    const inFlightRef = useRef(new Map());
    const lastTokenRef = useRef(new Map());
    const activeCountRef = useRef(0);
    const queueRef = useRef([]);
    const CONCURRENCY_LIMIT = 8;
    const MISS = Symbol('MISS');

    const withTimeout = (promise, ms = 4000) =>
        Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

    const runWithLimit = useCallback((task) => {
        return new Promise((resolve) => {
            const run = async () => {
                activeCountRef.current += 1;
                try { resolve(await task()); }
                finally {
                    activeCountRef.current -= 1;
                    const next = queueRef.current.shift();
                    if (next) next();
                }
            };
            if (activeCountRef.current < CONCURRENCY_LIMIT) run();
            else queueRef.current.push(run);
        });
    }, []);

    // Estado flechas carrusel
    const [galleryScrollState, setGalleryScrollState] = useState({});
    const checkScroll = useCallback((key) => {
        const rail = galleryRailRefs.current?.[key];
        if (!rail) return;
        const canScroll = rail.scrollWidth > rail.clientWidth + 4;
        const showLeft = rail.scrollLeft > 2;
        const showRight = rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2;
        setGalleryScrollState((prev) => ({ ...prev, [key]: { canScroll, showLeft, showRight } }));
    }, []);

    // Permitidas
    const allowedCategories = useMemo(
        () => CATEGORY_CONFIG.filter((cat) => !(cat.onlyIfNotTela && productType === 'tela')),
        [productType],
    );

    // Secciones de galería (dinámico + fallback label)
    const gallerySections = useMemo(() => {
        const sections = GALLERY_GROUPS.map(meta => ({
            ...meta,
            label: tCategories(meta.groupKey),
            items: []
        }));

        const sectionsByTarget = sections.reduce((acc, section) => {
            acc[section.target] = section;
            return acc;
        }, {});

        const allowedKeySets = sections.reduce((acc, section) => {
            acc[section.target] = new Set();
            return acc;
        }, {});

        const specialSection = sectionsByTarget.especial;

        const formatFallbackLabel = value => {
            if (!value) return '';
            return value
                .split(/[\s;_/+-]+/)
                .filter(Boolean)
                .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                .join(' ');
        };

        const addItem = (target, rawKey, label, priority = 1, extra = {}) => {
            const section = sectionsByTarget[target];
            const keyValue = normalizeValue(rawKey);
            if (!section || !keyValue) return;
            const comparable = toComparableKey(keyValue);
            if (!comparable) return;
            if (section.items.some(item => item.comparableKey === comparable)) return;
            section.items.push({
                key: keyValue,
                comparableKey: comparable,
                target,
                groupKey: section.groupKey,
                label: label || formatFallbackLabel(keyValue),
                priority,
                ...extra
            });
        };

        allowedCategories.forEach(cat => {
            const keyValue = normalizeValue(cat.key);
            const comparable = toComparableKey(keyValue);
            if (!comparable) return;
            if (allowedKeySets[cat.target]) {
                allowedKeySets[cat.target].add(comparable);
            }
            addItem(cat.target, keyValue, tCategories(cat.labelKey), 0);
        });

        fabricPatterns.forEach(key => {
            const comparable = toComparableKey(key);
            if (allowedKeySets.fabricPattern?.size && !allowedKeySets.fabricPattern.has(comparable)) return;
            const label = t(`values.patterns.${key}`, key);
            addItem('fabricPattern', key, label === key ? formatFallbackLabel(key) : label);
        });

        fabricTypes.forEach(key => {
            const comparable = toComparableKey(key);
            if (allowedKeySets.fabricType?.size && !allowedKeySets.fabricType.has(comparable)) return;
            const label = t(`values.fabricTypes.${key}`, key);
            addItem('fabricType', key, label === key ? formatFallbackLabel(key) : label);
        });

        const SPECIAL_USAGE_KEYS = ['IMO', 'FR', 'OUTDOOR'];
        const SPECIAL_MAINT_KEYS = ['EASYCLEAN'];

        const specialUsageSet = new Set(SPECIAL_USAGE_KEYS.map(toComparableKey));
        const specialMaintSet = new Set(SPECIAL_MAINT_KEYS.map(toComparableKey));

        usageOptions.forEach((key) => {
            if (!specialUsageSet.has(toComparableKey(key))) return;
            // OJO: los items van a la sección "especiales", pero el target del item es "usage"
            specialSection?.items.push({
                key,
                comparableKey: toComparableKey(key),
                target: 'usage',
                groupKey: specialSection.groupKey,
                label: formatFallbackLabel(key),
                priority: 0,
            });
        });

        maintenanceOptions.forEach((key) => {
            if (!specialMaintSet.has(toComparableKey(key))) return;
            specialSection?.items.push({
                key,
                comparableKey: toComparableKey(key),
                target: 'maintenance',
                groupKey: specialSection.groupKey,
                label: formatFallbackLabel(key),
                priority: 0,
            });
        });


        sections.forEach(section => {
            section.items.sort((a, b) => {
                if (a.priority !== b.priority) return a.priority - b.priority;
                return a.label.localeCompare(b.label, undefined, { sensitivity: 'base' });
            });
        });

        return sections.filter(section => section.items.length > 0);
    }, [allowedCategories, fabricPatterns, fabricTypes, maintenanceOptions, t, tCategories, usageOptions]);

    const categoryMetaByKey = useMemo(() => {
        const map = new Map();
        gallerySections.forEach(section => {
            section.items.forEach(item => {
                map.set(item.comparableKey || toComparableKey(item.key), item);
            });
        });
        return map;
    }, [gallerySections]);

    const quickNavItems = useMemo(() => (
        [
            { key: 'marcas', label: t('categories.brands'), hasItems: brands.length > 0 },
            { key: 'colecciones', label: t('categories.collections'), hasItems: collections.length > 0 },
            { key: 'tipos', label: t('categories.fabricTypes'), hasItems: fabricTypes.length > 0 },
            { key: 'martindale', label: t('categories.martindale'), hasItems: MARTINDALE_RANGES.length > 0 }
        ].filter(item => item.hasItems)
    ), [
        brands.length,
        collections.length,
        fabricTypes.length,
        t
    ]);

    // Quick nav (scroll suave dentro del aside)
    const handleQuickNav = useCallback(key => {
        const target = filterSectionRefs.current?.[key];
        if (!target) return;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    // Registers
    const registerFilterSection = useCallback((key, node) => {
        if (!filterSectionRefs.current) return;
        if (node) {
            filterSectionRefs.current[key] = node;
        } else {
            delete filterSectionRefs.current[key];
        }
    }, []);
    const registerGalleryRail = useCallback((key, node) => {
        if (!galleryRailRefs.current) return;
        if (node) {
            galleryRailRefs.current[key] = node;
            requestAnimationFrame(() => checkScroll(key));
        } else delete galleryRailRefs.current[key];
    }, [checkScroll]);

    const scrollGallery = useCallback((key, direction) => {
        const rail = galleryRailRefs.current?.[key];
        if (!rail) return;
        const scrollAmount = rail.clientWidth * 0.8 || 240;
        rail.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }, []);

    const handleGalleryWheel = useCallback((event, key) => {
        const rail = galleryRailRefs.current?.[key];
        if (!rail) return;
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
        event.preventDefault();
        rail.scrollBy({ left: event.deltaY, behavior: 'auto' });
        checkScroll(key);
    }, [checkScroll]);

    // Resize → recalcular overflow
    useEffect(() => {
        const onResize = () => Object.keys(galleryRailRefs.current || {}).forEach((k) => checkScroll(k));
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [checkScroll]);

    // Estado al abrir
    useEffect(() => {
        if (!isOpen) return;
        setBrandsSel(uniqueStringList(currentFilters?.brand));
        setColorsSel(uniqueStringList(currentFilters?.color));
        setCollectionsSel(uniqueStringList(currentFilters?.collection));
        setTypesSel(uniqueStringList(currentFilters?.fabricType));
        setPatternsSel(uniqueStringList(currentFilters?.fabricPattern));
        setMartSel(uniqueStringList(currentFilters?.martindaleRanges));
        setUsageSel(uniqueStringList(currentFilters?.uso));
        setMaintenanceSel(uniqueStringList(currentFilters?.mantenimiento));
    }, [isOpen, currentFilters]);

    // Carga catálogo
    useEffect(() => {
        if (!isOpen) return;

        (async () => {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/filters`);
            if (!res.ok) return;

            const data = await res.json();

            const COLOR_ORDER = [
                'BLANCO', 'BEIGE', 'AMARILLO', 'NARANJA', 'ROSA', 'ROJO',
                'VIOLETA', 'MORADO', 'VERDE', 'AZUL', 'MARRON', 'GRIS', 'NEGRO'
            ];

            const localeSort = (list) =>
                list.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

            const brandsList = buildFilterList(data.brands, { allow: Object.keys(BRAND_NAMES) });
            setBrands(localeSort(brandsList));

            const collectionsList = buildFilterList(data.collections, { deny: COLEC_INVALIDAS });
            setCollections(localeSort(collectionsList));

            const fabricTypesList = buildFilterList(data.fabricTypes, { deny: TIPOS_INVALIDOS });
            setFabricTypes(localeSort(fabricTypesList));

            const patternsList = buildFilterList(data.fabricPatterns, { deny: DIBUJOS_INVALIDOS });
            setFabricPatterns(localeSort(patternsList));

            setMartindale(uniqueNumberList(data.martindaleValues).sort((a, b) => b - a));

            const allowedColorSet = new Set(ALLOWED_COLORS.map(toComparableKey));
            const orderIndex = (value) => {
                const idx = COLOR_ORDER.indexOf(toComparableKey(value));
                return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
            };

            const colorsList = buildFilterList(data.colors)
                .filter((color) => allowedColorSet.has(toComparableKey(color)))
                .sort((a, b) => {
                    const diff = orderIndex(a) - orderIndex(b);
                    if (diff !== 0) return diff;
                    return a.localeCompare(b, undefined, { sensitivity: 'base' });
                });
            setColors(colorsList);

            const usageList = buildFilterList(data.uso || data.usos || data.usage);
            setUsageOptions(localeSort(usageList));

            // ============================
            // ✅ MANTENIMIENTO: soportar XML troceado
            // ============================
            const maintenanceRaw =
                data.mantenimiento ||
                data.mantenimientos ||
                data.maintenance ||
                data.maintenances;

            const extractMaintenanceValues = (raw) => {
                // Caso 1: ya viene como array de strings “normales”
                if (Array.isArray(raw) && raw.every((x) => typeof x === 'string' && !x.includes('<Valor>'))) {
                    return raw;
                }

                // Caso 2: viene como array de trozos XML (tu caso)
                if (Array.isArray(raw) && raw.some((x) => typeof x === 'string' && x.includes('<Valor>'))) {
                    const xml = raw.join('');
                    const out = [];
                    const re = /<Valor>\s*([^<]+?)\s*</g; // captura texto entre <Valor> ... <
                    let m;
                    while ((m = re.exec(xml)) !== null) out.push(m[1]);
                    return out;
                }

                // Caso 3: viene como string XML completo
                if (typeof raw === 'string' && raw.includes('<Valor>')) {
                    const out = [];
                    const re = /<Valor>\s*([^<]+?)\s*</g;
                    let m;
                    while ((m = re.exec(raw)) !== null) out.push(m[1]);
                    return out;
                }

                // Caso 4: null/undefined/otro
                return [];
            };

            const maintenanceExtracted = extractMaintenanceValues(maintenanceRaw);

            const maintenanceList = buildFilterList(maintenanceExtracted);
            setMaintenanceOptions(localeSort(maintenanceList));
        })();
    }, [isOpen]);


    // Lock body scroll
    useEffect(() => {
        document.body.classList.toggle('overflow-hidden', isOpen);
        return () => document.body.classList.remove('overflow-hidden');
    }, [isOpen]);

    // Montaje
    useEffect(() => {
        isMountedRef.current = isOpen;
        if (!isOpen) setCategoryPreviewLoading({});
        return () => { isMountedRef.current = false; };
    }, [isOpen]);

    // ensureCategoryPreview
    const ensureCategoryPreview = useCallback(async cat => {
        if (!cat) return;
        const comparable = cat.comparableKey || toComparableKey(cat.key);
        if (!comparable) return;
        const cacheKey = `${cat.groupKey}-${comparable}`;
        if (categoryPreviewCacheRef.current[cacheKey]) {
            const cached = categoryPreviewCacheRef.current[cacheKey];
            setCategoryPreviews(prev => (prev[comparable] ? prev : { ...prev, [comparable]: cached }));
            setCategoryPreviewLoading(prev => {
                if (!prev[comparable]) return prev;
                const next = { ...prev };
                delete next[comparable];
                return next;
            });
            return;
        }
        setCategoryPreviewLoading(prev => ({ ...prev, [comparable]: true }));
        const data = await fetchCategoryPreview(cat.key, cat.groupKey);
        if (!isMountedRef.current) return;
        categoryPreviewCacheRef.current[cacheKey] = data;
        setCategoryPreviews(prev => ({ ...prev, [comparable]: data }));
        setCategoryPreviewLoading(prev => {
            const next = { ...prev };
            delete next[comparable];
            return next;
        });
    }, []);

    // Precarga tarjetas
    useEffect(() => {
        if (!isOpen) return;
        gallerySections.forEach(section => {
            section.items.forEach(cat => ensureCategoryPreview(cat));
        });
    }, [ensureCategoryPreview, gallerySections, isOpen]);

    // Helpers
    const toggle = useCallback((setFn, value) => {
        const cleaned = normalizeValue(value);
        if (!cleaned) return;
        const comparable = toComparableKey(cleaned);
        if (!comparable) return;
        setFn(prev => {
            const filtered = prev.filter(item => toComparableKey(item) !== comparable);
            if (filtered.length !== prev.length) {
                return filtered;
            }
            return [...filtered, cleaned];
        });
    }, []);

    const clearAll = useCallback(() => {
        setBrandsSel([]); setColorsSel([]); setCollectionsSel([]);
        setTypesSel([]); setPatternsSel([]); setMartSel([]);
        setUsageSel([]); setMaintenanceSel([]);
    }, []);

    const handleCategoryClick = useCallback((cat) => {
        switch (cat.target) {
            case 'fabricPattern': toggle(setPatternsSel, cat.key); break;
            case 'fabricType': toggle(setTypesSel, cat.key); break;
            case 'usage': toggle(setUsageSel, cat.key); break;
            case 'maintenance': toggle(setMaintenanceSel, cat.key); break;
            default: break;
        }
    }, [toggle]);

    const handleApply = useCallback(() => {
        const normalizedRanges = uniqueStringList(martSel);
        const numericMartindale = (() => {
            const collected = [];
            normalizedRanges.forEach(rangeKey => {
                const [minStr = '', maxStr = ''] = rangeKey.split('-');
                const min = Number.parseInt(minStr, 10);
                const max = maxStr.endsWith('+') ? Infinity : Number.parseInt(maxStr, 10);
                if (!Number.isFinite(min)) return;
                martindaleValues.forEach(value => {
                    if (!Number.isFinite(value)) return;
                    if (value >= min && value <= max) {
                        collected.push(value);
                    }
                });
            });
            return uniqueNumberList(collected);
        })();

        applyFilters({
            brand: uniqueStringList(brandsSel),
            color: uniqueStringList(colorsSel),
            collection: uniqueStringList(collectionsSel),
            fabricType: uniqueStringList(typesSel),
            fabricPattern: uniqueStringList(patternsSel),
            martindale: numericMartindale,
            martindaleRanges: normalizedRanges,
            uso: uniqueStringList(usageSel),
            mantenimiento: uniqueStringList(maintenanceSel),
        });
        setMarcaActiva(null);
        clearAll();
        close();
    }, [applyFilters, brandsSel, colorsSel, collectionsSel, typesSel, patternsSel, martSel, martindaleValues, usageSel, maintenanceSel, setMarcaActiva, clearAll, close]);

    // Chips seleccionados
    const selectedChips = useMemo(() => {
        const chips = [];
        const remove = (setter, val) => {
            const comparable = toComparableKey(val);
            setter(prev => prev.filter(item => toComparableKey(item) !== comparable));
        };
        brandsSel.forEach((v) => chips.push({ id: `brand-${v}`, label: BRAND_NAMES[v] || v, onRemove: () => remove(setBrandsSel, v) }));
        colorsSel.forEach((v) => chips.push({ id: `color-${v}`, label: t(`values.colors.${v}`, v), onRemove: () => remove(setColorsSel, v) }));
        collectionsSel.forEach((v) => chips.push({ id: `collection-${v}`, label: v, onRemove: () => remove(setCollectionsSel, v) }));
        typesSel.forEach((v) => chips.push({ id: `type-${v}`, label: t(`values.fabricTypes.${v}`, v), onRemove: () => remove(setTypesSel, v) }));
        patternsSel.forEach((v) => chips.push({ id: `pattern-${v}`, label: t(`values.patterns.${v}`, v), onRemove: () => remove(setPatternsSel, v) }));
        usageSel.forEach((v) => { const c = categoryMetaByKey.get(toComparableKey(v)); chips.push({ id: `usage-${v}`, label: c?.label || v, onRemove: () => remove(setUsageSel, v) }); });
        maintenanceSel.forEach((v) => { const c = categoryMetaByKey.get(toComparableKey(v)); chips.push({ id: `maintenance-${v}`, label: c?.label || v, onRemove: () => remove(setMaintenanceSel, v) }); });
        martSel.forEach((v) => chips.push({ id: `mart-${v}`, label: t(`martRanges.${v}`), onRemove: () => remove(setMartSel, v) }));
        return chips;
    }, [brandsSel, colorsSel, collectionsSel, typesSel, patternsSel, usageSel, maintenanceSel, martSel, categoryMetaByKey, t]);

    const totalSelected = useMemo(
        () => [brandsSel, colorsSel, collectionsSel, typesSel, patternsSel, martSel, usageSel, maintenanceSel].flat().length,
        [brandsSel, colorsSel, collectionsSel, typesSel, patternsSel, martSel, usageSel, maintenanceSel],
    );

    /* ==============================
       RECOMENDACIONES (Tendencias)
============================== */
    const recommendationPresets = useMemo(() => ([
        {
            id: 'japandiWarm',
            title: t('recommendations.items.japandiWarm.title'),
            description: t('recommendations.items.japandiWarm.description'),
            accent: 'from-white/80 via-[#f1f5f9]/60 to-white/20',
            selections: [
                { type: 'color', value: 'BEIGE' },
                { type: 'fabricPattern', value: 'LISO' },
                { type: 'martindaleRange', value: '0-20000' },
            ],
        },
        {
            id: 'coastalLinen',
            title: t('recommendations.items.coastalLinen.title'),
            description: t('recommendations.items.coastalLinen.description'),
            accent: 'from-[#dbeafe]/80 via-[#bfdbfe]/40 to-white/10',
            selections: [
                { type: 'color', value: 'AZUL' },
                { type: 'fabricPattern', value: 'LISO' },
                { type: 'usage', value: 'OUTDOOR' },
            ],
        },
        {
            id: 'velvetLuxe',
            title: t('recommendations.items.velvetLuxe.title'),
            description: t('recommendations.items.velvetLuxe.description'),
            accent: 'from-[#ede9fe]/70 via-[#ddd6fe]/40 to-white/10',
            selections: [
                { type: 'color', value: 'VIOLETA' },
                { type: 'fabricType', value: 'TERCIOPELO' },
                { type: 'martindaleRange', value: '50000-100000' },
            ],
        },
        {
            id: 'maximalistGeo',
            title: t('recommendations.items.maximalistGeo.title'),
            description: t('recommendations.items.maximalistGeo.description'),
            accent: 'from-[#fff7ed]/80 via-[#ffedd5]/50 to-white/10',
            selections: [
                { type: 'fabricPattern', value: 'GEOMETRICO' },
                { type: 'color', value: 'NARANJA' },
                { type: 'martindaleRange', value: '20000-50000' },
            ],
        },
        {
            id: 'earthyTerracotta',
            title: t('recommendations.items.earthyTerracotta.title'),
            description: t('recommendations.items.earthyTerracotta.description'),
            accent: 'from-[#fef3c7]/80 via-[#fde68a]/40 to-white/10',
            selections: [
                { type: 'color', value: 'MARRON' },
                { type: 'fabricPattern', value: 'LISO' },
                { type: 'martindaleRange', value: '20000-50000' },
            ],
        },
        {
            id: 'monoCharcoal',
            title: t('recommendations.items.monoCharcoal.title'),
            description: t('recommendations.items.monoCharcoal.description'),
            accent: 'from-[#e5e7eb]/80 via-white/40 to-white/10',
            selections: [
                { type: 'color', value: 'GRIS' },
                { type: 'color', value: 'NEGRO' },
                { type: 'fabricPattern', value: 'LISO' },
            ],
        },
        {
            id: 'greigeMinimal',
            title: t('recommendations.items.greigeMinimal.title'),
            description: t('recommendations.items.greigeMinimal.description'),
            accent: 'from-white/70 via-[#f8fafc]/50 to-white/10',
            selections: [
                { type: 'color', value: 'BEIGE' },
                { type: 'color', value: 'GRIS' },
                { type: 'fabricPattern', value: 'LISO' },
            ],
        },
        {
            id: 'cozyNeutrals',
            title: t('recommendations.items.cozyNeutrals.title'),
            description: t('recommendations.items.cozyNeutrals.description'),
            accent: 'from-white/70 via-white/40 to-white/20',
            selections: [
                { type: 'color', value: 'BEIGE' },
                { type: 'fabricPattern', value: 'LISO' },
                { type: 'fabricType', value: 'TERCIOPELO' },
            ],
        },
        {
            id: 'statementSpaces',
            title: t('recommendations.items.statementSpaces.title'),
            description: t('recommendations.items.statementSpaces.description'),
            accent: 'from-[#dbeafe]/80 via-[#bfdbfe]/40 to-white/10',
            selections: [
                { type: 'color', value: 'AZUL' },
                { type: 'fabricPattern', value: 'GEOMETRICO' },
                { type: 'usage', value: 'OUTDOOR' },
            ],
        },
        {
            id: 'easyCare',
            title: t('recommendations.items.easyCare.title'),
            description: t('recommendations.items.easyCare.description'),
            accent: 'from-[#e0f2fe]/80 via-white/50 to-white/20',
            selections: [
                { type: 'maintenance', value: 'EASYCLEAN' },
                { type: 'martindaleRange', value: '50000-100000' },
                { type: 'color', value: 'GRIS' }
            ]
        }
    ]), [t]);

    // ¿Preset activo?
    const isPresetActive = useCallback((preset) => {
        return preset.selections.every((sel) => {
            switch (sel.type) {
                case 'color': return colorsSel.includes(sel.value);
                case 'fabricPattern': return patternsSel.includes(sel.value);
                case 'fabricType': return typesSel.includes(sel.value);
                case 'usage': return usageSel.includes(sel.value);
                case 'maintenance': return maintenanceSel.includes(sel.value);
                case 'martindaleRange': return martSel.includes(sel.value);
                default: return false;
            }
        });
    }, [colorsSel, patternsSel, typesSel, usageSel, maintenanceSel, martSel]);

    const applyRecommendation = useCallback((preset) => {
        const next = {
            brands: [],
            collections: [],
            colors: [],
            types: [],
            patterns: [],
            usage: [],
            maintenance: [],
            martindaleRanges: [],
        };

        const addUnique = (bucket, value) => {
            const cleaned = normalizeValue(value);
            if (!cleaned) return;
            const comparable = toComparableKey(cleaned);
            if (!comparable) return;
            if (bucket.some(item => toComparableKey(item) === comparable)) return;
            bucket.push(cleaned);
        };

        preset.selections.forEach((sel) => {
            switch (sel.type) {
                case 'brand':
                    addUnique(next.brands, sel.value);
                    break;
                case 'collection':
                    addUnique(next.collections, sel.value);
                    break;
                case 'color':
                    addUnique(next.colors, sel.value);
                    break;
                case 'fabricType':
                    addUnique(next.types, sel.value);
                    break;
                case 'fabricPattern':
                    addUnique(next.patterns, sel.value);
                    break;
                case 'usage':
                    addUnique(next.usage, sel.value);
                    break;
                case 'maintenance':
                    addUnique(next.maintenance, sel.value);
                    break;
                case 'martindaleRange':
                    addUnique(next.martindaleRanges, sel.value);
                    break;
                default:
                    break;
            }
        });

        setBrandsSel(next.brands);
        setCollectionsSel(next.collections);
        setColorsSel(next.colors);
        setTypesSel(next.types);
        setPatternsSel(next.patterns);
        setUsageSel(next.usage);
        setMaintenanceSel(next.maintenance);
        setMartSel(next.martindaleRanges);
    }, []);

    const getRecommendationLabels = useCallback((preset) => (
        preset.selections
            .map(sel => {
                switch (sel.type) {
                    case 'color':
                        return t(`values.colors.${sel.value}`, sel.value);
                    case 'fabricPattern':
                        return t(`values.patterns.${sel.value}`, sel.value);
                    case 'fabricType':
                        return t(`values.fabricTypes.${sel.value}`, sel.value);
                    case 'usage':
                    case 'maintenance': {
                        const cat = categoryMetaByKey.get(toComparableKey(sel.value));
                        return cat?.label || sel.value;
                    }
                    case 'martindaleRange':
                        return t(`martRanges.${sel.value}`);
                    default:
                        return sel.value;
                }
            })
            .filter(Boolean)
    ), [categoryMetaByKey, t]);

    // UI helpers
    const renderSearchInput = (placeholder, value, onChange) => (
        <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full min-h-[40px] rounded-2xl border border-white/70 bg-white/70 pl-10 pr-3 py-2.5 text-sm text-slate-700 shadow-inner shadow-white/60 focus:border-[#1E3A8A]/40 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/40"
            />
        </div>
    );

    const renderCategoryCard = cat => {
        const comparable = cat.comparableKey || toComparableKey(cat.key);
        const isSelected = (() => {
            switch (cat.target) {
                case 'fabricPattern':
                    return patternsSel.some(item => toComparableKey(item) === comparable);
                case 'fabricType':
                    return typesSel.some(item => toComparableKey(item) === comparable);
                case 'usage':
                    return usageSel.some(item => toComparableKey(item) === comparable);
                case 'maintenance':
                    return maintenanceSel.some(item => toComparableKey(item) === comparable);
                default:
                    return false;
            }
        })();
        const preview = categoryPreviews[comparable];
        const isLoading = Boolean(categoryPreviewLoading[comparable]);
        const imageUrl = preview?.imageUrl;
        const label = cat.label || cat.key;
        const handlePress = () => { ensureCategoryPreview(cat); handleCategoryClick(cat); };

        return (
            <button
                key={cat.key}
                type="button"
                onClick={handlePress}
                onMouseEnter={() => ensureCategoryPreview(cat)}
                onFocus={() => ensureCategoryPreview(cat)}
                onTouchStart={() => ensureCategoryPreview(cat)}
                className="group relative w-[160px] sm:w-[200px] shrink-0 snap-start text-left transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
                aria-pressed={isSelected}
                aria-label={label}
            >
                <div
                    className={`relative h-44 sm:h-52 overflow-hidden rounded-2xl sm:rounded-[28px] border transition-all duration-300 ${isSelected
                        ? 'border-[#1E3A8A] shadow-[0_20px_45px_rgba(30,58,138,0.28)] sm:shadow-[0_25px_60px_rgba(30,58,138,0.35)] scale-[1.01] sm:scale-[1.02]'
                        : 'border-white/60 bg-white/50 group-hover:border-[#1E3A8A]/40 group-hover:scale-[1.01] sm:group-hover:scale-[1.02]'
                        }`}
                >
                    {imageUrl ? (
                        <img src={cdnUrl(imageUrl)} alt={label} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#0f172a]/10 via-white to-[#60a5fa]/15 px-4 text-center">
                            {isLoading ? <FaSpinner className="animate-spin text-xl text-[#1F4F8D]/70" /> : <span className="text-xs font-medium text-slate-500">{t('categoryCard.empty')}</span>}
                        </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900/60" />
                    {isSelected && (
                        <>
                            <span className="pointer-events-none absolute right-3 top-3 sm:right-4 sm:top-4 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white text-[#1E3A8A] shadow-lg shadow-slate-900/25">
                                <FaCheck />
                            </span>
                            <span className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-[28px] border-4 border-[#1E3A8A]/70" />
                        </>
                    )}
                    <div className="pointer-events-none absolute inset-x-4 sm:inset-x-5 bottom-4 sm:bottom-5 flex items-center justify-between text-white">
                        <span className="text-[13px] sm:text-sm font-semibold drop-shadow-md truncate">{label}</span>
                    </div>
                </div>
            </button>
        );
    };

    const renderColorSwatch = (color, size = 'md') => {
        const comparable = toComparableKey(color);
        const selected = colorsSel.some(item => toComparableKey(item) === comparable);
        const sizeClasses = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-9 w-9' : 'h-10 w-10';
        return (
            <button
                key={color}
                type="button"
                onClick={() => toggle(setColorsSel, color)}
                style={buildColorStyle(color)}
                className={`relative flex flex-shrink-0 items-center justify-center rounded-full shadow-inner shadow-white/40 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1E3A8A] ${sizeClasses} ${selected ? 'ring-4 ring-[#1E3A8A]/80 scale-105' : 'hover:scale-110'}`}
                aria-pressed={selected}
                aria-label={t(`values.colors.${color}`, color)}
                title={t(`values.colors.${color}`, color)}
            >
                <span className="sr-only">{t(`values.colors.${color}`, color)}</span>
                {selected && <span className="h-3 w-3 rounded-full bg-white" />}
            </button>
        );
    };

    // Agrupar colecciones por letra
    const groupByLetter = (arr) => {
        const map = new Map();
        (arr || []).forEach((name) => {
            const letter = (name?.[0] || '#').toUpperCase();
            const key = /[A-ZÁÉÍÓÚÑ]/.test(letter) ? letter : '#';
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(name);
        });
        const selectedSet = new Set(collectionsSel);
        map.forEach((list) => {
            list.sort((a, b) => {
                const sa = selectedSet.has(a), sb = selectedSet.has(b);
                if (sa !== sb) return sa ? -1 : 1;
                return a.localeCompare(b);
            });
        });
        return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    };

    const highlightMatch = (text, q) => {
        if (!q) return text;
        const i = text.toLowerCase().indexOf(q.toLowerCase());
        if (i === -1) return text;
        return (<>{text.slice(0, i)}<mark className="rounded px-0.5 bg-yellow-200/70">{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>);
    };

    // Early return seguro: después de TODOS los hooks
    //   - no se renderiza nada si no está abierto o no es pantalla grande
    if (!isOpen || !isLarge) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-40">
                <button type="button" onClick={close} aria-label={t('aria.closePanel')} className="absolute inset-0 h-full w-full bg-slate-950/60 backdrop-blur-2xl" />
            </div>

            {/* Contenedor */}
            <div className="fixed inset-0 z-50 flex flex-col">
                <div className="flex-1 overflow-hidden px-2 sm:px-6 py-2 sm:py-6">
                    <div role="dialog" aria-modal="true" aria-labelledby="filter-panel-title" className="relative mx-auto flex h-full w-full max-w-[1600px] flex-col overflow-hidden rounded-[18px] sm:rounded-[24px] bg-white/80 shadow-[0_25px_90px_rgba(15,23,42,0.35)] ring-1 ring-white/60 backdrop-blur-2xl">

                        {/* Header mejorado */}
                        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100 px-2 py-0.5 text-[11px] font-semibold">
                                            <FaMagic className="opacity-80" /> {t('hero.badge', 'Filtro inteligente')}
                                        </span>
                                        <span className="hidden sm:inline-block text-[11px] text-slate-500">{t('hero.tagline', 'Tu panel creativo a pantalla completa')}</span>
                                    </div>
                                    <h2 id="filter-panel-title" className="mt-1 truncate text-lg sm:text-2xl font-semibold text-slate-900">
                                        {t('title')} <span className="ml-2 align-middle rounded-full bg-slate-900/90 text-white text-[11px] px-2 py-0.5">{t('selectedCount', { count: totalSelected })}</span>
                                    </h2>
                                    <p className="mt-1 text-[11px] text-slate-500">{t('hero.support', 'Afina colecciones, colores y usos con una estética serena y resultados inmediatos.')}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={clearAll} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-[12px] sm:text-[13px] font-semibold text-slate-600 shadow-sm hover:-translate-y-0.5 transition">
                                        <FaTrashAlt className="text-xs" />
                                        {t('clearAll')}
                                    </button>
                                    <button onClick={close} aria-label={t('aria.closePanel')} className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/30 hover:scale-105 transition">
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>

                            {/* Chips de selección actuales */}
                            {selectedChips.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedChips.map((chip) => (
                                        <span key={chip.id} className="group inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[12px] text-slate-700 ring-1 ring-white/70 shadow-sm">
                                            {chip.label}
                                            <button onClick={chip.onRemove} aria-label={`Quitar ${chip.label}`} className="text-slate-400 hover:text-slate-700">
                                                <FaTimes className="text-[10px]" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <span className="pointer-events-none mt-2 block h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
                        </header>

                        {/* Layout */}
                        <main className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1.72fr)_360px]">
                            {/* IZQUIERDA */}
                            <section className="min-h-0 overflow-hidden border-b border-white/70 bg-white/50 lg:border-b-0 lg:border-r">
                                <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[72px_minmax(0,1fr)]">
                                    {/* Rail colores */}
                                    <div className="relative hidden lg:block">
                                        <div className="sticky top-0 flex h-full max-h-[calc(100vh-160px)] flex-col items-center gap-3 overflow-y-auto border-r border-white/70 bg-white/60 px-3 pt-4 pb-28 sm:pb-36">
                                            <button type="button" onClick={() => setColorsSel([])} className="mb-2 h-9 w-9 rounded-full border border-slate-300 bg-white text-[10px] font-semibold text-slate-500" title={t('colorRail.clear', 'Limpiar')}>×</button>
                                            {colors.map((c) => renderColorSwatch(c))}
                                        </div>
                                    </div>

                                    {/* Contenido desplazable */}
                                    <div className="min-h-0 overflow-y-auto px-4 pt-4 pb-28 sm:px-10 sm:pt-8 sm:pb-36">
                                        {/* Paleta móvil (no se muestra en desktop-only, pero no molesta) */}
                                        {colors.length > 0 && (
                                            <div className="mb-6 lg:hidden">
                                                <p className="text-xs font-semibold text-slate-600 sm:uppercase sm:tracking-[0.35em]">{t('colorRail.title')}</p>
                                                <p className="mt-1 text-[11px] text-slate-500">{t('colorRail.subtitle')}</p>
                                                <div className="mt-3 flex flex-wrap gap-3">{colors.map((c) => renderColorSwatch(c))}</div>
                                            </div>
                                        )}

                                        {/* Galería */}
                                        <div className="space-y-8">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-slate-500">{t('categoryGallery.title')}</p>
                                                <p className="mt-1 text-sm text-slate-500">{t('categoryGallery.helper')}</p>
                                            </div>

                                            {gallerySections.map((section) => {
                                                const state = galleryScrollState[section.groupKey] || {};
                                                return (
                                                    <div key={section.groupKey} className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-slate-500">{section.label}</p>
                                                            <span className="hidden items-center gap-1 text-[11px] text-slate-400 sm:flex">
                                                                <FaChevronRight className="text-[10px]" />
                                                                {t('categoryGallery.scrollHint')}
                                                            </span>
                                                        </div>
                                                        <div className="relative px-1 sm:px-0">
                                                            {state.canScroll && (
                                                                <>
                                                                    <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 sm:block" />
                                                                    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-10 sm:block" />
                                                                </>
                                                            )}
                                                            <div
                                                                ref={(n) => registerGalleryRail(section.groupKey, n)}
                                                                onWheel={(e) => handleGalleryWheel(e, section.groupKey)}
                                                                onScroll={() => checkScroll(section.groupKey)}
                                                                className="flex snap-x gap-4 overflow-x-auto pb-1 pr-2 scroll-smooth"
                                                            >
                                                                {section.items.map(renderCategoryCard)}
                                                            </div>
                                                            {state.canScroll && (
                                                                <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between lg:flex">
                                                                    <div className="pointer-events-auto -ml-6">
                                                                        {state.showLeft && (
                                                                            <button type="button" onClick={() => scrollGallery(section.groupKey, -1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md ring-1 ring-white/70 transition hover:bg-white" aria-label={t('categoryGallery.navPrev')}>
                                                                                <FaChevronLeft />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <div className="pointer-events-auto -mr-6">
                                                                        {state.showRight && (
                                                                            <button type="button" onClick={() => scrollGallery(section.groupKey, 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md ring-1 ring-white/70 transition hover:bg-white" aria-label={t('categoryGallery.navNext')}>
                                                                                <FaChevronRight />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* RECOMENDACIONES */}
                                            <div className="mt-8 rounded-[24px] sm:rounded-[28px] border border-white/70 bg-white/85 p-4 sm:p-5 shadow-sm shadow-slate-900/10">
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                    <div>
                                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.35em] text-slate-500">{t('recommendations.title')}</p>
                                                        <p className="mt-1 text-sm text-slate-500">{t('recommendations.subtitle')}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
                                                    {recommendationPresets.map((preset) => {
                                                        const labels = getRecommendationLabels(preset);
                                                        const active = isPresetActive(preset);
                                                        return (
                                                            <button
                                                                key={preset.id}
                                                                type="button"
                                                                onClick={() => applyRecommendation(preset)}
                                                                aria-pressed={active}
                                                                className={`group relative overflow-hidden rounded-2xl border p-4 text-left shadow-sm transition hover:shadow-md ${active
                                                                    ? 'border-blue-500 ring-2 ring-blue-300/60 bg-white'
                                                                    : 'border-white/70 bg-white/80'
                                                                    }`}
                                                            >
                                                                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${preset.accent}`} />
                                                                <div className="relative">
                                                                    <div className="flex items-start justify-between gap-2">
                                                                        <div>
                                                                            <p className="text-sm font-semibold text-slate-800">{preset.title}</p>
                                                                            <p className="mt-1 text-xs text-slate-500">{preset.description}</p>
                                                                        </div>
                                                                        {active && (
                                                                            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-600 text-white shadow">
                                                                                <FaCheck />
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {labels.length > 0 && (
                                                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                                                            {labels.map((lab, idx) => (
                                                                                <span key={`${preset.id}-${idx}`} className={`rounded-full px-2 py-1 text-[11px] font-medium ring-1 ${active ? 'bg-blue-50 text-blue-700 ring-blue-200' : 'bg-white/80 text-slate-600 ring-white/70'}`}>
                                                                                    {lab}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            {/* /RECOMENDACIONES */}
                                        </div>

                                        <div className="h-6" />
                                    </div>
                                </div>
                            </section>

                            {/* DERECHA — FILTROS */}
                            <aside ref={asideRef} className="min-h-0 overflow-y-auto bg-white/40 px-3 sm:px-6 pt-4 pb-28 sm:pt-6 sm:pb-36">
                                {/* Quick nav */}
                                {quickNavItems.length > 0 && (
                                    <div className="mb-4 hidden sm:block">
                                        <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                                            <FaListUl className="text-slate-400" />
                                            {t('quicknav.title')}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {quickNavItems.map((item) => (
                                                <button key={item.key} type="button" onClick={() => handleQuickNav(item.key)} className="rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:-translate-y-0.5 transition">
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Contenedor con gap para separar tarjetas */}
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    {/* Secciones (marcas, colecciones, tipos) */}
                                    {[
                                        { key: 'marcas', label: t('categories.brands'), search: null, items: brands, sel: brandsSel, setSel: setBrandsSel, translator: (v) => BRAND_NAMES[v] || v },
                                        { key: 'colecciones', label: t('categories.collections'), search: { value: collSearch, placeholder: t('placeholders.searchcolecciones'), setter: setCollSearch }, items: collections, sel: collectionsSel, setSel: setCollectionsSel },
                                        { key: 'tipos', label: t('categories.fabricTypes'), search: { value: typeSearch, placeholder: t('placeholders.searchtipos'), setter: setTypeSearch }, items: fabricTypes, sel: typesSel, setSel: setTypesSel, translator: (k) => t(`values.fabricTypes.${k}`, k) },
                                    ].map((section) => {
                                        if (section.key === 'colecciones') {
                                            const base = section.items || [];
                                            const filtered = base.filter((name) =>
                                                collectionsOnlySelected ? collectionsSel.includes(name) :
                                                    collSearch ? name.toLowerCase().includes(collSearch.toLowerCase()) : true
                                            );
                                            const grouped = groupByLetter(filtered);

                                            const selectAll = () => {
                                                if (!filtered.length) return;
                                                const set = new Set(collectionsSel);
                                                filtered.forEach((n) => set.add(n));
                                                section.setSel([...set]);
                                            };
                                            const clearSelected = () => section.setSel([]);

                                            return (
                                                <div key={section.key} ref={(node) => registerFilterSection(section.key, node)} className="scroll-mt-28 rounded-[24px] sm:rounded-[28px] border border-white/70 bg-gradient-to-b from-white/90 to-slate-50/80 shadow-sm shadow-slate-900/10 backdrop-blur-md">
                                                    <button onClick={() => setOpenSections((prev) => ({ ...prev, [section.key]: !prev[section.key] }))} className="flex w-full items-center justify-between px-4 sm:px-5 py-3 sm:py-4">
                                                        <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-slate-600">
                                                            <FaListUl className="text-blue-500/70" />
                                                            {section.label}
                                                            {collectionsSel.length > 0 && (<span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">{collectionsSel.length}</span>)}
                                                        </span>
                                                        {openSections[section.key] ? <FaChevronUp className="text-slate-500" /> : <FaChevronDown className="text-slate-500" />}
                                                    </button>

                                                    {openSections[section.key] && (
                                                        <div className="space-y-3 px-4 pb-4 sm:space-y-4 sm:px-5 sm:pb-5">
                                                            {/* Toolbar sticky */}
                                                            <div className="sticky top-0 z-10 -mx-4 sm:-mx-5 px-4 sm:px-5 py-3 bg-white/90 backdrop-blur border-y border-white/70">
                                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                                    <div className="basis-full md:basis-auto grow min-w-[220px]">
                                                                        {renderSearchInput(section.search.placeholder, section.search.value, (e) => section.search.setter(e.target.value))}
                                                                    </div>
                                                                    <label className="inline-flex items-center gap-2 text-[12px] text-slate-600 shrink-0">
                                                                        <input type="checkbox" checked={collectionsOnlySelected} onChange={(e) => setCollectionsOnlySelected(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#1E3A8A] focus:ring-[#1E3A8A]" />
                                                                        {t('filters.onlySelected', 'Solo seleccionadas')}
                                                                    </label>
                                                                    <div className="ml-auto flex gap-2 shrink-0">
                                                                        <button onClick={selectAll} className="rounded-full bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 shadow">{t('actions.selectAll', 'Seleccionar todo')}</button>
                                                                        <button onClick={clearSelected} className="rounded-full bg-white text-slate-700 ring-1 ring-slate-200 text-xs font-semibold px-3 py-1.5">{t('actions.clear', 'Limpiar')}</button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Lista agrupada */}
                                                            <div className="max-h-80 sm:max-h-96 overflow-y-auto pr-1 pt-6 rounded-[14px]">
                                                                {grouped.length === 0 && (<p className="px-1 py-6 text-sm text-slate-500">{t('empty.noResults', 'Sin resultados.')}</p>)}
                                                                {grouped.map(([letter, names]) => (
                                                                    <div key={letter} className="mb-2">
                                                                        <div className="sticky top-0 z-[1] col-span-full">
                                                                            <span className="inline-flex items-center rounded-full bg-white/90 ring-1 ring-slate-200 px-2 py-0.5 text-[11px] font-semibold tracking-widest text-slate-500 backdrop-blur-sm">{letter}</span>
                                                                        </div>

                                                                        <ul className="grid grid-cols-1 md:grid-cols-2 auto-rows-min gap-x-4">
                                                                            {names.map((name) => {
                                                                                const checked = collectionsSel.includes(name);
                                                                                return (
                                                                                    <li key={name} className="col-span-1">
                                                                                        <label className="flex items-start gap-3 px-1 py-2 rounded-xl transition hover:bg-white/70 focus-within:ring-2 focus-within:ring-blue-200">
                                                                                            <input type="checkbox" checked={checked} onChange={() => toggle(section.setSel, name)} className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1E3A8A] focus:ring-[#1E3A8A] shrink-0" />
                                                                                            <span className={`text-sm leading-snug whitespace-normal break-words ${checked ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{highlightMatch(name, collSearch)}</span>
                                                                                        </label>
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        // Resto de secciones (chips)
                                        return (
                                            <div key={section.key} ref={(node) => registerFilterSection(section.key, node)} className="scroll-mt-28 rounded-[24px] sm:rounded-[28px] border border-white/70 bg-gradient-to-b from-white/90 to-slate-50/80 shadow-sm shadow-slate-900/10 backdrop-blur-md">
                                                <button onClick={() => setOpenSections((prev) => ({ ...prev, [section.key]: !prev[section.key] }))} className="flex w-full items-center justify-between px-4 sm:px-5 py-3 sm:py-4">
                                                    <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-slate-600">
                                                        <FaListUl className="text-blue-500/70" />
                                                        {section.label}
                                                        {section.sel.length > 0 && (<span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">{section.sel.length}</span>)}
                                                    </span>
                                                    {openSections[section.key] ? <FaChevronUp className="text-slate-500" /> : <FaChevronDown className="text-slate-500" />}
                                                </button>

                                                {openSections[section.key] && (
                                                    <div className="space-y-3 px-4 pb-4 sm:space-y-4 sm:px-5 sm:pb-5">
                                                        {section.search && renderSearchInput(section.search.placeholder, section.search.value, (e) => section.search.setter(e.target.value))}
                                                        <div className="flex flex-wrap gap-2">
                                                            {section.items
                                                                .filter((it) => (section.search ? it.toLowerCase().includes(section.search.value.toLowerCase()) : true))
                                                                .map((it) => {
                                                                    const active = section.sel.includes(it);
                                                                    return (
                                                                        <button
                                                                            key={it}
                                                                            type="button"
                                                                            onClick={() => toggle(section.setSel, it)}
                                                                            className={`rounded-full px-3 py-2 text-[12px] font-medium transition-all ring-1 ${active ? 'bg-blue-600 text-white ring-blue-400/50 shadow-sm shadow-blue-200' : 'bg-white text-slate-700 hover:bg-slate-100 ring-white/70'}`}
                                                                        >
                                                                            {section.translator ? section.translator(it) : it}
                                                                        </button>
                                                                    );
                                                                })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Martindale */}
                                    <div className="scroll-mt-28 rounded-[24px] sm:rounded-[28px] border border-white/70 bg-gradient-to-b from-white/90 to-slate-50/80 shadow-sm shadow-slate-900/10 backdrop-blur-md" ref={(node) => registerFilterSection('martindale', node)}>
                                        <button onClick={() => setOpenSections((p) => ({ ...p, martindale: !p.martindale }))} className="flex w-full items-center justify-between px-4 sm:px-5 py-3 sm:py-4">
                                            <span className="text-sm font-semibold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-slate-600">{t('categories.martindale')}</span>
                                            {openSections.martindale ? <FaChevronUp className="text-slate-500" /> : <FaChevronDown className="text-slate-500" />}
                                        </button>

                                        {openSections.martindale && (
                                            <div className="grid gap-2 sm:gap-3 px-4 sm:px-5 pb-4 sm:pb-5">
                                                {MARTINDALE_RANGES.map((range) => {
                                                    const selected = martSel.includes(range.key);
                                                    return (
                                                        <button
                                                            key={range.key}
                                                            onClick={() => toggle(setMartSel, range.key)}
                                                            className={`text-start rounded-2xl border px-4 py-2.5 sm:py-3 transition ${selected ? 'bg-[#1E3A8A] text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-700 hover:border-[#1E3A8A]/50'}`}
                                                        >
                                                            {t(`martRanges.${range.key}`)}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </aside>
                        </main>

                        {/* Footer */}
                        <footer className="sticky bottom-0 z-20 bg-white/90 backdrop-blur-sm border-t border-white/60">
                            <div
                                className="mx-auto w-full max-w-[1600px] px-3 sm:px-6"
                                style={{
                                    paddingTop: '12px',
                                    paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
                                }}
                            >
                                <button
                                    onClick={handleApply}
                                    aria-label={t('apply')}
                                    className="w-full min-h-[48px] rounded-2xl
                   bg-gradient-to-r from-[#1F4F8D] via-[#2563eb] to-[#60a5fa]
                   py-3 text-base font-semibold text-white
                   ring-1 ring-white/20
                   shadow-md hover:shadow-lg
                   hover:-translate-y-[1px] active:translate-y-0
                   transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563eb]"
                                >
                                    {t('apply')}
                                </button>
                            </div>
                        </footer>

                    </div>
                </div>
            </div>
        </>
    );
}
