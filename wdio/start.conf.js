// adds hooks for taking snapshots
const base = require('./base.conf');
const ScreenRecorder = require('../utils/reporter/screen-recorder');

exports.config = {
  ...base.config,
  // beforeTest,
  // afterTest,
};

// var screenRecorder;

// function beforeTest() {
//   screenRecorder = new ScreenRecorder(
//     browser.sessionId,
//     exports.config.reporterOptions.mochawesomeOpts.screenshotPath,
//   );
// }

// async function afterTest(test) {
//   await screenRecorder.endRecording(test.passed);
// }
