import i18n from 'i18n';
import { setIn } from 'formik';

const validateHouseholdCount = (value) => {
    let errors = {};
  
    if (typeof value !== 'number' || isNaN(value)) {
      errors = setIn(errors, 'household.numMembers', i18n.t('errors.required'));
    }

    return errors;
  };

  export default validateHouseholdCount;
