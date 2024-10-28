import React from 'react';
import { useNavigate } from 'react-router-dom'; // Para la navegación entre rutas
import scrollToLocation from './scrollToLocation'; // Asegúrate que está bien importado

const IconoMapa = ({ direccion }) => {
    const navigate = useNavigate(); // Hook para la navegación

    const handleClick = () => {
        navigate(`/map/${direccion}`); // Redirigir a la página del mapa con la dirección
        scrollToLocation("mapa"); // Scroll hacia el mapa
    };

    return (
        <button onClick={handleClick}>
            <svg
                className="flex-shrink-0 text-gray-600 w-7 h-7 hover:scale-150 duration-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
            </svg>
        </button>
    );
}

export default IconoMapa;
