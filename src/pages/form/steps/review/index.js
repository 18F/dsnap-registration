import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import BasicInfoReview from 'components/review/basic-info';
import HouseholdReview from 'components/review/household';
import HouseholdMattersReview from 'components/review/household-matters';
import DisasterExpensesReview from 'components/review/disaster-expenses';
import IncomeReviewSection from 'components/review/income';

class ReviewStep extends React.Component {
  static propTypes = {
    handleChange: PropTypes.func,
    registerStep: PropTypes.func,
    sectionName: PropTypes.string,
  }

  state = {
    validationFn: () => ({})
  }

  setCurrentSection = (validationFn) => {
    this.setState({
      validationFn
    });
  }

  render() {
    const { handleChange, sectionName, t } = this.props;

    return (
      <Wizard.Step
        header={t(`${sectionName}.header`)}
        registerStep={this.props.registerStep}
        modelName="review"
        validate={this.state.validationFn}
      >
        <BasicInfoReview handleChange={handleChange} onToggleEdit={this.setCurrentSection} />
        <HouseholdReview handleChange={handleChange} setParentValues={this.props.setParentValues} />
        <HouseholdMattersReview handleChange={handleChange} />
        <DisasterExpensesReview handleChange={handleChange} onToggleEdit={this.setCurrentSection} />
        <IncomeReviewSection handleChange={handleChange} />
      </Wizard.Step>
    );
  }
}

export { ReviewStep };
export default withLocale(ReviewStep);
