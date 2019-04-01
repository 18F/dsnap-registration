import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import { Formik } from 'formik';
import Wizard from 'components/wizard';
import BasicInfoReview from 'components/review/basic-info';
import HouseholdReview from 'components/review/household';
import HouseholdMattersReview from 'components/review/household-matters';
import DisasterExpensesReview from 'components/review/disaster-expenses';
import IncomeReviewSection from 'components/review/income';

class SnapshotReview extends React.Component {
  static propTypes = {
    values: PropTypes.object
  }

  state = {
    validattionFn: () => ({})
  }

  setCurrentSectionValidator = (validator) => {
    this.setState({
      validator
    });
  }

  renderReviewSections = ({ handleChange, errors }) => {
    const { t } = this.props;

    return (
      <React.Fragment>
        <BasicInfoReview
          handleChange={handleChange}
          title={t('review.sections.info')}
          onEdit={this.setCurrentSectionValidator}
        />
        {/*<HouseholdReview handleChange={handleChange} setParentValues={this.props.setParentValues} />
        <HouseholdMattersReview handleChange={handleChange} />
        <DisasterExpensesReview handleChange={handleChange} />
        <IncomeReviewSection handleChange={handleChange} />*/}
      </React.Fragment>
    );
  }

  render() {
    const { step, totalSteps, ...rest } = this.props.values;

    return (
      <React.Fragment>
        <Wizard.Progress step={step} steps={totalSteps} />
        <Formik
          validateOnChange={false}
          initialValues={rest}
          render={this.renderReviewSections}
          validate={this.state.validator}
        />
      </React.Fragment>
    );
  }
}

export default withLocale(SnapshotReview);
