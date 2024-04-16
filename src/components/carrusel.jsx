import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const Carrusel = () => {
  return (
    <div className="slide-container lg:h-screen sm:h-[50vh] sm:bg-cover lg:bg-cover">
      <Slide
        autoplay={true}
        pauseOnHover={false}
      >
        <div className="each-slide-effect lg:h-screen sm:h-[50vh]">
          <div className="lg:object-cover lg:object-center sm:object-cover sm:object-center w-full h-full">
            <img src="dormitorio.jpg" alt="" className='aspect-auto w-full h-full' />
          </div>
        </div>

        <div className="each-slide-effect lg:h-screen sm:h-[50vh]">
          <div className="lg:object-cover lg:object-center sm:object-cover sm:object-center w-full h-full">
            <img src="salon.jpg" alt="" className='aspect-auto w-full h-full' />
          </div>
        </div>

        <div className="each-slide-effect lg:h-screen sm:h-[50vh]">
          <div className="lg:object-cover lg:object-center sm:object-cover sm:object-center w-full h-full">
            <img src="4.jpg" alt="" className='aspect-auto w-full h-full' />
          </div>
        </div>

        <div className="each-slide-effect lg:h-screen sm:h-[50vh]">
          <div className="lg:object-cover lg:object-center sm:object-cover sm:object-center w-full h-full">
            <img src="showroom2.jpg" alt="" className='aspect-auto w-full h-full' />
          </div>
        </div>

      </Slide>
    </div>
  );
};

export default Carrusel;
