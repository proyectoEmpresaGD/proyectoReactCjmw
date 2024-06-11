import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import SkeletonLoader from '../ComponentesProductos/skeletonLoader';
import Modal from '../ComponentesProductos/modal';
import { FiLoader, FiShoppingCart } from 'react-icons/fi';
import NotFoundPage from "../notFoundPage";
import Filtro from '../../app/products/buttonFiltro';

const CardProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const productId = searchParams.get('productId');

    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [productImages, setProductImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [page, setPage] = useState(1);
    const loader = useRef(null);

    const [searchHistory, setSearchHistory] = useState([]);
    const [showClearButton, setShowClearButton] = useState(false);

    const isValidProduct = (product) => {
        const desprodu = product.desprodu;
        return (
            /^C1/.test(desprodu) || 
            /^C01/.test(desprodu) || 
            !/C(0?[2-9]|[1-7][0-9]|80)\b/.test(desprodu) 
        );
    };

    const fetchProducts = async (pageNumber = 1, append = false) => {
        if (!append) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(null);
        try {
            console.log(`Fetching products page ${pageNumber}`);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products?limit=10&page=${pageNumber}`);
            if (!response.ok) {
                throw new Error('Error fetching products');
            }
            const data = await response.json();
            const validProducts = data.filter(product => (
                isValidProduct(product) &&
                !/^(LIBRO|PORTADA|SET|KIT|COMPOSICION ESPECIAL|COLECCIÓN|ALFOMBRAS|ANUNCIADA|MULETON|ATLAS|QUALITY SAMPLE|PERCHA|ALQUILER|CALCUTA C35|TAPILLA|LÁMINA|ACCESORIOS MUESTRARIOS|CONTRAPORTADA|ALFOMBRAS|AGARRADERAS|ARRENDAMIENTOS INTRACOMUNITARIOS|\d+)/i.test(product.desprodu) &&
                !/(PERCHAS Y LIBROS)/i.test(product.desprodu) &&
                !/CUTTING/i.test(product.desprodu) &&
                !/(LIBROS)/i.test(product.desprodu) &&
                !/PERCHA/i.test(product.desprodu) &&
                !/(FUERA DE COLECCIÓN)/i.test(product.desprodu) &&
                !/(PERCHAS)/i.test(product.desprodu) &&
                !/(FUERA DE COLECCION)/i.test(product.desprodu) &&
                ['ARE', 'FLA', 'CJM', 'HAR'].includes(product.codmarca)
            ));
            setProducts(prevProducts => append ? [...prevProducts, ...validProducts] : validProducts);
            console.log('Fetched products:', validProducts);
        } catch (error) {
            setError('Error fetching products');
            console.error(error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (!searchQuery && !productId) {
            fetchProducts(1, false);
        }
    }, [searchQuery, productId]);

    useEffect(() => {
        if (searchQuery) {
            const fetchSearchedProducts = async () => {
                setLoading(true);
                setError(null);
                setProducts([]);
                try {
                    console.log(`Searching products for query: ${searchQuery}`);
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/search?query=${searchQuery}&limit=10`);
                    if (!response.ok) {
                        throw new Error('Error fetching search results');
                    }
                    const data = await response.json();
                    const filteredData = data.filter(product =>
                        isValidProduct(product) &&
                        !searchHistory.some(historyItem => historyItem.codprodu === product.codprodu)
                    );
                    if (filteredData.length === 0) {
                        setError('No products found');
                    }
                    setProducts(filteredData);
                    setSearchHistory(prevHistory => [...prevHistory, ...filteredData]);
                    setShowClearButton(true);
                    console.log('Searched products:', filteredData);
                } catch (error) {
                    setError('Error fetching search results');
                    setShowClearButton(true);
                    console.error(error);
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
                setProducts([]);
                try {
                    console.log(`Fetching product by ID: ${productId}`);
                    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${productId}`);
                    if (!response.ok) {
                        throw new Error('Error fetching product by ID');
                    }
                    const data = await response.json();

                    const goodImageResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/images/${productId}?quality=Buena`);
                    const badImageResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/images/${productId}?quality=Mala`);

                    if (!goodImageResponse.ok) {
                        throw new Error('Error fetching good image');
                    }
                    if (!badImageResponse.ok) {
                        throw new Error('Error fetching bad image');
                    }

                    const goodImage = await goodImageResponse.text();
                    const badImage = await badImageResponse.text();

                    console.log('goodImage:', goodImage);
                    console.log('badImage:', badImage);

                    setProductImages(prevImages => ({
                        ...prevImages,
                        [productId]: { goodImage, badImage }
                    }));

                    setProducts([data]);
                    console.log('Fetched product by ID:', data);
                } catch (error) {
                    console.error('Error fetching product by ID:', error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProductById();
        }
    }, [productId]);

    const handleAddToCart = (product) => {
        const images = productImages[product.codprodu] || {};
        addToCart({
            id: product.codprodu,
            name: product.desprodu,
            price: 0.8,
            image: images.goodImage, // Use the good image directly
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
        setPage(1);
        setShowClearButton(false); // Hide the clear button when clearing the search
        fetchProducts(1, false); // Fetch all products when clearing the search
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !searchQuery && !productId) {
                    setPage((prevPage) => {
                        const nextPage = prevPage + 1;
                        fetchProducts(nextPage, true);
                        return nextPage;
                    });
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
                <Filtro setFilteredProducts={setProducts} />
                <div className="flex flex-wrap justify-center items-center">
                    {products.map((product, index) => (
                        <div key={`${product.codprodu}-${index}`} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 transition duration-300 ease-in-out transform hover:scale-105 mx-2 mb-7 w-[80%] h-[90%] sm:w-[45%] md:w-[45%] lg:w-[22%] xl:w-[22%] 2xl:w-[20%]">
                            <div className="relative overflow-hidden w-full h-64 xl:h-64 lg:h-64 sm:h-64 md:h-64" onClick={() => handleProductClick(product)}>
                                {productImages[product.codprodu]?.badImage ? (
                                    <img className="object-cover w-full h-full" src={productImages[product.codprodu].badImage} alt={product.desprodu} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <span className="text-gray-500">No image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black opacity-40"></div>
                            </div>
                            <h3 className="text-center text-md sm:text-xl font-semibold text-gray-900 mt-4">{product.desprodu}</h3>
                            <div className="flex items-center justify-between mt-4">
                                <button onClick={() => handleAddToCart(product)} className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">
                                    <FiShoppingCart className="text-2xl" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {loading && !loadingMore && <SkeletonLoader repeticiones={10} />}
                {loadingMore && (
                    <div className="flex flex-col items-center justify-center w-full py-4">
                        <FiLoader className="animate-spin text-6xl text-gray-500" />
                        <span className="text-gray-500 text-2xl mt-4">Cargando más productos...</span>
                    </div>
                )}
                {!loading && products.length === 0 && !error && (
                    <div className="text-center text-gray-500"></div>
                )}
                {!loading && error && (
                    <div className="w-full h-full"><NotFoundPage /></div>
                )}
                <div ref={loader}></div>
                {modalOpen && (
                    <Modal isOpen={modalOpen} close={() => setModalOpen(false)} product={selectedProduct} />
                )}
            </div>
        </>
    );
};

export default CardProduct;