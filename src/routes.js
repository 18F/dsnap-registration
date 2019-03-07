import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AppContainer from './components/app-container';
import Route404 from 'components/404-route';
import NoMatch from 'components/no-match';
import EligiblePage from 'pages/eligible';
import WelcomePage from 'pages/welcome';
import PreparePage from 'pages/prepare';
import DSNAPForm from 'pages/form/dsnap-form';
import wizardRouteConfig from 'route-config';

const Routes = () => (
  <Switch>
    <Route exact path="/">
      <Redirect to="/welcome" />
    </Route>
    <Route
      path="/welcome"
      render={() => <WelcomePage name="welcome" />}
    />
    <AppContainer>
      <Switch>
        <Route
          path="/get-prepared"
          render={() => <PreparePage tKey='preparation' />}
        />
        <Route path="/form/next-steps/eligible" render={ () => <EligiblePage type="eligible" /> } />
        <Route path="/form/next-steps/ineligible" render={ () => <EligiblePage type="ineligible" /> } />
        <Route path="/form"
          render={() => <DSNAPForm config={wizardRouteConfig} /> }
        />
        <Route component={Route404} />
      </Switch>
      <Route path="/not-found" component={NoMatch} />
    </AppContainer>
  </Switch>
);

export default Routes;
