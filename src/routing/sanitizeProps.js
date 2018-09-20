// @flow
/**
 * Get props without param route.
 *
 * @param {string} route - Route to component.
 * @param {Object} props - Params.
 * @returns {string} String with path divided by /.
 */
export function sanitizeProps(route: string, props: { [key: string]: any }) {
  const routeParts = route.split('/');

  return (routeParts: any)
    .reduce((props, part) => {
      if (!part.startsWith(':')) {
        return props;
      }

      const paramName = part.slice(1);

      const { [paramName]: _, ...nextProps } = props;

      return nextProps;
    }, props);
}
