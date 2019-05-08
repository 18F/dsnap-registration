import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import { FormikFieldGroup } from 'components/formik-field';
import CurrencyField from 'components/currency-input';
import { buildNestedKey } from 'utils';
import { getMembers } from 'models/household';
import { hasIncome } from 'models/assets-and-income';
import { getIncome } from 'models/person';
import { getDisaster, getBeginDate, getEndDate } from 'models/disaster';
import { getFirstName, getLastName } from 'models/person';
import SecurityAlert from 'components/security-alert';
import Collapsible from 'components/collapsible';
import assetsSchema from 'schemas/assets';

const modelName = 'otherExpenses';

const setMembersWithIncome = ({ resources, household, members, basicInfo }) => () => ({
  household: {
    ...household,
    members
  },
  resources: {
    ...resources,
    membersWithIncome: members.reduce((memo, member, index) => {
      if (hasIncome(getIncome(member))) {
        memo.push(index);
      }

      return memo;
    }, [])
  },
  basicInfo
});

class Assets extends React.Component {
  render() {
    const { handleChange, sectionName, registerStep, t } = this.props;

    return (
      <Wizard.Context>
        {({ basicInfo, household, disasters, resources }) => {
          const members = getMembers(household);
          const disaster = getDisaster(disasters, basicInfo.disasterId);

          return (
            <Wizard.Step
              header={t(`${buildNestedKey(sectionName, 'header')}`)}
              registerStep={registerStep}
              modelName={modelName}
              onNext={setMembersWithIncome({ resources, household, members, basicInfo })}
              validationSchema={assetsSchema}
            >
              <CurrencyField
                labelText={t(buildNestedKey(sectionName, 'moneyOnHand', 'label'), {
                  benefitBeginDate: getBeginDate(disaster)
                })}
                explanation={t(buildNestedKey(sectionName, 'moneyOnHand', 'explanation'), {
                  benefitStartDate: getBeginDate(disaster),
                  benefitEndDate: getEndDate(disaster)
                })}
                name="basicInfo.moneyOnHand"
                onChange={handleChange}
                className="grid-col-6"
              />
              <FormikFieldGroup
                labelText={t(buildNestedKey(sectionName, 'incomeRecipients', 'label'), {
                  benefitStartDate: getBeginDate(disaster),
                  benefitEndDate: getEndDate(disaster)
                })}
                fieldGroupClassname="margin-y-0"
                fields={
                  members.map((member, index) => {
                    return {
                      type: 'checkbox',
                      name: buildNestedKey('household', 'members', index, 'assetsAndIncome', 'hasIncome'),
                      onChange: handleChange,
                      labelText: `${getFirstName(member)} ${getLastName(member)}`,
                      quietLabel: true,
                    }
                  })
                }
              />
              <Collapsible
                header={t(buildNestedKey(sectionName, 'whyWeAsk', 'header'))}
                body={t(buildNestedKey(sectionName, 'whyWeAsk', 'copy'))}
              />
              <SecurityAlert />
            </Wizard.Step>
          )
        }}
      </Wizard.Context>
    )
  }
}

export { Assets }
export default withLocale(Assets);
