import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import { buildNestedKey, phoneMaskRegExp } from 'utils';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import YesNoField from 'components/yes-no-field';
import FormikField from 'components/formik-field';
import states from 'data/states';
import { hasMailingAddress } from 'models/basic-info';
import { isValidPhoneNumber } from 'validators';
import * as Yup from 'yup';
import i18n from 'i18next';

const setMailingAddress = (basicInfo) => () => {
  if (!hasMailingAddress(basicInfo)) {
    return {
      basicInfo: {
        ...basicInfo,
        mailingAddress: basicInfo.residenceAddress
      }
    };
  }

  return { basicInfo: basicInfo };
};

const personalInfoSchema = Yup.object().shape({
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

class ResidenceAddress extends React.Component {
  static modelName = 'residenceAddress'
  static tKey = 'addresses'

  static propTypes = {
    handleChange: PropTypes.func,
    registerStep: PropTypes.func,
    sectionName: PropTypes.string,
  }

  render() {
    const { handleChange, sectionName, t } = this.props;
    const { modelName, tKey } = ResidenceAddress;

    return (
      <Wizard.Step
        header={t(`${buildNestedKey(sectionName, tKey)}.header`)}
        modelName={modelName}
        registerStep={this.props.registerStep}
        onNext={setMailingAddress(this.props.formik.values.basicInfo)}
        validationSchema={personalInfoSchema}
      >
        <FormikField
          name={`${sectionName}.${modelName}.street1`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'street1', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.street2`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'street2', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.city`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'city', 'label')}`)}
        />
        <FormikField
          type="select"
          name={`${sectionName}.${modelName}.state`}
          options={states}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'state', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.zipcode`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'zip', 'label')}`)}
        />
        <YesNoField
          name={`${sectionName}.currentMailingAddress`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'currentMailingAddress', 'label')}`)}
        />
        <FormikField
          type="tel"
          pattern="(XXX)-XXX-XXXX"
          delimiter={phoneMaskRegExp}
          name={`${sectionName}.phone`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, 'phone', 'label')}`)}
        />
        <FormikField
          type="email"
          name={`${sectionName}.email`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, 'email', 'label')}`)}
        />
      </Wizard.Step>
    )
  }
}

export default connect(withLocale(ResidenceAddress));
