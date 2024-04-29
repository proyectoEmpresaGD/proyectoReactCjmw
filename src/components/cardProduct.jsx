import { useState, useEffect } from 'react';
import SkeletonLoader from "./skeletonLoader";  // Verifica que el nombre del archivo coincida exactamente

const CardProduct = () => {
    const [selectedColor, setSelectedColor] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    useEffect(() => {
        fetch('http://localhost:1234/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(products => {
                if (!Array.isArray(products)) {
                    console.error('Expected an array of products, but received:', products);
                    return;
                }
               const filteredProducts = products.filter(product => ['ARE', 'FLA', 'CJM', 'HAR'].includes(product.codmarca));
                setProducts(filteredProducts);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);  // Maneja el estado de loading incluso en caso de error
            });
    }, []);

    return (
        <div>
            {loading ? (
                <div>
                    <SkeletonLoader />
                    <SkeletonLoader />
                    <SkeletonLoader />
                </div>
            ) : (
                <div className="flex flex-wrap justify-center items-center">
                    {products.map(product => (
                        <div key={product.codprodu} className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out transform hover:scale-105 max-h-[20%] xl:max-w-[20%] min-h-[70%] max-w-[80%] sm:max-w-[40%] md:max-h-[30%] xl:min-h-[20%] xl:min-w-[20%] mx-2 mb-7">
                            <div className="relative overflow-hidden">
                                <img className="object-cover w-full h-full" src={selectedColor ? `https://example.com/${selectedColor}-image.jpg` : '1200ARENADUNE01.jpg'} alt="Product" />
                                <div className="absolute inset-0 bg-black opacity-40"></div>
                            </div>
                            <div className="flex justify-center space-x-4 mt-4">
                                <div className={`h-6 w-6 rounded-full bg-red-500 cursor-pointer ${selectedColor === 'red' ? 'border-2 border-gray-900' : ''}`} onClick={() => handleColorSelect('red')}></div>
                                <div className={`h-6 w-6 rounded-full bg-blue-500 cursor-pointer ${selectedColor === 'blue' ? 'border-2 border-gray-900' : ''}`} onClick={() => handleColorSelect('blue')}></div>
                                <div className={`h-6 w-6 rounded-full bg-green-500 cursor-pointer ${selectedColor === 'green' ? 'border-2 border-gray-900' : ''}`} onClick={() => handleColorSelect('green')}></div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mt-4">{product.desprodu}</h3>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-gray-900 font-bold text-lg">3€</span>
                                <button className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">Adquirir muestra</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CardProduct;

