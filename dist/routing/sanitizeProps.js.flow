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

  const withoutAppliedParams = (routeParts: any).reduce((props, part) => {
    if (!part.startsWith(':')) {
      return props;
    }

    const paramName = part.slice(1);

    const { [paramName]: _, ...nextProps } = props;

    return nextProps;
  }, props);

  return removePropsEndsWithId(withoutAppliedParams);
}

function removePropsEndsWithId(props) {
  return Object.keys(props)
    .filter(key => !key.endsWith('Id'))
    .reduce((accum, key) => ({ ...accum, [key]: props[key] }), {});
}
