import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';
import { buildNestedKey } from 'utils';
import validateHouseholdCount from 'validators/household';
import { addPeopleToHousehold } from 'models/household';
import { getDisaster, getBeginDate } from 'models/disaster';

const modelName = 'count';
const addToHousehold = household => values => ({
  household: addPeopleToHousehold(household, values.household.numMembers)
});

const HowMany = ({ handleChange, sectionName, t, registerStep }) =>
  <Wizard.Context>
    { ({ household, basicInfo, disasters }) => (
      <Wizard.Step
        header={t(`${buildNestedKey(sectionName, modelName, 'header')}`)}
        modelName='numMembers'
        registerStep={registerStep}
        validate={validateHouseholdCount}
        onNext={addToHousehold(household)}
      >
        <FormikField
          labelText={t(buildNestedKey(sectionName, modelName, 'label'), {
            benefitStartDate: getBeginDate(getDisaster(disasters, basicInfo.disasterIndex))
          })}
          explanation={t(buildNestedKey(sectionName, modelName, 'explanation'))}
          onChange={handleChange}
          type="number"
          name={`${sectionName}.numMembers`}
          className="desktop:grid-col-1"
        />
      </Wizard.Step>
    )}
  </Wizard.Context>

export default withLocale(HowMany);
