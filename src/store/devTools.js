// @flow
const defaultDevTool = <T>(arg: T): T => arg;

/**
 * ??? Todo.
 *
 * @returns {function(T): T} ??? Todo.
 */
function getDevTools() {
  if (
    process.env.REACT_APP_TARGET !== 'client' ||
    process.env.NODE_ENV === 'production' ||
    typeof window === 'undefined' ||
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ||
    !window.devToolsExtension
  ) {
    return defaultDevTool;
  }

  return window.devToolsExtension({
    actionSanitizer: action => {
      const type = String(action.type);

      return { ...action, type };
    },
  });
}

export const devTools = getDevTools();
