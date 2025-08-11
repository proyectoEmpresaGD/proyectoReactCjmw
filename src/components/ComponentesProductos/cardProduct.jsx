import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import SkeletonLoader from '../ComponentesProductos/skeletonLoader';
import Modal from './modal';
import Filtro from '../../app/products/buttonFiltro';
import SubMenuCarousel from './SubMenuCarousel';
import CryptoJS from 'crypto-js';
import { useTranslation } from 'react-i18next';
import { cdnUrl } from '../../Constants/cdn';
import {
    secretKey,
    itemsPerPage,
    defaultImageUrl,
    apiUrl
} from '../../Constants/constants';
import {
    FaSortAlphaDown,
    FaSortAlphaUp,
    FaThLarge,
    FaThList,
    FaAngleDoubleRight
} from 'react-icons/fa';

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
        ref.current && obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return (
        <div ref={ref} className="w-full h-full bg-gray-100">
            {visible && <img src={src} alt={alt} className={className} />}
        </div>
    );
};

export default function CardProduct() {
    const { t } = useTranslation('cardProduct');
    const { addToCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const containerRef = useRef(null);
    const sentinelRef = useRef(null);
    const getHashParams = () => {
        const hash = window.location.hash; // Ej: "#/products?brand=ARE&uso=CORTINA"
        const queryStart = hash.indexOf('?');
        if (queryStart === -1) return new URLSearchParams();
        return new URLSearchParams(hash.slice(queryStart + 1));
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
    const type = params.get('type');

    const mantenimiento = params.get('mantenimiento');
    // decrypt pid
    const decryptedPid = pidEnc
        ? CryptoJS.AES.decrypt(pidEnc, secretKey).toString(CryptoJS.enc.Utf8)
        : null;
    const fetchByIdParam = decryptedPid || productId;

    // state
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [filters, setFilters] = useState({});
    const [activeCategory, setActiveCategory] = useState(null);

    // UI
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('alpha-asc');
    const [viewMode, setViewMode] = useState('grid4');


    // sync page from URL
    useEffect(() => {
        const p = parseInt(params.get('page') || '1', 10);
        if (p !== page) setPage(p);
    }, [location.search]);

    // sync activeCategory
    useEffect(() => {
        setActiveCategory(uso || fabricType || fabricPattern || mantenimiento || null);
    }, [location.search]);

    // build filters for API
    const buildAppliedFilters = () => {
        const ap = { ...filters };
        if (searchQuery) ap.search = searchQuery;
        if (type === 'papel') ap.fabricType = ['WALLPAPER'];
        if (fabricPattern) ap.fabricPattern = [fabricPattern];
        if (uso) ap.uso = [uso];
        if (fabricType) ap.fabricType = [fabricType];
        if (collection) ap.collection = [collection];
        if (mantenimiento) ap.mantenimiento = [mantenimiento];
        return ap;
    };

    // load images helper
    const loadProductImages = async prod => {
        const [b, l] = await Promise.all([
            fetch(`${apiUrl}/api/images/${prod.codprodu}/Buena`).then(r =>
                r.ok ? r.json() : null
            ),
            fetch(`${apiUrl}/api/images/${prod.codprodu}/Baja`).then(r =>
                r.ok ? r.json() : null
            )
        ]);
        return {
            ...prod,
            imageBuena: cdnUrl(b ? `https://${b.ficadjunto}` : defaultImageUrl),
            imageBaja: cdnUrl(l ? `https://${l.ficadjunto}` : defaultImageUrl)
        };
    };

    // fetch list or papeles
    const fetchProducts = useCallback(
        async (pageNum = 1, appliedFilters = {}) => {
            setLoading(true);
            setError(null);
            try {
                // papeles: POST filter
                if (type === 'papel') {
                    const resp = await fetch(
                        `${apiUrl}/api/products/filter?limit=10000`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ fabricType: ['WALLPAPER'] })
                        }
                    );
                    if (!resp.ok) throw new Error('Error cargando papeles');
                    const data = await resp.json();
                    const list = data.products || data;
                    const wi = await Promise.all(list.map(loadProductImages));
                    setProducts(wi);
                    setTotalProducts(data.total ?? wi.length);
                    setLoading(false);
                    return;
                }

                // on-demand search for telas
                if (type !== 'papel' && searchTerm.trim()) {
                    const term = searchTerm.trim();
                    const u = new URL(`${apiUrl}/api/products/search`);
                    u.searchParams.set('query', term);
                    u.searchParams.set('limit', itemsPerPage);
                    if (type === 'tela') u.searchParams.set('fabricType', 'TELA');
                    const respS = await fetch(u);
                    if (!respS.ok) throw new Error('Error buscando');
                    const d = await respS.json();
                    const list = d.products || d;
                    const wi = await Promise.all(list.map(loadProductImages));
                    setProducts(wi);
                    setTotalProducts(d.total ?? wi.length);
                    setLoading(false);
                    return;
                }

                // normal pagination
                let resp;
                if (Object.keys(appliedFilters).length) {
                    resp = await fetch(
                        `${apiUrl}/api/products/filter?page=${pageNum}&limit=${itemsPerPage}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(appliedFilters)
                        }
                    );
                } else {
                    resp = await fetch(
                        `${apiUrl}/api/products?limit=${itemsPerPage}&page=${pageNum}`
                    );
                }
                if (!resp.ok) throw new Error('Error fetching');
                const data = await resp.json();
                const list = data.products || data;
                const wi = await Promise.all(list.map(loadProductImages));
                setProducts(prev => (pageNum > 1 ? [...prev, ...wi] : wi));
                const total =
                    data.total != null
                        ? data.total
                        : list.length === itemsPerPage
                            ? pageNum * itemsPerPage + 1
                            : (pageNum - 1) * itemsPerPage + list.length;
                setTotalProducts(total);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        },
        [searchTerm, filters, fabricPattern, uso, fabricType, collection, type]
    );

    // fetch by ID
    const fetchById = useCallback(
        async id => {
            setLoading(true);
            setError(null);
            try {
                const r = await fetch(`${apiUrl}/api/products/${id}`);
                if (!r.ok) throw new Error('Error fetching by ID');
                const prod = await r.json();
                const wi = await loadProductImages(prod);
                setSelectedProduct(wi);
                setModalOpen(true);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // main effect
    useEffect(() => {
        if (fetchByIdParam) {
            fetchById(fetchByIdParam);
        } else {
            const af = buildAppliedFilters();
            fetchProducts(page, af);
        }
    }, [
        page,
        searchQuery,
        filters,
        fabricPattern,
        uso,
        fabricType,
        mantenimiento,
        collection,
        type,
        fetchByIdParam,
        fetchProducts,
        fetchById
    ]);

    // apply filters from <Filtro>
    const handleFilteredProducts = (prods, selFilters) => {
        setProducts(prods);
        setFilters(selFilters);
        setPage(1);
        navigate(`/products?page=1`);
    };

    // load more
    const loadMore = () => {
        if (!loading && products.length < totalProducts) {
            const nxt = page + 1;
            setPage(nxt);
            const u = new URLSearchParams(location.search);
            u.set('page', nxt);
            navigate(`/products?${u.toString()}`);
        }
    };

    // infinite scroll
    useEffect(() => {
        const obs = new IntersectionObserver(
            entries => {
                if (
                    entries[0].isIntersecting &&
                    !loading &&
                    products.length < totalProducts
                ) {
                    loadMore();
                }
            },
            { rootMargin: '200px' }
        );
        sentinelRef.current && obs.observe(sentinelRef.current);
        return () => obs.disconnect();
    }, [loading, products.length, totalProducts]);

    const uniqueProducts = products.filter(
        (p, i, arr) => arr.findIndex(x => x.codprodu === p.codprodu) === i
    );
    // filter + sort locally
    let displayed = uniqueProducts.filter(p => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        return (
            p.nombre.toLowerCase().includes(term) ||
            p.tonalidad?.toLowerCase().includes(term)
        );
    });
    if (searchTerm.trim() && displayed.length > 1) {
        displayed = [displayed[0]]; // only first match
    }
    displayed.sort((a, b) => {
        if (sortOrder === 'alpha-asc') return a.nombre.localeCompare(b.nombre);
        if (sortOrder === 'alpha-desc') return b.nombre.localeCompare(a.nombre);
        return 0;
    });

    // scroll to top when clearing search
    useEffect(() => {
        if (!searchTerm.trim() && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [searchTerm]);

    return (
        <div className="relative pb-10 px-4 lg:px-16" ref={containerRef}>
            {/* global filters */}
            <Filtro setFilteredProducts={handleFilteredProducts} page={page} />

            {/* submenu */}
            <SubMenuCarousel
                onFilterClick={cat => {
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
                    if (type !== 'tela' && cat === 'WALLPAPER')
                        return navigate('/products?fabricType=WALLPAPER');

                    // Cualquier otro caso
                    navigate(`/products?fabricPattern=${encodeURIComponent(cat)}`);
                }}
                type={type}
                activeCategory={activeCategory}
            />


            {/* search + sort + view */}
            <div className="mt-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                {/* highlighted search aligned to grid gutter */}
                <div className="relative w-full md:w-1/3 lg:w-1/4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Encuentra el producto..."
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
                    </svg>
                </div>

                {/* sort & view toggles */}
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">{t('sortBy')}:</span>
                    <button
                        onClick={() => setSortOrder('alpha-asc')}
                        className={`p-2 rounded-lg ${sortOrder === 'alpha-asc'
                            ? 'bg-[#26659E] text-white'
                            : 'bg-gray-100 text-gray-600'}`}
                    >
                        <FaSortAlphaDown />
                    </button>
                    <button
                        onClick={() => setSortOrder('alpha-desc')}
                        className={`p-2 rounded-lg ${sortOrder === 'alpha-desc'
                            ? 'bg-[#26659E] text-white'
                            : 'bg-gray-100 text-gray-600'}`}
                    >
                        <FaSortAlphaUp />
                    </button>
                    <button
                        onClick={() => setViewMode('grid4')}
                        className={`p-2 rounded-lg ${viewMode === 'grid4'
                            ? 'bg-[#26659E] text-white'
                            : 'bg-gray-100 text-gray-600'}`}
                    >
                        <FaThLarge />
                    </button>
                    {/* <button
                        onClick={() => setViewMode('grid2')}
                        className={`p-2 rounded-lg ${viewMode === 'grid2'
                            ? 'bg-[#26659E] text-white'
                            : 'bg-gray-100 text-gray-600'}`}
                    >
                        <FaThList />
                    </button> */}
                </div>
            </div>

            {/* products grid */}
            <div className={
                viewMode === 'grid4'
                    ? 'mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
                    : 'mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6'
            }>
                {displayed.map((p, i) => (
                    <div key={`${p.codprodu}-${i}`} className="flex flex-col p-2 bg-white rounded-lg shadow hover:shadow-xl transition">
                        <div
                            className="relative w-full h-48 overflow-hidden cursor-pointer rounded"
                            onClick={() => { setSelectedProduct(p); setModalOpen(true); }}
                        >
                            <LazyImage src={p.imageBaja} alt={p.nombre} className="object-cover w-full h-full" />
                            <div className="absolute bottom-2 right-2 px-2 py-1 text-xs text-white bg-black bg-opacity-50 rounded md:hidden">
                                {t('touchToView')}
                            </div>
                        </div>
                        <div className="flex-1 mt-4 text-center">
                            <h3 className="text-lg font-semibold text-gray-800">{p.nombre}</h3>
                            <p className="mt-1 text-sm text-gray-500">{p.tonalidad}</p>
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
            {!loading && error && (
                <div className="mt-8 text-center text-red-500">{error}</div>
            )}

            {/* fallback “Load more” */}
            {!searchTerm.trim() && products.length < totalProducts && !loading && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        className="
              flex items-center px-8 py-3 text-lg text-white bg-[#26659E] rounded-full hover:bg-[#1f527a] transition
            "
                    >
                        {t('loadMore')} <FaAngleDoubleRight className="ml-2" />
                    </button>
                </div>
            )}

            {/* detail modal */}
            {selectedProduct && (
                <Modal
                    isOpen={modalOpen}
                    close={() => setModalOpen(false)}
                    product={selectedProduct}
                    onApplyFilters={handleFilteredProducts}
                />
            )}
        </div>
    );
}
