import React from 'react';
import withLocale from 'components/with-locale';
import withUpdateable from 'components/with-updateable';
import YesNoField from 'components/yes-no-field';
import CurrencyInput from 'components/currency-input';
import ReviewSubSection from 'components/review-subsection';
import ReviewTable from 'components/review-table';
import { getLostFood, getLostIncome, getLostMoney } from 'models/impact';
import { getMoneyOnHand } from 'models/basic-info';
import { impactReviewValidator } from 'schemas/snapshot-review/impact';

class IncomeSourcesReviewForm extends React.Component {
  updateMask = (name, data) => {
    this.props.handleChange(name)(data);
  }

  render() {
    const { t } = this.props;

    return (
      <div className="margin-bottom-2">
        <YesNoField
          labelText={t('impact.buyFood.label')}
          name="impact.buyFood"
        />
        <YesNoField
          labelText={t('impact.inaccessibleMoney.label')}
          name="impact.lostOrInaccessibleIncome"
        />
        <YesNoField
          labelText={t('impact.lostOrInaccessibleIncome.label')}
          name="impact.inaccessibleMoney"
        />
        <CurrencyInput
          labelText={t('resources.moneyOnHand.id')}
          name="basicInfo.moneyOnHand"
          onChange={this.updateMask}
        />
      </div>
    );
  }
}

class HouseholdMattersReview extends React.Component {
  getHouseholdMoneyData() {
    const { formik, t }= this.props;
    const { basicInfo, impact } = formik.values;

    return [
      {
        name: t('impact.buyFood.id'),
        data: t(`general.${getLostFood(impact) ? 'yes' : 'no'}`),
      },
      {
        name: t('impact.lostOrInaccessibleIncome.id'),
        data: t(`general.${getLostIncome(impact) ? 'yes' : 'no'}`),
      },
      {
        name: t('impact.inaccessibleMoney.id'),
        data: t(`general.${getLostMoney(impact) ? 'yes' : 'no'}`),
      },
      {
        name: t('resources.moneyOnHand.id'),
        data: `$${getMoneyOnHand(basicInfo)}`,
      }
    ];
  }

  validateSection = () => {
    const { impact, basicInfo } = this.props.formik.values;

    const values = {
      impact: { ...impact },
      basicInfo: {
        moneyOnHand: basicInfo.moneyOnHand
      }
    };

    return impactReviewValidator(values);
  }

  handleToggleEdit = (isEditing) => {
    if (isEditing) {
      this.props.onEdit(this.validateSection);
    }
  }

  render() {
    const { t, handleChange } = this.props;
    
    return (
      <ReviewSubSection
        onEdit={this.handleToggleEdit}
        title={t('review.sections.householdMatters')}
        onUpdate={this.props.handleUpdate}
      >
        {({ editing }) => {
          return (
            editing ?
            <IncomeSourcesReviewForm t={t} handleChange={handleChange} /> :
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
