'use strict';

if (process.env.REACT_APP_TARGET === 'client') {
  module.exports.Runtime = require('./Runtime.client').RuntimeClient;
} else {
  throw new Error('There is not any runtime for server');
}