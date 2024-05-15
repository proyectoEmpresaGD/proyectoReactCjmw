
import ModalMapa from "./modalMapa";
import { useState } from 'react';

const Modal = ({ isOpen, close, product, src, alt }) => {
    const [modalMapaOpen, setModalMapaOpen] = useState(false); // Estado para controlar la apertura de ModalMapa

    const handleMapClick = () => {
        setModalMapaOpen(true); // Abre ModalMapa cuando se cliquea el botón
    };

    // Si `isOpen` es falso, no se muestra nada
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30" >
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full m-4 grid xl:grid-cols-2 grid-cols-1 my-auto gap-3" onClick={e => e.stopPropagation()}>
                {/* Columna del contenido */}
                <img src="https://cjmw.eu/ANTILLA%20CACAO%201200.jpg" alt={alt} className="w-full h-auto rounded-md" />

                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold mb-4">{product.desprodu}</h2>
                        <p className="mb-4">Descripción o detalles adicionales del producto podrían ir aquí.</p>
                    </div>
                    <div className="flex justify-between mt-4">
                        <button className="bg-black hover:bg-gray-400 duration-200 text-white font-bold py-2 px-4 rounded" 
                                onClick={handleMapClick}>Dónde comprar</button>
                        <button className="bg-black hover:bg-gray-400 duration-200 text-white font-bold py-2 px-4 rounded" >Adquirir muestra</button>
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