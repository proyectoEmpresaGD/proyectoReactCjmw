// src/components/ComponentesHome/carruselHome.jsx
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cdnUrl } from '../../Constants/cdn';

const SLIDE_TRANSITION_MS = 500;
const NEAR_RANGE = 1;

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function isNearIndex(idx, current, range = NEAR_RANGE) {
    return Math.abs(idx - current) <= range;
}

function LoopVideo({ src, overlay, isActive }) {
    if (!src) return null;

    // Solo renderizamos <video> cuando el slide está activo
    // (reduce descargas/cpu en el arranque si el usuario no está viendo el slide 0).
    return (
        <div className="relative h-screen w-full overflow-hidden">
            {isActive && (
                <video
                    src={cdnUrl(src)}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    loop
                    controls={false}
                    preload="metadata"
                />
            )}
            {!isActive && (
                <div className="absolute inset-0 w-full h-full bg-black" />
            )}
            {overlay}
        </div>
    );
}

function SlideImage({ src, alt, isNear, isActive }) {
    // Solo cargamos imagen real si está cerca (actual o vecinos).
    if (!isNear) {
        return <div className="w-full h-full bg-black" />;
    }

    return (
        <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            loading={isActive ? 'eager' : 'lazy'}
            decoding="async"
            fetchpriority={isActive ? 'high' : 'auto'}
        />
    );
}

function SlideOverlay({ textImg, name, esCJM, onClick, isActive }) {
    if (!textImg) return null;

    return (
        <div
            className={`absolute bottom-[15%] md:bottom-[5%] ${esCJM ? 'left-1/2' : 'left-[50%]'
                } -translate-x-1/2 text-center w-[80%] lg:w-[35%] p-4`}
        >
            <img
                src={textImg}
                alt={name || ''}
                onClick={onClick}
                className={`cursor-pointer ${esCJM ? 'w-[250px]' : 'w-[400px]'} h-auto mx-auto`}
                loading={isActive ? 'eager' : 'lazy'}
                decoding="async"
                fetchpriority={isActive ? 'high' : 'auto'}
            />
        </div>
    );
}

