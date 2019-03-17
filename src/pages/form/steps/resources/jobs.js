import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';
import YesNoField from 'components/yes-no-field';
import { buildNestedKey } from 'utils';
import { getMembers, updateMemberAtIndex } from 'models/household';
import { getFirstName, hasOtherJobs } from 'models/person';
import { addJob } from 'models/assets-and-income';
import job from 'models/job';

const modelName = 'jobs';

const handleNext = (values) => () => {
  const { household, resources, newJob } = values;
  const members = getMembers(household);
  const index = resources.membersWithIncome[0];
  const member = members[index];
  // TODO: make jobs / other jobs not nested under member so
  // all these relationships dont have to be resolved here
  const nextMember = {
    ...member,
    assetsAndIncome: addJob(member.assetsAndIncome, newJob),
  };

  const nextHousehold = updateMemberAtIndex(household, index, nextMember);

  let nextState = {
    household: {
      ...nextHousehold
    },
    newJob: job(),
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
    const { handleChange, sectionName, registerStep, t } = this.props;
    return (
      <Wizard.Context>
        {(values) => {
          const { household, resources } = values;

          const members = getMembers(household);
          const index = resources.membersWithIncome[0] || 0;
          const member = members[index];
          const firstName = getFirstName(member);

          return (
            <Wizard.Step
              header={t(buildNestedKey(sectionName, modelName, 'header'), { firstName })}
              registerStep={registerStep}
              modelName={modelName}
              onNext={handleNext(values)}
            >
              <FormikField
                labelText={t(buildNestedKey(sectionName, modelName, 'employerName', 'label'))}
                name={buildNestedKey('newJob', 'employerName')}
                onChange={handleChange}
              />
              <FormikField
                labelText={t(buildNestedKey(sectionName, modelName, 'pay', 'label'), { firstName })}
                name={buildNestedKey('newJob', 'pay')}
                onChange={handleChange}
              />
              <YesNoField
                labelText={t(buildNestedKey(sectionName, modelName, 'stateAgency', 'label'))}
                name={buildNestedKey('newJob', 'isStateAgency')}
                onChange={handleChange}
              />              
              <YesNoField
                labelText={t(buildNestedKey(sectionName, modelName, 'otherJobs', 'label'), { firstName })}
                name={buildNestedKey('household', 'members', index, 'hasOtherJobs')}
                onChange={handleChange}
              />
            </Wizard.Step>
          )
        }}
      </Wizard.Context>
    )
  }
}

export { Jobs }
export default withLocale(Jobs);
