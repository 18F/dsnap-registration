import i18n from 'i18n';
import { setIn } from 'formik';

const validateHouseholdCount = ({ household }) => {
    const numValue = household.numMembers
    let errors = {};

    if (typeof numValue !== 'number' || isNaN(numValue)) {
      errors = setIn(errors, 'household.numMembers', i18n.t('errors.required'));
    }

    return errors;
  };

  export default validateHouseholdCount;
