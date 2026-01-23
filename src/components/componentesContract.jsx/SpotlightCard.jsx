// src/components/componentesContract.jsx/SpotlightCard.jsx
import React from "react";

export default function SpotlightCard({
    quote,
    author,
    role,
    image // puede venir undefined
}) {
    const imgSrc = image?.src || null;
    const imgAlt = image?.alt || author || "Spotlight image";

    return (
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/80 backdrop-blur p-8 md:p-10 shadow-lg">
            {/* Imagen opcional (solo si hay src) */}
            {imgSrc && (
                <div className="mb-6 h-48 md:h-56 w-full overflow-hidden rounded-2xl border border-black/10">
                    <img
                        src={imgSrc}
                        alt={imgAlt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>
            )}

            <blockquote className="text-lg md:text-xl text-gray-900 leading-relaxed">
                “{quote}”
            </blockquote>

            <div className="mt-4 text-sm text-gray-700">
                {author && <span className="font-semibold">{author}</span>}
                {author && role && <span className="mx-2">—</span>}
                {role && <span>{role}</span>}
            </div>
        </div>
    );
}
