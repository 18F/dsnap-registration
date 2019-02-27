import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField, { FormikFieldGroup } from 'components/formik-field';
import ComboField from 'components/combo-field';
import { buildNestedKey } from 'utils';
import { getMembers } from 'models/household';
import { hasIncome } from 'models/assets-and-income';
import { getIncome } from 'models/person';
import { getFirstName, hasJob } from 'models/person';

const modelName = 'assetsAndIncome';

const updateMembersWithIncome = state => () => {
  const members = getMembers(state.household);
  const index = state.resources.membersWithIncome[0];
  const member = members[index];

  if (!hasJob(member)) {
    return {
      resources: {
        membersWithIncome: state.resources.membersWithIncome.slice(1)
      }
    };
  }

  return state;
};

class Income extends React.Component {
  render() {
    const { handleChange, sectionName, registerStep, t } = this.props;

    return (
      <Wizard.Context>
        {(values) => {
          const { household, resources } = values;

          if (!resources.membersWithIncome.length) {
            return null;
          }

          const members = getMembers(household);
          const index = resources.membersWithIncome[0];
          const member = members[index];
          const firstName = getFirstName(member);
          const { incomeSources } = member.assetsAndIncome;
          const assetsAndIncomeId = buildNestedKey('household', 'members', index, 'assetsAndIncome');
         
          return (
            <Wizard.Step
              header={t(`${buildNestedKey(sectionName, modelName, 'header')}`, { firstName })}
              registerStep={registerStep}
              modelName={modelName}
              onNext={updateMembersWithIncome(values)}
            >
              <FormikFieldGroup
                labelText={t(buildNestedKey(sectionName, modelName, 'incomeSources', 'label'), { firstName })}
                onChange={handleChange}
                Component={ComboField}
                fieldGroupClassname="margin-y-0"
                fields={
                  Object.keys(incomeSources).reduce((memo, name) => {
                    return [
                      ...memo,
                      {
                        prefix: '$',
                        type: 'checkbox',
                        comboName: `${assetsAndIncomeId}.otherIncome.${name}.value`,
                        name: `${assetsAndIncomeId}.otherIncome.${name}.applicable`,
                        onChange: handleChange,
                        labelText: t(buildNestedKey(sectionName, modelName, 'incomeSources', name), { firstName }),
                        quietLabel: true,
                        explanation: t(buildNestedKey(sectionName, modelName, 'incomeSources', 'explanation')),
                      }
                    ]
                  }, [{
                    labelText: t(buildNestedKey(sectionName, modelName, 'incomeSources', 'hasJobs'), { firstName }),
                    name: `household.members.${index}.hasJobs`,
                    onChange: handleChange,
                    type: 'checkbox',
                    Component: FormikField
                  }])
                }
              />
            </Wizard.Step>
          )
        }}
      </Wizard.Context>
    )
  }
}

export { Income }
export default withLocale(Income);
