import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import AppContainer from './components/app-container';
import Route404 from 'components/404-route';
import NoMatch from 'components/no-match';
import EligiblePage from 'pages/eligible';
import WelcomePage from 'pages/welcome';
import fsmConfig from 'fsm-config';
import wizardRouteConfig from 'route-config';
import FSMRouter, { MachineConsumer, MachineState } from 'components/fsm';
import Wizard from 'components/wizard';
import SnapshotReview from 'components/snapshot-review';
import WorkerSearch from 'components/worker-review/search';
import WorkerReview from 'components/worker-review/review';
import workerConfig from 'state-charts/worker';

class Test extends React.Component {
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

const ClientRoutes = () =>
  <FSMRouter config={fsmConfig}>
    <MachineConsumer>
      {(transition) => (
        <MachineState>
          {(state) => {
            return (
              <Switch>
                <Route exact path="/">
                  <Redirect to="/welcome" />
                </Route>
                <Route
                  path="/welcome"
                  render={() => <WelcomePage onNext={transition} values={state} />}
                />
                <AppContainer>
                  <Switch>
                    <Route path="/form/next-steps/eligible" render={() => <EligiblePage type="eligible" />} />
                    <Route path="/form/next-steps/ineligible" render={() => <EligiblePage type="ineligible" />} />
                    <Route
                      path="/form/review"
                      render={() => (
                        <SnapshotReview
                          values={state}
                          onNext={transition}
                          onQuit={() => transition({ command: 'QUIT' })}
                        />
                      )}
                    />
                    <Route path="/form"
                      render={() => {
                        return (
                          <Wizard
                            initialValues={state}
                            onNext={transition}
                            onDone={() => ({})}
                            onQuit={() => transition({ command: 'QUIT' })}
                            config={wizardRouteConfig}
                          />
                        );
                      }}
                    />
                    <Route component={Route404} />
                  </Switch>
                  <Route path="/not-found" component={NoMatch} />
                </AppContainer>
              </Switch>
            );
          }}
        </MachineState>
      )}
    </MachineConsumer>
  </FSMRouter>;

const Routes = () => (
  <Switch>
    <Route path="/worker" component={Test} />
    <Route path="/" render={() => <ClientRoutes />} />
  </Switch>
);

export default Routes;
