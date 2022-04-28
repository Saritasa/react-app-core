'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureStore = configureStore;
exports.appendSaga = appendSaga;

var _redux = require('redux');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _composeEnchancers = require('./composeEnchancers');

var _devTools = require('./devTools');

var _middlewareCreators = require('./middlewareCreators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var sagaMiddleware = (0, _reduxSaga2.default)();

/**
 * Create and returns store with middleware.
 *
 * @param {Function} reducer - Reducer.
 * @param {Object} initialState - State.
 * @returns {Store<S, A, D>} New store.
 */
function createStoreWithMiddleware(reducer, initialState) {
  return (0, _redux.createStore)(reducer, initialState, (0, _composeEnchancers.composeEnhancers)(_redux.applyMiddleware.apply(undefined, [sagaMiddleware].concat(_toConsumableArray((0, _middlewareCreators.getMiddlewareCreators)().map(function (createMiddleware) {
    return createMiddleware();
  })))), _devTools.devTools));
}

/**
 * Add sagas to store middleware.
 *
 * @param {Object} initialState - State.
 * @param {Function} reducer - Reducer.
 * @param {Array} sagas - Sagas.
 * @returns {Store<S, A, D>} Configured store.
 */
function configureStore(initialState, _ref) {
  var reducer = _ref.reducer,
      sagas = _ref.sagas;

  var store = createStoreWithMiddleware(reducer, initialState);

  sagas.forEach(function (saga) {
    return sagaMiddleware.run(saga);
  });

  return store;
}

/**
 * Add extra saga to application.
 *
 * @param {Array<Saga>} saga - Saga to run.
 */
function appendSaga(saga) {
  sagaMiddleware.run(saga);
}