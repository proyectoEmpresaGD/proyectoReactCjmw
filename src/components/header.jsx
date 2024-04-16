import { useState, useRef, useEffect } from "react";
import { RiMenu3Fill, RiSearchLine, RiShoppingCartFill, RiUserFill } from "react-icons/ri";

export const Header = () => {
    // Estado para controlar la visibilidad del menú, menú de usuario, búsqueda y el valor de búsqueda
    const [showMenu, setShowMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showBrandsDropdown, setShowBrandsDropdown] = useState(false); // Nuevo estado para controlar la visibilidad del dropdown de marcas
    const ref = useRef();

    // Datos de las marcas
    const brands = ["Brand 1", "Brand 2", "Brand 3", "Brand 4"];

    // Función para alternar la visibilidad del menú
    const toggleMenu = () => {
        setShowMenu(!showMenu);
        setShowUserMenu(false);
        setShowSearch(false);
        setShowBrandsDropdown(false); // Cerrar el dropdown de marcas cuando se abre el menú
    };

    // Función para alternar la visibilidad del menú de usuario
    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
        setShowMenu(false);
        setShowSearch(false);
        setShowBrandsDropdown(false); // Cerrar el dropdown de marcas cuando se abre el menú de usuario
    };

    // Función para alternar la visibilidad de la búsqueda
    const toggleSearch = () => {
        setShowSearch(!showSearch);
        setShowMenu(false);
        setShowUserMenu(false);
        setShowBrandsDropdown(false); // Cerrar el dropdown de marcas cuando se abre la búsqueda
    };

    // Función para manejar cambios en el valor de búsqueda
    const handleChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Función para manejar el envío del formulario de búsqueda
    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes agregar la lógica para manejar la búsqueda, por ejemplo, redireccionar a la página de resultados.
        console.log("Búsqueda realizada:", searchQuery);
    };

    // Función para cerrar todos los menús
    const closeMenus = () => {
        setShowMenu(false);
        setShowUserMenu(false);
        setShowSearch(false);
        setShowBrandsDropdown(false); // Cerrar el dropdown de marcas cuando se hace clic fuera de él
    };

    // Efecto para cerrar los menús al hacer clic fuera de ellos
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                closeMenus();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

    return (
        <header className="fixed top-0 left-0 w-full bg-transparent z-50">
            {/* Navbar para pantallas pequeñas */}
            <div className="lg:hidden">
                <div className="container mx-auto flex items-center justify-between py-4 px-6 lg:px-8 relative">
                    <div className="flex items-center">
                        <button className="text-gray-800 focus:outline-none" onClick={toggleMenu}>
                            {showMenu ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <RiMenu3Fill size={24} />
                            )}
                        </button>
                    </div>

                    <div className="flex justify-center">
                        <img className="h-8 lg:h-10" src="public\logoCJM.png" alt="Logo" />
                    </div>

                    <div className="flex items-center space-x-4 relative" ref={ref}>
                        <button className="text-gray-800 focus:outline-none" onClick={toggleSearch}>
                            <RiSearchLine size={24} />
                        </button>
                        <div className={`absolute top-16 right-0 transition-all duration-500 ease-in-out ${showSearch ? '' : 'hidden'}`}>
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
                        <button className="text-gray-800 focus:outline-none" onClick={() => { }}>
                            <RiShoppingCartFill size={24} />
                        </button>
                        <button className="text-gray-800 focus:outline-none" onClick={toggleUserMenu}>
                            <RiUserFill size={24} />
                        </button>
                        {showUserMenu && (
                            <div className="absolute top-16 right-0 w-40 bg-white rounded-md shadow-lg z-50">
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => setShowUserMenu(false)}>Sign In</button>
                                <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => setShowUserMenu(false)}>Sign Out</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-200 to-white rounded-r-lg shadow-lg z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${showMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="py-6 px-4">
                        <div className="flex justify-center items-center mb-6">
                            <img className="h-6 lg:h-8" src="public\logoCJM.png" alt="Logo" />
                        </div>
                        <a href="/" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg" onClick={toggleMenu}>Home</a>
                        <a href="/about" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg" onClick={toggleMenu}>About Us</a>
                        <a href="#" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg" onClick={toggleMenu}>Services</a>
                        <a href="#" className="block text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg" onClick={toggleMenu}>Products</a>
                        {/* Enlace a las marcas con dropdown */}
                        <div className="relative mt-4">
                            <button className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 text-center rounded-lg focus:outline-none" onClick={() => setShowBrandsDropdown(!showBrandsDropdown)}>Brands</button>
                            <div className={`absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md py-2 w-40 ${showBrandsDropdown ? '' : 'hidden'}`}>
                                {brands.map((brand, index) => (
                                    <a href="/" key={index} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">{brand}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className="absolute top-4 right-4 text-gray-800 focus:outline-none" onClick={toggleMenu}>
                        {showMenu ? (
                            <RiMenu3Fill size={24} />
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Navbar para pantallas grandes */}
            <div className="hidden lg:flex items-center justify-between container mx-auto py-4 px-6 lg:px-8">
                <div className="flex items-center space-x-4">
                    <img className="h-8 lg:h-10" src="public\logoCJM.png" alt="Logo" />
                </div>

                <div className="flex-grow flex justify-center">
                    <div className="flex items-center space-x-4">
                        <a href="/" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Home</a>
                        <a href="/about" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">About Us</a>
                        <a href="#" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Services</a>
                        <a href="#" className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg">Products</a>
                        {/* Enlace a las marcas con dropdown */}
                        <div className="relative">
                            <button className="text-gray-800 font-semibold hover:bg-gray-300 hover:text-gray-900 py-2 px-4 rounded-lg focus:outline-none" onClick={() => setShowBrandsDropdown(!showBrandsDropdown)}>Brands</button>
                            <div className={`absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md py-2 w-40 ${showBrandsDropdown ? '' : 'hidden'}`}>
                                {brands.map((brand, index) => (
                                    <a href="/" key={index} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-md">{brand}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button className="text-gray-800 focus:outline-none" onClick={toggleSearch}>
                            <RiSearchLine size={24} />
                        </button>
                        <div className={`absolute top-16 right-0 transition-all duration-500 ease-in-out ${showSearch ? '' : 'hidden'}`}>
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
                    </div>
                    <button className="text-gray-800 focus:outline-none" onClick={() => { }}>
                        <RiShoppingCartFill size={24} />
                    </button>
                    <button className="text-gray-800 focus:outline-none" onClick={toggleUserMenu}>
                        <RiUserFill size={24} />
                    </button>
                    {showUserMenu && (
                        <div className="absolute top-16 right-0 w-40 bg-white rounded-md shadow-lg z-50">
                            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => setShowUserMenu(false)}>Sign In</button>
                            <button className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left" onClick={() => setShowUserMenu(false)}>Sign Out</button>
                        </div>
                    )}
                </div>
            </div>


        </header>
    );
};
