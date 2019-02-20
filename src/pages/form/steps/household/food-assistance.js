import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import { FormikFieldGroup } from 'components/formik-field';
import { buildNestedKey } from 'utils';

const modelName = 'foodAssistance';

const FoodAssistance = ({ handleChange, sectionName, t, registerStep }) =>
  <Wizard.Context>
    { ({ household }) => (
      <Wizard.Step
        header={t(`${buildNestedKey(sectionName, modelName, 'header')}`)}
        modelName='hasFoodAssistance'
        registerStep={registerStep}
      >
        <FormikFieldGroup
          labelText={t(`${buildNestedKey(sectionName, modelName, 'label')}`)}
          explanation={t(`${buildNestedKey(sectionName, modelName, 'explanation')}`)}
          fields={household.members.map((member, index) => ({            
            onChange: handleChange,
            labelText: `${member.name.firstName} ${member.name.lastName}`,
            name: buildNestedKey(sectionName, 'members', index, 'hasFoodAssistance'),
            type: 'checkbox'
          }))}
        />
      </Wizard.Step>
    )}
  </Wizard.Context>

export default withLocale(FoodAssistance);
