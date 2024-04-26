import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const Carrusel = ( { images } ) => {
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
        <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
            <img src={images[0]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
            <img src={images[1]} className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
            <img src={images[2]} alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default Carrusel;
