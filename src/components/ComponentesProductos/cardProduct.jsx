import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import SkeletonLoader from '../ComponentesProductos/skeletonLoader';
import Modal from '../ComponentesProductos/modal';
import FiltroModal from '../../app/products/modalfiltro'; // Asegúrate de que el path es correcto
import SubMenuCarousel from './SubMenuCarousel';

const CardProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const productId = searchParams.get('productId');
    const type = searchParams.get('type');
    const fabricPattern = searchParams.get('fabricPattern');
    const uso = searchParams.get('uso');
    const fabricType = searchParams.get('fabricType');
    const collection = searchParams.get('collection');

    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [filters, setFilters] = useState(null);
    const [isFiltered, setIsFiltered] = useState(false);
    const [isSearching, setIsSearching] = useState(!!searchQuery);
    const [clearButtonVisible, setClearButtonVisible] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 16;

    useEffect(() => {
        if (isFiltered || isSearching) {
            setClearButtonVisible(true);
        } else {
            setClearButtonVisible(false);
        }
    }, [isFiltered, isSearching]);

    const loadProductImages = async (product) => {
        const [imageBuena, imageBaja] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Buena`).then((res) =>
                res.ok ? res.json() : null
            ),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Baja`).then((res) =>
                res.ok ? res.json() : null
            ),
        ]);

        return {
            ...product,
            imageBuena: imageBuena ? `https://${imageBuena.ficadjunto}` : 'default_buena_image_url',
            imageBaja: imageBaja ? `https://${imageBaja.ficadjunto}` : 'default_baja_image_url',
        };
    };

    const fetchProducts = async (pageNumber = 1) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            let filterParams = {};

            if (searchQuery) {
                response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/search?query=${searchQuery}&limit=${itemsPerPage}&page=${pageNumber}`
                );
                setIsSearching(true);
                setIsFiltered(false);
            } else if (type) {
                filterParams = { fabricType: type === 'papel' ? ['PAPEL PARED'] : [] };
                response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/filter?page=${pageNumber}&limit=${itemsPerPage}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(filterParams),
                    }
                );
                setIsFiltered(true);
                setIsSearching(false);
            } else if (fabricPattern) {
                filterParams = { fabricPattern: [fabricPattern] };
                response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/filter?page=${pageNumber}&limit=${itemsPerPage}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(filterParams),
                    }
                );
                setIsFiltered(true);
                setIsSearching(false);
            } else if (uso) {
                filterParams = { uso: [uso] };
                response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/filter?page=${pageNumber}&limit=${itemsPerPage}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(filterParams),
                    }
                );
                setIsFiltered(true);
                setIsSearching(false);
            } else if (fabricType) {
                filterParams = { fabricType: [fabricType] };
                response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/filter?page=${pageNumber}&limit=${itemsPerPage}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(filterParams),
                    }
                );
                setIsFiltered(true);
                setIsSearching(false);
            } else if (collection) {
                filterParams = { collection: [collection] };
                response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/filter?page=${pageNumber}&limit=${itemsPerPage}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(filterParams),
                    }
                );
                setIsFiltered(true);
                setIsSearching(false);
            } else if (filters) {
                response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products/filter?page=${pageNumber}&limit=${itemsPerPage}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(filters),
                    }
                );
                setIsFiltered(true);
                setIsSearching(false);
            } else {
                response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/products?limit=${itemsPerPage}&page=${pageNumber}`
                );
                setIsFiltered(false);
                setIsSearching(false);
            }

            if (!response.ok) {
                throw new Error('Error fetching products');
            }

            const data = await response.json();
            const productsData = data.products || data;

            if (productsData.length === 0) {
                setError('No products found');
            } else {
                const productsWithImages = await loadProductsImages(productsData);
                setProducts(productsWithImages);
                setTotalProducts(data.total || productsWithImages.length);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadProductsImages = async (products) => {
        return await Promise.all(
            products.map(async (product) => {
                return await loadProductImages(product);
            })
        );
    };

    const fetchProductsById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
            if (!response.ok) {
                throw new Error('Error fetching product by ID');
            }
            const product = await response.json();
            const productWithImages = await loadProductImages(product);
            setProducts([productWithImages]);
            setTotalProducts(1);
            setIsFiltered(true);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchProductsById(productId);
        } else {
            fetchProducts(page);
        }
    }, [searchQuery, productId, type, fabricPattern, uso, fabricType, collection, page, filters]);

    const handleFilteredProducts = (filteredProducts, selectedFilters) => {
        setProducts(filteredProducts);
        setFilters(selectedFilters);
        setIsFiltered(true);
        setIsSearching(false);
        setPage(1);
    };

    const handleAddToCart = (product) => {
        addToCart({
            id: product.codprodu,
            name: product.desprodu,
            price: 3,
            image: product.imageBaja,
            quantity: 1,
        });
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleClearSearch = () => {
        setFilters(null);
        setIsFiltered(false);
        setIsSearching(false);
        setActiveCategory(null);
        setPage(1);
        navigate('/products');
        fetchProducts(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchProducts(newPage);
    };

    const handleCategoryFilter = (category) => {
        setActiveCategory(category);
        if (category === 'OUTDOOR') {
            navigate(`/products?uso=OUTDOOR`);
        } else if (category === 'FR') {
            navigate(`/products?uso=FR`);
        } else if (category === 'TERCIOPELO') {
            navigate(`/products?fabricType=TERCIOPELO`);
        } else if (category === 'WALLPAPER') {
            navigate(`/products?fabricPattern=WALLPAPER`);
        } else if (category === 'WALLCOVERING') {
            navigate(`/products?fabricPattern=WALLCOVERING`);
        } else {
            navigate(`/products?fabricPattern=${category}`);
        }
    };

    return (
        <div>
            <div className="top-1/4 sticky xl:ml-2 z-10 xl:mt-4 mt-4 ml-5">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex p-2 xl:px-2 lg:px-4 2xl:px-2 text-center justify-center max-w-[15%] lg:min-w-[8%] xl:w-[5%] xl:hover:w-[6%] hover:max-w-[20%] bg-black hover:bg-white text-white hover:text-black duration-200 border-2 border-black hover:border-gray-400 hover:rounded-xl rounded">
                    Filtrar por
                </button>

                {/* Botón Limpiar filtros */}
                {(isFiltered || isSearching) && (
                    <button
                        onClick={handleClearSearch}
                        className="bg-gray-400 px-8 py-2 text-neutral-50 mt-2 transition-transform duration-200 hover:bg-gray-500 hover:scale-105"
                        style={{ width: '100%' }}
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            <FiltroModal
                isOpen={isModalOpen}
                close={() => setIsModalOpen(false)}
                applyFilters={handleFilteredProducts}
            />

            <SubMenuCarousel onFilterClick={handleCategoryFilter} type={type} activeCategory={activeCategory} />

            <div className="flex flex-wrap justify-center items-center">
                {products.map((product, index) => (
                    <div
                        key={`${product.codprodu}-${index}`}
                        className="bg-white rounded-lg shadow-lg sm:p-1 md:p-2 transition duration-300 ease-in-out transform hover:scale-105 mx-2 mb-7 w-[80%] h-[90%] sm:w-[45%] md:w-[45%] lg:w-[22%] xl:w-[22%] 2xl:w-[20%]">
                        <div
                            className="relative overflow-hidden w-full h-80 sm:h-64 md:h-64 cursor-pointer"
                            onClick={() => handleProductClick(product)}
                        >
                            <img
                                className="object-cover w-full h-full"
                                src={product.imageBaja}
                                alt={product.nombre}
                                onError={(e) => {
                                    e.target.src = 'default_buena_image_url';
                                }}
                            />
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-lg md:hidden">
                                Toca para ver
                            </div>
                        </div>
                        <h3 className="text-center text-lg sm:text-xl text-gray-900 mt-4">{product.nombre}</h3>
                    </div>
                ))}
            </div>

            {loading && <SkeletonLoader repeticiones={10} />}
            {!loading && products.length === 0 && !error && (
                <div className="text-center text-gray-500">No se encontraron productos</div>
            )}
            {!loading && error && <div className="text-center text-red-500">{error}</div>}

            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="px-4 py-2">{page}</span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={products.length < itemsPerPage || products.length === 0}
                    className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>

            {selectedProduct && (
                <Modal isOpen={modalOpen} close={() => setModalOpen(false)} product={selectedProduct} />
            )}
        </div>
    );
};

export default CardProduct;
