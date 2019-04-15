import React from 'react';
import PropTypes from 'prop-types';
import { buildNestedKey } from 'utils';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';
import states from 'data/states';

import * as Yup from 'yup';
import i18n from 'i18next';

const mailingAddressSchema = Yup.object().shape({
  basicInfo: Yup.object().shape({
    mailingAddress: Yup.object().shape({
      street1: Yup.string().required(i18n.t('errors.required')),
      zipcode: Yup.string()
        .length(5, i18n.t('errors.length', { fieldName: 'zipcode', length: 5 }))
        .matches(/\d{0,5}/, i18n.t('errors.length', { fieldName: 'zipcode', length: 5 }))
        .required(i18n.t('errors.required')),
      city: Yup.string()
        .required(i18n.t('errors.required')),
      state: Yup.string()
        .required(i18n.t('errors.required')),
    })
  })
});

class MailingAddress extends React.Component {
  static modelName = 'mailingAddress'
  static tKey = 'addresses'

  static propTypes = {
    handleChange: PropTypes.func,
    registerStep: PropTypes.func,
    sectionName: PropTypes.string,
  }

  render() {
    const { handleChange, sectionName, t } = this.props;
    const { modelName, tKey } = MailingAddress;

    return (
      <Wizard.Step
        header={t(`${buildNestedKey(sectionName, modelName)}.header`)}
        modelName={modelName}
        registerStep={this.props.registerStep}
        validationSchema={mailingAddressSchema}
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
          options={states}
          name={`${sectionName}.${modelName}.state`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'state', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.zipcode`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'zip', 'label')}`)}
        />
      </Wizard.Step>
    )
  }
}

export default withLocale(MailingAddress);
