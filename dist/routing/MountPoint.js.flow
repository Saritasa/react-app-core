// @flow
import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

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
     * @param {Array<string>} parentRoutes - Parent route.
     * @param {Array} childRoutes - Child routes.
     * @param {string} path - Path.
     * @param {*} route - Rest props.
     * @returns {{childRoutes: Array, path: string}} Route props.
     */
    static getRouteProps(
      parentRoutes,
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
     * Render method.
     *
     * @returns {?string} HTML markup or null.
     */
    render() {
      const {
        childRoutes,
        component: Component = React.Fragment,
        path,
        isSwitch,
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
            key={`${childRoute.path || '---'}:${i}-${match.path}`}
            {...MountPointPlain.getRouteProps(
              [].concat(match.path),
              childRoute,
            )}
          />
        ));

        if (typeof Component === 'string' || Component === React.Fragment) {
          return <Component>{content}</Component>;
        }

        return <Component match={match}>{content}</Component>;
      };

      if (isSwitch) {
        if (!childRoutes) {
          throw new Error("Can't use Route.isSwitch without childRoutes.");
        }

        if (typeof Component === 'string' || Component === React.Fragment) {
          return (
            <Route
              path={path}
              render={({ match }) => (
                <Component>
                  <Switch {...route}>
                    {childRoutes.map((route, index) => (
                      <MountPoint
                        key={`${route.path}:${index}-${match.path}`}
                        {...MountPointPlain.getRouteProps(
                          [].concat(match.path),
                          route,
                        )}
                      />
                    ))}
                  </Switch>
                </Component>
              )}
            />
          );
        }

        return (
          <Route
            path={path}
            render={({ match }) => (
              <Component match={match}>
                <Switch {...route}>
                  {childRoutes.map((route, index) => (
                    <MountPoint
                      key={`${route.path}:${index}-${match.path}`}
                      {...MountPointPlain.getRouteProps(
                        [].concat(match.path),
                        route,
                      )}
                    />
                  ))}
                </Switch>
              </Component>
            )}
          />
        );
      }

      return <Route {...route} path={path} render={render} />;
    }
  },
);
