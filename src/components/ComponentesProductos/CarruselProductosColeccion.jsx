// src/components/CarruselColeccion.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const CarruselColeccion = ({
    productos = [],
    coleccion = '',
    excludeCodprodu = '',
    onProductoClick,
    titulo = ''
}) => {
    const { t } = useTranslation('collectionCarousel');
    const [productosInternos, setProductosInternos] = useState([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);

    useEffect(() => {
        const fetchProductos = async () => {
            if (!coleccion || !excludeCodprodu) return;
            try {
                setLoading(true);
                const params = new URLSearchParams({ coleccion, excludeCodprodu });
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/byCollectionExcluding?${params}`);
                const data = res.ok ? await res.json() : [];
                setProductosInternos(data);
            } catch (err) {
                console.error("Error cargando productos de la colección:", err);
                setProductosInternos([]);
            } finally {
                setLoading(false);
            }
        };

        if (productos.length === 0 && coleccion && excludeCodprodu) {
            fetchProductos();
        } else {
            setProductosInternos(productos);
            setLoading(false);
        }
    }, [productos, coleccion, excludeCodprodu]);

    const scrollLeft = () => {
        carouselRef.current?.scrollBy({ left: -carouselRef.current.offsetWidth, behavior: 'smooth' });
    };

    const scrollRight = () => {
        carouselRef.current?.scrollBy({ left: carouselRef.current.offsetWidth, behavior: 'smooth' });
    };

    if (loading || !productosInternos || productosInternos.length === 0) return null;

    return (
        <div className="mt-10">
            {titulo && (
                <h2 className="text-xl font-semibold mb-6 text-gray-500 text-center">
                    {t('discoverCollection', { title: titulo })}
                </h2>
            )}

            <div className="relative">
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto space-x-4 scroll-smooth px-2 py-2"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {productosInternos.map((item) => (
                        <div
                            key={item.codprodu}
                            onClick={() => onProductoClick(item)}
                            className="flex-shrink-0 w-[40%] h-[40%] md:w-[20%] md:h-[20%] rounded-lg cursor-pointer snap-start hover:scale-105 transition duration-300"
                        >
                            <img
                                src={item.imageBaja}
                                alt={item.nombre}
                                className="w-full h-[150px] md:h-[200px] object-cover rounded-lg"
                            />
                            <div className="p-2 text-center">
                                <p className="text-sm text-gray-500">{t('fabrics')}</p>
                                <h3 className="text-sm font-semibold">{item.nombre}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center space-x-10">
                    <button
                        onClick={scrollLeft}
                        className="text-2xl px-2 hover:text-black transition text-gray-500"
                        aria-label={t('scrollLeft')}
                    >
                        ←
                    </button>
                    <button
                        onClick={scrollRight}
                        className="text-2xl px-2 hover:text-black transition text-gray-500"
                        aria-label={t('scrollRight')}
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarruselColeccion;
