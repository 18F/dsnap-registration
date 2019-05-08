import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import { en, es } from './locales';

let lng;

try {
  lng = JSON.parse(localStorage.getItem('dsnap-registration')).config.language;
} catch(e) {
  lng = 'en';
}
const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  }
};

i18n
  .use(reactI18nextModule)
  .init({
    resources,
    lng,
    interpolation: {
      escapeValue: false
    },
    nsSeparator: false,
  });

export default i18n;
