import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField, {
  FormikInlineFieldGroup,
  FormikRadioGroup
} from 'components/formik-field';
import { buildNestedKey } from 'utils';
import SecurityAlert from 'components/security-alert';
import Collapsible from 'components/collapsible'
import { helpers } from 'locales';

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
    
    return (
      <Wizard.Step
        header={t(`${buildNestedKey(sectionName, modelName)}.header`)}
        registerStep={this.props.registerStep}
        modelName={modelName}
      >
        <FormikInlineFieldGroup
          labelText={t(`${buildNestedKey(sectionName, modelName)}.dob.label`)}
          explanation={t(`${buildNestedKey(sectionName, modelName)}.dob.explanation`)}
          fields={[{
            name: `${sectionName}.${modelName}.dob.month`,
            onChange: handleChange,
            labelText: t(`${buildNestedKey(sectionName, modelName)}.dob.month`),
          }, {
            name: `${sectionName}.${modelName}.dob.day`,
            labelText: t(`${buildNestedKey(sectionName, modelName)}.dob.day`),
            onChange: handleChange
          }, {
            name: `${sectionName}.${modelName}.dob.year`,
            labelText: t(`${buildNestedKey(sectionName, modelName)}.dob.year`),
            onChange: handleChange,
          }]}
        />
        <FormikField
          name={`${sectionName}.${modelName}.stateId`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, modelName)}.stateId.label`)}
          explanation={t(`${buildNestedKey(sectionName, modelName)}.stateId.explanation`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.ssn`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, modelName)}.ssn.label`)}
          explanation={t(`${buildNestedKey(sectionName, modelName)}.ssn.explanation`)}
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
          options={[{
            label: t(buildNestedKey(sectionName, modelName, 'sex', 'options', 'male')),
            value: "male"
          },
          {
            label: t(buildNestedKey(sectionName, modelName, 'sex', 'options', 'female')),
            value: "female"
          }]}
          name={`${sectionName}.${modelName}.sex`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, modelName, 'sex', 'label')}`)}
          explanation={t(`${buildNestedKey(sectionName, modelName, 'sex', 'explanation')}`)}
        />
        <FormikField
          name={`${sectionName}.${modelName}.race`}
          onChange={handleChange}
          labelText={t(`${buildNestedKey(sectionName, modelName)}.race.label`)}
        />
        <SecurityAlert />
      </Wizard.Step>
    );
  }
}

export { PersonalInfo };
export default withLocale(PersonalInfo);
