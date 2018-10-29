// @flow
import * as React from "react";
import { Redirect as ReactRouterRedirect, withRouter } from "react-router-dom";

import { InjectedPath } from "./InjectedPath";
import { getFullRoute } from "./getFullRoute";
import { sanitizeProps } from "./sanitizeProps";

type RedirectProps = {
  ...$Exact<React.ElementProps<typeof ReactRouterRedirect>>,
  ...$Exact<
    React.ElementProps<$Call<typeof withRouter, React.ComponentType<*>>>
    >
};

/**
 * Redirect class.
 */
class RedirectComponentPure extends React.PureComponent<RedirectProps> {

  /**
   * Skips redirect in case of target url is the same as current.
   *
   * @param {string} to Target url.
   * @returns {React.Node|null}
   */
  redirectOrSkip(to) {
    const { to: _, match, location, ...rest } = this.props;

    if (typeof window !== 'undefined') {
      if (window.location.pathname === to) {
        console.warn(`Can't redirect from ${window.location.pathname} to ${to}. Do nothing.`);
        return null;
      }
    }

    return (
      <ReactRouterRedirect
        {...sanitizeProps(to, rest)}
        to={to}
      />
    );
  }

  /**
   * Render method.
   *
   * @returns {?string} HTML markup or null.
   */
  render() {
    const { to, match, location, ...rest } = this.props;

    if (to instanceof InjectedPath || typeof to ==='string') {
      return this.redirectOrSkip(getFullRoute(to, rest))
    }

    return <ReactRouterRedirect {...rest} to={to} />;
  }
}

export const RedirectComponent = withRouter(RedirectComponentPure);
