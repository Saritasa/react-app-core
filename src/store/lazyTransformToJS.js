// @flow
import { isImmutable } from 'immutable';

/**
 * Creates object that transforms Immutable to JS on demand.
 *
 * This function is used to prevent memory leaks for development env.
 *
 * @param {*} state Current state from Redux store.
 * @returns {Object} Serialized state.
 */
export function lazyTransformToJS(state: *) {
  let result = state;

  if (process.env.NODE_ENV !== 'production' && isImmutable(state)) {
    result = {};

    state.forEach((part, key) =>
      Object.defineProperty(result, key, {
        /**
         * Calc value for the redux'es branch on demand.
         *
         * @returns {any} Object if branch is any Immutable object.
         * Or just value in other cases.
         */
        get() {
          if (!isImmutable(part)) return part;

          return part.toJS();
        },
        enumerable: true,
      }),
    );
  }

  return result;
}
