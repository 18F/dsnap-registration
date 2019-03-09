import React from 'react';
import { MachineState } from 'components/fsm';

const LoadingMessage = ({ message }) =>
  <div className="grid-row flex-column flex-align-center">
    { message }
  </div>

const Loading = ({ children, message }) =>
  <MachineState>
    {({ meta }) =>
      meta.loading ? <LoadingMessage message={message} /> : children
    }
  </MachineState>

export default Loading;
