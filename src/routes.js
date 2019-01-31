import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/header';
import AppContainer from './components/app-container';
import NoMatch from './components/no-match';
import LocaleContext from './locale-context';
import FormComplete from 'pages/form-complete';
import PreregistrationPage from 'pages/form/pre-registration';
import BasicInfoSection from 'pages/form/basic-info.js';

const Routes = ({ t }) => (
  <LocaleContext.Provider value={t}>
    <Header text={t('general.header')} />
    <Switch>
      <Route
        path="/welcome"
        render={() => <PreregistrationPage name="preregistration" />}
      />
      <AppContainer>
        <Switch>      
          <Route exact path="/">
            <Redirect to="/welcome" />
          </Route>
          <Route
            path="/form/basic-info"
            render={() => <BasicInfoSection modelName="basicInfo" />}
          />
          <Route path="/form/complete" component={FormComplete} />
          <Route component={NoMatch} />      
        </Switch>
      </AppContainer>
    </Switch>
  </LocaleContext.Provider>
);

export default Routes;
