import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField, { FormikFieldGroup } from 'components/formik-field';
import YesNoField from 'components/yes-no-field';
import ComboField from 'components/combo-field';
import { buildNestedKey } from 'utils';

const modelName = 'otherExpenses';

class AdverseEffects extends React.Component {
  render() {
    const { handleChange, sectionName, registerStep, t } = this.props;

    return (
      <Wizard.Context>
        {({ impact }) => {
          return (
            <Wizard.Step
              header={t(`${buildNestedKey(sectionName, 'header')}`)}
              registerStep={registerStep}
              modelName={modelName}
            >
              <YesNoField
                labelText={t('impact.buyFood.label')}
                name="impact.buyFood"
                onChange={handleChange}
              />
              <YesNoField
                labelText={t('impact.lostOrInaccessibleIncome.label')}
                name="impact.lostOrInaccessibleIncome"
                onChange={handleChange}
              />
              <YesNoField
                labelText={t('impact.inaccessibleMoney.label')}
                name="impact.inaccessibleMoney"
                onChange={handleChange}
              />
              <FormikFieldGroup
                labelText={t(buildNestedKey(sectionName, modelName, 'label'))}
                onChange={handleChange}
                Component={ComboField}
                fieldGroupClassname="margin-y-0"
                fields={
                  Object.entries(impact.otherExpenses).map(([name, values]) => {
                    return {
                      prefix: '$',
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
              <FormikField
                labelText={t(buildNestedKey(sectionName, modelName, 'none'))}
                name={buildNestedKey(sectionName, 'noOtherExpenses')}
                type="checkbox"
                onChange={handleChange}
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
