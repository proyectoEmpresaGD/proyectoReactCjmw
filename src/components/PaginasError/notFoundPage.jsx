import React from 'react';
import { Link } from 'react-router-dom';
 // Asegúrate de tener esta imagen en tu proyecto

const NotFoundPage = () => {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center text-white z-50"
            style={{
                backgroundImage: `url(https://cjmw.eu/CarpetaPaginaWebCjmw/ImagenesAmbiente/1200%20FLAMENCO%20FOTOART/1200%20FLAMENCO%20PERRAULT.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="bg-black bg-opacity-50 p-10 rounded-lg text-center">
                <h1 className="text-9xl font-extrabold">404</h1>
                <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
                <p className="mt-4 text-lg">Oops! The page you are looking for does not exist.</p>
                <Link
                    to="/"
                    className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-200"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;