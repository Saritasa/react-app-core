// @flow
import { Iterable } from 'immutable';

/**
 * Data transformer.
 *
 * @param {Object} state - State.
 * @returns {Object} Transformed state.
 */
export function lazyTransformToJS(state: *) {
  let result = state;

  if (process.env.NODE_ENV !== 'production' && Iterable.isIterable(state)) {
    result = {};

    state.forEach((part, key) =>
      Object.defineProperty(result, key, {
        /**
         * Transform to JS if need.
         *
         * @returns {Object} Plain JS object.
         */
        get() {
          if (!Iterable.isIterable(part)) return part;

          return part.toJS();
        },
        enumerable: true,
      }),
    );
  }

  return result;
}
