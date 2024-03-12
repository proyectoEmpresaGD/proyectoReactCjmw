import { Link } from "react-router-dom";
import React, { useState } from 'react';


export function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };
    return (
        <>
            <header className=''>
                <div className="bg-gray-100 border-b border-gray-200">
                    <div className="px-4 mx-auto sm:px-6 lg:px-8">
                        <nav className="relative flex items-center justify-between h-16 lg:h-20">
                            <div className="hidden lg:flex lg:items-center lg:space-x-10">
                                <Link to={"/interiores"} title="" className="text-base font-medium text-black"> Interiores </Link>

                                <Link to={"/contacto"} title="" className="text-base font-medium text-black"> Contacto </Link>

                                <Link to={"/about"} title="" className="text-base font-medium text-black"> Sobre nosotros </Link>
                            </div>

                            <div className="lg:absolute lg:-translate-x-1/2 lg:inset-y-0 lg:left-1/2">
                                <div className="flex-shrink-0 ">
                                    <Link to={"/"} title="" className="flex">
                                        <img className="w-auto h-14 lg:h-24 lg:w-24" src="1.png" alt="" />
                                    </Link>
                                </div>
                            </div>


                            <Link to={"/tienda"} className="flex items-center justify-center ml-auto text-white bg-black rounded-full w-9 h-9 lg:hidden">
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </Link>


                            <div className="hidden lg:flex lg:items-center lg:space-x-10">


                                <Link to={"/tienda"} title="" className="flex items-center justify-center w-10 h-10 text-white bg-black rounded-full">
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>


                <section className="MOBILE-MENU flex lg:hidden">
                    <div
                        className="HAMBURGER-ICON space-y-2"
                        onClick={() => setIsNavOpen((prev) => !prev)}
                    >
                        <button type="button" className="inline-flex p-2 ml-5 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>


                    <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
                        <div
                            className="CROSS-ICON absolute top-0 right-0 px-8 py-8"
                            onClick={() => setIsNavOpen(false)}
                        >
                            <svg
                                className="h-8 w-8 text-gray-600"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>

                        <div className="mt-6">
                            <div className="MENU-LINK-MOBILE-OPEN flex flex-col items-center justify-between min-h-[250px]">
                                <Link to={"/interiores"} title="" className="text-base font-medium text-black"> Interiores </Link>

                                <Link to={"/contacto"} title="" className="text-base font-medium text-black"> Contacto </Link>

                                <Link to={"/about"} title="" className="text-base font-medium text-black"> Sobre nosotros </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </header>

        </>
    )
}
