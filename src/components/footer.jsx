import { RiInstagramLine, RiFacebookLine, RiTwitterXFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import {
    LOGO_URL,
    SOCIAL_MEDIA_LINKS,
    PDF_LINKS,
    NAVIGATION_LINKS
} from "../Constants/constants";
import { useMarca } from './MarcaContext';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { setMarcaActiva } = useMarca();
    const { t } = useTranslation('footer');

    const brandLinks = [
        {
            to: "/bassariHome",
            img: "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/LOGO%20BASSARI%20negro.png",
            alt: "Bassari",
        },
        {
            to: "/flamencoHome",
            img: "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoFlamenco.png",
            alt: "Flamenco",
        },
        {
            to: "/harbourHome",
            img: "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoHarbour.png",
            alt: "Harbour",
        },
        {
            to: "/arenaHome",
            img: "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoArena.png",
            alt: "Arena",
        },
        {
            to: "/cjmHome",
            img: "https://bassari.eu/ImagenesTelasCjmw/Iconos/Logos/LOGOS%20MARCAS/logoCJM-sintexto.png",
            alt: "CJM",
        },
    ];

    return (
        <footer className=" bg-white text-gray-900 p-6 xl:p-12">
            <div className="w-full border-b border-gray-500 pb-6">
                <div className="flex flex-col items-center justify-center lg:flex-row lg:items-center lg:justify-between">
                    <div className="hidden lg:block w-[120px]" />
                    <div className="flex justify-center mb-4 lg:mb-0">
                        <Link to="/" onClick={() => setMarcaActiva(null)} className="flex items-center">
                            <img
                                src={LOGO_URL}
                                alt={t('altLogo')}
                                className="w-20 h-20 object-contain rounded-full"
                            />
                        </Link>
                    </div>
                    <nav className="flex items-center justify-center gap-4">
                        <a
                            href={SOCIAL_MEDIA_LINKS.instagram}
                            className="bg-gray-700 rounded-full p-2 hover:bg-gray-600 transition-colors"
                            aria-label="Instagram"
                        >
                            <RiInstagramLine size={18} className="text-white" />
                        </a>
                        <a
                            href={SOCIAL_MEDIA_LINKS.facebook}
                            className="bg-gray-700 rounded-full p-2 hover:bg-gray-600 transition-colors"
                            aria-label="Facebook"
                        >
                            <RiFacebookLine size={18} className="text-white" />
                        </a>
                        <a
                            href={SOCIAL_MEDIA_LINKS.twitter}
                            className="bg-gray-700 rounded-full p-2 hover:bg-gray-600 transition-colors"
                            aria-label="Twitter"
                        >
                            <RiTwitterXFill size={18} className="text-white" />
                        </a>
                    </nav>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6 border-b-[2px] pb-4 mt-6 pt-6 place-items-center">
                {brandLinks.map(({ to, img, alt }, index) => (
                    <Link
                        key={to}
                        to={to}
                        className={`hover:scale-105 transition-transform ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`.trim()}
                        onClick={() => setMarcaActiva(null)}
                    >
                        <img
                            src={img}
                            alt={alt}
                            className={alt === 'CJM' ? 'h-10' : 'h-16'}
                        />
                    </Link>
                ))}
            </div>

            <nav className="mt-4 flex flex-col lg:flex-row items-center justify-between gap-4">
                <Link
                    to={NAVIGATION_LINKS.about}
                    className="text-black hover:text-primary hover:underline"
                >
                    {t('aboutUs')}
                </Link>
                <a
                    href={PDF_LINKS.terminosCompra}
                    className="text-black hover:text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('terms')}
                </a>
                <a
                    href={PDF_LINKS.politicaCookies}
                    className="text-black hover:text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('cookiePolicy')}
                </a>
                <a
                    href={PDF_LINKS.politicaPrivacidad}
                    className="text-black hover:text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('privacyPolicy')}
                </a>
                <Link
                    to={NAVIGATION_LINKS.contact}
                    className="text-black hover:text-primary hover:underline"
                >
                    {t('contactUs')}
                </Link>
            </nav>

            <div className="mt-4">
                <p className="text-gray-600 text-center">{t('copyright')}</p>
            </div>
        </footer>
    );
};

export default Footer;
