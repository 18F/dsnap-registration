import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import { en } from './locales';

const resources = {
  en: {
    translation: en
  }
};

i18n
  .use(reactI18nextModule)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;