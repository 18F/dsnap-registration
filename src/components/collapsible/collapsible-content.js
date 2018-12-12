import React from 'react';

const CollapsibleContent = ({ children, collapsed }) =>
  <div className="usa-accordion-content usa-prose" id="a1" hidden={collapsed}>
    { children }
  </div>;

export default CollapsibleContent;
