import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField, { FormikRadioGroup, FormikFieldGroup } from 'components/formik-field';
import SecurityAlert from 'components/security-alert';
import { buildNestedKey } from 'utils';
import { getCurrentMemberIndex, updateCurrentMemberIndex } from 'models/household';

const modelName = 'memberDetails';
const incrementCurrentMember = ({ household }) => ({
  household: updateCurrentMemberIndex(household, getCurrentMemberIndex(household) + 1)
});

const MemberDetails = ({ handleChange, sectionName, t, registerStep }) => (
  <Wizard.Context>
    {({ household }) => {
      const memberIndex = getCurrentMemberIndex(household);
      const member = household.members[memberIndex];
      const firstName = member.name.firstName;

      return (
        <Wizard.Step
          header={t(`${buildNestedKey(sectionName, modelName, 'header')}`, { firstName })}
          modelName={modelName}
          registerStep={registerStep}
          onNext={incrementCurrentMember}
        >
          <React.Fragment>
            <FormikFieldGroup
              inline
              labelText={t(`${buildNestedKey(sectionName, modelName, 'dob', 'label')}`, { firstName })}
              explanation={t(`${buildNestedKey(sectionName, modelName)}.dob.explanation`)}
              fields={[{
                name: `${sectionName}.members.${memberIndex}.dob.month`,
                labelText: t(`${buildNestedKey(sectionName, modelName)}.dob.month`),
                onChange: handleChange,
              }, {
                name: `${sectionName}.members.${memberIndex}.dob.day`,
                labelText: t(`${buildNestedKey(sectionName, modelName)}.dob.day`),
                onChange: handleChange
              }, {
                name: `${sectionName}.members.${memberIndex}.dob.year`,
                labelText: t(`${buildNestedKey(sectionName, modelName)}.dob.year`),
                onChange: handleChange,
                className: 'desktop:grid-col-9'
              }]}
            />
            <FormikRadioGroup
              inline
              options={[{
                label: t(buildNestedKey(sectionName, modelName, 'sex', 'options', 'male')),
                value: "male"
              },
              {
                label: t(buildNestedKey(sectionName, modelName, 'sex', 'options', 'female')),
                value: "female"
              }]}
              name={buildNestedKey(sectionName, 'members', memberIndex, 'sex')}
              labelText={t(`${buildNestedKey(sectionName, modelName, 'sex', 'label')}`, { firstName })}
              explanation={t(`${buildNestedKey(sectionName, modelName, 'sex', 'explanation')}`)}
            />
            <FormikField
              name={buildNestedKey(sectionName, 'members', memberIndex, 'race')}
              labelText={t(`${buildNestedKey(sectionName, modelName, 'race', 'label')}`, { firstName })}
              onChange={handleChange}
            />
            <FormikField
              name={buildNestedKey(sectionName, 'members', memberIndex, 'ssn')}
              labelText={t(`${buildNestedKey(sectionName, modelName, 'ssn', 'label')}`, { firstName })}
              explanation={t(`${buildNestedKey(sectionName, modelName, 'ssn', 'explanation')}`)}
              onChange={handleChange}
            />
          </React.Fragment>
          <SecurityAlert />
        </Wizard.Step>
      );
    }}
  </Wizard.Context>
);

export default withLocale(MemberDetails);
