'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApplication = createApplication;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactRedux = require('react-redux');

var _reactRouterDom = require('react-router-dom');

var _routing = require('./routing');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Create React application.
 *
 * @param {class} Runtime - Runtime class.
 * @returns {React.Node} React application.
 */
function createApplication(Runtime) {
  var runtime = Runtime.getInstance();

  var Router = runtime.Router,
      store = runtime.store,
      routeStore = runtime.routeStore;


  return React.createElement(
    _reactRedux.Provider,
    { store: store },
    React.createElement(
      Router,
      null,
      React.createElement(_reactRouterDom.Route, {
        path: '/',
        render: function render(_ref) {
          var location = _ref.location;
          return React.createElement(_routing.Routes, { location: location, routeStore: routeStore });
        }
      })
    )
  );
}