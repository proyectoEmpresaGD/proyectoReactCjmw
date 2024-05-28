import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const CarruselColecciones = ( { images } ) => {
  return (
    <div className='xl:h-[59.75vh] md:h-[51.4vh] sm:h-[50vh] xl:w-[60vh] sm:bg-cover lg:bg-cover mx-auto justify-center '>
      <Fade
        duration={4000}
        indicators={false}
        autoplay={true}
        pauseOnHover={false}
        onChange={() => { }} // Corregido el valor de onChange
        onStart={() => { }} // Corregido el valor de onStart
      >
        <div className="each-fade-effect lg:h-[58vh] md:h-[50vh] sm:h-[50vh] rounded-md border-8 border-solid border-black">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[0]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] md:h-[50vh] sm:h-[50vh] rounded-md border-8 border-solid border-black">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[1]} className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] md:h-[50vh] sm:h-[50vh] rounded-md border-8 border-solid border-black">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[2]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] md:h-[50vh] sm:h-[50vh] rounded-md border-8 border-solid border-black">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[3]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] md:h-[50vh] sm:h-[50vh] rounded-md border-8 border-solid border-black">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[4]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] md:h-[50vh] sm:h-[50vh] rounded-md border-8 border-solid border-black"> 
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[5]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] md:h-[50vh] sm:h-[50vh] rounded-md border-8 border-solid border-black">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[8]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] md:h-[50vh] sm:h-[50vh] rounded-md border-8 border-solid border-black">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[7]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default CarruselColecciones;


// import React, { useEffect, useState } from 'react';
// import { Fade } from 'react-slideshow-image';
// import 'react-slideshow-image/dist/styles.css';

// const shuffleArray = (array) => {
//   let shuffledArray = array.slice(); // Copia el array original
//   for (let i = shuffledArray.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Corrige el intercambio de elementos
//   }
//   return shuffledArray;
// };

// const getRandomStartIndex = (length) => {
//   return Math.floor(Math.random() * length);
// };

// const rotateArray = (array, index) => {
//   return [...array.slice(index), ...array.slice(0, index)];
// };

// const CarruselColecciones = ({ images }) => {
//   const [shuffledImages, setShuffledImages] = useState([]);
//   const [texts, setTexts] = useState([
//     "Texto para la imagen 1",
//     "Texto para la imagen 2",
//     "Texto para la imagen 3",
//     "Texto para la imagen 4",
//     "Texto para la imagen 5",
//     "Texto para la imagen 6",
//     "Texto para la imagen 7",
//     "Texto para la imagen 8"
//   ]); // Textos para cada imagen

//   useEffect(() => {
//     const shuffled = shuffleArray(images);
//     const randomStartIndex = getRandomStartIndex(shuffled.length);
//     const rotatedImages = rotateArray(shuffled, randomStartIndex);
//     const rotatedTexts = rotateArray(texts, randomStartIndex);
//     setShuffledImages(rotatedImages);
//     setTexts(rotatedTexts); // Rota los textos para que coincidan con las imágenes
//   }, [images]);

//   return (
//     <div className='xl:h-[59.9vh] md:h-[51.4vh] sm:h-[50vh] xl:w-[60vh] sm:bg-cover lg:bg-cover mx-auto justify-center rounded-md border-8 border-solid border-black'>
//       <Fade
//         duration={4000}
//         indicators={false}
//         autoplay={true}
//         pauseOnHover={false}
//       >
//         {shuffledImages.map((image, index) => (
//           <div key={index} className="each-fade-effect lg:h-[58vh] sm:h-[50vh] relative">
//             <div className="image-container relative lg:h-full sm:h-full ">
//               <img src={image} alt="" className="lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center rounded-md" />
//               <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4 text-center z-20">
//                 <h3 className="text-lg font-semibold text-white">{texts[index]}</h3>
//                 <p className="text-sm text-white">Descripción adicional si es necesario.</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </Fade>
//     </div>
//   );
// };

// export default CarruselColecciones;



