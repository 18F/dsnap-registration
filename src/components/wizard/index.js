import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { Formik, Form, connect } from 'formik';
import Route404 from 'components/404-route';
import Debug from './debug';
import Button from 'components/button';
import RouteWithSubRoutes from 'components/route-with-subroutes';
import withLocale from 'components/with-locale';

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
    current: null,
  }

  formStarted = false

  next = () => {
    const { current } = this.state;
    const formValues = this.props.formik.values;
      // call the onNext handler for the step, if it exists
    const nextValues = (
      current &&
      current.props.onNext &&
      current.props.onNext(formValues)
    ) || formValues;

    this.formStarted = true;
    this.props.onNext({ data: nextValues });
  };

  onQuit = resetFn => () => {
    const { formik, values, onQuit } = this.props;
    
    if (!this.formStarted) {
      // call the parent form reset handler
      formik.resetForm(values);
      // call the nested formik's resetForm handler
      resetFn(values);
    }

    onQuit();
  }

  registerStepComponent = (step) => {
    this.setState({
      current: step
    })
  }

  validate = (values) => {
    const activeStep = this.getActiveStepComponent();
    const validate = activeStep && activeStep.props.validate;

    if (!validate) {
      return {};
    }

    // call the validate method of the child step, if there is one
    return validate(values);
  }

  getActiveStepComponent() {
    return this.state.current;
  }

  getChildCount() {
    return this.props.routes.length;
  }

  isLastStep() {
    return this.state.step + 1 === this.getChildCount();
  }

  handleSubmit = (values, actions) => {
    const isLastStep = this.isLastStep();

    this.next(values);

    if (isLastStep) {
      this.props.handleSubmit(values);
    } else {
      actions.setSubmitting(false);
    }
  }

  handleChange = formikHandler => nextValues => {
    formikHandler(nextValues);
    this.props.handleChange(nextValues);
  }

  hasErrors(errors = {}) {
    return Object.keys(errors).length >= 1;
  }

  render() {
    // TODO: need to separate out the concept of name being used for translations
    // and data model keys. Not sure why I coupled them earlier!
    return (
      <section>
        <h2>{this.props.header}</h2>
        <Formik
          enableReinitialize
          initialValues={this.props.values}
          onSubmit={this.handleSubmit}
          validateOnBlur={this.props.validateOnBlur}
          validateOnChange={this.props.validateOnChange}
          validate={this.validate}
          render={(formikProps) => {
            const disable = this.hasErrors(formikProps.errors) ||
              formikProps.isSubmitting ||
              this.props.values.errors.server;

            return (
              <WizardContext.Provider value={formikProps.values}>
                <Form onSubmit={formikProps.handleSubmit} autoComplete="fake">
                  <input
                    type="hidden"
                    value="something"
                    name="hidden"
                    style={{ display: 'none' }}
                  />
                  {
                    this.props.routes && this.props.routes.length ?
                    <Switch>
                      {
                        this.props.routes.map((route, index) => {
                          return (
                            <RouteWithSubRoutes
                              key={index}
                              path={route.path}
                              route={route}
                              extraProps={{
                                sectionName: this.props.name,
                                handleChange: this.handleChange(formikProps.handleChange),
                                registerStep: this.registerStepComponent,
                                handleNext: this.props.handleNext
                              }}
                            />
                          );
                        })
                      }
                      <Route component={Route404} />
                    </Switch> : null
                  }
                  <div className="margin-y-2">
                    <Button disabled={disable}>
                      { this.props.nextButton || this.props.t('general.next') }
                    </Button>
                  </div>
                  <Button
                    type="button"
                    onClick={this.onQuit(formikProps.resetForm)}
                    link
                  >
                    { this.props.t('general.quit') }
                  </Button>
                </Form>
              </WizardContext.Provider>
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
    registerStep: PropTypes.func.isRequired,
    validate: PropTypes.func
  }

  static defaultProps = {
    children: null
  }

  componentDidMount() {
    this.props.registerStep(this);
  }

  componentWillUnmount() {
    this.props.registerStep();
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
        <div className="border-bottom-1px border-base-lighter margin-bottom-2">
          { this.renderHeader() }
        </div>
        {this.props.children }
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
    // TODO: sometimes steps is passed in as an empty object.
    // probably an issue witht he way context is being updated in fsm-config
    return !this.props.step ? null : (
      <section id="progress" className="text-green">
        { `Step ${this.props.step} of ${this.props.steps}` }
      </section>
    );
  }
}

class Wizard extends React.Component {
  static Step = Step
  static Section = connect(withLocale(Section))
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

  formStarted = false;

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
      actions.setSubmitting(false);
    }
  }

  getChildCount() {
    return this.props.totalSteps;
  }

  isLastStep() {
    return this.props.step === this.props.totalSteps;
  }

  renderTitle() {
    return this.props.title ?
      <h2>{this.props.title}</h2> : null;
  }

  render() {
    const { step, totalSteps, ...rest } = this.props.initialValues;

    return (
      <React.Fragment>
        { this.renderTitle() }
        <Wizard.Progress
          step={step}
          steps={totalSteps}
        />
        <Formik
          enableReinitialize
          initialValues={rest}
          onSubmit={this.handleSubmit}
          validate={this.validate}
          render={({ values, handleSubmit, handleChange, errors }) => {
            let providedValues = this.formStarted ? values : this.props.initialValues;          

            return (
              <React.Fragment>
                <WizardContext.Provider value={providedValues}>
                    <Switch>
                      {
                        this.props.config.map((section, index) => {
                          return (
                            <RouteWithSubRoutes
                              key={index}
                              route={section}
                              path={section.path}
                              extraProps={{
                                handleSubmit,
                                handleChange,
                                values: providedValues,
                                errors,
                                name: section.name,
                                onNext: (values) => {
                                  if (!this.formStarted) this.formStarted = true;
                                  this.props.onNext(values);
                                },
                                onQuit: this.props.onQuit
                              }}
                            />
                          );
                        })
                      }
                      <Route component={Route404} />
                    </Switch>
                    <Debug name="Complete form state" />
                </WizardContext.Provider>
              </React.Fragment>
            );
          }}
        />
      </React.Fragment>
    );
  }
}

export { Wizard };

export default Wizard;
