// src/components/ComponentesHome/carruselHome.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { cdnUrl } from '../../Constants/cdn';

// Config
const IMAGE_SHOW_MS = 5000; // 5s imagen antes/después de los vídeos
const FADE_MS = 500;        // duración del crossfade

/**
 * Crossfade de dos <video> con pre-carga pausada.
 * - No se reproduce nada hasta que `playing === true`.
 * - Entre vídeos: precarga en buffer oculto, mantiene pausado a 0, y crossfade cuando toca.
 */
function CrossfadeVideo({ sources = [], playing, onCycleEnd }) {
    const [idx, setIdx] = useState(0);
    const [active, setActive] = useState('A'); // 'A' | 'B'
    const [srcA, setSrcA] = useState(null);
    const [srcB, setSrcB] = useState(null);
    const refA = useRef(null);
    const refB = useRef(null);
    const [opA, setOpA] = useState(0);
    const [opB, setOpB] = useState(0);
    const fadeTimeout = useRef(null);

    // Montaje/reset cuando cambia la playlist
    useEffect(() => {
        clearTimeout(fadeTimeout.current);
        if (!sources.length) {
            setSrcA(null); setSrcB(null); setOpA(0); setOpB(0); setIdx(0);
            return;
        }
        // Cargamos el primer vídeo en A en pausa y al inicio
        const first = cdnUrl(sources[0]);
        setSrcA(first);
        setSrcB(null);
        setIdx(0);
        setActive('A');
        setOpA(0);
        setOpB(0);
    }, [sources]);

    // Control global de reproducción
    useEffect(() => {
        const vA = refA.current, vB = refB.current;
        clearTimeout(fadeTimeout.current);

        if (!playing) {
            // Pausa todo y vuelve a 0 para que no avance en segundo plano
            if (vA) { vA.pause(); try { vA.currentTime = 0; } catch { } }
            if (vB) { vB.pause(); try { vB.currentTime = 0; } catch { } }
            setOpA(0);
            setOpB(0);
            return;
        }

        // playing === true: arrancamos desde el buffer activo al frame 0
        const playActive = async () => {
            const v = active === 'A' ? refA.current : refB.current;
            if (v) {
                try { v.currentTime = 0; } catch { }
                // aseguramos muted + playsInline para autoplay
                await v.play().catch(() => { });
            }
            // hacemos visible el activo
            if (active === 'A') { setOpA(1); setOpB(0); }
            else { setOpA(0); setOpB(1); }
        };
        playActive();
    }, [playing, active]);

    // Cuando termina el vídeo activo
    const handleEnded = () => {
        if (!sources.length) return;
        const next = idx + 1;

        if (next < sources.length) {
            // Preparar buffer inactivo con el siguiente vídeo (pausado a 0)
            const nextSrc = cdnUrl(sources[next]);
            const useA = active === 'B';
            if (useA) setSrcA(nextSrc); else setSrcB(nextSrc);

            // Esperamos a que React pinte el nuevo src y luego preparamos reproducción y crossfade
            requestAnimationFrame(() => {
                const nextRef = (useA ? refA : refB).current;
                if (nextRef) {
                    try { nextRef.currentTime = 0; } catch { }
                    nextRef.pause(); // aseguramos pausa hasta el inicio del crossfade
                }

                // Iniciar crossfade: reproducir el siguiente y fundir opacidades
                const doCrossfade = async () => {
                    if (nextRef) await nextRef.play().catch(() => { });
                    if (useA) {
                        setOpA(1); setOpB(0);
                    } else {
                        setOpB(1); setOpA(0);
                    }
                    // Tras el fade, cambiamos activo y pausamos el anterior para ahorrar CPU
                    clearTimeout(fadeTimeout.current);
                    fadeTimeout.current = setTimeout(() => {
                        const prevRef = (useA ? refB : refA).current;
                        prevRef?.pause?.();
                        setActive(useA ? 'A' : 'B');
                        setIdx(next);
                    }, FADE_MS);
                };
                doCrossfade();
            });
        } else {
            // Terminó la lista completa
            onCycleEnd?.();
        }
    };

    useEffect(() => () => clearTimeout(fadeTimeout.current), []);

    return (
        <div className="absolute inset-0">
            {/* Video A */}
            {srcA && (
                <video
                    key={`A-${srcA}`}
                    ref={refA}
                    src={srcA}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
                    style={{ opacity: opA, transitionDuration: `${FADE_MS}ms` }}
                    preload="auto"
                    muted
                    playsInline
                    controls={false}
                    onEnded={handleEnded}
                />
            )}
            {/* Video B */}
            {srcB && (
                <video
                    key={`B-${srcB}`}
                    ref={refB}
                    src={srcB}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
                    style={{ opacity: opB, transitionDuration: `${FADE_MS}ms` }}
                    preload="auto"
                    muted
                    playsInline
                    controls={false}
                    onEnded={handleEnded}
                />
            )}
        </div>
    );
}

/**
 * HeroMedia
 * - Imagen 5s (vídeos precargados pero pausados y a 0, no se oyen ni avanzan).
 * - Crossfade imagen→vídeo arrancando desde 0.
 * - Playlist con crossfade entre vídeos.
 * - Al terminar, vuelve a imagen 5s y repite.
 */
