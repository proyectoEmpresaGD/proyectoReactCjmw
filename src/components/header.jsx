import { useState } from "react";
import { Link } from "react-router-dom";
import { RiMenu3Fill, RiSearchLine, RiShoppingCartFill, RiUserFill, RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

export const Header = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const toggleBrandsDropdown = () => {
        setShowBrandsDropdown(!showBrandsDropdown);
        // Cerrar el menú de usuario si está abierto
        if (showUserDropdown) {
            setShowUserDropdown(false);
        }
        // Cerrar el cuadro de búsqueda si está abierto
        if (showSearchBar) {
            setShowSearchBar(false);
        }
    };

    const toggleUserDropdown = () => {
        setShowUserDropdown(!showUserDropdown);
        // Cerrar el menú desplegable de marcas si está abierto
        if (showBrandsDropdown) {
            setShowBrandsDropdown(false);
        }
        // Cerrar el cuadro de búsqueda si está abierto
        if (showSearchBar) {
            setShowSearchBar(false);
        }
    };

    const toggleSearchBar = () => {
        setShowSearchBar(!showSearchBar);
        // Cerrar el menú desplegable de marcas si está abierto
        if (showBrandsDropdown) {
            setShowBrandsDropdown(false);
        }
        // Cerrar el menú de usuario si está abierto
        if (showUserDropdown) {
            setShowUserDropdown(false);
        }
    };

    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Búsqueda realizada:", searchQuery);
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white z-50">
            <div className="container mx-auto flex items-center justify-between py-4 px-6 lg:px-8">
                <div className="flex items-center">
                    <button className="text-gray-800 lg:hidden focus:outline-none" onClick={toggleMenu}>
                        {showMenu ? (
                            <RiArrowDropUpLine size={24} />
                        ) : (
                            <RiMenu3Fill size={24} />
                        )}
                    </button>
                    <Link to="/" className="flex items-center space-x-2 text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">
                        <img className="h-8 lg:h-10" src="public\logoCJM.png" alt="Logo" />
                        <span className="hidden lg:block">Home</span>
                    </Link>
                </div>

                <div className="hidden lg:flex flex-grow justify-center">
                    <div className="flex items-center space-x-4">
                        <Link to="/about" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">About Us</Link>
                        <Link to="/services" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Services</Link>
                        <Link to="/products" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Products</Link>
                        <div className="relative">
                            <button className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg focus:outline-none" onClick={toggleBrandsDropdown}>
                                Brands {showBrandsDropdown ? <RiArrowDropUpLine size={16} /> : <RiArrowDropDownLine size={16} />}
                            </button>
                            <div className={`bg-slate-100 absolute top-full left-0 mt-1 bg-ivory shadow-lg rounded-md py-2 w-40 ${showBrandsDropdown ? '' : 'hidden'}`}>
                                <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Brand 1</Link>
                                <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Brand 2</Link>
                                <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Brand 3</Link>
                                <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Brand 4</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button className="text-gray-800 focus:outline-none" onClick={toggleUserDropdown}>
                            <RiUserFill size={24} />
                        </button>
                        {showUserDropdown && (
                            <div className="bg-slate-100 absolute top-full right-0 bg-ivory shadow-lg rounded-md py-2 w-40">
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => setShowUserDropdown(false)}>Sign In</button>
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => setShowUserDropdown(false)}>Sign Out</button>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <button className="text-gray-800 focus:outline-none" onClick={toggleSearchBar}>
                            <RiSearchLine size={24} />
                        </button>
                        {showSearchBar && (
                            <div className="absolute top-16 right-0 transition-all duration-500 ease-in-out">
                                <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md shadow-md flex items-center">
                                    <input
                                        type="text"
                                        className="px-4 py-2 focus:outline-none flex-1"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={handleChange}
                                    />
                                    <button type="submit" className="text-gray-600 focus:outline-none">
                                        <RiSearchLine size={24} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                    <button className="text-gray-800 focus:outline-none" onClick={() => { }}>
                        <RiShoppingCartFill size={24} />
                    </button>
                </div>
            </div>
            <div className={`bg-white lg:hidden ${showMenu ? '' : 'hidden'}`}>
                <div className="bg-ivory py-2 px-4">
                    <Link to="/about" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg">About Us</Link>
                    <Link to="/services" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg">Services</Link>
                    <Link to="/products" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg">Products</Link>
                    <div className="relative">
                        <button className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg focus:outline-none" onClick={toggleBrandsDropdown}>
                            Brands {showBrandsDropdown ? <RiArrowDropUpLine size={16} /> : <RiArrowDropDownLine size={16} />}
                        </button>
                        <div className={`bg-slate-100 absolute top-full left-0 mt-1 bg-ivory shadow-lg rounded-md py-2 w-40 ${showBrandsDropdown ? '' : 'hidden'}`}>
                            <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Brand 1</Link>
                            <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Brand 2</Link>
                            <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Brand 3</Link>
                            <Link to="/" className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">Brand 4</Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
