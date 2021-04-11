// adds hooks for taking snapshots
const base = require('./base.conf');

const iPhone5SE = 'window-size=320,568';

const userAgent = [
  'user-agent=',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) ',
  'AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 ',
  'Mobile / 9A334 Safari / 7534.48.3',
].join('');

exports.config = {
  ...base.config,
  host: '0.0.0.0',
  port: 4444,
  path: '/wd/hub',
  services: ['selenium-standalone', 'typescript'],
  maxInstances: 8,
  capabilities: [
    {
      browserName: 'chrome',
      chromeOptions: {
        args: [iPhone5SE, 'use-mobile-user-agent', userAgent],
      },
    },
  ],
  reporters: ['spec'],
};
