import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartProvider } from '../CartContext';
import CarruselColecciones from '../ComponentesBrands/CarruselColecciones';
import { imageSet, coleccionesTexts } from '../../Constants/constants'; // Importamos las constantes

function ColeccionesMarcas({ marca }) {
  const [colecciones, setColecciones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageSetsForMarca = imageSet[marca] || {};
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollectionsByBrand = async () => {
      const url = `${import.meta.env.VITE_API_BASE_URL}/api/products/getCollectionsByBrand?brand=${marca}`;

      try {
        setLoading(true);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        let data = await response.json();

        if (marca === "CJM") {
          data = data.filter(coleccion => coleccion !== "REVOLTOSO");
        } else if (marca === "ARE") {
          data = data.filter(coleccion => !["VELVETY", "LIGHTHOUSE"].includes(coleccion));
        } else if (marca === "FLA") {
          data = data.filter(coleccion => coleccion !== ["REVOLTOSO VOL II", "LUXURY DREAPS"].includes(coleccion));
        } else if (marca === "HAR") {
          data = data.filter(coleccion => !["RUSTICA", "CARIBEAN PARTY"].includes(coleccion));
        }

        setColecciones(data);
      } catch (error) {
        console.error(`[ColeccionesMarcas] Error en fetch para marca ${marca}:`, error);
        setError(error.message || 'Error desconocido');
      } finally {
        setLoading(false);

      }
    };

    if (marca) {
      fetchCollectionsByBrand();
    } else {
      console.warn('[ColeccionesMarcas] No se proporcionó marca al componente.');
    }
  }, [marca]);

  const handleCollectionClick = (coleccion) => {
    navigate(`/products?collection=${encodeURIComponent(coleccion)}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (colecciones.length === 0) {
    return <div>No collections found for {marca}</div>;
  }

  return (
    <CartProvider>
      <div className="mt-[20%] md:mt-[10%] lg:mt-[5%] xl:mt-[3%] px-5">
        <div className="flex items-center justify-center h-full pt-7">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mx-auto">
            {coleccionesTexts.title}  {/* Usamos la constante para el título */}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 py-5">
          {colecciones.map((coleccion, index) => (
            <div
              key={index}
              onClick={() => handleCollectionClick(coleccion)}
              className="relative group cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg rounded-lg overflow-hidden bg-white w-full"
            >
              {/* Indicador de toque para móviles */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-lg md:hidden lg:hidden xl:hidden">
                {coleccionesTexts.mobileHint}  {/* Usamos la constante para el texto móvil */}
              </div>

              {/* Contenedor de texto mejorado */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-5 group-hover:bg-opacity-30 transition duration-300">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white text-center px-4 py-2 bg-opacity-80 rounded-md">
                  {coleccion}
                </h1>
              </div>

              {/* Mostrar el carrusel de imágenes correspondiente */}
              {imageSetsForMarca[coleccion] && (
                <CarruselColecciones imageSets={imageSetsForMarca[coleccion]} />
              )}
            </div>
          ))}
        </div>
      </div>
    </CartProvider>
  );
}

export default ColeccionesMarcas;
