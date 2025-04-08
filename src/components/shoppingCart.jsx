import React, { useEffect, useState } from 'react';
import { useCart } from '../components/CartContext';
import { cartConfig, cartTexts } from '../Constants/constants';
import { apiUrl } from '../Constants/constants.jsx';

// Modal para recopilar los datos del pedido
const OrderModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        isClient: false,
        cif: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Tramitar Pedido</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="zona" className="block text-sm font-medium text-gray-700">
                            Zona de envío
                        </label>
                        <select
                            id="zona"
                            name="zona"
                            value={formData.zona}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="ESPAÑA PENINSULAR">España peninsular</option>
                            <option value="BALEARES">Islas Baleares</option>
                            <option value="CANARIAS">Islas Canarias</option>
                            <option value="CEUTA">Ceuta</option>
                            <option value="MELILLA">Melilla</option>
                        </select>

                        <div className="flex items-center mt-2 text-sm text-gray-600">
                            <img
                                src="https://bassari.eu/ImagenesTelasCjmw/Iconos/ICONOS%20WEB/local_shipping_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                                alt="Icono de envío"
                                className="w-5 h-5 mr-2 inline-block"
                            />
                            Los costos de los portes van aparte
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="isClient"
                            name="isClient"
                            type="checkbox"
                            checked={formData.isClient}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label htmlFor="isClient" className="ml-2 text-sm text-gray-900">
                            ¿Es cliente nuestro?
                        </label>
                    </div>
                    {formData.isClient && (
                        <div>
                            <label htmlFor="cif" className="block text-sm font-medium text-gray-700">CIF de la empresa</label>
                            <input
                                id="cif"
                                name="cif"
                                type="text"
                                value={formData.cif}
                                onChange={handleChange}
                                required={formData.isClient}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Tramitar Pedido
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Componente del carrito de compras
const ShoppingCart = ({ onClose }) => {
    const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
    const [showCart, setShowCart] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCart(true);
        }, cartConfig.cartOpenDelay);

        return () => clearTimeout(timer);
    }, []);

    const totalPrice = cartItems
        .reduce((acc, item) => acc + item.quantity * item.price, 0)
        .toFixed(2);

    const handleOrderSubmit = async (orderData) => {
        try {
            const response = await fetch(`${apiUrl}/api/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...orderData, cartItems })
            });

            if (!response.ok) {
                throw new Error('Error al tramitar el pedido.');
            }

            // Vaciar el carrito después de un pedido exitoso
            clearCart();

            setShowOrderModal(false);
            alert("Su pedido se está tramitando. En breve nos pondremos en contacto.");
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error al tramitar el pedido. Por favor, inténtelo de nuevo.");
        }
    };

    return (
        <div
            className={`fixed top-0 right-0 z-50 w-full max-w-md h-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${showCart ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">{cartTexts.cartTitle}</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="overflow-y-auto p-4">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 rounded-full object-cover mr-4"
                            />
                            <div>
                                <h5 className="text-md font-semibold">{item.name}</h5>
                                <p className="text-sm text-gray-600">
                                    {`${cartTexts.width}: ${item.ancho}, ${cartTexts.color}: ${item.color}`}
                                </p>
                                <p className="text-sm font-semibold">€{item.price}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="px-2 py-1 text-gray-600 border rounded hover:bg-gray-100"
                            >
                                -
                            </button>
                            <span className="mx-2 text-lg">{item.quantity}</span>
                            <button
                                onClick={() => addToCart(item, true)}
                                className="px-2 py-1 text-gray-600 border rounded hover:bg-gray-100"
                            >
                                +
                            </button>
                            <button
                                onClick={() => removeFromCart(item.id, true)}
                                className="ml-2 px-2 py-1 text-red-500 border rounded hover:bg-gray-100"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-base text-gray-600">{cartTexts.totalLabel}</span>
                    <span className="text-lg font-semibold">€{totalPrice}</span>
                </div>
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => setShowOrderModal(true)}
                        disabled
                        className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-600"
                    >
                        In development
                    </button>
                </div>
            </div>
            {showOrderModal && (
                <OrderModal onClose={() => setShowOrderModal(false)} onSubmit={handleOrderSubmit} />
            )}
        </div>
    );
};

export default ShoppingCart;
