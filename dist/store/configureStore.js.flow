// @flow
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { composeEnhancers } from './composeEnchancers';
import { devTools } from './devTools';
import { getMiddlewareCreators } from './middlewareCreators';

const sagaMiddleware = createSagaMiddleware();

/**
 * Create and returns store with middleware.
 *
 * @param {Function} reducer - Reducer.
 * @param {Object} initialState - State.
 * @returns {Store<S, A, D>} New store.
 */
function createStoreWithMiddleware(reducer, initialState) {
  return createStore(
    reducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        sagaMiddleware,
        ...getMiddlewareCreators().map(createMiddleware => createMiddleware()),
      ),
      devTools,
    ),
  );
}

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

/**
 * Add extra saga to application.
 *
 * @param {Array<Saga>} saga - Saga to run.
 */
export function appendSaga(saga: *) {
  sagaMiddleware.run(saga);
}
