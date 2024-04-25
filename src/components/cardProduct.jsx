import { useState } from 'react';
    
const cardProduct = () => {
    const [selectedColor, setSelectedColor] = useState(null);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };
    return (
        <>
            <div className="bg-white rounded-lg shadow-lg p-8 transition duration-300 ease-in-out transform hover:scale-105 max-h-[20%] max-w-[20%] min-h-[20%] min-w-[20%] mx-2 mb-7">
                <div className="relative overflow-hidden">
                    <img className="object-cover w-full h-full" src={selectedColor ? `https://example.com/${selectedColor}-image.jpg` : '1200ARENADUNE01.jpg'} alt="Product" />
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
                
                <div className="flex items-center justify-between mt-4">
                    <span className="text-gray-900 font-bold text-lg">$29.99</span>
                    <button className="bg-gray-900 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800">Add to Cart</button>
                </div>
            </div>
        </>
    )
}
export default cardProduct

