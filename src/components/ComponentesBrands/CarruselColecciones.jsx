import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const CarruselColecciones = ( { images } ) => {
  return (
    <div className='xl:h-[59.9vh] md:h-[51.4vh] sm:h-[50vh] xl:w-[60vh] sm:bg-cover lg:bg-cover  mx-auto justify-center rounded-md border-8 border-solid border-black'>
      <Fade
        duration={4000}
        indicators={false}
        autoplay={true}
        pauseOnHover={false}
        onChange={() => { }} // Corregido el valor de onChange
        onStart={() => { }} // Corregido el valor de onStart
      >
        <div className="each-fade-effect lg:h-[58vh] md:h-[50vh] sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[0]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[1]} className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[2]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[3]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[4]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] sm:h-[50vh]"> 
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[5]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[6]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[58vh] sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-[58vh] lg:h-full sm:h-full sm:w-full bg-cover rounded-md">
            <img src={images[7]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default CarruselColecciones;
