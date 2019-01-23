// @flow
import * as React from 'react';
import type { Match, Location } from 'react-router-dom';
import { NavLink as ReactRouterLink } from 'react-router-dom';

import { InjectedPath } from './InjectedPath';
import { getFullRoute } from './getFullRoute';
import { sanitizeProps } from './sanitizeProps';

type LinkProps = React.ElementProps<typeof ReactRouterLink>;
type LinkState = { injectedRoute: ?InjectedPath, to: string };

/**
 * Link class.
 */
export class Link extends React.PureComponent<LinkProps, LinkState> {
  static defaultProps = {
    isActive: (path: *, match: Match, location: Location) => !!(match || path === location.pathname),
  };

  state = { to: '', injectedRoute: null };

  /**
   * React event.
   * Invoked immediately after a component is mounted.
   */
  componentDidMount() {
    const { to } = this.props;

    if (to instanceof InjectedPath) {
      to.on(this.handlePathUpdate);
      this.handlePathUpdate();
    }
  }

  /**
   * React event.
   * Invoked immediately before a component is unmounted and destroyed.
   */
  componentWillUnmount() {
    const { to } = this.props;

    if (to instanceof InjectedPath) {
      to.off(this.handlePathUpdate);
    }
  }

  /**
   * Path update handler.
   */
  handlePathUpdate = () => {
    const { to } = this.props;

    if (!(to instanceof InjectedPath)) {
      throw new Error('Update injected route without injected route.');
    }

    this.setState(() => ({
      to: to.getPath(),
    }));
  };

  /**
   * Render method.
   *
   * @returns {?string} HTML markup or null.
   */
  render() {
    const { to: propTo, ...rest } = this.props;
    const { to: stateTo } = this.state;

    if (propTo instanceof InjectedPath) {
      return (
        <ReactRouterLink
          {...sanitizeProps(stateTo, rest)}
          to={getFullRoute(stateTo, rest)}
        />
      );
    }

    if (typeof propTo === 'string') {
      return (
        <ReactRouterLink
          {...sanitizeProps(propTo, rest)}
          to={getFullRoute(propTo, rest)}
        />
      );
    }

    return <ReactRouterLink {...rest} to={propTo} />;
  }
}
