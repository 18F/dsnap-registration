import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import { FormikFieldGroup } from 'components/formik-field';
import { buildNestedKey } from 'utils';
import { getFirstName, getLastName } from 'models/person';
import { getDisaster, getBeginDate, getEndDate } from 'models/disaster';

const modelName = 'foodAssistance';

const FoodAssistance = ({ handleChange, sectionName, t, registerStep }) =>
  <Wizard.Context>
    { ({ basicInfo, disasters, household }) => {
      const disaster = getDisaster(disasters, basicInfo.disasterId);

      return (
        <Wizard.Step
          header={t(`${buildNestedKey(sectionName, modelName, 'header')}`)}
          modelName='hasFoodAssistance'
          registerStep={registerStep}
        >
          <FormikFieldGroup
            labelText={t(buildNestedKey(sectionName, modelName, 'label'), {
              benefitStartDate: getBeginDate(disaster),
              benefitEndDate: getEndDate(disaster)
            })}
            explanation={t(`${buildNestedKey(sectionName, modelName, 'explanation')}`)}
            fields={household.members.map((member, index) => ({            
              onChange: handleChange,
              labelText: `${getFirstName(member)} ${getLastName(member)}`,
              name: buildNestedKey(sectionName, 'members', index, 'hasFoodAssistance'),
              type: 'checkbox'
            }))}
          />
        </Wizard.Step>
      );
    }}
  </Wizard.Context>

export default withLocale(FoodAssistance);
