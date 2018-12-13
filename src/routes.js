import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/header';
import AppContainer from './components/app-container';
import Collapsible from './components/collapsible';
import NoMatch from './components/no-match';

const Routes = () => (
  <div>  
    <Header text="D-SNAP Benefits Registration" />
    <AppContainer>
      <Switch>
        <Route
          exact
          path="/"
          render={(routerProps) => (
            <Collapsible
              {...routerProps}
              headerContent="example collapsible"
              text="herein lies the content"
            />
          )}
        />
        <Route exact path="/form" component={() => <div />} />
        <Route component={NoMatch} />
      </Switch>
    </AppContainer>
  </div>
);

export default Routes;
