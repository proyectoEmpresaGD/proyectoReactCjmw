const SkeletonLoader = () => {
    return (
        <div className="space-y-2 animate-pulse">
             <div className="h-6 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-2/4"></div>
            <div className="h-10 bg-gray-300 rounded w-full"></div>
        </div>
    );
};

export default SkeletonLoader;