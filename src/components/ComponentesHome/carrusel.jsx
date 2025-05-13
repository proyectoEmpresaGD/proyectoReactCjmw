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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    const shuffled = shuffleArray(images);
    const randomStartIndex = getRandomStartIndex(shuffled.length);
    const rotatedImages = rotateArray(shuffled, randomStartIndex);
    setShuffledImages(rotatedImages);
  }, [images]);

  return (
    <div
      className={`relative transition-all duration-500 ease-in-out w-full 
        ${isMobile ? (mostrarCarrusel ? 'h-[50vh]' : 'h-[100vh]') : 'h-[100vh]'}`}
    >
      {/* VIDEO */}
      {videoSrc && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out 
            ${mostrarCarrusel ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <video
            src={videoSrc}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={() => setMostrarCarrusel(true)}
          />
        </div>
      )}

      {/* CARRUSEL */}
      <div
        className={`transition-opacity duration-1000 ease-in-out 
          ${mostrarCarrusel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <Fade duration={6000} indicators={false} autoplay pauseOnHover={false}>
          {shuffledImages.map((image, index) => (
            <div key={index} className="each-fade-effect w-full h-[50vh] md:h-[100vh] relative">
              <div className="image-container w-full h-[50vh] md:h-[100vh] bg-cover">
                <img
                  src={image}
                  alt=""
                  className="w-full h-[50vh] md:h-[100vh] object-cover object-center"
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
