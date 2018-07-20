// @flow
import * as React from 'react';

import { Link } from './Link';
import { InjectedPath } from './InjectedPath';

type LinkProps = { ...$Exact<React.ElementProps<typeof Link>>, to: empty };

/**
 * Returns function that create static link with your path.
 *
 * @param {string} to - Path for link.
 * @returns {function(LinkProps): *} Function that create static link.
 */
export function createLink(to: string | InjectedPath) {
  /**
   * Returns React Link component.
   *
   * @param {Object} props - Props for link.
   * @returns {React.Node} React Link component.
   */
  const StaticLink = (props: LinkProps) => <Link {...props} to={to} />;

  return StaticLink;
}
