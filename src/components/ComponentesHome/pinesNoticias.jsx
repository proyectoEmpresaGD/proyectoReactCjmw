// src/components/Works.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogPosts } from '../../Constants/constants';

const Works = () => {
    const { t } = useTranslation('works');

    return (
        <div id="aboutUs" className="p-8 xl:p-20">
            <div className="mb-8">
                <h1 className="text-[40px] font-black text-center">
                    {t('headerTitle')}
                </h1>
                <p className="text-xl text-gray-500 text-center">
                    {t('headerDesc')}
                </p>
            </div>
            {/* Works */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                {blogPosts.map((post, index) => (
                    <div key={index} className="flex flex-col gap-4">
                        <div className="relative">
                            <img
                                src={post.imgSrc}
                                alt={post.altText}
                                className="w-full h-[400px] object-cover rounded-3xl transition-transform transform hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100">
                                <Link
                                    to={post.link}
                                    className="bg-primary text-white py-2 px-6 rounded-xl font-semibold transition-transform transform hover:scale-110"
                                >
                                    {t('viewDetails')}
                                </Link>
                            </div>
                        </div>
                        <p className="text-gray-500 text-center">{post.date}</p>
                        <h3 className="text-2xl font-bold text-center">{post.title}</h3>
                        <p className="text-gray-500 text-center">{post.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Works;
