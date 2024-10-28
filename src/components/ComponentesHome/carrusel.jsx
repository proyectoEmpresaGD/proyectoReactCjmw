import React, { useEffect, useState } from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { textosCarrusel } from '../../Constants/constants'; // Importar los textos desde el archivo de constantes

const shuffleArray = (array) => {
  let shuffledArray = array.slice(); // Copia el array original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Corrige el intercambio de elementos
  }
  return shuffledArray;
};

const getRandomStartIndex = (length) => {
  return Math.floor(Math.random() * length);
};

const rotateArray = (array, index) => {
  return [...array.slice(index), ...array.slice(0, index)];
};

const CarruselColecciones = ({ images }) => {
  const [shuffledImages, setShuffledImages] = useState([]);

  useEffect(() => {
    const shuffled = shuffleArray(images);
    const randomStartIndex = getRandomStartIndex(shuffled.length);
    const rotatedImages = rotateArray(shuffled, randomStartIndex);
    const rotatedTexts = rotateArray(textosCarrusel, randomStartIndex); // Usar textos desde constantes
    setShuffledImages(rotatedImages);
  }, [images]);

  return (
    <div className='lg:h-[100%] sm:h-[50vh] sm:bg-cover lg:bg-cover'>
      <Fade
        duration={6000}
        indicators={false}
        autoplay={true}
        pauseOnHover={false}
        onChange={() => { }} // Corregido el valor de onChange
        onStart={() => { }} // Corregido el valor de onStart
      >
        {shuffledImages.map((image, index) => (
          <div key={index} className="each-fade-effect lg:h-[100vh] sm:h-[50vh] relative">
            <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
              <img src={image} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
            </div>
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default CarruselColecciones;
