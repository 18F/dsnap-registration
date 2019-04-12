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
    actions: PropTypes.node,
    values: PropTypes.object,
  }

  static defaultProps = {
    render: () => { return null; }
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
    const { t, actions } = this.props;

    const extraProps = {
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
        { this.props.render(formik) }
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
