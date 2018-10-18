// @flow
import * as React from 'react';
import { Route } from 'react-router-dom';

type RouteShape = {
  ...$Exact<React.ElementProps<typeof Route>>,
  injectToken?: string,
  childRoutes?: Array<RouteShape>,
  isSwitch?: boolean,
};

function getPathInRoutesByToken(routes, injectToken, previousPath = []) {
  return routes.reduce((result, route) => {
    if (result) return result;

    if (route.injectToken === injectToken) {
      return previousPath.filter(Boolean);
    } else if (route.childRoutes) {
      return getPathInRoutesByToken(route.childRoutes, injectToken, [
        ...previousPath,
        route.path,
      ]);
    }

    return null;
  }, null);
}

function injectRoutesByInjectToken(
  routes: Array<RouteShape>,
  routeToInject: RouteShape,
  injectToken,
) {
  return routes.some(route => {
    if (route.injectToken === injectToken) {
      Object.assign(route, routeToInject);

      return true;
    }

    if (route.childRoutes) {
      return injectRoutesByInjectToken(
        route.childRoutes,
        routeToInject,
        injectToken,
      );
    }

    return false;
  });
}

/**
 * RouteStore class.
 */
export class RouteStore {
  parentPath: string = '';
  name: string = '';
  injectToken: string = '';
  routes: Array<RouteShape> = [];
  subscribers: Array<(Array<RouteShape>) => void> = [];
  pathSubscribers: Array<(string) => void> = [];

  /**
   * Subscribe.
   *
   * @param {Function} callback - Callback.
   */
  subscribe(callback: (Array<RouteShape>) => void) {
    this.subscribers.push(callback);
    callback(this.getRoutes());
  }

  /**
   * On parent path change handler.
   *
   * @param {Function} cb - Callback.
   */
  onParentPathChange(cb: string => void) {
    this.pathSubscribers.push(cb);
    cb(`${this.parentPath}/${this.name}`);
  }

  /**
   * Inject store to children.
   *
   * @param {Array} routes - Array of routes.
   * @returns {RouteStore} This instance for chains.
   */
  inject(routes: Array<RouteShape>): this {
    this.routes.push(...routes);

    this.callSubscribers();

    return this;
  }

  /**
   * Inject store to children by inject token.
   *
   * @param {RouteStore} store - Store to inject.
   * @param {string} [injectToken] - Token which describe where routes should be injected.
   * @returns {RouteStore} This instance for chains.
   */
  injectByToken(store: RouteStore, injectToken: string): this {
    const pathByToken = this.getPathByToken(injectToken);

    const rootRouteToInject = store.setParentPath(pathByToken).getRootRoute();
    const injected = injectRoutesByInjectToken(
      this.routes,
      rootRouteToInject,
      injectToken,
    );

    if (!injected) {
      throw new Error(`Did not found inject token "${injectToken}"`);
    }
    this.callSubscribers();

    return this;
  }

  /**
   * Gets path for injectToken.
   *
   * @param {string} [injectToken] - Token which describe where routes should be injected.
   * @returns {RouteStore} This instance for chains.
   */
  getPathByToken(injectToken: string) {
    const path = getPathInRoutesByToken(this.routes, injectToken);

    if (!path) {
      throw new Error(`Did not found inject token "${injectToken}"`);
    }

    return [this.parentPath, this.name, ...path].join('/').replace(/\/+/g, '/');
  }

  /**
   * Inject Route Store.
   *
   * @param {RouteStore} store - Route store.
   * @returns {RouteStore} This instance for chains.
   */
  injectRouteStore(store: RouteStore): this {
    const { injectToken } = store;

    if (!injectToken) {
      this.inject(store.setParentPath(this.parentPath).getRoutes());
      this.onParentPathChange(parentPath => {
        store.setParentPath(parentPath);
      });
    } else {
      this.injectByToken(store, injectToken);
      this.onParentPathChange(() => {
        store.setParentPath(this.getPathByToken(injectToken));
      });
    }

    return this;
  }

  /**
   * Set parent path.
   *
   * @param {string} parentPath - Parent path.
   * @returns {RouteStore} This instance for chains.
   */
  setParentPath(parentPath: string): this {
    this.parentPath = parentPath;
    this.callParentPathSubscribers();

    return this;
  }

  /**
   * Set name.
   *
   * @param {string} name - New name.
   * @returns {RouteStore} This instance for chains.
   */
  setName(name: string): this {
    this.name = name;
    this.callParentPathSubscribers();

    return this;
  }

  /**
   * Sets inject token for route store.
   *
   * Inject token is used for nesting routes.
   *
   * @param {string} injectToken
   * @returns {RouteStore}
   */
  setInjectToken(injectToken: string): this {
    this.injectToken = injectToken;

    return this;
  }

  /**
   * Returns array of routes.
   *
   * @returns {*[]} Array with object with path, childRoutes.
   */
  getRoutes() {
    return [
      {
        path: this.name,
        childRoutes: [...this.routes],
      },
    ];
  }

  /**
   * Returns array of routes.
   *
   * @returns {RouteShape} Root route with child routes.
   */
  getRootRoute(): RouteShape {
    return {
      path: this.name,
      childRoutes: [...this.routes],
    };
  }

  /**
   * Run all subscribers.
   */
  callSubscribers() {
    this.subscribers.forEach(cb => cb(this.getRoutes()));
  }

  /**
   * Run all parent path subscribers.
   */
  callParentPathSubscribers() {
    this.pathSubscribers.forEach(cb =>
      cb(`${this.parentPath}/${this.name}`.replace(/\/+/g, '/')),
    );
  }
}
