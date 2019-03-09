import React from 'react';
import { withRouter } from 'react-router-dom';
import FormikField, { FormikFieldGroup } from 'components/formik-field';
import Wizard from 'components/wizard';
import withLocale from 'components/with-locale';
import Loading from 'components/loading';
import { getCounties, getDisasters } from 'models/disaster';

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
    {({ disasters, basicInfo }) => {
      return (
        <Wizard.Step
          registerStep={registerStep}
          modelName="preregistration"
          header={t('preregistration.header')}
        >
          <Loading message={t('general.loading')}>
            <React.Fragment>
              <FormikFieldGroup
                labelText={t('preregistration.disaster.label')}
                fields={getDisasters(disasters).map((disaster, index) => ({
                  type: 'radio',
                  name: `basicInfo.disasterIndex`,
                  labelText: disaster.title,
                  onChange: handleChange,
                  radioValue: String(index)
                }))}
              />
              { !basicInfo.disasterIndex ? null :
                <FormikField
                  name='basicInfo.disasterCounty'
                  onChange={handleChange}
                  labelText={t('preregistration.disasterCounty.label')}
                  type="select"
                  options={
                    [{ text: 'Select a county', value: ''}]
                      .concat(getCounties(disasters, Number(basicInfo.disasterIndex), 0)
                      .map(name => ({ text: name, value: name }))
                  )}
                />
              }
            </React.Fragment>
          </Loading>
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
        </Wizard.Step>
      );
    }}
  </Wizard.Context>
);

const PreRegistrationStep = withLocale(Step);


export { PreRegistrationStep };

export default withRouter(PreRegistrationPage);
