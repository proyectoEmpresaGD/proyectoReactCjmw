import ModalMapa from "./modalMapa";
import { useState, useRef, useEffect } from 'react';

const Modal = ({ isOpen, close, product, src, alt }) => {
    const [modalMapaOpen, setModalMapaOpen] = useState(false); // Estado para controlar la apertura de ModalMapa
    const [imageLoaded, setImageLoaded] = useState(false); // Estado para controlar la carga de la imagen
    const lensRef = useRef(null);
    const resultRef = useRef(null);
    const zoomFactor = 2; // Factor de zoom

    const handleMapClick = () => {
        setModalMapaOpen(true); // Abre ModalMapa cuando se cliquea el botón
    };

    const handleImageLoad = () => {
        setImageLoaded(true); // Marca la imagen como cargada
    };

    const handleImageError = () => {
        console.error('Error loading image'); // Maneja el error de carga de la imagen
    };

    const moveLens = (e) => {
        if (!lensRef.current || !resultRef.current || !imageLoaded) return;

        const lens = lensRef.current;
        const result = resultRef.current;
        const img = e.target;
        const { left, top, width, height } = img.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const lensWidth = lens.offsetWidth / 2;
        const lensHeight = lens.offsetHeight / 2;

        const posX = x - lensWidth;
        const posY = y - lensHeight;

        const boundedPosX = Math.max(0, Math.min(posX, width - lens.offsetWidth));
        const boundedPosY = Math.max(0, Math.min(posY, height - lens.offsetHeight));

        lens.style.left = `${boundedPosX}px`;
        lens.style.top = `${boundedPosY}px`;

        result.style.backgroundPosition = `-${boundedPosX * zoomFactor}px -${boundedPosY * zoomFactor}px`;
    };

    // Si `isOpen` es falso, no se muestra nada
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30 p-4">
            <div className="bg-white p-6 rounded-lg max-w-full w-full md:max-w-4xl m-4 h-auto">
                <h2 className="text-center text-2xl font-bold mb-4">{product.desprodu}</h2>
                <div className="flex justify-end">
                    <button className="relative overflow-hidden m-4" onClick={close}>
                        <img src="close.svg" className='w-6 h-6 hover:scale-125 duration-200' alt="Close" />
                    </button>
                </div>
                
                <div className="grid md:grid-cols-2 grid-cols-1 gap-3" onClick={e => e.stopPropagation()}>
                    {/* Columna del contenido */}
                    <div className="relative group">
                        <img 
                            src={product.urlimagen} 
                            alt={alt} 
                            className="w-full h-full rounded-md" 
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            onMouseMove={moveLens}
                        />
                        {imageLoaded && (
                            <>
                                <div 
                                    ref={lensRef} 
                                    className="absolute hidden group-hover:block w-24 h-24 border border-black opacity-40 bg-white pointer-events-none"
                                ></div>
                                <div 
                                    ref={resultRef} 
                                    className="absolute hidden group-hover:block top-0 left-0 w-full h-full bg-white bg-cover pointer-events-none"
                                    style={{
                                        backgroundImage: `url(${product.urlimagen})`,
                                        backgroundSize: `${zoomFactor * 100}%`
                                    }}
                                ></div>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col justify-between">
                        <div>
                            <p className="mb-4">Descripción o detalles adicionales del producto podrían ir aquí.</p>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button className="bg-black hover:bg-gray-400 duration-200 text-white font-bold py-2 px-4 rounded" 
                                    onClick={handleMapClick}>Dónde comprar</button>
                            <button className="bg-black hover:bg-gray-400 duration-200 text-white font-bold py-2 px-4 rounded">Adquirir muestra</button>
                        </div>
                    </div>
                </div>
            </div>
            {modalMapaOpen && (
                <ModalMapa isOpen={modalMapaOpen} close={() => setModalMapaOpen(false)} />
            )}
        </div>
    );
}

export default Modal;