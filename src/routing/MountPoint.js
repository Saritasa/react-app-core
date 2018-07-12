// @flow
import * as React from 'react';
import {Route, withRouter} from "react-router-dom";

export const MountPoint = withRouter(class MountPointPlain extends React.PureComponent<*> {
  static getRouteProps(parentRoute: string, { childRoutes = [], path = '', ...route }: *) {
    return {
      ...route,
      childRoutes,
      path:`${parentRoute}/${path}`.replace(/\/+/g, '/'),
    };
  }

  render() {
    const { childRoutes, component: Component = React.Fragment, path, ...route } = this.props;
    if (route.render) {
      throw new Error('#render is not allowed property for route configuration.');
    }
    if (route.children) {
      throw new Error('#children is not allowed property for route configuration.');
    }

    const render = ({ match }) => {
      const content = childRoutes.map((route, index) => <MountPoint key={`${route.path}:${index}`} {...MountPointPlain.getRouteProps(match.url, route)} />);

      if (typeof Component === 'string' || Component === React.Fragment) {
        return <Component>{content}</Component>
      }

      return <Component match={match}>{content}</Component>
    };

    return <Route {...route} path={path} render={render} />;
  }
});
