import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField from 'components/formik-field';
import { buildNestedKey } from 'utils';

class SignAndSubmit extends React.Component {
  render() {
    const { handleChange, sectionName, registerStep, t } = this.props;

    return (
      <Wizard.Context>
        {({ impact }) => {
          return (
            <Wizard.Step
              header={t('submit.header')}
              registerStep={registerStep}
              modelName="submit"
            >
            </Wizard.Step>
          )
        }}
      </Wizard.Context>
    )
  }
}

export { SignAndSubmit }
export default withLocale(SignAndSubmit);
