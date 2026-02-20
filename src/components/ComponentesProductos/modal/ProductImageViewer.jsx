import { useEffect, useMemo, useRef, useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const ProductImageViewer = ({
    selectedImage,
    alt,
    t,

    isViewerOpen,
    setIsViewerOpen,

    galleryImages,
    photoIndex,
    setPhotoIndex,

    artisticPairs,
    selectedArtisticIndex,
    setSelectedArtisticIndex,

    mainItem,
    setMainItem,
    setSelectedImage,
    setArtisticPairs,
}) => {
    const slides = useMemo(() => (galleryImages || []).map((src) => ({ src })), [galleryImages]);

    const requestedImage =
        typeof selectedImage === 'string' && selectedImage.trim()
            ? selectedImage
            : null;

    const visiblePairs = Array.isArray(artisticPairs)
        ? artisticPairs.filter((p) => typeof p?.thumb === 'string' && p.thumb.trim())
        : [];

    const imageContainerRef = useRef(null);

    // La imagen que realmente se renderiza (se mantiene la anterior hasta que cargue la nueva)
    const [displayImage, setDisplayImage] = useState(requestedImage);

    const [imageAspectRatio, setImageAspectRatio] = useState(null); // height / width
    const [containerHeight, setContainerHeight] = useState(null);

    // Sincroniza el estado inicial (por si entra null -> url o cambios rápidos)
    useEffect(() => {
        if (requestedImage && !displayImage) {
            setDisplayImage(requestedImage);
        }
        if (!requestedImage) {
            setDisplayImage(null);
            setImageAspectRatio(null);
            setContainerHeight(null);
        }
    }, [requestedImage, displayImage]);

    // Precarga la imagen solicitada; solo cuando está cargada:
    // 1) calcula ratio, 2) actualiza altura, 3) hace swap de displayImage
    useEffect(() => {
        if (!requestedImage) return;

        // Si es la misma que ya está mostrada, no recargues
        if (requestedImage === displayImage && imageAspectRatio) return;

        let cancelled = false;

        const img = new Image();
        img.src = requestedImage;

        img.onload = () => {
            if (cancelled) return;

            if (img.naturalWidth && img.naturalHeight) {
                setImageAspectRatio(img.naturalHeight / img.naturalWidth);
            }

            // Swap solo cuando ya cargó (evita flash blanco)
            setDisplayImage(requestedImage);
        };

        img.onerror = () => {
            if (cancelled) return;
            // Si falla la carga, intentamos mostrar igualmente para no quedarnos en blanco
            setDisplayImage(requestedImage);
        };

        return () => {
            cancelled = true;
            img.onload = null;
            img.onerror = null;
        };
    }, [requestedImage, displayImage, imageAspectRatio]);

    // Calcula altura del contenedor en base al ratio y al ancho real del contenedor
    useEffect(() => {
        if (!imageContainerRef.current || !imageAspectRatio) return;

        const el = imageContainerRef.current;

        const updateHeight = () => {
            const width = el.getBoundingClientRect().width;
            if (!width) return;
            setContainerHeight(Math.round(width * imageAspectRatio));
        };

        updateHeight();

        const ro = new ResizeObserver(() => updateHeight());
        ro.observe(el);

        return () => ro.disconnect();
    }, [imageAspectRatio]);

    return (
        <div className="lg:w-7/12 w-full max-w-[100%] mx-auto lg:mx-0">
            <div
                ref={imageContainerRef}
                className="relative rounded-3xl bg-transparent shadow-2xl border-0 p-0 overflow-hidden"
                style={{
                    width: '100%',
                    height: containerHeight ? `${containerHeight}px` : 'auto',
                    transition: 'height 300ms ease-out',
                }}
            >
                <button
                    onClick={() => setIsViewerOpen(true)}
                    className="absolute left-3 top-3 sm:left-4 sm:top-4 z-10 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition hover:scale-110"
                    title={t('zoomImage')}
                    type="button"
                >
                    <img
                        src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/04_ICONOS_USADOS_EN_DIFERENTES_SITIOS/ICONO%20AMPLIAR.png"
                        alt={t('zoomAlt')}
                        className="h-5 w-5"
                    />
                </button>

                {displayImage ? (
                    <Zoom>
                        <InnerImageZoom
                            src={displayImage}
                            zoomSrc={displayImage}
                            alt={alt}
                            className={[
                                '!block !w-full !object-cover',
                                containerHeight ? '!h-full' : '!h-auto',
                            ].join(' ')}
                            style={{
                                display: 'block',
                                width: '100%',
                                height: containerHeight ? '100%' : 'auto',
                                borderRadius: '1.5rem',
                            }}
                        />
                    </Zoom>
                ) : null}
            </div>

            {isViewerOpen && (
                <Lightbox
                    open={isViewerOpen}
                    close={() => setIsViewerOpen(false)}
                    slides={slides}
                    index={photoIndex}
                    on={{ view: ({ index }) => setPhotoIndex(index) }}
                />
            )}

            {visiblePairs.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                    {visiblePairs.map((pair, idx) => (
                        <button
                            key={pair.key || idx}
                            type="button"
                            onClick={() => {
                                setSelectedArtisticIndex(idx);

                                setArtisticPairs((prev) => {
                                    const next = Array.isArray(prev) ? [...prev] : [];
                                    const clicked = next[idx];
                                    if (!clicked) return prev;

                                    next[idx] = mainItem;
                                    setMainItem(clicked);

                                    const nextSrc = clicked?.full || clicked?.thumb;
                                    if (nextSrc && String(nextSrc).trim()) setSelectedImage(nextSrc);

                                    return next;
                                });
                            }}
                            className={[
                                'relative w-24 sm:w-24 aspect-square overflow-hidden rounded-xl border border-white/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg',
                                idx === selectedArtisticIndex ? 'ring-2 ring-gray-300' : '',
                            ].join(' ')}
                            title={pair.kind === 'ambiente' ? `Ver ambiente ${pair.group ?? ''}`.trim() : 'Ver artística'}
                        >
                            <img
                                src={pair.thumb}
                                alt={pair.kind === 'ambiente' ? `Ambiente ${pair.group ?? ''}`.trim() : 'Artística'}
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImageViewer;
