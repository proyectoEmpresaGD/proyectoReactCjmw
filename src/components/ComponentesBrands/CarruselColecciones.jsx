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
    <div className='xl:h-[59.75vh] md:h-[51.4vh] sm:h-[50vh] xl:w-[60vh] sm:bg-cover lg:bg-cover mx-auto justify-center'>
      {randomImage ? (
        <div className="lg:h-[58vh] md:h-[50vh] sm:h-[50vh] mx-4 xl:mx-0 rounded-md">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={randomImage} alt="Random Display" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover rounded-md sm:object-center" />
          </div>
        </div>
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
};

export default CarruselColecciones;
