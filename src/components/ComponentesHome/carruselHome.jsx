// src/components/CarruselHome.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cdnUrl } from '../../Constants/cdn'; // <-- import helper CDN

const CarruselHome = ({ images, texts, names, routes }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isTap, setIsTap] = useState(true);
    const containerRef = useRef(null);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const navigate = useNavigate();

    // desktop wheel scroll
    useEffect(() => {
        const handleScroll = (e) => {
            if (isScrolling) return;
            const dir = e.deltaY > 0 ? 1 : -1;
            setIsScrolling(true);
            setCurrentSlide((prev) => {
                if (dir === 1 && prev < images.length - 1) return prev + 1;
                if (dir === -1 && prev > 0) return prev - 1;
                return prev;
            });
            setTimeout(() => setIsScrolling(false), 500);
        };
        const cnt = containerRef.current;
        cnt?.addEventListener('wheel', handleScroll);
        return () => cnt?.removeEventListener('wheel', handleScroll);
    }, [images.length, isScrolling]);

    // touch swipe
    useEffect(() => {
        const onStart = (e) => {
            touchStartY.current = e.touches[0].clientY;
            touchStartX.current = e.touches[0].clientX;
            setIsTap(true);
        };
        const onMove = (e) => {
            touchEndY.current = e.touches[0].clientY;
            touchEndX.current = e.touches[0].clientX;
            if (
                Math.abs(touchStartY.current - touchEndY.current) > 10 ||
                Math.abs(touchStartX.current - touchEndX.current) > 10
            ) {
                setIsTap(false);
            }
        };
        const onEnd = () => {
            const dy = touchStartY.current - touchEndY.current;
            if (dy > 50 && currentSlide < images.length - 1) {
                setCurrentSlide((s) => s + 1);
            } else if (dy < -50 && currentSlide > 0) {
                setCurrentSlide((s) => s - 1);
            }
        };
        const cnt = containerRef.current;
        cnt?.addEventListener('touchstart', onStart);
        cnt?.addEventListener('touchmove', onMove);
        cnt?.addEventListener('touchend', onEnd);
        return () => {
            cnt?.removeEventListener('touchstart', onStart);
            cnt?.removeEventListener('touchmove', onMove);
            cnt?.removeEventListener('touchend', onEnd);
        };
    }, [images.length, currentSlide]);

    // click handler
    const handleClick = (idx) => {
        if (isTap && routes?.[idx]) {
            navigate(routes[idx]);
        }
    };

    return (
        <div className="relative h-screen overflow-hidden w-full" ref={containerRef}>
            <div
                className="flex flex-col transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
            >
                {images.map((rawImg, idx) => {
                    const imgSrc = cdnUrl(rawImg);
                    const textImg = texts?.[idx] ? cdnUrl(texts[idx]) : null;
                    return (
                        <div key={idx} className="h-screen w-full relative">
                            <img
                                src={imgSrc}
                                alt={`Slide ${idx}`}
                                className="w-full h-full object-cover"
                            />

                            {textImg && (
                                <div className="absolute bottom-[35%] left-1/2 transform -translate-x-1/2 text-center w-[70%] lg:w-[25%] p-4">
                                    <img
                                        src={textImg}
                                        alt={names[idx] || ''}
                                        onClick={() => handleClick(idx)}
                                        className="cursor-pointer"
                                        style={
                                            names[idx] === 'CJM'
                                                ? { width: '250px', height: 'auto', margin: 'auto' }
                                                : { width: '550px', height: 'auto' }
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobile indicators */}
            <div className="absolute right-2 top-1/4 md:hidden">
                <span
                    className="block text-white font-bold rotate-90 mb-4"
                    style={{ width: '1em' }}
                >
                    {names[currentSlide] || ''}
                </span>
                {[...images].map((_, idx) => (
                    <div
                        key={idx}
                        className={`w-3 h-3 rounded-full mb-2 ${idx === currentSlide ? 'bg-white' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>

            {/* Desktop nav dots */}
            {names?.length > 0 && (
                <div className="absolute bottom-5 left-0 right-0 hidden md:flex justify-center space-x-8">
                    {names.map((name, idx) => (
                        <span
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`cursor-pointer transition-colors ${idx === currentSlide
                                ? 'text-black font-bold'
                                : 'text-white/50'
                                }`}
                        >
                            {name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarruselHome;
