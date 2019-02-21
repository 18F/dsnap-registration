import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField, {
  FormikFieldGroup,
  FormikRadioGroup
} from 'components/formik-field';
import YesNoField from 'components/yes-no-field';
import { buildNestedKey } from 'utils';

const modelName = 'impact';

class AdverseEffects extends React.Component {
  render() {
    const { handleChange, sectionName, registerStep, t } = this.props;

    return (
      <Wizard.Context>
        {({ household }) => {
          return (
            <Wizard.Step
              header={t(`${buildNestedKey(sectionName, 'header')}`)}
              registerStep={registerStep}
              modelName={modelName}
            >
              <YesNoField
                sectionName={sectionName}
                fieldName="buyFood"
              />
              <YesNoField
                sectionName={sectionName}
                fieldName="lostOrInaccessibleIncome"
              />
              <YesNoField
                sectionName={sectionName}
                fieldName="inaccessibleMoney"
              />
            </Wizard.Step>
          )
        }}
      </Wizard.Context>
    )
  }
}

export { AdverseEffects }
export default withLocale(AdverseEffects);
