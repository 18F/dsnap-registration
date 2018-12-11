import React from 'react';
import Header from './components/header';
import AppContainer from './components/app-container';
import Collapsible from './components/collapsible';

export default () =>
  <React.Fragment>
    <Header text="D-SNAP Benefits Registration" />
    <AppContainer>
      <Collapsible headerContent="example collapsible" text="herein lies the content" />
    </AppContainer>
  </React.Fragment>
