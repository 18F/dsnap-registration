import React from 'react';
import { withRouter } from 'react-router-dom';
import { withMachineContext } from 'components/fsm';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField, { FormikFieldGroup } from 'components/formik-field';
import ComboField from 'components/combo-field';
import { validateIncomeSchema } from 'schemas/income';
import { buildNestedKey } from 'utils';
import { getMembers, updateMemberAtIndex } from 'models/household';
import { getFirstName, hasJob } from 'models/person';
import { getDisaster } from 'models/disaster';
import {
  getCurrentResourceHolderId,
  updateCurrentMemberIndex
} from 'models/resources';

const modelName = 'assetsAndIncome';

const updateMemberIncome = (values) => {
  const memberId = getCurrentResourceHolderId(values.resources);
  const member = getMembers(values.household)[memberId];

  if (!hasJob(member)) {
    const nextMember = {
      ...member,
      assetsAndIncome: {
        ...member.assetsAndIncome,
        jobs: []
      }
    };

    return {
      ...values,
      household: updateMemberAtIndex(values.household, values.resources.currentMemberIndex, nextMember),
      resources: {
        ...values.resources,
        currentMemberIndex: updateCurrentMemberIndex(values.resources, 1)
      }
    };
  }

  return values;
}

class Income extends React.Component {
  unlisten = null

  componentDidMount() {
    this.unlisten = this.props.history.listen((event, action) => {
      return setTimeout(() => {
        return this.rewindMemberIndex(event, action);
      }, 0);
    });
  }

  componentWillUnmount() {
    setTimeout(() => this.unlisten(), 0);
  }

  rewindMemberIndex = (_, action) => {
    if (action === 'POP') {
      this.props.fsmTransition({
        command: 'DECREMENT_CURRENT_MEMBER_INDEX',
      });
    }
  }

  render() {
    const { handleChange, sectionName, registerStep, t } = this.props;

    return (
      <Wizard.Context>
        {(values) => {
          const { household, resources, disasters, basicInfo } = values;

          if (!resources.membersWithIncome.length) {
            return null;
          }

          const disaster = getDisaster(disasters, basicInfo.disasterId);
          const members = getMembers(household);
          const index = getCurrentResourceHolderId(resources);
          const member = members[index];

          if (!member) {
            return null;
          }

          const firstName = getFirstName(member);
          const { incomeSources } = member.assetsAndIncome;
          const assetsAndIncomeId = buildNestedKey('household', 'members', index, 'assetsAndIncome');
          const validatorFn = validateIncomeSchema(household.members, index);

          return (
            <Wizard.Step
              header={t(`${buildNestedKey(sectionName, modelName, 'header')}`, { firstName })}
              registerStep={registerStep}
              modelName={modelName}
              onNext={updateMemberIncome}
              validate={validatorFn}
            >
              <FormikFieldGroup
                labelText={t(buildNestedKey(sectionName, modelName, 'incomeSources', 'label'), {
                  firstName,
                  benefitStartDate: disaster.benefit_begin_date,
                  benefitEndDate: disaster.benefit_end_date
                })}
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
                        comboName: `${assetsAndIncomeId}.incomeSources.${name}.value`,
                        name: `${assetsAndIncomeId}.incomeSources.${name}.applicable`,
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
export default withMachineContext(withRouter(withLocale(Income)));
