import { useRef } from 'react';

const CarruselColeccion = ({ productos, onProductoClick, titulo = '' }) => {
    const carouselRef = useRef(null);

    const scrollLeft = () => {
        carouselRef.current?.scrollBy({
            left: -carouselRef.current.offsetWidth,
            behavior: 'smooth',
        });
    };

    const scrollRight = () => {
        carouselRef.current?.scrollBy({
            left: carouselRef.current.offsetWidth,
            behavior: 'smooth',
        });
    };

    if (!productos || productos.length === 0) return null;

    return (
        <div className="mt-10">
            {titulo && (
                <h2 className="text-xl font-semibold mb-6 text-gray-500 text-center">
                    Descubre la colección {titulo}
                </h2>
            )}

            <div className="relative">
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto space-x-4 scroll-smooth px-2 py-2"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {productos.map((item) => (
                        <div
                            key={item.codprodu}
                            onClick={() => onProductoClick(item)}
                            className="flex-shrink-0 w-[40%] h-[40%] md:w-[20%] md:h-[20%] rounded-lg cursor-pointer snap-start hover:scale-105 transition duration-300"
                        >
                            <img
                                src={item.imageBaja}
                                alt={item.nombre}
                                className="w-full h-[200px] object-cover rounded-lg"
                            />
                            <div className="p-2 text-center">
                                <p className="text-sm text-gray-500">Fabrics</p>
                                <h3 className="text-sm font-semibold">{item.nombre}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center space-x-10">
                    <button
                        onClick={scrollLeft}
                        className="text-2xl px-2 hover:text-black transition text-gray-500"
                        aria-label="Scroll left"
                    >
                        ←
                    </button>
                    <button
                        onClick={scrollRight}
                        className="text-2xl px-2 hover:text-black transition text-gray-500"
                        aria-label="Scroll right"
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarruselColeccion;
