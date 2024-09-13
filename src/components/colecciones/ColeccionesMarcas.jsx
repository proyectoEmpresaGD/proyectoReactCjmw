import { useState, useEffect } from 'react';
import { CartProvider } from '../CartContext';
import CarruselColecciones from '../ComponentesBrands/CarruselColecciones';
const imageSet = {
  'ARE': [
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/SANTORINI%20NOIR.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/MOOD%20BOARD%20TOUCH%202.jpg",
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/ARENA%20AMBIENTE/APACHE%20CHERRY.jpg",
    ],
  ],
  'HAR': [
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/HAIMA%20MARINE.jpg"
    ],
  ],
  'FLA': [
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/1200%20FLAMENCO%20ZAHARA%2004.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/1200%20FLAMENCO%20ZAHARA%2004.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/1200%20FLAMENCO%20ZAHARA%2004.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/1200%20FLAMENCO%20ZAHARA%2004.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/1200%20FLAMENCO%20ZAHARA%2004.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/1200%20FLAMENCO%20ZAHARA%2004.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/1200%20FLAMENCO%20ZAHARA%2004.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/1200%20FLAMENCO%20ZAHARA%2004.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/1200%20FLAMENCO%20ZAHARA%2004.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/1200%20FLAMENCO%20ZAHARA%2004.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/1200%20FLAMENCO%20ZAHARA%2004.jpg"
    ],

  ],
  'CJM': [
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
  ],
  'BAS': [
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/HARBOUR%20AMBIENTE/MOOD%20BOARD%20BOLONIA.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/CJM%20AMBIENTE/ASIAN%20ROMANTICISM%20ROYAL%20BLUE%20F2.jpg"
    ],
    [
      "https://cjmw.eu/ImagenesTelasCjmw/ImagenesAmbiente/FLAMENCO%20AMBIENTE/1200%20FLAMENCO%20ZAHARA%2004.jpg"
    ],
  ],
}



function ColeccionesMarcas({ marca }) {
  const [colecciones, setColecciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageSetsForMarca = imageSet[marca] || [];

  useEffect(() => {
    const fetchCollectionsByBrand = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/getCollectionsByBrand?brand=${marca}`);
        if (!response.ok) {
          throw new Error(`Error fetching collections: ${response.statusText}`);
        }
        const data = await response.json();
        setColecciones(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collections:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCollectionsByBrand();
  }, [marca]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (colecciones.length === 0) {
    return <div>No collections found for {marca}</div>;
  }

  console.log('Colecciones:', colecciones);
  console.log('Image sets for marca:', imageSetsForMarca);

  return (
    <CartProvider>
      <div className="xl:mt-[3%] mt-[20%] md:mt-[10%]]">
        <div className="flex items-center justify-center h-full">
          <h1 className="text-3xl font-bold text-black mx-auto">{marca}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3">
          {colecciones.map((coleccion, index) => (
            <div key={index}>
              <div className="flex items-center justify-center py-[15%] sm:py-[10%] md:py-[10%] lg:py-[10%] xl:py-[3%] 2xl:py-[3%]">
                <h1 className="text-3xl py-[1%]">{coleccion}</h1>
              </div>

              {/* Mostrar el carrusel para el conjunto de imágenes correspondiente a esta colección */}
              {imageSetsForMarca[index] && (
                <CarruselColecciones imageSets={imageSetsForMarca[index]} />
              )}
            </div>
          ))}
        </div>
      </div>
    </CartProvider>
  );
}

export default ColeccionesMarcas;

