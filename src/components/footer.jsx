import { RiInstagramLine, RiFacebookLine, RiTwitterXFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { LOGO_URL, SOCIAL_MEDIA_LINKS, PDF_LINKS, COPYRIGHT_TEXT, NAVIGATION_LINKS } from "../Constants/constants";

const Footer = () => {
    return (
        <footer className="bg-gray-300 text-gray-900 p-6 xl:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-gray-500 pb-6">
                {/* Logo */}
                <div className="w-full lg:w-1/6 flex justify-center lg:justify-start">
                    <a href="#" className="flex items-center">
                        <div className="bg-white rounded-full p-2">
                            <img src={LOGO_URL} alt="Logo" className="w-16 h-16 object-contain" />
                        </div>
                    </a>
                </div>
                {/* Redes sociales */}
                <nav className="flex items-center gap-4">
                    <div className="bg-gray-700 rounded-full p-2 transition-colors hover:bg-gray-600">
                        <a href={SOCIAL_MEDIA_LINKS.instagram} className="block text-white">
                            <RiInstagramLine size={20} />
                        </a>
                    </div>
                    <div className="bg-gray-700 rounded-full p-2 transition-colors hover:bg-gray-600">
                        <a href={SOCIAL_MEDIA_LINKS.facebook} className="block text-white">
                            <RiFacebookLine size={20} />
                        </a>
                    </div>
                    <div className="bg-gray-700 rounded-full p-2 transition-colors hover:bg-gray-600">
                        <a href={SOCIAL_MEDIA_LINKS.twitter} className="block text-white">
                            <RiTwitterXFill size={20} />
                        </a>
                    </div>
                </nav>
            </div>
            <div className="mt-3 w-full lg:w-full">

                <nav className="mt-4 flex flex-col lg:flex-row items-center justify-between gap-4">
                    <Link
                        to={NAVIGATION_LINKS.about}
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                    >
                        Sobre Nosotros
                    </Link>
                    <a
                        href={PDF_LINKS.terminosCompra}
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                        download="LSSI_TÉRMINOS_Y_CONDICIONES_DE_COMPRA_CJM_WORLDWIDE_S.L..pdf"
                    >
                        Términos de Compra
                    </a>
                    <a
                        href={PDF_LINKS.politicaCookies}
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                        download="LSSI_POLITICA_DE_COOKIES_CJM_WORLDWIDE_S.L..pdf"
                    >
                        Política de Cookies
                    </a>
                    <a
                        href={PDF_LINKS.politicaPrivacidad}
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                        target="_blank"
                        rel="noopener noreferrer"
                        download="LSSI_POLITICA_DE_PRIVACIDAD_CJM_WORLDWIDE_S.L..pdf"
                    >
                        Política de Privacidad
                    </a>
                    <Link
                        to={NAVIGATION_LINKS.contact}
                        className="font-semibold rounded-md px-6 py-2 transition-colors text-white hover:bg-white bg-black hover:text-black transform hover:scale-105 inline-block"
                    >
                        Contáctanos
                    </Link>
                </nav>
            </div>
            <div className="mt-1">
                <p className="text-gray-600 text-center">{COPYRIGHT_TEXT}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6 border-t-[2px] mt-6 pt-6 place-items-center">
                <Link to="/cjmHome" className="transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoCJM-sintexto.png" alt="logo CJM" className="w-auto h-16" />
                </Link>
                <Link to="/arenaHome" className="transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoArena.png" alt="logo ARENA" className="w-auto h-16" />
                </Link>
                <Link to="/flamencoHome" className="transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoFlamenco.png" alt="logo FLAMENCO" className="w-auto h-16" />
                </Link>
                <Link to="/harbourHome" className="transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                    <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoHarbour.png" alt="logo HARBOUR" className="w-auto h-16" />
                </Link>
                <Link to="/bassariHome" className="transform hover:scale-105 transition-transform duration-300 cursor-pointer md:col-span-2 md:justify-self-center lg:col-span-1">
                    <img src="https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png" alt="logo BASSARI" className="w-auto h-16" />
                </Link>
            </div>


        </footer>
    );
};

export default Footer;
