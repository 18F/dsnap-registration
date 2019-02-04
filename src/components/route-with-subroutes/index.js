import React from 'react';
import { Route } from 'react-router-dom';

const RouteWithSubRoutes = ({ route, extraProps = {} }) => (
  <Route
    path={route.path}
    render={(props) =>
      <route.component
        {...props}
        routes={route.routes}
        {...extraProps}
      />
    }
  />
);

export default RouteWithSubRoutes;
