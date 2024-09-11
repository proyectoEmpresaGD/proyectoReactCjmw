import { RiInstagramLine, RiFacebookLine, RiTwitterXFill } from "react-icons/ri";
import { Link } from "react-router-dom";

const FooterHome = () => {
    return (
        <footer className="bg-gray-200 text-gray-900 p-6 xl:p-12 min-h-screen flex flex-col justify-between">
            {/* Contenedor principal centrado */}
            <div className="container mx-auto flex-grow flex flex-col lg:flex-row items-center justify-evenly gap-12 pb-12">
                {/* Logo y redes sociales */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    <a href="#" className="flex items-center justify-center">
                        <img
                            src="https://cjmw.eu/ImagenesTelasCjmw/Iconos/Logo.png"
                            alt="Logo"
                            className="w-16 h-16 object-contain"
                        />
                    </a>
                    <p className="font-semibold mt-4">Síguenos en</p>
                    <div className="flex space-x-4 mt-4 text-2xl">
                        <a href="#" className="hover:text-primary hover:scale-110 transition-all">
                            <RiInstagramLine />
                        </a>
                        <a href="#" className="hover:text-primary hover:scale-110 transition-all">
                            <RiFacebookLine />
                        </a>
                        <a href="#" className="hover:text-primary hover:scale-110 transition-all">
                            <RiTwitterXFill />
                        </a>
                    </div>
                </div>

                {/* Descarga nuestra app */}
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-bold mb-4">Descubre Nuestra Web</h3>
                    <img
                        src="/public/frame.png"
                        alt="Código QR para descargar la app"
                        className="w-32 h-32 object-contain"
                    />

                </div>

                {/* Enlaces útiles */}
                <div className="flex flex-col items-center lg:items-end">
                    <h3 className="text-lg font-bold mb-4">Enlaces útiles</h3>
                    <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4 text-center lg:text-right">
                        <Link
                            to="/about"
                            className="text-black hover:text-primary hover:underline transition-all"
                        >
                            Sobre Nosotros
                        </Link>
                        <a
                            href="#"
                            className="text-black hover:text-primary hover:underline transition-all"
                        >
                            Prensa
                        </a>
                        <a
                            href="#"
                            className="text-black hover:text-primary hover:underline transition-all"
                        >
                            Inversores
                        </a>
                        <Link
                            to="/contact"
                            className="text-black hover:text-primary hover:underline transition-all"
                        >
                            Eventos
                        </Link>
                        <a
                            href="public/pdfs/LSSI TÉRMINOS Y CONDICIONES DE COMPRA, CJM WORLDWIDE S.L..pdf"
                            className="text-black hover:text-primary hover:underline transition-all"
                            target="_blank"
                            rel="noopener noreferrer"
                            download="LSSI_TÉRMINOS_Y_CONDICIONES_DE_COMPRA_CJM_WORLDWIDE_S.L..pdf"
                        >
                            Términos de Compra
                        </a>
                        <a
                            href="public/pdfs/LSSI POLITICA DE COOKIES, CJM WORLDWIDE S.L..pdf"
                            className="text-black hover:text-primary hover:underline transition-all"
                            target="_blank"
                            rel="noopener noreferrer"
                            download="LSSI_POLITICA_DE_COOKIES_CJM_WORLDWIDE_S.L..pdf"
                        >
                            Política de Cookies
                        </a>
                        <a
                            href="public/pdfs/LSSI POLITICA DE PRIVACIDAD, CJM WORLDWIDE S.L..pdf"
                            className="text-black hover:text-primary hover:underline transition-all"
                            target="_blank"
                            rel="noopener noreferrer"
                            download="LSSI_POLITICA_DE_PRIVACIDAD_CJM_WORLDWIDE_S.L..pdf"
                        >
                            Política de Privacidad
                        </a>
                    </nav>
                </div>
            </div>

            {/* Parte inferior con botón de contacto y derechos reservados */}
            <div className="container mx-auto mt-8 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between">
                <Link
                    to="/contact"
                    className="font-semibold rounded-full px-6 py-2 transition-all hover:bg-blue-600 hover:text-white transform hover:scale-105 inline-block text-lg"
                    style={{ backgroundColor: "#3182CE" }}
                >
                    Contáctanos
                </Link>

                <p className="text-gray-600 mt-4 lg:mt-0 lg:text-right">
                    © CJM WORLDWIDE S.L. 2023 - Todos los Derechos Reservados
                </p>
            </div>
        </footer>
    );
};

export default FooterHome;
