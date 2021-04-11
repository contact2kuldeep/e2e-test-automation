import { PageBase } from 'pages/framework/page-base.page';
import { Link } from 'components/link';
import { AutoCompleteTextInput } from 'components/auto-complete-text-input';
import { WebElement } from 'components/web-element';

export class home extends PageBase {
  public isPageLoaded(): boolean {
    throw new Error('Method not implemented.');
  }
  get pageName(): string {
    return 'Google Home Page';
  }

  public appsIconVisible() {
    return this.appIconSelector.isVisible();
  }
  public clickOnApps() {
    this.appIconSelector.click();
  }

  public youTubeIconVisible() {
    return this.youTubeIconSelector.isVisible();
  }
  public clickOnYouTubeIcon() {
    this.youTubeIconSelector.click();
  }
  public clickOnSearchText() {
    this.searchTextSelector.click();
  }
  public enterSearchText(setSerchString: string) {
    this.searchTextSelector.text = setSerchString;
  }

  public resultStatsVisible() {
    return this.resultStatsSelector.isVisible();
  }

  /** Selectors **/
  private get appIconSelector() {
    return new Link('a[class="gb_D"]');
  }
  private get youTubeIconSelector() {
    return new Link('a[class="NQV3m"]');
  }
  private get searchTextSelector() {
    return new AutoCompleteTextInput(".gLFyf");
  }

  private get resultStatsSelector() {
    return new WebElement('#result-stats');
  }

}
