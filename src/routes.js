import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AppContainer from './components/app-container';
import NoMatch from './components/no-match';
import FormComplete from 'pages/form-complete';
import PreregistrationPage from 'pages/preregistration';
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
      render={() => <PreregistrationPage name="preregistration" />}
    />
    <AppContainer>
      <Switch>
        <Route
          path="/get-prepared"
          render={() => <PreparePage tKey='preparation' />}
        />
        <Route path="/form"
          render={() => <DSNAPForm config={wizardRouteConfig} /> }
        />
        <Route path="/form/complete" component={FormComplete} />
        <Route component={NoMatch} />  
      </Switch>
    </AppContainer>
  </Switch>
);

export default Routes;
