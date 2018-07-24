// @flow
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import { lazyTransformToJS } from './lazyTransformToJS';
import { composeEnhancers } from './composeEnchancers';
import { devTools } from './devTools';

const sagaMiddleware = createSagaMiddleware();

const logger = createLogger({
  level: 'info',
  collapsed: false,
  logger: console,
  predicate: () => process.env.NODE_ENV !== 'production',
  stateTransformer: lazyTransformToJS,
  actionTransformer: action =>
    Object.assign({}, action, { type: String(action.type) }),
});

/**
 * Create and returns store with middleware.
 *
 * @param {Function} reducer - Reducer.
 * @param {Object} initialState - State.
 * @returns {Store<S, A, D>} New store.
 */
const createStoreWithMiddleware = (reducer, initialState) =>
  createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware, logger), devTools),
  );

/**
 * Add sagas to store middleware.
 *
 * @param {Object} initialState - State.
 * @param {Function} reducer - Reducer.
 * @param {Array} sagas - Sagas.
 * @returns {Store<S, A, D>} Configured store.
 */
export function configureStore(initialState: *, { reducer, sagas }: *) {
  const store = createStoreWithMiddleware(reducer, initialState);

  sagas.forEach(saga => sagaMiddleware.run(saga));

  return store;
}
