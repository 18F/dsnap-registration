import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/header';
import AppContainer from './components/app-container';
import App from './app';
import NoMatch from './components/no-match';
import LocaleContext from './locale-context';
import Components from './pages/components';

const Routes = ({ t }) => (
  <LocaleContext.Provider value={t}>
    <Header text={t('general.header')} />
    <AppContainer>
      <Switch>
        <Route
          exact
          path="/"
          component={App}
        />
        <Route
          exact
          path="/components"
          component={Components}
        />
        <Route exact path="/form" component={() => <div />} />
        <Route component={NoMatch} />
      </Switch>
    </AppContainer>
  </LocaleContext.Provider>
);

export default Routes;
