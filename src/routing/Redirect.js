// @flow
import * as React from 'react';
import { Redirect as ReactRouterRedirect } from 'react-router-dom';

import { InjectedPath } from './InjectedPath';
import { getFullRoute } from './getFullRoute';

type RedirectProps = React.ElementProps<typeof ReactRouterRedirect>;

/**
 * Redirect class.
 */
export class Redirect extends React.PureComponent<RedirectProps> {
  /**
   * @param path
   * @param params
   * @returns {*} Component that will be rendered into Redirect component.
   */
  static of(path: string, params: { [key: string]: mixed } = {}) {
    return (props: { [key: string]: mixed }) => <Redirect {...params} {...props} to={path}/>
  }

  /**
   * Render method.
   *
   * @returns {?string} HTML markup or null.
   */
  render() {
    const { to, ...rest } = this.props;

    if (to instanceof InjectedPath) {
      return <ReactRouterRedirect {...rest} to={getFullRoute(to, rest)} />;
    }

    if (typeof to === 'string') {
      return <ReactRouterRedirect {...rest} to={getFullRoute(to, rest)} />;
    }

    return <ReactRouterRedirect {...rest} to={to} />;
  }
}
