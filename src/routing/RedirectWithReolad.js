// @flow
import * as React from 'react';

type RedirectWithReoladProps = { to: string };

/**
 * Component performs redirect with page reloading.
 */
export class RedirectWithReolad extends React.PureComponent<RedirectWithReoladProps> {
  /**
   * Performs the redirect action.
   */
  componentDidMount() {
    window.location.href = this.props.to;
  }

  /**
   * Component does not render anything.
   *
   * @returns {null} Nothing.
   */
  render() {
    return null;
  }
}
