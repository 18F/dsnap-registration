import React from 'react';
import { withRouter } from 'react-router-dom';
import FormikField, { FormikFieldGroup } from 'components/formik-field';
import Wizard from 'components/wizard';
import withLocale from 'components/with-locale';
import Loading from 'components/loading';
import { getCounties, getDisasters } from 'models/disaster';
import { getError } from 'models/error';
import ErrorAlert from 'components/error-alert';

class PreRegistrationPage extends React.Component {
  renderError(maybeErrors) {
    if (getError(maybeErrors)) {
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
  <Wizard.Step
    registerStep={registerStep}
    modelName="preregistration"
    header={t('preregistration.header')}
  >
    <Wizard.Context>
      {({ disasters, basicInfo }) => {
        return (
          <React.Fragment>
          <FormikFieldGroup
            labelText={t('preregistration.disaster.label')}
            fields={getDisasters(disasters).map((disaster, index) => ({
              type: 'radio',
              name: `basicInfo.disasterIndex`,
              labelText: disaster.title,
              onChange: handleChange,
              radioValue: String(index),
              id: `basicInfo.disasterIndex.${index}`
            }))}
          />
          { !basicInfo.disasterIndex ? null :
            <FormikField
              name="basicInfo.disasterCounty"
              onChange={handleChange}
              labelText={t('preregistration.disasterCounty.label')}
              type="select"
              options={
                getCounties(disasters, Number(basicInfo.disasterIndex), 0)
                  .map(name => ({ text: name, value: name }))
              }
            />
          }   
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
          </React.Fragment>
        )
      }}
    </Wizard.Context>
  </Wizard.Step>
);

const PreRegistrationStep = withLocale(Step);

export { PreRegistrationStep };

export default withRouter(withLocale(PreRegistrationPage));
