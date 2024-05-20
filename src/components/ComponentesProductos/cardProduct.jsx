import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import SkeletonLoader from '../ComponentesProductos/skeletonLoader';
import Modal from '../ComponentesProductos/modal';

const CardProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const productId = searchParams.get('productId');
    const pageQuery = searchParams.get('page') || 1;

    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(parseInt(pageQuery, 10));
    const loader = useRef(null);

    const [searchHistory, setSearchHistory] = useState([]);
    const [showClearButton, setShowClearButton] = useState(false);

    // Function to fetch all products
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:1234/products?limit=12&page=${page}`);
            if (!response.ok) {
                throw new Error('Error fetching products');
            }
            const data = await response.json();
            const validProducts = data.filter(product => (
                !/^(LIBRO|QUALITY SAMPLE|PERCHA|ALQUILER|ACCESORIOS MUESTRARIOS|ALFOMBRAS|AGARRADERAS|ARRENDAMIENTOS INTRACOMUNITARIOS|\d+)/i.test(product.desprodu) &&
                !/CUTTING/i.test(product.desprodu) &&
                ['ARE', 'FLA', 'CJM', 'HAR'].includes(product.codmarca)
            ));
            setProducts(prevProducts => [...prevProducts, ...validProducts]);
        } catch (error) {
            setError('Error fetching products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchQuery && !productId) {
            fetchProducts();
        }
    }, [page, searchQuery, productId]);

    useEffect(() => {
        if (searchQuery) {
            const fetchSearchedProducts = async () => {
                setLoading(true);
                setError(null);
                setProducts([]); // Clear products before a new search
                try {
                    const response = await fetch(`http://localhost:1234/products/search?query=${searchQuery}`);
                    if (!response.ok) {
                        throw new Error('Error fetching search results');
                    }
                    const data = await response.json();
                    const filteredData = data.filter(product =>
                        !searchHistory.some(historyItem => historyItem.codprodu === product.codprodu)
                    );
                    if (filteredData.length === 0) {
                        setError('No products found');
                    }
                    setProducts(filteredData);
                    setSearchHistory(prevHistory => [...prevHistory, ...filteredData]);
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
                    const response = await fetch(`http://localhost:1234/products/${productId}`);
                    if (!response.ok) {
                        throw new Error('Error fetching product by ID');
                    }
                    const data = await response.json();
                    setProducts([data]);
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
            image: product.urlimagen,
            quantity: 1
        });
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleClearSearch = () => {
        navigate(location.pathname);
        setProducts([]);
        setPage(1);
        setShowClearButton(false); // Hide the clear button when clearing the search
        fetchProducts(); // Fetch all products when clearing the search
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !searchQuery && !productId) {
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 1 }
        );
        if (loader.current) {
            observer.observe(loader.current);
        }
        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, [searchQuery, productId]);

    return (
        <>
            <div>
                {showClearButton && (
                    <div className="fixed top-1/4 right-5 z-40">
                        <button onClick={handleClearSearch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm text-center w-22 sm:w-30 md:w-30">
                            Mostrar<br />productos
                        </button>
                    </div>
                )}
                <div className="flex flex-wrap justify-center items-center">
                    {products.map(product => (
                        <div key={product.codprodu} className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out transform hover:scale-105 mx-2 mb-7 max-h-[20%] xl:max-w-[20%] min-h-[70%] max-w-[80%] sm:max-w-[40%] md:max-h-[30%] xl:min-h-[20%] xl:min-w-[20%]">
                            <div className="relative overflow-hidden" onClick={() => handleProductClick(product)}>
                                <img className="object-cover w-full h-full" src={product.urlimagen} alt={product.desprodu} style={{ objectFit: 'cover', height: '200px', width: '100%' }} />
                                <div className="absolute inset-0 bg-black opacity-40"></div>
                            </div>
                            <h3 className="text-center text-xl font-bold text-gray-900 mt-4">{product.desprodu}</h3>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-gray-900 font-bold text-lg">€3</span>
                                <button onClick={() => handleAddToCart(product)} className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">Adquirir muestra</button>
                            </div>
                        </div>
                    ))}
                </div>
                {loading && <SkeletonLoader repeticiones={12} />}
                {!loading && products.length === 0 && !error && (
                    <div className="text-center text-gray-500">No products found</div>
                )}
                {!loading && error && (
                    <div className="text-center text-red-500">{error}</div>
                )}
                {!searchQuery && !productId && <div ref={loader}></div>}
                {modalOpen && (
                    <Modal isOpen={modalOpen} close={() => setModalOpen(false)} product={selectedProduct} />
                )}
            </div>
        </>
    );
};

export default CardProduct;
