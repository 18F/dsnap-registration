import React from 'react';
import { FormikConsumer } from 'formik';

const Debug = ({ name = 'form state' }) => (
  <div className="margin-y-2">
    <div className="grid-col-8">
      <h6 className="padding-1 padding-x-3 bg-base-darker text-white margin-0 font-sans-md">
        { name }
      </h6>
      <div className="bg-base-lightest"> 
        <div className="usa-alert-body padding-2">
          <FormikConsumer>
            {({ validationSchema, validate, onSubmit, values, ...rest }) => (
              <pre
                className="usa-alert-text"
                style={{
                  fontSize: '1rem',
                  padding: '.25rem .5rem'
                }}
              >
                {JSON.stringify(values, null, 2)}
              </pre>
            )}
          </FormikConsumer>
        </div>
      </div>
    </div>
  </div>
);

export default Debug;
