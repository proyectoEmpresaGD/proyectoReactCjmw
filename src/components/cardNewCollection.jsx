import { useState } from 'react';

const NewCollection = () => {
    const [hoveredItem, setHoveredItem] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredItem(index);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <header className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">New Collection</h2>
                    <p className="mx-auto mt-4 max-w-md text-gray-500">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque praesentium cumque iure
                        dicta incidunt est ipsam, officia dolor fugit natus?
                    </p>
                </header>

                <ul className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <li
                        onMouseEnter={() => handleMouseEnter(0)}
                        onMouseLeave={handleMouseLeave}
                        className={`group relative ${hoveredItem === 0 ? 'opacity-90' : 'opacity-100'
                            } transition duration-500`}
                    >
                        <a href="#" className="block">
                            <img
                                src="https://images.unsplash.com/photo-1618898909019-010e4e234c55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                                alt=""
                                className={`aspect-square w-full object-cover transform ${hoveredItem === 0 ? 'scale-105' : 'scale-100'
                                    } transition duration-500`}
                            />

                            <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                                <h3 className="text-xl font-medium text-white">Casual Trainers</h3>
                                <span className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
                                    Shop Now
                                </span>
                            </div>
                        </a>
                    </li>

                    <li
                        onMouseEnter={() => handleMouseEnter(1)}
                        onMouseLeave={handleMouseLeave}
                        className={`group relative ${hoveredItem === 1 ? 'opacity-90' : 'opacity-100'
                            } transition duration-500`}
                    >
                        <a href="#" className="block">
                            <img
                                src="https://images.unsplash.com/photo-1624623278313-a930126a11c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                                alt=""
                                className={`aspect-square w-full object-cover transform ${hoveredItem === 1 ? 'scale-105' : 'scale-100'
                                    } transition duration-500`}
                            />

                            <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                                <h3 className="text-xl font-medium text-white">Winter Jumpers</h3>
                                <span className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
                                    Shop Now
                                </span>
                            </div>
                        </a>
                    </li>

                    <li
                        onMouseEnter={() => handleMouseEnter(2)}
                        onMouseLeave={handleMouseLeave}
                        className={`group relative lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 ${hoveredItem === 2 ? 'opacity-90' : 'opacity-100'
                            } transition duration-500`}
                    >
                        <a href="#" className="block">
                            <img
                                src="https://images.unsplash.com/photo-1593795899768-947c4929449d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80"
                                alt=""
                                className={`aspect-square w-full object-cover transform ${hoveredItem === 2 ? 'scale-105' : 'scale-100'
                                    } transition duration-500`}
                            />

                            <div className="absolute inset-0 flex flex-col items-start justify-end p-6">
                                <h3 className="text-xl font-medium text-white">Skinny Jeans Blue</h3>
                                <span className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white">
                                    Shop Now
                                </span>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default NewCollection;
