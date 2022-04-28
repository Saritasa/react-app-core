'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInitialState = getInitialState;

var _immutable = require('immutable');

var Immutable = _interopRequireWildcard(_immutable);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Create initial state.
 *
 * @returns {Immutable.Map} Initial state.
 */
function getInitialState() {
  return Immutable.Map();
}