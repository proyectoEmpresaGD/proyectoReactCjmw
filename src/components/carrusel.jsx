import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const Carrusel = () => {
  return (
    <div className='lg:h-[100vh] sm:h-[50vh] sm:bg-cover lg:bg-cover'>
      <Fade
        duration={6000}
        indicators={{}}
        onChange={function noRefCheck() { }}
        onStartChange={function noRefCheck() { }}
        pauseOnHover={false}
        autoplay={true}
        transitionDuration={1500}
      >
        <div className="each-slide-effect lg:h-[100vh] sm:h-[50vh]">
          <div className="  sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover" >
            <img src="showroom2.jpg" alt="" className='aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center' />
          </div>
        </div>
        <div className="each-slide-effect lg:h-[100vh] sm:h-[50vh]">
          <div className=" sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover" >
            <img src="4.jpg" alt="" className='aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center' />
          </div>
        </div>
        <div className="each-slide-effect lg:h-[100vh] sm:h-[50vh]">
          <div className=" sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full bg-cover" >
            <img src="showroom1.jpg" alt="" className='aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center' />
          </div>
        </div>
      </Fade>
    </div>
  


  

  );
};
export default Carrusel;



{/* // <div className="slide-container lg:h-[100vh] sm:h-[50vh] sm:bg-cover lg:bg-cover">
    //  <Slide 
    //     autoplay={true}
    //     pauseOnHover={false}
    //   >
        <div className="each-slide-effect lg:h-[100vh] sm:h-[50vh]">
          <div className=" lg:object-cover lg:object-center  sm:object-cover sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full" >
            <img src="showroom2.jpg" alt="" className='aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center' />
          </div>
        </div>
    //     <div className="each-slide-effect lg:h-[100vh] sm:h-[50vh]">
    //       <div className="lg:w-full lg:h-full sm:h-full sm:w-full">
    //         <img src="4.jpg" alt="" className='aspect-auto w-full h-full' />
    //     </div>
    //     </div>
    //     <div className="each-slide-effect lg:h-[100vh] sm:h-[50vh]">
    //       <div className=" lg:object-cover lg:object-center  sm:object-cover sm:object-center lg:w-full lg:h-full sm:h-full sm:w-full" >
    //         <img src="showroom2.jpg" alt="" className='aspect-auto lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-[50vh] sm:object-cover sm:object-center' />
    //       </div>
    //     </div>
    //     <div className="each-slide-effect lg:h-[100vh] sm:h-[50vh]">
    //       <div className=" lg:w-full lg:h-full sm:h-full sm:w-full" >
    //         <img src="4.jpg" alt="" className=' lg:object-cover lg:object-center lg:h-full lg:w-full sm:w-full sm:h-full sm:object-cover sm:object-center' /> 
    //       </div>
    //     </div>
    //   </Slide>
    // </div> */}
