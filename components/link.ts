import { WebElement } from 'components/web-element';

export class Link extends WebElement {
  constructor(selector: string, parent?: WebElement) {
    super(selector, parent);
  }

  public click() {
    super.click();
  }
}
