import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/header';
import AppContainer from './components/app-container';
import NoMatch from './components/no-match';
import LocaleContext from './locale-context';
import FormComplete from 'pages/form-complete';
import ScrollToTop from 'components/scroll-to-top';
import PreregistrationPage from 'pages/form/pre-registration';
import BasicInfoSection from 'pages/form/basic-info.js';
import BasicInfoIntro from 'pages/form/basic-info/intro';

const Routes = ({ t }) => (
  <LocaleContext.Provider value={ t }>
    <Header text={t('general.header')} />
    <ScrollToTop>
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
            <Route path="/form/basic-info">
              <Switch>
                <Route
                  exact
                  path="/form/basic-info/intro"
                  render={() => <BasicInfoIntro tKey='basicInfo.intro' />}
                />
                <Route
                  exact
                  path="/form/basic-info/applicant-name"
                  render={() => <BasicInfoSection modelName="basicInfo" />}
                />
              </Switch>
            </Route>
            <Route path="/form/complete" component={FormComplete} />
            <Route component={NoMatch} />      
          </Switch>
        </AppContainer>
      </Switch>
    </ScrollToTop>
  </LocaleContext.Provider>
);

export default Routes;
