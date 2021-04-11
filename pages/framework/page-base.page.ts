/**
 * This is the base class that all pages should inherit from.
 */
export abstract class PageBase {
  abstract get pageName(): string;
  public abstract isPageLoaded(): boolean;
}
