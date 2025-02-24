import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import SkeletonLoader from '../ComponentesProductos/skeletonLoader';
import Modal from './modal';
import Filtro from '../../app/products/buttonFiltro';
import SubMenuCarousel from './SubMenuCarousel';
import CryptoJS from 'crypto-js';
import {
    secretKey,
    itemsPerPage,
    defaultImageUrl,
    apiUrl,
    scrollPosition
} from '../../Constants/constants';

// Importamos íconos de react-icons (Font Awesome, por ejemplo)
import {
    FaAngleDoubleLeft,
    FaAngleLeft,
    FaAngleRight,
    FaAngleDoubleRight
} from 'react-icons/fa';

// Componente LazyImage: carga la imagen solo cuando es visible
const LazyImage = ({ src, alt, className }) => {
    const [visible, setVisible] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );
        if (imgRef.current) observer.observe(imgRef.current);
        return () => {
            if (observer) observer.disconnect();
        };
    }, []);

    return (
        <img
            ref={imgRef}
            className={className}
            src={visible ? src : ''}
            alt={alt}
            style={{ minHeight: '150px', background: '#eee' }}
        />
    );
};

const CardProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);

    // Parámetros de URL
    const searchQuery = searchParams.get('search');
    const productId = searchParams.get('productId');
    const type = searchParams.get('type');
    const fabricPattern = searchParams.get('fabricPattern');
    const encryptedProductId = searchParams.get('pid');
    const uso = searchParams.get('uso');
    const fabricType = searchParams.get('fabricType');
    const collection = searchParams.get('collection');

    const { addToCart } = useCart();

    // Estados de productos, carga, errores, paginación y filtros
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [filters, setFilters] = useState({});
    const [isFiltered, setIsFiltered] = useState(false);
    const [isSearching, setIsSearching] = useState(!!searchQuery || !!productId);
    const [activeCategory, setActiveCategory] = useState(null);

    const decryptedProductId = encryptedProductId
        ? CryptoJS.AES.decrypt(encryptedProductId, secretKey).toString(CryptoJS.enc.Utf8)
        : null;
    const productIdEnlace = decryptedProductId;

    // Actualizar activeCategory cuando cambia la URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        let newActive = null;
        if (params.get('uso')) newActive = params.get('uso');
        else if (params.get('fabricType')) newActive = params.get('fabricType');
        else if (params.get('fabricPattern')) newActive = params.get('fabricPattern');
        setActiveCategory(newActive);
    }, [location.search]);

    // Construye el objeto de filtros combinando URL y estado local
    const buildAppliedFilters = () => {
        let applied = { ...filters };
        if (searchQuery) applied.search = searchQuery;
        if (type) applied.fabricType = type === 'papel' ? ['WALLPAPER'] : applied.fabricType;
        if (fabricPattern) applied.fabricPattern = [fabricPattern];
        if (uso) applied.uso = [uso];
        if (fabricType) applied.fabricType = [fabricType];
        if (collection) applied.collection = [collection];
        return applied;
    };

    // Función para cargar imágenes de un producto
    const loadProductImages = async (product) => {
        const [imageBuena, imageBaja] = await Promise.all([
            fetch(`${apiUrl}/api/images/${product.codprodu}/Buena`).then((res) =>
                res.ok ? res.json() : null
            ),
            fetch(`${apiUrl}/api/images/${product.codprodu}/Baja`).then((res) =>
                res.ok ? res.json() : null
            )
        ]);
        return {
            ...product,
            imageBuena: imageBuena ? `https://${imageBuena.ficadjunto}` : defaultImageUrl,
            imageBaja: imageBaja ? `https://${imageBaja.ficadjunto}` : defaultImageUrl
        };
    };

    const loadProductsImages = async (products) => {
        return Promise.all(products.map(loadProductImages));
    };

    // Función para cargar productos (paginación en el servidor)
    const fetchProducts = async (pageNumber = 1, appliedFilters = {}) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (searchQuery && Object.keys(appliedFilters).length === 1 && appliedFilters.search) {
                // Búsqueda simple
                response = await fetch(
                    `${apiUrl}/api/products/search?query=${searchQuery}&limit=${itemsPerPage}&page=${pageNumber}`
                );
                setIsSearching(true);
                setIsFiltered(false);
            } else if (Object.keys(appliedFilters).length > 0) {
                // Filtros
                response = await fetch(
                    `${apiUrl}/api/products/filter?page=${pageNumber}&limit=${itemsPerPage}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(appliedFilters)
                    }
                );
                setIsFiltered(true);
                setIsSearching(false);
            } else {
                // Sin filtros
                response = await fetch(
                    `${apiUrl}/api/products?limit=${itemsPerPage}&page=${pageNumber}`
                );
                setIsFiltered(false);
                setIsSearching(false);
            }

            if (!response.ok) throw new Error('Error fetching products');

            const data = await response.json();
            const productsData = data.products || data;

            if (productsData.length === 0) {
                setError('No se encontraron productos');
            } else {
                const productsWithImages = await loadProductsImages(productsData);
                setProducts(productsWithImages);

                // Si el backend retorna "total", se usa; si no, se calcula.
                const computedTotal =
                    data.total !== undefined
                        ? data.total
                        : productsData.length === itemsPerPage
                            ? pageNumber * itemsPerPage + 1
                            : (pageNumber - 1) * itemsPerPage + productsData.length;
                setTotalProducts(computedTotal);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Cargar producto por ID
    const fetchProductsById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/api/products/${id}`);
            if (!response.ok) throw new Error('Error fetching product by ID');
            const product = await response.json();
            const productWithImages = await loadProductImages(product);
            setSelectedProduct(productWithImages);
            setModalOpen(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Efecto: cargar productos
    useEffect(() => {
        if (productIdEnlace) {
            fetchProductsById(productIdEnlace);
        } else if (productId) {
            fetchProductsById(productId);
        } else {
            const appliedFilters = buildAppliedFilters();
            fetchProducts(page, appliedFilters);
        }
    }, [
        searchQuery,
        productId,
        productIdEnlace,
        type,
        fabricPattern,
        uso,
        fabricType,
        collection,
        page,
        filters
    ]);

    // Maneja filtros aplicados desde el modal
    const handleFilteredProducts = (filteredProducts, selectedFilters) => {
        setProducts(filteredProducts);
        setFilters(selectedFilters);
        setIsFiltered(true);
        setIsSearching(false);
        setPage(1);
        setActiveCategory(null);
        navigate('/products');
    };

    const handleAddToCart = (product) => {
        addToCart({
            id: product.codprodu,
            name: product.desprodu,
            price: 3,
            image: product.imageBaja,
            quantity: 1
        });
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const totalPages = Math.ceil(totalProducts / itemsPerPage);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo(scrollPosition.x, scrollPosition.y);
    };

    // Filtra por categoría del submenú
    const handleCategoryFilter = (category) => {
        setFilters({});
        if (category === 'OUTDOOR') {
            navigate(`/products?uso=OUTDOOR`);
        } else if (category === 'FR') {
            navigate(`/products?uso=FR`);
        } else if (category === 'TERCIOPELO') {
            navigate(`/products?fabricType=TERCIOPELO`);
        } else if (category === 'VISILLO') {
            navigate(`/products?fabricType=VISILLO`);
        } else if (category === 'WALLPAPER') {
            navigate(`/products?fabricType=WALLPAPER`);
        } else {
            navigate(`/products?fabricPattern=${category}`);
        }
    };

    return (
        <div className="pb-10">
            <Filtro setFilteredProducts={handleFilteredProducts} page={page} />
            <SubMenuCarousel
                onFilterClick={handleCategoryFilter}
                type={type}
                activeCategory={activeCategory}
            />

            {/* Grid de productos */}
            <div className="flex flex-wrap justify-center items-center mt-6">
                {products.map((product, index) => (
                    <div
                        key={`${product.codprodu}-${index}`}
                        className="bg-white rounded-lg shadow-lg sm:p-1 md:p-2 transition duration-300 ease-in-out transform hover:scale-105 mx-2 mb-7 w-[80%] h-[90%] sm:w-[45%] md:w-[45%] lg:w-[22%] xl:w-[22%] 2xl:w-[20%]"
                    >
                        <div
                            className="relative overflow-hidden w-full h-80 sm:h-64 md:h-64 cursor-pointer"
                            onClick={() => handleProductClick(product)}
                        >
                            <LazyImage
                                className="object-cover w-full h-full"
                                src={product.imageBaja}
                                alt={product.nombre}
                            />
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-lg md:hidden">
                                Toca para ver
                            </div>
                        </div>
                        <h3 className="text-center text-lg sm:text-xl text-gray-900 mt-4">
                            {product.nombre}
                        </h3>
                    </div>
                ))}
            </div>

            {loading && <SkeletonLoader repeticiones={10} />}

            {!loading && products.length === 0 && !error && (
                <div className="text-center text-gray-500">No se encontraron productos</div>
            )}
            {!loading && error && (
                <div className="text-center text-red-500">{error}</div>
            )}

            {/* Paginación adaptativa */}
            {totalPages > 1 && (
                <div className="mt-8 w-full flex justify-center">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {selectedProduct && (
                <Modal
                    isOpen={modalOpen}
                    close={() => setModalOpen(false)}
                    product={selectedProduct}
                />
            )}
        </div>
    );
};

/* ===========================
   Paginación adaptativa con 
   estilo moderno e interactivo
   =========================== */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    // Máximo de botones de página en escritorio
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    // Versión de escritorio
    const DesktopPagination = () => (
        <div className="hidden md:flex items-center space-x-1 bg-white shadow-md rounded-full px-4 py-2">
            {/* First */}
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
            >
                <FaAngleDoubleLeft className="w-4 h-4" />
            </button>

            {/* Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
            >
                <FaAngleLeft className="w-4 h-4" />
            </button>

            {/* Elipsis al inicio */}
            {startPage > 1 && (
                <span className="px-2 text-gray-500 select-none">...</span>
            )}

            {/* Números de página */}
            {pageNumbers.map((num) => (
                <button
                    key={num}
                    onClick={() => onPageChange(num)}
                    className={`px-3 py-1 rounded-full transition-colors duration-200 ${num === currentPage
                            ? 'bg-[#D2B48C] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    {num}
                </button>
            ))}

            {/* Elipsis al final */}
            {endPage < totalPages && (
                <span className="px-2 text-gray-500 select-none">...</span>
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
            >
                <FaAngleRight className="w-4 h-4" />
            </button>

            {/* Last */}
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
            >
                <FaAngleDoubleRight className="w-4 h-4" />
            </button>
        </div>
    );

    // Versión móvil
    const MobilePagination = () => (
        <div className="flex md:hidden items-center space-x-3 bg-white shadow-md rounded-full px-4 py-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
            >
                <FaAngleLeft className="w-4 h-4" />
            </button>

            <span className="text-sm font-semibold text-gray-700">
                {currentPage} / {totalPages}
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50"
            >
                <FaAngleRight className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <>
            <DesktopPagination />
            <MobilePagination />
        </>
    );
};

export default CardProduct;
