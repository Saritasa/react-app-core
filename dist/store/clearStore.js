'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearStore = clearStore;

var _clearStoreActionType = require('./clearStoreActionType');

function clearStore() {
  return { type: _clearStoreActionType.CLEAR_STORE };
}