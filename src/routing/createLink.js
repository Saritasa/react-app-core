// @flow
import * as React from 'react';

import { Link } from './Link';
import { InjectedPath } from './InjectedPath';

type LinkPropsShouldBeMissed = { to: any };
type LinkProps = $Diff<React.ElementProps<typeof Link>, LinkPropsShouldBeMissed>;

export function createLink(to: string | InjectedPath) {
  const StaticLink = (props: LinkProps) => <Link {...props} to={to} />;

  return StaticLink;
}
