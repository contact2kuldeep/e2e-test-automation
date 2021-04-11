# e2e-test-automation

# e2e-test-automation: Based on webDriverIO 

## Installation

* Node is required
* `npm install`

## Webdriver Feature Execution

### Run tests from local machine on BrowserStack

* Firstly, enter your BrowserStack crendentials and the environment credentials in `wdio/e2e-auth.json`, then save the file locally.
* Secondly, enter a build name (`const build = XXXX;` ) in `wdio/browserstack.conf.js`, then save the file locally. Currently build name contains timestamp of the execution.
* Run `npm run start:browserstack` will run from local machine against the environment written in `package.json`
* You can also run specific feature file or a set of feature files as described below. ie. `npm run start:browserstack -- --spec gold`
* `IMPORTANT - `Do NOT commit these change, after running the tests, make sure you revert both files (`wdio/e2e-auth.json` and `wdio/browserstack.conf.js`)

`IMPORTANT - Only run the following localhost tests if you have access to VADX Git repo and able to run DX locally.`

#### Run tests against DX localhost

* `npm start` - runs all feature files against localhost on local Chrome browser

#### Run one specific feature file

* `npm start -- --spec ./features/points-plus-pay/max-passenger-DOM.feature.ts`

Note: You can also drag a file from the vscode sidebar into the terminal.

#### Run a set of feature files based on partial filename

* `npm start -- --spec gold` - runs all .feature.ts files with the text `gold` in the filename.

#### Run tests with BrowserStack against local DX environment (localhost:9500)

* Firstly download your `BrowserStackLocal` binary file from https://www.browserstack.com/local-testing#command-line
* Run `npm run start:bsConnect` and wait for it to start
* Then simply run `npm run start:bsLocalTest` to run all test on browserstack
* Additional parameters can be passed to the script similar to `npm start` (see above).

## Unit Testing

* `npm test` - runs all the test (.spec) files for unit testing

## Targetting an alternative URL

By default the feature tests execute against the localhost port 9500 (must be running as a seprate process).

* This can be configured in the 'baseUrl' property in ./wdio/base.conf.js.

The URl can be overridden for a specific test run via:

* `npm run start:dev` - runs the full feature suite agains the dev draft
* `npm run start:dx14` - runs the full feature suite against dx14
* `npm run start -- --baseUrl https://any-url-can-be-here/VADX/` (note the `--` to pass args to the underlying command)

Note: Do not add the trailing `#/` in the url.

## Stack

Built on the JavaScript stack using:

* [Typescript](https://www.typescriptlang.org/) - Typescript is a typed superset of JavasScript
* [WebdriverIO](http://webdriver.io/) - runs Chrome in automation mode
* [Jasmine](https://jasmine.github.io/) - test runner and assertion library
* [Mochaawesome Report Generator](http://webdriver.io/guide/reporters/mochawesome.html) - generates reports from Webdriver JSON output using a utility called marge

## Reporting

After running the tests Webdriver will generate a JSON file in the folder `report`.

Generating the HTML report requires an additional step:

* `npm run report` - this will convert the JSON file to a HTML report with mochawesome and marge.

## Continuous Integration

The project includes a GitLabCI configuration file (.gitlab-ci.yml) which demonstrates how the tests could be executed in a DevOps pipeline. The pipeline uses a Docker image containing Node and Chrome, which is then packaged with the test scripts as a Docker container. The contianer will initiate and run all the test scripts on AWS Fargate against BrowserStack. The file to build the Docker image is `(/packer/e2e.json)`. It runs the commands below:

| Commands | Description                                                           |
| -------- | --------------------------------------------------------------------- |
| files    | Copy all test scripts to a location in the image                      |
| env      | Runs ```export XXX=XXX...``` set environment variables from gitlab    |
| init     | Runs ```npm install``` to install node_modules                        |
| inject   | Runs ```npm run add-env-variables``` inject credentials               |
| headless | Run all tests in headless Chrome on multiple devices                  |
| report   | generates Mochaawesome HTML report and copy the file to AWS S3 bucket |

The Mochaawesome HTML report for each test run can be accessed with the link below within internal network:

http://va-vadx-dev.s3-website-ap-southeast-2.amazonaws.com/ribe-e2e-[CI_PIPELINE_ID].html

### View logs

1. Navigate to [ADFS](https://fs.virginaustralia.com/adfs/ls/IdpInitiatedSignOn.aspx)
2. Select `LogDNA` from the drop down list
3. Login using your normal AD account
4. Once logged in, select `RESPONSIVE IBE` on the left panel. There are 2 `views` for logs:

| Views                    | Description                                                                                                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ribe-e2e-dev             | All logs from e2e tests from the beginning (can be filtered via date/time using control at the bottom)                                                                 |
| ribe-report-notification | An alert has been configured in this view to send email notification to a list of developers and testers every time a test report has been uploaded sucessfully to S3. |

## Development

### Configuration

#### wdio (Webdriver.io) configuration

* Folder: ./config
* File: ./config/base.conf.js - base config file
* Other files will import the base.conf.js and can be used in npm scripts.

#### Typescript

* see `tsconfig.json`

#### TSLint

* see `tslint.json`

#### Prettier

* See the `prettier` key in package.json

### Naming Conventions

#### Files

* All files should be named with kebab-case - eg. `my-sweet-file.ts`

#### Variables

* `SOME_CONSTANT = "foo";`
  * Constants should be all caps with underscores
* `_I_want_this_to_be_rendered_as_a_sentence_today_with_Proper_Nouns = () => 'do stuff';`
  * Special case where we want to render the output in the test reporter and use a function name that reads better.
  * Really should be only used within the given, when, and, then calls within a feature file
  * Should be very descriptive and start with leading underscore.
* `someNormalFunction`
  * All functions should be camelCase (except for the above)
* `SomeEpicClass`
  * All classes should be UpperCamelCase
* `ESomeEnum`
  * When defining an Enum - start with captial E
* `ISomeInterface`
  * When defining an Interface - start with capital I

### VSCode

* Recommended editor is VSCode
* See ./vscode for browser configuration and recommended extensions

### Working on the code

#### Updating test automation

Take note when you have made changes to DX code below. Automation script need to be updated:
* ID's
* Class Names
* Re-arranging components
* Merging new Sabre white label code (ie. new DX version)

#### Workflow for updating automation script
1. Create sub-task from the original ticket
2. Detail the changes of DX code in the ticket
3. Create/update test automation scripts (or assign the sub-task to the Test Automation Developer in the team)


## Debugging

* Using [`browser.debug()`](https://webdriver.io/docs/api/browser/debug.html) webdriverio let's you put a special debug call anywhere in the test code. This will 'pause' the runner and turn the CLI into a REPL to explore what is happening.
* When the above debug is called, if you want the runner to continue simply type `.exit` into the terminal and it will go on.
* `console.log` is also useful and will log out to the terminal where your script is run.
* Watch the runner carefully, look at what happens in the logs and on the screen in what order.
* Sometimes it can help to 'slow' the network down, when the runner starts open the chrome dev tools and then on the network tab select a slower network speed.
