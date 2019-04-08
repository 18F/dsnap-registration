import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
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

const Routes = () => (
  <FSMRouter config={fsmConfig} routeId="form">
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
                    <Route path="/form/next-steps/eligible" render={ () => <EligiblePage type="eligible" /> } />
                    <Route path="/form/next-steps/ineligible" render={ () => <EligiblePage type="ineligible" /> } />
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
  </FSMRouter>
);

export default Routes;
