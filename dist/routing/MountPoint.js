'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MountPoint = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactRouterDom = require('react-router-dom');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * MountPointPlain class wrapped withRouter.
 */
var MountPoint = (0, _reactRouterDom.withRouter)(
/**
 * MountPointPlain class.
 */
function (_React$PureComponent) {
  _inherits(MountPointPlain, _React$PureComponent);

  function MountPointPlain() {
    _classCallCheck(this, MountPointPlain);

    return _possibleConstructorReturn(this, (MountPointPlain.__proto__ || Object.getPrototypeOf(MountPointPlain)).apply(this, arguments));
  }

  _createClass(MountPointPlain, [{
    key: 'render',


    /**
     * Render method.
     *
     * @returns {?string} HTML markup or null.
     */
    value: function render() {
      var _props = this.props,
          childRoutes = _props.childRoutes,
          _props$component = _props.component,
          Component = _props$component === undefined ? React.Fragment : _props$component,
          path = _props.path,
          isSwitch = _props.isSwitch,
          route = _objectWithoutProperties(_props, ['childRoutes', 'component', 'path', 'isSwitch']);

      if (route.render) {
        throw new Error('#render is not allowed property for route configuration.');
      }

      if (route.children) {
        throw new Error('#children is not allowed property for route configuration.');
      }

      /**
       * Function returns component for render.
       *
       * @param {Object} match - Router object with url.
       * @returns {React.Node} React component.
       */
      var render = function render(_ref) {
        var match = _ref.match;

        var content = childRoutes.map(function (childRoute, i) {
          return React.createElement(MountPoint, _extends({
            key: (childRoute.path || '---') + ':' + i + '-' + match.path
          }, MountPointPlain.getRouteProps([].concat(match.path), childRoute)));
        });

        if (typeof Component === 'string' || Component === React.Fragment) {
          return React.createElement(
            Component,
            null,
            content
          );
        }

        return React.createElement(
          Component,
          { match: match },
          content
        );
      };

      if (isSwitch) {
        if (!childRoutes) {
          throw new Error("Can't use Route.isSwitch without childRoutes.");
        }

        if (typeof Component === 'string' || Component === React.Fragment) {
          return React.createElement(_reactRouterDom.Route, {
            path: path,
            render: function render(_ref2) {
              var match = _ref2.match;
              return React.createElement(
                Component,
                null,
                React.createElement(
                  _reactRouterDom.Switch,
                  route,
                  childRoutes.map(function (route, index) {
                    return React.createElement(MountPoint, _extends({
                      key: route.path + ':' + index + '-' + match.path
                    }, MountPointPlain.getRouteProps([].concat(match.path), route)));
                  })
                )
              );
            }
          });
        }

        return React.createElement(_reactRouterDom.Route, {
          path: path,
          render: function render(_ref3) {
            var match = _ref3.match;
            return React.createElement(
              Component,
              { match: match },
              React.createElement(
                _reactRouterDom.Switch,
                route,
                childRoutes.map(function (route, index) {
                  return React.createElement(MountPoint, _extends({
                    key: route.path + ':' + index + '-' + match.path
                  }, MountPointPlain.getRouteProps([].concat(match.path), route)));
                })
              )
            );
          }
        });
      }

      return React.createElement(_reactRouterDom.Route, _extends({}, route, { path: path, render: render }));
    }
  }], [{
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
    value: function getRouteProps(parentRoutes, _ref4) {
      var _ref5;

      var _ref4$childRoutes = _ref4.childRoutes,
          childRoutes = _ref4$childRoutes === undefined ? [] : _ref4$childRoutes,
          _ref4$path = _ref4.path,
          path = _ref4$path === undefined ? '' : _ref4$path,
          route = _objectWithoutProperties(_ref4, ['childRoutes', 'path']);

      return _extends({}, route, {
        childRoutes: childRoutes,
        path: (_ref5 = []).concat.apply(_ref5, _toConsumableArray(parentRoutes.map(function (parentRoute) {
          return Array.isArray(path) ? path.map(function (singlePath) {
            return (parentRoute + '/' + singlePath).replace(/\/+/g, '/');
          }) : (parentRoute + '/' + path).replace(/\/+/g, '/');
        })))
      });
    }
  }]);

  return MountPointPlain;
}(React.PureComponent));
exports.MountPoint = MountPoint;