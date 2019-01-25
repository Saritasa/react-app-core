// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { RouteStore } from './RouteStore';
import { MountPoint } from './MountPoint';

type Props = {| routeStore: RouteStore, location?: any |};
type State = { routeStore: ?RouteStore, routes: Array<*> };

/**
 * Routes class.
 *
 * @param {Array} routes - Array of routes.
 */
export class Routes extends React.PureComponent<Props, State> {
  state = { routes: [], routeStore: null };

  /**
   * React event.
   * Invoked right before calling the render method.
   *
   * @param {Object} props - React props.
   * @param {Object} state - React state.
   * @returns {Object} State.
   */
  static getDerivedStateFromProps(props: Props, state: State) {
    if (!state.routeStore) {
      return { routeStore: props.routeStore };
    }

    if (props.routeStore !== state.routeStore) {
      throw new Error("Can't update routeStore in hot mode.");
    }

    return state;
  }

  /**
   * React event.
   * Invoked immediately after a component is mounted.
   */
  componentDidMount() {
    if (!this.state.routeStore) {
      throw new Error(
        'componentDidMount called without #routeStore. This should never happened. Please change if you passed #routeStore property to RouteComponent.',
      );
    }
    this.state.routeStore.subscribe(this.handleRouteUpdates);
  }

  handleRouteUpdates = (routes: Array<*>) => {
    this.setState(() => ({ routes }));
  };

  /**
   * Returns object with path.
   *
   * @param {Array<string>} parentRoutes - Parent route.
   * @param {Array} childRoutes - Child routes.
   * @param {string} path - Path.
   * @param {*} route - Rest props.
   * @returns {{childRoutes: Array, path: string}} Route props.
   */
  static getRouteProps(
    parentRoutes: Array<string>,
    { childRoutes = [], path = '', ...route }: *,
  ) {
    return {
      ...route,
      childRoutes,
      path: [].concat(
        ...parentRoutes.map(parentRoute =>
          Array.isArray(path)
            ? path.map(singlePath =>
                `${parentRoute}/${singlePath}`.replace(/\/+/g, '/'),
              )
            : `${parentRoute}/${path}`.replace(/\/+/g, '/'),
        ),
      ),
    };
  }

  /**
   * Returns Router component.
   *
   * @param {Array<string>} path - Path.
   * @param {boolean} isSwitch - If true - use switch, else will be rendered as regular route.
   * @param {number} index - Index.
   * @param {*} route - Rest routes.
   * @returns {React.Node} Router component.
   */
  static renderRoute({ path, isSwitch = false, ...route }: *, index: number) {
    /**
     * Returns Route component.
     *
     * @param {Object} match - Router object with url.
     * @returns {React.Node} React component.
     */
    const render = ({ match }) => (
      <MountPoint match={match} {...route} path={path} />
    );

    if (isSwitch) {
      if (!route.childRoutes) {
        throw new Error("Can't use Route.isSwitch without childRoutes");
      }

      return (
        <Switch key={`${path}:${index}`} {...route}>
          {route.childRoutes.map((route, index) =>
            Routes.renderRoute(Routes.getRouteProps(path, route), index),
          )}
        </Switch>
      );
    }

    return (
      <Route key={`${path}:${index}`} {...route} path={path} render={render} />
    );
  }

  /**
   * Render method.
   *
   * @returns {?string} HTML markup or null.
   */
  render() {
    return (
      <div>
        {this.state.routes.map((route, index) =>
          Routes.renderRoute(Routes.getRouteProps(['/'], route), index),
        )}
      </div>
    );
  }
}
