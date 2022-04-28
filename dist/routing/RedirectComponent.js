'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RedirectComponent = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactRouterDom = require('react-router-dom');

var _InjectedPath = require('./InjectedPath');

var _getFullRoute = require('./getFullRoute');

var _sanitizeProps = require('./sanitizeProps');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Redirect class.
 */
var RedirectComponentPure = function (_React$PureComponent) {
  _inherits(RedirectComponentPure, _React$PureComponent);

  function RedirectComponentPure() {
    _classCallCheck(this, RedirectComponentPure);

    return _possibleConstructorReturn(this, (RedirectComponentPure.__proto__ || Object.getPrototypeOf(RedirectComponentPure)).apply(this, arguments));
  }

  _createClass(RedirectComponentPure, [{
    key: 'redirectOrSkip',

    /**
     * Skips redirect in case of target url is the same as current.
     *
     * @param {string} to Target url.
     * @returns {React.Node|null}
     */
    value: function redirectOrSkip(to) {
      var _props = this.props,
          _ = _props.to,
          match = _props.match,
          location = _props.location,
          rest = _objectWithoutProperties(_props, ['to', 'match', 'location']);

      if (typeof window !== 'undefined') {
        if (window.location.pathname === to) {
          console.warn('Can\'t redirect from ' + window.location.pathname + ' to ' + to + '. Do nothing.');

          return null;
        }
      }

      return React.createElement(_reactRouterDom.Redirect, _extends({}, (0, _sanitizeProps.sanitizeProps)(to, rest), { to: to }));
    }

    /**
     * Render method.
     *
     * @returns {?string} HTML markup or null.
     */

  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          to = _props2.to,
          match = _props2.match,
          location = _props2.location,
          rest = _objectWithoutProperties(_props2, ['to', 'match', 'location']);

      if (to instanceof _InjectedPath.InjectedPath || typeof to === 'string') {
        return this.redirectOrSkip((0, _getFullRoute.getFullRoute)(to, rest));
      }

      return React.createElement(_reactRouterDom.Redirect, _extends({}, rest, { to: to }));
    }
  }]);

  return RedirectComponentPure;
}(React.PureComponent);

var RedirectComponent = exports.RedirectComponent = (0, _reactRouterDom.withRouter)(RedirectComponentPure);