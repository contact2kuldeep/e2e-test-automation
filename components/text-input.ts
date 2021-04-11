import { WebElement } from 'components/web-element';

/**
 * This class is a place holder for extra functions that we want to
 * provide to all text input elements. e.g. setText(text) and clearText()
 */
export class TextInput extends WebElement {
  set text(text: string) {
    this.waitForDisplayed();
    this.freezeSelector = true;
    this.click();
    // this.clearText();
    this.setValue(text);
    this.freezeSelector = false;
    browser.pause(50);
  }

  get text() {
    return this.getValue();
  }

  constructor(selector: string, parent?: WebElement) {
    super(selector, parent);
    this.setPauseBeforeClick(0);
  }

  // public keys(keys: string) {
  //   this.keys(keys);
  // }

  // public clearText() {
  //   this.keys([Keys.HOME, Keys.SHIFT, Keys.END, Keys.BACKSPACE, Keys.SHIFT]);
  // }
}
