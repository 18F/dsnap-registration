import React from 'react';
import { withRouter } from 'react-router-dom';
import withLocale from 'components/with-locale';
import { withMachineContext } from 'components/fsm';
import Wizard from 'components/wizard';
import FormikField, { FormikRadioGroup, FormikFieldDateGroup } from 'components/formik-field';
import SecurityAlert from 'components/security-alert';
import { buildNestedKey } from 'utils';
import { updateCurrentMemberIndex } from 'models/household';
import { validateIdentitySchema } from 'schemas/identity';
import { helpers } from 'locales';

const modelName = 'memberDetails';
const incrementCurrentMember = ({ household }) => ({
  household: updateCurrentMemberIndex(household)
});

class MemberDetails extends React.Component {
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
    const { handleChange, sectionName, t, registerStep } = this.props;

    return (
      <Wizard.Context>
        {(values) => {
          const household = values.household;
          const memberIndex = household.currentMemberIndex + 1;
          const member = household.members[memberIndex];

          if (!member) {
            return null;
          }

          const firstName = member.name.firstName;
    
          return (
            <Wizard.Step
              header={t(`${buildNestedKey(sectionName, modelName, 'header')}`, { firstName })}
              modelName={modelName}
              registerStep={registerStep}
              onNext={incrementCurrentMember}
              validate={validateIdentitySchema(member, memberIndex)}
            >
              <React.Fragment>
                <FormikFieldDateGroup
                  inline
                  name="dob"
                  showError={false}
                  labelText={t(`${buildNestedKey(sectionName, modelName, 'dob', 'label')}`, { firstName })}
                  explanation={t('identity.personalInfo.dob.explanation')}
                  fields={[{
                    name: `${sectionName}.members.${memberIndex}.dob.month`,
                    labelText: t('identity.personalInfo.dob.month'),
                    onChange: handleChange,
                  }, {
                    name: `${sectionName}.members.${memberIndex}.dob.day`,
                    labelText: t('identity.personalInfo.dob.day'),
                    onChange: handleChange
                  }, {
                    name: `${sectionName}.members.${memberIndex}.dob.year`,
                    labelText: t('identity.personalInfo.dob.year'),
                    onChange: handleChange,
                    className: 'desktop:grid-col-9'
                  }]}
                />
                <FormikRadioGroup
                  inline
                  options={[{
                    label: t('identity.personalInfo.sex.options.male'),
                    value: "male"
                  },
                  {
                    label: t('identity.personalInfo.sex.options.female'),
                    value: "female"
                  }]}
                  name={buildNestedKey(sectionName, 'members', memberIndex, 'sex')}
                  labelText={t(`${buildNestedKey(sectionName, modelName, 'sex', 'label')}`, { firstName })}
                  explanation={t('general.leaveBlank')}
                />
                <FormikRadioGroup
                  name={`household.members.${memberIndex}.ethnicity`}
                  onChange={handleChange}
                  labelText={t('household.memberDetails.ethnicity.label', { firstName })}
                  explanation={t('general.leaveBlank')}
                  options={helpers.getEnumeratedValues('general.ethnicity.options')}
                />
                <FormikRadioGroup
                  name={`household.members.${memberIndex}.race`}
                  onChange={handleChange}
                  labelText={t('household.memberDetails.race.label', { firstName })}
                  explanation={t('general.leaveBlank')}
                  options={helpers.getEnumeratedValues('general.race.options')}
                />
                <FormikField
                  type="mask"
                  pattern="XXX-XX-XXXX"
                  delimiter="-"
                  name={buildNestedKey(sectionName, 'members', memberIndex, 'ssn')}
                  labelText={t(`${buildNestedKey(sectionName, modelName, 'ssn', 'label')}`, { firstName })}
                  explanation={t('identity.personalInfo.ssn.explanation')}
                  onChange={handleChange}
                />
              </React.Fragment>
              <SecurityAlert />
            </Wizard.Step>
          );
        }}
      </Wizard.Context>
    );
  }
}

export default withMachineContext(withRouter(withLocale(MemberDetails)));
