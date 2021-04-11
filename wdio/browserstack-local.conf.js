// adds hooks for taking snapshots
const base = require('./base.conf');

exports.config = {
  ...base.config,
  port: '',
  path: '',
  user: '',
  key: '',
  services: ['typescript'],
  maxInstances: 2, //match the max instance the broswerstack account can handle
  // supportedBrowsers from base.conf.js
  capabilities: base.supportedBrowsers.map(cap => ({
    ...cap,
    'browserstack.local': 'true',
  })),
  // beforeTest,
};

function beforeTest() {
  // browser.url('localhost:1080/').refresh();
}
