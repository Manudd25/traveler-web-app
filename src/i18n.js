import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import it from "./locales/it.json";
import de from "./locales/de.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    es: { translation: es },
    it: { translation: it },
    de: { translation: de },



    
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
