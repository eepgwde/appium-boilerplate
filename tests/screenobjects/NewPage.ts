import {Local} from "../helpers/Source0";

const fs = require('fs');
const tmp = require('tmp');
const path = require('path');

// I can't find this
// @ts-ignore
import PropertiesReader = require('properties-reader');
import AppScreen from './AppScreen';
import logger from "@wdio/logger";

/**
 * Provides for Screens.
 *
 * NewPage is a factory that produces KnownPage.
 */
export module Screens {

  import Source0 = Local.Source0;
  const log = logger('Screens')

  /**
   * resources files Bean for an Android page from Appium.
   *
   * @TODO This is no longer needed.
   *
   * This uses the output from _desc.resources made by click.xslt.
   *
   * In the resources files, each element is addressed as: clk.text.<node-id>.<node> ,
   * or txt.text.<node-id>.<node>
   * So I split on node-id.
   * This is using the clicks.xslt transform using Saxon. It has the buttons on the screen as
   * clk.text.<node-id> under that there is txt.text.
   *
   * Each <node-id> is a screen element that is clickable. TextView ImageView Layout and others are their Element types.
   */
  export class KnownPage {
    public readonly hashCode: string = "";
    // public resources: typeof resourcesReader;
    public readonly propsFile: string;
    protected resources: PropertiesReader;

    constructor(hashCode: string, propsFile: string) {
      this.propsFile = propsFile
      this.hashCode = hashCode

      if (typeof propsFile == 'string' && propsFile.length > 0) {
        this.resources = PropertiesReader(propsFile)
        this.hashCode = this.resources.get("hashCode")
      }
    }

    /**
     * From the page at the server. XPath selector for clickable = true.
     *
     * We should have the same number of clickables as unique node-id in the resources file. This becomes
     * sections().
     */
    public get clickables() {
      const v0 = browser.isAndroid ? '//*[@clickable = "true"]' :
        '*//XCUIElementTypeButton';
      return $$(v0);
    }

    // The clickables from the resources file
    public get textsR() {
      return this.items_()
    }

    /**
     * Split the resources file into sections.
     *
     * Usually, the sections are the node-id of the resources file.
     * This returns a list of node-id as hexadecimal string. Monotonically increasing in a weird way.
     * The resources.each function has to use a side-effect to laod the array.
     * @protected
     */
    protected sectionate() {
      var sections: string[] = [""];
      this.resources.each((key: string, value: string) => {
        const section = key.split(".")[2]
        // ignore the header
        if (typeof section == 'string') {
          if (!sections.includes(section)) {
            sections.push(section)
          }
        }
      })
      return sections
    }

    // This is not used, but explains how the text and desc filter works.
    protected ftags(part: string): string[] {
      const t0 = [`clk.text.${part}`, `clk.desc.${part}`, `txt.text.${part}`, `txt.desc.${part}`]
      return t0
    }

    /**
     * Get some features from the properties file.
     * @param filter0
     * @protected
     */
    protected items_(filter0?: (x: string) => boolean): Map<string, string> {
      if (filter0 == undefined) {
        filter0 = (x) => {
          return x == "text" || x == "desc"
        }
      }

      log.info(this.resources.get("hashCode"))
      log.info(this.resources.length)

      const sections = this.sectionate();

      // const idxes = [...Array(40).keys()].map(v => (v + 1).toString().padStart(2, '0'))

      const props = this.resources.getAllProperties()

      const keys = Object.keys(props)

      // get the third element of a.b.c
      // with that, do a join for .b being text or desc.
      // and get the value, remove empties
      const kvs = keys.filter(k => k.split(".").length > 3).map(k => [k.split(".")[2], k])
      const kvs1 = kvs.map(x => [x[0], x[1], x[1].split(".")[1]])
        .filter(x => (x[2] == "text" || x[2] == "desc"))
        .map(x => [x[0], x[1]]).map(x => [x[0], this.resources.get(x[1])])
        .filter(x => x[1].length > 0)
      // sort on the first field.
      const kvs2 = kvs1.sort(function (a, b) {
        return a[0].localeCompare(b[0])
      });
      // Turn that into a map
      const kvs3 = Object.fromEntries(kvs2)
      const kvs4 = new Map(Object.entries(kvs3))

      // Create some names from numbers
      // map each section to 01 .. 99
      const idxes1 = [...Array(sections.length).keys()]
      const sections1 = idxes1.map(i => [sections[i], (i + 1).toString().padStart(2, '0')])
      const sections2 = Object.fromEntries(sections1)
      const sections3 = new Map(Object.entries(sections2))

      // Finally, join the text/desc with the numbers.
      const map0 = new Map()
      for (const [key, value] of sections3) {
        // @ts-ignore
        map0.set(key, value.concat(" : " + kvs4.get(key)))
      }
      return map0
    }

  }

  /**
   * Another singleton: used to get the signature of a page.
   *
   * It can also create a KnownPage from a hash-code.
   */
  export class NewPage {
    private static page_: Screens.NewPage;
    private static resources_: Map<string, string> = new Map<string, string>();

    private static known_ = new Map<string, KnownPage>()

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

    static setUp() {
      // This feature is not used at the moment.
      const pathsR = path.join(process.cwd(), 'tests', 'resources',
        browser.isAndroid ? 'android' : 'ios')
      NewPage.initialize(pathsR);
    }

    public static pageOf(hash0: string, fn: string = ""): KnownPage {
      return NewPage.known_.get(hash0) ?? NewPage.maker(hash0, fn)
    }

    static async getSignature(name: string): Promise<KnownPage> {
      const v0 = await (new NewPage()).signature()

      const hash0 = await Source0.instance.dump(v0.toString(), name)
      const fn = NewPage.resources_.get(hash0) ?? ""

      const pg = NewPage.pageOf(hash0, fn)
      return pg
    }

