

const Works = () => {
    return (
        <div id="aboutUs" className="p-8 xl:p-20">
            <div className="mb-8">
                <h1 className="text-[40px] font-black text-center">
                    We create world-class digital products
                </h1>
                <p className="text-xl text-gray-500 text-center">
                    By providing information about design to the world's best instructors, we help others to create amazing products.
                </p>
            </div>
            {/* Works */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                {/* Work 1 */}
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <img
                            src="showroom1.jpg"
                            alt="Work 1"
                            className="w-full h-[400px] object-cover rounded-3xl transition-transform transform hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100">
                            <button className="bg-primary text-white py-2 px-6 rounded-xl font-semibold transition-transform transform hover:scale-110">View Details</button>
                        </div>
                    </div>
                    <p className="text-gray-500 text-center">Room Design - January 20, 2022</p>
                    <h3 className="text-2xl font-bold text-center">App Redesign</h3>
                    <p className="text-gray-500 text-center">
                        By providing information about design to the world's best instructors, we help others to create amazing products.
                    </p>
                </div>
                {/* Work 2 */}
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <img
                            src="showroom2.jpg"
                            alt="Work 2"
                            className="w-full h-[400px] object-cover rounded-3xl transition-transform transform hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100">
                            <button className="bg-primary text-white py-2 px-6 rounded-xl font-semibold transition-transform transform hover:scale-110">View Details</button>
                        </div>
                    </div>
                    <p className="text-gray-500 text-center">Room Design - March 20, 2022</p>
                    <h3 className="text-2xl font-bold text-center">Redesign Channel Website Landing Page</h3>
                    <p className="text-gray-500 text-center">
                        By providing information about design to the world's best instructors, we help others to create amazing products.
                    </p>
                </div>
                {/* Work 3 */}
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <img
                            src="showroom1.jpg"
                            alt="Work 3"
                            className="w-full h-[400px] object-cover rounded-3xl transition-transform transform hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100">
                            <button className="bg-primary text-white py-2 px-6 rounded-xl font-semibold transition-transform transform hover:scale-110">View Details</button>
                        </div>
                    </div>
                    <p className="text-gray-500 text-center">Room Design - June 20, 2022</p>
                    <h3 className="text-2xl font-bold text-center">New Locator App For a New Company</h3>
                    <p className="text-gray-500 text-center">
                        By providing information about design to the world's best instructors, we help others to create amazing products.
                    </p>
                </div>
                {/* Work 4 */}
                <div className="flex flex-col gap-4">
                    <div className="relative">
                        <img
                            src="showroom2.jpg"
                            alt="Work 4"
                            className="w-full h-[400px] object-cover rounded-3xl transition-transform transform hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100">
                            <button className="bg-primary text-white py-2 px-6 rounded-xl font-semibold transition-transform transform hover:scale-110">View Details</button>
                        </div>
                    </div>
                    <p className="text-gray-500 text-center">Room Design - May 20, 2022</p>
                    <h3 className="text-2xl font-bold text-center">Rental Rooms Web App Platform</h3>
                    <p className="text-gray-500 text-center">
                        By providing information about design to the world's best instructors, we help others to create amazing products.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Works;