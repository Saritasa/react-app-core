// @flow
import * as React from 'react';
import { Route } from 'react-router-dom';

type RouteShape = {
  ...$Exact<React.ElementProps<typeof Route>>,
  childRoutes?: Array<RouteShape>,
};

/**
 * RouteStore class.
 */
export class RouteStore {
  parentPath: string = '';
  name: string = '';
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
   * @param {Array} routes - ComposeStore instance.
   * @returns {RouteStore} This instance for chains.
   */
  inject(routes: Array<RouteShape>): this {
    this.routes.push(...routes);
    this.callSubscribers();

    return this;
  }

  /**
   * Inject Route Store.
   *
   * @param {RouteStore} store - Route store.
   * @returns {RouteStore} This instance for chains.
   */
  injectRouteStore(store: RouteStore): this {
    this.inject(store.setParentPath(this.parentPath).getRoutes());
    this.onParentPathChange(parentPath => {
      store.setParentPath(parentPath);
    });

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
   * Run all subscribers.
   */
  callSubscribers() {
    this.subscribers.forEach(cb => cb(this.getRoutes()));
  }

  /**
   * Run all parent path subscribers.
   */
  callParentPathSubscribers() {
    this.pathSubscribers.forEach(cb => cb(`${this.parentPath}/${this.name}`));
  }
}
