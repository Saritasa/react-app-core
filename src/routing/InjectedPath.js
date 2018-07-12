// @flow
import { RouteStore } from './RouteStore';

export class InjectedPath {
  currentPath: string;
  parentPath: string;
  listeners = [];

  static of(currentPath: string) {
    const injectedRoute = new InjectedPath();

    injectedRoute.currentPath = currentPath;

    return injectedRoute;
  }

  store(routeStore: RouteStore) {
    routeStore.onParentPathChange(parentPath => {
      this.parentPath = parentPath;
      this.update();
    });

    return this;
  }

  getPath() {
    return [this.parentPath, this.currentPath].join('/').replace(/\/+/g, '/');
  }

  update() {
    this.listeners.forEach(listener => listener());
  }

  on(cb: *) {
    this.listeners.push(cb);
  }

  off(cb: *) {
    this.listeners = this.listeners.filter(listener => listener !== cb);
  }
}