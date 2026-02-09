// src/components/ShareButton.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import Modal from './modal';

const ShareButton = ({ selectedProduct }) => {
    const { t } = useTranslation('shareButton');
    const [showIcons, setShowIcons] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const someSecureToken = uuidv4();

    const secretKey = 'R2tyY1|YO.Bp!bK£BCl7l*?ZC1dT+q~6cAT-4|nx2z`0l3}78U';
    const encryptedProductId = CryptoJS.AES.encrypt(selectedProduct.codprodu, secretKey).toString();
    const currentUrl = `${window.location.origin}/#/products?pid=${encodeURIComponent(encryptedProductId)}&sid=${someSecureToken}`;

    const toggleIcons = e => {
        e.preventDefault();
        setShowIcons(prev => !prev);
    };

    return (
        <div className="relative inline-block">
            {/* Botón principal */}
            <button
                className="flex items-center space-x-2 pr-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                onClick={toggleIcons}
                title={t('shareTitle')}
            >
                <img
                    src="https://bassari.eu/ImagenesTelasCjmw/ICONOS/00_ICONOS_USADOS_EN_WEB/04_ICONOS_USADOS_EN_DIFERENTES_SITIOS/linked_services_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
                    alt={t('shareIconAlt')}
                    className="w-8 h-6"
                />
                <span className="text-sm font-medium text-gray-700">
                    {t('shareButton')}
                </span>
            </button>

            {/* Iconos de redes sociales */}
            {showIcons && (
                <div className="absolute left-0 mt-2 flex space-x-2 bg-white p-2 border border-gray-200 rounded shadow-md">
                    {/* Facebook */}
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('facebookAria')}
                    >
                        <img
                            src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ICONOS%20REDES%20SOCIALES/facebook.png"
                            alt={t('facebookAlt')}
                            className="w-8 h-8 hover:scale-110 transition-transform"
                        />
                    </a>

                    {/* Twitter */}
                    <a
                        href={`https://twitter.com/share?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(t('twitterText'))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('twitterAria')}
                    >
                        <img
                            src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ICONOS%20REDES%20SOCIALES/twitter.png"
                            alt={t('twitterAlt')}
                            className="w-8 h-8 hover:scale-110 transition-transform"
                        />
                    </a>

                    {/* WhatsApp */}
                    <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(t('whatsappText') + ' ' + currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('whatsappAria')}
                    >
                        <img
                            src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ICONOS%20REDES%20SOCIALES/whatsapp.png"
                            alt={t('whatsappAlt')}
                            className="w-8 h-8 hover:scale-110 transition-transform"
                        />
                    </a>

                    {/* LinkedIn */}
                    <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('linkedinAria')}
                    >
                        <img
                            src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ICONOS%20REDES%20SOCIALES/linkedin.png"
                            alt={t('linkedinAlt')}
                            className="w-8 h-8 hover:scale-110 transition-transform"
                        />
                    </a>

                    {/* Email */}
                    <a
                        href={`mailto:?subject=${encodeURIComponent(t('emailSubject'))}&body=${encodeURIComponent(t('emailBody') + ' ' + currentUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('emailAria')}
                    >
                        <img
                            src="https://bassari.eu/ImagenesTelasCjmw/FOTOS%20PAGINA%20WEB%20CJMW/ICONOS%20REDES%20SOCIALES/gmail.png"
                            alt={t('emailAlt')}
                            className="w-8 h-8 hover:scale-110 transition-transform"
                        />
                    </a>
                </div>
            )}

            {/* Modal (igual que antes) */}
            {modalOpen && product && (
                <Modal isOpen={modalOpen} close={() => setModalOpen(false)} product={product} />
            )}
        </div>
    );
};

export default ShareButton;
