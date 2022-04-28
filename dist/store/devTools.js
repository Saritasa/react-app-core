'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultDevTool = function defaultDevTool(arg) {
  return arg;
};

/**
 * ??? Todo.
 *
 * @returns {function(T): T} ??? Todo.
 */
function getDevTools() {
  if (process.env.REACT_APP_TARGET !== 'client' || process.env.NODE_ENV === 'production' || typeof window === 'undefined' || window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || !window.devToolsExtension) {
    return defaultDevTool;
  }

  return window.devToolsExtension({
    actionSanitizer: function actionSanitizer(action) {
      var type = String(action.type);

      return _extends({}, action, { type: type });
    }
  });
}

var devTools = exports.devTools = getDevTools();