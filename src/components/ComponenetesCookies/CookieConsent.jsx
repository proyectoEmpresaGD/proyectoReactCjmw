// src/components/CookieConsent.jsx
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
    const { t } = useTranslation('cookieConsent');
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = Cookies.get('cookie-consent');
        if (!consent) setShowBanner(true);
    }, []);

    const handleAccept = () => {
        Cookies.set('cookie-consent', 'accepted', { expires: 365 });
        setShowBanner(false);
    };

    const handleReject = () => {
        Cookies.set('cookie-consent', 'rejected', { expires: 365 });
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-4xl">
                <div>
                    <p className="text-sm md:text-base">
                        {t('message')}{' '}
                        <a
                            href="/cookie-policy"
                            className="underline text-blue-300 hover:text-blue-500 transition-colors"
                        >
                            {t('policyLinkText')}
                        </a>
                        .
                    </p>
                </div>
                <div className="mt-5 flex justify-end space-x-6">
                    <button
                        onClick={handleReject}
                        className="bg-black hover:bg-white text-white hover:text-black duration-200 font-bold py-2 px-4 rounded"
                    >
                        {t('rejectAll')}
                    </button>
                    <button
                        onClick={handleAccept}
                        className="bg-black hover:bg-white text-white hover:text-black duration-200 font-bold py-2 px-4 rounded"
                    >
                        {t('acceptAll')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
