import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'es',
        supportedLngs: ['es', 'en', 'fr'],
        ns: ['common', 'header', 'cart', 'footer', 'instructions', 'subMenuCarousel', 'shareButton', 'search', 'productModal', 'collectionCarousel', 'sameStyleCarousel', 'cardProduct', 'contacts', 'clients', 'geocodingService', 'works', 'notificationPopup', 'newCollection', 'cookieConsent.json', 'coleccionesMarcas', 'buttonFiltro'],
        defaultNS: 'common',
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        },
        interpolation: { escapeValue: false }
    });

export default i18n;
