import React from 'react';
import withLocale from 'components/with-locale';
import withUpdateable from 'components/with-updateable';
import CurrencyInput from 'components/currency-input';
import ReviewSubSection from 'components/review-subsection';
import ReviewTable from 'components/review-table';
import { getExpenseTotal, getExpenses } from 'models/impact';


class DisasterExpensesReview extends React.Component {
  getExpenses() {
    const { formik, handleChange, t }= this.props;
    const { impact } = formik.values;
    const expenseFields = Object.entries(getExpenses(impact)).map(([key, expense]) => ({
      name: t(`impact.expenses.${key}`),
      data: `$${expense.value || 0}`,
      component: {
        props: {
          labelText: t(`impact.expenses.${key}`),
          name: `impact.otherExpenses.${key}.value`,
          onChange: handleChange
        },
        Component: CurrencyInput
      }
    }));


    return expenseFields.concat([
      {
        name: t('impact.otherExpenses.total'),
        data: `$${getExpenseTotal(impact)}`,
        readonly: true
      }
    ]);
  }

  render() {
    const { t } = this.props;
    
    return (
      <ReviewSubSection title={t('review.sections.impact')} onUpdate={this.props.handleUpdate}>
        {({ editing }) => {
          return (
            <ReviewTable
              editing={editing}
              primaryData={this.getExpenses()}
            />
          )
        }}
      </ReviewSubSection>
    );
  }
}

export default withUpdateable(withLocale(DisasterExpensesReview));
