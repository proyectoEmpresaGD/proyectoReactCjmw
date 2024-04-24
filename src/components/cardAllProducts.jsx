import { useState } from 'react';

const CardAllProducts = () => {
    const [selectedColor, setSelectedColor] = useState(null);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    return (
        <div className="bg-gradient-to-b from-white to-gray-300 py-16">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-black">Introducing Our Latest Product</h2>
                    <button className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">Ver toda la colección</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Primer Producto */}
                    <div className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out transform hover:scale-105">
                        <div className="relative overflow-hidden">
                            <img className="object-cover w-full h-full" src={selectedColor ? `https://example.com/${selectedColor}-image.jpg` : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'} alt="Product" />
                            <div className="absolute inset-0 bg-black opacity-40"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                
                            </div>
                        </div>
                        <div className="flex justify-center space-x-4 mt-4">
                            <div className={`h-6 w-6 rounded-full bg-red-500 cursor-pointer ${selectedColor === 'red' ? 'border-2 border-gray-900' : ''}`} onClick={() => handleColorSelect('red')}></div>
                            <div className={`h-6 w-6 rounded-full bg-blue-500 cursor-pointer ${selectedColor === 'blue' ? 'border-2 border-gray-900' : ''}`} onClick={() => handleColorSelect('blue')}></div>
                            <div className={`h-6 w-6 rounded-full bg-green-500 cursor-pointer ${selectedColor === 'green' ? 'border-2 border-gray-900' : ''}`} onClick={() => handleColorSelect('green')}></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mt-4">Product Name</h3>
                        <p className="text-gray-500 text-sm mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed ante justo. Integer euismod libero id mauris malesuada tincidunt.</p>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-gray-900 font-bold text-lg">$29.99</span>
                            <button className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">Add to Cart</button>
                        </div>
                    </div>
                    {/* Segundo Producto */}
                    <div className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out transform hover:scale-105">
                        <div className="relative overflow-hidden">
                            <img className="object-cover w-full h-full" src={selectedColor ? `https://example.com/${selectedColor}-image.jpg` : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'} alt="Product" />
                            <div className="absolute inset-0 bg-black opacity-40"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                
                            </div>
                        </div>
                        <div className="flex justify-center space-x-4 mt-4">
                            <div className={`h-6 w-6 rounded-full bg-red-500 cursor-pointer ${selectedColor === 'red' ? 'border-2 border-gray-900' : ''}`} onClick={() => handleColorSelect('red')}></div>
                            <div className={`h-6 w-6 rounded-full bg-blue-500 cursor-pointer ${selectedColor === 'blue' ? 'border-2 border-gray-900' : ''}`} onClick={() => handleColorSelect('blue')}></div>
                            <div className={`h-6 w-6 rounded-full bg-green-500 cursor-pointer ${selectedColor === 'green' ? 'border-2 border-gray-900' : ''}`} onClick={() => handleColorSelect('green')}></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mt-4">Product Name</h3>
                        <p className="text-gray-500 text-sm mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed ante justo. Integer euismod libero id mauris malesuada tincidunt.</p>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-gray-900 font-bold text-lg">$29.99</span>
                            <button className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">Add to Cart</button>
                        </div>
                    </div>
                    {/* Tercer Producto */}
                    <div className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out transform hover:scale-105">
                        <div className="relative overflow-hidden">
                            <img className="object-cover w-full h-full" src={selectedColor ? `https://example.com/${selectedColor}-image.jpg` : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'} alt="Product" />
                            <div className="absolute inset-0 bg-black opacity-40"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                
                            </div>
                        </div>
                        <div className="flex justify-center space-x-4 mt-4">
                            <div className={`h-6 w-6 rounded-full bg-red-500 cursor-pointer ${selectedColor === 'red' ? 'border-2 border-gray-900' : ''}`} onClick={() => handleColorSelect('red')}></div>
                            <div className={`h-6 w-6 rounded-full bg-blue-500 cursor-pointer ${selectedColor === 'blue' ? 'border-2 border-gray-900' : ''}`} onClick={() => handleColorSelect('blue')}></div>
                            <div className={`h-6 w-6 rounded-full bg-green-500 cursor-pointer ${selectedColor === 'green' ? 'border-2 border-gray-900' : ''}`} onClick={() => handleColorSelect('green')}></div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mt-4">Product Name</h3>
                        <p className="text-gray-500 text-sm mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed ante justo. Integer euismod libero id mauris malesuada tincidunt.</p>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-gray-900 font-bold text-lg">$29.99</span>
                            <button className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardAllProducts;
