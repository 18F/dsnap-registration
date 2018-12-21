import React from 'react';
import { FormikConsumer } from 'formik';

const Debug = () => (
  <div className="margin-y-2">
    <div className="usa-alert usa-alert-paragraph" >
      <div className="usa-alert-body">
        <h6 className="usa-alert-heading">Form state</h6>
        <FormikConsumer>
          {({ validationSchema, validate, onSubmit, ...rest }) => (
            <pre
              className="usa-alert-text"
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
      </div>
    </div>
  </div>
);

export default Debug;
