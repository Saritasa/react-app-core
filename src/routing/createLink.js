// @flow
import * as React from 'react';

import { Link } from "./Link";
import {InjectedPath} from "./InjectedPath";

type LinkProps = { ...$Exact<React.ElementProps<typeof Link>>, to: empty };

export function createLink(to: string | InjectedPath) {
  const StaticLink = (props: LinkProps) => (<Link {...props} to={to} />);

  return StaticLink;
}
