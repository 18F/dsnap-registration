import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import { Form, Formik } from 'formik';
import Wizard from 'components/wizard';
import BasicInfoReview from 'components/review/basic-info';
import HouseholdReview from 'components/review/household';
import HouseholdMattersReview from 'components/review/household-matters';
import DisasterExpensesReview from 'components/review/disaster-expenses';
import IncomeReviewSection from 'components/review/income';

const noOpValidator = () => ({});

class SnapshotReview extends React.Component {
  static propTypes = {
    actions: PropTypes.node,
    render: PropTypes.func,
    values: PropTypes.object,
  }

  state = {
    validator: noOpValidator
  }

  setCurrentSectionValidator = (validator = noOpValidator) => {
    this.setState({
      validator
    });
  }

  renderReviewSections = (formik) => {
    const { t, readonly } = this.props;

    const extraProps = {
      readonly,
      handleChange: formik.handleChange,
      onEdit: this.setCurrentSectionValidator
    };

    return (
      <Form>
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
        { this.props.render && this.props.render(formik) }
      </Form>
    );
  }

  // Passes formik methods up to caller, to maintain consistency with formik api
  onSubmit = (values, formikMethods) => {
    this.props.onNext({ data: values }, formikMethods);
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
