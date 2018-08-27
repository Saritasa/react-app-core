// @flow
const middlewareCreators = [];


export function addMiddlewareCreator(middlewareCreator: () => *) {
  middlewareCreators.push(middlewareCreator);
}

export function getMiddlewareCreators() {
  return [...middlewareCreators];
}
