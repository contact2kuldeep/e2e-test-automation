import { utils } from 'utils/utils';
import { home } from 'pages/home.page';
import { addMessage } from 'utils/reporter/custom-reporter';

export function _click_on_google_apps_icon(
  homeObj: home,
) {
  addMessage({ title: 'Click on the apps icon : ', value: 'YES' }, true);
  utils.waitUntil(() => homeObj.appsIconVisible());
  homeObj.clickOnApps();
  return homeObj;
}

export function _performe_search(
  homeObj: home,
) {
  addMessage({ title: 'Performe search: ', value: 'YES' }, true);
  homeObj.clickOnSearchText();
  homeObj.enterSearchText("React");
  utils.waitUntil(() => homeObj.resultStatsVisible());
  return homeObj;
}