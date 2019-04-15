import React from 'react';
import { yupToFormErrors } from 'formik';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField, { FormikRadioGroup } from 'components/formik-field';
import ErrorAlert from 'components/error-alert';
import { getFirstName, getMiddleName, getLastName } from 'models/person';
import { getError } from 'models/error';
import { getApplicant } from 'models/household';
import submitSchema from 'schemas/submit';

class SignAndSubmit extends React.Component {
  handleValidations = ({ household, submit }) => {    
    const applicant = getApplicant(household);
    const firstName = getFirstName(applicant).trim().toLowerCase();
    const middleName = getMiddleName(applicant).trim().toLowerCase();
    const lastName = getLastName(applicant).trim().toLowerCase();
    const customerName = [firstName, middleName, lastName].filter(name => name).join(' ');

    const values = {
      submit: {
        fullName: customerName,
        ...submit,
      },
    };

    try {
      submitSchema.validateSync(values, { abortEarly: false });
    } catch(e) {
      return yupToFormErrors(e);
    }

    return {};
    
  }

  render() {
    const { handleChange, registerStep, t } = this.props;

    return (
      <Wizard.Context>
        {({ errors }) => {
          return (
            <Wizard.Step
              header={t('submit.header')}
              registerStep={registerStep}
              modelName="submit"
              validate={this.handleValidations}
            >
              <ErrorAlert text={getError(errors, 'server') ? t('submit.error') : null} />
              <h2>{t('submit.lede')}</h2>
              <div style={{overflow: 'auto', height: '200px' }} className="border-1px padding-4">
                { t('submit.eula') }
              </div>
              <FormikRadioGroup
                inline
                showError={false}
                options={[{
                  label: t('submit.agree'),
                  value: 'true'
                }, {
                  label: t('submit.disagree'),
                  value: 'false'
                }]}
                onChange={handleChange}
                name="submit.acceptedTerms"
              />
              <FormikField
                labelText={t('submit.label')}
                name="submit.signature"
                onChange={handleChange}
              />
            </Wizard.Step>
          )
        }}
      </Wizard.Context>
    )
  }
}

export { SignAndSubmit }
export default withLocale(SignAndSubmit);
