const { config } = require('./base.conf');
// const build = 'VAS ';
 const build = 'E2E build ' + new Date().toLocaleString();

const e2eAuth = require('./e2e-auth.json');

delete config.runner;
delete config.port;
delete config.path;

exports.config = {
  ...config,
  user: e2eAuth.browserStack.username,
  key: e2eAuth.browserStack.accessKey,
  services: ['typescript'],
  deprecationWarnings: false,
  maxInstances: 15, //match the max instance the broswerstack account can handle

  capabilities: [
    {
      browserName: 'Chrome',
      browser_version: '89.0',
      os: 'Windows',
      os_version: '10',
      resolution: '1920x1080',
    },
    {
      browserName: 'Firefox',
      browser_version: '69.0',
      os: 'Windows',
      os_version: '10',
      resolution: '1920x1080',
    },
    {
      browserName: 'Chrome',
      browser_version: '75.0',
      os: 'OS X',
      os_version: 'Mojave',
      resolution: '1920x1080',
    },
    {
      os_version : '14',
      device : 'iPhone XS',
      real_mobile : "true",
      browserName : "iPhone"
    },
    {
      os_version : '11.0',
      device : 'Samsung Galaxy S21',
      real_mobile : "true",
      browserName : "Android"
    }

  ].map(cap => ({
    ...cap,
    // common capability settings
    'browserstack.geoLocation': 'AU', // to simulate the geo loation 
    project: 'e2e Test',
    build,
    'browserstack.networkLogs': 'true',
    'browserstack.console': 'errors',
    'browserstack.debug': true,
  })),
  beforeTest,
  after: undefined,
};

function beforeTest() {
  // const uname = e2eAuth.vasTestAutoEnvironment.username;
  // const pass = e2eAuth.vasTestAutoEnvironment.password;
  // const url = "https://"+uname+":"+pass+"@test.google.com/";
  // browser.url(url);
}
