import * as Yup from 'yup';
import i18n from 'i18next';

const householdCount = Yup.object().shape({
  household: Yup.object().shape({
      numMembers: Yup.string()
        .required(i18n.t('errors.required'))
        .test('isPositiveNumber', i18n.t('errors.positiveNumber'), (value) => {
          return Number(value) > 0;
        })
    })
});

export default householdCount;
