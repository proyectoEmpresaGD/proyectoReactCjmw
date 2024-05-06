import { useState } from "react";

const ShoppingCart = ({ onClose }) => {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Basic Tee 6-Pack", size: "XXS", color: "White", quantity: 1, price: 20, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80" },
        { id: 2, name: "Casual Jeans", size: "M", color: "Blue", quantity: 2, price: 35, image: "https://images.unsplash.com/photo-1583779152778-94ab68da6c5a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" },
    ]);

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    const handleRemoveItem = (itemId) => {
        setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    const handleIncreaseQuantity = (itemId) => {
        setCartItems(cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const handleDecreaseQuantity = (itemId) => {
        setCartItems(cartItems.map(item =>
            item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    const handleCheckout = () => {
        // Aquí puedes agregar la lógica para redirigir a la página de pago
        console.log("Redirecting to payment page...");
    };

    return (
        <div className="fixed top-0 right-0 z-50 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-auto bg-transparent">
            <div className="h-full flex flex-col bg-white shadow-md rounded-tl-xl rounded-tr-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
                    <button className="text-gray-600 hover:text-red-600" onClick={onClose}>
                        <span className="sr-only">Close</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-2">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between border-b border-gray-200 py-2">
                            <div className="flex items-center">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-600">{item.size}, {item.color}</p>
                                    <p className="text-sm text-gray-600">${item.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button className="text-gray-600 hover:text-gray-900 focus:outline-none" onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                                <span className="px-2 text-lg font-semibold">{item.quantity}</span>
                                <button className="text-gray-600 hover:text-gray-900 focus:outline-none" onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                                <button className="ml-4 text-gray-600 hover:text-red-600 focus:outline-none" onClick={() => handleRemoveItem(item.id)}>
                                    <span className="sr-only">Remove item</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-100">
                    <span className="text-base text-gray-600">Total: ${totalPrice}</span>
                    <button onClick={handleCheckout} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;