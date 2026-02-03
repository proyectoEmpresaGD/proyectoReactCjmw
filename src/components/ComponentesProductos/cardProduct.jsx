import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useCart } from '../CartContext';
import Modal from './modal';
import Filtro from '../../app/products/buttonFiltro';
import SubMenuCarousel from './SubMenuCarousel';
import CryptoJS from 'crypto-js';
import { useTranslation } from 'react-i18next';
import { cdnUrl } from '../../Constants/cdn';
import { secretKey, itemsPerPage, defaultImageUrl, apiUrl } from '../../Constants/constants';
import {
    Compass,
    Filter,
    Layers,
    Search,
    Tag,
    Wrench,
    Type,
    LayoutGrid,
    List,
    ArrowDownAZ,
    ArrowUpAZ,
} from "lucide-react";


const LazyImage = ({ src, alt, className }) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                obs.disconnect();
            }
        }, { threshold: 0.1 });

        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className="w-full h-full bg-gray-100">
            {visible && (
                <img
                    src={src}
                    alt={alt}
                    className={className}
                    onError={(e) => { e.currentTarget.src = defaultImageUrl; }}
                />
            )}
        </div>
    );
};

const asBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        return ['true', '1', 'yes', 'si', 'sí'].includes(normalized);
    }
    return false;
};

const extractNumber = (value) => {
    if (value == null) return null;
    const sanitized = String(value)
        .replace(/[^0-9,.-]/g, '')
        .replace(/,(?=\d{3}(?:\D|$))/g, '')
        .replace(',', '.');
    const num = Number(sanitized);
    return Number.isFinite(num) ? num : null;
};

const formatPrice = (value, currencyHint) => {
    if (!Number.isFinite(value)) return null;

    if (typeof currencyHint === 'string') {
        const trimmed = currencyHint.trim();
        if (/^[A-Za-z]{3}$/.test(trimmed)) {
            try {
                return new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: trimmed.toUpperCase(),
                }).format(value);
            } catch {
                // fallback
            }
        }
        if (trimmed.length > 0 && trimmed.length <= 2) {
            return `${trimmed} ${value.toLocaleString()}`;
        }
    }

    try {
        return new Intl.NumberFormat(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
    } catch {
        return value.toString();
    }
};

/* ──────────────────────────────────────────────────────────────────────────────
   NAVIDAD: Prefijos y descuento por defecto (DESACTIVADO)
   ────────────────────────────────────────────────────────────────────────────── */
// const STATIC_SALE_PREFIXES = ['ADELFAS', 'GENESIS'];
// const HOLIDAY_DEFAULT_DISCOUNT = 30; // 30%

const resolveSaleInfo = (product = {}) => {
    const normalizedName = (product.nombre || '')
        .trim()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toUpperCase();

    /* NAVIDAD OFF: detección por prefijo desactivada */
    // const nameIsStaticSale = STATIC_SALE_PREFIXES.some((prefix) =>
    //     normalizedName.startsWith(prefix)
    // );
    const nameIsStaticSale = false;

    const saleFlags = [
        product.enOferta,
        product.oferta,
        product.esOferta,
        product.esoferta,
        product.isOnSale,
        product.en_promocion,
        product.promocion,
        product.promo,
    ];

    const rawSalePrice =
        product.precioOferta ??
        product.precio_oferta ??
        product.precioPromocion ??
        product.precio_promocion ??
        product.salePrice ??
        product.priceOffer ??
        product.offerPrice ??
        null;

    const rawOriginalPrice =
        product.precioOriginal ??
        product.precio_original ??
        product.precio ??
        product.precioVenta ??
        product.price ??
        product.precioLista ??
        null;

    const rawDiscount =
        product.descuento ??
        product.discount ??
        product.porcentajeDescuento ??
        product.porcentaje_descuento ??
        product.offPercent ??
        product.discountPercent ??
        null;

    const salePriceNumber = extractNumber(rawSalePrice);
    const originalPriceNumber = extractNumber(rawOriginalPrice);
    const explicitDiscount = extractNumber(rawDiscount);

    let derivedDiscount = Number.isFinite(explicitDiscount)
        ? Math.round(explicitDiscount)
        : null;

    if (
        derivedDiscount == null &&
        Number.isFinite(salePriceNumber) &&
        Number.isFinite(originalPriceNumber) &&
        originalPriceNumber > 0
    ) {
        const computed = Math.round((1 - salePriceNumber / originalPriceNumber) * 100);
        if (Number.isFinite(computed) && computed > 0) {
            derivedDiscount = computed;
        }
    }

    /* NAVIDAD OFF: si es estático y sin descuento, antes forzábamos 30% */
    // if (nameIsStaticSale && derivedDiscount == null) {
    //     derivedDiscount = HOLIDAY_DEFAULT_DISCOUNT;
    // }

    const currencyHint =
        product.moneda ||
        product.currency ||
        product.simboloMoneda ||
        product.currencySymbol ||
        null;

    const salePrice = Number.isFinite(salePriceNumber)
        ? formatPrice(salePriceNumber, currencyHint)
        : rawSalePrice != null
            ? String(rawSalePrice)
            : null;

    const originalPrice = Number.isFinite(originalPriceNumber)
        ? formatPrice(originalPriceNumber, currencyHint)
        : rawOriginalPrice != null
            ? String(rawOriginalPrice)
            : null;

    const isOnSale =
        /* NAVIDAD OFF: quitamos el OR con nameIsStaticSale */
        // nameIsStaticSale ||
        saleFlags.some(asBoolean) ||
        Boolean(derivedDiscount) ||
        Boolean(salePrice);

    return {
        isOnSale,
        /* NAVIDAD OFF: esta marca queda siempre false */
        isLiquidation: false,
        discount: Number.isFinite(derivedDiscount) ? derivedDiscount : null,
        salePrice,
        originalPrice,
    };
};

