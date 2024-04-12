const Clients = () => {
    return (
        <div className="bg-gradient-to-b from-white  to-gray-300 p-8 flex flex-col items-center justify-center gap-8 mt-20 xl:mt-0">
            <h1 className="text-4xl font-medium text-gray-800 text-center">
                <strong>Estas son nuestras marcas</strong>
            </h1>
            <div className="flex flex-col md:flex-row items-center flex-wrap gap-20">
                <img
                    src="logoCJM.png"
                    className="w-20 transition-transform transform hover:scale-105"
                    alt="Client Logo 1"
                />
                <img
                    src="logoFlamenco.png"
                    className="w-40 transition-transform transform hover:scale-105"
                    alt="Client Logo 2"
                />
                <img
                    src="logoArena.png"
                    className="w-40 transition-transform transform hover:scale-105"
                    alt="Client Logo 3"
                />
                <img
                    src="logoHarbour.png"
                    className="w-40 transition-transform transform hover:scale-105"
                    alt="Client Logo 4"
                />
            </div>
        </div>
    );
};
export default Clients;