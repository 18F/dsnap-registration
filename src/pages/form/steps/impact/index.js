import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField, {
  FormikFieldGroup,
  FormikRadioGroup
} from 'components/formik-field';
import YesNoField from 'components/yes-no-field';
import ComboField from 'components/combo-field';
import { buildNestedKey } from 'utils';

const modelName = 'otherExpenses';

class AdverseEffects extends React.Component {
  render() {
    const { handleChange, sectionName, registerStep, t } = this.props;

    return (
      <Wizard.Context>
        {({ household, impact }) => {
          return (
            <Wizard.Step
              header={t(`${buildNestedKey(sectionName, 'header')}`)}
              registerStep={registerStep}
              modelName={modelName}
            >
              <YesNoField
                sectionName={sectionName}
                fieldName="buyFood"
                onChange={handleChange}
              />
              <YesNoField
                sectionName={sectionName}
                fieldName="lostOrInaccessibleIncome"
                onChange={handleChange}
              />
              <YesNoField
                sectionName={sectionName}
                fieldName="inaccessibleMoney"
                onChange={handleChange}
              />
              <FormikFieldGroup
                labelText={t(buildNestedKey(sectionName, modelName, 'label'))}
                onChange={handleChange}
                Component={ComboField}
                fields={
                  Object.entries(impact.otherExpenses).map(([name, values]) => {
                    return {
                      type: 'checkbox',
                      comboName: buildNestedKey(sectionName, modelName, name, 'value'),
                      name: buildNestedKey(sectionName, modelName, name, 'applicable'),
                      onChange: handleChange,
                      labelText: t(buildNestedKey(sectionName, modelName, name)),
                      quietLabel: true,
                      explanation: t(buildNestedKey(sectionName, modelName, 'explanation')),
                    }
                  })
                }
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
