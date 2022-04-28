'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Link = undefined;

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
 * Link class.
 */
var Link = exports.Link = function (_React$PureComponent) {
  _inherits(Link, _React$PureComponent);

  function Link() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Link);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Link.__proto__ || Object.getPrototypeOf(Link)).call.apply(_ref, [this].concat(args))), _this), _this.state = { to: '', injectedRoute: null }, _this.handlePathUpdate = function () {
      var to = _this.props.to;


      if (!(to instanceof _InjectedPath.InjectedPath)) {
        throw new Error('Update injected route without injected route.');
      }

      _this.setState(function () {
        return {
          to: to.getPath()
        };
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Link, [{
    key: 'componentDidMount',


    /**
     * React event.
     * Invoked immediately after a component is mounted.
     */
    value: function componentDidMount() {
      var to = this.props.to;


      if (to instanceof _InjectedPath.InjectedPath) {
        to.on(this.handlePathUpdate);
        this.handlePathUpdate();
      }
    }

    /**
     * React event.
     * Invoked immediately before a component is unmounted and destroyed.
     */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var to = this.props.to;


      if (to instanceof _InjectedPath.InjectedPath) {
        to.off(this.handlePathUpdate);
      }
    }

    /**
     * Path update handler.
     */

  }, {
    key: 'render',


    /**
     * Render method.
     *
     * @returns {?string} HTML markup or null.
     */
    value: function render() {
      var _props = this.props,
          propTo = _props.to,
          rest = _objectWithoutProperties(_props, ['to']);

      var stateTo = this.state.to;


      if (propTo instanceof _InjectedPath.InjectedPath) {
        return React.createElement(_reactRouterDom.NavLink, _extends({}, (0, _sanitizeProps.sanitizeProps)(stateTo, rest), {
          to: (0, _getFullRoute.getFullRoute)(stateTo, rest)
        }));
      }

      if (typeof propTo === 'string') {
        return React.createElement(_reactRouterDom.NavLink, _extends({}, (0, _sanitizeProps.sanitizeProps)(propTo, rest), {
          to: (0, _getFullRoute.getFullRoute)(propTo, rest)
        }));
      }

      return React.createElement(_reactRouterDom.NavLink, _extends({}, rest, { to: propTo }));
    }
  }]);

  return Link;
}(React.PureComponent);