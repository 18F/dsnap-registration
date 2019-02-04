import i18n from 'i18n';
import { setIn } from 'formik';

// TODO: pass this in / configure somehow
export default ({ firstName, lastName }) => {
  let errors = {};

  if (!firstName) {
    errors = setIn(errors, 'basicInfo.applicantName.firstName', i18n.t('errors.required'));
  } else if (!lastName) {
    errors = setIn(errors, 'basicInfo.applicantName.lastName', i18n.t('errors.required'));
  }

  return errors;
};
