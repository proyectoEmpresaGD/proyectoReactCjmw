// src/pages/BlogHome.jsx
import { useParams } from 'react-router-dom';
import { Header } from '../../components/header';
import Footer from '../../components/footer';
import { CartProvider } from '../../components/CartContext';
import { useTranslation } from 'react-i18next';
import { newsData } from '../../data/newsData';

const BlogHome = () => {
    const { t } = useTranslation('blog');
    const { newsId } = useParams();
    const newsItem = newsData.find((n) => n.id.toString() === newsId);

    if (!newsItem) {
        return (
            <>
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center p-4">
                        <h2 className="text-3xl font-bold text-gray-800">{t('notFoundTitle')}</h2>
                        <p className="text-lg text-gray-500">{t('notFoundMessage')}</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <CartProvider>
                <Header />
                <div className="container mx-auto px-4 py-16 lg:py-24">
                    <h1 className="text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-8 mt-4 lg:mt-0">
                        {newsItem.title}
                    </h1>

                    <div className="flex justify-center">
                        <img
                            src={newsItem.image}
                            alt={newsItem.title}
                            className="max-w-full lg:max-w-4xl h-auto object-cover rounded-lg shadow-xl"
                        />
                    </div>

                    <div className="text-md lg:text-lg text-gray-600 mt-4 text-center">{newsItem.date}</div>

                    <article className="prose lg:prose-xl mx-auto text-gray-700 leading-relaxed mt-6">
                        <p>{newsItem.content}</p>
                    </article>
                </div>
                <Footer />
            </CartProvider>
        </>
    );
};

export default BlogHome;
