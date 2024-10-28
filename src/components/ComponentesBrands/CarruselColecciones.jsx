import { useState, useEffect } from 'react';
import { carruselConfig } from '../../Constants/constants'; // Importar las constantes

const CarruselColecciones = ({ imageSets = [] }) => {
  const [randomImage, setRandomImage] = useState(null);

  // Selecciona una imagen aleatoria del array de imágenes al montar el componente o si imageSets cambia
  useEffect(() => {
    if (imageSets.length > 0) {
      const images = Array.isArray(imageSets[0]) ? imageSets.flat() : imageSets;
      const randomIndex = Math.floor(Math.random() * images.length);
      setRandomImage(images[randomIndex]); 
    }
  }, [imageSets]);

  return (
    <div className="h-[35vh] sm:h-[50vh] md:h-[40vh] lg:h-[50vh] w-full max-w-[80vw] sm:max-w-[70vw] md:max-w-[60vw] lg:max-w-[50vw] bg-cover mx-auto flex justify-center items-center">
      {randomImage ? (
        <div className="h-full w-full rounded-md overflow-hidden">
          <div className="image-container h-full w-full object-cover rounded-md mx-auto">
            <img
              src={randomImage}
              alt={carruselConfig.imageAltText} // Usar el texto alternativo desde las constantes
              className="object-cover w-full h-full rounded-md"
            />
          </div>
        </div>
      ) : (
        <p>{carruselConfig.noImagesText}</p> // Usar el texto de error desde las constantes
      )}
    </div>
  );
};

export default CarruselColecciones;
