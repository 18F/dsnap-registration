import 'babel-polyfill';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import 'uswds/dist/css/uswds.css';
import './fa/regular.min.css';
import './fa/fontawesome.min.css';
import 'app.scss';
import Routes from './routes';
import App from 'app';
import './i18n';

// inject i18m library functions as props to the App component
const LocalizedApp = withNamespaces()(App);

ReactDOM.render(
  <BrowserRouter>
    <LocalizedApp>
      <Routes />
    </LocalizedApp>
  </BrowserRouter>,
  document.getElementById('root')
);
