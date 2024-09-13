import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookieConsent = () => {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const consent = Cookies.get('cookie-consent');
        if (!consent) {
            setShowBanner(true);
        }
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
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
    <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-4xl">
        <div>
            <p className="text-sm md:text-base">
                We use cookies to improve your experience. By continuing, you agree to our{' '}
                <a href="/cookie-policy" className="underline text-blue-300 hover:text-blue-500 transition-colors">
                    cookie policy
                </a>.
            </p>
        </div>
        <div className="mt-5 space-x-6 text-end flex-col">
            <button
                onClick={handleReject}
                className="bg-black hover:bg-white text-white hover:text-black duration-200 font-bold py-2 px-4 rounded"
            >
                Rechazarlas todas
            </button>
            <button
                onClick={handleAccept}
                className="bg-black hover:bg-white text-white hover:text-black duration-200 font-bold py-2 px-4 rounded"
            >
                Aceptarlas todas
            </button>
        </div>
    </div>
</div>
    );
};

export default CookieConsent;
