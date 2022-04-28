// @flow
import { compose } from 'redux';

/* eslint-disable no-underscore-dangle */
/**
 * ??? Todo.
 *
 * @returns {$Compose} Enhanced ???.
 */
function getComposeEnhancers() {
  if (
    process.env.REACT_APP_TARGET !== 'client' ||
    process.env.NODE_ENV === 'production' ||
    typeof window === 'undefined' ||
    !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) {
    return compose;
  }

  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    serialize: true,
    actionSanitizer: action => {
      const type = String(action.type);

      return { ...action, type };
    },
  });
}
/* eslint-enable no-underscore-dangle */

export const composeEnhancers = getComposeEnhancers();
