import { useState, useEffect, useContext } from 'react';
import { useCart } from '../CartContext';
import SkeletonLoader from "../ComponentesProductos/skeletonLoader";
import Modal from "../ComponentesProductos/modal";

const CardProduct = () => {
    const { addToCart, itemCount } = useCart();
    const [selectedColor, setSelectedColor] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showAddedMessage, setShowAddedMessage] = useState(false);

    useEffect(() => {
        fetch('http://localhost:1234/products')
            .then(response => response.json())
            .then(data => {
                const filteredProducts = data.filter(product => {
                    return !/^(LIBRO|QUALITY SAMPLE|PERCHA|ALQUILER|ACCESORIOS MUESTRARIOS|ALFOMBRAS|AGARRADERAS|ARRENDAMIENTOS INTRACOMUNITARIOS|\d+)/i.test(product.desprodu);
                }).sort((a, b) => a.desprodu.localeCompare(b.desprodu));
                setProducts(filteredProducts);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);

    const handleAddToCart = (product) => {
        addToCart({
            id: product.codprodu,
            name: product.desprodu,
            price: 3, // Define el precio aquí o extrae de product
            image: selectedColor ? `https://example.com/${selectedColor}-image.jpg` : product.imageUrl,
            quantity: 1
        });
        setShowAddedMessage(true);
        setTimeout(() => setShowAddedMessage(false), 2000); // La notificación desaparece después de 2 segundos
    };

    return (
        <div>
            {loading ? (
                <SkeletonLoader />
            ) : (
                <div className="flex flex-wrap justify-center items-center">
                    {products.map(product => (
                        <div key={product.codprodu} className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out transform hover:scale-105 max-h-[20%] xl:max-w-[20%] min-h-[70%] max-w-[80%] sm:max-w-[40%] md:max-h-[30%] xl:min-h-[20%] xl:min-w-[20%] mx-2 mb-7">
                            <div className="relative overflow-hidden" onClick={() => handleProductClick(product)}>
                                <img className="object-cover w-full h-full" src={selectedColor ? `https://example.com/${selectedColor}-image.jpg` : 'https://cjmw.eu/ANTILLA%20CACAO%201200.jpg'} alt={product.desprodu} />
                                <div className="absolute inset-0 bg-black opacity-40"></div>
                            </div>
                            <div className="flex justify-center space-x-4 mt-4">
                                <div className={`h-6 w-6 rounded-full bg-red-500 cursor-pointer ${selectedColor === 'red' ? 'border-2 border-gray-900' : ''}`} onClick={() => setSelectedColor('red')}></div>
                                <div className={`h-6 w-6 rounded-full bg-blue-500 cursor-pointer ${selectedColor === 'blue' ? 'border-2 border-gray-900' : ''}`} onClick={() => setSelectedColor('blue')}></div>
                                <div className={`h-6 w-6 rounded-full bg-green-500 cursor-pointer ${selectedColor === 'green' ? 'border-2 border-gray-900' : ''}`} onClick={() => setSelectedColor('green')}></div>
                            </div>
                            <h3 className="text-center text-xl font-bold text-gray-900 mt-4">{product.desprodu}</h3>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-gray-900 font-bold text-lg">€3</span>
                                <button onClick={() => handleAddToCart(product)} className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">Adquirir muestra</button>
                            </div>
                        </div>
                    ))}
                    {showAddedMessage && (
                        <div className="fixed top-20 right-2 bg-green-200 text-green-800 p-2 rounded">
                            Producto agregado correctamente
                        </div>
                    )}
                </div>
            )}
            {modalOpen && (
                <Modal isOpen={modalOpen} close={() => setModalOpen(false)} product={selectedProduct} />
            )}
        </div>
    );
};

export default CardProduct;
