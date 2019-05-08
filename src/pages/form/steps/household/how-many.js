import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';
import householdCountSchema from 'schemas/household-count';
import { buildNestedKey } from 'utils';
import { updateHouseholdMembers } from 'models/household';
import { getDisaster, getBeginDate } from 'models/disaster';

const modelName = 'count';
const addToHousehold = household => values => {
  const nextMemberCount = Number(values.household.numMembers);

  return {
    household: { ...updateHouseholdMembers(household, nextMemberCount - 1) }
  };
};

class HowMany extends React.Component {
  buildOptions() {
    const { t } = this.props;
    const initial = [{ text: t('household.count.justMeOption'), value: 1 }]

    return initial.concat(Array.apply(null, { length: 12 })
      .map((_, index) => ({
        text: `${index + 2} ${t('general.people')}`,
        value: index + 2
      })));
  }

  render() {
    const { handleChange, sectionName, t, registerStep } = this.props;

    return (
      <Wizard.Context>
        { ({ household, basicInfo, disasters }) => (
          <Wizard.Step
            header={t(`${buildNestedKey(sectionName, modelName, 'header')}`)}
            modelName='numMembers'
            registerStep={registerStep}
            validationSchema={householdCountSchema}
            onNext={addToHousehold(household)}
          >
            <FormikField
              labelText={t(buildNestedKey(sectionName, modelName, 'label'), {
                benefitStartDate: getBeginDate(getDisaster(disasters, basicInfo.disasterId))
              })}
              onChange={handleChange}
              name="household.numMembers"
              className="desktop:grid-col-1"
              type="select"
              options={this.buildOptions()}
            />
          </Wizard.Step>
        )}
      </Wizard.Context>
    );
  }
}
export default withLocale(HowMany);
