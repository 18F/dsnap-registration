import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';
import { buildNestedKey } from 'utils';
import validateHouseholdCount from 'validators/household';

const modelName = 'count';

const HowMany = ({ handleChange, sectionName, t, registerStep })=>
  <Wizard.Step
    header={t(`${buildNestedKey(sectionName, modelName, 'header')}`)}
    modelName='numMembers'
    registerStep={registerStep}
    validate={validateHouseholdCount}
  >
    <FormikField
      labelText={t(`${buildNestedKey(sectionName, modelName, 'label')}`)}
      explanation={t(`${buildNestedKey(sectionName, modelName, 'explanation')}`)}
      onChange={handleChange}
      type="number"
      name={`${sectionName}.numMembers`}
      className="desktop:grid-col-1"
    />
  </Wizard.Step>

export default withLocale(HowMany);
