const path = require('path');
const fs = require('fs-extra');
const GIFEncoder = require('gifencoder');
const PNG = require('png-js');

class ScreenRecorder {
  constructor(sessionID, screenshotPath) {
    this.sessionID = sessionID;
    this.directoryName = path.join(screenshotPath, sessionID);
    fs.mkdir(this.directoryName);
    this.startRecording();
    browser.on('result', test => this.screenshotOnSeleniumError(this, test));
  }

  // use self inside this function because it's called by browser process
  screenshotOnSeleniumError(self, test) {
    if (test && test.body && test.body.type === 'RuntimeError') {
      self.error = true;
      self.screenshotPromise = new Promise(finishedTakingScreenshot => {
        Promise.resolve(
          browser.saveScreenshot(path.join(self.directoryName, 'Error.png')),
        )
          .then(() => finishedTakingScreenshot())
          .catch(self.handlePromiseError);
      });
    }
  }

  startRecording() {
    this.recording = true;
    this.recordingPromise = new Promise(async finishedRecording => {
      let screenshotPromise;

      while (this.recording) {
        screenshotPromise = this.recordScreenshot();
        await this.delay(500);
      }

      await screenshotPromise.then(() => {
        this.writeStream.end();
      });

      finishedRecording();
    }).catch(this.handlePromiseError);
  }

  handlePromiseError(e) {
    // tslint:disable-next-line:no-console
    console.log(e);
  }

  recordScreenshot() {
    return new Promise(finishedTakingScreenshot => {
      Promise.resolve(browser.saveScreenshot())
        .then(screenshot => finishedTakingScreenshot(screenshot))
        .catch(this.handlePromiseError);
    })
      .then(screenshot => {
        if (this.writeStream === undefined) {
          this.writeStream = this.createWriteStream(screenshot);
        }
        return this.streamScreenshotToFile(screenshot);
      })
      .catch(this.handlePromiseError);
  }

  createWriteStream(screenshot) {
    let img = new PNG(screenshot);
    let encoder = new GIFEncoder(img.width, img.height);

    let writeStream = encoder.createWriteStream({
      repeat: -1,
      delay: 100,
      quality: 500,
    });

    writeStream.pipe(
      fs.createWriteStream(path.join(this.directoryName, 'recording.gif')),
    );
    return writeStream;
  }

  streamScreenshotToFile(screenshot) {
    return new Promise(finishedStreaming => {
      new PNG(screenshot).decode(pixelBuffer => {
        this.writeStream.write(pixelBuffer, () => {
          finishedStreaming();
        });
      });
    }).catch(this.handlePromiseError);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)).catch(
      this.handlePromiseError,
    );
  }

  async endRecording(passed) {
    this.recording = false;
    await this.recordingPromise;
    await this.screenshotPromise;
    if (passed) {
      fs.removeSync(this.directoryName);
    }
  }
}

module.exports = ScreenRecorder;
