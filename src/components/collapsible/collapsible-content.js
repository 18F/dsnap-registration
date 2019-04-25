import React from 'react';

const CollapsibleContent = ({ children, collapsed, id, className }) => (
  <div className={`usa-accordion-content usa-prose ${className}`} id={id} hidden={collapsed}>
    { children }
  </div>
);

export default CollapsibleContent;
