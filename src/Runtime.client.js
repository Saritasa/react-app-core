// @flow
import { BrowserRouter as Router } from 'react-router-dom';
import { combineReducers } from 'redux-immutable';

import { EntityStore } from './EntityStore';

import { configureStore, getInitialState, appendSaga } from './store';
import { RouteStore } from './routing';

const entityStore = new EntityStore()
  .setBaseSelectorPath(['entities'])
  .setName('entities');
const appStore = new EntityStore()
  .setBaseSelectorPath(['entities'])
  .setName('appInfo');

const reducer = combineReducers({
  [entityStore.name]: entityStore.reducer,
  [appStore.name]: appStore.reducer,
});

const initialSagas = [...entityStore.sagas, ...appStore.sagas];

entityStore.subscribeToSagaAppending(appendSaga);
appStore.subscribeToSagaAppending(appendSaga);

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
      instance.subscribeToStoreUpdates();
    }

    return instance;
  }

  subscribeToStoreUpdates() {
    this.entityStore.onDeepInject(name => {
      this.store.dispatch({
        type: '@@react-app-core/DEEP_INJECT_ENTITY',
        payload: { name },
      });
    });
    this.appStore.onDeepInject(name =>
      this.store.dispatch({
        type: '@@react-app-core/DEEP_INJECT_ENTITY',
        payload: { name },
      }),
    );
  }

  store = configureStore(getInitialState(), { reducer, sagas: initialSagas });
  Router = Router;
  routeStore = new RouteStore();
  entityStore = entityStore;
  appStore = appStore;
}
