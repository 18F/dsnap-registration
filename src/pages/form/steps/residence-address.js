import React from 'react';
import PropTypes from 'prop-types';
import { buildNestedKey } from 'utils';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';

class ResidenceAddress extends React.Component {
  static modelName = "addresses"

  static propTypes = {
    handleChange: PropTypes.func,
    registerStep: PropTypes.func,
    sectionName: PropTypes.string,
  }

  render() {
    const { handleChange, sectionName, t } = this.props;
    const { modelName } = ResidenceAddress;

    return (
      <Wizard.Step
        header={t(`${buildNestedKey(sectionName, modelName)}.header`)}
        modelName={modelName}
        registerStep={this.props.registerStep}
      >
        <FormikField
          name={`${sectionName}.${modelName}.residenceAddress.street1`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, modelName, 'street1', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.residenceAddress.street2`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, modelName, 'street2', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.residenceAddress.city`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, modelName, 'city', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.residenceAddress.state`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, modelName, 'state', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.county`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, modelName, 'county', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.residenceAddress.zip`}
          onChange={handleChange}
          type="number"
          labelText={t(`${buildNestedKey(sectionName, modelName, 'zip', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.currentMailingAddress`}
          onChange={handleChange}
          type="checkbox"
          labelText={t(`${buildNestedKey(sectionName, modelName, 'currentMailingAddress', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.phone`}
          onChange={handleChange}
          type="tel"
          labelText={t(`${buildNestedKey(sectionName, modelName, 'phone', 'label')}`)}
        />
        <FormikField
          type="email"
          name={`${sectionName}.${modelName}.email`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, modelName, 'email', 'label')}`)}
        />
      </Wizard.Step>
    )
  }
}

export default withLocale(ResidenceAddress);
