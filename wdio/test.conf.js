// runs the .spec files for unit testing only
const base = require('./base.conf');

exports.config = {
  ...base.config,
  debug: false,
  reporters: ['spec'], // no reporting needed - unit tests only
  specs: ['**/*.spec.ts']
};
