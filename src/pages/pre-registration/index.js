import React from 'react';
import { withRouter } from 'react-router-dom';
import FormikField, { FormikFieldGroup } from 'components/formik-field';
import Wizard from 'components/wizard';
import withLocale from 'components/with-locale';

class PreRegistrationPage extends React.Component {
  render() {
    const { t, ...rest } = this.props;
    
    return (
      <Wizard.Section name="preregistration" { ...rest }>
        { this.props.children }
      </Wizard.Section>
    );
  }
}

const Step = ({ registerStep, handleChange, t }) => (
  <Wizard.Context>
    {(values) => {
      return (
        <Wizard.Step
          registerStep={registerStep}
          modelName="preregistration"
          header={t('preregistration.header')}
        >
          <p className="font-sans-md">
            <b>{t('preregistration.storage.label')}</b>
          </p>
          <FormikFieldGroup
            fields={values.disasters.data.map((disaster, index) => ({
              type: 'radio',
              name: `basicInfo.disasterIndex`,
              labelText: disaster.title,
              onChange: handleChange,
              radioValue: String(index)
            }))}
          />       
          <FormikField
            type="radio"
            labelText={t('preregistration.storage.confirm.label')}
            explanation={t('preregistration.storage.confirm.explanation')}
            name="config.useLocalStorage"
            onChange={handleChange}
            radioValue={true}
            groupClassName="grid-col-6"
          />
          <FormikField
            type="radio"
            labelText={t('preregistration.storage.deny.label')}
            explanation={t('preregistration.storage.deny.explanation')}
            name="config.useLocalStorage"
            onChange={handleChange}
            radioValue={false}
            groupClassName="grid-col-6"
          />
        </Wizard.Step>
      );
    }}
  </Wizard.Context>
);

const PreRegistrationStep = withLocale(Step);


export { PreRegistrationStep };

export default withRouter(PreRegistrationPage);
