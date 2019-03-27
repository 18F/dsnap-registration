import React from 'react';
import PropTypes from 'prop-types';
import { buildNestedKey } from 'utils';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';
import states from 'data/states';

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
          type="number"
          labelText={t(`${buildNestedKey(sectionName, tKey, 'zip', 'label')}`)}
        />
      </Wizard.Step>
    )
  }
}

export default withLocale(MailingAddress);

