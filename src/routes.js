import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/header';
import AppContainer from './components/app-container';
import App from './app';
import NoMatch from './components/no-match';

const Routes = () => (
  <div>  
    <Header text="D-SNAP Benefits Registration" />
    <AppContainer>
      <Switch>
        <Route
          exact
          path="/"
          component={App}
        />
        <Route exact path="/form" component={() => <div />} />
        <Route component={NoMatch} />
      </Switch>
    </AppContainer>
  </div>
);

export default Routes;
