'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouteStore = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactRouterDom = require('react-router-dom');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getPathInRoutesByToken(routes, injectToken) {
  var previousPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return routes.reduce(function (result, route) {
    if (result) return result;

    if (route.injectToken === injectToken) {
      return previousPath.filter(Boolean);
    } else if (route.childRoutes) {
      return getPathInRoutesByToken(route.childRoutes, injectToken, [].concat(_toConsumableArray(previousPath), [route.path]));
    }

    return null;
  }, null);
}

function injectRoutesByInjectToken(routes, routeToInject, injectToken) {
  return routes.some(function (route) {
    if (route.injectToken === injectToken) {
      Object.assign(route, routeToInject);

      return true;
    }

    if (route.childRoutes) {
      return injectRoutesByInjectToken(route.childRoutes, routeToInject, injectToken);
    }

    return false;
  });
}

/**
 * RouteStore class.
 */

var RouteStore = exports.RouteStore = function () {
  function RouteStore() {
    _classCallCheck(this, RouteStore);

    this.parentPath = '';
    this.name = '';
    this.injectToken = '';
    this.routes = [];
    this.subscribers = [];
    this.pathSubscribers = [];
  }

  _createClass(RouteStore, [{
    key: 'subscribe',


    /**
     * Subscribe.
     *
     * @param {Function} callback - Callback.
     */
    value: function subscribe(callback) {
      this.subscribers.push(callback);
      callback(this.getRoutes());
    }

    /**
     * On parent path change handler.
     *
     * @param {Function} cb - Callback.
     */

  }, {
    key: 'onParentPathChange',
    value: function onParentPathChange(cb) {
      this.pathSubscribers.push(cb);
      cb(this.parentPath + '/' + this.name);
    }

    /**
     * Inject store to children.
     *
     * @param {Array} routes - Array of routes.
     * @returns {RouteStore} This instance for chains.
     */

  }, {
    key: 'inject',
    value: function inject(routes) {
      var _routes;

      (_routes = this.routes).push.apply(_routes, _toConsumableArray(routes));

      this.callSubscribers();

      return this;
    }

    /**
     * Inject store to children by inject token.
     *
     * @param {RouteStore} store - Store to inject.
     * @param {string} [injectToken] - Token which describe where routes should be injected.
     * @returns {RouteStore} This instance for chains.
     */

  }, {
    key: 'injectByToken',
    value: function injectByToken(store, injectToken) {
      var pathByToken = this.getPathByToken(injectToken);

      var rootRouteToInject = store.setParentPath(pathByToken).getRootRoute();
      var injected = injectRoutesByInjectToken(this.routes, rootRouteToInject, injectToken);

      if (!injected) {
        throw new Error('Did not found inject token "' + injectToken + '"');
      }
      this.callSubscribers();

      return this;
    }

    /**
     * Gets path for injectToken.
     *
     * @param {string} [injectToken] - Token which describe where routes should be injected.
     * @returns {RouteStore} This instance for chains.
     */

  }, {
    key: 'getPathByToken',
    value: function getPathByToken(injectToken) {
      var path = getPathInRoutesByToken(this.routes, injectToken);

      if (!path) {
        throw new Error('Did not found inject token "' + injectToken + '"');
      }

      return [this.parentPath, this.name].concat(_toConsumableArray(path)).join('/').replace(/\/+/g, '/');
    }

    /**
     * Inject Route Store.
     *
     * @param {RouteStore} store - Route store.
     * @returns {RouteStore} This instance for chains.
     */

  }, {
    key: 'injectRouteStore',
    value: function injectRouteStore(store) {
      var _this = this;

      var injectToken = store.injectToken;


      if (!injectToken) {
        this.inject(store.setParentPath(this.parentPath).getRoutes());
        this.onParentPathChange(function (parentPath) {
          store.setParentPath(parentPath);
        });
      } else {
        this.injectByToken(store, injectToken);
        this.onParentPathChange(function () {
          store.setParentPath(_this.getPathByToken(injectToken));
        });
      }

      return this;
    }

    /**
     * Set parent path.
     *
     * @param {string} parentPath - Parent path.
     * @returns {RouteStore} This instance for chains.
     */

  }, {
    key: 'setParentPath',
    value: function setParentPath(parentPath) {
      this.parentPath = parentPath;
      this.callParentPathSubscribers();

      return this;
    }

    /**
     * Set name.
     *
     * @param {string} name - New name.
     * @returns {RouteStore} This instance for chains.
     */

  }, {
    key: 'setName',
    value: function setName(name) {
      this.name = name;
      this.callParentPathSubscribers();

      return this;
    }

    /**
     * Sets inject token for route store.
     *
     * Inject token is used for nesting routes.
     *
     * @param {string} injectToken
     * @returns {RouteStore}
     */

  }, {
    key: 'setInjectToken',
    value: function setInjectToken(injectToken) {
      this.injectToken = injectToken;

      return this;
    }

    /**
     * Returns array of routes.
     *
     * @returns {*[]} Array with object with path, childRoutes.
     */

  }, {
    key: 'getRoutes',
    value: function getRoutes() {
      return [{
        path: this.name,
        childRoutes: [].concat(_toConsumableArray(this.routes))
      }];
    }

    /**
     * Returns array of routes.
     *
     * @returns {RouteShape} Root route with child routes.
     */

  }, {
    key: 'getRootRoute',
    value: function getRootRoute() {
      return {
        path: this.name,
        childRoutes: [].concat(_toConsumableArray(this.routes))
      };
    }

    /**
     * Run all subscribers.
     */

  }, {
    key: 'callSubscribers',
    value: function callSubscribers() {
      var _this2 = this;

      this.subscribers.forEach(function (cb) {
        return cb(_this2.getRoutes());
      });
    }

    /**
     * Run all parent path subscribers.
     */

  }, {
    key: 'callParentPathSubscribers',
    value: function callParentPathSubscribers() {
      var _this3 = this;

      this.pathSubscribers.forEach(function (cb) {
        return cb((_this3.parentPath + '/' + _this3.name).replace(/\/+/g, '/'));
      });
    }
  }]);

  return RouteStore;
}();