    static resources(): Map<string, string> {
      return NewPage.resources_
    }

    // their hashCode.
    static async initialize(rpath: string) {
      if (!fs.existsSync(rpath)) return

      const files = fs.readdirSync(rpath, (err: any) => {
        log.warn(err)
      });
      if (typeof files == undefined) return
      if (files.length == 0) return

      const files1 = files.filter((fn: string) => fn.endsWith('_desc.properties')).map((fn: string) => path.join(rpath, fn))
      let values = files1.map((fn: string) => [PropertiesReader(fn).get('hashCode'), fn])
      // convert an array to a map
      NewPage.resources_ = new Map(values)
    }

    private static maker(hash0: string, fn: string): KnownPage {
      const pg1 = new KnownPage(hash0, fn)
      NewPage.known_.set(hash0, pg1)
      return pg1
    }

    // Resources path
    // If there are files _desc.resources in the directory load them into a Map against

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

      const v1 = await Promise.all(promises)
      return v1
    }
  }

  /**
   * Another singleton, this is for Screen processing and is adapted to Android or iOS.
   *
   * This singleton has a private implementation hierarchy.
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

  }

  class iOSScreen extends SingletonScreen {
  }

  /**
   * Helper class to rename duplicate elements.
   */
  class XList {
    readonly ss: string[];
    readonly s: string;
    indices: number[]

    constructor(ss: string[], s: string) {
      this.ss = ss
      this.indices = []
      this.s = s
    }

    indicesOf() {
      let idx = this.ss.lastIndexOf(this.s);
      const i0s = []
      while (idx != -1) {
        i0s.push(idx)
        idx = (idx > 0 ? this.ss.lastIndexOf(this.s, idx - 1) : -1);
      }
      this.indices = i0s.reverse()
    }

    get renamed () : string[] {
      this.indicesOf()
      if (this.indices.length == 0) return this.ss

      // drop the first element same as this.s, get the range of the remaining indices
      // generate some replacements
      const toChgIdx = [...this.indices].splice(1)
      const idxes = [...Array(toChgIdx.length).keys()]
      const s1s = idxes.map( (i) => `${this.s}(${i+1})`)

      // clone the elements then replace the duplicates with the renamed
      const nss = [...this.ss]
      idxes.forEach( (i) => {
        const idx = toChgIdx[i]
        nss[idx] = s1s[i]
      })

      return nss
    }

    static findDuplicates = (k0: string[]) =>
      k0.filter((item: string, index: number) => k0.indexOf(item) !== index)

    static hasDuplicates = (k0: string[]) => (new Set(k0)).size !== k0.length
  }

  class AndroidScreen extends SingletonScreen {

    async joiner0(t0: any[], fld: string) {
      const t10 = t0.map((x) => x.getAttribute(fld))
      const t20 = await Promise.all(t10).then((values) => values)
      return t20
    }

    async joiner1(s0: string, fld: string): Promise<string> {
      const r0 = await $$(s0)
      const r10 = r0.map((x) => x.getAttribute(fld))
      const r11 = await Promise.all(r10).then((values) => values)
      return r11.map((x) => this.f0(x)).reduce(this.f1, "")
    }

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
      const [t20, t21] = await Promise.all([this.joiner0(t0, "text"), this.joiner0(t0, "content-desc")])
      const u0 = [...Array(t0.length).keys()].map((i) =>
        [i + 1, [this.f0(t20[i]), this.f0(t21[i])].reduce(this.f1), t0[i]])

      // * Find those that have no text (zero length), get their indices and build a child node selector string
      const u1 = u0.filter((u) => u[1].length == 0).map((u) => u[0])
      const f2 = (i: number) => `(${selector0})[${i}]//*`
      const s0 = u1.map((u) => f2(u))

      // For each of those search strings, get the text and content-desc and reduce it to one string.
      const p0 = s0.map(async (s) => {
        return await Promise.all([this.joiner1(s, "text"), this.joiner1(s, "content-desc")])
      });
      const p1 = await Promise.all(p0)
      const p2 = p1.map((p) => p.reduce(this.f1))

      // Put the elements p2 into u0 at the positions given in u1
      const idxs = [...Array(p2.length).keys()].map((i: number) => {
        const idx = u1[i] - 1;
        u0[idx] = [u1[i], p2[i], t0[i]];
        return i
      })

      // If any are still blank use a string like 00
      idxs.map((i) => {
        const u = u0[i];
        if (u[1].length == 0) {
          u[1] = u[0].toString().padStart(2, '0')
        } else {
          u[1] = u[1].trim()
        }
        u0[i] = u
      })

      // Duplicate keys

      const k0 = u0.map( (u): string => u[1].trim())

      if (XList.hasDuplicates(k0)) {
        // then this lists duplicates
        const dupes = XList.findDuplicates(k0);
        let k1 = [...k0]
        dupes.forEach( (x) => {
          const dupe0 = new XList(k1, x)
          k1 = dupe0.renamed
        });
        [...Array(u0.length).keys()].forEach( (i) => {
          u0[i][1] = k1[i]
        });
      }

      // Convert to a Map. Order is preserved in the insertion order.
      const v2 = new Map<string, WebdriverIO.Element>(); // Iterable to IterableIterator mismatch so set by hand?
      u0.forEach( (u) => v2.set(u[1], u[2]))
      super.log.info("clickables: count: " + t0.length + "; " + v2.size + "; " + u0.length)

      return v2
    }

    // Makes a string from null.
    private f0 = (x: any) => (x != null) ? x : ""

    // Reduce two strings.
    private f1 = (x: string, y: string) => (x.length > 0) ? `${x} ${y}` : y
  }

}
