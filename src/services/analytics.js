const GA_ID = import.meta.env.VITE_GA_ID;

export const initGA = () => {
    if (window.gtag) return;

    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID);
};

export const trackPage = (url) => {
    if (!window.gtag) return;

    window.gtag('config', GA_ID, {
        page_path: url,
    });
};