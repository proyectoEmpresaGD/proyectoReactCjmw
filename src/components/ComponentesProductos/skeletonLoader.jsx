

const SkeletonLoader = ({ repeticiones }) => {
    const skeletons = [];

    for (let i = 0; i < repeticiones; i++) {
        skeletons.push(
            <div key={i} className="bg-white rounded-lg shadow-lg p-8 animate-pulse transition duration-300 ease-in-out transform hover:scale-105 max-h-[20%] xl:max-w-[20%] min-h-[70%] max-w-[80%] sm:max-w-[40%] md:max-h-[30%] xl:min-h-[20%] xl:min-w-[20%] mx-2 mb-7">
                <div className="relative overflow-hidden">
                    <div className="bg-gray-300 h-full w-full rounded"></div>
                    <div className="absolute inset-0 bg-black opacity-40"></div>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                    <div className="h-6 w-6 rounded-full bg-gray-400"></div>
                    <div className="h-6 w-6 rounded-full bg-gray-400"></div>
                    <div className="h-6 w-6 rounded-full bg-gray-400"></div>
                </div>
                <div className="h-6 bg-gray-300 w-3/4 rounded mt-4"></div>
                <div className="flex items-center justify-between mt-4">
                    <div className="h-4 bg-gray-300 w-1/4 rounded"></div>
                    <div className="h-8 bg-gray-300 w-1/5 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap justify-center items-center animate-pulse">
            {skeletons}
        </div>
    );
};

export default SkeletonLoader;