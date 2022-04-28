"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMiddlewareCreator = addMiddlewareCreator;
exports.getMiddlewareCreators = getMiddlewareCreators;
var middlewareCreators = [];

function addMiddlewareCreator(middlewareCreator) {
  middlewareCreators.push(middlewareCreator);
}

function getMiddlewareCreators() {
  return [].concat(middlewareCreators);
}