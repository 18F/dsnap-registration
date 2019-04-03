import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import { Form, Formik } from 'formik';
import Wizard from 'components/wizard';
import Button from 'components/button';
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

  renderReviewSections = ({ handleChange, resetForm, submitCount, isSubmitting, values, errors }) => {
    const { t } = this.props;
    const disable = submitCount && (
      Object.keys(errors).length ||
      isSubmitting ||
      (values.errors && values.errors.server)
    );
    console.log(errors)
    return (
      <Form>
        <BasicInfoReview
          handleChange={handleChange}
          title={t('review.sections.info')}
          onEdit={this.setCurrentSectionValidator}
        />
        <HouseholdReview
          title={t('review.sections.household')}
          handleChange={handleChange}
          onEdit={this.setCurrentSectionValidator}
        />
        <HouseholdMattersReview handleChange={handleChange} />
        <DisasterExpensesReview handleChange={handleChange} />
        <IncomeReviewSection handleChange={handleChange} />
        <div className="margin-y-2">
          <Button disabled={disable}>
            { t('review.next') }
          </Button>
        </div>
        <Button
          type="button"
          onClick={() => {
            resetForm(values);
            this.props.onQuit();
          }}
          link
        >
          { t('general.quit') }
        </Button>
      </Form>
    );
  }

  onSubmit = (values) => {
    this.props.onNext({ data: values });
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
          onSubmit={this.onSubmit}
          validate={this.state.validator}
        />
      </React.Fragment>
    );
  }
}

export default withLocale(SnapshotReview);
