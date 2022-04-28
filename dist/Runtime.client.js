'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuntimeClient = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _combineReducers;

var _reactRouterDom = require('react-router-dom');

var _reduxImmutable = require('redux-immutable');

var _EntityStore = require('./EntityStore');

var _store = require('./store');

var _routing = require('./routing');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var entityStore = new _EntityStore.EntityStore().setBaseSelectorPath(['entities']).setName('entities');
var appStore = new _EntityStore.EntityStore().setBaseSelectorPath(['appInfo']).setName('appInfo');

var _reducer = (0, _reduxImmutable.combineReducers)((_combineReducers = {}, _defineProperty(_combineReducers, entityStore.name, entityStore.reducer), _defineProperty(_combineReducers, appStore.name, appStore.reducer), _combineReducers));

var initialSagas = [].concat(_toConsumableArray(entityStore.sagas), _toConsumableArray(appStore.sagas));

entityStore.subscribeToSagaAppending(_store.appendSaga);
appStore.subscribeToSagaAppending(_store.appendSaga);

// eslint-disable-next-line no-use-before-define
var instance = null;

/**
 * Runtime client class.
 */

var RuntimeClient = exports.RuntimeClient = function () {
  function RuntimeClient() {
    _classCallCheck(this, RuntimeClient);

    this.store = (0, _store.configureStore)((0, _store.getInitialState)(), {
      reducer: function reducer(state, action) {
        if (action && action.type === _store.CLEAR_STORE) return _reducer(undefined, action);

        return _reducer(state, action);
      },
      sagas: initialSagas
    });
    this.Router = _reactRouterDom.BrowserRouter;
    this.routeStore = new _routing.RouteStore();
    this.entityStore = entityStore;
    this.appStore = appStore;
  }

  _createClass(RuntimeClient, [{
    key: 'subscribeToStoreUpdates',
    value: function subscribeToStoreUpdates() {
      var _this = this;

      this.entityStore.onDeepInject(function (name) {
        _this.store.dispatch({
          type: '@@react-app-core/DEEP_INJECT_ENTITY',
          payload: { name: name }
        });
      });
      this.appStore.onDeepInject(function (name) {
        return _this.store.dispatch({
          type: '@@react-app-core/DEEP_INJECT_ENTITY',
          payload: { name: name }
        });
      });
    }
  }], [{
    key: 'getInstance',

    /**
     * Return instance of this class.
     *
     * @returns {RuntimeClient} - Instance.
     */
    value: function getInstance() {
      if (!instance) {
        instance = new RuntimeClient();
        instance.subscribeToStoreUpdates();
      }

      return instance;
    }
  }]);

  return RuntimeClient;
}();