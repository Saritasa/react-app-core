'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeEnhancers = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redux = require('redux');

/* eslint-disable no-underscore-dangle */
/**
 * ??? Todo.
 *
 * @returns {$Compose} Enhanced ???.
 */
function getComposeEnhancers() {
  if (process.env.REACT_APP_TARGET !== 'client' || process.env.NODE_ENV === 'production' || typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    return _redux.compose;
  }

  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    serialize: true,
    actionSanitizer: function actionSanitizer(action) {
      var type = String(action.type);

      return _extends({}, action, { type: type });
    }
  });
}
/* eslint-enable no-underscore-dangle */

var composeEnhancers = exports.composeEnhancers = getComposeEnhancers();