'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createLink = createLink;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _Link = require('./Link');

var _InjectedPath = require('./InjectedPath');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Returns function that create static link with your path.
 *
 * @param {string} to - Path for link.
 * @returns {function(LinkProps): *} Function that create static link.
 */
function createLink(to) {
  /**
   * Returns React Link component.
   *
   * @param {Object} props - Props for link.
   * @returns {React.Node} React Link component.
   */
  var StaticLink = function StaticLink(props) {
    return React.createElement(_Link.Link, _extends({}, props, { to: to }));
  };

  return StaticLink;
}