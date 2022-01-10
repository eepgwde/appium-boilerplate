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
    private constructor() {
    }

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
   * Accumulate a sum in an array, starting from 1
   *
   * for a0 = Array(3).fill(1), this yields b0 as 1, 2, 3
   * `const b0 = a0.reduce(accumulate, []);`
   */
  const accumulate = (r: number[], c: number, i: number): number[] => {
    r.push((r[i - 1] || 0) + c)
    return r
  }

  // Makes a string from null.
  const stringOrEmpty = (x: any) => (x != null) ? x : ""

  // If the string is null or zero-length, return the default.
  //
  // There is a mistake with this, the value may not be something that supports length.
  const stringOrDefault = (value: any, default0: string = ""): string =>
    (stringOrEmpty(value).length > 0) ? value : default0

  // join two strings with space if the first is non-empty
  const concatOrRight = (x: string, y: string) => (x.length > 0) ? `${x} ${y}` : y

  // for an array of null/strings, make the nulls empty strings and then join
  const reducer = (r11: any[]) => r11.map((x) => stringOrEmpty(x)).reduce(concatOrRight, "")

  // Transpose columns to rows
  //
  // This is a difficult implementation to understand. It makes use of a feature of map() that provides the index.
  // It is used here, just for the index of the item in the row.
  // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
  const transpose = (matrix: any[][]) => {
    const x0 = matrix.reduce((prev, next) =>
      next.map((item, i) => (prev[i] || []).concat(next[i])),
      []);
    return x0
  }

  /**
   * Prepends the elements of the list with the element's index in the list.
   *
   * This is the native version.
   * @param list an array
   * @param offset array indexing starts at 0 by default, other systems may use 1.
   */
  const indexed0 = (list: any[], offset: number = 0) => list.map( (item:any, i:number) => [ i+offset, item])

  /**
   * Prepends the elements of the list with the element's index in the list.
   *
   * See indexed0 for the native trick. This is a column join.
   *
   * @param list
   */
  const indexed = (list: any[], offset: number = 0) => {
    // Make an array of length, and make it an incremental sequence
    const i0 = Array(list.length).fill(1)
    const i1 = i0.reduce(accumulate, [])
    const i2 = i1
      .map((i: number) => i - 1) // so that it starts from 0
      .map((i: number) => i + offset) // so that it starts from offset

    // prepend and transpose
    return transpose([i2, list])
  }

  /**
   * Curries an accumulator function, it starts from c0.
   *
   * This curried version can support string as well as number.
   *
   * `const fb = makeAccumulator('b')`
   *
   * for a0 = Array('3).fill('a'), this yields b0 as 'ba', 'baa', 'baaa'
   * `const b0 = a0.reduce(fb, []);`
   *
   * Note: not used.
   */
  const makeAccumulator = (c0: any = 0) => (r: any[], c: any, i: any) => {
    r.push((r[i - 1] || c0) + c)
    return r
  }

  /**
   * Create a sequence of padded strings starting from 0.
   * @param length
   * @param padN
   */
  const indexedStrings = (length: number, padN: number = 2): string[] => {
    const i0s = Array(length).fill(1)
    const i1s = i0s.reduce(accumulate, [])
    const i2s = i1s.map((i: number) => (i-1).toString().padStart(padN, '0'))
    return i2s
  }

  /**
   * Empty strings are replaced with defaults.
   *
   * This uses a column join.
   * @param texts is an array of strings
   * @param fDefaults is a function, usually indexedStrings()
   */
  const addDefaults = (texts: string[], fDefaults: (length: number, padN?: number) => string[]) => {
    const i0s = fDefaults(texts.length)
    const texts2 = transpose([texts, i0s])
    return texts2.map((t: string[]) => stringOrDefault(t[0], t[1]))
  }

  /**
   * This singleton is adapted to Android or iOS. It is used for processing the Screen objects.
   *
   * It has a private implementation hierarchy: Android or iOS. The field members of the singleton base class
   * are specific to Android or iOS, so there should be no need to have field members
   *
   * It inherits from AppScreen just for the buttons member.
   *
   * It only implements listButtons() this is the method that implements clickables().
   */
  export class SingletonScreen extends AppScreen {
    private readonly tags_: string[];

    constructor(tags: string[]) {
      super("");
      SingletonScreen._instance = this
      this.tags_ = tags
    }

    static _instance: SingletonScreen

    static get instance(): SingletonScreen {
      if (SingletonScreen._instance === undefined)
        SingletonScreen._instance = browser.isAndroid ? new AndroidScreen() : new iOSScreen()
      return SingletonScreen._instance
    }

    get tags(): string[] {
      return this.tags_;
    }

    /**
     * Get a named attribute from a list of Element specified by the string selector.
     *
     * Note: this is inefficient. It could be given an ElementArray in place of the string selector0.
     * It is used for two purposes.
     *
     * @param selector0 this is a string to obtain an ElementArray
     * @param attr the name of the attribute to fetch.
     */
    async fetchElements(selector0: string, attr: string): Promise<string[]> {
      const r0 = await $$(selector0)
      const r10 = r0.map((x) => x.getAttribute(attr))
      const v0 = await Promise.all(r10).then((values) => values)
      return v0.map((v) => stringOrEmpty(v))
    }

    // For each of the attribute names, fetch the elements given by selector0 and get the attributes.
    async collate(selector0: string, attrs: string[]): Promise<string[]> {
      // Columns of attributes for rows of element
      const c0 = attrs.map((attr) => this.fetchElements(selector0, attr))
      const c1 = await Promise.all(c0)
      const c2 = transpose(c1)
      const c3 = c2.map((c) => c.reduce(concatOrRight))
      return c3
    }

    /**
     * Find the text strings associated with a selector string.
     *
     * First list the buttons at top-level and call specialize(). If there is some text to describe the button then
     * no further processing is needed by specialize().
     *
     * After specialize(), if there is still no string, then give it a numbered string.
     * After that, rename any duplicates. Then construct a map for the caller.
     *
     * @param selector0
     * @protected
     */
    public async listButtons(selector0: string = this.buttons): Promise<Map<string, WebdriverIO.Element>> {
      const t0 = await $$(selector0);

      // texts0: text fields for buttons so far
      let texts0 = await this.collate(selector0, this.tags)

      // the specialization usually deals with blank strings, but it might do other formatting, so don't test
      // for empty fields at this level.
      texts0 = await this.specialize(texts0, selector0)

      // Any remaining blanks we fill with a padded string
      const texts2 = addDefaults(texts0, indexedStrings)

      // Duplicate keys
      const texts4 = XDuplications.makeUnique(texts2)

      // Convert to a Map.
      const texts5 = transpose([texts4, t0])
      const v2 = await this.listButtons0() // provides an empty map
      texts5.forEach((t) => v2.set(t[0], t[1]))
      // this spots the duplicates
      super.log.debug("listButtons: count: " + t0.length + "; " + v2.size + "; " + texts5.length)

      return v2
    }

    protected async specialize(texts: string[], selector0: string): Promise<string[]> {
      return texts
    }

    // Basic return value
    protected async listButtons0(): Promise<Map<string, WebdriverIO.Element>> {
      return new Map<string, WebdriverIO.Element>()
    }
  }

  /**
   * Implements listButtons for iOS.
   *
   * There is only one level for iOS, so no specialization.
   */
  class iOSScreen extends SingletonScreen {
    constructor() {
      super(['name', 'label'])
    }
  }

  /**
   * Implements listButtons() for Android.
   *
   * Android has a more complex page structure and slightly different attribute names.
   */
  class AndroidScreen extends SingletonScreen {
    constructor() {
      super(['text', 'content-desc'])
    }

    /**
     * Android searches the descendants of each button for some text.
     *
     * In terms of data operations, this process can be thought of as a join using a "coalesce" operator.
     *
     * List all the descendants of each button in turn, and get the text attributes, this uses an indexed selector.
     * For the first button, because the XPath indexing starts from 1, is: (//*[@clickable='true'])[1]//*
     * This will, in parentheses, select all the clickables, take the first and then search for all the descendants
     * of that.
     *
     * To check this, using the findElements operator, $$(), the indexing is from zero.
     *
     * $$('//*[@clickable = "true"]')[0].getAttribute("class")
     * 'androidx.appcompat.widget.LinearLayoutCompat'
     *
     * Immediate children
     * $$('//*[@clickable = "true"]/*')[0].getAttribute("class")
     * 'android.widget.ImageView'
     *
     * All descendants
     * $$('//*[@clickable = "true"]//*')[0].getAttribute("class")
     * 'android.widget.ImageView'
     *
     * It might be possible to detail the XPath with this (//*[@clickable='true'])[1]//*[@text!='']
     * There would then not be any null entries. I haven't tried this.
     *
     * This implementation uses the functional programming paradigm. A transpose method is used, it may
     * not be very performant.
     *
     * The function that is needed is a column join. To do that, transpose([col1, col2]) gives a sequence of rows where
     * row[i] = [ col1[i], col2[i] ]
     * @param texts
     * @param selector0
     */
    override async specialize(texts: string[], selector0: string): Promise<string[]> {
      // Only process the buttons that don't have text, because it is computationally expensive to process them all.
      // This means we have to process a subset, and return their values to the set.
      // This will need some indirect addressing, so we capture the indices of the blank texts in xtext1idx.

      // I use this functional pair for pipelines when list processing: it makes the implementation more efficient
      let out0 = null; let in0 = null

      out0 = indexed(texts, 0); in0 = out0 // index the texts by row number.
      // find the blanks, and remember their indices for the join later.
      const xtext1idx = in0.filter((t) => t[1].length == 0).map((t) => t[0])
      // if there are no empty text strings, no need to do anything
      if (xtext1idx.length == 0) return texts

      // create the indexed XPath selector, add one to the index in xtext1idx because XPath indexes from 1 not 0.
      const fToSelect = (i: number) => `(${selector0})[${i}]//*`
      out0 = xtext1idx.map((i: number) => fToSelect(i + 1)); in0 = out0

      // For each of those search strings, fetch and collate the attributes and reduce them to one string.
      out0 = in0.map(async (selector0: string) => await this.collate(selector0, this.tags)); in0 = out0
      out0 = await Promise.all(in0); in0 = out0
      out0 = in0.map((x: string[]) => reducer(x).trim()); in0 = out0

      // Put the new values back, using indirect addressing into the array.
      // Use a column join to map indices to the text strings.
      // And iterate through those to assign the new values to the original.
      out0 = transpose([xtext1idx, in0]); in0 = out0

      in0.forEach((t) => {
        const idx = t[0]
        texts[idx] = t[1]
      })

      return texts
    }
  }
}
