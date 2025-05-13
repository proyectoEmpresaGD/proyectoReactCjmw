import React, { useEffect, useState } from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { textosCarrusel } from '../../Constants/constants';

const shuffleArray = (array) => {
  let shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const getRandomStartIndex = (length) => Math.floor(Math.random() * length);
const rotateArray = (array, index) => [...array.slice(index), ...array.slice(0, index)];

const CarruselColecciones = ({ images, videoSrc = null }) => {
  const [shuffledImages, setShuffledImages] = useState([]);
  const [mostrarCarrusel, setMostrarCarrusel] = useState(!videoSrc);

  useEffect(() => {
    const shuffled = shuffleArray(images);
    const randomStartIndex = getRandomStartIndex(shuffled.length);
    const rotatedImages = rotateArray(shuffled, randomStartIndex);
    setShuffledImages(rotatedImages);
  }, [images]);

  return (
    <div className="relative lg:h-[100%] sm:h-[50vh] sm:bg-cover lg:bg-cover overflow-hidden">
      {/* VIDEO */}
      {videoSrc && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${mostrarCarrusel ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
        >
          <video
            src={videoSrc}
            className="w-full h-[100vh] object-cover"
            autoPlay
            muted
            playsInline
            onEnded={() => setMostrarCarrusel(true)}
          />
        </div>
      )}

      {/* CARRUSEL */}
      <div
        className={`transition-opacity duration-1000 ease-in-out ${mostrarCarrusel ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        <Fade duration={6000} indicators={false} autoplay={true} pauseOnHover={false}>
          {shuffledImages.map((image, index) => (
            <div key={index} className="each-fade-effect lg:h-[100vh] sm:h-[50vh] relative">
              <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
                <img
                  src={image}
                  alt=""
                  className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center"
                />
              </div>
            </div>
          ))}
        </Fade>
      </div>
    </div>
  );
};

export default CarruselColecciones;
