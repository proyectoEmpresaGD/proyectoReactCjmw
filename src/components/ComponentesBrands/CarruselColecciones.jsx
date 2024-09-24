import { useState, useEffect } from 'react';

const CarruselColecciones = ({ imageSets = [] }) => {
  const [randomImage, setRandomImage] = useState(null);

  // Selecciona una imagen aleatoria del array de imágenes al montar el componente o si imageSets cambia
  useEffect(() => {
    if (imageSets.length > 0) {
      // Si imageSets es un array de arrays, lo aplana en una sola lista de imágenes
      const images = Array.isArray(imageSets[0]) ? imageSets.flat() : imageSets;
      const randomIndex = Math.floor(Math.random() * images.length);
      setRandomImage(images[randomIndex]); // Selecciona una imagen aleatoria
    }
  }, [imageSets]);

  return (
    <div className="h-[35vh] sm:h-[50vh] md:h-[40vh] lg:h-[50vh] w-full max-w-[80vw] sm:max-w-[70vw] md:max-w-[60vw] lg:max-w-[50vw] bg-cover mx-auto flex justify-center items-center">
      {randomImage ? (
        <div className="h-full w-full rounded-md overflow-hidden">
          <div className="image-container h-full w-full object-cover rounded-md mx-auto">
            <img
              src={randomImage}
              alt="Random Display"
              className="object-cover w-full h-full rounded-md"
            />
          </div>
        </div>
      ) : (
        <p>No images available</p>
      )}
    </div>

  );
};

export default CarruselColecciones;
