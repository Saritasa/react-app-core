'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.sanitizeProps = sanitizeProps;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Get props without param route.
 *
 * @param {string} route - Route to component.
 * @param {Object} props - Params.
 * @returns {string} String with path divided by /.
 */
function sanitizeProps(route, props) {
  var routeParts = route.split('/');

  var withoutAppliedParams = routeParts.reduce(function (props, part) {
    if (!part.startsWith(':')) {
      return props;
    }

    var paramName = part.slice(1);

    var _ = props[paramName],
        nextProps = _objectWithoutProperties(props, [paramName]);

    return nextProps;
  }, props);

  return removePropsEndsWithId(withoutAppliedParams);
}

function removePropsEndsWithId(props) {
  return Object.keys(props).filter(function (key) {
    return !key.endsWith('Id');
  }).reduce(function (accum, key) {
    return _extends({}, accum, _defineProperty({}, key, props[key]));
  }, {});
}