import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import Debug from './debug';

const WizardContext = React.createContext();

class Section extends React.Component {
  static propTypes = {
    header: PropTypes.string,
    initialValues: PropTypes.object
  }

  state = {
    step: 0
  }

  next = values =>
  this.setState(state => ({
    step: Math.min(state.step + 1, this.props.children.length - 1),
    values
  }));

  getActiveStep() {
    return React.Children.toArray(this.props.children)[this.state.step];
  }

  render() {
    const activeStep = this.getActiveStep();
    const isLastStep = this.state.step === React.Children.count(this.props.children) - 1;

    return (
      <section>
        <h2>{this.props.header}</h2>
        <Formik
          initialValues={this.props.initialValues}
          onSubmit={this.handleSubmit}
          render={({ values, handleSubmit, isSubmitting, handleReset }) => {
            return (
              <div>
                { activeStep }
                <button
                  type="button"
                  className="usa-button usa-button-primary"
                  onClick={isLastStep ? this.props.handleSubmit : this.next}
                >
                  next
                </button>
              </div>
            );
          }}
        />
      </section>
    );
  }
};

class Step extends React.Component {
  static propTypes = {
    header: PropTypes.string,
    // initialValues: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    validate: PropTypes.func
  }

  static defaultProps = {
    children: null
  }

  handleSubmit = (/** values i guess? */) => {
    //this.validate() // is this async?
    this.props.onSubmit() && this.props.onSubmit();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {this.props.children}
      </form>
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
      <div id="progress">
        { `Step ${this.props.step} of ${this.props.steps}` }
      </div>
    );
  }
}

class Wizard extends React.Component {
  static Step = Step
  static Section = Section
  static Progress = Progress
  static Context = WizardContext.Consumer
  static propTypes = {
    onDone: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    title: PropTypes.string,
  }

  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      initialValues: props.initialValues
    };
  }

  next = (values) =>
    this.setState(state => ({
      step: Math.min(state.step + 1, this.getChildCount()),
      values
    }));

  validate = (values) => {
    console.log('validate hook called')
    const activeStep = this.getActiveStep();

    // call the validate method of the child step, if there is one
    return activeStep.props.validate ? activeStep.props.validate(values) : {};
  }

  handleSubmit = (values, bag) => {
    console.log('submit hook called');

    const { onSubmit } = this.props;

    onSubmit && onSubmit(values);

    !this.isLastPage() ? this.next(values) : this.props.onDone(values);
  }

  getActiveStep() {
    return this.getChildren()[this.state.step];
  }

  getChildren() {
    return React.Children.toArray(this.props.children);
  }

  getChildCount() {
    return React.Children.count(this.props.children);
  }

  isLastPage() {
    return this.state.step + 1 === this.getChildCount();
  }

  render() {
    const { children } = this.props;
    const activeStep = this.getActiveStep();
    const isLastPage = activeStep === this.getChildCount();
    const providedState = {
      ...this.state,
      ...this.props,
      advanceSection: this.next,
    };

    return (
      <WizardContext.Provider value={providedState}>
        <h2>{this.props.title}</h2>
        <Wizard.Progress step={this.state.step + 1} steps={this.getChildCount()} />
        <Formik
          initialValues={this.props.initialValues}
          onSubmit={this.handleSubmit}
          validate={this.validate}
          render={({ values, handleSubmit, isSubmitting, handleReset }) => {
            return (
              <div>
                {
                  React.cloneElement(activeStep, {
                    handleSubmit: handleSubmit,
                    ...activeStep.props
                  })
                }
              </div>
            );
          }}
        />
        <Debug />
      </WizardContext.Provider>
    );
  }
}

export default Wizard;
