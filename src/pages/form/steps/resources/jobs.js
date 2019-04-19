import React from 'react';
import { connect } from 'formik';
import { withRouter } from 'react-router-dom';
import { withMachineContext } from 'components/fsm';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';
import YesNoField from 'components/yes-no-field';
import { buildNestedKey } from 'utils';
import { getMembers, updateMemberAtIndex } from 'models/household';
import { getFirstName, hasOtherJobs, getJobs, getIncome } from 'models/person';
import { getDisaster, getBeginDate, getEndDate } from 'models/disaster';
import { getCurrentResourceHolderId } from 'models/resources';  
import { jobSchemaValidator } from 'schemas/job';

const modelName = 'jobs';

const handleNext = (values) => {
  const { household, resources } = values;
  const members = getMembers(household);
  const index = getCurrentResourceHolderId(resources);
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
        ...resources,
        currentMemberIndex: values.resources.currentMemberIndex + 1
      }
    };
  };

  return {
    ...nextState,
  };
};

class Jobs extends React.Component {
  unlisten = null

  componentDidMount() {
    this.unlisten = this.props.history.listen((event, action) => {
      return setTimeout(() => {
        return this.rewindJobIndex(event, action);
      }, 0);
    });
  }

  componentWillUnmount() {
    setTimeout(() => this.unlisten(), 0);
  }

  rewindJobIndex = (_, action) => {
    if (action === 'POP') {
      this.props.fsmTransition({
        command: 'DECREMENT_CURRENT_JOB_INDEX',
      });
    }
  }

  render() {
    const { handleChange, sectionName, registerStep, t, formik } = this.props;
    const { values } = formik;
    const { household, resources, disasters, basicInfo } = values;
    const disaster = getDisaster(disasters, basicInfo.disasterId);
    const members = getMembers(household);
    const index =  getCurrentResourceHolderId(resources);
    const member = members[index];
    const firstName = getFirstName(member);
    const memberJobs = getJobs(member);
    const { currentJobIndex } = getIncome(member);
    const jobKey = buildNestedKey('household', 'members', index, 'assetsAndIncome', 'jobs', currentJobIndex);

    const jobValidationFn = jobSchemaValidator({
      ...memberJobs[currentJobIndex],
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
        <span>eediting job {currentJobIndex + 1}</span>
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
export default withMachineContext(withRouter(connect(withLocale(Jobs))));
