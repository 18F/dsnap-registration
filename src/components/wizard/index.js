import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, ErrorMessage, FormikConsumer } from 'formik';

class Step extends React.Component {

}

class Section extends React.Component {

}

const Debug = () => (
  <div className="margin-y-2">
    <div className="usa-alert usa-alert-paragraph" >
      <div className="usa-alert-body">
        <h6 className="usa-alert-heading">Form state</h6>
        <p className="usa-alert-text">
          <FormikConsumer>
            {({ validationSchema, validate, onSubmit, ...rest }) => (
              <pre
                style={{
                  fontSize: '.65rem',
                  padding: '.25rem .5rem',
                  overflowX: 'scroll',
                }}
              >
                {JSON.stringify(rest, null, 2)}
              </pre>
            )}
          </FormikConsumer>
        </p>
      </div>
    </div>
  </div>
);

class Wizard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentStep: 0,
      initialValues: props.initialValues
    };
  }

  render() {
    return (
      <>
        <Formik />
        <Debug />
      </>
    );
  }
}

export default Wizard;
