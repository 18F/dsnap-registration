import { isValidPhoneNumber } from 'validators';
import * as Yup from 'yup';
import i18n from 'i18next';

const applicantInfoSchema = (validDisasterState) =>
  Yup.object().shape({
    basicInfo: Yup.object().shape({
      residenceAddress: Yup.object().shape({
        street1: Yup.string()
          .required(i18n.t('errors.street')),
        zipcode: Yup.string()
          .length(5, i18n.t('errors.zipcode'))
          .matches(/\d{0,5}/, i18n.t('errors.zipcode'))
          .required(i18n.t('errors.zipcode')),
        city: Yup.string()
          .required(i18n.t('errors.city')),
        state: Yup.string()
          .oneOf([validDisasterState], i18n.t('errors.state', { state: validDisasterState }))
          .required(i18n.t('errors.required')),
      }),
      phone: Yup.string()
        .test('isValidUSPhone', i18n.t('errors.phone'), (value) => {
            if (!value) {
              return true;
            }

            value = value.replace(/[^\d]/g, '');
            return isValidPhoneNumber(value);
        }),
      currentMailingAddress: Yup.boolean()
        .nullable()
        .required(i18n.t('errors.yesNo')),
      email: Yup.string()
        .email(i18n.t('errors.email'))
    })
  });

export default applicantInfoSchema;
