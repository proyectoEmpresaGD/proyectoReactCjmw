import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const Carrusel = () => {
  return (
    <div className='lg:h-[100vh] sm:h-[50vh] sm:bg-cover lg:bg-cover'>
      <Fade
        duration={6000}
        indicators={false} // Corregido el valor de indicators
        onChange={() => { }} // Corregido el valor de onChange
        onStart={() => { }} // Corregido el valor de onStart
      >
        <div className="each-fade-effect lg:h-screen sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
            <img src="showroom2.jpg" alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
            <img src="4.jpg" alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
        <div className="each-fade-effect lg:h-[100vh] sm:h-[50vh]">
          <div className="image-container sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover">
            <img src="showroom1.jpg" alt="" className="aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center" />
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default Carrusel;
