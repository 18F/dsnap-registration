import React from 'react';

export default ({ children }) =>
  <div className="bg-primary-lighter width-full height-viewport">
    <div className="grid-container">
      <div className="grid-row">
        <div className="grid-col margin-top-4">
          { children }
        </div>
        </div>
    </div>
  </div>