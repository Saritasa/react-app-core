// @flow
if (process.env.TARGET === 'client') {
  module.exports.Runtime = require('./Runtime.client').RuntimeClient;
} else {
  throw new Error('There is not any runtime for server');
}
