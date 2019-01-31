import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, connect } from 'formik';
import Debug from './debug';
import Button from 'components/button';

const WizardContext = React.createContext();

class Section extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    header: PropTypes.string,
    initialValues: PropTypes.object,
    name: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
    onDone: PropTypes.func,
    onSubmit: PropTypes.func,
    validateOnBlur: PropTypes.bool,
    validateOnChange: PropTypes.bool,
  }

  static defaultProps = {
    validateOnChange: true,
    validateOnBlur: true
  }

  state = {
    step: 0
  }

  next = (values) => {
    this.setState(state => ({
      step: Math.min(state.step + 1, this.props.children.length - 1),
      values
    }))
  };

  validate = (values) => {
    const { props: { validate } } = this.getActiveStep();

    // call the validate method of the child step, if there is one
    return validate ? validate(values) : {};
  }

  getChildCount() {
    return React.Children.count(this.props.children);
  }

  isLastStep() {
    return this.state.step + 1 === this.getChildCount();
  }

  handleSubmit = (values, actions) => {
    const isLastStep = this.isLastStep();
  
    if (isLastStep) {
      this.props.handleSubmit(values);
    } else {
      actions.setSubmitting(false);
      this.next();
    }
  }

  handleChange = ownHandler => nextValues => {
    ownHandler(nextValues);
    this.props.handleChange(nextValues);
  }

  hasErrors(errors = {}) {
    return Object.keys(errors).length >= 1;
  }

  getActiveStep() {
    return React.Children.toArray(this.props.children)[this.state.step];
  }

  selectState(...keys) {
    const { values } = this.props;

    return keys.reduce((memo, key) => {
      const slice = values[key] || {};

      return { ...memo, [key]: { ...slice } };
    }, {});
  }

  render() {
    const activeStep = this.getActiveStep();
  
    return (
      <section>
        <h2>{this.props.header}</h2>
        <Formik
          initialValues={this.selectState(this.props.name)}
          onSubmit={this.handleSubmit}
          validateOnBlur={this.props.validateOnBlur}
          validateOnChange={this.props.validateOnChange}
          validate={this.validate}
          render={(props) => {
            const disable = this.hasErrors(props.errors) || props.isSubmitting;

            return (
              <Form onSubmit={props.handleSubmit}>
                <WizardContext.Provider value={{ sectionName: this.props.name, handleChange: this.handleChange(props.handleChange) }}>
                  { activeStep }
                </WizardContext.Provider>
                <div className="margin-y-2">
                  <Button disabled={disable}>
                    next
                  </Button>
                </div>
                <Debug name={`Section ${this.props.name} state`}/>
              </Form>
            );
          }}
        />
      </section>
    );
  }
};

class Step extends React.Component {
  static propTypes = {
    header: PropTypes.string.isRequired,
    validate: PropTypes.func
  }

  static defaultProps = {
    children: null
  }

  renderHeader() {
    if (!this.props.header) {
      return null;
    }

    return (
      <h1 className="font-sans-2xl">
        {this.props.header}
      </h1>
    );
  }

  render() {
    return (
      <div>
        <div className="border-bottom-1px border-base-lighter margin-bottom-4">
          { this.renderHeader() }
        </div>
        { this.props.children }
      </div>
    )
  }
}

class Progress extends React.Component {
  static propTypes = {
    step: PropTypes.number,
    steps: PropTypes.number,
  }
  
  render() {
    return (
      <section id="progress">
        { `Step ${this.props.step} of ${this.props.steps}` }
      </section>
    );
  }
}

class Wizard extends React.Component {
  static Step = Step
  static Section = connect(Section)
  static Progress = Progress
  static Context = WizardContext.Consumer
  static propTypes = {
    handleSubmit: PropTypes.func,
    header: PropTypes.string,
    initialValues: PropTypes.object,
    name: PropTypes.string,
    onDone: PropTypes.func,
    onSubmit: PropTypes.func,
    validateOnBlur: PropTypes.bool,
    validateOnChange: PropTypes.bool,
  }

  static defaultProps = {
    validateOnChange: true,
    validateOnBlur: true
  }

  state = {
    step: 0
  }

  next = (values) =>
    this.setState(state => ({
      step: Math.min(state.step + 1, this.getChildCount()),
      values
    }));

  validate = (values) => {
    console.log('validate hook called in wizard')
    const { props: { validate } } = this.getActiveStep();

    // call the validate method of the child step, if there is one
    return validate ? validate(values) : {};
  }

  handleSubmit = (values, actions) => {
    console.log('submit hook called in wizard');
    const isLastStep = this.isLastStep();

    if (isLastStep) {
      this.props.onDone(values);
    } else {
      this.formik.setSubmitting(false);
      this.next();
    }
  }

  getActiveStep() {
    return React.Children.toArray(this.props.children)[this.state.step];
  }

  getChildCount() {
    return React.Children.count(this.props.children);
  }

  isLastStep() {
    return this.state.step + 1 === this.getChildCount();
  }

  renderTitle() {
    return this.props.title ?
      <h2>{this.props.title}</h2> : null;
  }

  render() {
    const activeStep = this.getActiveStep();

    return (
      <>
        { this.renderTitle() }
        <Wizard.Progress step={this.state.step + 1} steps={this.getChildCount()} />
        <Formik
          initialValues={this.props.initialValues}
          onSubmit={this.handleSubmit}
          validate={this.validate}
          render={({ values, handleSubmit, handleChange, errors }) => {
            return (
              <div>
                {
                  React.cloneElement(activeStep, {
                    handleSubmit,
                    handleChange,
                    values,
                    errors,
                    ...activeStep.props
                  })
                }
                <Debug name="Complete form state" />
              </div>
            );
          }}
        />
      </>
    );
  }
}

export default Wizard;
