'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Routes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactRouterDom = require('react-router-dom');

var _RouteStore = require('./RouteStore');

var _MountPoint = require('./MountPoint');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Routes class.
 *
 * @param {Array} routes - Array of routes.
 */
var Routes = exports.Routes = function (_React$PureComponent) {
  _inherits(Routes, _React$PureComponent);

  function Routes() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Routes);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Routes.__proto__ || Object.getPrototypeOf(Routes)).call.apply(_ref, [this].concat(args))), _this), _this.state = { routes: [], routeStore: null }, _this.handleRouteUpdates = function (routes) {
      _this.setState(function () {
        return { routes: routes };
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Routes, [{
    key: 'componentDidMount',


    /**
     * React event.
     * Invoked immediately after a component is mounted.
     */
    value: function componentDidMount() {
      if (!this.state.routeStore) {
        throw new Error('componentDidMount called without #routeStore. This should never happened. Please change if you passed #routeStore property to RouteComponent.');
      }
      this.state.routeStore.subscribe(this.handleRouteUpdates);
    }
  }, {
    key: 'render',


    /**
     * Render method.
     *
     * @returns {?string} HTML markup or null.
     */
    value: function render() {
      return React.createElement(
        'div',
        null,
        this.state.routes.map(function (route, index) {
          return Routes.renderRoute(Routes.getRouteProps(['/'], route), index);
        })
      );
    }
  }], [{
    key: 'getDerivedStateFromProps',


    /**
     * React event.
     * Invoked right before calling the render method.
     *
     * @param {Object} props - React props.
     * @param {Object} state - React state.
     * @returns {Object} State.
     */
    value: function getDerivedStateFromProps(props, state) {
      if (!state.routeStore) {
        return { routeStore: props.routeStore };
      }

      if (props.routeStore !== state.routeStore) {
        throw new Error("Can't update routeStore in hot mode.");
      }

      return state;
    }
  }, {
    key: 'getRouteProps',


    /**
     * Returns object with path.
     *
     * @param {Array<string>} parentRoutes - Parent route.
     * @param {Array} childRoutes - Child routes.
     * @param {string} path - Path.
     * @param {*} route - Rest props.
     * @returns {{childRoutes: Array, path: string}} Route props.
     */
    value: function getRouteProps(parentRoutes, _ref2) {
      var _ref3;

      var _ref2$childRoutes = _ref2.childRoutes,
          childRoutes = _ref2$childRoutes === undefined ? [] : _ref2$childRoutes,
          _ref2$path = _ref2.path,
          path = _ref2$path === undefined ? '' : _ref2$path,
          route = _objectWithoutProperties(_ref2, ['childRoutes', 'path']);

      return _extends({}, route, {
        childRoutes: childRoutes,
        path: (_ref3 = []).concat.apply(_ref3, _toConsumableArray(parentRoutes.map(function (parentRoute) {
          return Array.isArray(path) ? path.map(function (singlePath) {
            return (parentRoute + '/' + singlePath).replace(/\/+/g, '/');
          }) : (parentRoute + '/' + path).replace(/\/+/g, '/');
        })))
      });
    }

    /**
     * Returns Router component.
     *
     * @param {Array<string>} path - Path.
     * @param {boolean} isSwitch - If true - use switch, else will be rendered as regular route.
     * @param {number} index - Index.
     * @param {*} route - Rest routes.
     * @returns {React.Node} Router component.
     */

  }, {
    key: 'renderRoute',
    value: function renderRoute(_ref4, index) {
      var path = _ref4.path,
          _ref4$isSwitch = _ref4.isSwitch,
          isSwitch = _ref4$isSwitch === undefined ? false : _ref4$isSwitch,
          route = _objectWithoutProperties(_ref4, ['path', 'isSwitch']);

      /**
       * Returns Route component.
       *
       * @param {Object} match - Router object with url.
       * @returns {React.Node} React component.
       */
      var render = function render(_ref5) {
        var match = _ref5.match;
        return React.createElement(_MountPoint.MountPoint, _extends({ match: match }, route, { path: path }));
      };

      if (isSwitch) {
        if (!route.childRoutes) {
          throw new Error("Can't use Route.isSwitch without childRoutes");
        }

        return React.createElement(
          _reactRouterDom.Switch,
          _extends({ key: path + ':' + index }, route),
          route.childRoutes.map(function (route, index) {
            return Routes.renderRoute(Routes.getRouteProps(path, route), index);
          })
        );
      }

      return React.createElement(_reactRouterDom.Route, _extends({ key: path + ':' + index }, route, { path: path, render: render }));
    }
  }]);

  return Routes;
}(React.PureComponent);