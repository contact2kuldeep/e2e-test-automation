import { WebElement } from 'components/web-element';

export class Button extends WebElement {
  constructor(selector: string, parent?: WebElement) {
    super(selector, parent);
  }

  public click() {
    super.click();
  }
}
