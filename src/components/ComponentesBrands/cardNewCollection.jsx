// src/components/NewCollection.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ComponentesProductos/modal';

const NewCollection = ({ images, titles, productCodes }) => {
    const { t } = useTranslation('newCollection');
    const [hoveredItem, setHoveredItem] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleMouseEnter = (index) => setHoveredItem(index);
    const handleMouseLeave = () => setHoveredItem(null);

    const handleShopNowClick = async (index) => {
        const code = productCodes[index];
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${code}`);
            const data = await res.json();
            setSelectedProduct(data);
            setModalOpen(true);
        } catch (err) {
            console.error('Error fetching product:', err);
        }
    };

    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <header className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                        {t('sectionTitle')}
                    </h2>
                </header>

                <ul className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-3">
                    {[0, 1, 2].map((idx) => {
                        // la tercera imagen ocupa más espacio
                        const special =
                            idx === 2
                                ? 'group relative lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1'
                                : 'group relative';
                        return (
                            <li
                                key={idx}
                                onMouseEnter={() => handleMouseEnter(idx)}
                                onMouseLeave={handleMouseLeave}
                                className={`${special} ${hoveredItem === idx ? 'opacity-90' : 'opacity-100'
                                    } transition duration-500`}
                            >
                                <a className="block cursor-pointer">
                                    <img
                                        src={images[idx]}
                                        alt={titles[idx]}
                                        className={`aspect-square w-full object-cover transform ${hoveredItem === idx ? 'scale-105' : 'scale-100'
                                            } transition duration-500`}
                                    />
                                    <div
                                        className="absolute inset-0 flex flex-col items-start justify-end p-6"
                                        onClick={() => handleShopNowClick(idx)}
                                    >
                                        <h3 className="text-xl font-medium text-white">
                                            {titles[idx]}
                                        </h3>
                                    </div>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {modalOpen && selectedProduct && (
                <Modal
                    isOpen={modalOpen}
                    close={() => setModalOpen(false)}
                    product={selectedProduct}
                />
            )}
        </section>
    );
};

export default NewCollection;
