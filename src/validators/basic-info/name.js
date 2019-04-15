import i18n from 'i18n';
import { setIn } from 'formik';
import { getApplicant } from 'models/household';
import { getFirstName, getLastName } from 'models/person';

const applicantNameKey = 'household.members.0.name';

// TODO: pass this in / configure somehow
export default ({ household }) => {
  const applicant = getApplicant(household);
  const firstName = getFirstName(applicant);
  const lastName = getLastName(applicant);
  
  let errors = {};

  if (!firstName) {
    errors = setIn(errors, `${applicantNameKey}.firstName`, i18n.t('errors.required'));
  } else if (!lastName) {
    errors = setIn(errors,  `${applicantNameKey}.lastName`, i18n.t('errors.required'));
  }

  return errors;
};
