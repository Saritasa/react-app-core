// @flow
import * as React from 'react';
import { Route } from 'react-router-dom';

type RouteShape = {
  ...$Exact<React.ElementProps<typeof Route>>,
  childRoutes?: Array<RouteShape>,
};

export class RouteStore {
  parentPath: string = '';
  name: string = '';
  routes: Array<RouteShape> = [];
  subscribers: Array<(Array<RouteShape>) => void> = [];
  pathSubscribers: Array<(string) => void> = [];

  subscribe(callback: (Array<RouteShape>) => void) {
    this.subscribers.push(callback);
    callback(this.getRoutes());
  }

  onParentPathChange(cb: string => void) {
    this.pathSubscribers.push(cb);
    cb(`${this.parentPath}/${this.name}`);
  }

  inject(routes: Array<RouteShape>): this {
    this.routes.push(...routes);
    this.callSubscribers();

    return this;
  }

  injectRouteStore(store: RouteStore): this {
    this.inject(store.setParentPath(this.parentPath).getRoutes());
    this.onParentPathChange((parentPath) => {
      store.setParentPath(parentPath);
    });

    return this;
  }

  setParentPath(parentPath: string): this {
    this.parentPath = parentPath;
    this.callParentPathSubscribers();

    return this;
  }

  setName(name: string): this {
    this.name = name;
    this.callParentPathSubscribers();

    return this;
  }

  getRoutes() {
    return [{
      path: this.name,
      childRoutes: [...this.routes],
    }];
  }

  callSubscribers() {
    this.subscribers.forEach(cb => cb(this.getRoutes()));
  }

  callParentPathSubscribers() {
    this.pathSubscribers.forEach(cb => cb(`${this.parentPath}/${this.name}`));
  }
}