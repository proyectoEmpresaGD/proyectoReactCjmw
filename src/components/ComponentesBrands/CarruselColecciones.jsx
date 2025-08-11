// src/components/CarruselColecciones.jsx
import { useState, useEffect } from 'react';
import { cdnUrl } from '../../Constants/cdn'; // <-- importamos helper CDN

const CarruselColecciones = ({ imageUrl }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Cada vez que cambie la URL, reiniciamos el estado de carga
  useEffect(() => {
    setIsLoaded(false);
  }, [imageUrl]);

  // Solo renderizamos si tenemos URL
  const finalUrl = imageUrl ? cdnUrl(imageUrl) : null;

  return (
    <div className="relative w-full h-[35vh] sm:h-[45vh] bg-gray-100 rounded-xl overflow-hidden shadow-md">
      {/* Skeleton placeholder mientras esperamos la imagen */}
      {!isLoaded && finalUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_200%] animate-pulse" />
      )}

      {/* Imagen real, con transición de opacidad */}
      {finalUrl ? (
        <img
          src={finalUrl}
          alt="Imagen colección"
          onLoad={() => setIsLoaded(true)}
          className={`object-cover w-full h-full transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />
      ) : (
        // Placeholder si no hay imagen
        <div className="flex items-center justify-center h-full text-sm text-gray-500">
          Imagen no disponible
        </div>
      )}
    </div>
  );
};

export default CarruselColecciones;
