// @flow
import * as React from 'react';
import { Route, withRouter } from 'react-router-dom';

/**
 * MountPointPlain class wrapped withRouter.
 */
export const MountPoint = withRouter(
  /**
   * MountPointPlain class.
   */
  class MountPointPlain extends React.PureComponent<*> {
    /**
     * Returns object with path.
     *
     * @param {string} parentRoute - Parent route.
     * @param {Array} childRoutes - Child routes.
     * @param {string} path - Path.
     * @param {*} route - Rest props.
     * @returns {{childRoutes: Array, path: string}} Route props.
     */
    static getRouteProps(
      parentRoute: string,
      { childRoutes = [], path = '', ...route }: *,
    ) {
      return {
        ...route,
        childRoutes,
        path: `${parentRoute}/${path}`.replace(/\/+/g, '/'),
      };
    }

    /**
     * Render method.
     *
     * @returns {?string} HTML markup or null.
     */
    render() {
      const {
        childRoutes,
        component: Component = React.Fragment,
        path,
        ...route
      } = this.props;

      if (route.render) {
        throw new Error(
          '#render is not allowed property for route configuration.',
        );
      }

      if (route.children) {
        throw new Error(
          '#children is not allowed property for route configuration.',
        );
      }

      /**
       * Function returns component for render.
       *
       * @param {Object} match - Router object with url.
       * @returns {React.Node} React component.
       */
      const render = ({ match }) => {
        const content = childRoutes.map((childRoute, i) => (
          <MountPoint
            key={`${childRoute.path}:${i}`}
            {...MountPointPlain.getRouteProps(match.path, childRoute)}
          />
        ));

        if (typeof Component === 'string' || Component === React.Fragment) {
          return <Component>{content}</Component>;
        }

        return <Component match={match}>{content}</Component>;
      };

      return <Route {...route} path={path} render={render} />;
    }
  },
);
