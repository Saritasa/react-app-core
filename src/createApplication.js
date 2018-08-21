// @flow
import * as React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';

import { Routes } from './routing';
import type { RuntimeClient } from './Runtime.client';

/**
 * Create React application.
 *
 * @param {class} Runtime - Runtime class.
 * @returns {React.Node} React application.
 */
export function createApplication(Runtime: Class<RuntimeClient>) {
  const runtime = Runtime.getInstance();

  const { Router, store, routeStore } = runtime;

  return (
    <Provider store={store}>
      <Router>
        <Route
          path="/"
          render={({ location }) => (
            <Routes location={location} routeStore={routeStore} />
          )}
        />
      </Router>
    </Provider>
  );
}
