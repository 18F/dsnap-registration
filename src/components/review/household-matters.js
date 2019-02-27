import React from 'react';
import withLocale from 'components/with-locale';
import withUpdateable from 'components/with-updateable';
import YesNoField from 'components/yes-no-field';
import CurrencyInput from 'components/currency-input';
import ReviewSubSection from 'components/review-subsection';
import ReviewTable from 'components/review-table';
import { getApplicant } from 'models/household';
import { getIncome } from 'models/person';
import { getLostFood, getLostIncome, getLostMoney } from 'models/impact';
import { getMoneyOnHand } from 'models/assets-and-income';


class HouseholdMattersReview extends React.Component {
  getHouseholdMoneyData() {
    const { formik, handleChange, t }= this.props;
    const { household, impact } = formik.values;

    return [
      {
        name: t('impact.buyFood.id'),
        data: t(`general.${getLostFood(impact) ? 'yes' : 'no'}`),
        component: {
          props: {
            labelText: t('impact.buyFood.label'),
            name: 'impact.buyFood',
            onChange: handleChange
          },
          Component: YesNoField 
        }
      },
      {
        name: t('impact.lostOrInaccessibleIncome.id'),
        data: t(`general.${getLostIncome(impact) ? 'yes' : 'no'}`),
        component: {
          props: {
            labelText: t('impact.inaccessibleMoney.label'),
            name: 'impact.lostOrInaccessibleIncome',
            onChange: handleChange
          },
          Component: YesNoField
        }
      },
      {
        name: t('impact.inaccessibleMoney.id'),
        data: t(`general.${getLostMoney(impact) ? 'yes' : 'no'}`),
        component: {
          props: {
            labelText: t('impact.lostOrInaccessibleIncome.label'),
            name: 'impact.inaccessibleMoney',
            onChange: handleChange
          },
          Component: YesNoField
        }
      },
      {
        name: t('resources.moneyOnHand.id'),
        data: `$${getMoneyOnHand(getIncome(getApplicant(household)))}`,
        component: {
          props: {            
            labelText: t('resources.moneyOnHand.id'),
            name: 'household.members.0.assetsAndIncome.moneyOnHand',
            handleChange: handleChange
          },
          Component: CurrencyInput
        }
      }
    ];
  }

  render() {
    const { t } = this.props;
    
    return (
      <ReviewSubSection title={t('review.sections.householdMatters')} onUpdate={this.props.handleUpdate}>
        {({ editing }) => {
          return (
            <ReviewTable
              editing={editing}
              primaryData={this.getHouseholdMoneyData()}
            />
          )
        }}
      </ReviewSubSection>
    );
  }
}

export default withUpdateable(withLocale(HouseholdMattersReview));
