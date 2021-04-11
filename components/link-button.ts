import { WebElement } from 'components/web-element';

export class LinkButton extends WebElement {
  constructor(selector: string, parent?: WebElement) {
    super(selector, parent);
  }

  public click() {
    super.click();
  }

  public isEnabled(): boolean {
    if (this.getAttribute('class').indexOf('disable') < 0) {
      return true;
    }
    return false;
  }
}
