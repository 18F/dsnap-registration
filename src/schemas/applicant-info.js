import { isValidPhoneNumber } from 'validators';
import * as Yup from 'yup';
import i18n from 'i18next';

const applicantInfoSchema = Yup.object().shape({
  basicInfo: Yup.object().shape({
    residenceAddress: Yup.object().shape({
      street1: Yup.string().required(i18n.t('errors.required')),
      zipcode: Yup.string()
        .length(5, i18n.t('errors.length', { fieldName: 'zipcode', length: 5 }))
        .matches(/\d{0,5}/, i18n.t('errors.length', { fieldName: 'zipcode', length: 5 }))
        .required(i18n.t('errors.required')),
      city: Yup.string()
        .required(i18n.t('errors.required')),
      state: Yup.string()
        .required(i18n.t('errors.required')),
    }),
    county: Yup.string()
      .required(i18n.t('errors.required')),
    phone: Yup.string()
      .required(i18n.t('errors.required'))
      .test('isValidUSPhone', i18n.t('errors.phone'), function(value) {
          value = value.replace(/[^\d]/g, '');
          return isValidPhoneNumber(value);
      }),
    currentMailingAddress: Yup.boolean()
      .nullable()
      .required(i18n.t('errors.yesNo'))
  })
});

export default applicantInfoSchema;
