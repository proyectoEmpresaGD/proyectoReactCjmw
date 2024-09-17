import { useState, useEffect } from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const CarruselColecciones = ({ imageSets = [] }) => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);

  // Cambia el conjunto de imágenes cada vez que el componente se monta o si imageSets cambia
  useEffect(() => {
    if (imageSets.length > 0) {
      console.log('Image sets received:', imageSets);
      setCurrentSetIndex(0); // Reinicia el índice al recibir nuevos conjuntos de imágenes
    }
  }, [imageSets]);

  // Asegúrate de que `imageSets` sea un array de arrays o conviértelo a ese formato
  const images = Array.isArray(imageSets[0]) ? imageSets[currentSetIndex] : imageSets;

  return (
    <div className='xl:h-[59.75vh] md:h-[51.4vh] sm:h-[50vh] xl:w-[60vh] sm:bg-cover lg:bg-cover mx-auto justify-center'>
      {images.length > 0 ? (
        <Fade
          duration={4000}
          indicators={false}
          autoplay={true}
          pauseOnHover={false}
          arrows={false}
        >
          {/* Generar dinámicamente las imágenes del conjunto seleccionado */}
          {images.map((image, index) => (
            <div key={index} className="each-fade-effect lg:h-[58vh] md:h-[50vh] sm:h-[50vh] mx-4 xl:mx-0 rounded-md">
              <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
                <img src={image} alt={`Slide ${index}`} className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover rounded-md sm:object-center" />
              </div>
            </div>
          ))}
        </Fade>
      ) : (
        <p>No images available</p>
      )}
    </div>
  );
};

export default CarruselColecciones;
