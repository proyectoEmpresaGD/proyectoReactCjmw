import { useEffect, useRef } from 'react';

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
const TURNSTILE_SCRIPT_URL =
    'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let turnstileScriptPromise = null;

const loadTurnstileScript = () => {
    if (window.turnstile) {
        return Promise.resolve(window.turnstile);
    }

    if (turnstileScriptPromise) {
        return turnstileScriptPromise;
    }

    turnstileScriptPromise = new Promise((resolve, reject) => {
        const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);

        const handleLoad = () => {
            if (window.turnstile) {
                resolve(window.turnstile);
                return;
            }

            reject(new Error('Turnstile API not available'));
        };

        const handleError = () => {
            turnstileScriptPromise = null;
            reject(new Error('Unable to load Turnstile'));
        };

        if (existingScript) {
            existingScript.addEventListener('load', handleLoad, { once: true });
            existingScript.addEventListener('error', handleError, { once: true });
            return;
        }

        const script = document.createElement('script');

        script.id = TURNSTILE_SCRIPT_ID;
        script.src = TURNSTILE_SCRIPT_URL;
        script.async = true;
        script.defer = true;

        script.addEventListener('load', handleLoad, { once: true });
        script.addEventListener('error', handleError, { once: true });

        document.head.appendChild(script);
    });

    return turnstileScriptPromise;
};

const TurnstileWidget = ({
    siteKey,
    resetKey = 0,
    onVerify,
    onExpire,
    onError,
}) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);

    const onVerifyRef = useRef(onVerify);
    const onExpireRef = useRef(onExpire);
    const onErrorRef = useRef(onError);

    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;

    useEffect(() => {
        let cancelled = false;

        if (!siteKey || !containerRef.current) {
            return undefined;
        }

        loadTurnstileScript()
            .then((turnstile) => {
                if (cancelled || !containerRef.current) {
                    return;
                }

                widgetIdRef.current = turnstile.render(containerRef.current, {
                    sitekey: siteKey,
                    theme: 'auto',
                    appearance: 'interaction-only',
                    action: 'contact',

                    callback: (token) => {
                        onVerifyRef.current?.(token);
                    },

                    'expired-callback': () => {
                        onExpireRef.current?.();
                    },

                    'error-callback': (errorCode) => {
                        onErrorRef.current?.(errorCode);
                    },
                });
            })
            .catch((error) => {
                onErrorRef.current?.(error);
            });

        return () => {
            cancelled = true;

            if (
                window.turnstile &&
                widgetIdRef.current !== null
            ) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [siteKey, resetKey]);

    return <div ref={containerRef} />;
};

export default TurnstileWidget;