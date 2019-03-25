import React from 'react';
import PropTypes from 'prop-types';
import { buildNestedKey, phoneMaskRegExp } from 'utils';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import YesNoField from 'components/yes-no-field';
import FormikField from 'components/formik-field';
import states from 'data/states';

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
          type="select"
          name={`${sectionName}.${modelName}.state`}
          options={states}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'state', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.zip`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'zip', 'label')}`)}
        />
        <YesNoField
          name={`${sectionName}.currentMailingAddress`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, tKey, 'currentMailingAddress', 'label')}`)}
        />
        <FormikField
          type="mask"
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

export default withLocale(ResidenceAddress);
