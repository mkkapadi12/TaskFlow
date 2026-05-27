import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enAbout from './locales/en/about.json';
import enCommon from './locales/en/common.json';
import enContact from './locales/en/contact.json';
import enDocs from './locales/en/docs.json';
import enError from './locales/en/error.json';
import enHome from './locales/en/home.json';
import enPrivacy from './locales/en/privacy.json';
import guAbout from './locales/gu/about.json';
import guCommon from './locales/gu/common.json';
import guContact from './locales/gu/contact.json';
import guDocs from './locales/gu/docs.json';
import guError from './locales/gu/error.json';
import guHome from './locales/gu/home.json';
import guPrivacy from './locales/gu/privacy.json';
import hiAbout from './locales/hi/about.json';
import hiCommon from './locales/hi/common.json';
import hiContact from './locales/hi/contact.json';
import hiDocs from './locales/hi/docs.json';
import hiError from './locales/hi/error.json';
import hiHome from './locales/hi/home.json';
import hiPrivacy from './locales/hi/privacy.json';

i18n
  .use(LanguageDetector) // auto-detect from localStorage / browser
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        home: enHome,
        about: enAbout,
        contact: enContact,
        docs: enDocs,
        error: enError,
        privacy: enPrivacy,
      },
      hi: {
        common: hiCommon,
        home: hiHome,
        about: hiAbout,
        contact: hiContact,
        docs: hiDocs,
        error: hiError,
        privacy: hiPrivacy,
      },
      gu: {
        common: guCommon,
        home: guHome,
        about: guAbout,
        contact: guContact,
        docs: guDocs,
        error: guError,
        privacy: guPrivacy,
      },
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en', // Hindi key missing → fall to English
    defaultNS: 'common', // useTranslation() without arg → common ns
    interpolation: {
      escapeValue: false, // React already escapes XSS
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
