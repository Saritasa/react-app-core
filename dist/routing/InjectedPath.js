'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InjectedPath = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RouteStore = require('./RouteStore');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * InjectedPath Class.
 */
var InjectedPath = exports.InjectedPath = function () {
  function InjectedPath() {
    _classCallCheck(this, InjectedPath);

    this.listeners = [];
  }

  _createClass(InjectedPath, [{
    key: 'store',


    /**
     * Add onParentPathChange to routeStore.
     *
     * @param {Object} routeStore - Router store.
     * @returns {InjectedPath} This instance for chains.
     */
    value: function store(routeStore) {
      var _this = this;

      routeStore.onParentPathChange(function (parentPath) {
        _this.parentPath = parentPath;
        _this.update();
      });

      return this;
    }

    /**
     * Returns path string.
     *
     * @returns {string} Path.
     */

  }, {
    key: 'getPath',
    value: function getPath() {
      return [this.parentPath, this.currentPath].join('/').replace(/\/+/g, '/');
    }

    /**
     * Run all listeners.
     */

  }, {
    key: 'update',
    value: function update() {
      this.listeners.forEach(function (listener) {
        return listener();
      });
    }

    /**
     * Add callback to listeners.
     *
     * @param {Function} cb - Callback.
     */

  }, {
    key: 'on',
    value: function on(cb) {
      this.listeners.push(cb);
    }

    /**
     * Remove callback from listeners.
     *
     * @param {Function} cb - Callback.
     */

  }, {
    key: 'off',
    value: function off(cb) {
      this.listeners = this.listeners.filter(function (listener) {
        return listener !== cb;
      });
    }
  }], [{
    key: 'of',


    /**
     * Returns new instance with new path.
     *
     * @param {string} currentPath - New path.
     * @returns {InjectedPath} New instance of InjectedPath with your path.
     */
    value: function of(currentPath) {
      var injectedRoute = new InjectedPath();

      injectedRoute.currentPath = currentPath;

      return injectedRoute;
    }
  }]);

  return InjectedPath;
}();