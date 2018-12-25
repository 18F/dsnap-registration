import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import 'uswds/dist/css/uswds.css';
import 'app.css';
import Routes from './routes';
import './i18n';

const LocalizedRoutes = withNamespaces()(Routes);

ReactDOM.render(
  <BrowserRouter>
    <LocalizedRoutes />
  </BrowserRouter>,
  document.getElementById('root')
);
