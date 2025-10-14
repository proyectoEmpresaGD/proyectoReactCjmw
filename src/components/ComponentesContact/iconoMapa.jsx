import React from 'react';

export default function IconoMapa({ onSelect, label = 'Ver mapa' }) {
    return (
        <button onClick={onSelect} aria-label={label} title={label}>
            <svg
                className="flex-shrink-0 text-gray-600 w-7 h-7 hover:scale-150 duration-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </button>
    );
}
