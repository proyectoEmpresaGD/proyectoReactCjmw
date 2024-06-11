import { useEffect, useState } from 'react';
import { useCart } from '../components/CartContext'; // Asegúrate de ajustar la ruta según tu estructura de carpetas

const ShoppingCart = ({ onClose }) => {
    const { cartItems, addToCart, removeFromCart } = useCart();
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        // Cuando el componente se monta, esperamos un pequeño tiempo y luego mostramos el carrito
        const timer = setTimeout(() => {
            setShowCart(true);
        }, 100);

        // Limpiamos el temporizador en caso de que el componente se desmonte antes de que se muestre el carrito
        return () => clearTimeout(timer);
    }, []);

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0).toFixed(2);

    return (
        <div className={`fixed top-0 right-0 z-50 w-full max-w-md h-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="overflow-y-auto p-4">
                {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <img src={item.image} alt={item.name} className="h-16 w-16 rounded-full object-cover mr-4" />
                            <div>
                                <h5 className="text-md font-semibold">{item.name}</h5>
                                <p className="text-sm text-gray-600">{`Size: ${item.size}, Color: ${item.color}`}</p>
                                <p className="text-sm font-semibold">${item.price}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button onClick={() => removeFromCart(item.id)} className="px-2 py-1 text-gray-600 border rounded hover:bg-gray-100">-</button>
                            <span className="mx-2 text-lg">{item.quantity}</span>
                            <button onClick={() => addToCart(item)} className="px-2 py-1 text-gray-600 border rounded hover:bg-gray-100">+</button>
                            <button onClick={() => removeFromCart(item.id, true)} className="ml-2 px-2 py-1 text-red-500 border rounded hover:bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600">Total:</span>
                    <span className="text-lg font-semibold">${totalPrice}</span>
                </div>
                <button onClick={() => console.log("Proceeding to checkout...")} className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default ShoppingCart;
