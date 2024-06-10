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
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center">
            <div>
                <p>We use cookies to improve your experience. By continuing, you agree to our cookie policy.</p>
            </div>
            <div>
                <button onClick={handleReject} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Reject
                </button>
                <button onClick={handleAccept} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Accept
                </button>
            </div>
        </div>
    );
};

export default CookieConsent;
