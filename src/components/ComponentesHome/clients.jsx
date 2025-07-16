// src/components/Clients.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { clientLogos } from "../../Constants/constants";

const Clients = () => {
    const { t } = useTranslation("clients");

    return (
        <div className="bg-gradient-to-b from-white to-gray-300 p-8 flex flex-col items-center justify-center gap-8 mt-20 xl:mt-0">
            <h1 className="text-4xl font-medium text-gray-800 text-center">
                <strong>{t("headerTitle")}</strong>
            </h1>
            <div className="flex flex-col md:flex-row items-center flex-wrap gap-24 md:grid md:grid-cols-2 md:gap-20 lg:grid lg:grid-cols-4 lg:gap-24 xl:grid xl:grid-cols-4 xl:gap-24">
                {clientLogos.map((logo, index) => (
                    <Link
                        key={index}
                        to={logo.link}
                        rel="noopener noreferrer"
                        className="md:justify-center md:items-center mx-auto"
                    >
                        <img
                            src={logo.imgSrc}
                            className={`${logo.imgSize} object-contain transition-transform transform hover:scale-105`}
                            alt={logo.imgAlt}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Clients;
