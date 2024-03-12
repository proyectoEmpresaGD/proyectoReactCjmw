import React from 'react';
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import "./App.css"


const Carrusel = () => {
    const images = [
        "slide1.jpg",
        "slide2.jpg",
        "slide3.jpg",
        "slide4.jpg",
        "slide5.jpg"
    ];

    return (
        <Zoom>
            <div className="each-slide-effect">
                <div style={{ 'backgroundImage': `url(${images[0]})` }}>
                    
                </div>
            </div>
            <div className="each-slide-effect">
                <div style={{ 'backgroundImage': `url(${images[1]})` }}>
                    
                </div>
            </div>
            <div className="each-slide-effect">
                <div style={{ 'backgroundImage': `url(${images[2]})` }}>
                    
                </div>
            </div>
            <div className="each-slide-effect">
                <div style={{ 'backgroundImage': `url(${images[3]})` }}>
                    
                </div>
            </div>
        </Zoom>

        
    );
};

export default Carrusel;