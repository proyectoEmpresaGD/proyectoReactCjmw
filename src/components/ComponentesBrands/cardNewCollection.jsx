import { useState, useEffect } from 'react';
import Modal from '../ComponentesProductos/modal'; // Importa el componente de la ventana modal

const NewCollection = ({ images, titles, productCodes }) => {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredItem(index);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    // Función para abrir la ventana modal al hacer clic en "Shop Now"
    const handleShopNowClick = async (index) => {
        const selectedProductCode = productCodes[index];

        // Hacer la llamada para obtener la información completa del producto
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${selectedProductCode}`);
            const data = await response.json();

            setSelectedProduct(data); // Guardar la información completa del producto
            setModalOpen(true); // Abrir la ventana modal
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <header className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">Telas de las últimas colecciones</h2>
                </header>

                <ul className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-3">
                    <li
                        onMouseEnter={() => handleMouseEnter(0)}
                        onMouseLeave={handleMouseLeave}
                        className={`group relative ${hoveredItem === 0 ? 'opacity-90' : 'opacity-100'} transition duration-500 `}
                    >
                        <a className="block cursor-pointer">
                            <img
                                src={images[0]}
                                alt=""
                                className={`aspect-square w-full object-cover transform ${hoveredItem === 0 ? 'scale-105' : 'scale-100'} transition duration-500`}
                            />
                            <div className="absolute inset-0 flex flex-col items-start justify-end p-6 " onClick={() => handleShopNowClick(0)}>
                                <h3 className="text-xl font-medium text-white">{titles[0]}</h3>
                            </div>
                        </a>
                    </li>

                    <li
                        onMouseEnter={() => handleMouseEnter(1)}
                        onMouseLeave={handleMouseLeave}
                        className={`group relative ${hoveredItem === 1 ? 'opacity-90' : 'opacity-100'} transition duration-500 `}
                    >
                        <a className="block cursor-pointer">
                            <img
                                src={images[1]}
                                alt=""
                                className={`aspect-square w-full object-cover transform ${hoveredItem === 1 ? 'scale-105' : 'scale-100'} transition duration-500`}
                            />
                            <div className="absolute inset-0 flex flex-col items-start justify-end p-6" onClick={() => handleShopNowClick(1)}>
                                <h3 className="text-xl font-medium text-white">{titles[1]}</h3>
                            </div>
                        </a>
                    </li>

                    <li
                        onMouseEnter={() => handleMouseEnter(2)}
                        onMouseLeave={handleMouseLeave}
                        className={`group relative lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 ${hoveredItem === 2 ? 'opacity-90' : 'opacity-100'} transition duration-500`}
                    >
                        <a className="block cursor-pointer">
                            <img
                                src={images[2]}
                                alt=""
                                className={`aspect-square w-full object-cover transform ${hoveredItem === 2 ? 'scale-105' : 'scale-100'} transition duration-500`}
                            />
                            <div className="absolute inset-0 flex flex-col items-start justify-end p-6" onClick={() => handleShopNowClick(2)}>
                                <h3 className="text-xl font-medium text-white">{titles[2]}</h3>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>

            {/* Modal */}
            {modalOpen && selectedProduct && (
                <Modal
                    isOpen={modalOpen}
                    close={() => setModalOpen(false)}
                    product={selectedProduct} // Pasar el producto seleccionado a la modal
                />
            )}
        </section>
    );
};

export default NewCollection;
