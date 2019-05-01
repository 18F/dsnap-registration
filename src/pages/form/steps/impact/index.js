import React from 'react';
import { connect } from 'formik';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import FormikField, { FormikFieldGroup } from 'components/formik-field';
import YesNoField from 'components/yes-no-field';
import ComboField from 'components/combo-field';
import { buildNestedKey } from 'utils';
import { getDisaster } from 'models/disaster';
import impactSchema from 'schemas/impact';

const modelName = 'otherExpenses';

class AdverseEffects extends React.Component {
  setExpenseValues = () => {
    const { formik } = this.props;
    const { values } = formik;;

    const expenseForReview = Object.entries(values.impact.otherExpenses).reduce((memo, [key, value]) => ({
      ...memo,
      [key]: {
        applicable: true,
        value: value.value || '0',
      }
    }), {});

    return {
      impact: {
        ...values.impact,
        otherExpenses: expenseForReview
      }
    };
  }

  render() {
    const { handleChange, sectionName, registerStep, t, formik } = this.props;
    const { impact, disasters, basicInfo } = formik.values;
    const disaster = getDisaster(disasters, basicInfo.disasterId);

    return (
      <Wizard.Step
        header={t(`${buildNestedKey(sectionName, 'header')}`)}
        registerStep={registerStep}
        modelName={modelName}
        onNext={this.setExpenseValues}
        validationSchema={impactSchema}
      >
        <YesNoField
          labelText={t('impact.buyFood.label', {
            benefitStartDate: disaster.benefit_begin_date,
            benefitEndDate: disaster.benefit_end_date
          })}
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
          labelText={t(buildNestedKey(sectionName, modelName, 'label'), {
            benefitStartDate: disaster.benefit_begin_date,
            benefitEndDate: disaster.benefit_end_date
          })}
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
      </Wizard.Step>
    )
  }
}

export { AdverseEffects }
export default connect(withLocale(AdverseEffects));
