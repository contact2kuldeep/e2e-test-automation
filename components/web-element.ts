import { DATA_TRANSLATION } from 'constants/data-attributes';
import { getNumberValue } from 'utils/get-number-value';

/**
 * This class is a place holder for extra functions that we want to
 * provide to all web elements
 */
export class WebElement {
  /**
   * This class wraps the selector $ to provide a custom WebElement.
   * Sometimes Selenium can be unstable so it is import to adhere to DRY
   * principle so we always have a single point where we can apply work arounds.
   */
  private get we(): WebdriverIO.Element {
    if (this.freezeSelector && this._we !== undefined) {
      return this._we;
    }

    if (this.parent) {
      this._we = this.parent.we.$(this.selector);
    } else {
      this._we = $(this.selector);
    }

    /*
     * Auto scroll to the leaf element so if the testing is trying to validate
     * values of elements not currently visible, it'll be scroll into view and
     * is visible on the screen recording.
     *
     * Note:
     * Don't autoscroll to the parents, otherwise the screen will jump around
     * a lot and it's not clear with element the test is trying to validate.
     */
    if (this.autoScroll && this.isLeaf && this._we.isExisting()) {
      this.scrollIntoViewRaw(true);
    }
    return this._we;
  }

  public get html(): string {
    return this.we.getHTML(false);
  }
  public get numericValue() {
    return getNumberValue(this.text);
  }

  public get size(): { width: number; height: number } {
    return this.we.getSize();
  }

  public get text(): string {
    return this.we.getText();
  }

  /**
   * Returns this element if it contains the data-translation attribute
   * or the FIRST translation element found within this element.
   */
  public get translationElement(): WebElement {
    const translationFromElement = this.getAttribute(DATA_TRANSLATION);
    if (translationFromElement) {
      return this;
    }
    return new WebElement(`.//*[@${DATA_TRANSLATION}]`, this);
  }

  /**
   * Returns the translation key from this element or the first translation
   * element if found.
   */
  public get translationKeys(): string | null {
    return this.translationElement.getAttribute(DATA_TRANSLATION);
  }

  /**
   * Use this when you need to validate an element that won't be selected again
   * using the same selector, e.g. selecting first available seat will make it
   * unavailable, so the selector will select the next available seat, making
   * change detection based on seat become unavailable impossible.
   *
   * IMPORTANT: make sure the page finished rendering before freezing the
   * selector, otherwise _we may point to an element that no longer exists
   */
  public freezeSelector = false;

  public autoScroll: boolean = true;

  private _we?: WebdriverIO.Element;

  private pauseBeforeClick = 1000;
  private isLeaf = true;

  constructor(
    protected selector: string,
    protected parent?: WebElement,
    autoScroll?: boolean,
  ) {
    if (parent) {
      parent.isLeaf = false;
    }
    if (autoScroll !== undefined) {
      this.autoScroll = autoScroll;
    }
  }

  public click() {
    if (this.autoScroll) {
      this.scrollIntoView();
    }
    browser.pause(this.pauseBeforeClick);
    this.we.click();
    browser.pause(500);
  }

  public findElements(selector: string) {
    return this.we.$$(selector);
  }

  public getAttribute(attributeName: string) {
    return this.we.getAttribute(attributeName);
  }

  public getLocation(axis: 'x' | 'y') {
    return this.we.getLocation(axis);
  }

  public getValue() {
    return this.we.getValue();
  }

  public isEnabled() {
    return this.we.isEnabled();
  }

  public isExisting(): boolean {
    try {
      return this.we.isExisting();
    } catch {
      return false;
    }
  }

  public isSelected() {
    return this.we.isSelected();
  }

  public isVisible(): boolean {
    try {
      return this.we.isDisplayed();
    } catch {
      return false;
    }
  }

  public keys(keys: string) {
    this.we.click(); // ensure the element becomes active (is focused)
    browser.keys(keys); // type the keys provided
  }

  public setPauseBeforeClick(waitTime: number) {
    this.pauseBeforeClick = waitTime;
    return this;
  }

  public setValue(value: string | number | boolean | object | any[]) {
    return this.we.setValue(value);
  }

  public scrollIntoView() {
    this.scrollIntoViewRaw();
  }

  public waitForDisplayed() {
    return this.we.waitForDisplayed();
  }

  /**
   * Enables us to override the behaviour of the scrolling, this is to
   * add work arounds.
   * We scroll to the 'centre' so that items are not scrolled to under
   * the header and hence not clickable.
   */
  private scrollIntoViewRaw(useRawWebElement?: boolean) {
    // if (useRawWebElement && this._we) {
    //   this._we.scrollIntoView({ block: 'center' });
    // } else {
    //   this.we.scrollIntoView({ block: 'center' });
    // }
    // browser.pause(100);

    // [wdio v5] - revise scrolling override as may no longer be needed
    const { x, y } = ((useRawWebElement
      ? /* used to scroll element into view when accessed
         * so we get better screen recording
         */
        this._we!.getLocation()
      : this.we.getLocation()) as any) as {
      x: number;
      y: number;
    };
    // if ((browser.desiredCapabilities as any).browser === 'IE') {
    //   // need to scroll to y then scroll to x for it to work in IE
    //   browser.execute(`window.scrollTo(0,${y - height / 2})`);
    //   browser.execute(`window.scrollTo(${x - width / 2},0)`);
    // } else {
    browser.execute(
      (x, y) => {
        window.scrollTo(x - window.innerWidth / 2, y - window.innerHeight / 2);
      },
      x,
      y,
    );
    // }
    browser.pause(100);
  }
}
