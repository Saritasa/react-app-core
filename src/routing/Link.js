// @flow
import * as React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

import { InjectedPath } from './InjectedPath';
import { getFullRoute } from './getFullRoute';

type LinkProps = React.ElementProps<typeof ReactRouterLink>;
type LinkState = { injectedRoute: ?InjectedPath, to: string };

export class Link extends React.PureComponent<LinkProps, LinkState> {
  state = { to: '', injectedRoute: null };

  componentDidMount() {
    const { to } = this.props;

    if (to instanceof InjectedPath) {
      to.on(this.handlePathUpdate);
      this.handlePathUpdate();
    }
  }

  componentWillUnmount() {
    const { to } = this.props;

    if (to instanceof InjectedPath) {
      to.off(this.handlePathUpdate);
    }
  }

  handlePathUpdate = () => {
    const { to } = this.props;

    if (!(to instanceof InjectedPath)) {
      throw new Error('Update injected route without injected route.');
    }

    this.setState(() => ({
      to: to.getPath(),
    }));
  };

  render() {
    const { to: propTo, ...rest } = this.props;
    const { to: stateTo } = this.state;

    if (propTo instanceof InjectedPath) {
      return <ReactRouterLink {...rest} to={getFullRoute(stateTo, rest)} />;
    }

    if (typeof propTo === 'string') {
      return <ReactRouterLink {...rest} to={getFullRoute(propTo, rest)} />;
    }

    return <ReactRouterLink {...rest} to={propTo} />;
  }
}
