// @flow
const defaultDevTool = <T>(arg: T): T => arg;

/**
 * ??? todo.
 *
 * @returns {function(T): T} ??? todo.
 */
function getDevTools() {
  if (
    process.env.ON_SERVER === false ||
    process.env.NODE_ENV !== 'production' ||
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
