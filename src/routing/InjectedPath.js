// @flow
import { RouteStore } from './RouteStore';

/**
 * InjectedPath Class.
 */
export class InjectedPath {
  currentPath: string;
  parentPath: string;
  listeners = [];

  /**
   * Returns new instance with new path.
   *
   * @param {string} currentPath - New path.
   * @returns {InjectedPath} New instance of InjectedPath with your path.
   */
  static of(currentPath: string) {
    const injectedRoute = new InjectedPath();

    injectedRoute.currentPath = currentPath;

    return injectedRoute;
  }

  /**
   * Add onParentPathChange to routeStore.
   *
   * @param {Object} routeStore - Router store.
   * @returns {InjectedPath} This instance for chains.
   */
  store(routeStore: RouteStore) {
    routeStore.onParentPathChange(parentPath => {
      this.parentPath = parentPath;
      this.update();
    });

    return this;
  }

  /**
   * Returns path string.
   *
   * @returns {string} Path.
   */
  getPath() {
    return [this.parentPath, this.currentPath].join('/').replace(/\/+/g, '/');
  }

  /**
   * Run all listeners.
   */
  update() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Add callback to listeners.
   *
   * @param {Function} cb - Callback.
   */
  on(cb: *) {
    this.listeners.push(cb);
  }

  /**
   * Remove callback from listeners.
   *
   * @param {Function} cb - Callback.
   */
  off(cb: *) {
    this.listeners = this.listeners.filter(listener => listener !== cb);
  }
}
