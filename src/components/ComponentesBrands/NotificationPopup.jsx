// src/components/NotificationPopup.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, Download, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotificationPopup = ({ brochures = [], logoUrl }) => {
    const { t } = useTranslation('notificationPopup');
    const [isOpen, setIsOpen] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!Array.isArray(brochures) || brochures.length === 0) {
        return null;
    }

    const currentBrochure = brochures[currentIndex];

    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);
    const handleSelectBrochure = (index) => setCurrentIndex(index);
    const handleDownload = () => {
        window.open(currentBrochure.pdfUrl, '_blank');
    };

    return (
        <>
            {isOpen ? (
                <div className="fixed bottom-5 right-5 bg-white w-[300px] md:w-[320px] p-4 rounded-lg shadow-xl border border-gray-300 z-50 flex flex-col items-center">
                    {/* Cerrar */}
                    <button
                        onClick={handleClose}
                        aria-label={t('closePopup')}
                        className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 shadow-md hover:bg-gray-900 transition"
                    >
                        <X size={16} />
                    </button>

                    {/* Logo */}
                    {logoUrl && (
                        <img
                            src={logoUrl}
                            alt={t('logoAlt')}
                            className="w-32 mb-2"
                        />
                    )}

                    {/* Imagen del Brochure */}
                    <img
                        src={currentBrochure.imageUrl}
                        alt={currentBrochure.title}
                        className="w-full max-h-[350px] object-contain rounded-md"
                    />

                    {/* Paginación */}
                    {brochures.length > 1 && (
                        <div className="flex justify-center space-x-2 mt-3">
                            {brochures.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectBrochure(idx)}
                                    className={`w-3 h-3 rounded-full transition ${idx === currentIndex
                                        ? 'bg-gray-800 scale-110'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={t('selectBrochure', { index: idx + 1 })}
                                />
                            ))}
                        </div>
                    )}

                    {/* Acciones */}
                    <div className="flex justify-end w-full mt-3 space-x-4 pr-2">
                        <a
                            href={currentBrochure.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t('viewPdf')}
                            className="flex items-center text-gray-800 hover:text-gray-600 transition"
                        >
                            <Eye size={22} />
                        </a>
                        <button
                            onClick={handleDownload}
                            aria-label={t('downloadPdf')}
                            className="flex items-center text-gray-800 hover:text-gray-600 transition"
                        >
                            <Download size={22} />
                        </button>
                    </div>

                    {/* Texto */}
                    <div className="text-center mt-3">
                        <h2 className="text-md font-semibold text-gray-900">
                            {currentBrochure.title}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {currentBrochure.description}
                        </p>
                    </div>
                </div>
            ) : (
                // Botón para reabrir
                <button
                    onClick={handleOpen}
                    aria-label={t('openPopup')}
                    className="fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-900 transition z-30"
                >
                    {t('openBrochure')}
                </button>
            )}
        </>
    );
};

NotificationPopup.propTypes = {
    brochures: PropTypes.arrayOf(
        PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
            pdfUrl: PropTypes.string.isRequired,
            title: PropTypes.string,
            description: PropTypes.string,
        })
    ).isRequired,
    logoUrl: PropTypes.string,
};

NotificationPopup.defaultProps = {
    logoUrl: '',
};

export default NotificationPopup;
