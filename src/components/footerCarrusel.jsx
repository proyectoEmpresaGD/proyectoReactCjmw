import { RiInstagramLine, RiFacebookLine, RiTwitterXFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-300 text-gray-900 p-6 xl:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-gray-500 pb-6">
                {/* Logo */}
                <div className="w-full lg:w-1/6 flex justify-center lg:justify-start">
                    <a href="#" className="flex items-center">
                        <div className="bg-white rounded-full p-2">
                            <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                        </div>
                    </a>
                </div>
                {/* Redes sociales */}
                <nav className="flex items-center gap-4">
                    <div className="bg-gray-700 rounded-full p-2 transition-colors hover:bg-gray-600">
                        <a href="#" className="block text-white">
                            <RiInstagramLine size={20} />
                        </a>
                    </div>
                    <div className="bg-gray-700 rounded-full p-2 transition-colors hover:bg-gray-600">
                        <a href="#" className="block text-white">
                            <RiFacebookLine size={20} />
                        </a>
                    </div>
                    <div className="bg-gray-700 rounded-full p-2 transition-colors hover:bg-gray-600">
                        <a href="#" className="block text-white">
                            <RiTwitterXFill size={20} />
                        </a>
                    </div>
                </nav>
            </div>
            <div className="mt-6 w-full lg:w-3/4">
                <h3 className="text-lg font-bold text-center lg:text-left">
                    CJM WORLDWIDE
                </h3>
                <nav className="mt-4 flex flex-col lg:flex-row items-center justify-between gap-4">
                
                    <Link to="/about" className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300">
                        Sobre Nosotros
                    </Link>

                    <a
                        href="#"
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                    >
                        Prensa
                    </a>
                    <a
                        href="#"
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                    >
                        Inversores
                    </a>
                    <Link
                        to="/contact" className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300">
                        Eventos
                    </Link>
                    <a
                        href="public\pdfs\LSSI TÉRMINOS Y CONDICIONES DE COMPRA, CJM WORLDWIDE S.L..pdf"
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                        download="LSSI_TÉRMINOS_Y_CONDICIONES_DE_COMPRA_CJM_WORLDWIDE_S.L..pdf"
                    >
                        Términos de Compra
                    </a>
                    <a
                        href="public\pdfs\LSSI POLITICA DE COOKIES, CJM WORLDWIDE S.L..pdf"
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                        download="LSSI_POLITICA_DE_COOKIES_CJM_WORLDWIDE_S.L..pdf"
                    >
                        Política de Cookies
                    </a>
                    <a
                        href="public\pdfs\LSSI POLITICA DE PRIVACIDAD, CJM WORLDWIDE S.L..pdf"
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                        download="LSSI_POLITICA_DE_PRIVACIDAD_CJM_WORLDWIDE_S.L..pdf"
                    >
                        Política de Privacidad
                    </a>
                    <Link
                        to="/contact"
                        className="font-semibold rounded-full px-6 py-2 transition-colors hover:bg-gray-700 hover:text-white transform hover:scale-105 inline-block"
                        style={{ backgroundColor: "#3182CE" }} // Color de fondo del botón
                    >
                        Contáctanos
                    </Link>
                </nav>
            </div>
            <div className="mt-8">
                <p className="text-gray-600 text-center">
                    © CJM WORLDWIDE S.L. 2023 - Todos los Derechos Reservados
                </p>
            </div>
        </footer>
    );
};

export default Footer;
