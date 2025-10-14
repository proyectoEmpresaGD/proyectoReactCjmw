// src/components/ComponentesContact/MapEmbed.jsx
import React from 'react';

export default function MapEmbed({ location, className }) {
    if (!location) return null;

    return (
        <div className={`relative w-full ${className || ''}`}>
            <iframe
                title={`Mapa de ${location?.nombre || 'ubicación'}`}
                src={location.googleMapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[24rem] w-full rounded-2xl border-0"
            />
            <div className="mt-3 text-center">
                <a
                    href={location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-700 hover:text-neutral-900 hover:underline"
                >
                    Ver en Google Maps
                </a>
            </div>
        </div>
    );
}
