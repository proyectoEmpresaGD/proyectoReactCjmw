import React, { useEffect, useState } from 'react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

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
  const [texts, setTexts] = useState([
    "Texto para la imagen 1",
    "Texto para la imagen 2",
    "Texto para la imagen 3",
    "Texto para la imagen 4",
    "Texto para la imagen 5",
    "Texto para la imagen 6",
    "Texto para la imagen 7",
    "Texto para la imagen 8"
  ]); // Textos para cada imagen

  useEffect(() => {
    const shuffled = shuffleArray(images);
    const randomStartIndex = getRandomStartIndex(shuffled.length);
    const rotatedImages = rotateArray(shuffled, randomStartIndex);
    const rotatedTexts = rotateArray(texts, randomStartIndex);
    setShuffledImages(rotatedImages);
    setTexts(rotatedTexts); // Rota los textos para que coincidan con las imágenes
  }, [images]);

  return (
    <div className='lg:h-[100vh] sm:h-[50vh] sm:bg-cover lg:bg-cover mt-[20%] xl:mt-[5%] md:mt-[4%]'>
      <Fade
        duration={6000}
        indicators={false}
        autoplay={true}
        pauseOnHover={false}
        onChange={() => { }} // Corregido el valor de onChange
        onStart={() => { }} // Corregido el valor de onStart
      >
        {images.map((image, index) => (
          <div key={index} className="each-fade-effect lg:h-[100vh] sm:h-[50vh] relative">
            <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
              <img src={image} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
              {/* <div className="absolute bottom-20 left-0 w-[35%] mx-auto right-0 bg-black bg-opacity-60 p-4 text-center z-20">
                <h3 className="text-lg font-semibold text-white">{texts[index]}</h3>
                <p className="text-sm text-white">Descripción adicional si es necesario.</p>
              </div> */}
            </div>
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default CarruselColecciones;



// import { Fade } from 'react-slideshow-image';
// import 'react-slideshow-image/dist/styles.css';

// const Carrusel = ( { images } ) => {
//   return (
//     <div className='lg:h-[100vh] sm:h-[50vh] sm:bg-cover lg:bg-cover mt-[20%] xl:mt-[5%] md:mt-[4%]'>
//       <Fade
//         duration={6000}
//         indicators={false}
//         autoplay={true}
//         pauseOnHover={false}
//         onChange={() => { }} // Corregido el valor de onChange
//         onStart={() => { }} // Corregido el valor de onStart
//       >
//         <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
//           <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
//             <img src={images[0]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
//           </div>
//         </div>
//         <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
//           <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
//             <img src={images[1]} className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
//           </div>
//         </div>
//         <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
//           <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
//             <img src={images[2]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
//           </div>
//         </div>
//         <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
//           <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
//             <img src={images[3]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
//           </div>
//         </div>
//         <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
//           <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
//             <img src={images[4]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
//           </div>
//         </div>
//         <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
//           <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
//             <img src={images[5]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
//           </div>
//         </div>
//         <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
//           <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
//             <img src={images[6]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
//           </div>
//         </div>
//         <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
//           <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
//             <img src={images[7]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
//           </div>
//         </div>
//       </Fade>
//     </div>
//   );
// };

// export default Carrusel;
