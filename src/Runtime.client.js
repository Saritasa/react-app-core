// @flow
import { BrowserRouter as Router } from 'react-router-dom';
import { combineReducers } from 'redux-immutable';

import { EntityStore } from './EntityStore';

import { configureStore, getInitialState } from "./store";
import { RouteStore } from "./routing";


const entityStore = new EntityStore().setName('entities');
const appStore = new EntityStore().setName('appInfo');

const reducer = combineReducers({
  [entityStore.name]: entityStore.reducer,
  [appStore.name]: appStore.reducer,
});

const sagas = [
  ...entityStore.sagas,
  ...appStore.sagas,
];

let instance: ?RuntimeClient = null;

export class RuntimeClient {
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
