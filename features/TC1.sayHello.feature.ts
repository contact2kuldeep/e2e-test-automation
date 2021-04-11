import { _opening_webpage } from 'common-steps/common-steps';
import { _click_on_google_apps_icon, _performe_search } from 'common-steps/google-search';
import { Given } from 'utils/gherkin';


describe('TC1: Validate Google search is working', () => {
  it('by searching a keyword and validate some keypoints on the page', () => {
    Given(_opening_webpage)
       .Then(_click_on_google_apps_icon)
       .Then(_performe_search);
  });
});
