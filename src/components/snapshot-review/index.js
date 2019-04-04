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

const noOpValidator = () => ({});

class SnapshotReview extends React.Component {
  static propTypes = {
    values: PropTypes.object
  }

  state = {
    validator: noOpValidator
  }

  setCurrentSectionValidator = (validator = noOpValidator) => {
    this.setState({
      validator
    });
  }

  renderReviewSections = ({ handleChange, resetForm, submitCount, isSubmitting, values, errors, handleSubmit }) => {
    const { t } = this.props;
    const disable = submitCount && (
      Object.keys(errors).length ||
      isSubmitting ||
      (values.errors && values.errors.server)
    );
    console.log(errors)
    const extraProps = {
      handleChange,
      onEdit: this.setCurrentSectionValidator
    };

    return (
      <Form onSubmit={handleSubmit}>
        <BasicInfoReview
          title={t('review.sections.info')}
          {...extraProps}
        />
        <HouseholdReview
          title={t('review.sections.household')}
          {...extraProps}
        />
        <HouseholdMattersReview
          {...extraProps}
        />
        <DisasterExpensesReview
          {...extraProps}
        />
        <IncomeReviewSection
          {...extraProps}
        />
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