function HeroMedia({ imageSrc, videos = [], overlay }) {
    const [phase, setPhase] = useState('image'); // 'image' | 'video'
    const [showImage, setShowImage] = useState(true);
    const [mountVideoLayer, setMountVideoLayer] = useState(false);
    const [playingVideos, setPlayingVideos] = useState(false);
    const imageTimerRef = useRef(null);

    useEffect(() => () => clearTimeout(imageTimerRef.current), []);

    // Fase imagen: mostrar imagen, montar capa de vídeo (preload pausado) pero NO reproducir
    useEffect(() => {
        if (phase !== 'image') return;
        setMountVideoLayer(!!videos.length);
        setPlayingVideos(false); // importantísimo: NO reproducir bajo la imagen

        clearTimeout(imageTimerRef.current);
        if (!videos.length) return; // si no hay vídeos, nos quedamos en imagen

        imageTimerRef.current = setTimeout(() => {
            // Iniciar crossfade: activar reproducción y desvanecer imagen a la vez
            setPlayingVideos(true);  // los vídeos empiezan AHORA desde 0
            setShowImage(false);
            // Al finalizar el fade, estamos oficialmente en fase vídeo
            setTimeout(() => setPhase('video'), FADE_MS);
        }, IMAGE_SHOW_MS);
    }, [phase, videos.length]);

    // Fin de la playlist: volver a imagen (y parar vídeos para que no avancen)
    const handleVideosCycleEnd = () => {
        setPlayingVideos(false); // pausa y resetea en CrossfadeVideo
        setShowImage(true);
        setPhase('image');
        // Mantener montada la capa de vídeo evita flashes en el siguiente ciclo
        setMountVideoLayer(true);
    };

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Imagen arriba (se desvanece) */}
            <img
                src={imageSrc}
                alt="Hero"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out ${showImage ? 'opacity-100' : 'opacity-0'
                    }`}
                style={{ transitionDuration: `${FADE_MS}ms` }}
            />

            {/* Capa de vídeo debajo (se hace visible durante el fade) */}
            {mountVideoLayer && videos.length > 0 && (
                <div
                    className={`absolute inset-0 transition-opacity ease-in-out ${showImage ? 'opacity-0' : 'opacity-100'
                        }`}
                    style={{ transitionDuration: `${FADE_MS}ms` }}
                >
                    <CrossfadeVideo
                        sources={videos}
                        playing={playingVideos}
                        onCycleEnd={handleVideosCycleEnd}
                    />
                </div>
            )}

            {/* Overlay por encima de todo */}
            {overlay}
        </div>
    );
}

/**
 * CarruselHome
 * - Mantiene tu transición vertical original (translateY + transition-transform).
 * - Solo el slide 0 usa HeroMedia (con crossfade y pre-carga pausada).
 */
const CarruselHome = ({ imagesMobile = [], imagesDesktop = [], texts, names, routes, videos = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isTap, setIsTap] = useState(true);
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
        return window.matchMedia('(max-width: 768px)').matches;
    });

    const containerRef = useRef(null);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const navigate = useNavigate();

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

    // Selección final de imágenes
    const selectedImages = useMemo(
        () => (isMobile ? imagesMobile : imagesDesktop),
        [isMobile, imagesMobile, imagesDesktop]
    );

    // Scroll con rueda (tu lógica original)
    useEffect(() => {
        const handleScroll = (e) => {
            if (isScrolling) return;
            const dir = e.deltaY > 0 ? 1 : -1;
            setIsScrolling(true);
            setCurrentSlide((prev) => {
                if (dir === 1 && prev < selectedImages.length - 1) return prev + 1;
                if (dir === -1 && prev > 0) return prev - 1;
                return prev;
            });
            setTimeout(() => setIsScrolling(false), 500);
        };
        const cnt = containerRef.current;
        cnt?.addEventListener('wheel', handleScroll);
        return () => cnt?.removeEventListener('wheel', handleScroll);
    }, [selectedImages.length, isScrolling]);

    // Gestos táctiles (tu lógica original)
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
            if (dy > 50 && currentSlide < selectedImages.length - 1) {
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
    }, [selectedImages.length, currentSlide]);

    // Click
    const handleClick = (idx) => {
        if (isTap && routes?.[idx]) navigate(routes[idx]);
    };

    return (
        <div className="relative h-screen overflow-hidden w-full" ref={containerRef}>
            {/* TRANSICIÓN VERTICAL ORIGINAL */}
            <div
                className="flex flex-col transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
            >
                {selectedImages.map((rawImg, idx) => {
                    const imgSrc = cdnUrl(rawImg);
                    const textImg = texts?.[idx] ? cdnUrl(texts[idx]) : null;

                    const overlay = textImg ? (
                        <div className="absolute bottom-[40%] left-1/2 transform -translate-x-1/2 text-center w-[80%] lg:w-[35%] p-4">
                            <img
                                src={textImg}
                                alt={names?.[idx] || ''}
                                onClick={() => handleClick(idx)}
                                className="cursor-pointer"
                                style={
                                    names?.[idx] === 'CJM'
                                        ? { width: '250px', height: 'auto', margin: 'auto' }
                                        : { width: '550px', height: 'auto' }
                                }
                            />
                        </div>
                    ) : null;

                    // Slide 0 -> Hero con crossfade y control de reproducción
                    if (idx === 0) {
                        return (
                            <div key={idx} className="h-screen w-full relative">
                                <HeroMedia imageSrc={imgSrc} videos={videos} overlay={overlay} />
                            </div>
                        );
                    }

                    // Resto de slides -> sin cambios
                    return (
                        <div key={idx} className="h-screen w-full relative">
                            <img src={imgSrc} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
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
                            className={`w-3 h-3 rounded-full mb-2 ${idx === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            )}

            {/* Dots desktop */}
            {names?.length > 0 && (
                <div className="absolute bottom-5 left-0 right-0 hidden md:flex justify-center space-x-8">
                    {names.map((name, idx) => (
                        <span
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
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
