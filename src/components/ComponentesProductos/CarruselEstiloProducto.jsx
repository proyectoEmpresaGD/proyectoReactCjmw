import { useEffect, useState } from 'react';
import { defaultImageUrlModalProductos } from '../../Constants/constants';

const CarruselMismoEstilo = ({ estilo, excludeNombre, excludeColeccion, onProductoClick }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!estilo || !excludeNombre || !excludeColeccion) {
            console.warn("Faltan parámetros:", { estilo, excludeNombre, excludeColeccion });
            return;
        }

        const fetchProductosSimilares = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    estilo,
                    excludeNombre,
                    excludeColeccion,
                });

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/similarByStyle?${params}`);

                if (!response.ok) {
                    setProductos([]);
                    return;
                }

                const productos = await response.json();

                const productosConImagen = productos.map((prod) => ({
                    ...prod,
                    imageBaja: prod.imageBaja || defaultImageUrlModalProductos,
                }));

                setProductos(productosConImagen);
            } catch (err) {
                console.error("Error al cargar productos similares:", err);
                setProductos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProductosSimilares();
    }, [estilo, excludeNombre, excludeColeccion]);

    if (loading) {
        return <div className="text-center text-gray-500 mt-8">Cargando productos similares...</div>;
    }

    if (productos.length === 0) {
        console.log("No se mostrará el carrusel: productos.length === 0");
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className="text-xl font-semibold mb-6 text-gray-500 text-center">
                Telas con estilo {estilo}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {productos.map((item) => (
                    <div
                        key={item.codprodu}
                        onClick={() => onProductoClick(item)}
                        className="bg-white rounded-lg cursor-pointer hover:scale-105 transition duration-300"
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
        </div>
    );
};

export default CarruselMismoEstilo;
