import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'formik';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField, {
  FormikRadioGroup,
  FormikFieldDateGroup
} from 'components/formik-field';
import { buildNestedKey } from 'utils';
import SecurityAlert from 'components/security-alert';
import Collapsible from 'components/collapsible'
import { helpers } from 'locales';
import { getApplicant } from 'models/household';
import { validateIdentitySchema } from 'schemas/identity';

class PersonalInfo extends React.Component {
  static modelName = 'personalInfo'

  static propTypes = {
    handleChange: PropTypes.func,
    registerStep: PropTypes.func,
    sectionName: PropTypes.string,
  }

  render() {
    const { handleChange, sectionName, t } = this.props;
    const { modelName } = PersonalInfo;
    const { formik } = this.props
    const applicant = getApplicant(formik.values.household);
    
    return (
      <Wizard.Step
        header={t(buildNestedKey(sectionName, modelName, 'header'))}
        registerStep={this.props.registerStep}
        modelName={modelName}
        validate={validateIdentitySchema(applicant, 0)}
      >
        <FormikFieldDateGroup
          name="dob"
          showError={false}
          inline
          labelText={t(buildNestedKey(sectionName, modelName, 'dob', 'label'))}
          explanation={t(buildNestedKey(sectionName, modelName, 'dob', 'explanation'))}
          fields={[{
            name: 'household.members.0.dob.month',
            onChange: handleChange,
            labelText: t(buildNestedKey(sectionName, modelName, 'dob', 'month')),
          }, {
            name: 'household.members.0.dob.day',
            labelText: t(buildNestedKey(sectionName, modelName, 'dob', 'day')),
            onChange: handleChange
          }, {
            name: 'household.members.0.dob.year',
            labelText: t(buildNestedKey(sectionName, modelName, 'dob', 'year')),
            onChange: handleChange,
            className: 'desktop:grid-col-9'
          }]}
        />
        <FormikField
          name="basicInfo.stateId"
          onChange={handleChange}
          labelText={t(buildNestedKey(sectionName, modelName, 'stateId', 'label'))}
          explanation={t(buildNestedKey(sectionName, modelName, 'stateId', 'explanation'))}
        />
        <FormikField
          name="household.members.0.ssn"
          type="mask"
          pattern="XXX-XX-XXXX"
          delimiter="-"
          onChange={handleChange}
          labelText={t(buildNestedKey(sectionName, modelName, 'ssn', 'label'))}
          explanation={t(buildNestedKey(sectionName, modelName, 'ssn', 'explanation'))}
        />
        <div className="margin-y-4">
          <Collapsible
            name="ssn"
            header={t(buildNestedKey(sectionName, modelName, 'whyAsk', 'header'))}
          >
            <div>              
              {
                helpers.renderLineBreaksT(
                  buildNestedKey(sectionName, modelName, 'whyAsk', 'copy')
                )
              }
            </div>
          </Collapsible>
        </div>
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
          name="household.members.0.sex"
          onChange={handleChange}
          labelText={t(buildNestedKey(sectionName, modelName, 'sex', 'label'))}
          explanation={t(buildNestedKey(sectionName, modelName, 'sex', 'explanation'))}
        />
        <FormikRadioGroup
          name="household.members.0.ethnicity"
          onChange={handleChange}
          labelText={t('identity.personalInfo.ethnicity.label')}
          explanation={t('general.leaveBlank')}
          options={helpers.getEnumeratedValues('general.ethnicity.options')}
        />
        <FormikRadioGroup
          name="household.members.0.race"
          onChange={handleChange}
          labelText={t('identity.personalInfo.race.label')}
          explanation={t('general.leaveBlank')}
          options={helpers.getEnumeratedValues('general.race.options')}
        />
        <SecurityAlert />
      </Wizard.Step>
    );
  }
}

export { PersonalInfo };
export default connect(withLocale(PersonalInfo));
