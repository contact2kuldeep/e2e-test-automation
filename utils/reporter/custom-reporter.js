// This code is copied and modified from:
// tslint:disable-next-line: max-line-length
// https://github.com/fijijavis/wdio-mochawesome-reporter/blob/master/src/index.js

const WDIOReporter = require('@wdio/reporter').default;
const Suite = require('./suite');
const Stats = require('./stats');
const Test = require('./test');

class CustomReporter extends WDIOReporter {
  constructor(options) {
    super(options);
  }

  onRunnerStart(runner) {
    this.runner = runner;
    this.config = runner.config;
    this.sanitizedCaps = runner.sanitizedCapabilities;
    this.sessionId = runner.sessionId;
    // mochawesome requires this root suite for HTML report generation to work properly
    this.results = {
      stats: new Stats(runner.start),
      suites: new Suite(true, { title: '' }),
      copyrightYear: new Date().getFullYear(),
    };
  }

  onSuiteStart(suite) {
    this.currSuite = new Suite(false, suite, this.sanitizedCaps);
    this.results.stats.incrementSuites();
  }

  onTestStart(test) {
    this.currTest = new Test(test, this.currSuite.uuid, this.runner);
    CustomReporter.currTest = this.currTest; // va-changes - added static reference
    // this.currTest.addSessionContext(this.sessionId);
  }

  onTestSkip(test) {
    this.currTest = new Test(test, this.currSuite.uuid, this.runner);
    CustomReporter.currTest = this.currTest; // va-changes - added static reference
    // this.currTest.addSessionContext(this.sessionId);
  }

  onAfterCommand(cmd) {
    const isScreenshotEndpoint = /\/session\/[^/]*\/screenshot/;
    if (isScreenshotEndpoint.test(cmd.endpoint) && cmd.result.value) {
      this.currTest.addScreenshotContext(cmd.result.value);
    }
  }

  onTestEnd(test) {
    this.currTest.duration = test._duration;
    this.currTest.updateResult(test);
    this.currTest.context = JSON.stringify(this.currTest.context);
    this.currSuite.addTest(this.currTest);
    this.results.stats.incrementTests(this.currTest);
  }

  onSuiteEnd(suite) {
    this.currSuite.duration = suite.duration;
    this.results.suites.addSuite(this.currSuite);
  }

  onRunnerEnd(runner) {
    this.results.stats.end = runner.end;
    this.results.stats.duration = runner.duration;
    this.write(JSON.stringify(this.results));
  }

  /* va-changes START - send message to report process to add context.
   * Called by test process. */
  static addMessage(message, moveToTop) {
    CustomReporter.currTest.addMessage({
      value: message,
      moveToTop: moveToTop === undefined ? false : moveToTop,
    });
  }
  /* va-changes END */
}

module.exports = CustomReporter;
