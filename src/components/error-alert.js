import React from 'react';
import ErrorIcon from 'components/icons/error';

const ErrorAlert = ({ text }) => (
  !text ? null :
  <div className="bg-secondary tablet:grid-col-6 padding-2 margin-y-3">    
    <div className="grid-row">
      <div className="grid-col-1 margin-top-05">
        <ErrorIcon />   
      </div>
      <div className="grid-col-11 text-base">
        <p className="text-white">
          { text }
        </p>
      </div>
    </div>
  </div>
);

export default ErrorAlert