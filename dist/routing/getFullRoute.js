'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.getFullRoute = getFullRoute;
var ALLOWED_TYPES = ['string', 'number'];

/**
 * Get full route.
 *
 * @param {string} route - Route to component.
 * @param {Object} params - Params.
 * @returns {string} String with path divided by /.
 */
function getFullRoute(route, params) {
  var routeParts = route.split('/');

  return routeParts.map(function (part) {
    if (!part.startsWith(':')) {
      return part;
    }

    var paramName = part.slice(1);

    if (!(paramName in params)) {
      throw new Error('Missed parameter with name "' + paramName + '" in params for route="' + route + '". Params\' keys are ' + Object.keys(params).join(', '));
    }

    var paramType = _typeof(params[paramName]);

    if (!ALLOWED_TYPES.includes(paramType)) {
      throw new Error(paramName + ' has invalid type (' + paramType + ').\nAllowed types are: ' + ALLOWED_TYPES.join(', ') + '.\nYou try to getFullRoute() for route="' + route + '".\nParams are ' + JSON.stringify(params, null, 2) + '.');
    }

    return params[paramName];
  }).join('/');
}