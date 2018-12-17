import React from 'react';
import ReactDOM from 'react-dom';
import 'uswds/dist/css/uswds.css';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';

ReactDOM.render(
  <BrowserRouter>
    <Routes />
  </BrowserRouter>,
  document.getElementById('root')
);
