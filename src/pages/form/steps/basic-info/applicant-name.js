import React from 'react';
import PropTypes from 'prop-types';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';
import { buildNestedKey } from 'utils';
import withLocale from 'components/with-locale';
import { nameValidator } from 'validators/basic-info';

class ApplicantName extends React.Component {
  static modelName = 'applicantName'

  static propTypes = {
    handleChange: PropTypes.func,
    registerStep: PropTypes.func,
    sectionName: PropTypes.string,
  }

  render() {
    const { handleChange, sectionName, t, registerStep } = this.props;
    const { modelName } = ApplicantName;

    return (
      <Wizard.Step
        header={t(`${buildNestedKey(sectionName, modelName, 'header')}`)}
        modelName={modelName}
        registerStep={this.props.registerStep}
        validate={nameValidator}
      >
        <FormikField
          name={`${sectionName}.${modelName}.firstName`}
          onChange={handleChange}
          explanation={t(`${buildNestedKey(sectionName, modelName, 'firstName', 'explanation')}`)}
          labelText={t(`${buildNestedKey(sectionName, modelName, 'firstName', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.middleName`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, modelName, 'middleName', 'label')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.lastName`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, modelName, 'lastName', 'label')}`)}
        />
      </Wizard.Step>
    );
  }
}

export default withLocale(ApplicantName);
