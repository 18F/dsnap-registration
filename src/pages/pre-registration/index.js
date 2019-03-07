import React from 'react';
import { Formik } from 'formik';
import FormikField from 'components/formik-field';
import { MachineConsumer, MachineState } from 'components/fsm';
import Wizard from 'components/wizard';
import withLocale from 'components/with-locale';

class PreRegistrationPage extends React.Component {
  render() {
    const { t } = this.props;
    
    return (
      <Wizard.Section>
        { this.props.children }
      </Wizard.Section>
    );
  }
}

const Step = ({ registerStep, handleChange, t }) => (
  <Wizard.Context>
  {({ config }) => {
    return (
      <Wizard.Step
        registerStep={registerStep}
        modelName="preregistration"
      >

    
        
          <p className="font-sans-md">
            <b>{t('preregistration.storage.label')}</b>
          </p>
          <FormikField
            type="radio"
            labelText={t('preregistration.storage.confirm.label')}
            explanation={t('preregistration.storage.confirm.explanation')}
            name="config.useLocalStorage"
            onChange={handleChange}
            radioValue={true}
          />
          <FormikField
            type="radio"
            labelText={t('preregistration.storage.deny.label')}
            name="config.useLocalStorage"
            onChange={handleChange}
            radioValue={false}
          />
          </Wizard.Step>    
      );
    }}
  
    
  </Wizard.Context>
);

const PreRegistrationStep = withLocale(Step);


export { PreRegistrationStep };

export default withLocale(PreRegistrationPage);
