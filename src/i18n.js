import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        supportedLngs: ['es', 'en', 'fr'],
        ns: [
            "about", "blog", "buttonFiltro", "cardProduct", "cart", "clients", "coleccionesMarcas",
            "collectionCarousel", "common", "contacts", "contract", "cookieConsent", "filterPanel",
            "filterPanelNew", "footer", "geocodingService", "header", "instructions", "media", "newCollection",
            "notificationPopup", "pageArena", "pageBassari", "pageFlamenco", "pageHarbour",
            "productModal", "productPage", "sameStyleCarousel", "search", "shareButton",
            "subMenuCarousel", "works"
        ],
        defaultNS: 'common',
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        },
        detection: {
            order: ['navigator'],
            caches: []
        },
        interpolation: { escapeValue: false }
    });

export default i18n;
