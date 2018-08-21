// @flow
import { BrowserRouter as Router } from 'react-router-dom';
import { combineReducers } from 'redux-immutable';

import { EntityStore } from './EntityStore';

import { configureStore, getInitialState } from './store';
import { RouteStore } from './routing';

const entityStore = new EntityStore().setName('entities');
const appStore = new EntityStore().setName('appInfo');

const reducer = combineReducers({
  [entityStore.name]: entityStore.reducer,
  [appStore.name]: appStore.reducer,
});

const sagas = [...entityStore.sagas, ...appStore.sagas];

// eslint-disable-next-line no-use-before-define
let instance: ?RuntimeClient = null;

/**
 * Runtime client class.
 */
export class RuntimeClient {
  /**
   * Return instance of this class.
   *
   * @returns {RuntimeClient} - Instance.
   */
  static getInstance(): RuntimeClient {
    if (!instance) {
      instance = new RuntimeClient();
    }

    return instance;
  }

  store = configureStore(getInitialState(), { reducer, sagas });
  Router = Router;
  routeStore = new RouteStore();
  entityStore = entityStore;
  appStore = appStore;
}
