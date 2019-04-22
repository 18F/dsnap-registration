import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AppContainer from 'components/app-container';
import FSMRouter, { MachineConsumer, MachineState } from 'components/fsm';
import WorkerSearch from 'components/worker-review/search';
import WorkerReview from 'components/worker-review/review';
import workerConfig from 'state-charts/worker';

class WorkerRoutes extends React.Component {
  render() {
    return (
      <FSMRouter config={workerConfig} usePath>
        <MachineConsumer>
          {(transition) => {
            return (
              <MachineState>
                {(state) => {
                  const providedProps = {
                    transition,
                    machineState: state
                  };

                  return (  
                    <AppContainer>
                      <Switch>
                        <Route
                          path="/worker/search"
                          render={() =>
                            <WorkerSearch {...providedProps} />  
                          }
                        />
                        <Route
                          path="/worker/review"
                          render={() =>
                            <WorkerReview {...providedProps} />
                          }
                        />
                      </Switch>
                    </AppContainer>
                  );
                }}
              </MachineState>
            );
          }}
        </MachineConsumer>
      </FSMRouter>
    )
  }
}

export default WorkerRoutes;
