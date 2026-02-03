import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const DEFAULT_NAMESPACES = ['common', 'header', 'footer', 'cookieConsent'];

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        supportedLngs: ['es', 'en', 'fr'],
        defaultNS: 'common',
        ns: DEFAULT_NAMESPACES,
        backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
        detection: { order: ['navigator'], caches: [] },
        interpolation: { escapeValue: false },
        react: { useSuspense: true },
    });

export default i18n;
