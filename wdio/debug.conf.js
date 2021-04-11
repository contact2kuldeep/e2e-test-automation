// adds hooks for taking snapshots
const base = require('./base.conf');

exports.config = {
  ...base.config,
  debug: true,
  execArgv: ['--inspect-brk=127.0.0.1:5859'],
};
