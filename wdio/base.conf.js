const chalk = require('chalk');
const CustomReporter = require('../utils/reporter/custom-reporter');

const IPHONE_5_SE = 'window-size=320,568';

const USER_AGENT = [
  'user-agent=',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) ',
  'AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 ',
  'Mobile / 9A334 Safari / 7534.48.3',
].join('');

const config = {
  /**
   * Runner Configuration
   * ====================
   * WebdriverIO allows it to run your tests in arbitrary locations
   * (e.g. locally or on a remote machine).
   *
   */
  runner: 'local',
  port: 9515, // required for chrome
  path: '/', // required for chrome

  /**
   * Specify Test Files
   * ==================
   * Define which test specs should run. The pattern is relative to the
   * directory from which `wdio` was called. Notice that, if you are calling
   * `wdio` from an NPM script (see https://docs.npmjs.com/cli/run-script)
   * then the current working directory is where your package.json resides,
   * so `wdio` will be called from there.
   * Note: VA uses the term 'features' to align with the gherkin terminology.
   */
  specs: ['**/*.feature.ts'],

  /**
   * Capabilities
   * ============
   * Define your capabilities here. WebdriverIO can run multiple capabilities at
   * the same time. Depending on the number of capabilities, WebdriverIO
   * launches several test sessions. Within your capabilities you can overwrite
   * the spec and exclude options in order to group specific specs to a specific
   * capability.
   *
   * First, you can define how many instances should be started at the same
   * time. Let's say you have 3 different capabilities (Chrome, Firefox, and
   * Safari) and you have set maxInstances to 1; wdio will spawn 3 processes.
   * Therefore, if you have 10 spec files and you set maxInstances to 10, all
   * spec files will get tested at the same time and 30 processes will get
   * spawned. The property handles how many capabilities from the same test
   * should run tests.
   */
  capabilities: [
    {
      browserName: 'chrome',
      // 'goog:chromeOptions': {
      //   args: [IPHONE_5_SE, 'use-mobile-user-agent', USER_AGENT],
      // },
      /**
       * maxInstances can get overwritten per capability. So if you have an
       * in-house Selenium grid with only 5 firefox instances available you
       * can make sure that not more than 5 instances get started at a time.
       */
      maxInstances: 1, // set to 1 to avoid random "connect ECONNREFUSED" issue
    },
  ],

  /** Test Configurations
   * ===================
   * Define all options that are relevant for the WebdriverIO instance here
   *
   * Level of logging verbosity: trace | debug | info | warn | error | silent
   */
  logLevel: 'silent',

  /**
   * If you only want to run your tests until a specific amount of tests have
   * failed use bail (default is 0 - don't bail, run all tests).
   */
  bail: 0,

  /**
   * Set a base URL in order to shorten url command calls. If your `url`
   * parameter starts with `/`, the base url gets prepended, not including the
   * path portion of your baseUrl. If your `url` parameter starts without a
   * scheme or `/` (like `some/path`), the base url gets prepended directly.
   */
  baseUrl: 'https://www.google.com.au',

  /** Default timeout for all waitFor* commands.
   * (eg. awaiting page item to load or element to become visible)
   */
  waitforTimeout: 5 * 60 * 1000, // 5 minutes

  /** Default timeout in milliseconds for request if Selenium Grid doesn't
   * send response
   */
  connectionRetryTimeout: 35 * 60 * 1000, // 35 mins

  /* Default request retries count */
  connectionRetryCount: 3,

  /**
   * Test runner services
   * ====================
   * Services take over a specific job you don't want to take care of.
   * They enhance your test setup with almost no effort. Unlike plugins,
   * they don't add new commands.
   * Instead, they hook themselves up into the test process.
   */
  services: ['chromedriver', 'typescript'],

  /**
   * Framework
   * =========
   * Framework you want to run your specs with. The following are supported:
   * Mocha, Jasmine, and Cucumber
   * see also: https://webdriver.io/docs/frameworks.html
   * Make sure you have the wdio adapter package for the specific framework
   * installed before running any tests.
   */
  framework: 'jasmine',
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,

  /**
   * Reporters
   * =========
   * Test reporter for stdout. The only one supported by default is 'dot'
   * see also: https://webdriver.io/docs/dot-reporter.html
   */
  // reporters: [CustomReporter],
  reporters: [
    [
      CustomReporter,
      {
        outputDir: './report/',
      },
    ],
  ],
  /**
   * Reporter Options
   * ================
   * Custom - added for use by custom reporter
   */
  // reporterOptions: {
  //   mochawesomeOpts: {
  //     outputDir: 'report',
  //     includeScreenshots: true,
  //     screenshotPath: 'report/snapshots/',
  //   },
  // },

  /** Options to be passed to Jasmine. */
  jasmineNodeOpts: {
    /** Jasmine default timeout */
    defaultTimeoutInterval: 35 * 60 * 1000, // 35 mins
  },

  /**
   * Hooks
   * =====
   * WebdriverIO provides several hooks you can use to interfere with the test
   * process in order to enhance it and to build services around it. You can
   * either apply a single function or an array of methods to it. If one of them
   * returns with a promise, WebdriverIO will wait until that promise got
   * resolved to continue.
   */

  /**
   * before (hook)
   * =============
   * Gets executed before test execution begins. At this point you can
   * access to all global variables like `browser`.
   * It is the perfect place to define custom commands.
   */
  before() {
    require('source-map-support/register');
    require('ts-node/register');
    require('tsconfig-paths/register');
  },

  /**
   * beforeTest (hook)
   * =================
   * Function to be executed before a test (in Mocha/Jasmine) or a step
   * (in Cucumber) starts.
   */
  beforeTest(test) {
    // const fileName = test.file.split('/').pop() || '';

    // tslint:disable-next-line:no-console - used for reporting
    // console.log(
    //   chalk.default`
    //   {green RUN Suite: ${fileName}}
    //   {green RUN Test: ${test.fullName}}
    //   `,
    // );
  },

  /**
   * after (hook)
   * =============
   * Gets executed after all tests are done. You still have access to all
   * global variables from the test.
   * VA Note - this should be set on 'local' testing only and ensures the
   * browser stays open for a short time after the test fails to investigate.
   */
  after(/** 0 - test pass, 1 - test fail */ result) {
    if (result === 1) {
      browser.debug();
    }
  },
};

exports.config = config;
