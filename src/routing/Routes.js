// @flow
import * as React from 'react';
import { Route } from 'react-router-dom'

import { RouteStore } from './RouteStore'
import {MountPoint} from "./MountPoint";

type RouterComponentProps = {| routeStore: RouteStore, location?: any |};
type RouterComponentState = { routeStore: ?RouteStore, routes: Array<*> };

export class Routes extends React.PureComponent<RouterComponentProps, RouterComponentState> {
  static getDerivedStateFromProps(props: RouterComponentProps, state: RouterComponentState) {
    if (!state.routeStore) {
      return { routeStore: props.routeStore };
    }

    if (props.routeStore !== state.routeStore) {
      throw new Error('Can\'t update routeStore in hot mode.');
    }

    return state;
  }

  static getRouteProps(parentRoute: string, { childRoutes = [], path = '', ...route }: *) {
    return {
      ...route,
      childRoutes,
      path:`${parentRoute}/${path}`.replace(/\/+/g, '/'),
    };
  }

  static renderRoute({ path, ...route }: *, index: number) {
    const render = ({match}) => (
      <MountPoint match={match} {...route} path={path} />
    );

    return (
      <Route
        key={`${path}:${index}`}
        {...route}
        path={path}
        render={render}
      />
    );
  }

  state = { routes: [], routeStore: null };

  componentDidMount() {
    if (!this.state.routeStore) {
      throw new Error('componentDidMount called without #routeStore. This should never happened. Please change if you passed #routeStore property to RouteComponent.');
    }
    this.state.routeStore.subscribe(this.handleRouteUpdates)
  }

  handleRouteUpdates = (routes: Array<*>) => {
    this.setState(() => ({ routes }));
  };

  render() {
    return (
      <div>
        {this.state.routes.map((route, index) => Routes.renderRoute(Routes.getRouteProps('/', route), index))}
      </div>
    );
  }
}