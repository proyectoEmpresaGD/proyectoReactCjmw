import { useState, useEffect } from 'react';
import { CartProvider } from '../../components/CartContext';
import CarruselColecciones from '../../components/ComponentesBrands/CarruselColecciones';

const images = [
  "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/TUNDRA%20KOLA.jpg",
  "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/ARISTOS%20MARINE.jpg",
  "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/%20KUKULKAN%20ASHES.jpg",
  "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/VERANDA%20JUTE.jpg",
  "https://cjmw.eu/ImagenesTelasCjmw/Carruseles/ARENA/ArenaCarrusel1.webp",
];

function ArenaColecciones({ marca }) { // Recibe marca como prop
  const [colecciones, setColecciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  // Llamada al backend para obtener las colecciones de una marca específica
  useEffect(() => {
    const fetchCollectionsByBrand = async () => {
      try {
        setLoading(true); // Iniciar estado de carga
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/getCollectionsByBrand?brand=${marca}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching collections: ${response.statusText}`);
        }

        const data = await response.json();
        setColecciones(data); // Establecemos las colecciones
        setLoading(false); // Finalizar estado de carga
      } catch (error) {
        console.error('Error fetching collections:', error);
        setError(error.message);
        setLoading(false); // Finalizar estado de carga en caso de error
      }
    };

    fetchCollectionsByBrand();
  }, [marca]);

  // Mostrar un mensaje mientras los datos están cargando
  if (loading) {
    return <div>Loading...</div>;
  }

  // Mostrar un mensaje de error si ocurre algún problema en la carga
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Si no se encontraron colecciones
  if (colecciones.length === 0) {
    return <div>No collections found for {marca}</div>;
  }

  return (
    <CartProvider>
      <div className="xl:mt-[3%] mt-[20%] md:mt-[10%]] ">
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl font-bold text-black mx-auto">ARENA</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 ">
          {/* Mapear sobre las colecciones y generar un h1 y CarruselColecciones por cada colección */}
          {colecciones.map((coleccion, index) => (
            <div key={index}>
              <div className="flex items-center justify-center py-[15%] sm:py-[10%] md:py-[10%] lg:py-[10%] xl:py-[3%] 2xl:py-[3%]">
                <h1 className="text-3xl py-[1%]">{coleccion}</h1>
              </div>
              {/* Ajustar imágenes para cada colección si es necesario */}
              <CarruselColecciones images={images} />
            </div>
          ))}
        </div>
      </div>
    </CartProvider>
  );
}

export default ArenaColecciones;
