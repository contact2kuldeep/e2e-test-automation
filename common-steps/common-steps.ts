// import { vasflightsCalendarPage } from 'pages/vas-flights-calendar.page';
// import { convertToParameterisedStep } from 'utils/gherkin';
import { home } from 'pages/home.page';
import { addMessage } from 'utils/reporter/custom-reporter';

export function _opening_webpage() {
  const urlRoot = browser.options.baseUrl;
  if (urlRoot == null) {
    throw new Error('baseUrl should be set in wdio.conf.js');
  }
  browser.url(urlRoot);
  addMessage({ title: 'URL: ', value: urlRoot }, true);
  browser.pause(1000);
  return { context: { urlRoot }, result: new home() };
}
