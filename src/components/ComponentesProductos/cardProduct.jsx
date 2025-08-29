import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useCart } from '../cartContext';
import SkeletonLoader from '../ComponentesProductos/skeletonLoader';
import Modal from './modal';
import Filtro from '../../app/products/buttonFiltro';
import SubMenuCarousel from './SubMenuCarousel';
import CryptoJS from 'crypto-js';
import { useTranslation } from 'react-i18next';
import { cdnUrl } from '../../Constants/cdn';
import { secretKey, itemsPerPage, defaultImageUrl, apiUrl } from '../../Constants/constants';
import { FaSortAlphaDown, FaSortAlphaUp, FaThLarge, FaThList, FaAngleDoubleRight } from 'react-icons/fa';

const LazyImage = ({ src, alt, className }) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.1 }
        );
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
                    onError={(e) => {
                        e.currentTarget.src = defaultImageUrl;
                    }}
                />
            )}
        </div>
    );
};

export default function CardProduct() {
    const { t } = useTranslation('cardProduct');
    const { addToCart } = useCart(); // si lo usas en el modal
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const containerRef = useRef(null);
    const sentinelRef = useRef(null);
    const controllerRef = useRef(null); // AbortController global

    // --- Compatibilidad con hash params (#/products?... )
    const getHashParams = () => {
        const hash = window.location.hash;
        const queryStart = hash.indexOf('?');
        if (queryStart === -1) return new URLSearchParams();
        return new URLSearchParams(hash.slice(queryStart + 1));
    };
    const hashParams = getHashParams();

    // --- URL params
    const searchQuery = params.get('search');
    const pidEnc = params.get('pid');
    const productId = params.get('productId');
    const fabricPattern = params.get('fabricPattern');
    const uso = params.get('uso') || hashParams.get('uso');
    const brand = params.get('brand') || hashParams.get('brand');
    const fabricType = params.get('fabricType') || hashParams.get('fabricType');
    const collection = params.get('collection');
    const type = params.get('type');
    const mantenimiento = params.get('mantenimiento');

    // decrypt pid
    const decryptedPid = pidEnc ? CryptoJS.AES.decrypt(pidEnc, secretKey).toString(CryptoJS.enc.Utf8) : null;
    const fetchByIdParam = decryptedPid || productId;

    // --- state
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [filters, setFilters] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);

    // --- UI
    const [searchInput, setSearchInput] = useState(''); // sincronizado con ?search
    const [sortOrder, setSortOrder] = useState('alpha-asc');
    const [viewMode, setViewMode] = useState('grid4');

    // --- sync page from URL
    useEffect(() => {
        const p = parseInt(params.get('page') || '1', 10);
        if (p !== page) setPage(p);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    // --- sincroniza el input con ?search= de la URL
    useEffect(() => {
        setSearchInput(searchQuery || '');
    }, [searchQuery]);

    // --- activeCategory para SubMenu
    useEffect(() => {
        setActiveCategory(uso || fabricType || fabricPattern || mantenimiento || null);
    }, [uso, fabricType, fabricPattern, mantenimiento]);

    // --- Build filtros para backend
    const buildAppliedFilters = () => {
        const ap = { ...filters };
        if (searchQuery) ap.search = searchQuery;
        if (type === 'papel') ap.fabricType = ['WALLPAPER', 'PAPEL PINTADO'];
        if (fabricPattern) ap.fabricPattern = [fabricPattern];
        if (uso) ap.uso = [uso];
        if (brand) ap.brand = [brand];
        if (fabricType) ap.fabricType = [fabricType];
        if (collection) ap.collection = [collection];
        if (mantenimiento) ap.mantenimiento = [mantenimiento];
        return ap;
    };

    // --- imágenes: grid usa 'Baja'; modal precarga 'Buena'
    const loadLowRes = async (prod) => {
        try {
            const low = await fetch(`${apiUrl}/api/images/${prod.codprodu}/Baja`).then((r) =>
                r.ok ? r.json() : null
            );
            return {
                ...prod,
                imageBaja: cdnUrl(low ? `https://${low.ficadjunto}` : defaultImageUrl),
            };
        } catch {
            return { ...prod, imageBaja: defaultImageUrl };
        }
    };

    const preloadHighResInto = async (prod) => {
        try {
            const hi = await fetch(`${apiUrl}/api/images/${prod.codprodu}/Buena`).then((r) =>
                r.ok ? r.json() : null
            );
            if (hi) {
                setSelectedProduct((prev) =>
                    prev && prev.codprodu === prod.codprodu
                        ? { ...prev, imageBuena: cdnUrl(`https://${hi.ficadjunto}`) }
                        : prev
                );
            }
        } catch {
            // silencioso
        }
    };

    // --- fetch products
    const fetchProducts = useCallback(
        async (pageNum = 1, appliedFilters = {}) => {
            controllerRef.current?.abort();
            const controller = new AbortController();
            controllerRef.current = controller;

            setLoading(true);
            setError(null);

            try {
                let data, list;

                // 1) Si viene ?search=... usa el endpoint nuevo paginado
                if (appliedFilters.search && String(appliedFilters.search).trim()) {
                    const u = new URL(`${apiUrl}/api/products/search-products`);
                    u.searchParams.set('query', String(appliedFilters.search).trim());
                    u.searchParams.set('limit', itemsPerPage);
                    u.searchParams.set('page', pageNum);

                    let respS = await fetch(u, { signal: controller.signal });
                    // fallback al clásico si el nuevo no existe
                    if (!respS.ok) {
                        const legacy = new URL(`${apiUrl}/api/products/search`);
                        legacy.searchParams.set('query', String(appliedFilters.search).trim());
                        legacy.searchParams.set('limit', itemsPerPage);
                        legacy.searchParams.set('page', pageNum);
                        respS = await fetch(legacy, { signal: controller.signal });
                    }

                    if (!respS.ok) throw new Error('Error searching');
                    data = await respS.json();
                    list = data.products || [];
                } else {
                    // 2) Hay filtros (sin 'search') -> POST /filter
                    const hasFilters =
                        Object.keys(appliedFilters).length > 0 &&
                        Object.entries(appliedFilters).some(([k, v]) =>
                            k !== 'search' && (Array.isArray(v) ? v.length > 0 : Boolean(v))
                        );

                    if (hasFilters) {
                        const respF = await fetch(
                            `${apiUrl}/api/products/filter?page=${pageNum}&limit=${itemsPerPage}`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(appliedFilters),
                                signal: controller.signal,
                            }
                        );
                        if (!respF.ok) throw new Error('Error filtering');
                        data = await respF.json();
                        list = data.products || [];
                    } else {
                        // 3) Sin filtros ni search -> catálogo normal
                        const respA = await fetch(
                            `${apiUrl}/api/products?limit=${itemsPerPage}&page=${pageNum}`,
                            { signal: controller.signal }
                        );
                        if (!respA.ok) throw new Error('Error fetching');
                        data = await respA.json();
                        list = data.products || data;
                    }
                }

                const wi = await Promise.all((list || []).map(loadLowRes));
                setProducts((prev) => (pageNum > 1 ? [...prev, ...wi] : wi));

                const total =
                    data.pagination?.totalResults ??
                    data.total ??
                    (wi.length === itemsPerPage ? pageNum * itemsPerPage + 1 : (pageNum - 1) * itemsPerPage + wi.length);

                setTotalProducts(total);
            } catch (err) {
                if (err.name !== 'AbortError') setError(err.message);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // --- fetch por id (abre modal)
    const fetchById = useCallback(async (id) => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setLoading(true);
        setError(null);
        try {
            const r = await fetch(`${apiUrl}/api/products/${id}`, { signal: controller.signal });
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

    // --- efecto principal: recarga según URL (page/filtros/search)
    useEffect(() => {
        if (fetchByIdParam) {
            fetchById(fetchByIdParam);
        } else {
            const ap = buildAppliedFilters();
            const p = parseInt(params.get('page') || '1', 10);
            fetchProducts(p, ap);
        }
        return () => controllerRef.current?.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, fetchByIdParam]);

    // --- filtros desde <Filtro> (compatibilidad)
    const handleFilteredProducts = (prods, selFilters) => {
        setProducts(prods);
        setFilters(selFilters);
        setPage(1);
        navigate(`/products?page=1`);
    };

    // --- navegación con debounce desde el input (buscador)
    const debouncedNavigateSearch = useRef(
        debounce((val) => {
            const u = new URLSearchParams(location.search);
            if (val && val.trim().length >= 3) {
                u.set('search', val.trim());
                u.set('page', '1');
            } else {
                u.delete('search');
                u.set('page', '1');
            }
            navigate(`/products?${u.toString()}`);
        }, 400)
    ).current;

    const onChangeSearchInput = (e) => {
        const val = e.target.value;
        setSearchInput(val); // filtro local inmediato
        debouncedNavigateSearch(val); // búsqueda servidor con debounce
    };

    const onKeyDownSearchInput = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            debouncedNavigateSearch.cancel(); // fuerza búsqueda inmediata
            const val = (searchInput || '').trim();
            const u = new URLSearchParams(location.search);
            if (val && val.length >= 3) {
                u.set('search', val);
                u.set('page', '1');
            } else {
                u.delete('search');
                u.set('page', '1');
            }
            navigate(`/products?${u.toString()}`);
        }
    };

    // --- load more
    const loadMore = () => {
        if (!loading && products.length < totalProducts) {
            const nxt = page + 1;
            setPage(nxt);
            const u = new URLSearchParams(location.search);
            u.set('page', nxt.toString());
            navigate(`/products?${u.toString()}`);
        }
    };

    // --- infinite scroll robusto
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && products.length < totalProducts) {
                    loadMore();
                }
            },
            { rootMargin: '200px' }
        );
        const el = sentinelRef.current;
        if (el) obs.observe(el);
        return () => {
            if (el) obs.unobserve(el);
            obs.disconnect();
        };
    }, [loading, products.length, totalProducts, page, location.search]);

    // --- dedup por codprodu
    const uniqueProducts = products.filter((p, i, arr) => arr.findIndex((x) => x.codprodu === p.codprodu) === i);

    // --- filtro/orden local mientras llegan resultados
    let displayed = uniqueProducts.filter((p) => {
        const term = searchInput.trim().toLowerCase();
        if (!term) return true;
        const name = (p.nombre || '').toLowerCase();
        const tone = (p.tonalidad || '').toLowerCase();
        return name.includes(term) || tone.includes(term);
    });

    displayed.sort((a, b) => {
        if (sortOrder === 'alpha-asc') return (a.nombre || '').localeCompare(b.nombre || '');
        if (sortOrder === 'alpha-desc') return (b.nombre || '').localeCompare(a.nombre || '');
        return 0;
    });

    // --- scroll top al limpiar búsqueda local
    useEffect(() => {
        if (!searchInput.trim() && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [searchInput]);

    return (
        <div className="relative pb-10 px-4 lg:px-16" ref={containerRef}>
            {/* Filtros globales */}
            <Filtro setFilteredProducts={handleFilteredProducts} page={page} />

            {/* Submenú categorías/atajos */}
            <SubMenuCarousel
                onFilterClick={(cat) => {
                    setFilters({});
                    setPage(1);

                    if (!cat) {
                        return navigate('/products');
                    }

                    // Estilos / fabricPattern
                    if (cat === 'FLORAL') return navigate('/products?fabricPattern=FLORAL');
                    if (cat === 'LISO') return navigate('/products?fabricPattern=LISO');
                    if (cat === 'FALSO_LISO') return navigate('/products?fabricPattern=FALSO_LISO');
                    if (cat === 'GEOMETRICO') return navigate('/products?fabricPattern=GEOMETRICO');
                    if (cat === 'RAYAS') return navigate('/products?fabricPattern=RAYAS');
                    if (cat === 'CUADROS') return navigate('/products?fabricPattern=CUADROS');
                    if (cat === 'ESPIGA') return navigate('/products?fabricPattern=ESPIGA');
                    if (cat === 'ETNICO') return navigate('/products?fabricPattern=ETNICO');
                    if (cat === 'CON ANIMALES') return navigate('/products?fabricPattern=CON ANIMALES');
                    if (cat === 'CON TEXTURAS') return navigate('/products?fabricPattern=CON TEXTURAS');
                    if (cat === 'RAFIA') return navigate('/products?fabricPattern=RAFIA');
                    if (cat === 'TELAS TROPICALES') return navigate('/products?fabricPattern=TELAS TROPICALES');

                    // Funcionalidad / mantenimiento
                    if (cat === 'EASYCLEAN') return navigate('/products?mantenimiento=EASYCLEAN');

                    // Usos
                    if (cat === 'IMO') return navigate('/products?uso=IMO');
                    if (cat === 'OUTDOOR') return navigate('/products?uso=OUTDOOR');
                    if (cat === 'FR') return navigate('/products?uso=FR');

                    // Tipos / fabricType
                    if (cat === 'VISILLO') return navigate('/products?fabricType=VISILLO');
                    if (cat === 'TERCIOPELO') return navigate('/products?fabricType=TERCIOPELO');
                    if (type !== 'tela' && cat === 'WALLPAPER') return navigate('/products?fabricType=WALLPAPER');

                    // Cualquier otro caso
                    navigate(`/products?fabricPattern=${encodeURIComponent(cat)}`);
                }}
                type={type}
                activeCategory={activeCategory}
            />

            {/* search + sort + view */}
            <div className="mt-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                {/* Buscador interno: servidor + filtro local */}
                <div className="relative w-full md:w-1/3 lg:w-1/4">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={onChangeSearchInput}
                        onKeyDown={onKeyDownSearchInput}
                        placeholder={t('searchPlaceholder', 'Encuentra el producto...')}
                        className="
              w-full h-10
              bg-gray-50 placeholder-gray-400 text-gray-700
              px-4 pr-10
              rounded-full
              ring-1 ring-gray-300 shadow-sm
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#26659E]
              transition
            "
                    />
                    <svg
                        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 w-5 h-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
                    </svg>
                    {searchInput && searchInput.length < 3 && (
                        <div className="absolute left-0 top-full mt-1 text-xs text-gray-500">
                            {t('minChars', 'Escribe al menos 3 caracteres para buscar')}
                        </div>
                    )}
                </div>

                {/* sort & view toggles */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">{t('sortBy')}:</span>
                    <button
                        onClick={() => setSortOrder('alpha-asc')}
                        className={`p-2 rounded-lg ${sortOrder === 'alpha-asc' ? 'bg-[#26659E] text-white' : 'bg-gray-100 text-gray-600'}`}
                        title="A → Z"
                    >
                        <FaSortAlphaDown />
                    </button>
                    <button
                        onClick={() => setSortOrder('alpha-desc')}
                        className={`p-2 rounded-lg ${sortOrder === 'alpha-desc' ? 'bg-[#26659E] text-white' : 'bg-gray-100 text-gray-600'}`}
                        title="Z → A"
                    >
                        <FaSortAlphaUp />
                    </button>
                    <button
                        onClick={() => setViewMode('grid4')}
                        className={`p-2 rounded-lg ${viewMode === 'grid4' ? 'bg-[#26659E] text-white' : 'bg-gray-100 text-gray-600'}`}
                        title="Vista grid"
                    >
                        <FaThLarge />
                    </button>
                    <button
                        onClick={() => setViewMode('grid2')}
                        className={`p-2 rounded-lg ${viewMode === 'grid2' ? 'bg-[#26659E] text-white' : 'bg-gray-100 text-gray-600'}`}
                        title="Vista lista"
                    >
                        <FaThList />
                    </button>
                </div>
            </div>

            {/* products grid */}
            <div className={viewMode === 'grid4' ? 'mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6' : 'mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6'}>
                {displayed.map((p, i) => (
                    <div key={`${p.codprodu}-${i}`} className="flex flex-col p-2 bg-white rounded-lg shadow hover:shadow-xl transition">
                        <div
                            className={`relative w-full ${viewMode === 'grid2' ? 'h-56 md:h-96' : 'h-32 md:h-60 '} overflow-hidden cursor-pointer rounded`}
                            onClick={() => {
                                setSelectedProduct(p);
                                setModalOpen(true);
                                preloadHighResInto(p);
                            }}
                        >
                            <LazyImage src={p.imageBaja || defaultImageUrl} alt={p.nombre} className="object-cover w-full h-full" />
                            <div className="absolute bottom-2 right-2 px-2 py-1 text-xs text-white bg-black/50 rounded md:hidden">
                                {t('touchToView')}
                            </div>
                        </div>
                        <div className="flex-1 mt-2 md:mt-4 text-center">
                            <h3 className="md:text-lg text-sm font-semibold text-gray-800">{p.nombre}</h3>
                            <p className="mt-1 md:text-sm text-xs text-gray-500">{p.tonalidad}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* infinite‐scroll sentinel */}
            <div ref={sentinelRef} />

            {/* loaders & messages */}
            {loading && <SkeletonLoader repeticiones={itemsPerPage} />}
            {!loading && displayed.length === 0 && !error && (
                <div className="mt-8 text-center text-gray-500">{t('noProductsFound')}</div>
            )}
            {!loading && error && <div className="mt-8 text-center text-red-500">{error}</div>}

            {/* fallback “Load more” */}
            {!searchInput.trim() && products.length < totalProducts && !loading && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        className="flex items-center px-8 py-3 text-lg text-white bg-[#26659E] rounded-full hover:bg-[#1f527a] transition"
                    >
                        {t('loadMore')} <FaAngleDoubleRight className="ml-2" />
                    </button>
                </div>
            )}

            {/* detail modal */}
            {selectedProduct && (
                <Modal isOpen={modalOpen} close={() => setModalOpen(false)} product={selectedProduct} onApplyFilters={handleFilteredProducts} />
            )}
        </div>
    );
}
