import {Local} from "../helpers/Source0";
import AppScreen from './AppScreen';

/**
 * Provides for Screens.
 *
 * NewPage creates a private page and generates a signature for its structure.
 * SingletonScreen implements listButtons()
 */
export module Screens {

  import Source0 = Local.Source0;
  import XDuplications = Local.XDuplications;

  /**
   * Another singleton: used to get the signature of a page.
   *
   * It can also create a KnownPage from a hash-code.
   */
  export class NewPage {
    // static access only, except internally
    private constructor() {}

    public get radioButtons() {
      // reliable
      const v0 = browser.isAndroid ? '//*[@resource-id = "canvasm.myo2:id/radio"]'
        : '*//XCUIElementTypeButton';
      return $$(v0);
    }

    public get radioButton() {
      // unreliable - one screen misses all of them?
      const v0 = browser.isAndroid ? '*//android.widget.RadioButton' : '*//XCUIElementTypeButton';
      return $$(v0);
    }

    public get clickables() {
      // unreliable - one screen misses all of them?
      const v0 = browser.isAndroid ? '//*[@clickable = "true"]' : '*//XCUIElementTypeButton';
      return $$(v0);
    }

    public get textNonEmpty() {
      const v0 = browser.isAndroid ? '//*[@text != ""]' : '*//XCUIElementTypeStaticText';
      // reliable
      return $$(v0);
    }

    public get resourceId() {
      const v0 = browser.isAndroid ? '//*[@resource-id != ""]' : '*//XCUIElementTypeOther';
      // reliable
      return $$(v0);
    }

    public get editText() {
      const v0 = browser.isAndroid ? '*//android.widget.EditText' : '*//XCUIElementTypeTextField';
      // and on iOS XCUIElementTypeSecureTextField
      return $$(v0);
    }

    public get textView() {
      const v0 = browser.isAndroid ? '*//android.widget.TextView' : '*//XCUIElementTypeStaticText';
      // reliable
      return $$(v0);
    }

    public get drawerLayout() {
      const v0 = browser.isAndroid ? '*//androidx.drawerlayout.widget.DrawerLayout' :
        '*//XCUIElementTypeSegmentedControl';
      return $$(v0);
    }

    static async getSignature(name: string): Promise<string> {
      const v0 = await (new NewPage()).signature()
      return await Source0.instance.dump(v0.toString(), name)
    }

    async signature(): Promise<number[]> {
      const v0 = [
        this.radioButtons.length,
        this.radioButton.length,
        this.clickables.length,
        this.textNonEmpty.length,
        this.resourceId.length,
        this.editText.length,
        this.textView.length,
        this.drawerLayout.length
      ];

      let promises = v0.map(async v => {
        await v;
        return v
      });

      return await Promise.all(promises)
    }
  }

  /**
   * Another singleton, this is for Screen processing and is adapted to Android or iOS.
   *
   * This singleton has a private implementation hierarchy: Android or iOS
   *
   * It only implements listButtons() this is the method that implements clickables().
   */
  export class SingletonScreen extends AppScreen {
    constructor() {
      super("");
      SingletonScreen._instance = this
    }

    static _instance: SingletonScreen

    static get instance(): SingletonScreen {
      if (SingletonScreen._instance === undefined)
        SingletonScreen._instance = browser.isAndroid ? new AndroidScreen() : new iOSScreen()
      return SingletonScreen._instance
    }

    async listButtons(selector0: string = this.buttons): Promise<Map<string, WebdriverIO.Element>> {
      return new Map<string, WebdriverIO.Element>()
    }

    // Makes a string from null.
    public stringOrEmpty = (x: any) => (x != null) ? x : ""

    // Reduce two strings.
    public concatOrRight = (x: string, y: string) => (x.length > 0) ? `${x} ${y}` : y

    // join null and strings with coalesce separators
    public reducer = (r11: string[]) => r11.map((x) => this.stringOrEmpty(x)).reduce(this.concatOrRight, "")

    /**
     * Get a named attribute from a list of Element specified by the string selector.
     *
     * Note: this is inefficient. It could be given an ElementArray in place of the string selector0.
     * It is used for two purposes.
     *
     * @param selector0 this is a string to obtain an ElementArray
     * @param fld the name of the attribute to fetch.
     */
    async fetchElements(selector0: string, fld: string): Promise<string[]> {
      const r0 = await $$(selector0)
      const r10 = r0.map((x) => x.getAttribute(fld))
      return await Promise.all(r10).then((values) => values)
    }
  }

