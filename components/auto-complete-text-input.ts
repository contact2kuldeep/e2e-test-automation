import { TextInput } from 'components/text-input';
import { WebElement } from 'components/web-element';
import Keys from 'utils/special-keys';

export class AutoCompleteTextInput extends TextInput {
  constructor(selector: string, parent?: WebElement) {
    super(selector, parent);
  }

  set text(text: string) {
    super.text = text;
    this.keys(Keys.ENTER);
  }
  set entertext(text: string) {
    super.text = text;
    // this.keys(Keys.TAB);
  }
}