const CONTEXT_TOKEN_KEYS = [
    'search',
    'brand',
    'collection',
    'fabricType',
    'fabricPattern',
    'uso',
    'mantenimiento',
    'type',
];
const TOKEN_ORDER = [
    'search',
    'brand',
    'collection',
    'fabricType',
    'fabricPattern',
    'uso',
    'mantenimiento',
    'type',
];

export default function CardProduct() {
    const { t } = useTranslation('cardProduct');
    const { addToCart } = useCart(); // si lo usas en el modal
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const containerRef = useRef(null);
    const sentinelRef = useRef(null);
    const observerRef = useRef(null);
    const controllerRef = useRef(null);

    // Hash params
    const getHashParams = () => {
        const hash = window.location.hash;
        const i = hash.indexOf('?');
        if (i === -1) return new URLSearchParams();
        return new URLSearchParams(hash.slice(i + 1));
    };
    const hashParams = getHashParams();

    // URL params
    const searchQuery = params.get('search');
    const pidEnc = params.get('pid');
    const productId = params.get('productId');
    const fabricPattern = params.get('fabricPattern');
    const uso = params.get('uso') || hashParams.get('uso');
    const brand = params.get('brand') || hashParams.get('brand');
    const fabricType = params.get('fabricType') || hashParams.get('fabricType');
    const collection = params.get('collection');
    const typeParam = params.get('type');
    const mantenimiento = params.get('mantenimiento');

    /* NAVIDAD OFF: parámetro de URL desactivado */
    // const isHolidayParam = params.get('holiday') === '1';

    const decryptedPid = pidEnc
        ? CryptoJS.AES.decrypt(pidEnc, secretKey).toString(CryptoJS.enc.Utf8)
        : null;
    const fetchByIdParam = decryptedPid || productId;

    // State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [filters, setFilters] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);

    // UI
    const [searchInput, setSearchInput] = useState('');
    const [sortOrder, setSortOrder] = useState('alpha-asc');
    const [viewMode, setViewMode] = useState('grid4');

    /* NAVIDAD OFF: estado y sync eliminados */
    // const [showOnlyHoliday, setShowOnlyHoliday] = useState(isHolidayParam);

    // sync page from URL
    useEffect(() => {
        const p = parseInt(params.get('page') || '1', 10);
        if (p !== page) setPage(p);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    /* NAVIDAD OFF: sync del flag */
    // useEffect(() => {
    //     setShowOnlyHoliday(isHolidayParam);
    // }, [isHolidayParam]);

    useEffect(() => {
        setSearchInput(searchQuery || '');
    }, [searchQuery]);

    useEffect(() => {
        setActiveCategory(uso || fabricType || fabricPattern || mantenimiento || null);
    }, [uso, fabricType, fabricPattern, mantenimiento]);

    const getArray = (key) => {
        const seen = new Set();
        const values = params
            .getAll(key)
            .map((value) => (value == null ? '' : value.trim()))
            .filter(Boolean)
            .filter((value) => {
                const normalized = value
                    .normalize('NFD')
                    .replace(/\p{Diacritic}/gu, '')
                    .toUpperCase();
                if (seen.has(normalized)) return false;
                seen.add(normalized);
                return true;
            });
        return values;
    };

    const buildAppliedFilters = () => {
        const ap = {};
        const brands = getArray('brand');
        const colors = getArray('color');
        const collections = getArray('collection');
        const fabricTypes = getArray('fabricType');
        const patterns = getArray('fabricPattern');
        const martindales = getArray('martindale')
            .map((value) => Number(value))
            .filter(Number.isFinite);
        const martindaleRanges = getArray('martindaleRange');
        const usos = getArray('uso');
        const mantenimientos = getArray('mantenimiento');

        if (brands.length) ap.brand = brands;
        if (colors.length) ap.color = colors;
        if (collections.length) ap.collection = collections;
        if (fabricTypes.length) ap.fabricType = fabricTypes;
        if (patterns.length) ap.fabricPattern = patterns;
        if (martindales.length) ap.martindale = martindales;
        if (martindaleRanges.length) ap.martindaleRanges = martindaleRanges;
        if (usos.length) ap.uso = usos;
        if (mantenimientos.length) ap.mantenimiento = mantenimientos;
        if (searchQuery) ap.search = searchQuery;
        if (typeParam === 'papel') ap.fabricType = ['WALLPAPER', 'PAPEL PINTADO'];

        return ap;
    };

    // imágenes (para rutas normales)
    const loadLowRes = async (prod) => {
        try {
            const low = await fetch(
                `${apiUrl}/api/images/${prod.codprodu}/PRODUCTO_BAJA`
            ).then((r) => (r.ok ? r.json() : null));
            return {
                ...prod,
                imageBaja: cdnUrl(low ? `${low.ficadjunto}` : defaultImageUrl),
            };
        } catch {
            return { ...prod, imageBaja: defaultImageUrl };
        }
    };

    const preloadHighResInto = async (prod) => {
        try {
            const hi = await fetch(
                `${apiUrl}/api/images/${prod.codprodu}/PRODUCTO_BUENA`
            ).then((r) => (r.ok ? r.json() : null));
            if (hi) {
                setSelectedProduct((prev) =>
                    prev && prev.codprodu === prod.codprodu
                        ? { ...prev, imageBuena: cdnUrl(`${hi.ficadjunto}`) }
                        : prev
                );
            }
        } catch {
            // silent
        }
    };

    /* ──────────────────────────────────────────────────────────────────────────
       NAVIDAD: fetch de productos especiales (DESACTIVADO)
       ────────────────────────────────────────────────────────────────────────── */
    // const fetchHolidayProducts = useCallback(async (pageNum = 1) => { ... }, []);

    // fetch normal de productos
    const fetchProducts = useCallback(async (pageNum = 1, appliedFilters = {}) => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        setError(null);

        try {
            let data;
            let list;

            // Search
            if (appliedFilters.search && String(appliedFilters.search).trim()) {
                const u = new URL(`${apiUrl}/api/products/search-products`);
                u.searchParams.set('query', String(appliedFilters.search).trim());
                u.searchParams.set('limit', itemsPerPage);
                u.searchParams.set('page', pageNum);

                let resp = await fetch(u, { signal: controller.signal });
                if (!resp.ok) {
                    const legacy = new URL(`${apiUrl}/api/products/search`);
                    legacy.searchParams.set('query', String(appliedFilters.search).trim());
                    legacy.searchParams.set('limit', itemsPerPage);
                    legacy.searchParams.set('page', pageNum);
                    resp = await fetch(legacy, { signal: controller.signal });
                }
                if (!resp.ok) throw new Error('Error searching');
                data = await resp.json();
                list = data.products || [];
            } else {
                const hasFilters =
                    Object.keys(appliedFilters).length > 0 &&
                    Object.entries(appliedFilters).some(
                        ([k, v]) =>
                            k !== 'search' &&
                            (Array.isArray(v) ? v.length > 0 : Boolean(v))
                    );

                if (hasFilters) {
                    const resp = await fetch(
                        `${apiUrl}/api/products/filter?page=${pageNum}&limit=${itemsPerPage}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(appliedFilters),
                            signal: controller.signal,
                        }
                    );
                    if (!resp.ok) throw new Error('Error filtering');
                    data = await resp.json();
                    list = data.products || [];
                } else {
                    const resp = await fetch(
                        `${apiUrl}/api/products?limit=${itemsPerPage}&page=${pageNum}`,
                        { signal: controller.signal }
                    );
                    if (!resp.ok) throw new Error('Error fetching');
                    data = await resp.json();
                    list = data.products || data;
                }
            }

            const wi = await Promise.all((list || []).map(loadLowRes));

            if (pageNum === 1 && wi.length === 0) {
                setProducts([]);
                setTotalProducts(0);
                setHasMore(false);
                try {
                    observerRef.current?.disconnect();
                    observerRef.current = null;
                } catch {
                    //
                }
                return;
            }

            setProducts((prev) => (pageNum > 1 ? [...prev, ...wi] : wi));

            const totalFromApi =
                data?.pagination?.totalResults ??
                data?.total ??
                data?.pagination?.totalValidResults ??
                null;

            const hasNextFromApi =
                typeof data?.pagination?.hasNextPage === 'boolean'
                    ? data.pagination.hasNextPage
                    : undefined;

            if (totalFromApi !== null && Number.isFinite(totalFromApi)) {
                setTotalProducts(totalFromApi);
                const computedHasMore =
                    typeof hasNextFromApi === 'boolean'
                        ? hasNextFromApi
                        : pageNum * itemsPerPage < totalFromApi;
                setHasMore(computedHasMore);
                if (!computedHasMore) {
                    try {
                        observerRef.current?.disconnect();
                        observerRef.current = null;
                    } catch {
                        //
                    }
                }
            } else {
                const maybeMore = wi.length === itemsPerPage;
                setHasMore(maybeMore);
                const fallbackTotal =
                    (pageNum - 1) * itemsPerPage + wi.length + (maybeMore ? 1 : 0);
                setTotalProducts(fallbackTotal);
                if (!maybeMore) {
                    try {
                        observerRef.current?.disconnect();
                        observerRef.current = null;
                    } catch {
                        //
                    }
                }
            }
        } catch (err) {
            if (err.name !== 'AbortError') setError(err.message);
            setHasMore(false);
            try {
                observerRef.current?.disconnect();
                observerRef.current = null;
            } catch {
                //
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // fetch por id (modal)
    const fetchById = useCallback(async (id) => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        setError(null);
        try {
            const r = await fetch(`${apiUrl}/api/products/${id}`, {
                signal: controller.signal,
            });
            if (!r.ok) throw new Error('Error fetching by ID');
            const prod = await r.json();
            const low = await loadLowRes(prod);
            setSelectedProduct(low);
            setModalOpen(true);
            preloadHighResInto(low);
        } catch (err) {
            if (err.name !== 'AbortError') setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // efecto principal según URL
    useEffect(() => {
        try {
            observerRef.current?.disconnect();
            observerRef.current = null;
        } catch {
            //
        }

        if (fetchByIdParam) {
            fetchById(fetchByIdParam);
        } else {
            const p = parseInt(params.get('page') || '1', 10);

            /* NAVIDAD OFF: siempre tiramos del fetch normal */
            // if (isHolidayParam) {
            //     fetchHolidayProducts(p);
            // } else {
            //     const ap = buildAppliedFilters();
            //     fetchProducts(p, ap);
            // }
            const ap = buildAppliedFilters();
            fetchProducts(p, ap);
        }
        return () => controllerRef.current?.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, fetchByIdParam /* , isHolidayParam */]);

    // filtros desde <Filtro> (acepta total opcional)
    const handleFilteredProducts = (prods, selFilters, total) => {
        try {
            observerRef.current?.disconnect();
            observerRef.current = null;
        } catch {
            //
        }
        const safe = Array.isArray(prods) ? prods : [];
        const normalizedTotal = Number.isFinite(total) ? total : safe.length;

        setProducts(safe);
        setFilters(selFilters);
        setPage(1);

        /* NAVIDAD OFF: no forzamos estado del holiday */
        // setShowOnlyHoliday(false);

        if (normalizedTotal === 0) {
            setTotalProducts(0);
            setHasMore(false);
            const u = new URLSearchParams();
            u.set('page', '1');
            navigate(`/products?${u.toString()}`);
            try {
                window.scrollTo({ top: 0, behavior: 'auto' });
            } catch {
                //
            }
            return;
        }

        setTotalProducts(
            normalizedTotal > itemsPerPage && safe.length >= itemsPerPage
                ? itemsPerPage + 1
                : normalizedTotal
        );
        setHasMore(normalizedTotal > itemsPerPage && safe.length >= itemsPerPage);

        const u = new URLSearchParams();
        u.set('page', '1');
        navigate(`/products?${u.toString()}`);
        try {
            window.scrollTo({ top: 0, behavior: 'auto' });
        } catch {
            //
        }
    };

    // buscador con debounce
    const debouncedNavigateSearch = useRef(
        debounce((val) => {
            const u = new URLSearchParams();
            if (val && val.trim().length >= 3) {
                u.set('search', val.trim());
            }
            u.set('page', '1');
            navigate(`/products?${u.toString()}`);
        }, 400)
    ).current;

    const onChangeSearchInput = (e) => {
        const val = e.target.value;
        setSearchInput(val);
        debouncedNavigateSearch(val);
    };

    const onKeyDownSearchInput = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            debouncedNavigateSearch.cancel();
            const val = (searchInput || '').trim();
            const u = new URLSearchParams();
            if (val && val.length >= 3) {
                u.set('search', val);
            }
            u.set('page', '1');
            navigate(`/products?${u.toString()}`);
        }
    };

    // cargar más
    const loadMore = () => {
        if (loading || !hasMore) return;
        const nxt = page + 1;
        setPage(nxt);
        const u = new URLSearchParams(location.search);
        u.set('page', nxt.toString());
        navigate(`/products?${u.toString()}`);
    };

    // observer: solo si realmente hay más
    useEffect(() => {
        if (observerRef.current) {
            try {
                observerRef.current.disconnect();
            } catch {
                //
            }
            observerRef.current = null;
        }

        if (!(hasMore && !loading)) return;

        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMore) loadMore();
            },
            { root: null, rootMargin: '600px', threshold: 0 }
        );

        const el = sentinelRef.current;
        if (el) obs.observe(el);
        observerRef.current = obs;

        return () => {
            try {
                obs.disconnect();
            } catch {
                //
            }
            observerRef.current = null;
        };
    }, [hasMore, loading, page, location.search]);

    // dedup
    const uniqueProducts = products.filter(
        (p, i, arr) => arr.findIndex((x) => x.codprodu === p.codprodu) === i
    );

    // ✅ info de oferta (sin lógica de navidad)
    const productsWithSaleInfo = useMemo(
        () =>
            uniqueProducts.map((p) => ({
                ...p,
                _saleInfo: resolveSaleInfo(p),
            })),
        [uniqueProducts]
    );

    // filtrado visible
    const normalizeSearch = (value) =>
        (value || '')
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .toLowerCase()
            .trim();

    const tokenizeSearch = (value) =>
        normalizeSearch(value)
            .split(/\s+/)
            .filter(Boolean);

    // filtrado visible (por tokens en nombre/tonalidad)
    let displayed = productsWithSaleInfo.filter((p) => {
        const tokens = tokenizeSearch(searchInput);
        if (tokens.length === 0) return true;
        const name = normalizeSearch(p.nombre);
        const tone = normalizeSearch(p.tonalidad);
        return tokens.every((token) => name.includes(token) || tone.includes(token));
    });

    /* NAVIDAD OFF: filtro “ver solo navidad” */
    // if (showOnlyHoliday) {
    //     displayed = displayed.filter((p) => p._saleInfo.isLiquidation);
    // }

    displayed.sort((a, b) => {
        if (sortOrder === 'alpha-asc') return (a.nombre || '').localeCompare(b.nombre || '');
        if (sortOrder === 'alpha-desc') return (b.nombre || '').localeCompare(a.nombre || '');
        return 0;
    });

    useEffect(() => {
        if (!searchInput.trim() && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [searchInput]);

    const filterLabelMap = useMemo(
        () => ({
            brand: t('filters.brand', 'Marca'),
            color: t('filters.color', 'Color'),
            collection: t('filters.collection', 'Colección'),
            fabricType: t('filters.fabricType', 'Tipo de tejido'),
            fabricPattern: t('filters.fabricPattern', 'Diseño'),
            martindale: t('filters.martindale', 'Martindale'),
            martindaleRange: t('filters.martindaleRange', 'Resistencia'),
            uso: t('filters.usage', 'Uso'),
            mantenimiento: t('filters.maintenance', 'Mantenimiento'),
            search: t('filters.search', 'Búsqueda'),
            type: t('filters.type', 'Tipo'),
        }),
        [t]
    );

    const translateSummaryTitle = useCallback(
        (key, options, fallbackFactory) => {
            const translation = t(key, options ?? {});
            if (translation && translation !== key) {
                return translation;
            }
            if (typeof fallbackFactory === 'function') {
                return fallbackFactory();
            }
            return fallbackFactory;
        },
        [t]
    );

    const chipEntries = useMemo(() => {
        const entries = [];
        const currentParams = new URLSearchParams(location.search);

        const pushEntries = (key, values) => {
            values.forEach((value) => {
                if (value != null && String(value).trim()) {
                    entries.push({ key, value: String(value).trim() });
                }
            });
        };

        pushEntries('brand', currentParams.getAll('brand'));
        pushEntries('color', currentParams.getAll('color'));
        pushEntries('collection', currentParams.getAll('collection'));
        pushEntries('fabricType', currentParams.getAll('fabricType'));
        pushEntries('fabricPattern', currentParams.getAll('fabricPattern'));
        pushEntries('martindale', currentParams.getAll('martindale'));
        pushEntries('martindaleRange', currentParams.getAll('martindaleRange'));
        pushEntries('uso', currentParams.getAll('uso'));
        pushEntries('mantenimiento', currentParams.getAll('mantenimiento'));

        const searchTerm = currentParams.get('search');
        if (searchTerm) entries.push({ key: 'search', value: searchTerm });

        const typeValue = currentParams.get('type');
        if (typeValue) entries.push({ key: 'type', value: typeValue });

        return entries;
    }, [location.search]);

    const handleRemoveFilter = (key, value) => {
        const updated = new URLSearchParams(location.search);
        if (key === 'search') {
            updated.delete('search');
        } else {
            const values = updated.getAll(key).filter((v) => v !== value);
            updated.delete(key);
            values.forEach((v) => updated.append(key, v));
        }
        updated.set('page', '1');
        navigate(`/products?${updated.toString()}`);
    };

    const handleClearFilters = () => {
        const cleared = new URLSearchParams();
        cleared.set('page', '1');
        navigate(`/products?${cleared.toString()}`);

        /* NAVIDAD OFF */
        // setShowOnlyHoliday(false);
    };

    const contextSummary = useMemo(() => {
        const trimmedSearch = (searchQuery || '').trim();
        if (trimmedSearch) {
            return {
                badge: t('summary.badge.search', 'Búsqueda activa'),
                title: translateSummaryTitle(
                    'summary.title.search',
                    { value: trimmedSearch },
                    () => `${filterLabelMap.search}: "${trimmedSearch}"`
                ),
                description: t(
                    'summary.description.search',
                    'Puedes ajustar filtros para afinar la búsqueda.'
                ),
                icon: 'search',
            };
        }

        const [brandValue] = getArray('brand');
        if (brandValue) {
            return {
                badge: t('summary.badge.brand', 'Marca seleccionada'),
                title: translateSummaryTitle(
                    'summary.title.brand',
                    { value: brandValue },
                    () => `${filterLabelMap.brand}: ${brandValue}`
                ),
                description: t(
                    'summary.description.brand',
                    'Combina esta marca con otros filtros para encontrar la pieza ideal.'
                ),
                icon: 'brand',
            };
        }

        const [collectionValue] = getArray('collection');
        if (collectionValue) {
            return {
                badge: t('summary.badge.collection', 'Colección activa'),
                title: translateSummaryTitle(
                    'summary.title.collection',
                    { value: collectionValue },
                    () => `${filterLabelMap.collection}: ${collectionValue}`
                ),
                description: t(
                    'summary.description.collection',
                    'Explora otras categorías para complementar esta colección.'
                ),
                icon: 'collection',
            };
        }

        const [typeValue] = getArray('fabricType');
        if (typeValue) {
            return {
                badge: t('summary.badge.fabricType', 'Tipo destacado'),
                title: translateSummaryTitle(
                    'summary.title.fabricType',
                    { value: typeValue },
                    () => `${filterLabelMap.fabricType}: ${typeValue}`
                ),
                description: t(
                    'summary.description.fabricType',
                    'Filtra por color o colección para perfilar la búsqueda.'
                ),
                icon: 'fabricType',
            };
        }

        const [patternValue] = getArray('fabricPattern');
        if (patternValue) {
            return {
                badge: t('summary.badge.fabricPattern', 'Diseño elegido'),
                title: translateSummaryTitle(
                    'summary.title.fabricPattern',
                    { value: patternValue },
                    () => `${filterLabelMap.fabricPattern}: ${patternValue}`
                ),
                description: t(
                    'summary.description.fabricPattern',
                    'Añade colores o colecciones para descubrir combinaciones nuevas.'
                ),
                icon: 'fabricPattern',
            };
        }

        const [usageValue] = getArray('uso');
        if (usageValue) {
            return {
                badge: t('summary.badge.usage', 'Uso seleccionado'),
                title: translateSummaryTitle(
                    'summary.title.usage',
                    { value: usageValue },
                    () => `${filterLabelMap.uso}: ${usageValue}`
                ),
                description: t(
                    'summary.description.usage',
                    'Suma filtros de material o mantenimiento para asegurar la elección.'
                ),
                icon: 'usage',
            };
        }

        const [maintenanceValue] = getArray('mantenimiento');
        if (maintenanceValue) {
            return {
                badge: t('summary.badge.maintenance', 'Cuidado preferido'),
                title: translateSummaryTitle(
                    'summary.title.maintenance',
                    { value: maintenanceValue },
                    () => `${filterLabelMap.mantenimiento}: ${maintenanceValue}`
                ),
                description: t(
                    'summary.description.maintenance',
                    'Añade tipo de tejido o color para reducir aún más los resultados.'
                ),
                icon: 'maintenance',
            };
        }

        if (typeParam) {
            return {
                badge: t('summary.badge.type', 'Tipo activo'),
                title: translateSummaryTitle(
                    'summary.title.type',
                    { value: typeParam },
                    () => `${filterLabelMap.type}: ${typeParam}`
                ),
                description: t(
                    'summary.description.type',
                    'Combina este tipo con filtros de diseño o uso para obtener mejores coincidencias.'
                ),
                icon: 'type',
            };
        }

        if (chipEntries.length > 0) {
            return {
                badge: t('summary.badge.filtered', 'Filtros aplicados'),
                title: t('summary.title.filtered', 'Vista personalizada'),
                description: t(
                    'summary.description.filtered',
                    'Revisa y quita etiquetas para ampliar tu búsqueda.'
                ),
                icon: 'filtered',
            };
        }

        return {
            badge: t('summary.badge.catalog', 'Catálogo activo'),
            title: t('summary.title.catalog', 'Explorando toda la colección'),
            description: t(
                'summary.description.catalog',
                'Selecciona una categoría o usa los filtros para comenzar.'
            ),
            icon: 'catalog',
        };
    }, [
        t,
        searchQuery,
        chipEntries.length,
        typeParam,
        getArray,
        filterLabelMap,
        translateSummaryTitle,
    ]);

    const contextTokens = useMemo(() => {
        const grouped = new Map();
        chipEntries.forEach(({ key, value }) => {
            if (!CONTEXT_TOKEN_KEYS.includes(key)) return;
            const trimmed = String(value).trim();
            if (!trimmed) return;
            if (!grouped.has(key)) grouped.set(key, new Set());
            grouped.get(key).add(trimmed);
        });
        const tokens = Array.from(grouped.entries()).map(([key, valuesSet]) => ({
            key,
            label: filterLabelMap[key] || key,
            values: Array.from(valuesSet),
        }));
        tokens.sort(
            (a, b) => TOKEN_ORDER.indexOf(a.key) - TOKEN_ORDER.indexOf(b.key)
        );
        return tokens;
    }, [chipEntries, filterLabelMap]);

    const detailFilterGroups = useMemo(() => {
        const grouped = new Map();
        chipEntries.forEach(({ key, value }) => {
            if (CONTEXT_TOKEN_KEYS.includes(key)) return;
            const trimmed = String(value).trim();
            if (!trimmed) return;
            if (!grouped.has(key)) grouped.set(key, new Set());
            grouped.get(key).add(trimmed);
        });

        return Array.from(grouped.entries())
            .map(([key, valuesSet]) => ({
                key,
                label: filterLabelMap[key] || key,
                values: Array.from(valuesSet),
            }))
            .sort((a, b) => (a.label || '').localeCompare(b.label || ''));
    }, [chipEntries, filterLabelMap]);

    const formatTokenValue = useCallback((key, value) => {
        if (key === 'search') {
            return `“${value}”`;
        }
        return value;
    }, []);

    const contextIconFor = useCallback((name) => {
        switch (name) {
            case 'search':
                return <Search className="h-6 w-6" aria-hidden="true" />;
            case 'brand':
                return <Tag className="h-6 w-6" aria-hidden="true" />;
            case 'collection':
                return <Layers className="h-6 w-6" aria-hidden="true" />;
            case 'fabricType':
                return <Type className="h-6 w-6" aria-hidden="true" />;
            case 'fabricPattern':
                return <LayoutGrid className="h-6 w-6" aria-hidden="true" />;
            case 'usage':
                return <Compass className="h-6 w-6" aria-hidden="true" />;
            case 'maintenance':
                return <Wrench className="h-6 w-6" aria-hidden="true" />;
            case 'type':
            case 'filtered':
                return <Filter className="h-6 w-6" aria-hidden="true" />;
            default:
                return <Layers className="h-6 w-6" aria-hidden="true" />;
        }
    }, []);


    const tokenIconFor = useCallback((key) => {
        switch (key) {
            case 'brand':
                return <Tag className="h-4 w-4" aria-hidden="true" />;
            case 'collection':
                return <Layers className="h-4 w-4" aria-hidden="true" />;
            case 'fabricType':
                return <Type className="h-4 w-4" aria-hidden="true" />;
            case 'fabricPattern':
                return <LayoutGrid className="h-4 w-4" aria-hidden="true" />;
            case 'uso':
                return <Compass className="h-4 w-4" aria-hidden="true" />;
            case 'mantenimiento':
                return <Wrench className="h-4 w-4" aria-hidden="true" />;
            case 'search':
                return <Search className="h-4 w-4" aria-hidden="true" />;
            case 'type':
            default:
                return <Filter className="h-4 w-4" aria-hidden="true" />;
        }
    }, []);


    const isListView = viewMode === 'grid2';

    // 🔧 Ajuste de grid para que en móvil se vean 2 columnas y en desktop se mantenga la rejilla densa
    const gridClassName = isListView
        ? 'grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
        : 'grid grid-cols-2 auto-rows-fr gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';

    const baseCardContainerClass =
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#26659E]/40 hover:shadow-lg';
    const cardContainerClass = isListView
        ? `${baseCardContainerClass} md:flex-row`
        : baseCardContainerClass;

    // 🔧 Ajuste de aspect ratio para que en pantallas medianas/grandes las tarjetas sean más cuadradas
    const cardImageWrapperClass = isListView
        ? 'relative w-full overflow-hidden aspect-[4/3] focus:outline-none md:w-60 md:flex-shrink-0 md:aspect-[3/4]'
        : 'relative w-full overflow-hidden aspect-[3/4] md:aspect-square lg:aspect-[4/3] focus:outline-none';

    const cardBodyClass = isListView
        ? 'flex flex-1 flex-col gap-3 px-6 pb-6 pt-5'
        : 'flex flex-1 flex-col gap-2 px-4 pb-4 pt-3';
    const metaPillClass = isListView
        ? 'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs'
        : 'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.7rem]';
    const saleStackClass = isListView
        ? 'flex flex-wrap items-center gap-2 text-xs font-semibold text-rose-600 sm:text-sm'
        : 'flex flex-wrap items-center gap-1.5 text-[0.7rem] font-semibold text-rose-600';

    /* NAVIDAD OFF: resumen y botón de banner */
    // const holidaySummary = useMemo(() => { ... }, [productsWithSaleInfo]);
    // const handleToggleHolidayFilter = () => { ... };

    const hasContextDetails =
        chipEntries.length > 0 ||
        !!(searchQuery || '').trim() ||
        !!typeParam;

    return (
        <div className="relative px-4 pb-16 pt-10 lg:px-10" ref={containerRef}>
            <div className="relative mx-auto max-w-7xl space-y-6">
                {/* Filtros globales */}
                <Filtro setFilteredProducts={handleFilteredProducts} page={page} />

                {/* Submenú categorías */}
                <SubMenuCarousel
                    onFilterClick={(sel) => {
                        try {
                            observerRef.current?.disconnect();
                            observerRef.current = null;
                        } catch {
                            //
                        }

                        setFilters({});
                        setPage(1);

                        /* NAVIDAD OFF */
                        // setShowOnlyHoliday(false);

                        // reconstruye la query desde cero
                        const u = new URLSearchParams();
                        u.set('page', '1');

                        if (!sel) {
                            navigate(`/products?${u.toString()}`);
                            return;
                        }

                        const { key, groupKey } =
                            typeof sel === 'string'
                                ? { key: sel, groupKey: 'patterns' }
                                : sel;

                        switch (groupKey) {
                            case 'types': // TIPOS → fabricType
                                u.set('fabricType', key);
                                break;
                            case 'patterns': // DIBUJOS → fabricPattern
                                u.set('fabricPattern', key);
                                break;
                            case 'usage': // USO → uso
                                u.set('uso', key);
                                break;
                            case 'maintenance': // MANTENIMIENTO → mantenimiento
                                u.set('mantenimiento', key);
                                break;
                            default:
                                // fallback conservador
                                u.set('fabricPattern', key);
                                break;
                        }

                        navigate(`/products?${u.toString()}`);
                    }}
                    type={typeParam}
                    activeCategory={activeCategory}
                />

                {/* Resumen contextual (compacto cuando no hay filtros) */}
                {hasContextDetails ? (
                    <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur lg:p-10">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#26659E]/10 text-[#26659E]">
                                        {contextIconFor(contextSummary.icon)}
                                    </div>
                                    <div className="space-y-2 lg:max-w-2xl">
                                        <span className="inline-flex text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                                            {contextSummary.badge}
                                        </span>
                                        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                                            {contextSummary.title}
                                        </h1>
                                        <p className="text-sm text-slate-500 sm:text-base">
                                            {contextSummary.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-start">
                                    {chipEntries.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={handleClearFilters}
                                            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[#26659E] hover:text-[#26659E]"
                                        >
                                            <span className="text-base leading-none">×</span>
                                            {t('clearFilters', 'Quitar filtros')}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                            {t('summary.tokensTitle', 'Tu selección principal')}
                                        </span>
                                        {contextTokens.length > 0 && (
                                            <span className="text-xs text-slate-400">
                                                {t(
                                                    'summary.tokenHelper',
                                                    'Pulsa una etiqueta para quitarla.'
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    {contextTokens.length > 0 ? (
                                        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                            {contextTokens.map((token) => (
                                                <div
                                                    key={token.key}
                                                    className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm transition hover:border-[#26659E]/70 hover:shadow-md"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#26659E] shadow-sm">
                                                            {tokenIconFor(token.key)}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                                                {token.label}
                                                            </p>
                                                            <p className="text-sm font-semibold text-slate-700">
                                                                {token.values.length === 1
                                                                    ? formatTokenValue(
                                                                        token.key,
                                                                        token.values[0]
                                                                    )
                                                                    : t(
                                                                        'summary.multipleValues',
                                                                        {
                                                                            count: token.values.length,
                                                                            defaultValue:
                                                                                '{{count}} valores seleccionados',
                                                                        }
                                                                    )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                                        {token.values.map((value) => (
                                                            <button
                                                                key={`${token.key}-${value}`}
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveFilter(
                                                                        token.key,
                                                                        value
                                                                    )
                                                                }
                                                                className="group inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-[#26659E] hover:text-white"
                                                            >
                                                                <span>
                                                                    {formatTokenValue(
                                                                        token.key,
                                                                        value
                                                                    )}
                                                                </span>
                                                                <span
                                                                    aria-hidden="true"
                                                                    className="text-base leading-none"
                                                                >
                                                                    ×
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-500">
                                            {t(
                                                'summary.tokensEmpty',
                                                'Aún no eliges filtros principales.'
                                            )}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                                            {t('summary.detailsTitle', 'Filtros detallados')}
                                        </span>
                                        {detailFilterGroups.length > 0 && (
                                            <span className="text-xs text-slate-400">
                                                {t(
                                                    'summary.detailsHelper',
                                                    'Pulsa una etiqueta para quitarla.'
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    {detailFilterGroups.length > 0 ? (
                                        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                            {detailFilterGroups.map((group) => (
                                                <div
                                                    key={group.key}
                                                    className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
                                                >
                                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                                                        {group.label}
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                        {group.values.map((value) => (
                                                            <button
                                                                key={`${group.key}-${value}`}
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveFilter(
                                                                        group.key,
                                                                        value
                                                                    )
                                                                }
                                                                className="group inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-[#26659E] hover:bg-white hover:text-[#26659E]"
                                                            >
                                                                <span>{value}</span>
                                                                <span
                                                                    aria-hidden="true"
                                                                    className="text-base leading-none"
                                                                >
                                                                    ×
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-white/80 p-4 text-sm text-slate-500">
                                            {t(
                                                'summary.detailsEmpty',
                                                'No hay filtros adicionales aplicados.'
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-3xl border border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur lg:px-6 lg:py-5">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#26659E]/10 text-[#26659E]">
                                {contextIconFor(contextSummary.icon)}
                            </div>
                            <div className="space-y-1">
                                <span className="inline-flex text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                                    {contextSummary.badge}
                                </span>
                                <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                                    {contextSummary.title}
                                </h1>
                                <p className="text-xs text-slate-500 sm:text-sm">
                                    {contextSummary.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* search + sort + view */}
                <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={onChangeSearchInput}
                            onKeyDown={onKeyDownSearchInput}
                            placeholder={t(
                                'searchPlaceholder',
                                'Busca por nombre, color o colección...'
                            )}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 transition focus:border-[#26659E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#26659E]/20"
                        />
                        <svg
                            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
                            />
                        </svg>
                        {searchInput && searchInput.length < 3 && (
                            <div className="absolute left-3 top-full mt-1 text-xs text-slate-400">
                                {t(
                                    'minChars',
                                    'Escribe al menos 3 caracteres para buscar'
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-3 md:w-auto md:justify-end">
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-600">
                            <span className="hidden pl-1 font-medium text-slate-700 sm:inline">
                                {t('sortBy', 'Ordenar')}:
                            </span>
                            <button
                                type="button"
                                onClick={() => setSortOrder('alpha-asc')}
                                aria-pressed={sortOrder === 'alpha-asc'}
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition ${sortOrder === 'alpha-asc'
                                    ? 'bg-[#26659E] text-white shadow-sm'
                                    : 'hover:bg-white hover:text-[#26659E]'
                                    }`}
                            >
                                <ArrowDownAZ aria-hidden="true" />
                                <span className="hidden sm:inline">
                                    {t('sortAsc', 'A → Z')}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSortOrder('alpha-desc')}
                                aria-pressed={sortOrder === 'alpha-desc'}
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition ${sortOrder === 'alpha-desc'
                                    ? 'bg-[#26659E] text-white shadow-sm'
                                    : 'hover:bg-white hover:text-[#26659E]'
                                    }`}
                            >
                                <ArrowUpAZ aria-hidden="true" />
                                <span className="hidden sm:inline">
                                    {t('sortDesc', 'Z → A')}
                                </span>
                            </button>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-600">
                            <span className="hidden pl-1 font-medium text-slate-700 sm:inline">
                                {t('viewMode', 'Vista')}:
                            </span>
                            <button
                                type="button"
                                onClick={() => setViewMode('grid4')}
                                aria-pressed={viewMode === 'grid4'}
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition ${viewMode === 'grid4'
                                    ? 'bg-[#26659E] text-white shadow-sm'
                                    : 'hover:bg-white hover:text-[#26659E]'
                                    }`}
                            >
                                <LayoutGrid aria-hidden="true" />
                                <span className="hidden sm:inline">
                                    {t('gridView', 'Cuadrícula')}
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('grid2')}
                                aria-pressed={viewMode === 'grid2'}
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition ${viewMode === 'grid2'
                                    ? 'bg-[#26659E] text-white shadow-sm'
                                    : 'hover:bg-white hover:text-[#26659E]'
                                    }`}
                            >
                                <List aria-hidden="true" />
                                <span className="hidden sm:inline">
                                    {t('listView', 'Listado')}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* NAVIDAD OFF: banner de “Especial Navidad” */}
                {/* {holidaySummary.count > 0 && (
                    <button ...> ... </button>
                )} */}

                {/* grid */}
                <div className={gridClassName}>
                    {displayed.map((p, i) => {
                        const saleInfo = p._saleInfo;
                        /* NAVIDAD OFF */
                        const isChristmas = false;

                        return (
                            <div key={`${p.codprodu}-${i}`} className={cardContainerClass}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedProduct(p);
                                        setModalOpen(true);
                                        preloadHighResInto(p);
                                    }}
                                    className={cardImageWrapperClass}
                                >
                                    <LazyImage
                                        src={p.imageBaja || defaultImageUrl}
                                        alt={p.nombre}
                                        className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                                    />
                                    {saleInfo.isOnSale && (
                                        <span
                                            className={`pointer-events-none absolute left-3 top-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm ${isChristmas
                                                ? 'bg-emerald-600'
                                                : 'bg-rose-600'
                                                }`}
                                        >
                                            {/* NAVIDAD OFF */}
                                            {/* {isChristmas ? t('sale.christmasBadge','Especial Navidad') : ... } */}
                                            {saleInfo.discount != null
                                                ? t('sale.discountBadge', {
                                                    discount: saleInfo.discount,
                                                    defaultValue: `-${saleInfo.discount}%`,
                                                })
                                                : t('sale.badge', 'En oferta')}
                                        </span>
                                    )}
                                    <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />
                                    <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-full bg-white/90 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-[#26659E] opacity-0 shadow-sm transition duration-300 group-hover:opacity-100">
                                        {t('touchToView', 'Toca para ver')}
                                    </div>
                                </button>
                                <div className={cardBodyClass}>
                                    {p.coleccion && (
                                        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#26659E]/80">
                                            {p.coleccion}
                                        </span>
                                    )}
                                    <h3
                                        className="text-base font-semibold text-slate-900 leading-tight md:text-lg"
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {p.nombre}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 text-[0.7rem] text-slate-500 sm:text-xs">
                                        {p.tonalidad && (
                                            <span className={metaPillClass}>
                                                <span
                                                    className="h-2 w-2 rounded-full border border-slate-200"
                                                    style={{
                                                        backgroundColor:
                                                            p.hexcolor || '#f1f5f9',
                                                    }}
                                                />
                                                {p.tonalidad}
                                            </span>
                                        )}
                                        {p.marca && (
                                            <span className={metaPillClass}>
                                                <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-slate-400">
                                                    {t('filters.brand', 'Marca')}:
                                                </span>
                                                {p.marca}
                                            </span>
                                        )}
                                    </div>
                                    {saleInfo.isOnSale && (
                                        <div className={saleStackClass}>
                                            {saleInfo.salePrice && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-rose-600">
                                                    {t('sale.priceLabel', {
                                                        price: saleInfo.salePrice,
                                                        defaultValue:
                                                            saleInfo.salePrice,
                                                    })}
                                                </span>
                                            )}
                                            {saleInfo.originalPrice && (
                                                <span className="text-slate-400 line-through">
                                                    {t('sale.originalLabel', {
                                                        price: saleInfo.originalPrice,
                                                        defaultValue:
                                                            saleInfo.originalPrice,
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* sentinel solo si hay más */}
                {hasMore && <div ref={sentinelRef} />}

                {/* loaders & mensajes */}
                {!loading && displayed.length === 0 && !error && (
                    <div className="mt-8 text-center text-gray-500">
                        {t('noProductsFound')}
                    </div>
                )}
                {!loading && error && (
                    <div className="mt-8 text-center text-red-500">{error}</div>
                )}

                {/* modal */}
                {selectedProduct && (
                    <Modal
                        isOpen={modalOpen}
                        close={() => setModalOpen(false)}
                        product={selectedProduct}
                        onApplyFilters={handleFilteredProducts}
                    />
                )}
            </div>
        </div>
    );
}
