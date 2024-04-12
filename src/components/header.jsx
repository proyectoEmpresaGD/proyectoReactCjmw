import { useState } from "react";
import { RiMenu3Fill, RiSearchLine, RiShoppingCartFill, RiUserFill } from "react-icons/ri";

export const Header = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-transparent z-50">
            <div className="container mx-auto flex items-center justify-between py-4 px-6 lg:px-8 relative">
                <div className="flex items-center">
                    {showUserMenu && (
                        <div className="absolute top-16 right-4 w-40 bg-white rounded-md shadow-lg z-50">
                            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => setShowUserMenu(false)}>Sign In</button>
                            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => setShowUserMenu(false)}>Sign Out</button>
                        </div>
                    )}
                    <button className="text-gray-800 focus:outline-none" onClick={toggleMenu}>
                        <RiMenu3Fill size={24} />
                    </button>
                </div>

                <div className="flex justify-center">
                    <img className="h-8 lg:h-10" src="public\CJM new transparente.png" alt="Logo" />
                </div>

                <div className="flex items-center space-x-4 relative">
                    <button className="text-gray-800 focus:outline-none" onClick={toggleSearch}>
                        <RiSearchLine size={24} />
                    </button>
                    <div className={`absolute top-12 right-0 transition-all duration-500 ease-in-out w-64 ${showSearch ? '' : 'hidden'}`}>
                        <input
                            type="text"
                            className="px-4 py-2 focus:outline-none border border-gray-300 rounded-md"
                            placeholder="Search..."
                        />
                    </div>
                    <button className="text-gray-800 focus:outline-none" onClick={() => { }}>
                        <RiShoppingCartFill size={24} />
                    </button>
                    <button className="text-gray-800 focus:outline-none" onClick={toggleUserMenu}>
                        <RiUserFill size={24} />
                    </button>
                </div>
            </div>

            <div className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-200 to-white rounded-r-lg shadow-lg z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${showMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="py-6 px-4">
                    <div className="flex justify-center items-center mb-6">
                        <img className="h-8 lg:h-10" src="public\CJM new transparente.png" alt="Logo" />
                    </div>
                    <a href="#" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg" onClick={toggleMenu}>Home</a>
                    <a href="#" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg" onClick={toggleMenu}>About Us</a>
                    <a href="#" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg" onClick={toggleMenu}>Services</a>
                    <a href="#" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg" onClick={toggleMenu}>Products</a>
                </div>
                <button className="absolute top-4 right-4 text-gray-800 focus:outline-none" onClick={toggleMenu}>
                    <RiMenu3Fill size={24} />
                </button>
            </div>
        </header>
    );
};  
