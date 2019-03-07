import React from 'react';
import PropTypes from 'prop-types';
import { buildNestedKey } from 'utils';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField, { FormikRadioGroup } from 'components/formik-field';

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
          name={`${sectionName}.${modelName}.state`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'state', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.county`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'county', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.zip`}
          onChange={handleChange}
          type="number"
          labelText={t(`${buildNestedKey(sectionName, tKey, 'zip', 'label')}`)}
        />
        <FormikRadioGroup
          inline
          options={[{
            label: t('general.yes'),
            value: true
          },
          {
            label: t('general.no'),
            value: false
          }]}
          name={`${sectionName}.currentMailingAddress`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'currentMailingAddress', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.phone`}
          onChange={handleChange}
          type="tel"
          labelText={t(`${buildNestedKey(sectionName, tKey, 'phone', 'label')}`)}
        />
        <FormikField
          type="email"
          name={`${sectionName}.email`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'email', 'label')}`)}
        />
      </Wizard.Step>
    )
  }
}

export default withLocale(ResidenceAddress);