  /**
   * @TODO
   */
  class iOSScreen extends SingletonScreen {}

  /**
   * Implements listButtons() for Android.
   *
   * Android has a more complex page structure and slightly different attribute names.
   */
  class AndroidScreen extends SingletonScreen {

    /**
     * Find the text strings associated with a selector string.
     *
     * This is only needed on Android. The selector string is usually the clickable buttons string.
     *
     * First list the buttons, for those that have text or content-desc, no further processing is needed.
     * For those that do not, list all the children nodes and get their text/content-desc attributes. And finally
     * if no strings, give it a numbered string.
     *
     * It is possible to get the text of the child of a node that is clickable.
     *
     * $$('//*[@clickable = "true"]')[0].getAttribute("class")
     * 'androidx.appcompat.widget.LinearLayoutCompat'
     *
     * $$('//*[*\/@clickable = "true"]/*')[0].getAttribute("class")
     * 'android.widget.ImageView'
     * $$('//*[*\/@clickable = "true"]//*')[0].getAttribute("class")
     * ''
     *
     */
    override async listButtons(selector0: string = this.buttons): Promise<Map<string, WebdriverIO.Element>> {
      // * List the buttons.
      const t0 = await $$(selector0); // This is ElementArray, I can't find the type

      // * See what top-level text/desc is available.
      // Merge them together using a reduce function and prefix with the index+1
      const [t20, t21] = await Promise.all([this.fetchElements(selector0, "text"),
        this.fetchElements(selector0, "content-desc")])
      const u0 = [...Array(t0.length).keys()].map((i) =>
        [i + 1, [this.stringOrEmpty(t20[i]), this.stringOrEmpty(t21[i])].reduce(this.concatOrRight), t0[i]])

      // * Find those that have no text (zero length), get their indices and build a child node selector string
      // for each of them.
      const u1 = u0.filter((u) => u[1].length == 0).map((u) => u[0])
      const fToSelect = (i: number) => `(${selector0})[${i}]//*`
      const s0 = u1.map((u) => fToSelect(u))

      // For each of those search strings, get the text and content-desc and reduce it to one string.
      const p0 = s0.map(async (s) => {
        return await Promise.all([
          this.reducer(await this.fetchElements(s, "text")),
          this.reducer(await this.fetchElements(s, "content-desc"))])
      });
      const p1 = await Promise.all(p0)
      const p2 = p1.map((p) => p.reduce(this.concatOrRight).trim())

      // Put the elements p2 into u0 at the positions given in u1
      // augment with the button element too
      const idxes = [...Array(p2.length).keys()].map((i: number) => {
        const idx = u1[i] - 1;
        u0[idx] = [u1[i], p2[i], t0[i]];
        return i
      })

      // If strings are still blank, deploy a structured numbered string 00
      idxes.map((i) => {
        const u = u0[i];
        if (u[1].length == 0) {
          u[1] = u[0].toString().padStart(2, '0')
        } else {
          u[1] = u[1].substring(0, 40).trim()
        }
        u0[i] = u
      })

      // * Duplicate keys
      // Extract the strings to use as keys.
      const k0 = u0.map((u): string => u[1])

      if (XDuplications.hasDuplicates(k0)) {
        const dupes = XDuplications.findDuplicates(k0);
        let k1 = [...k0] // clone to update
        dupes.forEach((x) => {
          const dupe0 = new XDuplications(k1, x)
          k1 = dupe0.renamed // update
        });
        // And put the updated keys back into master collection
        [...Array(u0.length).keys()].forEach((i) => {
          u0[i][1] = k1[i]
        });
      }

      // Convert to a Map. Order is preserved by insertion
      const v2 = new Map<string, WebdriverIO.Element>(); // Iterable to IterableIterator mismatch so set by hand
      u0.forEach((u) => v2.set(u[1], u[2]))
      // this spots the duplicates too
      super.log.debug("listButtons: count: " + t0.length + "; " + v2.size + "; " + u0.length)

      return v2
    }
  }
}
