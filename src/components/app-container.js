import React from 'react';

export default ({ children }) => (
  <div className="width-full height-viewport height-full">
    <div className="grid-container">
      <div className="bg-white padding-x-4 padding-y-2">
        { children }
      </div>
    </div>
  </div>
);