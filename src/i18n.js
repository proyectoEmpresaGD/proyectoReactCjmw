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

        // Si el navegador detecta 'fr-FR' o 'en-US', cargamos solo 'fr' / 'en'
        load: 'languageOnly',
        nonExplicitSupportedLngs: true,

        defaultNS: 'common',
        backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
        interpolation: { escapeValue: false },
        react: { useSuspense: true },
    });

export default i18n;