const CarruselHome = ({
    imagesMobile = [],
    imagesDesktop = [],
    texts,
    names,
    routes,
    videos = [],
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTap, setIsTap] = useState(true);
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
        return window.matchMedia('(max-width: 768px)').matches;
    });

    const containerRef = useRef(null);
    const navigate = useNavigate();

    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Throttle scroll sin re-render
    const scrollLockRef = useRef(false);
    const unlockTimerRef = useRef(null);

    // Alternar mobile/desktop
    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
        const mq = window.matchMedia('(max-width: 768px)');

        const handler = (e) => setIsMobile(e.matches);

        mq.addEventListener?.('change', handler);
        mq.addListener?.(handler); // fallback Safari
        return () => {
            mq.removeEventListener?.('change', handler);
            mq.removeListener?.(handler);
        };
    }, []);

    const selectedImages = useMemo(
        () => (isMobile ? imagesMobile : imagesDesktop),
        [isMobile, imagesMobile, imagesDesktop]
    );

    const totalSlides = selectedImages.length;

    const goToSlide = useCallback(
        (nextIdx) => {
            setCurrentSlide((prev) => {
                const clamped = clamp(nextIdx, 0, totalSlides - 1);
                return clamped === prev ? prev : clamped;
            });
        },
        [totalSlides]
    );

    const handleClick = useCallback(
        (idx) => {
            if (isTap && routes?.[idx]) navigate(routes[idx]);
        },
        [isTap, routes, navigate]
    );

    const lockScroll = useCallback(() => {
        scrollLockRef.current = true;
        clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = setTimeout(() => {
            scrollLockRef.current = false;
        }, SLIDE_TRANSITION_MS);
    }, []);

    // Wheel
    useEffect(() => {
        const cnt = containerRef.current;
        if (!cnt) return;

        const handleWheel = (e) => {
            if (scrollLockRef.current) return;

            const dir = e.deltaY > 0 ? 1 : -1;
            lockScroll();
            goToSlide(currentSlide + dir);
        };

        cnt.addEventListener('wheel', handleWheel, { passive: true });
        return () => cnt.removeEventListener('wheel', handleWheel);
    }, [currentSlide, goToSlide, lockScroll]);

    // Touch
    useEffect(() => {
        const cnt = containerRef.current;
        if (!cnt) return;

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

            if (dy > 50) goToSlide(currentSlide + 1);
            else if (dy < -50) goToSlide(currentSlide - 1);
        };

        cnt.addEventListener('touchstart', onStart, { passive: true });
        cnt.addEventListener('touchmove', onMove, { passive: true });
        cnt.addEventListener('touchend', onEnd, { passive: true });

        return () => {
            cnt.removeEventListener('touchstart', onStart);
            cnt.removeEventListener('touchmove', onMove);
            cnt.removeEventListener('touchend', onEnd);
        };
    }, [currentSlide, goToSlide]);

    useEffect(() => {
        return () => clearTimeout(unlockTimerRef.current);
    }, []);

    // Precompute urls para no recalcular en cada render del map
    const slideData = useMemo(() => {
        return selectedImages.map((rawImg, idx) => {
            const imgSrc = cdnUrl(rawImg);
            const textImg = texts?.[idx] ? cdnUrl(texts[idx]) : null;
            return { imgSrc, textImg };
        });
    }, [selectedImages, texts]);

    const arenaLogo = useMemo(() => (texts?.[4] ? cdnUrl(texts[4]) : null), [texts]);
    const arenaRoute = routes?.[4];

    return (
        <div className="relative h-screen overflow-hidden w-full" ref={containerRef}>
            <div
                className="flex flex-col transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
            >
                {slideData.map(({ imgSrc, textImg }, idx) => {
                    const isActive = idx === currentSlide;
                    const isNear = isNearIndex(idx, currentSlide, NEAR_RANGE);
                    const esCJM = names?.[idx] === 'CJM';

                    // Overlay estándar (solo cargar cerca)
                    const overlay = isNear ? (
                        <SlideOverlay
                            textImg={textImg}
                            name={names?.[idx]}
                            esCJM={esCJM}
                            onClick={() => handleClick(idx)}
                            isActive={isActive}
                        />
                    ) : null;

                    // Slide 0: vídeo loop + logo ARENA (LCP)
                    if (idx === 0) {
                        const arenaOverlay = arenaLogo ? (
                            <div className="absolute bottom-[15%] md:bottom-[5%] left-1/2 -translate-x-1/2 text-center w-[80%] lg:w-[30%] p-4">
                                <img
                                    src={arenaLogo}
                                    alt="ARENA"
                                    onClick={() => arenaRoute && navigate(arenaRoute)}
                                    className="cursor-pointer w-[550px] h-auto mx-auto"
                                    loading={isActive ? 'eager' : 'lazy'}
                                    decoding="async"
                                    fetchpriority={isActive ? 'high' : 'auto'}
                                />
                            </div>
                        ) : null;

                        return (
                            <div key={idx} className="h-screen w-full relative">
                                <LoopVideo src={videos?.[0]} overlay={arenaOverlay} isActive={isActive} />
                            </div>
                        );
                    }

                    // Resto slides: cargar imagen solo si está cerca
                    return (
                        <div key={idx} className="h-screen w-full relative">
                            <SlideImage
                                src={imgSrc}
                                alt={`Slide ${idx}`}
                                isNear={isNear}
                                isActive={isActive}
                            />
                            {overlay}
                        </div>
                    );
                })}
            </div>

            {/* Indicadores móviles */}
            {currentSlide > 0 && (
                <div className="absolute right-2 top-1/4 md:hidden transition-opacity duration-300">
                    <span className="block text-white font-bold rotate-90 mb-20" style={{ width: '1em' }}>
                        {names?.[currentSlide] || ''}
                    </span>
                    {selectedImages.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full mb-2 ${idx === currentSlide ? 'bg-white' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Dots desktop */}
            {names?.length > 0 && (
                <div className="absolute bottom-5 left-0 right-6 hidden md:flex justify-center space-x-8">
                    {names.map((name, idx) => (
                        <span
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={`cursor-pointer transition-colors ${idx === currentSlide ? 'text-black font-bold' : 'text-white/50'
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
