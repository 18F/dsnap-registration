import React from 'react';
import { Switch, Route } from 'react-router-dom';
import WorkerRoutes from './worker-routes';
import ClientRoutes from './client-routes';

const Routes = () => (
  <Switch>
    <Route path="/worker" component={WorkerRoutes} />
    <Route path="/" render={() => <ClientRoutes />} />
  </Switch>
);

export default Routes;
