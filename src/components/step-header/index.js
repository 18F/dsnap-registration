import React from 'react';

const StepHeader = ({ text }) => (
  !text ? null :
  <div className="border-bottom-1px border-base-lighter margin-bottom-2">
    <h1 className="font-sans-2xl">
      {text}
    </h1>
  </div>
);

export default StepHeader;
