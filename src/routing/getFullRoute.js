// @flow
const ALLOWED_TYPES = ['string', 'number'];

export function getFullRoute(route: string, params: { [string]: any }) {
  const routeParts = route.split('/');

  return routeParts
    .map(part => {
      if (!part.startsWith(':')) {
        return part;
      }

      const paramName = part.slice(1);

      if (!(paramName in params)) {
        throw new Error(
          `Missed parameter with name "${paramName}" in params for route="${route}". Params are ${JSON.stringify(
            params,
            null,
            2,
          )}`,
        );
      }

      const paramType = typeof params[paramName];

      if (!ALLOWED_TYPES.includes(paramType)) {
        throw new Error(`${paramName} has invalid type (${paramType}).
Allowed types are: ${ALLOWED_TYPES.join(', ')}.
You try to getFullRoute() for route="${route}".
Params are ${JSON.stringify(params, null, 2)}.`);
      }

      return params[paramName];
    })
    .join('/');
}
