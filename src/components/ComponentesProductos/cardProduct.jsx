import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import SkeletonLoader from '../ComponentesProductos/skeletonLoader';
import Modal from '../ComponentesProductos/modal';

const CardProduct = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetch('http://localhost:1234/products')
            .then(response => response.json())
            .then(data => {
                const validProducts = data.filter(product => !/^(LIBRO|QUALITY SAMPLE|PERCHA|ALQUILER|ACCESORIOS MUESTRARIOS|ALFOMBRAS|AGARRADERAS|ARRENDAMIENTOS INTRACOMUNITARIOS|\d+)/i.test(product.desprodu));
                setProducts(validProducts);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const lowercasedQuery = searchQuery.toLowerCase();
            const sortedProducts = [...products].sort((a, b) => {
                const matchA = a.desprodu.toLowerCase().includes(lowercasedQuery);
                const matchB = b.desprodu.toLowerCase().includes(lowercasedQuery);
                if (matchA && !matchB) return -1;
                if (matchB && !matchA) return 1;
                return a.desprodu.localeCompare(b.desprodu);
            });
            setFilteredProducts(sortedProducts);
        } else {
            setFilteredProducts(products);
        }
    }, [searchQuery, products]);

    const handleAddToCart = (product) => {
        addToCart({
            id: product.codprodu,
            name: product.desprodu,
            price: 3, // Define el precio aquí o extrae de product
            image: product.imageUrl,
            quantity: 1
        });
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    return (
        <div>
            {loading ? (
                <SkeletonLoader repeticiones={(12)}/>
            ) : (
                <div className="flex flex-wrap justify-center items-center">
                    {filteredProducts.map(product => (
                        <div key={product.codprodu} className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out transform hover:scale-105 max-h-[20%] xl:max-w-[20%] min-h-[70%] max-w-[80%] sm:max-w-[40%] md:max-h-[30%] xl:min-h-[20%] xl:min-w-[20%] mx-2 mb-7">
                            <div className="relative overflow-hidden" onClick={() => handleProductClick(product)}>
                                <img className="object-cover w-full h-full" src={product.imageUrl} alt={product.desprodu} />
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
            )}
            {modalOpen && (
                <Modal isOpen={modalOpen} close={() => setModalOpen(false)} product={selectedProduct} />
            )}
        </div>
    );
};

export default CardProduct;
