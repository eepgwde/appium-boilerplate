import logger from '@wdio/logger'
import {Local} from "../helpers/Source0";

import log0 = Local.log;
import Actions0 = Local.Actions0;

/**
 * Base class of all Screen (or Page Object Model) objects.
 *
 * This provides two methods to detect screen presence.
 *
 * The Page Object Model has the requirement that the AppScreen holds a single definitive `selector`
 * that must be present for that screen. This is implemented here with the selector member.
 * The waitFor methods below provide that means of interaction.
 */
export default class AppScreen {
  public selector: string = "";
  /**
   * A common logger for all the pages.
   *
   * JavaScript does not support super.log to the field member so a property is used.
   */
  private log_ = logger('AppScreen')

  constructor(selector: string) {
    this.selector = selector;
  }

  static get reset0(): boolean {
    // Record the state of reset
    let reset1 = ('fullReset' in browser.capabilities) ? browser.capabilities.fullReset : undefined
    if (reset1 === undefined)
      reset1 = ('noReset' in browser.capabilities) ? !browser.capabilities.noReset : undefined

    if (typeof reset1 != 'boolean') throw 'No reset state defined';

    // @ts-ignore
    return reset1
  }

  get log() {
    return this.log_
  }

  /**
   * Selector string this should get all the clickable buttons.
   *
   * This is used by SingletonScreen::listButtons()
   *
   * Android is problematic: a clickable element can either have some text, or it will have indexed
   * components that contain text. A text field can also be text or content-desc.
   *
   * @private
   */
  protected get buttons() {
    const v0 = browser.isAndroid ? '//*[@clickable = "true"]' :
      'XCUIElementTypeButton';
    return v0;
  }

  /**
   * Simplifies text search.
   *
   * Actually implements {@code //*\/type0[contains(@attr0, 'value0')]}
   * Compatible with iosPredicate() below.
   *
   * The XPath is not case-insensitive and only version 2.0 of XPath supports a lower-case
   * method.
   *
   * @param type0 is an element name, an android.widget.TextView or similar classname, also '*'
   * @param attr0 text name of an attribute.
   * @param value0 case-sensitive text
   */
  static andPredicate(type0: string, attr0: string, value0: string): string {
    const v0 = `//*/${type0}[contains(@${attr0},"${value0}")]`
    return v0
  }

  /**
   * Simplifies text search.
   *
   * XPath selection does not work well
   * iOS XCUITest needs another method, see WebDriverIO https://webdriver.io/docs/selectors/
   *
   * The selector is not case-insensitive.
   *
   * @param type0 is an element name, an android.widget.TextView or similar classname, also '*'
   * @param attr0 text name of an attribute.
   * @param value0 case-sensitive text
   */
  static iosPredicate(type0: string, attr0: string, value0: string): string {
    const v0 = `type == '${type0}' && ${attr0} CONTAINS '${value0}'`
    return `-ios predicate string:${v0}`
  }

  static async perform0(s: string) {
    const actions0 = new Actions0(s)
    await browser.performActions(actions0.value)
    return s
  }

  /**
   * Uses appium W3C touchAction()
   */
  static async move0(upward: boolean = true, band0: number = 40) {
    const band = (0.5 * band0 >= 50) ? 50 : band0;
    const startPercentage = Math.trunc(50 - 0.5 * band);
    const endPercentage = Math.trunc(50 + 0.5 * band);
    const anchorPercentage = band;

    const {width, height} = await browser.getWindowSize();
    const anchor = Math.trunc(width * anchorPercentage / 100);
    const startPoint = Math.trunc(height * startPercentage / 100);
    const endPoint = Math.trunc(height * endPercentage / 100);

    const actions1 = [
      {
        action: 'press',
        x: anchor,
        y: (upward ? endPoint : startPoint),
      },
      {
        action: 'wait',
        ms: 100,
      },
      {
        action: 'moveTo',
        x: anchor,
        y: (upward ? startPoint : endPoint),
      },
      'release',
    ];

    log0.debug(JSON.stringify(actions1))
    // @ts-ignore
    await driver.touchAction(actions1);
  }

  /**
   * Non-fatal timeout
   *
   * Wait until a button appears and return false if not present.
   */
  async waitForIsShown(isShown = true, timeout: number = 8000,
                       selector0: string = this.selector): Promise<boolean | void> {
    if (selector0.length == 0) return false

    let r0
    let r1

    try {
      r0 = $(selector0).waitForDisplayed({
        timeout: timeout,
        reverse: !isShown
      });
      this.log.info("selector: " + this.selector)
      await r0
      r1 = true
    } catch (error) {
      this.log.warn(error)
      r1 = false
    }
    return r1
  }

  /**
   * Fail if the defining element does not appear.
   *
   * @param {boolean} isShown
   */
  async waitForIsShownFatal(isShown = true, timeout = 8000,
                            selector0: string = this.selector): Promise<boolean | void> {
    if (selector0.length == 0) throw 'invalid selector'

    let v1 = $(selector0).waitForDisplayed({
      timeout: timeout,
      interval: 300,
      reverse: !isShown,
    });
    return v1;
  }

  /**
   * Check for the existence of a selector without errors.
   *
   * This searches for the list and returns whether the length is greater than 0.
   *
   * This should be safer than testing the `Element.error` property of an Element.
   *
   * @param selector0
   * @protected
   */
  protected async safely(selector0: string = ""): Promise<boolean> {
    let count = 0
    try {
      const v0 = await $$(selector0)
      count = v0.length
    } catch (err) {
      this.log.debug("safely: " + err)
    }

    return count > 0
  }

}
