import React from 'react';

const CollapsibleContent = ({ children, collapsed, id }) => (
  <div className="usa-accordion-content usa-prose bg-base-lightest" id={id} hidden={collapsed}>
    { children }
  </div>
);

export default CollapsibleContent;
