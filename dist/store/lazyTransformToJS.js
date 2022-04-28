'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lazyTransformToJS = lazyTransformToJS;

var _immutable = require('immutable');

/**
 * Creates object that transforms Immutable to JS on demand.
 *
 * This function is used to prevent memory leaks for development env.
 *
 * @param {*} state Current state from Redux store.
 * @returns {Object} Serialized state.
 */
function lazyTransformToJS(state) {
  var result = state;

  if (process.env.NODE_ENV !== 'production' && (0, _immutable.isImmutable)(state)) {
    result = {};

    state.forEach(function (part, key) {
      return Object.defineProperty(result, key, {
        /**
         * Calc value for the redux'es branch on demand.
         *
         * @returns {any} Object if branch is any Immutable object.
         * Or just value in other cases.
         */
        get: function get() {
          if (!(0, _immutable.isImmutable)(part)) return part;

          return part.toJS();
        },

        enumerable: true
      });
    });
  }

  return result;
}