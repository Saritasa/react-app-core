// @flow
import * as React from 'react';

type RedirectWithReloadProps = { to: string };

/**
 * Component performs redirect with page reloading.
 */
export class RedirectWithReload extends React.PureComponent<RedirectWithReloadProps> {
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
