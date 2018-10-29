// @flow
import * as React from "react";
import { Redirect as ReactRouterRedirect, withRouter } from "react-router-dom";

import {RedirectComponent} from "./RedirectComponent";

type RedirectProps = {
  ...$Exact<React.ElementProps<typeof ReactRouterRedirect>>,
  ...$Exact<
    React.ElementProps<$Call<typeof withRouter, React.ComponentType<*>>>
    >
};

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
    return (props: { [key: string]: mixed }) => (
      <RedirectComponent {...params} {...props} to={path} />
    );
  }

  /**
   * Render method.
   *
   * @returns {?string} HTML markup or null.
   */
  render() {
    return <RedirectComponent {...this.props} />
  }
}
