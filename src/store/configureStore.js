// @flow
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga'
import { combineReducers } from 'redux-immutable';

import { lazyTransformToJS } from './lazyTransformToJS';
import { composeEnhancers } from "./composeEnchancers";
import { devTools } from "./devTools";

const sagaMiddleware = createSagaMiddleware();

const logger = createLogger({
  level: 'info',
  collapsed: false,
  logger: console,
  predicate: () => process.env.NODE_ENV !== 'production',
  stateTransformer: lazyTransformToJS,
  actionTransformer: action => Object.assign({}, action, { type: String(action.type) }),
});

const createStoreWithMiddleware = function configureStore(reducer, initialState) {
  return createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware, logger), devTools),
  );
};

export function configureStore(initialState: *, { reducer, sagas }: *) {
  const store = createStoreWithMiddleware(reducer, initialState);

  sagas.forEach(saga => sagaMiddleware.run(saga));

  return store;
}
