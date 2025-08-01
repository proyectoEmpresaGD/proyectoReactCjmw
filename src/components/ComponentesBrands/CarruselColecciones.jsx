import { useState, useEffect } from 'react';

const CarruselColecciones = ({ imageUrl }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Cada vez que cambie la URL, reiniciamos el estado de carga
  useEffect(() => {
    setIsLoaded(false);
  }, [imageUrl]);

  return (
    <div className="relative w-full h-[35vh] sm:h-[45vh] bg-gray-100 rounded-xl overflow-hidden shadow-md">
      {/* Skeleton placeholder mientras esperamos la imagen */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_200%] animate-pulse" />
      )}

      {/* Imagen real, con transición de opacidad */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Imagen colección"
          onLoad={() => setIsLoaded(true)}
          className={`object-cover w-full h-full transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />
      )}
    </div>
  );
};

export default CarruselColecciones;
