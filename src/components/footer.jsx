import { RiInstagramLine, RiFacebookLine, RiTwitterLine, RiGithubLine } from "react-icons/ri";

const Footer = () => {
    return (
        <footer className="bg-gray-300 text-gray-900 p-6 xl:p-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-b border-gray-500 pb-6">
                {/* Logo */}
                <div className="w-full lg:w-1/6 flex justify-center lg:justify-start">
                    <a href="#" className="flex items-center">
                        <div className="bg-white rounded-full p-2">
                            <img src="/Logo.png" alt="Logo" className="w-12 h-12" />
                        </div>
                    </a>
                </div>
                {/* Social media */}
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
                            <RiTwitterLine size={20} />
                        </a>
                    </div>
                    <div className="bg-gray-700 rounded-full p-2 transition-colors hover:bg-gray-600">
                        <a href="#" className="block text-white">
                            <RiGithubLine size={20} />
                        </a>
                    </div>
                </nav>
            </div>
            <div className="mt-6 w-full lg:w-3/4">
                <h3 className="text-lg font-bold text-center lg:text-left">
                    CJM WORLDWIDE
                </h3>
                <nav className="mt-4 flex flex-col lg:flex-row items-center justify-between gap-4">
                    <a
                        href="#"
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                    >
                        About Us
                    </a>
                    <a
                        href="#"
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                    >
                        Press
                    </a>
                    <a
                        href="#"
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                    >
                        Investors
                    </a>
                    <a
                        href="#"
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                    >
                        Events
                    </a>
                    <a
                        href="#"
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                    >
                        Terms of use
                    </a>
                    <a
                        href="#"
                        className="text-black mt-2 lg:mt-0 hover:text-primary hover:underline transition-colors duration-300"
                    >
                        Privacy policy
                    </a>
                    <a
                        href="/contact"
                        className="font-semibold rounded-full px-6 py-2 transition-colors hover:bg-gray-700 hover:text-white transform hover:scale-105 inline-block"
                        style={{ backgroundColor: "#3182CE" }} // Color de fondo del botón
                    >
                        Contact Us
                    </a>
                </nav>
            </div>
            <div className="mt-8">
                <p className="text-gray-600 text-center">
                    © CJM WORLDWIDE S.L. 2023 - All Rights Reserved
                </p>
            </div>
        </footer>
    );
};

export default Footer;