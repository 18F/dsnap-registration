import { setIn, getIn } from 'formik';
import i18n from 'i18n';

const LANGUAGES = ['en', 'sp'];
const PREFIX = 'preregistration.language';
const errorPath = `${PREFIX}.error`;

export default (values) => {
  const language = getIn(values, PREFIX);
  let errors = {};

  if (!LANGUAGES.includes(language)) {
    errors = setIn(errors, PREFIX, i18n.t(errorPath));
  }

  return errors;
};
