import React from 'react';
import { connect } from 'formik';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';
import YesNoField from 'components/yes-no-field';
import { buildNestedKey } from 'utils';
import { getMembers, updateMemberAtIndex } from 'models/household';
import { getFirstName, hasOtherJobs, getJobs } from 'models/person';
import { getDisaster, getBeginDate, getEndDate } from 'models/disaster';
import { jobSchemaValidator } from 'schemas/job';

const modelName = 'jobs';

const handleNext = (values) => {
  const { household, resources } = values;
  const members = getMembers(household);
  const index = resources.membersWithIncome[0];
  const member = members[index];
  const nextHousehold = updateMemberAtIndex(household, index, member);

  let nextState = {
    household: {
      ...nextHousehold
    },
  };

  if (!hasOtherJobs(member)) {
    nextState = {
      ...nextState,
      resources: {
        membersWithIncome: values.resources.membersWithIncome.slice(1)
      }
    };
  };

  return {
    ...nextState,
  };
};

class Jobs extends React.Component {
  render() {
    const { handleChange, sectionName, registerStep, t, formik } = this.props;
    const { values } = formik;
    const { household, resources, disasters, basicInfo } = values;
    const disaster = getDisaster(disasters, basicInfo.disasterIndex);
    const members = getMembers(household);
    const index = resources.membersWithIncome[0] || 0;
    const member = members[index];
    const firstName = getFirstName(member);
    const memberJobs = getJobs(member);
    const jobIndex = memberJobs.length <= 1 ? 0 : memberJobs.length - 1;
    const jobKey = buildNestedKey('household', 'members', index, 'assetsAndIncome', 'jobs', jobIndex);

    const jobValidationFn = jobSchemaValidator({
      ...memberJobs[jobIndex],
      hasOtherJobs: member.hasOtherJobs
    }, jobKey, index);

    return (
      <Wizard.Step
        header={t(buildNestedKey(sectionName, modelName, 'header'), { firstName })}
        registerStep={registerStep}
        modelName={modelName}
        onNext={handleNext}
        validate={jobValidationFn}
      >
        <FormikField
          labelText={t(buildNestedKey(sectionName, modelName, 'employerName', 'label'))}
          name={`${jobKey}.employerName`}
          onChange={handleChange}
          eager
        />
        <FormikField
          labelText={t(buildNestedKey(sectionName, modelName, 'pay', 'label'), {
            firstName,
            startDate: getBeginDate(disaster),
            endDate: getEndDate(disaster)
          })}
          name={`${jobKey}.pay`}
          onChange={handleChange}
          eager
        />
        <YesNoField
          labelText={t(buildNestedKey(sectionName, modelName, 'stateAgency', 'label'))}
          name={`${jobKey}.isDsnapAgency`}
          onChange={handleChange}
          eager
        />              
        <YesNoField
          labelText={t(buildNestedKey(sectionName, modelName, 'otherJobs', 'label'), { firstName })}
          name={buildNestedKey('household', 'members', index, 'hasOtherJobs')}
          onChange={handleChange}
          eager
        />
      </Wizard.Step>
    );
  }
}

export { Jobs }
export default connect(withLocale(Jobs));
