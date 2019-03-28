import React from 'react';
import { withRouter } from 'react-router-dom';
import FormikField, { FormikFieldGroup } from 'components/formik-field';
import Wizard from 'components/wizard';
import withLocale from 'components/with-locale';
import Loading from 'components/loading';
import { getCounties, getDisasters } from 'models/disaster';
import { getError } from 'models/error';
import ErrorAlert from 'components/error-alert';
import preRegistrationSchema from 'schemas/pre-registration';

class PreRegistrationPage extends React.Component {
  renderError(maybeErrors) {
    if (getError(maybeErrors, 'server')) {
      return (
        <ErrorAlert
          text={this.props.t('preregistration.disaster.error.server')}
        />
      );
    }

    return null;
  }
  render() {
    const { t, ...rest } = this.props;
    
    return (      
      <Wizard.Context>
        {({ errors }) => {
          return (
            <React.Fragment>
              { this.renderError(errors) }
              <Loading message={t('general.loading')}>
                <Wizard.Section name="preregistration" { ...rest }>
                  { this.props.children }
                </Wizard.Section>
              </Loading>
            </React.Fragment>
          );
        }}
      </Wizard.Context>
    );
  }
}

const Step = ({ registerStep, handleChange, t }) => (
  <Wizard.Context>
    {({ disasters, basicInfo }) => {
      const disasterCounties = getCounties(disasters, Number(basicInfo.disasterIndex), 0);

      return (
        <Wizard.Step
          registerStep={registerStep}
          modelName="preregistration"
          header={t('preregistration.header')}
          validationSchema={preRegistrationSchema(disasterCounties)}
        >
          <FormikFieldGroup
            labelText={t('preregistration.disaster.label')}
            fields={getDisasters(disasters).map((disaster) => ({
              type: 'radio',
              name: `basicInfo.disasterIndex`,
              labelText: disaster.title,
              explanation: disaster.description,
              onChange: handleChange,
              radioValue: String(disaster.id),
              id: `basicInfo.disasterIndex.${disaster.id}`
            }))}
          />  
          { !basicInfo.disasterIndex ? null :
            <FormikField
              name="basicInfo.disasterCounty"
              onChange={handleChange}
              labelText={t('preregistration.disasterCounty.label')}
              type="select"
              options={
                disasterCounties.map(name => ({ text: name, value: name }))
              }
            />
          }
          <FormikFieldGroup
            showError={false}
            labelText={t('preregistration.storage.label')}
            name="config.useLocalStorage"
            fields={[
              {
                type: 'radio',
                labelText: t('preregistration.storage.confirm.label'),
                explanation: t('preregistration.storage.confirm.explanation'),
                onChange: handleChange,
                radioValue: 'true',
                groupClassName: 'grid-col-6',
              },
              {
                type: 'radio',
                labelText: t('preregistration.storage.deny.label'),
                explanation: t('preregistration.storage.deny.explanation'),
                onChange: handleChange,
                radioValue: 'false',
                groupClassName: 'grid-col-6', 
              }
            ]}
          />
        </Wizard.Step>
      )
    }}  
  </Wizard.Context>
);

const PreRegistrationStep = withLocale(Step);

export { PreRegistrationStep };

export default withRouter(withLocale(PreRegistrationPage));
