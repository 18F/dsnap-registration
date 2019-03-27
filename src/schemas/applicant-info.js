import { isValidPhoneNumber } from 'validators';
import * as Yup from 'yup';
import i18n from 'i18next';


export const mailingAddressSchema =
Yup.object().shape({
    street1: Yup.string()
      .required(i18n.t('errors.street')),
    zipcode: Yup.string()
      .length(5, i18n.t('errors.zipcode'))
      .matches(/\d{0,5}/, i18n.t('errors.zipcode'))
      .required(i18n.t('errors.zipcode')),
    city: Yup.string()
      .required(i18n.t('errors.city')),
    state: Yup.string()
      .required(i18n.t('errors.required')),
  });

export const addressSchema = (state) =>
  Yup.object().shape({
    street1: Yup.string()
      .required(i18n.t('errors.street')),
    zipcode: Yup.string()
      .length(5, i18n.t('errors.zipcode'))
      .matches(/\d{0,5}/, i18n.t('errors.zipcode'))
      .required(i18n.t('errors.zipcode')),
    city: Yup.string()
      .required(i18n.t('errors.city')),
    state: Yup.string()
      .oneOf([state], i18n.t('errors.state', { state }))
      .required(i18n.t('errors.required')),
  });

export const phoneSchema = Yup.string()
  .required(i18n.t('errors.required'))
  .test('isValidUSPhone', i18n.t('errors.phone'), (value) => {
      value = value.replace(/[^\d]/g, '');
      return isValidPhoneNumber(value);
  });

export const emailSchema = Yup.string()
  .email(i18n.t('errors.email'));

export const currentMailingAddressSchema = Yup.boolean()
  .nullable()
  .required(i18n.t('errors.yesNo'));

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
      phone: phoneSchema,
      currentMailingAddress: currentMailingAddressSchema,
      email: emailSchema
    })
  });

export default applicantInfoSchema;
