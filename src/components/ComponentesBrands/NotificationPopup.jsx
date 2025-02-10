import { useState } from "react";
import PropTypes from "prop-types";
import { Eye, Download, X } from "lucide-react";

const NotificationPopup = ({ brochures = [], logoUrl }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!Array.isArray(brochures) || brochures.length === 0) {
        return null;
    }

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleSelectBrochure = (index) => {
        setCurrentIndex(index);
    };

    const handleDownload = () => {
        window.open(currentBrochure.pdfUrl, "_blank"); // ✅ Solución más estable (abre en nueva pestaña)
    };

    const currentBrochure = brochures[currentIndex];

    return (
        <>
            {isOpen ? (
                <div className="fixed bottom-5 right-5 bg-white w-[300px] md:w-[320px] p-4 rounded-lg shadow-xl border border-gray-300 z-50 flex flex-col items-center">

                    {/* Botón de Cerrar */}
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 shadow-md hover:bg-gray-900 transition"
                    >
                        <X size={16} />
                    </button>

                    {/* Logo */}
                    {logoUrl && (
                        <img
                            src={logoUrl}
                            alt="Logo"
                            className="w-32 mb-2"
                        />
                    )}

                    {/* Imagen del Brochure */}
                    <img
                        src={currentBrochure.imageUrl}
                        alt={currentBrochure.title}
                        className="w-full max-h-[350px] object-contain rounded-md"
                    />

                    {/* Indicadores de paginación */}
                    {brochures.length > 1 && (
                        <div className="flex justify-center space-x-2 mt-3">
                            {brochures.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelectBrochure(index)}
                                    className={`w-3 h-3 rounded-full transition ${index === currentIndex
                                        ? "bg-gray-800 scale-110"
                                        : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Iconos de Interacción */}
                    <div className="flex justify-end w-full mt-3 space-x-4 pr-2">
                        {/* Ver PDF (OJO 👁️ - Abre el PDF en una nueva pestaña) */}
                        <a
                            href={currentBrochure.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-800 hover:text-gray-600 transition"
                        >
                            <Eye size={22} />
                        </a>

                        {/* Descargar PDF (Abre en nueva pestaña para que el usuario descargue) */}
                        <button
                            onClick={handleDownload}
                            className="flex items-center text-gray-800 hover:text-gray-600 transition"
                        >
                            <Download size={22} />
                        </button>
                    </div>

                    {/* Texto del Brochure */}
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
                // Botón flotante para volver a abrir
                <button
                    onClick={handleOpen}
                    className="fixed bottom-5 right-5 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-900 transition z-30"
                >
                    📖 Ver Brochure
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
    logoUrl: PropTypes.string, // ✅ Ahora es opcional
};

NotificationPopup.defaultProps = {
    logoUrl: "", // ✅ Evita warnings en consola
};

export default NotificationPopup;
