// src/components/CarruselColecciones.jsx
import React, { useEffect, useState } from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { cdnUrl } from '../../Constants/cdn'; // <-- importamos helper CDN
import { textosCarrusel } from '../../Constants/constants';

const shuffleArray = (array) => {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
    if (!images || images.length === 0) return;
    const shuffled = shuffleArray(images);
    const start = getRandomStartIndex(shuffled.length);
    setShuffledImages(rotateArray(shuffled, start));
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
          {shuffledImages.map((rawUrl, idx) => {
            const url = cdnUrl(rawUrl);
            return (
              <div
                key={idx}
                className="each-fade-effect w-full h-[50vh] md:h-[100vh] relative"
              >
                <img
                  src={url}
                  alt={textosCarrusel[idx % textosCarrusel.length] || ''}
                  className="w-full h-[50vh] md:h-[100vh] object-cover object-center"
                />
              </div>
            );
          })}
        </Fade>
      </div>
    </div>
  );
};

export default CarruselColecciones;
