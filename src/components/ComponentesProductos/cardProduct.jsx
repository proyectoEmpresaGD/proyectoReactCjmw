import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import SkeletonLoader from '../ComponentesProductos/skeletonLoader';
import Modal from '../ComponentesProductos/modal';
import { FiShoppingCart } from 'react-icons/fi';
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
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [offset, setOffset] = useState(0);
    const [showClearButton, setShowClearButton] = useState(false);
    const itemsPerPage = 16;

    const fetchProducts = async (newOffset) => {
        setError(null);
        if (newOffset === 0) setLoading(true); else setLoadingMore(true);
    
        try {
            const url = `${import.meta.env.VITE_API_BASE_URL}/api/products?limit=${itemsPerPage}&offset=${newOffset}`;
            console.log('Fetching URL:', url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching products');
            }
            const { products, nextOffset } = await response.json();
            console.log('Fetched Products:', products);
    
            const productsWithImages = await Promise.all(
                products.map(async (product) => {
                    const [imageBuena, imageBaja] = await Promise.all([
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Buena`)
                            .then(res => res.ok ? res.json() : null)
                            .catch(() => null),
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Baja`)
                            .then(res => res.ok ? res.json() : null)
                            .catch(() => null)
                    ]);
    
                    return {
                        ...product,
                        imageBuena: imageBuena ? `https://${imageBuena.ficadjunto}` : 'default_buena_image_url',
                        imageBaja: imageBaja ? `https://${imageBaja.ficadjunto}` : 'default_baja_image_url'
                    };
                })
            );
    
            setProducts(prevProducts => {
                // Aseguramos que no se acumulen productos con nombres duplicados
                const uniqueProducts = new Map();
                [...prevProducts, ...productsWithImages].forEach(product => {
                    if (!uniqueProducts.has(product.nombre)) {
                        uniqueProducts.set(product.nombre, product);
                    }
                });
                return Array.from(uniqueProducts.values());
            });
    
            // Actualizamos el offset usando el valor devuelto por el backend
            setOffset(nextOffset);
    
        } catch (error) {
            console.error('Fetch Error:', error);
            setError('Error fetching products');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };
    
    const handleLoadMore = () => {
        fetchProducts(offset);  // Llamada con el offset actualizado
    };
    

    useEffect(() => {
        if (!searchQuery && !productId) {
            fetchProducts(offset);
        }
    }, [searchQuery, productId]);

    useEffect(() => {
        if (searchQuery) {
            const fetchSearchedProducts = async () => {
                setLoading(true);
                setError(null);
                setProducts([]);
                setOffset(0); // Reset offset for new search
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/search?query=${searchQuery}&limit=${itemsPerPage}`);
                    if (!response.ok) {
                        throw new Error('Error fetching search results');
                    }
                    const data = await response.json();

                    const productsWithImages = await Promise.all(
                        data.map(async (product) => {
                            const [imageBuena, imageBaja] = await Promise.all([
                                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Buena`).then(res => res.ok ? res.json() : null),
                                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${product.codprodu}/Baja`).then(res => res.ok ? res.json() : null)
                            ]);

                            return {
                                ...product,
                                imageBuena: imageBuena ? `https://${imageBuena.ficadjunto}` : 'default_buena_image_url',
                                imageBaja: imageBaja ? `https://${imageBaja.ficadjunto}` : 'default_baja_image_url'
                            };
                        })
                    );

                    setProducts(productsWithImages);
                    setShowClearButton(true); // Show the clear button after a search
                } catch (error) {
                    setError('Error fetching search results');
                    setShowClearButton(true); // Show the clear button even if there's an error
                } finally {
                    setLoading(false);
                }
            };
            fetchSearchedProducts();
        }
    }, [searchQuery]);

    useEffect(() => {
        if (productId) {
            const fetchProductById = async () => {
                setLoading(true);
                setError(null);
                setProducts([]); // Clear products before fetching a specific product
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`);
                    if (!response.ok) {
                        throw new Error('Error fetching product by ID');
                    }
                    const data = await response.json();

                    const [imageBuena, imageBaja] = await Promise.all([
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${data.codprodu}/Buena`).then(res => res.ok ? res.json() : null),
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/images/${data.codprodu}/Baja`).then(res => res.ok ? res.json() : null)
                    ]);

                    const productWithImages = {
                        ...data,
                        imageBuena: imageBuena ? `https://${imageBuena.ficadjunto}` : 'default_buena_image_url',
                        imageBaja: imageBaja ? `https://${imageBaja.ficadjunto}` : 'default_baja_image_url'
                    };

                    setProducts([productWithImages]);
                    setShowClearButton(true); // Show the clear button after fetching a specific product
                } catch (error) {
                    setError('Error fetching product by ID');
                    setShowClearButton(true); // Show the clear button even if there's an error
                } finally {
                    setLoading(false);
                }
            };
            fetchProductById();
        }
    }, [productId]);

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

    const handleClearSearch = () => {
        navigate('/products');
        setProducts([]);
        setOffset(0); // Reset offset when clearing search
        setShowClearButton(false); // Hide the clear button when clearing the search
        fetchProducts(0); // Fetch all products when clearing the search
    };

    return (
        <>
            <div>
                {showClearButton && (
                    <div className="fixed top-1/4 right-5 z-40">
                        <button onClick={handleClearSearch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-full text-sm text-center w-22 sm:w-30 md:w-30">
                            Mostrar<br />productos
                        </button>
                    </div>
                )}
                <Filtro setFilteredProducts={setProducts} />
                <div className="flex flex-wrap justify-center items-center">
                    {products.map((product, index) => (
                        <div key={`${product.codprodu}-${index}`} className="bg-white rounded-lg shadow-lg sm:p-1 md:p-2 transition duration-300 ease-in-out transform hover:scale-105 mx-2 mb-7 w-[80%] h-[90%] sm:w-[45%] md:w-[45%] lg:w-[22%] xl:w-[22%] 2xl:w-[20%]">
                            <div className="relative overflow-hidden w-full h-80 sm:h-64 md:h-64" onClick={() => handleProductClick(product)}>
                                <img
                                    className="object-cover w-full h-full"
                                    src={product.imageBaja}
                                    alt={product.nombre}
                                    onError={(e) => { e.target.src = 'default_buena_image_url'; }}
                                    style={{ filter: 'saturate(1.5) brightness(1.3)' }}
                                />
                                <div className="absolute inset-0 bg-black opacity-40"></div>
                            </div>
                            <h3 className="text-center text-lg sm:text-xl text-gray-900 mt-4">{product.nombre}</h3>
                        </div>
                    ))}
                </div>
                {loading && <SkeletonLoader repeticiones={10} />}
                {!loading && products.length === 0 && !error && (
                    <div className="text-center text-gray-500">No products found</div>
                )}
                {!loading && error && (
                    <div className="text-center text-red-500">{error}</div>
                )}
                {!loadingMore && !loading && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleLoadMore}
                            className="px-4 py-2 mx-1 bg-gray-300 rounded"
                        >
                            Cargar más productos
                        </button>
                    </div>
                )}
                {modalOpen && (
                    <Modal isOpen={modalOpen} close={() => setModalOpen(false)} product={selectedProduct} />
                )}
            </div>
        </>
    );
};

export default CardProduct;
