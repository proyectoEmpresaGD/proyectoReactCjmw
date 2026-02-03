import { Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { socialIcons, qrCodeSrc, empresaLinks, politicasLinks, LOGO_URL, contactText, copyrightText } from "../../Constants/constants";

const FooterHome = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isEmpresaOpen, setIsEmpresaOpen] = useState(false);
    const [isPoliticasOpen, setIsPoliticasOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleEmpresa = () => {
        setIsEmpresaOpen(!isEmpresaOpen);
    };

    const togglePoliticas = () => {
        setIsPoliticasOpen(!isPoliticasOpen);
    };

    return (
        <footer className="bg-gray-200 text-gray-900 p-6 xl:p-12 min-h-screen flex flex-col justify-between">
            <div className="container mx-auto flex-grow flex flex-col lg:flex-row items-center justify-evenly gap-1 pb-12 pt-10">
                {/* Logo y redes sociales */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    <a href="#" className="flex items-center justify-center">
                        <img src={LOGO_URL} alt="Logo" className="w-16 h-16 object-contain" />
                    </a>
                    <p className="font-semibold mt-2">Síguenos en</p>
                    <div className="flex space-x-4 mt-4 text-3xl">
                        <a href={socialIcons[0].href} className="hover:text-primary hover:scale-110 transition-all">
                            <Instagram />
                        </a>
                        <a href={socialIcons[1].href} className="hover:text-primary hover:scale-110 transition-all">
                            <Facebook />
                        </a>
                        <a href={socialIcons[2].href} className="hover:text-primary hover:scale-110 transition-all">
                            <Twitter />
                        </a>
                    </div>
                </div>

                {/* Descarga nuestra app */}
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-bold mb-2">Descubre Nuestra Web</h3>
                    <img src={qrCodeSrc} alt="Código QR para descargar la app" className="w-32 h-32 object-contain" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 items-center lg:items-center text-center">
                    <div>
                        <h3 className="text-lg font-bold mb-4 cursor-pointer" onClick={toggleEmpresa}>
                            Empresa
                        </h3>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out`}
                            style={{
                                maxHeight: isEmpresaOpen || !isMobile ? '500px' : '0',
                            }}
                        >
                            <nav className="grid grid-cols-1 gap-2 text-center lg:text-center">
                                {empresaLinks.map((link, index) => (
                                    <Link key={index} to={link.to} className="text-black hover:text-primary hover:underline transition-all">
                                        {link.text}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4 cursor-pointer" onClick={togglePoliticas}>
                            Políticas
                        </h3>
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out`}
                            style={{
                                maxHeight: isPoliticasOpen || !isMobile ? '500px' : '0',
                            }}
                        >
                            <nav className="grid grid-cols-1 gap-2 text-center lg:text-center">
                                {politicasLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className="text-black hover:text-primary hover:underline transition-all"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download={link.downloadName}
                                    >
                                        {link.text}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto mt-2 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between">
                <Link
                    to="/contact"
                    className="font-semibold rounded-md px-6 py-2 transition-colors text-white hover:bg-white bg-black hover:text-black transform hover:scale-105 inline-block"
                >
                    {contactText}
                </Link>

                <p className="text-gray-600 mt-4 lg:mt-0 lg:text-right">{copyrightText}</p>
            </div>
        </footer>
    );
};

export default FooterHome;
