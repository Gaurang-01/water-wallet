import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  resources: {
    en: {
      translation: {
        "balance": "Water Account Balance",
        "check_solvency": "Check Water Solvency",
        "recommended": "Highly Recommended"
      }
    },
    hi: {
      translation: {
        "balance": "जल खाता शेष",
        "check_solvency": "जल शोधन क्षमता की जाँच करें",
        "recommended": "अत्यधिक अनुशंसित"
      }
    }
  }
});

export default i18n;