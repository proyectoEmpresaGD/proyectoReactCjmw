import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from './modal';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

const ShareButton = ({ selectedProduct }) => {
    const [showIcons, setShowIcons] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [product, setProduct] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const someSecureToken = uuidv4();

    //Esto encripta la ruta y solo se puede desencriptar poniendo en el componente que sea necesario el secretKey y lo siguiente:
    // const decryptedProductId = encryptedProductId
    //     ? CryptoJS.AES.decrypt(encryptedProductId, secretKey).toString(CryptoJS.enc.Utf8)
    //     : null;
    //Una vez hecho esto la variable que se quiera utilizar como identificador se iguala a la variable decryptedProductId y listo

    const secretKey = 'R2tyY1|YO.Bp!bK£BCl7l*?ZC1dT+q~6cAT-4|nx2z`0l3}78U';
    const encryptedProductId = CryptoJS.AES.encrypt(selectedProduct.codprodu, secretKey).toString();
    const currentUrl = `${window.location.origin}/#/products?pid=${encodeURIComponent(encryptedProductId)}&sid=${someSecureToken}`;

    const handleToggleShareIcons = (e) => {
        e.preventDefault();
        setShowIcons(!showIcons);
    };

    return (
        <div className="">
            {/* Botón de compartir */}
            <div className="relative justify-center  top-2 left-0">
                <button className="relative" onClick={handleToggleShareIcons}>
                    <img
                        src="https://bassari.eu/ImagenesTelasCjmw/Iconos/linked_services_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                        className="w-7 h-7 hover:scale-125 duration-200"
                        alt="Compartir"
                    />
                </button>
            </div>

            {/* Iconos de redes sociales (se muestran u ocultan según el estado) */}
            {showIcons && (
                <div className="flex space-x-2 mt-2 absolute top-12 left-4">

                    {/* Enlace para Facebook */}
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Compartir en Facebook"
                    >
                        <img src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ICONOS%20REDES%20SOCIALES/facebook.png" className="w-8 h-8" alt="Facebook" />
                    </a>

                    {/* Enlace para Twitter */}
                    <a
                        href={`https://twitter.com/share?url=${encodeURIComponent(currentUrl)}&text=Mira este producto!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Compartir en Twitter"
                    >
                        <img src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ICONOS%20REDES%20SOCIALES/twitter.png" className="w-8 h-8" alt="Twitter" />
                    </a>

                    {/* Enlace para WhatsApp */}
                    <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent('¡Mira este producto! ' + currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Compartir en WhatsApp"
                    >
                        <img src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ICONOS%20REDES%20SOCIALES/whatsapp.png" className="w-8 h-8" alt="WhatsApp" />
                    </a>

                    {/* Enlace para LinkedIn */}
                    <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Compartir en LinkedIn"
                    >
                        <img src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ICONOS%20REDES%20SOCIALES/linkedin.png" className="w-8 h-8" alt="LinkedIn" />
                    </a>

                    {/* Enlace para Gmail */}
                    <a
                        href={`mailto:?subject=Mira este producto&body=Consulta este enlace: ${encodeURIComponent(currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Compartir por Gmail"
                    >
                        <img src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ICONOS%20REDES%20SOCIALES/gmail.png" className="w-8 h-8" alt="Gmail" />
                    </a>
                </div>
            )}

            {/* Modal que se abre cuando se visita el enlace */}
            {modalOpen && product && (
                <Modal isOpen={modalOpen} close={() => setModalOpen(false)} product={product} />
            )}
        </div>
    );
};

export default ShareButton;
