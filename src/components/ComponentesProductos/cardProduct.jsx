import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import SkeletonLoader from '../ComponentesProductos/skeletonLoader';
import Modal from '../ComponentesProductos/modal';
import Filtro from "../../app/products/buttonFiltro";

const CardProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const productId = searchParams.get('productId');

    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [filters, setFilters] = useState(null); // Estado para los filtros aplicados
    const [isFiltered, setIsFiltered] = useState(false); // Filtros activos
    const [isSearching, setIsSearching] = useState(!!searchQuery); // Búsqueda activa
    const [clearButtonVisible, setClearButtonVisible] = useState(false); // Control del botón "Limpiar filtros"
    const itemsPerPage = 16;

    // Control centralizado del estado del botón "Limpiar filtros"
    useEffect(() => {
        // Mostrar el botón "Limpiar filtros" solo si hay búsqueda o filtros activos
        if (isFiltered || isSearching) {
            setClearButtonVisible(true);
        } else {
            setClearButtonVisible(false);
        }
    }, [isFiltered, isSearching]);

    // Cargar imágenes de un producto
    const loadProductImages = async (product) => {
        const [imageBuena, imageBaja] = await Promise.all([
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Buena`).then(res => res.ok ? res.json() : null),
            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Baja`).then(res => res.ok ? res.json() : null)
        ]);

        return {
            ...product,
            imageBuena: imageBuena ? `https://${imageBuena.ficadjunto}` : 'default_buena_image_url',
            imageBaja: imageBaja ? `https://${imageBaja.ficadjunto}` : 'default_baja_image_url'
        };
    };

    // Cargar productos según búsqueda, filtros o todos los productos
    const fetchProducts = async (pageNumber = 1) => {
        setLoading(true);
        setError(null);
        try {
            let response;
            // Si hay una búsqueda activa
            if (searchQuery) {
                response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/search?query=${searchQuery}&limit=${itemsPerPage}&page=${pageNumber}`);
                setIsSearching(true);
                setIsFiltered(false); // No hay filtros cuando se realiza una búsqueda
            }
            // Si hay filtros activos
            else if (filters) {
                response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/filter?page=${pageNumber}&limit=${itemsPerPage}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(filters),
                });
                setIsFiltered(true);
                setIsSearching(false); // No hay búsqueda cuando se aplican filtros
            }
            // Cargar todos los productos sin filtros ni búsqueda
            else {
                response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products?limit=${itemsPerPage}&page=${pageNumber}`);
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

    // Cargar imágenes para los productos
    const loadProductsImages = async (products) => {
        return await Promise.all(
            products.map(async (product) => {
                return await loadProductImages(product);
            })
        );
    };

    // Cargar productos por ID
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

    // Efecto para cargar productos al cambiar búsqueda, filtros o página
    useEffect(() => {
        if (productId) {
            fetchProductsById(productId);
        } else {
            fetchProducts(page);
        }
    }, [searchQuery, productId, page, filters]);

    // Manejar productos filtrados desde el componente Filtro
    const handleFilteredProducts = (filteredProducts, selectedFilters) => {
        setProducts(filteredProducts);
        setFilters(selectedFilters);
        setIsFiltered(true); // Indicar que hay filtros activos
        setIsSearching(false); // No hay búsqueda cuando se aplican filtros
        setPage(1); // Reiniciar a la primera página
    };

    // Agregar productos al carrito
    const handleAddToCart = (product) => {
        addToCart({
            id: product.codprodu,
            name: product.desprodu,
            price: 3,
            image: product.imageBaja,
            quantity: 1
        });
    };

    // Abrir modal de producto
    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    // Limpiar búsqueda y filtros, recargar todos los productos
    const handleClearSearch = () => {
        setFilters(null);  // Limpiar los filtros
        setIsFiltered(false);  // Desactivar filtros
        setIsSearching(false);  // Desactivar búsqueda
        setPage(1);  // Reiniciar a la primera página
        navigate('/products');  // Navegar a la ruta sin parámetros de búsqueda
        fetchProducts(1);  // Recargar todos los productos
    };

    // Cambiar la página y cargar productos
    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchProducts(newPage);
    };

    return (
        <div>
            {/* Botón para limpiar filtros o búsqueda */}
            {clearButtonVisible && (
                <div className="fixed top-1/4 right-5 z-40">
                    <button onClick={handleClearSearch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full text-sm text-center w-22 sm:w-30 md:w-30">
                        Limpiar filtros
                    </button>
                </div>
            )}

            <Filtro setFilteredProducts={handleFilteredProducts} page={page} />

            <div className="flex flex-wrap justify-center items-center">
                {products.map((product, index) => (
                    <div key={`${product.codprodu}-${index}`} className="bg-white rounded-lg shadow-lg sm:p-1 md:p-2 transition duration-300 ease-in-out transform hover:scale-105 mx-2 mb-7 w-[80%] h-[90%] sm:w-[45%] md:w-[45%] lg:w-[22%] xl:w-[22%] 2xl:w-[20%]">
                        <div className="relative overflow-hidden w-full h-80 sm:h-64 md:h-64" onClick={() => handleProductClick(product)}>
                            <img
                                className="object-cover w-full h-full"
                                src={product.imageBaja}
                                alt={product.nombre}
                                onError={(e) => { e.target.src = 'default_buena_image_url'; }}
                            />
                        </div>
                        <h3 className="text-center text-lg sm:text-xl text-gray-900 mt-4">{product.nombre}</h3>
                    </div>
                ))}
            </div>

            {/* Carga de productos */}
            {loading && <SkeletonLoader repeticiones={10} />}
            {!loading && products.length === 0 && !error && (
                <div className="text-center text-gray-500">No se encontraron productos</div>
            )}
            {!loading && error && (
                <div className="text-center text-red-500">{error}</div>
            )}

            {/* Paginación */}
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

            {/* Modal del producto */}
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

export default CardProduct;
