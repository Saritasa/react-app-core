'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EntityStore = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

var Immutable = _interopRequireWildcard(_immutable);

var _reduxImmutable = require('redux-immutable');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var id = 0;

/**
 * Noop function.
 *
 * @returns {null} Just returns null.
 */
var noop = function noop() {
  return null;
};
// todo noop uses in one place only.
// todo maybe we should replace this?

var NO_STATE = Immutable.fromJS({});

/**
 * EntityStore Class.
 */

var EntityStore = exports.EntityStore = function () {
  function EntityStore() {
    var _this = this;

    _classCallCheck(this, EntityStore);

    this.injected = false;

    this.realReducer = function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : NO_STATE;
      var action = arguments[1];
      return state;
    };

    this.reducers = {};
    this.mainPath = [];
    this.basePathSettersMap = {};
    this.deepInjectListeners = [];
    this.name = EntityStore.generateName();

    this.reducer = function (state, action) {
      if (!_this.realReducer) {
        throw new Error("Initialization failed. Please send bug report to package's authors");
      }

      if (state === NO_STATE) {
        return _this.realReducer(void 0, action);
      }

      return _this.realReducer(state, action);
    };

    this.sagas = [];

    this.setBaseSelectorPath = function (path) {
      if (typeof path === 'string') {
        _this.mainPath = path.split('.');
      } else if (Array.isArray(path)) {
        _this.mainPath = [].concat(_toConsumableArray(path));
      } else {
        throw new Error('`path` should be a string or instance of Array. You passed "' + path + '"');
      }

      Object.entries(_this.basePathSettersMap).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            name = _ref2[0],
            setBaseSelectorPath = _ref2[1];

        if (typeof setBaseSelectorPath !== 'function') {
          throw new Error('setBaseSelectorPath should be a function');
        }
        setBaseSelectorPath([].concat(_toConsumableArray(_this.mainPath), [name]));
      });

      return _this;
    };

    this.onDeepInject = function (callback) {
      _this.deepInjectListeners.push(callback);
    };

    this.subscribersToSagaAppending = [];

    this.subscribeToSagaAppending = function (callback) {
      _this.subscribersToSagaAppending.push(callback);
    };
  }

  _createClass(EntityStore, [{
    key: 'setInjected',


    /**
     * Set injected state to true.
     */
    value: function setInjected() {
      this.injected = true;
    }

    /**
     * Set name.
     *
     * @param {string} name - New name.
     *
     * @returns {EntityStore} This instance for chains.
     */

  }, {
    key: 'setName',
    value: function setName(name) {
      if (this.injected) {
        throw new Error('Can\'t call EntityStore#setName(name) after injecting it.');
      }
      this.name = name;

      return this;
    }

    /**
     * Inject store to children.
     *
     * @param {string} name - Name.
     * @param {Function} reducer - Reducer function.
     * @param {Array} sagas - Array of sagas.
     * @param {Function} setBaseSelectorPath - Function setBaseSelectorPath.
     * @param {Function} setInjected - Function setInjected.
     * @param {Function} onDeepInject - Function onDeepInject.
     * @param {Function} subscribeToSagaAppending - Function to allow parent know if new sagas created.
     * @returns {EntityStore} This instance for chains.
     */

  }, {
    key: 'inject',
    value: function inject(_ref3) {
      var _this2 = this;

      var _ref3$name = _ref3.name,
          name = _ref3$name === undefined ? EntityStore.generateName() : _ref3$name,
          reducer = _ref3.reducer,
          sagas = _ref3.sagas,
          setBaseSelectorPath = _ref3.setBaseSelectorPath,
          _ref3$setInjected = _ref3.setInjected,
          setInjected = _ref3$setInjected === undefined ? noop : _ref3$setInjected,
          _ref3$onDeepInject = _ref3.onDeepInject,
          onDeepInject = _ref3$onDeepInject === undefined ? noop : _ref3$onDeepInject,
          _ref3$subscribeToSaga = _ref3.subscribeToSagaAppending,
          subscribeToSagaAppending = _ref3$subscribeToSaga === undefined ? noop : _ref3$subscribeToSaga;

      if (Object.prototype.hasOwnProperty.call(this.reducers, name) && process.env.NODE_ENV !== 'test') {
        throw new Error('Specified name is not unique. Name is "' + name + '"');
      }

      setInjected();

      this.reducers[name] = reducer;

      sagas.forEach(function (saga) {
        _this2.sagas.push(saga);
        _this2.subscribersToSagaAppending.forEach(function (callback) {
          return callback(saga);
        });
      });

      setBaseSelectorPath([].concat(_toConsumableArray(this.mainPath), [name]));

      subscribeToSagaAppending(function (saga) {
        _this2.sagas.push(saga);
        _this2.subscribersToSagaAppending.forEach(function (callback) {
          return callback(saga);
        });
      });

      this.realReducer = (0, _reduxImmutable.combineReducers)(this.reducers);

      this.deepInjectListeners.forEach(function (listener) {
        return listener(name);
      });

      onDeepInject(function (name) {
        _this2.deepInjectListeners.forEach(function (listener) {
          return listener(name);
        });
      });

      return this;
    }
  }], [{
    key: 'generateName',

    /**
     * Generate name from id.
     *
     * @returns {string} Name.
     */
    value: function generateName() {
      return 'entity-' + id++;
    }
    /**
     * Is used to allow lazy-loading reducers and prevent creating function every time.
     *
     * @param state
     * @param action
     * @returns {State|null}
     */


    /**
     * Reducer.
     *
     * @param {Object} state - React state.
     * @param {Object} action - Redux action.
     * @returns {State} State.
     */


    /**
     * Set base path.
     *
     * @param {string|Array} path - Path or array of paths.
     *
     * @returns {this} This instance for chains.
     */

  }]);

  return EntityStore;
}();